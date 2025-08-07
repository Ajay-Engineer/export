/*
  # Create Certificates Table

  1. New Tables
    - `certificates`
      - `id` (uuid, primary key) - Unique identifier for each certificate
      - `company_id` (uuid, foreign key) - References companies.id with cascade delete
      - `src` (text) - URL/path to the certificate image
      - `alt` (text) - Alternative text for accessibility
      - `created_at` (timestamptz) - When the certificate was uploaded

  2. Security
    - Enable RLS on `certificates` table
    - Add policy for authenticated users to read all certificates
    - Add policy for authenticated users to manage certificates
    - Add policy for cascading deletes when company is removed

  3. Relationships
    - Foreign key constraint to companies table with CASCADE delete
    - Index on company_id for efficient lookups
*/

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  src text NOT NULL,
  alt text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates table
CREATE POLICY "Anyone can read certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certificates"
  ON certificates
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete certificates"
  ON certificates
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for efficient company-based certificate lookups
CREATE INDEX IF NOT EXISTS idx_certificates_company_id ON certificates(company_id);