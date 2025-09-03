const express = require('express');
const router = express.Router();

// Predefined categories (same as in product routes)
const VALID_CATEGORIES = [
  'health-mix',
  'egg',
  'handicraft',
  'decor-items',
  'home-textile',
  'bamboo-products'
];

// Category icons mapping
const CATEGORY_ICONS = {
  'health-mix': 'HeartPulse',
  'egg': 'Egg',
  'handicraft': 'Hand',
  'decor-items': 'Sparkles',
  'home-textile': 'Home',
  'bamboo-products': 'Leaf'
};

// Category descriptions
const CATEGORY_DESCRIPTIONS = {
  'health-mix': 'Nutritious health mix products for daily wellness',
  'egg': 'Quality egg products and poultry items',
  'handicraft': 'Beautiful handcrafted items and artisanal products',
  'decor-items': 'Elegant decorative items and home accessories',
  'home-textile': 'Premium home textile products and fabrics',
  'bamboo-products': 'Eco-friendly bamboo products and sustainable goods'
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