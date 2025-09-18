const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['health-mix', 'egg', 'handicraft', 'decor-items', 'home-textile', 'bamboo-products']
  },
  visibility: {
    type: String,
    default: 'public',
    enum: ['public', 'tea-only'],
    required: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Description is required'],
    validate: {
      validator: function(value) {
        // Allow string or array of strings
        if (typeof value === 'string') {
          return value.trim().length > 0;
        }
        if (Array.isArray(value)) {
          return value.length > 0 && value.every(item => typeof item === 'string' && item.trim().length > 0);
        }
        return false;
      },
      message: 'Description must be a non-empty string or an array of non-empty strings'
    }
  },
  videoUrl: {
    type: String,
    trim: true
  },
  datasheetUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: false
  }],
  certifications: [{
    src: {
      type: String,
      required: false
    },
    alt: {
      type: String,
      required: false
    }
  }],
  benefits: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function(value) {
        // Allow array of objects or array of strings
        if (Array.isArray(value)) {
          if (value.length === 0) return true;
          // Check if it's array of objects (current format)
          if (typeof value[0] === 'object' && value[0] !== null) {
            return value.every(item =>
              typeof item === 'object' &&
              item !== null &&
              typeof item.title === 'string' &&
              typeof item.description === 'string' &&
              item.title.trim().length > 0 &&
              item.description.trim().length > 0
            );
          }
          // Check if it's array of strings (new bullet points format)
          return value.every(item => typeof item === 'string' && item.trim().length > 0);
        }
        return false;
      },
      message: 'Benefits must be an array of objects with title/description or an array of strings'
    }
  },
  specifications: {
    'Botanical Source': String,
    'Form': String,
    'Color': String,
    'Moisture': String,
    'Ash Content': String,
    'Shelf Life': String,
    'pH': String,
    'MOQ': String
  },
  packaging: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function(value) {
        // Allow array of objects or object with key-value pairs
        if (Array.isArray(value)) {
          return value.length === 0 || value.every(item =>
            typeof item === 'object' &&
            item !== null &&
            typeof item.title === 'string' &&
            typeof item.content === 'string' &&
            item.title.trim().length > 0 &&
            item.content.trim().length > 0
          );
        }
        if (typeof value === 'object' && value !== null) {
          // Check if it's a plain object (not array, not null)
          return Object.keys(value).length === 0 || Object.values(value).every(val =>
            typeof val === 'string' && val.trim().length > 0
          );
        }
        return false;
      },
      message: 'Packaging must be an array of objects with title/content or an object with key-value pairs'
    }
  },
  faqs: [{
    q: {
      type: String,
      
    },
    a: {
      type: String,
      
    }
  }],
  related: [{
    title: {
      type: String,
      
    },
    image: {
      type: String,
      
    },
    link: {
      type: String,
      
    }
  }]
}, {
  timestamps: true
});

// Create slug from title before saving
productSchema.pre('save', async function(next) {
  if (this.isModified('title')) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists (excluding current document)
    let existingProduct = await mongoose.models.Product.findOne({
      slug: baseSlug,
      _id: { $ne: this._id }
    });

    let slug = baseSlug;
    let counter = 1;

    // If slug exists, append counter until unique
    while (existingProduct) {
      slug = `${baseSlug}-${counter}`;
      existingProduct = await mongoose.models.Product.findOne({
        slug: slug,
        _id: { $ne: this._id }
      });
      counter++;
    }

    this.slug = slug;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
