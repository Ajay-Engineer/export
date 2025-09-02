const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const slugify = require('slugify');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

// Add file filter for images
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 4 // Maximum 4 files allowed
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
    success: true, 
    products: products,
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
router.post('/', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'certificateFile_0', maxCount: 1 }
]), asyncHandler(async (req, res) => {
  try {
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
      category,
      certificationsData
    });

    // Validate required fields
    const requiredFields = ['title', 'category', 'shortDescription', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        receivedFields: req.body
      });
    }

    // Create slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Process certifications
    const certifications = safeJSONParse(certificationsData, []);
    const processedCertifications = [];
    
    // Handle certificate files
    if (certifications && certifications.length > 0) {
      for (const cert of certifications) {
        const certFile = req.files[`certificateFile_${cert.index}`]?.[0];
        if (certFile) {
          processedCertifications.push({
            ...cert,
            url: certFile.path // Cloudinary URL
          });
        } else {
          processedCertifications.push(cert);
        }
      }
    }

    // Get image URLs from uploaded files
    const imageUrls = req.files.images ? req.files.images.map(file => file.path) : [];

    // Create the product data
    const newProduct = new Product({
      title,
      slug,
      description,
      shortDescription,
      category,
      specifications: safeJSONParse(specifications, {}),
      benefits: safeJSONParse(features, []),
      certifications: processedCertifications,
      videoUrl: videoUrl || '',
      datasheetUrl: datasheetUrl || '',
      packaging: [],
      faqs: [],
      related: [],
      images: imageUrls
    });

    // Save the product
    await newProduct.save();

    // Send response
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error creating product'
    });
  }
}));

// Update product
router.put('/:id', upload.fields([
  { name: 'images', maxCount: 4 },
  { name: 'certificateFile_0', maxCount: 1 }
]), asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating product ${id}`, req.body);
    
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }

    // Process certificates
    const certifications = safeJSONParse(req.body.certificationsData, []);
    const processedCertifications = [];
    
    if (certifications && certifications.length > 0) {
      for (const cert of certifications) {
        if (req.files[`certificateFile_${cert.index}`]?.[0]) {
          // New certificate file
          processedCertifications.push({
            ...cert,
            url: req.files[`certificateFile_${cert.index}`][0].path
          });
        } else if (cert.url) {
          // Existing certificate without new file
          processedCertifications.push(cert);
        }
      }
    }

    const updateData = {
      ...req.body,
      specifications: safeJSONParse(req.body.specifications, {}),
      benefits: safeJSONParse(req.body.features, []),
      certifications: processedCertifications
    };

    // Handle product images
    if (req.files.images && req.files.images.length > 0) {
      // Delete old images from Cloudinary
      if (existingProduct.images && existingProduct.images.length > 0) {
        for (const imageUrl of existingProduct.images) {
          if (imageUrl.includes('cloudinary')) {
            try {
              const publicId = imageUrl.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (error) {
              console.error('Error deleting old image:', error);
            }
          }
        }
      }
      // Add new Cloudinary URLs
      updateData.images = req.files.images.map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true, 
      message: 'Product updated successfully', 
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating product'
    });
  }
}));

// Delete product
router.delete('/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting product ${id}`);

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes('cloudinary')) {
          try {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryError) {
            console.error('Error deleting image from Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting product'
    });
  }
}));

module.exports = router;
