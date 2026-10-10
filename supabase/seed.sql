-- Demo data: 25 marketplace properties. Applied with `supabase db push --include-seed`.
-- Safe to re-run: clears demo properties first (images cascade).
DELETE FROM properties WHERE source = 'demo';

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Emaar Crescent Bay Penthouse','Coral Tower, Crescent Bay, DHA Phase 8','Karachi','75500','https://www.google.com/maps/search/?api=1&query=Coral+Tower%2C+Crescent+Bay%2C+DHA+Phase+8%2C+Karachi%2C+Pakistan',185000000,4,5,4200,3,2023,'AVAILABLE',true,'PENTHOUSE','SALE','FURNISHED',ARRAY['Pool','Gym','Concierge','Rooftop Terrace','Smart Home','Security']::TEXT[],ARRAY['Arabian Sea views','Private lift lobby','Wraparound terrace']::TEXT[],ARRAY['Arabian Sea views','Private lift lobby','Wraparound terrace']::TEXT[],'A full-floor penthouse at Crescent Bay with unbroken Arabian Sea views, a private lift lobby and a terrace built for evening gatherings.','Sara Malik','+92 300 412 0141','sara@fasanahomes.pk','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '75 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-11.jpg',0),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('1 Kanal Modern House','Street 12, Sector A, DHA Phase 6','Lahore','54792','https://www.google.com/maps/search/?api=1&query=Street+12%2C+Sector+A%2C+DHA+Phase+6%2C+Lahore%2C+Pakistan',95000000,5,6,4500,3,2021,'AVAILABLE',true,'HOUSE','SALE','UNFURNISHED',ARRAY['Garden','Home Theater','Solar Panels','Security','Servant Quarter']::TEXT[],ARRAY['Double-height lounge','Basement with home cinema','Corner plot near park']::TEXT[],ARRAY['Double-height lounge','Basement with home cinema','Corner plot near park']::TEXT[],'A brand-new 1 Kanal modern house on a corner plot facing the park, with a full basement, double-height lounge and 10 kW solar.','Hamza Qureshi','+92 321 455 0172','hamza@fasanahomes.pk','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '72 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-27.jpg',0),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',1),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('10 Marla Family Home','Block J, Johar Town','Lahore','54782','https://www.google.com/maps/search/?api=1&query=Block+J%2C+Johar+Town%2C+Lahore%2C+Pakistan',42000000,4,5,2250,2,2018,'AVAILABLE',true,'HOUSE','SALE','SEMI_FURNISHED',ARRAY['Garden','Garage','Laundry','Servant Quarter']::TEXT[],ARRAY['Near Emporium Mall','Gas connection','Separate drawing room']::TEXT[],ARRAY['Near Emporium Mall','Gas connection','Separate drawing room']::TEXT[],'A well-kept 10 Marla home in Johar Town with a separate drawing room, Sui gas connection and Emporium Mall five minutes away.','Aisha Khan','+92 333 518 0193','aisha@fasanahomes.pk','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '69 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-17.jpg',0),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',1),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Gulberg Furnished Apartment','Main Boulevard, Gulberg III','Lahore','54660','https://www.google.com/maps/search/?api=1&query=Main+Boulevard%2C+Gulberg+III%2C+Lahore%2C+Pakistan',350000,3,3,2100,1,2019,'AVAILABLE',false,'APARTMENT','RENT','FURNISHED',ARRAY['Gym','Elevator','Balcony','Security','Backup Generator']::TEXT[],ARRAY['MM Alam Road nearby','Full power backup','City views']::TEXT[],ARRAY['MM Alam Road nearby','Full power backup','City views']::TEXT[],'A furnished three-bed apartment off Main Boulevard, steps from MM Alam Road restaurants, with full generator backup.','Bilal Ahmed','+92 345 619 0128','bilal@fasanahomes.pk','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '66 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-22.jpg',0),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',1),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('F-7 Townhouse','Street 33, F-7/1','Islamabad','44000','https://www.google.com/maps/search/?api=1&query=Street+33%2C+F-7%2F1%2C+Islamabad%2C+Pakistan',450000,4,4,3000,2,2015,'AVAILABLE',true,'TOWNHOUSE','RENT','SEMI_FURNISHED',ARRAY['Garden','Garage','Pet Friendly','Laundry']::TEXT[],ARRAY['Margalla Hills views','Walk to Jinnah Super','Private lawn']::TEXT[],ARRAY['Margalla Hills views','Walk to Jinnah Super','Private lawn']::TEXT[],'A quiet townhouse in F-7 with Margalla Hills views from the terrace and Jinnah Super a short walk away.','Sara Malik','+92 300 412 0141','sara@fasanahomes.pk','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '63 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-24.jpg',0),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',1),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Bahria Town Studio','Tower 2, Bahria Heights, Phase 4','Rawalpindi','46220','https://www.google.com/maps/search/?api=1&query=Tower+2%2C+Bahria+Heights%2C+Phase+4%2C+Rawalpindi%2C+Pakistan',65000,0,1,550,0,2020,'AVAILABLE',false,'STUDIO','RENT','FURNISHED',ARRAY['Gym','Elevator','Security','Laundry']::TEXT[],ARRAY['Built-in wardrobes','24/7 security','Near Expressway']::TEXT[],ARRAY['Built-in wardrobes','24/7 security','Near Expressway']::TEXT[],'A compact furnished studio in Bahria Heights with built-in storage, round-the-clock security and quick access to the Expressway.','Hamza Qureshi','+92 321 455 0172','hamza@fasanahomes.pk','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '60 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-15.jpg',0),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',1),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Kanal Bungalow in E-7','Street 4, E-7','Islamabad','44000','https://www.google.com/maps/search/?api=1&query=Street+4%2C+E-7%2C+Islamabad%2C+Pakistan',280000000,6,6,9000,4,2005,'AVAILABLE',false,'HOUSE','SALE','UNFURNISHED',ARRAY['Fireplace','Garden','Garage','Home Office','Servant Quarter']::TEXT[],ARRAY['2 Kanal plot','Mature trees','Margalla foothills']::TEXT[],ARRAY['2 Kanal plot','Mature trees','Margalla foothills']::TEXT[],'A classic 2 Kanal bungalow at the foot of the Margallas, with mature trees, a fireplace lounge and room for a large family.','Aisha Khan','+92 333 518 0193','aisha@fasanahomes.pk','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '57 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-28.jpg',0),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',1),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Bahria Town Karachi Villa','Precinct 1, Bahria Town','Karachi','75340','https://www.google.com/maps/search/?api=1&query=Precinct+1%2C+Bahria+Town%2C+Karachi%2C+Pakistan',38000000,4,4,2500,2,2022,'AVAILABLE',true,'VILLA','SALE','FURNISHED',ARRAY['Pool','Smart Home','Solar Panels','Security','Garden']::TEXT[],ARRAY['Gated precinct','Near Grand Jamia Mosque','Ready to move']::TEXT[],ARRAY['Gated precinct','Near Grand Jamia Mosque','Ready to move']::TEXT[],'A furnished, ready-to-move villa in a gated precinct of Bahria Town Karachi, close to the Grand Jamia Mosque.','Bilal Ahmed','+92 345 619 0128','bilal@fasanahomes.pk','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '54 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-14.jpg',0),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Clifton Sea-Facing Apartment','Block 2, Clifton','Karachi','75600','https://www.google.com/maps/search/?api=1&query=Block+2%2C+Clifton%2C+Karachi%2C+Pakistan',400000,3,3,2400,2,2016,'AVAILABLE',false,'APARTMENT','RENT','FURNISHED',ARRAY['Pool','Gym','Concierge','Balcony','Security']::TEXT[],ARRAY['Sea-facing balcony','Near Dolmen Mall','Reserved parking']::TEXT[],ARRAY['Sea-facing balcony','Near Dolmen Mall','Reserved parking']::TEXT[],'A furnished sea-facing apartment in Clifton with a wide balcony, reserved parking and Dolmen Mall around the corner.','Sara Malik','+92 300 412 0141','sara@fasanahomes.pk','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '51 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-18.jpg',0),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',1),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Model Town Heritage House','Block C, Model Town','Lahore','54700','https://www.google.com/maps/search/?api=1&query=Block+C%2C+Model+Town%2C+Lahore%2C+Pakistan',120000000,5,4,4500,2,1965,'AVAILABLE',false,'HOUSE','SALE','UNFURNISHED',ARRAY['Garden','Fireplace','Laundry','Servant Quarter']::TEXT[],ARRAY['1 Kanal plot','Original brickwork','Large front lawn']::TEXT[],ARRAY['1 Kanal plot','Original brickwork','Large front lawn']::TEXT[],'A lovingly restored 1960s 1 Kanal house in Model Town, keeping its original brickwork and big front lawn with a modern kitchen inside.','Hamza Qureshi','+92 321 455 0172','hamza@fasanahomes.pk','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '48 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-36.jpg',0),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('DHA Phase 5 Portion','Street 7, Block K, DHA Phase 5','Lahore','54792','https://www.google.com/maps/search/?api=1&query=Street+7%2C+Block+K%2C+DHA+Phase+5%2C+Lahore%2C+Pakistan',180000,3,3,2250,1,2017,'AVAILABLE',false,'HOUSE','RENT','UNFURNISHED',ARRAY['Garage','Pet Friendly','Home Office']::TEXT[],ARRAY['Upper portion with separate gate','Near Jalal Sons','Gas and electricity separate meters']::TEXT[],ARRAY['Upper portion with separate gate','Near Jalal Sons','Gas and electricity separate meters']::TEXT[],'An upper portion of a 1 Kanal house in DHA Phase 5 with its own gate, separate meters and a dedicated home office.','Aisha Khan','+92 333 518 0193','aisha@fasanahomes.pk','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '45 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-25.jpg',0),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',1),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Askari 11 Apartment','Sector B, Askari 11','Lahore','54810','https://www.google.com/maps/search/?api=1&query=Sector+B%2C+Askari+11%2C+Lahore%2C+Pakistan',95000,2,2,1350,1,2012,'AVAILABLE',false,'APARTMENT','RENT','SEMI_FURNISHED',ARRAY['Garden','Security','Laundry','Elevator']::TEXT[],ARRAY['Gated community','Park facing','Near Bedian Road']::TEXT[],ARRAY['Gated community','Park facing','Near Bedian Road']::TEXT[],'A park-facing two-bed apartment in gated Askari 11, with a mosque, school and market inside the community.','Bilal Ahmed','+92 345 619 0128','bilal@fasanahomes.pk','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '42 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-16.jpg',0),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Centaurus Sky Residence','The Centaurus, F-8','Islamabad','44220','https://www.google.com/maps/search/?api=1&query=The+Centaurus%2C+F-8%2C+Islamabad%2C+Pakistan',145000000,3,4,2800,2,2023,'AVAILABLE',true,'PENTHOUSE','SALE','FURNISHED',ARRAY['Gym','Pool','Concierge','Smart Home','Security','Elevator']::TEXT[],ARRAY['Margalla and city views','Mall downstairs','Private terrace']::TEXT[],ARRAY['Margalla and city views','Mall downstairs','Private terrace']::TEXT[],'A high-floor residence at The Centaurus with views from the Margallas to Rawalpindi and a mall at your doorstep.','Sara Malik','+92 300 412 0141','sara@fasanahomes.pk','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '39 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-21.jpg',0),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',1),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('5 Marla Starter Home','Block C, Bahria Town Phase 8','Rawalpindi','46220','https://www.google.com/maps/search/?api=1&query=Block+C%2C+Bahria+Town+Phase+8%2C+Rawalpindi%2C+Pakistan',16500000,3,3,1125,1,2019,'AVAILABLE',false,'HOUSE','SALE','UNFURNISHED',ARRAY['Garage','Garden','Laundry']::TEXT[],ARRAY['Near Bahria Grand Mosque','Corner plot','Low maintenance']::TEXT[],ARRAY['Near Bahria Grand Mosque','Corner plot','Low maintenance']::TEXT[],'A compact 5 Marla starter home on a corner plot in Bahria Town Phase 8, ideal for young families.','Hamza Qureshi','+92 321 455 0172','hamza@fasanahomes.pk','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '36 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-35.jpg',0),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',1),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Zamzama Studio','Zamzama Commercial, DHA Phase 5','Karachi','75500','https://www.google.com/maps/search/?api=1&query=Zamzama+Commercial%2C+DHA+Phase+5%2C+Karachi%2C+Pakistan',85000,0,1,500,0,2014,'AVAILABLE',false,'STUDIO','RENT','FURNISHED',ARRAY['Laundry','Security','Backup Generator']::TEXT[],ARRAY['Cafe strip downstairs','Updated bathroom','Bike parking']::TEXT[],ARRAY['Cafe strip downstairs','Updated bathroom','Bike parking']::TEXT[],'A sunny furnished studio above Zamzama''s cafe strip, ready to move in with secure entry and generator backup.','Aisha Khan','+92 333 518 0193','aisha@fasanahomes.pk','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '33 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-33.jpg',0),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',1),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Smart Home in DHA Phase 7','Block S, DHA Phase 7','Lahore','54792','https://www.google.com/maps/search/?api=1&query=Block+S%2C+DHA+Phase+7%2C+Lahore%2C+Pakistan',65000000,5,5,2250,2,2024,'AVAILABLE',false,'HOUSE','SALE','SEMI_FURNISHED',ARRAY['Smart Home','Solar Panels','Home Office','Garage','Garden']::TEXT[],ARRAY['10 Marla','Net-metered solar','Imported fittings']::TEXT[],ARRAY['10 Marla','Net-metered solar','Imported fittings']::TEXT[],'A brand-new 10 Marla smart home with net-metered solar, imported fittings and two home offices.','Bilal Ahmed','+92 345 619 0128','bilal@fasanahomes.pk','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '30 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-19.jpg',0),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',1),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Gulberg Corner Townhouse','Hali Road, Gulberg II','Lahore','54660','https://www.google.com/maps/search/?api=1&query=Hali+Road%2C+Gulberg+II%2C+Lahore%2C+Pakistan',78000000,4,4,2700,2,2010,'AVAILABLE',false,'TOWNHOUSE','SALE','UNFURNISHED',ARRAY['Fireplace','Garden','Laundry']::TEXT[],ARRAY['12 Marla','Walk to Liberty Market','Private courtyard']::TEXT[],ARRAY['12 Marla','Walk to Liberty Market','Private courtyard']::TEXT[],'A 12 Marla townhouse on a quiet Gulberg street with a private courtyard and Liberty Market a short walk away.','Sara Malik','+92 300 412 0141','sara@fasanahomes.pk','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '27 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-23.jpg',0),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',1),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('2 Kanal Farmhouse Estate','Bedian Road','Lahore','54810','https://www.google.com/maps/search/?api=1&query=Bedian+Road%2C+Lahore%2C+Pakistan',320000000,6,7,9000,6,2018,'AVAILABLE',true,'VILLA','SALE','FURNISHED',ARRAY['Pool','Spa','Gym','Home Theater','Garden','Security','Smart Home']::TEXT[],ARRAY['Gated estate','Guest annexe','Orchard and lawns']::TEXT[],ARRAY['Gated estate','Guest annexe','Orchard and lawns']::TEXT[],'A gated 2 Kanal farmhouse estate on Bedian Road with a guest annexe, home cinema, pool and lawns lined with fruit trees.','Hamza Qureshi','+92 321 455 0172','hamza@fasanahomes.pk','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '24 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-13.jpg',0),('/properties/house-12.jpg',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',3)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Blue Area Apartment','Jinnah Avenue, Blue Area','Islamabad','44000','https://www.google.com/maps/search/?api=1&query=Jinnah+Avenue%2C+Blue+Area%2C+Islamabad%2C+Pakistan',220000,2,2,1400,1,2019,'AVAILABLE',false,'APARTMENT','RENT','UNFURNISHED',ARRAY['Gym','Balcony','Elevator','Security']::TEXT[],ARRAY['Margalla views','Walk to offices','Backup power']::TEXT[],ARRAY['Margalla views','Walk to offices','Backup power']::TEXT[],'A bright two-bed apartment on Jinnah Avenue, walking distance to Blue Area offices, with Margalla views from the balcony.','Aisha Khan','+92 333 518 0193','aisha@fasanahomes.pk','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '21 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-34.jpg',0),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('DHA Islamabad Villa','Sector F, DHA Phase 2','Islamabad','46000','https://www.google.com/maps/search/?api=1&query=Sector+F%2C+DHA+Phase+2%2C+Islamabad%2C+Pakistan',550000,5,5,4500,3,2020,'AVAILABLE',false,'VILLA','RENT','FURNISHED',ARRAY['Pool','Garage','Garden','Security']::TEXT[],ARRAY['1 Kanal','Near GT Road','Separate guest wing']::TEXT[],ARRAY['1 Kanal','Near GT Road','Separate guest wing']::TEXT[],'A fully furnished 1 Kanal villa in DHA Islamabad with a private pool and a separate guest wing.','Bilal Ahmed','+92 345 619 0128','bilal@fasanahomes.pk','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '18 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-29.jpg',0),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',1),('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Defence View Family House','Khayaban-e-Shamsheer, DHA Phase 5','Karachi','75500','https://www.google.com/maps/search/?api=1&query=Khayaban-e-Shamsheer%2C+DHA+Phase+5%2C+Karachi%2C+Pakistan',320000,4,4,2250,2,2008,'AVAILABLE',false,'HOUSE','RENT','SEMI_FURNISHED',ARRAY['Garden','Fireplace','Pet Friendly']::TEXT[],ARRAY['500 sq yd','Water bore','Near Sea View']::TEXT[],ARRAY['500 sq yd','Water bore','Near Sea View']::TEXT[],'A comfortable family house on Khayaban-e-Shamsheer with its own water bore and Sea View a few minutes away.','Sara Malik','+92 300 412 0141','sara@fasanahomes.pk','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '15 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-26.jpg',0),('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80',1),('https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Emaar Canyon Views Penthouse','Canyon Views, DHA Phase 2','Islamabad','46000','https://www.google.com/maps/search/?api=1&query=Canyon+Views%2C+DHA+Phase+2%2C+Islamabad%2C+Pakistan',650000,3,3,3000,2,2021,'AVAILABLE',true,'PENTHOUSE','RENT','FURNISHED',ARRAY['Pool','Gym','Concierge','Rooftop Terrace','Security','Smart Home']::TEXT[],ARRAY['Private rooftop','Margalla views','Gated community']::TEXT[],ARRAY['Private rooftop','Margalla views','Gated community']::TEXT[],'A furnished penthouse at Emaar Canyon Views with its own rooftop and sweeping views of the Margalla Hills.','Hamza Qureshi','+92 321 455 0172','hamza@fasanahomes.pk','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80','demo',NOW() - INTERVAL '12 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-20.jpg',0),('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',1),('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Wapda Town Townhouse','Block E, Wapda Town','Lahore','54770','https://www.google.com/maps/search/?api=1&query=Block+E%2C+Wapda+Town%2C+Lahore%2C+Pakistan',19500000,3,3,1575,1,2014,'AVAILABLE',false,'TOWNHOUSE','SALE','UNFURNISHED',ARRAY['Garage','Laundry','Pet Friendly']::TEXT[],ARRAY['7 Marla','New tiles','Near Canal Road']::TEXT[],ARRAY['7 Marla','New tiles','Near Canal Road']::TEXT[],'An affordable, move-in-ready 7 Marla townhouse in Wapda Town with new flooring and quick access to Canal Road.','Aisha Khan','+92 333 518 0193','aisha@fasanahomes.pk','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80','demo',NOW() - INTERVAL '9 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-31.jpg',0),('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',1),('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('Saddar Furnished Flat','Mall Road, Saddar','Rawalpindi','46000','https://www.google.com/maps/search/?api=1&query=Mall+Road%2C+Saddar%2C+Rawalpindi%2C+Pakistan',75000,1,1,800,1,2017,'AVAILABLE',false,'APARTMENT','RENT','FURNISHED',ARRAY['Gym','Elevator','Laundry']::TEXT[],ARRAY['Near Metro station','Walk to Saddar bazaar','Large wardrobes']::TEXT[],ARRAY['Near Metro station','Walk to Saddar bazaar','Large wardrobes']::TEXT[],'A furnished one-bed on Mall Road, close to the Metro and Saddar''s bazaars.','Bilal Ahmed','+92 345 619 0128','bilal@fasanahomes.pk','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80','demo',NOW() - INTERVAL '6 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-30.jpg',0),('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',1),('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',2)) AS v(url, ord);

WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ('DHA Phase 8 Modern Home','Street 18, Ex Air Avenue, DHA Phase 8','Lahore','54792','https://www.google.com/maps/search/?api=1&query=Street+18%2C+Ex+Air+Avenue%2C+DHA+Phase+8%2C+Lahore%2C+Pakistan',110000000,5,6,4500,3,2023,'AVAILABLE',false,'HOUSE','SALE','SEMI_FURNISHED',ARRAY['Pool','Garden','Smart Home','Fireplace','Security']::TEXT[],ARRAY['1 Kanal','Glass façade','Indoor pool']::TEXT[],ARRAY['1 Kanal','Glass façade','Indoor pool']::TEXT[],'An architect-designed 1 Kanal home in DHA Phase 8 with a glass façade, indoor pool and landscaped lawn.','Sara Malik','+92 300 412 0141','sara@fasanahomes.pk','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80','demo',NOW() - INTERVAL '3 days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES ('/properties/house-32.jpg',0),('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',1),('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80',2)) AS v(url, ord);

-- A few sample inquiries so the dashboard isn't empty
INSERT INTO leads (name,email,phone,type,message,property_id)
SELECT 'Ayesha Siddiqui','ayesha@example.test','+92 300 555 0101','TENANT','Assalam o Alaikum, is this still available? Can I visit this weekend?', id FROM properties WHERE title='Gulberg Furnished Apartment' AND source='demo';
INSERT INTO leads (name,email,phone,type,message,property_id)
SELECT 'Usman Tariq','usman@example.test','+92 321 555 0102','GENERAL','Is the file transfer and registry clear? Any room on the demand?', id FROM properties WHERE title='10 Marla Family Home' AND source='demo';

-- Status is no longer managed in the admin: every listing is simply for sale or for rent.
UPDATE properties SET status = 'AVAILABLE' WHERE status <> 'AVAILABLE';

-- Sample inquiries spread over the last six months so the Leads Overview chart shows a trend.
INSERT INTO leads (name, email, phone, type, message, property_id, created_at)
SELECT
  (ARRAY['Ayesha Khan','Bilal Ahmed','Sana Malik','Hamza Raza','Fatima Noor','Usman Ali','Zainab Hussain','Ali Haider','Mariam Siddiqui','Omar Farooq','Hira Javed','Saad Qureshi'])[1 + (g.i % 12)],
  'lead' || g.i || '@example.test',
  '+92 300 555 ' || lpad((200 + g.i)::text, 4, '0'),
  'TENANT',
  (ARRAY['Is this still available?','Can I book a viewing this weekend?','Is the price negotiable?','Are utilities included in the rent?','What are the maintenance charges?','Is parking available?','Could you share more photos?','Is the registry clear for transfer?'])[1 + (g.i % 8)],
  (SELECT id FROM properties ORDER BY created_at OFFSET (g.i % GREATEST((SELECT count(*) FROM properties), 1))::int LIMIT 1),
  -- month offsets weighted toward recent months: 3,5,4,7,6,9 inquiries (oldest → newest)
  date_trunc('month', NOW()) - make_interval(months => m.back) + make_interval(days => (g.i * 7) % 26, hours => 9 + g.i % 8)
FROM (VALUES (5,3),(4,5),(3,4),(2,7),(1,6),(0,9)) AS m(back, n)
CROSS JOIN LATERAL generate_series(1, m.n) AS s(k)
CROSS JOIN LATERAL (SELECT m.back * 10 + s.k AS i) AS g
WHERE date_trunc('month', NOW()) - make_interval(months => m.back) + make_interval(days => (g.i * 7) % 26, hours => 9 + g.i % 8) <= NOW();
