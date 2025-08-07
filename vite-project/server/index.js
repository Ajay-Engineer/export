// Express/Postgres backend API for products and categories
const express = require('express');
const cors = require('cors');
const postgres = require('postgres');

// TODO: Replace with your actual Postgres connection string
const sql = postgres('postgres://username:password@localhost:5432/yourdb');

const app = express();
app.use(cors());
app.use(express.json());

// --- Product Endpoints ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products`;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { title, slug, category, shortDescription, description, videoUrl, datasheetUrl, benefits, specifications, packaging, certifications, faqs, related, images } = req.body;
    const [product] = await sql`
      INSERT INTO products (
        title, slug, category, short_description, description, video_url, datasheet_url,
        benefits, specifications, packaging, certifications, faqs, related, images, created_at
      ) VALUES (
        ${title}, ${slug}, ${category}, ${shortDescription}, ${description}, ${videoUrl}, ${datasheetUrl},
        ${JSON.stringify(benefits)}, ${JSON.stringify(specifications)}, ${JSON.stringify(packaging)},
        ${JSON.stringify(certifications)}, ${JSON.stringify(faqs)}, ${JSON.stringify(related)},
        ${JSON.stringify(images)}, NOW()
      )
      RETURNING *;
    `;
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, shortDescription, description, videoUrl, datasheetUrl, benefits, specifications, packaging, certifications, faqs, related, images } = req.body;
    const [product] = await sql`
      UPDATE products SET
        title=${title}, slug=${slug}, category=${category}, short_description=${shortDescription},
        description=${description}, video_url=${videoUrl}, datasheet_url=${datasheetUrl},
        benefits=${JSON.stringify(benefits)}, specifications=${JSON.stringify(specifications)},
        packaging=${JSON.stringify(packaging)}, certifications=${JSON.stringify(certifications)},
        faqs=${JSON.stringify(faqs)}, related=${JSON.stringify(related)}, images=${JSON.stringify(images)}
      WHERE id=${id}
      RETURNING *;
    `;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM products WHERE id=${id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Category Endpoints ---
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await sql`SELECT * FROM categories`;
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, path, icon, description } = req.body;
    const [category] = await sql`
      INSERT INTO categories (name, path, icon, description, created_at)
      VALUES (${name}, ${path}, ${icon}, ${description}, NOW())
      RETURNING *
    `;
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, path, icon, description } = req.body;
    const [category] = await sql`
      UPDATE categories SET name=${name}, path=${path}, icon=${icon}, description=${description}
      WHERE id=${id} RETURNING *
    `;
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM categories WHERE id=${id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
