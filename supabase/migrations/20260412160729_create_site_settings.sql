-- Create site_settings table for storing key-value configuration
-- like the announcement banner toggle

CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default banner setting (enabled by default)
INSERT INTO site_settings (key, value)
VALUES ('banner_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read site settings (needed for public pages)
CREATE POLICY "Allow public read access to site_settings"
    ON site_settings FOR SELECT
    USING (true);

-- Allow authenticated users to update site settings
CREATE POLICY "Allow authenticated users to update site_settings"
    ON site_settings FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert site settings
CREATE POLICY "Allow authenticated users to insert site_settings"
    ON site_settings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
