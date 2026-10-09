-- Demo data: 25 marketplace properties. Applied with `supabase db push --include-seed`.
-- Safe to re-run: clears demo properties first (images cascade).
DELETE FROM properties WHERE source = 'demo';

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Skyline Glass Penthouse','88 Harbor View Dr, Unit PH2','Miami','33131',4250000,4,4,3600,2,2021,'AVAILABLE',true,'PENTHOUSE','SALE','FURNISHED',ARRAY['Pool','Gym','Concierge','Rooftop Terrace','Smart Home','Security']::TEXT[],ARRAY['Floor-to-ceiling windows','Private elevator','Wraparound terrace']::TEXT[],ARRAY['Floor-to-ceiling windows','Private elevator','Wraparound terrace']::TEXT[],'A full-floor penthouse above Biscayne Bay with 270-degree water views, a private elevator and a wraparound terrace built for entertaining.','Sara Malik','+1 (512) 555-0141','sara@example.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '75 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-11.jpg',0),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Modern Hillside Villa','1420 Ridgecrest Ln','San Diego','92037',3180000,5,5,4800,3,2019,'AVAILABLE',true,'VILLA','SALE','SEMI_FURNISHED',ARRAY['Pool','Garden','Home Theater','Solar Panels','Security']::TEXT[],ARRAY['Ocean views','Infinity pool','Chef''s kitchen']::TEXT[],ARRAY['Ocean views','Infinity pool','Chef''s kitchen']::TEXT[],'Clean-lined villa set into the La Jolla hills, with an infinity pool facing the Pacific and indoor-outdoor living on every level.','Daniel Reyes','+1 (305) 555-0172','daniel@example.com','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '72 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-27.jpg',0),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',1),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Lakeview Family Home','73 Willow Creek Rd','Austin','78746',1295000,4,3,3100,2,2015,'AVAILABLE',true,'HOUSE','SALE','UNFURNISHED',ARRAY['Garden','Garage','Fireplace','Laundry']::TEXT[],ARRAY['Lake access','Open-plan living','Large backyard']::TEXT[],ARRAY['Lake access','Open-plan living','Large backyard']::TEXT[],'A bright, open family home a short walk from Lake Austin, with a big backyard, a fireplace lounge and top-rated schools nearby.','Aisha Khan','+1 (206) 555-0193','aisha@example.com','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '69 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-17.jpg',0),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',1),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Downtown Loft Apartment','210 Congress Ave, Apt 12B','Austin','78701',3200,2,2,1250,1,2018,'AVAILABLE',false,'APARTMENT','RENT','FURNISHED',ARRAY['Gym','Elevator','Balcony','Pet Friendly','Laundry']::TEXT[],ARRAY['Exposed brick','Double-height ceilings','City views']::TEXT[],ARRAY['Exposed brick','Double-height ceilings','City views']::TEXT[],'Industrial-style loft in the heart of downtown with exposed brick, double-height ceilings and a balcony over Congress Avenue.','Marcus Lee','+1 (619) 555-0128','marcus@example.com','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '66 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-22.jpg',0),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',1),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Coastal Townhouse','19 Pelican Way','San Diego','92109',4800,3,3,1900,2,2017,'AVAILABLE',true,'TOWNHOUSE','RENT','SEMI_FURNISHED',ARRAY['Balcony','Garage','Pet Friendly','Laundry']::TEXT[],ARRAY['Two blocks to the beach','Rooftop deck','Private garage']::TEXT[],ARRAY['Two blocks to the beach','Rooftop deck','Private garage']::TEXT[],'Three-level townhouse two blocks from Mission Beach, with a rooftop deck for sunset views and an attached two-car garage.','Sara Malik','+1 (512) 555-0141','sara@example.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '63 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-24.jpg',0),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',1),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Minimalist City Studio','455 Pine St, Unit 7','Seattle','98101',1850,0,1,520,0,2020,'AVAILABLE',false,'STUDIO','RENT','FURNISHED',ARRAY['Gym','Elevator','Concierge','Laundry']::TEXT[],ARRAY['Built-in storage','Smart lighting','Walk to transit']::TEXT[],ARRAY['Built-in storage','Smart lighting','Walk to transit']::TEXT[],'A compact, cleverly designed studio with built-in storage and smart lighting, steps from Pike Place and light rail.','Daniel Reyes','+1 (305) 555-0172','daniel@example.com','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '60 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-15.jpg',0),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',1),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Mountain View Retreat','902 Aspen Trail','Denver','80210',1675000,5,4,4200,3,2012,'PENDING',false,'HOUSE','SALE','UNFURNISHED',ARRAY['Fireplace','Garden','Garage','Home Office']::TEXT[],ARRAY['Mountain views','Finished basement','Mudroom']::TEXT[],ARRAY['Mountain views','Finished basement','Mudroom']::TEXT[],'A warm, timber-accented home with Rocky Mountain views, a finished basement and space for the whole family.','Aisha Khan','+1 (206) 555-0193','aisha@example.com','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '57 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-28.jpg',0),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',1),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Desert Modern Villa','6100 Saguaro Pass','Scottsdale','85255',2450000,4,5,4100,3,2022,'AVAILABLE',true,'VILLA','SALE','FURNISHED',ARRAY['Pool','Spa','Smart Home','Solar Panels','Home Theater']::TEXT[],ARRAY['Desert views','Outdoor kitchen','Fire pit']::TEXT[],ARRAY['Desert views','Outdoor kitchen','Fire pit']::TEXT[],'Brand-new desert modern villa with a resort-style pool, outdoor kitchen and a fire pit framed by the McDowell Mountains.','Marcus Lee','+1 (619) 555-0128','marcus@example.com','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '54 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-14.jpg',0),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Waterfront Condo','1500 Bay Rd, Apt 904','Miami','33139',5600,2,2,1350,1,2016,'RENTED',false,'APARTMENT','RENT','FURNISHED',ARRAY['Pool','Gym','Concierge','Balcony','Security']::TEXT[],ARRAY['Bay views','Private marina access','Updated kitchen']::TEXT[],ARRAY['Bay views','Private marina access','Updated kitchen']::TEXT[],'Ninth-floor condo on the bay side of Miami Beach with a private balcony, marina access and full-service amenities.','Sara Malik','+1 (512) 555-0141','sara@example.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '51 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-18.jpg',0),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',1),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Craftsman Bungalow','318 Maple St','Seattle','98103',985000,3,2,1800,1,1928,'AVAILABLE',false,'HOUSE','SALE','UNFURNISHED',ARRAY['Garden','Fireplace','Laundry']::TEXT[],ARRAY['Original woodwork','Front porch','Updated kitchen']::TEXT[],ARRAY['Original woodwork','Front porch','Updated kitchen']::TEXT[],'Lovingly restored 1928 Craftsman in Fremont, keeping its original woodwork and front porch with a modern kitchen inside.','Daniel Reyes','+1 (305) 555-0172','daniel@example.com','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '48 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-36.jpg',0),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Urban Townhome','27 Larimer Square','Denver','80202',3900,3,3,1750,2,2019,'AVAILABLE',false,'TOWNHOUSE','RENT','UNFURNISHED',ARRAY['Balcony','Garage','Pet Friendly','Home Office']::TEXT[],ARRAY['Rooftop patio','Walk to LoDo','EV charger']::TEXT[],ARRAY['Rooftop patio','Walk to LoDo','EV charger']::TEXT[],'Contemporary townhome near Larimer Square with a rooftop patio, EV charging and a dedicated home office.','Aisha Khan','+1 (206) 555-0193','aisha@example.com','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '45 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-25.jpg',0),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',1),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Garden Apartment','64 Elm Park, Apt 2','Austin','78704',2400,2,1,980,1,2010,'AVAILABLE',false,'APARTMENT','RENT','SEMI_FURNISHED',ARRAY['Garden','Pet Friendly','Laundry']::TEXT[],ARRAY['Private patio','Ground floor','Near South Congress']::TEXT[],ARRAY['Private patio','Ground floor','Near South Congress']::TEXT[],'Ground-floor apartment with a private garden patio, a short walk from the shops and cafes of South Congress.','Marcus Lee','+1 (619) 555-0128','marcus@example.com','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '42 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-16.jpg',0),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Luxury Sky Residence','1 Pacific Tower, Unit 3201','Seattle','98104',2890000,3,3,2600,2,2023,'AVAILABLE',true,'PENTHOUSE','SALE','FURNISHED',ARRAY['Gym','Pool','Concierge','Smart Home','Security','Elevator']::TEXT[],ARRAY['Puget Sound views','Wine room','Private terrace']::TEXT[],ARRAY['Puget Sound views','Wine room','Private terrace']::TEXT[],'A 32nd-floor residence with sweeping Puget Sound views, a private wine room and a terrace above the city.','Sara Malik','+1 (512) 555-0141','sara@example.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '39 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-21.jpg',0),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',1),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Suburban Family Home','4410 Oak Hollow Dr','Scottsdale','85260',895000,4,3,2700,2,2008,'SOLD',false,'HOUSE','SALE','UNFURNISHED',ARRAY['Pool','Garage','Garden','Laundry']::TEXT[],ARRAY['Cul-de-sac lot','Covered patio','Three-car garage']::TEXT[],ARRAY['Cul-de-sac lot','Covered patio','Three-car garage']::TEXT[],'Single-level home on a quiet cul-de-sac with a sparkling pool, covered patio and plenty of space to grow.','Daniel Reyes','+1 (305) 555-0172','daniel@example.com','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '36 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-35.jpg',0),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',1),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Beachside Studio','12 Ocean Ave, Unit 3','Miami','33139',2100,0,1,480,0,2014,'AVAILABLE',false,'STUDIO','RENT','FURNISHED',ARRAY['Pool','Laundry','Security']::TEXT[],ARRAY['One block to the beach','Updated bathroom','Bike storage']::TEXT[],ARRAY['One block to the beach','Updated bathroom','Bike storage']::TEXT[],'Sunny studio one block from the sand, fully furnished and ready to move in, with a shared pool and secure entry.','Aisha Khan','+1 (206) 555-0193','aisha@example.com','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '33 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-33.jpg',0),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',1),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Contemporary Smart Home','2205 Silicon Way','Austin','78759',1540000,4,4,3400,2,2021,'AVAILABLE',false,'HOUSE','SALE','SEMI_FURNISHED',ARRAY['Smart Home','Solar Panels','Home Office','Garage','Garden']::TEXT[],ARRAY['Whole-home automation','EV charger','Energy efficient']::TEXT[],ARRAY['Whole-home automation','EV charger','Energy efficient']::TEXT[],'A fully automated, energy-efficient home with solar panels, EV charging and two dedicated home offices.','Marcus Lee','+1 (619) 555-0128','marcus@example.com','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '30 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-19.jpg',0),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',1),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Historic Brick Townhouse','9 Capitol Hill Row','Denver','80203',1150000,3,3,2200,1,1905,'PENDING',false,'TOWNHOUSE','SALE','UNFURNISHED',ARRAY['Fireplace','Garden','Laundry']::TEXT[],ARRAY['Original brickwork','Restored staircase','Private courtyard']::TEXT[],ARRAY['Original brickwork','Restored staircase','Private courtyard']::TEXT[],'A beautifully restored 1905 brick townhouse with a private courtyard, original staircase and modern systems throughout.','Sara Malik','+1 (512) 555-0141','sara@example.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '27 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-23.jpg',0),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',1),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Hilltop Estate','77 Summit Crest','San Diego','92130',5750000,6,7,7200,4,2018,'AVAILABLE',true,'VILLA','SALE','FURNISHED',ARRAY['Pool','Spa','Gym','Home Theater','Garden','Security','Smart Home']::TEXT[],ARRAY['Gated estate','Guest house','Panoramic views']::TEXT[],ARRAY['Gated estate','Guest house','Panoramic views']::TEXT[],'A gated hilltop estate with a guest house, home cinema, spa and panoramic views from the mountains to the ocean.','Daniel Reyes','+1 (305) 555-0172','daniel@example.com','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '24 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-13.jpg',0),('/properties/house-12.jpg',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',3)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Riverside Apartment','350 River Walk, Apt 18','Denver','80211',2750,2,2,1150,1,2019,'AVAILABLE',false,'APARTMENT','RENT','UNFURNISHED',ARRAY['Gym','Balcony','Elevator','Pet Friendly']::TEXT[],ARRAY['River views','In-unit laundry','Bike storage']::TEXT[],ARRAY['River views','In-unit laundry','Bike storage']::TEXT[],'Bright two-bed apartment above the South Platte River trail, with a balcony and in-unit laundry.','Aisha Khan','+1 (206) 555-0193','aisha@example.com','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '21 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-34.jpg',0),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Golf Course Villa','18 Fairway Dr','Scottsdale','85258',6200,4,4,3500,3,2016,'AVAILABLE',false,'VILLA','RENT','FURNISHED',ARRAY['Pool','Spa','Garage','Garden','Security']::TEXT[],ARRAY['Golf course frontage','Outdoor kitchen','Casita']::TEXT[],ARRAY['Golf course frontage','Outdoor kitchen','Casita']::TEXT[],'Fully furnished villa on the fairway with a private pool, outdoor kitchen and a separate casita for guests.','Marcus Lee','+1 (619) 555-0128','marcus@example.com','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '18 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-29.jpg',0),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',1),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Lakefront Cottage','5 Shoreline Rd','Seattle','98112',4200,3,2,1600,2,1995,'RENTED',false,'HOUSE','RENT','SEMI_FURNISHED',ARRAY['Garden','Fireplace','Pet Friendly']::TEXT[],ARRAY['Private dock','Lake views','Wood stove']::TEXT[],ARRAY['Private dock','Lake views','Wood stove']::TEXT[],'A charming lakefront cottage with its own dock, a wood-burning stove and views across Lake Washington.','Sara Malik','+1 (512) 555-0141','sara@example.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '15 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-26.jpg',0),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Downtown Penthouse Suite','600 Brickell Ave, PH1','Miami','33131',12500,3,3,2800,2,2020,'AVAILABLE',true,'PENTHOUSE','RENT','FURNISHED',ARRAY['Pool','Gym','Concierge','Rooftop Terrace','Security','Smart Home']::TEXT[],ARRAY['Private rooftop pool','City and bay views','Butler service']::TEXT[],ARRAY['Private rooftop pool','City and bay views','Butler service']::TEXT[],'A furnished Brickell penthouse with its own rooftop pool, butler service and views over the city and bay.','Daniel Reyes','+1 (305) 555-0172','daniel@example.com','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '12 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-20.jpg',0),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',1),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Starter Townhouse','142 Cedar Ln','Austin','78745',465000,2,2,1300,1,2012,'AVAILABLE',false,'TOWNHOUSE','SALE','UNFURNISHED',ARRAY['Garage','Laundry','Pet Friendly']::TEXT[],ARRAY['Low HOA','Updated floors','Small yard']::TEXT[],ARRAY['Low HOA','Updated floors','Small yard']::TEXT[],'An affordable, move-in-ready townhouse with updated floors, a small private yard and low HOA fees.','Aisha Khan','+1 (206) 555-0193','aisha@example.com','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '9 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-31.jpg',0),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Uptown Apartment','88 Uptown Blvd, Apt 5C','Denver','80205',2200,1,1,760,1,2017,'AVAILABLE',false,'APARTMENT','RENT','FURNISHED',ARRAY['Gym','Elevator','Laundry']::TEXT[],ARRAY['Walk to City Park','Quartz counters','Large closet']::TEXT[],ARRAY['Walk to City Park','Quartz counters','Large closet']::TEXT[],'A furnished one-bed in Uptown, close to City Park, with quartz counters and a walk-in closet.','Marcus Lee','+1 (619) 555-0128','marcus@example.com','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '6 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-30.jpg',0),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',1),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Oceanfront Modern Home','300 Coast Hwy','San Diego','92075',3650000,4,4,3300,2,2020,'AVAILABLE',false,'HOUSE','SALE','SEMI_FURNISHED',ARRAY['Pool','Garden','Smart Home','Fireplace','Security']::TEXT[],ARRAY['Direct beach access','Glass walls','Outdoor shower']::TEXT[],ARRAY['Direct beach access','Glass walls','Outdoor shower']::TEXT[],'Architect-designed home right on the sand, with glass walls that open fully to the ocean and direct beach access.','Sara Malik','+1 (512) 555-0141','sara@example.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '3 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-32.jpg',0),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',1),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',2)) AS v(url, ord);

-- A few sample inquiries so the dashboard isn't empty
INSERT INTO leads (name,email,phone,type,message,property_id)
SELECT 'Jane Tester','jane@example.test','555-0101','TENANT','Is this still available for a viewing next week?', id FROM properties WHERE title='Downtown Loft Apartment' AND source='demo';
INSERT INTO leads (name,email,phone,type,message,property_id)
SELECT 'John Sample','john@example.test','555-0102','GENERAL','Could you share the HOA details?', id FROM properties WHERE title='Lakeview Family Home' AND source='demo';
