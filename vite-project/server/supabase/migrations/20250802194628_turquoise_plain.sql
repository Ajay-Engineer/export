/*
  # Add certifications column to products table

  1. Changes
    - Add `certifications` jsonb column to products table with default empty array
    - Add index on certifications column for better query performance
    - Update RLS policies to include the new column

  2. Purpose
    - Align database schema with frontend form expectations
    - Allow storing product-specific certifications as array of {src, alt} objects
    - Maintain separation from company-level certificates table
*/

-- Add certifications column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]'::jsonb;

-- Add index for better query performance on certifications
CREATE INDEX IF NOT EXISTS idx_products_certifications ON products USING gin (certifications);

-- Update the existing RLS policies to ensure they work with the new column
-- (The existing policies should already cover this new column since they use broad permissions)