-- Cities table for multi-city support
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius_km DOUBLE PRECISION NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON public.cities FOR SELECT USING (true);
GRANT SELECT ON public.cities TO anon, authenticated;
GRANT ALL ON public.cities TO service_role;

-- City areas table
CREATE TABLE public.city_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude double precision,
  longitude double precision,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(city_id, name)
);
ALTER TABLE public.city_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "City areas are viewable by everyone" ON public.city_areas FOR SELECT USING (true);
GRANT SELECT ON public.city_areas TO anon, authenticated;
GRANT ALL ON public.city_areas TO service_role;

-- Seed cities
INSERT INTO public.cities (name, state, latitude, longitude, radius_km) VALUES
  ('Bengaluru', 'Karnataka', 12.9716, 77.5946, 40),
  ('Mumbai', 'Maharashtra', 19.0760, 72.8777, 50),
  ('Delhi', 'Delhi', 28.6139, 77.2090, 50),
  ('Chennai', 'Tamil Nadu', 13.0827, 80.2707, 40),
  ('Hyderabad', 'Telangana', 17.3850, 78.4867, 45),
  ('Kolkata', 'West Bengal', 22.5726, 88.3639, 40),
  ('Pune', 'Maharashtra', 18.5204, 73.8567, 35),
  ('Ahmedabad', 'Gujarat', 23.0225, 72.5714, 40),
  ('Jaipur', 'Rajasthan', 26.9124, 75.7873, 35),
  ('Lucknow', 'Uttar Pradesh', 26.8467, 80.9462, 35);

-- Seed areas for each city (backfill as part of this additive change)
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Koramangala'),('Indiranagar'),('Whitefield'),('Jayanagar'),('Malleshwaram'),('HSR Layout'),('BTM Layout'),('Electronic City'),('Marathahalli'),('Yelahanka'),('Hebbal'),('Banashankari'),('JP Nagar'),('Rajajinagar'),('Basavanagudi')) AS a(name) WHERE c.name = 'Bengaluru';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Andheri'),('Bandra'),('Juhu'),('Powai'),('Dadar'),('Worli'),('Colaba'),('Goregaon'),('Malad'),('Borivali')) AS a(name) WHERE c.name = 'Mumbai';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Connaught Place'),('Karol Bagh'),('Dwarka'),('Rohini'),('Saket'),('Hauz Khas'),('Lajpat Nagar'),('Janakpuri'),('Pitampura'),('Vasant Kunj')) AS a(name) WHERE c.name = 'Delhi';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('T. Nagar'),('Adyar'),('Anna Nagar'),('Velachery'),('Mylapore'),('Porur'),('Tambaram'),('Guindy'),('Nungambakkam'),('Besant Nagar')) AS a(name) WHERE c.name = 'Chennai';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Banjara Hills'),('Jubilee Hills'),('Madhapur'),('Gachibowli'),('Secunderabad'),('Begumpet'),('Ameerpet'),('Kukatpally'),('Miyapur'),('Kondapur')) AS a(name) WHERE c.name = 'Hyderabad';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Salt Lake'),('Park Street'),('New Town'),('Alipore'),('Howrah'),('Ballygunge'),('Gariahat'),('Dum Dum'),('Jadavpur'),('Behala')) AS a(name) WHERE c.name = 'Kolkata';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Koregaon Park'),('Hinjewadi'),('Kothrud'),('Viman Nagar'),('Baner'),('Aundh'),('Hadapsar'),('Wakad'),('Shivajinagar'),('Deccan')) AS a(name) WHERE c.name = 'Pune';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Navrangpura'),('Satellite'),('Bodakdev'),('Maninagar'),('Vastrapur'),('SG Highway'),('Paldi'),('Ambawadi'),('Chandkheda'),('Bopal')) AS a(name) WHERE c.name = 'Ahmedabad';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Malviya Nagar'),('Vaishali Nagar'),('C-Scheme'),('Bapu Nagar'),('Jhotwara'),('Mansarovar'),('Vidhyadhar Nagar'),('Raja Park'),('Jagatpura'),('Sanganer')) AS a(name) WHERE c.name = 'Jaipur';
INSERT INTO public.city_areas (city_id, name) SELECT c.id, a.name FROM public.cities c, (VALUES ('Hazratganj'),('Gomti Nagar'),('Alambagh'),('Aminabad'),('Indira Nagar'),('Aliganj'),('Mahanagar'),('Chinhat'),('Jankipuram'),('Vibhuti Khand')) AS a(name) WHERE c.name = 'Lucknow';

