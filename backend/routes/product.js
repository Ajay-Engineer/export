const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'upload', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to handle async route errors
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new product
router.post('/', upload.array('images', 5), asyncHandler(async (req, res) => {
  console.log('Received request body:', req.body);
  
  // Extract all fields from request body
  const { 
    title,
    description,
    shortDescription,
    category,
    subcategory,
    price,
    features,
    specifications,
    stock
  } = req.body;

  // Log received data
  console.log('Received fields:', {
    title,
    description,
    shortDescription,
    category
  });

  // Validate required fields
  const requiredFields = ['title', 'category', 'shortDescription', 'description'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: `Missing required fields: ${missingFields.join(', ')}`,
      receivedFields: req.body
    });
  }

  // Generate slug from title
  const generatedSlug = slugify(title, { lower: true, strict: true });

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required' });
  }

  // Create slug from title
  const slug = slugify(title, { lower: true, strict: true });

  // Process specifications if provided as a string
  let specs = {};
  if (specifications) {
    try {
      specs = JSON.parse(specifications);
    } catch (error) {
      console.error('Error parsing specifications:', error);
    }
  }

  // Save image paths
  const imagePaths = req.files.map(file => `/upload/products/${file.filename}`);

  // Parse JSON strings for arrays and objects
  let parsedBenefits = [];
  let parsedPackaging = [];
  let parsedCertifications = [];
  let parsedFaqs = [];
  let parsedRelated = [];

  try {
    if (req.body.benefits) parsedBenefits = JSON.parse(req.body.benefits);
    if (req.body.packaging) parsedPackaging = JSON.parse(req.body.packaging);
    if (req.body.certifications) parsedCertifications = JSON.parse(req.body.certifications);
    if (req.body.faqs) parsedFaqs = JSON.parse(req.body.faqs);
    if (req.body.related) parsedRelated = JSON.parse(req.body.related);
  } catch (error) {
    console.error('Error parsing JSON fields:', error);
  }

  try {
    console.log('Creating product with data:', {
      title,
      slug: generatedSlug,
      description,
      shortDescription,
      category,
      specifications: specs,
      benefits: parsedBenefits,
      packaging: parsedPackaging,
      certifications: parsedCertifications,
      faqs: parsedFaqs,
      related: parsedRelated
    });

    const product = new Product({
      title,
      slug: generatedSlug,
      description,
      shortDescription,
      category,
      images: imagePaths,
      specifications: specs,
      benefits: parsedBenefits,
      packaging: parsedPackaging,
      certifications: parsedCertifications,
      faqs: parsedFaqs,
      related: parsedRelated,
      videoUrl: req.body.videoUrl || '',
      datasheetUrl: req.body.datasheetUrl || ''
    });

    await product.validate();
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      error: 'Error creating product',
      details: error.message,
      validationErrors: error.errors
    });
  }

  await product.save();
  res.status(201).json(product);
}));

// Get all products with optional category filter
router.get('/', asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
}));

// Get product by ID or slug
router.get('/:identifier', asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  let product;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    product = await Product.findById(identifier);
  } else {
    product = await Product.findOne({ slug: identifier });
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
}));

// Update product
router.put('/:id', upload.array('images', 5), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, subcategory, price, features, specifications, stock } = req.body;
  
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Handle new images if provided
  let imagePaths = product.images; // Keep existing images by default
  if (req.files && req.files.length > 0) {
    // Delete old images
    for (const oldImage of product.images) {
      const oldImagePath = path.join(__dirname, '..', oldImage);
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (err) {
        console.error('Error deleting old image:', err);
      }
    }
    // Save new image paths
    imagePaths = req.files.map(file => `/upload/products/${file.filename}`);
  }

  // Process specifications if provided as a string
  let specs = product.specifications;
  if (specifications) {
    try {
      specs = JSON.parse(specifications);
    } catch (error) {
      console.error('Error parsing specifications:', error);
    }
  }

  // Update slug if title changed
  const slug = title ? slugify(title, { lower: true, strict: true }) : product.slug;

  const updatedProduct = await Product.findByIdAndUpdate(id, {
    ...(title && { title }),
    ...(description && { description }),
    ...(category && { category }),
    ...(subcategory && { subcategory }),
    ...(price && { price: Number(price) }),
    ...(features && { features: JSON.parse(features) }),
    specifications: specs,
    ...(stock && { stock: Number(stock) }),
    images: imagePaths,
    slug
  }, { new: true });

  res.json(updatedProduct);
}));

// Delete product
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Delete associated images
  for (const image of product.images) {
    const imagePath = path.join(__dirname, '..', image);
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }

  await Product.findByIdAndDelete(id);
  res.json({ message: 'Product deleted successfully' });
}));

// Get products by category
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category }).sort({ createdAt: -1 });
  res.json(products);
}));

module.exports = router;
