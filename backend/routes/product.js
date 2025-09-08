const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const slugify = require('slugify');
const functions = require('firebase-functions');

// Configure Cloudinary (lazy-loaded)
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

// Product categories
const VALID_CATEGORIES = [
  'health-mix',
  'egg',
  'handicraft',
  'decor-items',
  'home-textile',
  'bamboo-products'
];

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: async (req, file) => {
      // Store certificates and images in separate folders
      if (file.fieldname === 'certificateFiles') {
        return 'certificates';
      }
      return 'products';
    },
    format: async (req, file) => {
      // Convert all images to WebP for better performance
      return 'webp';
    },
    public_id: async (req, file) => {
      const timestamp = Date.now();
      const uniqueSuffix = Math.round(Math.random() * 1E9);
      
      // Use different naming conventions for certificates and images
      if (file.fieldname === 'certificateFiles') {
        return `cert_${timestamp}_${uniqueSuffix}`;
      }
      return `prod_${timestamp}_${uniqueSuffix}`;
    },
    transformation: async (req, file) => {
      if (file.fieldname === 'certificateFiles') {
        // Certificate images - optimize for display
        return [{
          width: 800,
          height: 800,
          crop: 'limit',
          format: 'webp',
          quality: 'auto'
        }];
      } else {
        // Product images - higher quality for product display
        return [{
          width: 1200,
          height: 1200,
          crop: 'limit',
          format: 'webp',
          quality: 'auto:good'
        }];
      }
    }
  },
});

// Add file filter for images only
const fileFilter = (req, file, cb) => {
  console.log('Checking file:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  // Check mime type and file extension - only allow images
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;

  const mimeTypeOk = allowedMimeTypes.includes(file.mimetype);
  const extensionOk = file.originalname.toLowerCase().match(allowedExtensions);

  console.log('File validation:', {
    mimeTypeOk,
    extensionOk,
    allowedMimeTypes,
    allowedExtensions
  });

  if (!mimeTypeOk || !extensionOk) {
    console.log('Rejected file:', {
      reason: !mimeTypeOk ? 'Invalid mime type' : 'Invalid extension',
      file: file.originalname,
      mimetype: file.mimetype
    });
    return cb(new Error(`File ${file.originalname} not allowed: must be an image file`), false);
  }

  console.log('Accepted file:', file.originalname, file.mimetype);
  cb(null, true);
};

// Configure multer with Cloudinary storage
const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files total (images + certificates)
  }
});

// Create middleware for handling both images and certificates
const upload = multerUpload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'certificateFiles', maxCount: 5 }
]);

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

// Upload image endpoint for both product images and certificates
router.post('/upload', multerUpload.single('file'), asyncHandler(async (req, res) => {
  try {
    // Configure Cloudinary at runtime
    configureCloudinary();

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Return the Cloudinary URL
    res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({
      success: false,
      error: 'Error uploading file',
      message: error.message
    });
  }
}));

// Get all products with optional category filter
// Public route: show all products (no visibility filter)
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

  // Add cache control headers to prevent caching
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

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