-- Area coordinates (backfill for map hotspots)
UPDATE public.city_areas SET latitude = 12.9352, longitude = 77.6245 WHERE name = 'Koramangala' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9784, longitude = 77.6408 WHERE name = 'Indiranagar' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9081, longitude = 77.6476 WHERE name = 'HSR Layout' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9698, longitude = 77.7500 WHERE name = 'Whitefield' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.8399, longitude = 77.6770 WHERE name = 'Electronic City' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9308, longitude = 77.5838 WHERE name = 'Jayanagar' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9063, longitude = 77.5857 WHERE name = 'JP Nagar' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9166, longitude = 77.6101 WHERE name = 'BTM Layout' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9591, longitude = 77.6974 WHERE name = 'Marathahalli' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 13.0035, longitude = 77.5647 WHERE name = 'Malleshwaram' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9910, longitude = 77.5498 WHERE name = 'Rajajinagar' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9255, longitude = 77.5468 WHERE name = 'Banashankari' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 12.9435, longitude = 77.5753 WHERE name = 'Basavanagudi' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 13.0358, longitude = 77.5970 WHERE name = 'Hebbal' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 13.1005, longitude = 77.5960 WHERE name = 'Yelahanka' AND city_id = (SELECT id FROM cities WHERE name = 'Bengaluru');
UPDATE public.city_areas SET latitude = 19.1136, longitude = 72.8697 WHERE name = 'Andheri' AND city_id = (SELECT id FROM cities WHERE name = 'Mumbai');
UPDATE public.city_areas SET latitude = 18.9220, longitude = 72.8347 WHERE name = 'Colaba' AND city_id = (SELECT id FROM cities WHERE name = 'Mumbai');
UPDATE public.city_areas SET latitude = 19.1860, longitude = 72.8489 WHERE name = 'Borivali' AND city_id = (SELECT id FROM cities WHERE name = 'Mumbai');
UPDATE public.city_areas SET latitude = 19.0330, longitude = 72.8411 WHERE name = 'Dadar' AND city_id = (SELECT id FROM cities WHERE name = 'Mumbai');
UPDATE public.city_areas SET latitude = 19.0596, longitude = 72.8295 WHERE name = 'Worli' AND city_id = (SELECT id FROM cities WHERE name = 'Mumbai');
UPDATE public.city_areas SET latitude = 19.0760, longitude = 72.8777 WHERE name = 'Bandra' AND city_id = (SELECT id FROM cities WHERE name = 'Mumbai');
UPDATE public.city_areas SET latitude = 28.6315, longitude = 77.2167 WHERE name = 'Connaught Place' AND city_id = (SELECT id FROM cities WHERE name = 'Delhi');
UPDATE public.city_areas SET latitude = 28.5921, longitude = 77.0460 WHERE name = 'Dwarka' AND city_id = (SELECT id FROM cities WHERE name = 'Delhi');
UPDATE public.city_areas SET latitude = 28.5494, longitude = 77.2001 WHERE name = 'Hauz Khas' AND city_id = (SELECT id FROM cities WHERE name = 'Delhi');
UPDATE public.city_areas SET latitude = 28.6214, longitude = 77.0819 WHERE name = 'Janakpuri' AND city_id = (SELECT id FROM cities WHERE name = 'Delhi');
UPDATE public.city_areas SET latitude = 28.6519, longitude = 77.1905 WHERE name = 'Karol Bagh' AND city_id = (SELECT id FROM cities WHERE name = 'Delhi');
UPDATE public.city_areas SET latitude = 13.0067, longitude = 80.2206 WHERE name = 'Adyar' AND city_id = (SELECT id FROM cities WHERE name = 'Chennai');
UPDATE public.city_areas SET latitude = 13.0850, longitude = 80.2101 WHERE name = 'Anna Nagar' AND city_id = (SELECT id FROM cities WHERE name = 'Chennai');
UPDATE public.city_areas SET latitude = 13.0002, longitude = 80.2659 WHERE name = 'Besant Nagar' AND city_id = (SELECT id FROM cities WHERE name = 'Chennai');
UPDATE public.city_areas SET latitude = 13.0418, longitude = 80.2341 WHERE name = 'T. Nagar' AND city_id = (SELECT id FROM cities WHERE name = 'Chennai');
UPDATE public.city_areas SET latitude = 12.9815, longitude = 80.2180 WHERE name = 'Velachery' AND city_id = (SELECT id FROM cities WHERE name = 'Chennai');
UPDATE public.city_areas SET latitude = 17.4156, longitude = 78.4347 WHERE name = 'Banjara Hills' AND city_id = (SELECT id FROM cities WHERE name = 'Hyderabad');
UPDATE public.city_areas SET latitude = 17.4325, longitude = 78.4073 WHERE name = 'Jubilee Hills' AND city_id = (SELECT id FROM cities WHERE name = 'Hyderabad');
UPDATE public.city_areas SET latitude = 17.4484, longitude = 78.3908 WHERE name = 'Madhapur' AND city_id = (SELECT id FROM cities WHERE name = 'Hyderabad');
UPDATE public.city_areas SET latitude = 17.4401, longitude = 78.3489 WHERE name = 'Gachibowli' AND city_id = (SELECT id FROM cities WHERE name = 'Hyderabad');
UPDATE public.city_areas SET latitude = 17.4399, longitude = 78.4983 WHERE name = 'Secunderabad' AND city_id = (SELECT id FROM cities WHERE name = 'Hyderabad');
UPDATE public.city_areas SET latitude = 22.5726, longitude = 88.3639 WHERE name = 'Salt Lake' AND city_id = (SELECT id FROM cities WHERE name = 'Kolkata');
UPDATE public.city_areas SET latitude = 22.5675, longitude = 88.3639 WHERE name = 'Park Street' AND city_id = (SELECT id FROM cities WHERE name = 'Kolkata');
UPDATE public.city_areas SET latitude = 22.5800, longitude = 88.4700 WHERE name = 'New Town' AND city_id = (SELECT id FROM cities WHERE name = 'Kolkata');
UPDATE public.city_areas SET latitude = 18.5074, longitude = 73.8077 WHERE name = 'Koregaon Park' AND city_id = (SELECT id FROM cities WHERE name = 'Pune');
UPDATE public.city_areas SET latitude = 18.5912, longitude = 73.7390 WHERE name = 'Hinjewadi' AND city_id = (SELECT id FROM cities WHERE name = 'Pune');
UPDATE public.city_areas SET latitude = 18.5590, longitude = 73.7868 WHERE name = 'Aundh' AND city_id = (SELECT id FROM cities WHERE name = 'Pune');
UPDATE public.city_areas SET latitude = 18.5623, longitude = 73.9166 WHERE name = 'Viman Nagar' AND city_id = (SELECT id FROM cities WHERE name = 'Pune');
UPDATE public.city_areas SET latitude = 23.0225, longitude = 72.5714 WHERE name = 'Navrangpura' AND city_id = (SELECT id FROM cities WHERE name = 'Ahmedabad');
UPDATE public.city_areas SET latitude = 23.0320, longitude = 72.5070 WHERE name = 'Satellite' AND city_id = (SELECT id FROM cities WHERE name = 'Ahmedabad');
UPDATE public.city_areas SET latitude = 26.9124, longitude = 75.7873 WHERE name = 'Malviya Nagar' AND city_id = (SELECT id FROM cities WHERE name = 'Jaipur');
UPDATE public.city_areas SET latitude = 26.8467, longitude = 80.9462 WHERE name = 'Gomti Nagar' AND city_id = (SELECT id FROM cities WHERE name = 'Lucknow');