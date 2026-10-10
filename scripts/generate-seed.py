import sys, os
U=lambda i:f"https://images.unsplash.com/photo-{i}?w=1600&q=80"
EXT=["1568605114967-8130f3a36994","1570129477492-45c003edd2be","1512917774080-9991f1c4c750","1564013799919-ab600027ffc6","1600596542815-ffad4c1539a9","1600585154340-be6161a56a0c","1613490493576-7fde63acd811","1580587771525-78b9dba3b914","1600047509807-ba8f99d2cdde","1605276374104-dee2a0ed3cd6","1449844908441-8829872d2607","1583608205776-bfd35f0d9f83","1572120360610-d971b9d7767c","1416331108676-a22ccb276e35","1430285561322-7808604715df","1600585154526-990dced4db0d","1545324418-cc1a3fa10c00","1554995207-c18c203602cb","1494526585095-c41746248156","1576941089067-2de3c901e126","1598928506311-c55ded91a20c","1600573472550-8090b5e0745e","1507089947368-19c1da9775ae","1600566753190-17f0baa2a6c3","1600607687939-ce8a6c25118c"]
INT=["1502672260266-1c1ef2d93688","1522708323590-d24dbb6b0267","1560448204-e02f11c3d0e2","1493809842364-78817add7ffb","1600210492486-724fe5c67fb0","1484154218962-a197022b5858","1505691938895-1758d7feb511","1600566752355-35792bedcfea","1600210491892-03d54c0aaf87","1556909114-f6e7ad7d3136","1552321554-5fefe8c9ef14"]
AG=[("Sara Malik","+92 300 412 0141","sara@fasanahomes.pk","https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"),
("Hamza Qureshi","+92 321 455 0172","hamza@fasanahomes.pk","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"),
("Aisha Khan","+92 333 518 0193","aisha@fasanahomes.pk","https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"),
("Bilal Ahmed","+92 345 619 0128","bilal@fasanahomes.pk","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80")]
# Prices in PKR (monthly rent for RENT, total for SALE). Area in sq ft: 1 Marla = 225 sq ft, 1 Kanal = 20 Marla = 4,500 sq ft.
# title, address, city, zip, price, beds, baths, sqft, parking, year, status, featured, type, listing, furnishing, amenities, features, description
P=[
("Emaar Crescent Bay Penthouse","Coral Tower, Crescent Bay, DHA Phase 8","Karachi","75500",185000000,4,5,4200,3,2023,"AVAILABLE",True,"PENTHOUSE","SALE","FURNISHED",["Pool","Gym","Concierge","Rooftop Terrace","Smart Home","Security"],["Arabian Sea views","Private lift lobby","Wraparound terrace"],"A full-floor penthouse at Crescent Bay with unbroken Arabian Sea views, a private lift lobby and a terrace built for evening gatherings."),
("1 Kanal Modern House","Street 12, Sector A, DHA Phase 6","Lahore","54792",95000000,5,6,4500,3,2021,"AVAILABLE",True,"HOUSE","SALE","UNFURNISHED",["Garden","Home Theater","Solar Panels","Security","Servant Quarter"],["Double-height lounge","Basement with home cinema","Corner plot near park"],"A brand-new 1 Kanal modern house on a corner plot facing the park, with a full basement, double-height lounge and 10 kW solar."),
("10 Marla Family Home","Block J, Johar Town","Lahore","54782",42000000,4,5,2250,2,2018,"AVAILABLE",True,"HOUSE","SALE","SEMI_FURNISHED",["Garden","Garage","Laundry","Servant Quarter"],["Near Emporium Mall","Gas connection","Separate drawing room"],"A well-kept 10 Marla home in Johar Town with a separate drawing room, Sui gas connection and Emporium Mall five minutes away."),
("Gulberg Furnished Apartment","Main Boulevard, Gulberg III","Lahore","54660",350000,3,3,2100,1,2019,"AVAILABLE",False,"APARTMENT","RENT","FURNISHED",["Gym","Elevator","Balcony","Security","Backup Generator"],["MM Alam Road nearby","Full power backup","City views"],"A furnished three-bed apartment off Main Boulevard, steps from MM Alam Road restaurants, with full generator backup."),
("F-7 Townhouse","Street 33, F-7/1","Islamabad","44000",450000,4,4,3000,2,2015,"AVAILABLE",True,"TOWNHOUSE","RENT","SEMI_FURNISHED",["Garden","Garage","Pet Friendly","Laundry"],["Margalla Hills views","Walk to Jinnah Super","Private lawn"],"A quiet townhouse in F-7 with Margalla Hills views from the terrace and Jinnah Super a short walk away."),
("Bahria Town Studio","Tower 2, Bahria Heights, Phase 4","Rawalpindi","46220",65000,0,1,550,0,2020,"AVAILABLE",False,"STUDIO","RENT","FURNISHED",["Gym","Elevator","Security","Laundry"],["Built-in wardrobes","24/7 security","Near Expressway"],"A compact furnished studio in Bahria Heights with built-in storage, round-the-clock security and quick access to the Expressway."),
("Kanal Bungalow in E-7","Street 4, E-7","Islamabad","44000",280000000,6,6,9000,4,2005,"PENDING",False,"HOUSE","SALE","UNFURNISHED",["Fireplace","Garden","Garage","Home Office","Servant Quarter"],["2 Kanal plot","Mature trees","Margalla foothills"],"A classic 2 Kanal bungalow at the foot of the Margallas, with mature trees, a fireplace lounge and room for a large family."),
("Bahria Town Karachi Villa","Precinct 1, Bahria Town","Karachi","75340",38000000,4,4,2500,2,2022,"AVAILABLE",True,"VILLA","SALE","FURNISHED",["Pool","Smart Home","Solar Panels","Security","Garden"],["Gated precinct","Near Grand Jamia Mosque","Ready to move"],"A furnished, ready-to-move villa in a gated precinct of Bahria Town Karachi, close to the Grand Jamia Mosque."),
("Clifton Sea-Facing Apartment","Block 2, Clifton","Karachi","75600",400000,3,3,2400,2,2016,"RENTED",False,"APARTMENT","RENT","FURNISHED",["Pool","Gym","Concierge","Balcony","Security"],["Sea-facing balcony","Near Dolmen Mall","Reserved parking"],"A furnished sea-facing apartment in Clifton with a wide balcony, reserved parking and Dolmen Mall around the corner."),
("Model Town Heritage House","Block C, Model Town","Lahore","54700",120000000,5,4,4500,2,1965,"AVAILABLE",False,"HOUSE","SALE","UNFURNISHED",["Garden","Fireplace","Laundry","Servant Quarter"],["1 Kanal plot","Original brickwork","Large front lawn"],"A lovingly restored 1960s 1 Kanal house in Model Town, keeping its original brickwork and big front lawn with a modern kitchen inside."),
("DHA Phase 5 Portion","Street 7, Block K, DHA Phase 5","Lahore","54792",180000,3,3,2250,1,2017,"AVAILABLE",False,"HOUSE","RENT","UNFURNISHED",["Garage","Pet Friendly","Home Office"],["Upper portion with separate gate","Near Jalal Sons","Gas and electricity separate meters"],"An upper portion of a 1 Kanal house in DHA Phase 5 with its own gate, separate meters and a dedicated home office."),
("Askari 11 Apartment","Sector B, Askari 11","Lahore","54810",95000,2,2,1350,1,2012,"AVAILABLE",False,"APARTMENT","RENT","SEMI_FURNISHED",["Garden","Security","Laundry","Elevator"],["Gated community","Park facing","Near Bedian Road"],"A park-facing two-bed apartment in gated Askari 11, with a mosque, school and market inside the community."),
("Centaurus Sky Residence","The Centaurus, F-8","Islamabad","44220",145000000,3,4,2800,2,2023,"AVAILABLE",True,"PENTHOUSE","SALE","FURNISHED",["Gym","Pool","Concierge","Smart Home","Security","Elevator"],["Margalla and city views","Mall downstairs","Private terrace"],"A high-floor residence at The Centaurus with views from the Margallas to Rawalpindi and a mall at your doorstep."),
("5 Marla Starter Home","Block C, Bahria Town Phase 8","Rawalpindi","46220",16500000,3,3,1125,1,2019,"SOLD",False,"HOUSE","SALE","UNFURNISHED",["Garage","Garden","Laundry"],["Near Bahria Grand Mosque","Corner plot","Low maintenance"],"A compact 5 Marla starter home on a corner plot in Bahria Town Phase 8, ideal for young families."),
("Zamzama Studio","Zamzama Commercial, DHA Phase 5","Karachi","75500",85000,0,1,500,0,2014,"AVAILABLE",False,"STUDIO","RENT","FURNISHED",["Laundry","Security","Backup Generator"],["Cafe strip downstairs","Updated bathroom","Bike parking"],"A sunny furnished studio above Zamzama's cafe strip, ready to move in with secure entry and generator backup."),
("Smart Home in DHA Phase 7","Block S, DHA Phase 7","Lahore","54792",65000000,5,5,2250,2,2024,"AVAILABLE",False,"HOUSE","SALE","SEMI_FURNISHED",["Smart Home","Solar Panels","Home Office","Garage","Garden"],["10 Marla","Net-metered solar","Imported fittings"],"A brand-new 10 Marla smart home with net-metered solar, imported fittings and two home offices."),
("Gulberg Corner Townhouse","Hali Road, Gulberg II","Lahore","54660",78000000,4,4,2700,2,2010,"PENDING",False,"TOWNHOUSE","SALE","UNFURNISHED",["Fireplace","Garden","Laundry"],["12 Marla","Walk to Liberty Market","Private courtyard"],"A 12 Marla townhouse on a quiet Gulberg street with a private courtyard and Liberty Market a short walk away."),
("2 Kanal Farmhouse Estate","Bedian Road","Lahore","54810",320000000,6,7,9000,6,2018,"AVAILABLE",True,"VILLA","SALE","FURNISHED",["Pool","Spa","Gym","Home Theater","Garden","Security","Smart Home"],["Gated estate","Guest annexe","Orchard and lawns"],"A gated 2 Kanal farmhouse estate on Bedian Road with a guest annexe, home cinema, pool and lawns lined with fruit trees."),
("Blue Area Apartment","Jinnah Avenue, Blue Area","Islamabad","44000",220000,2,2,1400,1,2019,"AVAILABLE",False,"APARTMENT","RENT","UNFURNISHED",["Gym","Balcony","Elevator","Security"],["Margalla views","Walk to offices","Backup power"],"A bright two-bed apartment on Jinnah Avenue, walking distance to Blue Area offices, with Margalla views from the balcony."),
("DHA Islamabad Villa","Sector F, DHA Phase 2","Islamabad","46000",550000,5,5,4500,3,2020,"AVAILABLE",False,"VILLA","RENT","FURNISHED",["Pool","Garage","Garden","Security"],["1 Kanal","Near GT Road","Separate guest wing"],"A fully furnished 1 Kanal villa in DHA Islamabad with a private pool and a separate guest wing."),
("Defence View Family House","Khayaban-e-Shamsheer, DHA Phase 5","Karachi","75500",320000,4,4,2250,2,2008,"RENTED",False,"HOUSE","RENT","SEMI_FURNISHED",["Garden","Fireplace","Pet Friendly"],["500 sq yd","Water bore","Near Sea View"],"A comfortable family house on Khayaban-e-Shamsheer with its own water bore and Sea View a few minutes away."),
("Emaar Canyon Views Penthouse","Canyon Views, DHA Phase 2","Islamabad","46000",650000,3,3,3000,2,2021,"AVAILABLE",True,"PENTHOUSE","RENT","FURNISHED",["Pool","Gym","Concierge","Rooftop Terrace","Security","Smart Home"],["Private rooftop","Margalla views","Gated community"],"A furnished penthouse at Emaar Canyon Views with its own rooftop and sweeping views of the Margalla Hills."),
("Wapda Town Townhouse","Block E, Wapda Town","Lahore","54770",19500000,3,3,1575,1,2014,"AVAILABLE",False,"TOWNHOUSE","SALE","UNFURNISHED",["Garage","Laundry","Pet Friendly"],["7 Marla","New tiles","Near Canal Road"],"An affordable, move-in-ready 7 Marla townhouse in Wapda Town with new flooring and quick access to Canal Road."),
("Saddar Furnished Flat","Mall Road, Saddar","Rawalpindi","46000",75000,1,1,800,1,2017,"AVAILABLE",False,"APARTMENT","RENT","FURNISHED",["Gym","Elevator","Laundry"],["Near Metro station","Walk to Saddar bazaar","Large wardrobes"],"A furnished one-bed on Mall Road, close to the Metro and Saddar's bazaars."),
("DHA Phase 8 Modern Home","Street 18, Ex Air Avenue, DHA Phase 8","Lahore","54792",110000000,5,6,4500,3,2023,"AVAILABLE",False,"HOUSE","SALE","SEMI_FURNISHED",["Pool","Garden","Smart Home","Fireplace","Security"],["1 Kanal","Glass façade","Indoor pool"],"An architect-designed 1 Kanal home in DHA Phase 8 with a glass façade, indoor pool and landscaped lawn."),
]
COVERS=[f"/properties/house-{n}.jpg" for n in ['11','27','17','22','24','15','28','14','18','36','25','16','21','35','33','19','23','13','34','29','26','20','31','30','32']]
def maps(a,c):
    from urllib.parse import quote_plus
    return 'https://www.google.com/maps/search/?api=1&query='+quote_plus(f'{a}, {c}, Pakistan')