// Admin route: show all products regardless of visibility
router.get('/admin', asyncHandler(async (req, res) => {
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

  // Add cache control headers to prevent caching
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

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

// Get products by category (no visibility filter)
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
router.post('/', upload, asyncHandler(async (req, res) => {
  try {
    // Configure Cloudinary at runtime
    configureCloudinary();

    const {
      title,
      description,
      shortDescription,
      category,
      visibility,
      specifications,
      benefits,
      packaging,
      faqs,
      related,
      videoUrl,
      datasheetUrl,
      certificationsData
    } = req.body;

    console.log('Creating product with data:', {
      title,
      description,
      shortDescription,
      category,
      visibility,
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

    // Process certifications - now handled directly as part of product
    const certifications = safeJSONParse(certificationsData, []);
    const processedCertifications = [];
    
    // Handle certificate files - upload them to Cloudinary and store URLs
    if (req.files && req.files.certificateFiles) {
      const certFiles = Array.isArray(req.files.certificateFiles) 
        ? req.files.certificateFiles 
        : [req.files.certificateFiles];
      
      for (let i = 0; i < Math.min(certFiles.length, certifications.length); i++) {
        const certFile = certFiles[i];
        const cert = certifications[i];
        
        if (certFile && cert) {
          processedCertifications.push({
            src: certFile.path, // Cloudinary URL
            alt: cert.alt || 'Certificate'
          });
        }
      }
    } else if (certifications && certifications.length > 0) {
      // If no new files but we have existing certificate data
      for (const cert of certifications) {
        if (cert.src && cert.src.trim() !== '') {
          processedCertifications.push({
            src: cert.src,
            alt: cert.alt || 'Certificate'
          });
        }
      }
    }

    // Handle images
    const existingImages = safeJSONParse(req.body.existingImages, []);
    const uploadedImages = req.files && req.files.images ? req.files.images.map(file => file.path) : [];
    const finalImages = [...existingImages, ...uploadedImages];

    // Create the product data
    const newProduct = new Product({
      title,
      slug,
      description,
      shortDescription,
      category,
      visibility: visibility || 'public',
      specifications: safeJSONParse(specifications, {}),
      benefits: safeJSONParse(benefits, []),
      packaging: safeJSONParse(packaging, []),
      faqs: safeJSONParse(faqs, []),
      related: safeJSONParse(related, []),
      certifications: processedCertifications,
      videoUrl: videoUrl || '',
      datasheetUrl: datasheetUrl || '',
      images: finalImages
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

// Update product - handle both JSON and multipart/form-data
router.put('/:id', (req, res, next) => {
  // Check if this is a JSON request or form-data
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('multipart/form-data')) {
    // Use multer middleware for file uploads
    return upload(req, res, next);
  } else {
    // Skip multer for JSON requests
    next();
  }
}, asyncHandler(async (req, res) => {
  try {
    // Configure Cloudinary at runtime
    configureCloudinary();

    const { id } = req.params;
    console.log(`Updating product ${id}`, req.body);

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const contentType = req.headers['content-type'] || '';
    const isMultipart = contentType.includes('multipart/form-data');

    let processedCertifications = [];
    let allImages = [];

    if (isMultipart) {
      // Handle multipart/form-data with file uploads
      console.log('Processing multipart request with files');

      // Process certificates
      const certifications = safeJSONParse(req.body.certificationsData, []);

      // Handle certificate files - upload them to Cloudinary and store URLs
      if (req.files && req.files.certificateFiles) {
        const certFiles = Array.isArray(req.files.certificateFiles)
          ? req.files.certificateFiles
          : [req.files.certificateFiles];

        for (let i = 0; i < Math.min(certFiles.length, certifications.length); i++) {
          const certFile = certFiles[i];
          const cert = certifications[i];

          if (certFile && cert) {
            processedCertifications.push({
              src: certFile.path, // Cloudinary URL
              alt: cert.alt || 'Certificate'
            });
          }
        }
      } else if (certifications && certifications.length > 0) {
        // If no new files but we have existing certificate data
        for (const cert of certifications) {
          if (cert.src && cert.src.trim() !== '') {
            processedCertifications.push({
              src: cert.src,
              alt: cert.alt || 'Certificate'
            });
          }
        }
      }

      // Handle product images
      const existingImages = safeJSONParse(req.body.existingImages, []);
      const newImageFiles = req.files?.images || [];

      // Process new image uploads
      let newImageUrls = [];
      if (Array.isArray(newImageFiles)) {
        newImageUrls = newImageFiles.map(file => file.path); // Cloudinary URLs
      } else if (newImageFiles.path) {
        // Single file case
        newImageUrls = [newImageFiles.path];
      }

      // Combine existing and new images, filter out any empty values
      allImages = [...existingImages, ...newImageUrls].filter(img => img && img.trim() !== '');
    } else {
      // Handle JSON request - preserve existing images and certifications
      console.log('Processing JSON request - preserving existing files');
      allImages = existingProduct.images || [];
      processedCertifications = existingProduct.certifications || [];
    }

    // Prepare update data
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      category: req.body.category,
      visibility: req.body.visibility || existingProduct.visibility,
      specifications: safeJSONParse(req.body.specifications, {}),
      benefits: safeJSONParse(req.body.benefits, []),
      packaging: safeJSONParse(req.body.packaging, []),
      faqs: safeJSONParse(req.body.faqs, []),
      related: safeJSONParse(req.body.related, []),
      videoUrl: req.body.videoUrl || existingProduct.videoUrl,
      datasheetUrl: req.body.datasheetUrl || existingProduct.datasheetUrl
    };

    // Update certifications if we have processed some
    if (processedCertifications.length > 0) {
      updateData.certifications = processedCertifications;
    }

    // Update images if we have them
    if (allImages.length > 0) {
      updateData.images = allImages;
    }

    console.log('Final update data:', {
      ...updateData,
      imageCount: updateData.images ? updateData.images.length : 0,
      certificationCount: processedCertifications.length,
      isMultipart
    });

    console.log('Updating product with ID:', id);
    // Ensure the update includes all fields that should be updated
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    console.log('Updated product result:', {
      id: updatedProduct._id,
      imageCount: updatedProduct.images ? updatedProduct.images.length : 0,
      certCount: updatedProduct.certifications ? updatedProduct.certifications.length : 0,
      updateSuccess: true
    });

    // Add cache control headers to prevent caching of updated data
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', {
      productId: req.params.id,
      error: error.message,
      stack: error.stack,
      body: req.body,
      contentType: req.headers['content-type'],
      files: req.files ? Object.keys(req.files) : 'none'
    });
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}));

// Add FAQ to product
router.post('/:id/faqs', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: 'Question and answer are required'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Add new FAQ to the product's faqs array
    product.faqs.push({ q: question, a: answer });
    await product.save();

    res.json({
      success: true,
      message: 'FAQ added successfully',
      faq: { q: question, a: answer }
    });
  } catch (error) {
    console.error('Error adding FAQ:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error adding FAQ'
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

    // Delete associated images and certificates from Cloudinary
    const allMedia = [
      ...(product.images || []),
      ...(product.certifications || []).map(cert => cert.src)
    ];

    for (const mediaUrl of allMedia) {
      if (mediaUrl && mediaUrl.includes('cloudinary')) {
        try {
          const publicId = mediaUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting media from Cloudinary:', cloudinaryError);
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
