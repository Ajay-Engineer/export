const express = require('express');
const router = express.Router();

// Predefined categories (same as in product routes)
const VALID_CATEGORIES = [
  'herbal',
  'palm-jaggery',
  'coir',
  'tea',
  'health-mix',
  'handicraft',
  'egg'
];

// Category icons mapping
const CATEGORY_ICONS = {
  'herbal': 'Leaf',
  'palm-jaggery': 'CakeSlice',
  'coir': 'Flower2',
  'tea': 'Coffee',
  'health-mix': 'HeartPulse',
  'handicraft': 'Hand',
  'egg': 'Egg'
};

// Category descriptions
const CATEGORY_DESCRIPTIONS = {
  'herbal': 'Natural herbal products and remedies',
  'palm-jaggery': 'Traditional palm jaggery and palm products',
  'coir': 'Coconut coir products and fibers',
  'tea': 'Premium tea varieties and blends',
  'health-mix': 'Nutritious health mix products',
  'handicraft': 'Handcrafted items and artisanal products',
  'egg': 'Fresh egg products and poultry items'
};

// Get all categories
router.get('/', (req, res) => {
  const categories = VALID_CATEGORIES.map(category => ({
    id: category,
    name: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    path: category,
    icon: CATEGORY_ICONS[category] || 'Box',
    description: CATEGORY_DESCRIPTIONS[category] || 'Category description'
  }));

  res.json(categories);
});

// Get category by path
router.get('/:path', (req, res) => {
  const { path } = req.params;

  if (!VALID_CATEGORIES.includes(path)) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const category = {
    id: path,
    name: path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    path: path,
    icon: CATEGORY_ICONS[path] || 'Box',
    description: CATEGORY_DESCRIPTIONS[path] || 'Category description'
  };

  res.json(category);
});

// Note: Since categories are predefined, we don't implement POST, PUT, DELETE
// These would require modifying the VALID_CATEGORIES array and redeploying

module.exports = router;