def q(s): return "'"+str(s).replace("'","''")+"'"
def arr(a): return "ARRAY["+",".join(q(x) for x in a)+"]::TEXT[]"
out=["-- Demo data: 25 marketplace properties. Applied with `supabase db push --include-seed`.",
"-- Safe to re-run: clears demo properties first (images cascade).",
"DELETE FROM properties WHERE source = 'demo';",""]
n=len(P)
for i,p in enumerate(P):
    (t,a,c,z,pr,b,ba,sq,pk,yr,st,ft,ty,lt,fu,am,fe,de)=p
    ag=AG[i%len(AG)]
    days=(n-i)*3
    cover=COVERS[i]
    imgs=[cover]+(['/properties/house-12.jpg'] if t=='2 Kanal Farmhouse Estate' else [])+[U(INT[(i*2+k)%len(INT)]) for k in range(2)]
    out.append(f"""WITH p AS (
  INSERT INTO properties (title,address,city,zip,google_maps_url,rent_price,bedrooms,bathrooms,sqft,garage,year_built,status,featured,property_type,listing_type,furnishing,amenities,features,highlights,description,agent_name,agent_phone,agent_email,agent_photo_url,source,created_at)
  VALUES ({q(t)},{q(a)},{q(c)},{q(z)},{q(maps(a,c))},{pr},{b},{ba},{sq},{pk},{yr},'AVAILABLE',{str(ft).lower()},{q(ty)},{q(lt)},{q(fu)},{arr(am)},{arr(fe)},{arr(fe)},{q(de)},{q(ag[0])},{q(ag[1])},{q(ag[2])},{q(ag[3])},'demo',NOW() - INTERVAL '{days} days')
  RETURNING id
)
INSERT INTO property_images (property_id, storage_url, display_order)
SELECT id, url, ord FROM p, (VALUES {",".join(f"({q(im)},{k})" for k,im in enumerate(imgs))}) AS v(url, ord);
""")
out.append("""-- A few sample inquiries so the dashboard isn't empty
INSERT INTO leads (name,email,phone,type,message,property_id)
SELECT 'Ayesha Siddiqui','ayesha@example.test','+92 300 555 0101','TENANT','Assalam o Alaikum, is this still available? Can I visit this weekend?', id FROM properties WHERE title='Gulberg Furnished Apartment' AND source='demo';
INSERT INTO leads (name,email,phone,type,message,property_id)
SELECT 'Usman Tariq','usman@example.test','+92 321 555 0102','GENERAL','Is the file transfer and registry clear? Any room on the demand?', id FROM properties WHERE title='10 Marla Family Home' AND source='demo';
""")
out.append(open(os.path.join(os.path.dirname(sys.argv[1]),"seed-dashboard-leads.sql")).read())
open(sys.argv[1],'w').write("\n".join(out))
print(n,"properties")
