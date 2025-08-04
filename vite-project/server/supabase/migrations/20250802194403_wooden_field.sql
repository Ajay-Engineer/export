/*
  # Add certifications column to products table

  1. Schema Updates
    - Add `certifications` jsonb column to products table
    - Set default value to empty array
    - Update RLS policies if needed

  2. Data Structure
    - certifications will store array of objects with {src, alt} structure
    - This allows product-specific certifications separate from company certificates

  3. Notes
    - This maintains the existing certificates table for company-level certificates
    - Products can now have their own certifications array
    - Frontend can work with both company certificates and product certifications
*/

-- Add certifications column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'certifications'
  ) THEN
    ALTER TABLE products ADD COLUMN certifications jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add index for certifications column for better query performance
CREATE INDEX IF NOT EXISTS idx_products_certifications 
ON products USING gin (certifications);

-- Update the existing RLS policies to include the new column
-- (The existing policies should already cover this new column)