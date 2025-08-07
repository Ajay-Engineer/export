import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    release();
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// PRODUCTS ENDPOINTS

// GET /api/products - List all products (ordered by created_at desc)
app.get('/api/products', asyncHandler(async (req, res) => {
  const { category, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM products';
  let params = [];
  
  if (category) {
    query += ' WHERE category = $1';
    params.push(category);
  }
  
  query += ' ORDER BY created_at DESC';
  
  if (limit) {
    query += ` LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
  }
  
  if (offset) {
    query += ` OFFSET $${params.length + 1}`;
    params.push(parseInt(offset));
  }
  
  const result = await pool.query(query, params);
  res.json({
    success: true,
    data: result.rows,
    count: result.rows.length
  });
}));

// GET /api/products/:id - Get single product by ID
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: result.rows[0]
  });
}));

// POST /api/products - Create a new product
app.post('/api/products', asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    category,
    short_description,
    description,
    video_url,
    datasheet_url,
    images,
    specifications,
    benefits,
    packaging,
    certifications,
    faqs,
    related
  } = req.body;

  // Validate required fields
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  // Validate images array
  if (images && !Array.isArray(images)) {
    return res.status(400).json({
      success: false,
      message: 'Images must be an array of URLs'
    });
  }

  const query = `
    INSERT INTO products (
      title, slug, category, short_description, description,
      video_url, datasheet_url, images, specifications,
      benefits, packaging, certifications, faqs, related
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `;

  const values = [
    title,
    slug || null,
    category || null,
    short_description || '',
    description || '',
    video_url || null,
    datasheet_url || null,
    JSON.stringify(images || []),
    JSON.stringify(specifications || {}),
    JSON.stringify(benefits || []),
    JSON.stringify(packaging || []),
    JSON.stringify(certifications || []),
    JSON.stringify(faqs || []),
    JSON.stringify(related || [])
  ];

  const result = await pool.query(query, values);
  
  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Product created successfully'
  });
}));

// PUT /api/products/:id - Update a product by ID
app.put('/api/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    category,
    short_description,
    description,
    video_url,
    datasheet_url,
    images,
    specifications,
    benefits,
    packaging,
    certifications,
    faqs,
    related
  } = req.body;

  // Check if product exists
  const existingProduct = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
  if (existingProduct.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Validate images array
  if (images && !Array.isArray(images)) {
    return res.status(400).json({
      success: false,
      message: 'Images must be an array of URLs'
    });
  }

  const query = `
    UPDATE products SET
      title = COALESCE($2, title),
      slug = COALESCE($3, slug),
      category = COALESCE($4, category),
      short_description = COALESCE($5, short_description),
      description = COALESCE($6, description),
      video_url = COALESCE($7, video_url),
      datasheet_url = COALESCE($8, datasheet_url),
      images = COALESCE($9, images),
      specifications = COALESCE($10, specifications),
      benefits = COALESCE($11, benefits),
      packaging = COALESCE($12, packaging),
      certifications = COALESCE($13, certifications),
      faqs = COALESCE($14, faqs),
      related = COALESCE($15, related)
    WHERE id = $1
    RETURNING *
  `;

  const values = [
    id,
    title,
    slug,
    category,
    short_description,
    description,
    video_url,
    datasheet_url,
    images ? JSON.stringify(images) : null,
    specifications ? JSON.stringify(specifications) : null,
    benefits ? JSON.stringify(benefits) : null,
    packaging ? JSON.stringify(packaging) : null,
    certifications ? JSON.stringify(certifications) : null,
    faqs ? JSON.stringify(faqs) : null,
    related ? JSON.stringify(related) : null
  ];

  const result = await pool.query(query, values);
  
  res.json({
    success: true,
    data: result.rows[0],
    message: 'Product updated successfully'
  });
}));

// DELETE /api/products/:id - Delete a product by ID
app.delete('/api/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
}));

// CATEGORIES ENDPOINTS

// GET /api/categories - List all categories
app.get('/api/categories', asyncHandler(async (req, res) => {
  // Since categories are defined as constraints, we'll return the predefined list
  const categories = [
    { id: 'herbal', name: 'Herbal Extract Products', path: 'herbal', icon: '🌿', description: 'Natural herbal extract products' },
    { id: 'palm-jaggery', name: 'Palm Jaggery Products', path: 'palm-jaggery', icon: '🍯', description: 'Traditional palm jaggery products' },
    { id: 'coir', name: 'Coir Products', path: 'coir', icon: '🥥', description: 'Coconut coir and fiber products' },
    { id: 'tea', name: 'Tea Varieties', path: 'tea', icon: '🍵', description: 'Premium tea varieties' },
    { id: 'health-mix', name: 'Health Mix', path: 'health-mix', icon: '💪', description: 'Nutritious health mix products' },
    { id: 'handicraft', name: 'Handicrafts', path: 'handicraft', icon: '🎨', description: 'Traditional handicraft items' },
    { id: 'egg', name: 'Egg Products', path: 'egg', icon: '🥚', description: 'Fresh egg products' }
  ];
  
  res.json({
    success: true,
    data: categories,
    count: categories.length
  });
}));

// GET /api/categories/:id/products - Get products by category
app.get('/api/categories/:id/products', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  
  const query = `
    SELECT * FROM products 
    WHERE category = $1 
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  `;
  
  const result = await pool.query(query, [id, parseInt(limit), parseInt(offset)]);
  
  res.json({
    success: true,
    data: result.rows,
    count: result.rows.length,
    category: id
  });
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. This record already exists.'
    });
  }
  
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference. Related record does not exist.'
    });
  }
  
  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data. Please check your input values.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;