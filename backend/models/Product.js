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
    type: String,
    required: [true, 'Description is required'],
    trim: true
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
  benefits: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
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
  packaging: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
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
