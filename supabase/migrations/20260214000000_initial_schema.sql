-- ============================================
-- Fasana Homes — Initial Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (links to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property status enum (safe create)
DO $$ BEGIN
  CREATE TYPE property_status AS ENUM (
    'AVAILABLE', 'PENDING', 'RENTED', 'SOLD',
    'SHOWCASE', 'RENOVATION', 'UNDER_MANAGEMENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  zip TEXT NOT NULL DEFAULT '',
  rent_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  sqft INTEGER NOT NULL DEFAULT 0,
  status property_status NOT NULL DEFAULT 'AVAILABLE',
  description TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  storage_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead type enum (safe create)
DO $$ BEGIN
  CREATE TYPE lead_type AS ENUM ('OWNER', 'TENANT', 'RENOVATION');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  type lead_type NOT NULL DEFAULT 'OWNER',
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance status enum (safe create)
DO $$ BEGIN
  CREATE TYPE maintenance_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Maintenance orders table
CREATE TABLE IF NOT EXISTS maintenance_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  assignee_name TEXT DEFAULT '',
  due_date DATE,
  status maintenance_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Increment view count function (called via RPC)
CREATE OR REPLACE FUNCTION increment_view(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE properties
  SET view_count = view_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment click count function
CREATE OR REPLACE FUNCTION increment_click(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE properties
  SET click_count = click_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can read published properties
DROP POLICY IF EXISTS "Public can view properties" ON properties;
CREATE POLICY "Public can view properties" ON properties
  FOR SELECT USING (true);

-- Public can view property images
DROP POLICY IF EXISTS "Public can view images" ON property_images;
CREATE POLICY "Public can view images" ON property_images
  FOR SELECT USING (true);

-- Anyone can insert leads (contact forms)
DROP POLICY IF EXISTS "Anyone can submit leads" ON leads;
CREATE POLICY "Anyone can submit leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Admin can do everything
DROP POLICY IF EXISTS "Admins full access to properties" ON properties;
CREATE POLICY "Admins full access to properties" ON properties
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins full access to images" ON property_images;
CREATE POLICY "Admins full access to images" ON property_images
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins full access to leads" ON leads;
CREATE POLICY "Admins full access to leads" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins full access to maintenance" ON maintenance_orders;
CREATE POLICY "Admins full access to maintenance" ON maintenance_orders
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can view profiles" ON profiles;
CREATE POLICY "Admins can view profiles" ON profiles
  FOR ALL USING (auth.uid() = id);
