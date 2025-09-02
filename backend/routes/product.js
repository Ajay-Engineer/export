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
    folder: async (req, file) => {
      // Store certificates and images in separate folders
      if (file.fieldname === 'certificateFiles') {
        return 'certificates';
      }
      return 'products';
    },
    format: async (req, file) => {
      // Preserve PDF format, convert images to WebP
      if (file.mimetype === 'application/pdf') {
        return 'pdf';
      }
      return 'webp';
    },
    public_id: async (req, file) => {
      const timestamp = Date.now();
      const uniqueSuffix = Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      
      // Use different naming conventions for certificates and images
      if (file.fieldname === 'certificateFiles') {
        return `cert_${timestamp}_${uniqueSuffix}`;
      }
      return `prod_${timestamp}_${uniqueSuffix}`;
    },
    transformation: async (req, file) => {
      if (file.fieldname === 'certificateFiles') {
        if (file.mimetype.startsWith('image/')) {
          return [{
            width: 800,
            height: 800,
            crop: 'limit',
            format: 'webp',
            quality: 'auto'
          }];
        }
        return []; // No transformation for PDFs
      } else {
        // Product images
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

// Add file filter for images and certificates (allow images and PDFs)
const fileFilter = (req, file, cb) => {
  console.log('Checking file:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  // Check mime type and file extension
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
  const allowedExtensions = /\.(jpg|jpeg|png|gif|pdf)$/i;

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
    return cb(new Error(`File ${file.originalname} not allowed: must be an image or PDF`), false);
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
  { name: 'certificateFiles', maxCount: 5 },
  { name: 'certificates', maxCount: 5 } // Add this as a fallback
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
    // Default certificates if none provided
    const defaultCertificates = [
      { alt: 'GST', url: '' },
      { alt: 'FSSAI', url: '' },
      { alt: 'Export License', url: '' }
    ];

    if (certifications && certifications.length > 0) {
      for (const cert of certifications) {
        if (req.files && req.files.certificateFiles) {
          const certFile = req.files.certificateFiles.find(f => f.originalname === `certificateFile_${cert.index}`);
          if (certFile) {
            processedCertifications.push({
              ...cert,
              url: certFile.path // Cloudinary URL
            });
          } else if (cert.url) {
            processedCertifications.push(cert);
          }
        } else if (cert.url) {
          processedCertifications.push(cert);
        }
      }
    } else {
      // Use default certificates if none provided
      processedCertifications.push(...defaultCertificates);
    }

    // Handle images
    const existingImages = safeJSONParse(req.body.existingImages, []);
    const uploadedImages = req.files.images ? req.files.images.map(file => file.path) : [];
    const finalImages = [...existingImages, ...uploadedImages];

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
      packaging: [
        {
          title: "Standard Wise Packing",
          content: "Our standard packing process is designed to meet global compliance regulations, providing reliable protection for goods during long-distance transportation."
        },
        {
          title: "Size Wise Packing",
          content: "Each product is packed precisely according to its size—ensuring minimal wasted space and maximum efficiency."
        },
        {
          title: "Regional Wise Packing",
          content: "We understand the specific challenges faced during regional transport. That's why our regional-wise packing considers climate sensitivity and regulatory compliance."
        }
      ],
      faqs: [],
      related: [],
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

// Update product
router.put('/:id', upload, asyncHandler(async (req, res) => {
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
    
    console.log('Processing certificates:', {
      rawData: req.body.certificationsData,
      parsedData: certifications,
      files: req.files?.certificateFiles
    });
    
    if (certifications && certifications.length > 0) {
      for (const cert of certifications) {
        if (cert.isNew && req.files?.certificateFiles) {
          // Find the matching uploaded file
          const certFiles = Array.isArray(req.files.certificateFiles) 
            ? req.files.certificateFiles 
            : [req.files.certificateFiles];

          const certFile = certFiles.find(f => f.originalname === cert.filename);
          
          console.log('Processing certificate:', {
            certificate: cert,
            foundFile: certFile ? certFile.originalname : null
          });
          
          if (certFile) {
            processedCertifications.push({
              alt: cert.alt || 'Certificate',
              url: certFile.path, // Cloudinary URL
              type: certFile.mimetype
            });
          }
        } else if (cert.url) {
          // Keep existing certificate
          processedCertifications.push({
            alt: cert.alt,
            url: cert.url,
            type: cert.type || 'unknown'
          });
        }
      }
    }
    
    console.log('Final processed certificates:', processedCertifications);

    const defaultPackaging = [
      {
        title: "Standard Wise Packing",
        content: "Our standard packing process is designed to meet global compliance regulations, providing reliable protection for goods during long-distance transportation."
      },
      {
        title: "Size Wise Packing",
        content: "Each product is packed precisely according to its size—ensuring minimal wasted space and maximum efficiency."
      },
      {
        title: "Regional Wise Packing",
        content: "We understand the specific challenges faced during regional transport. That's why our regional-wise packing considers climate sensitivity and regulatory compliance."
      }
    ];

    // Create update data object
    // Prepare update data
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      category: req.body.category,
      specifications: safeJSONParse(req.body.specifications, {}),
      benefits: safeJSONParse(req.body.features, []),
      packaging: req.body.packaging && req.body.packaging.length > 0 ? req.body.packaging : defaultPackaging,
      videoUrl: req.body.videoUrl || existingProduct.videoUrl,
      datasheetUrl: req.body.datasheetUrl || existingProduct.datasheetUrl
    };

    // Only update certifications if we have processed some
    if (processedCertifications.length > 0) {
      updateData.certifications = processedCertifications;
    }

    console.log('Final update data:', {
      ...updateData,
      certificationCount: processedCertifications.length,
    });

    // Handle product images
    const existingImages = safeJSONParse(req.body.existingImages, []);
    const newImageFiles = req.files?.images || [];
    
    console.log('Processing images:', {
      existingCount: existingImages.length,
      newCount: newImageFiles.length,
      existingImages,
      newFiles: newImageFiles.map(f => f.originalname)
    });
    
    // Process new image uploads
    let newImageUrls = [];
    if (Array.isArray(newImageFiles)) {
      newImageUrls = newImageFiles.map(file => file.path); // Cloudinary URLs
    } else if (newImageFiles.path) {
      // Single file case
      newImageUrls = [newImageFiles.path];
    }
    
    // Combine existing and new images, filter out any empty values
    const allImages = [...existingImages, ...newImageUrls].filter(img => img && img.trim() !== '');
    
    // Update the images in the update data
    if (allImages.length > 0) {
      updateData.images = allImages;
      console.log('Final image list:', updateData.images);
    }
    
    console.log('Final update data:', {
      ...updateData,
      imageCount: updateData.images ? updateData.images.length : 0
    });

    console.log('Updating product with ID:', id);
    // Ensure the update includes all fields that should be updated
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { 
        $set: {
          ...updateData,
          images: updateData.images || [], // Ensure images array is always set
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
      images: updatedProduct.images
    });
    
    console.log('Updated product:', {
      id: updatedProduct._id,
      certifications: updatedProduct.certifications,
      updateSuccess: true
    });

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
