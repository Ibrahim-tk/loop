-- Buildium integration removed; its column was never populated.
DROP INDEX IF EXISTS idx_properties_buildium_id;
ALTER TABLE properties DROP COLUMN IF EXISTS buildium_id;
