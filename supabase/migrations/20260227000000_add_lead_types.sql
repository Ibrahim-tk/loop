-- Add new lead_type enum values for Maintenance and General inquiries
ALTER TYPE lead_type ADD VALUE IF NOT EXISTS 'MAINTENANCE';
ALTER TYPE lead_type ADD VALUE IF NOT EXISTS 'GENERAL';
