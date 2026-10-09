-- Add UNLISTED to property_status enum
DO $$ BEGIN
  ALTER TYPE property_status ADD VALUE 'UNLISTED';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add buildium_id and source columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS buildium_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Create an index to quickly find properties by buildium_id
CREATE INDEX IF NOT EXISTS idx_properties_buildium_id ON properties(buildium_id);
