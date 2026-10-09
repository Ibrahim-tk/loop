-- ============================================
-- Migration: Add property detail columns
-- garage, year_built, google_maps_url, highlights
-- ============================================

ALTER TABLE properties ADD COLUMN IF NOT EXISTS garage INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS year_built INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS highlights TEXT[];
