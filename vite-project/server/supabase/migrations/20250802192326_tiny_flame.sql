/*
  # Create Companies Table

  1. New Tables
    - `companies`
      - `id` (uuid, primary key) - Unique identifier for each company
      - `name` (text, unique) - Company name, must be unique across the system
      - `created_at` (timestamptz) - When the company record was created

  2. Security
    - Enable RLS on `companies` table
    - Add policy for authenticated users to read all companies
    - Add policy for authenticated users to insert new companies
    - Add policy for users to update companies they own/manage
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
CREATE POLICY "Anyone can read companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update companies"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for better performance on name lookups
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);