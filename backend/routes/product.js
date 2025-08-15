const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Product categories
const VALID_CATEGORIES = [
  'herbal',
  'palm-jaggery',
  'coir',
  'tea',
  'health-mix',
  'handicraft',
  'egg'
];

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
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

// Helper function to parse JSON safely
const safeJSONParse = (str, defaultValue = null) => {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
};

// Middleware to validate category
const validateCategory = (req, res, next) => {
  const category = req.params.category || req.body.category;
  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  next();
};

// Helper function to handle async route errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes

// Get all products with optional category filter
router.get('/', asyncHandler(async (req, res) => {
  const { category, sort, limit = 10, page = 1 } = req.query;
  const query = category ? { category } : {};

  const sortOptions = sort ? { [sort]: 1 } : { createdAt: -1 };
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// Get products by category
router.get('/category/:category', validateCategory, asyncHandler(async (req, res) => {
  const { sort, limit = 10, page = 1 } = req.query;
  const query = { category: req.params.category };
  
  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sort ? { [sort]: 1 } : { createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean(),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// Create a new product
router.post('/', upload.array('images', 5), asyncHandler(async (req, res) => {
  const { 
    title,
    description,
    shortDescription,
    category,
    specifications,
    features,
    videoUrl,
    datasheetUrl,
    certificationsData
  } = req.body;

  console.log('Creating product with data:', {
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

  // Create slug from title
  const slug = slugify(title, { lower: true, strict: true });

  // Create the product data
  const newProduct = new Product({
    title,
    slug,
    description,
    shortDescription,
    category,
    specifications: safeJSONParse(specifications, {}),
    benefits: safeJSONParse(features, []),
    certifications: safeJSONParse(certificationsData, []),
    videoUrl: videoUrl || '',
    datasheetUrl: datasheetUrl || '',
    packaging: [],
    faqs: [],
    related: [],
    images: req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : []
  });

  // Save the product
  await newProduct.save();

  // Send response
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
}));

// Update product
router.put('/:id', upload.array('images', 5), asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`Updating product ${id}`);
  
  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updateData = {
    ...req.body,
    specifications: safeJSONParse(req.body.specifications, {}),
    benefits: safeJSONParse(req.body.features, []),
    certifications: safeJSONParse(req.body.certificationsData, [])
  };

  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map(file => `/uploads/products/${file.filename}`);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id, 
    updateData,
    { new: true, runValidators: true }
  );

  res.json({ 
    message: 'Product updated successfully', 
    product: updatedProduct 
  });
}));

// Delete product
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting product ${id}`);

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      for (const imagePath of product.images) {
        const fullPath = path.join(__dirname, '..', 'uploads', 'products', path.basename(imagePath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}));
}));

module.exports = router;
