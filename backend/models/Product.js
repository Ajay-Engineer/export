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
    enum: ['herbal', 'palm-jaggery', 'coir', 'tea', 'health-mix', 'handicraft', 'egg']
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
    required: true
  }],
  certifications: [{
    alt: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: false
    },
    index: {
      type: Number,
      required: true
    },
    isNew: {
      type: Boolean,
      default: false
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
  certifications: [{
    src: {
      type: String,
      
    },
    alt: {
      type: String,
  
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
productSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
