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
