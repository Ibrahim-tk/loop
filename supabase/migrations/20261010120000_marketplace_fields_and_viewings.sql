-- ============================================
-- Marketplace fields + viewing requests
-- rent_price is the listing price (monthly for RENT, total for SALE);
-- garage is the parking-space count.
-- ============================================

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS property_type TEXT NOT NULL DEFAULT 'HOUSE'
    CHECK (property_type IN ('HOUSE', 'APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'STUDIO', 'PLOT', 'COMMERCIAL')),
  ADD COLUMN IF NOT EXISTS listing_type TEXT NOT NULL DEFAULT 'RENT'
    CHECK (listing_type IN ('RENT', 'SALE')),
  ADD COLUMN IF NOT EXISTS furnishing TEXT NOT NULL DEFAULT 'UNFURNISHED'
    CHECK (furnishing IN ('FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED')),
  ADD COLUMN IF NOT EXISTS amenities TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS agent_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS agent_phone TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS agent_email TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS agent_photo_url TEXT DEFAULT '';

-- Sale prices need more headroom than monthly rents
ALTER TABLE properties ALTER COLUMN rent_price TYPE NUMERIC(14,2);

CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Viewing / appointment requests
CREATE TABLE IF NOT EXISTS viewings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  viewing_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- One active booking per property/date/slot
CREATE UNIQUE INDEX IF NOT EXISTS viewings_active_slot_unique
  ON viewings(property_id, viewing_date, time_slot)
  WHERE status <> 'CANCELLED';

ALTER TABLE viewings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can request viewings" ON viewings;
CREATE POLICY "Anyone can request viewings" ON viewings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to viewings" ON viewings;
CREATE POLICY "Admins full access to viewings" ON viewings
  FOR ALL USING (auth.role() = 'authenticated');

-- Lets the public booking form see taken slots without exposing visitor details
CREATE OR REPLACE FUNCTION get_booked_slots(p_property_id UUID, p_date DATE)
RETURNS SETOF TEXT AS $$
  SELECT time_slot FROM viewings
  WHERE property_id = p_property_id
    AND viewing_date = p_date
    AND status <> 'CANCELLED';
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION get_booked_slots(UUID, DATE) TO anon, authenticated;
