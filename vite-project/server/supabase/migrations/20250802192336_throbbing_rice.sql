/*
  # Create Products Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `title` (text) - Product title/name
      - `slug` (text) - URL-friendly product identifier
      - `category` (text) - Product category (herbal, palm-jaggery, coir, tea, health-mix, handicraft, egg)
      - `short_description` (text) - Brief product description
      - `description` (text) - Detailed product description
      - `video_url` (text) - URL to product video
      - `datasheet_url` (text) - URL to product datasheet/documentation
      - `images` (jsonb) - Array of image URLs
      - `specifications` (jsonb) - Product specifications as key-value pairs
      - `benefits` (jsonb) - Array of benefit objects with title and description
      - `packaging` (jsonb) - Array of packaging info objects with title and content
      - `faqs` (jsonb) - Array of FAQ objects with question and answer
      - `related` (jsonb) - Array of related product objects with title, image, and link
      - `created_at` (timestamptz) - When the product was created

  2. Security
    - Enable RLS on `products` table
    - Add policy for authenticated users to read all products
    - Add policy for authenticated users to manage products

  3. Indexes
    - Index on slug for efficient URL-based lookups
    - Index on category for category-based filtering
    - Index on created_at for chronological sorting

  4. Category Values
    Valid categories: herbal, palm-jaggery, coir, tea, health-mix, handicraft, egg
    These map to display labels in the frontend:
    - herbal → "Herbal Extract Products"
    - palm-jaggery → "Palm Jaggery Products"
    - coir → "Coir Products"
    - tea → "Tea Varieties"
    - health-mix → "Health Mix"
    - handicraft → "Handicrafts"
    - egg → "Egg Products"
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text,
  category text,
  short_description text DEFAULT '',
  description text DEFAULT '',
  video_url text,
  datasheet_url text,
  images jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  benefits jsonb DEFAULT '[]'::jsonb,
  packaging jsonb DEFAULT '[]'::jsonb,
  faqs jsonb DEFAULT '[]'::jsonb,
  related jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Add constraint to ensure valid categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'valid_product_categories'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT valid_product_categories 
    CHECK (category IN ('herbal', 'palm-jaggery', 'coir', 'tea', 'health-mix', 'handicraft', 'egg'));
  END IF;
END $$;