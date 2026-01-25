-- Create enum for issue status
CREATE TYPE public.issue_status AS ENUM ('reported', 'assigned', 'in_progress', 'closed');

-- Create enum for issue category
CREATE TYPE public.issue_category AS ENUM ('garbage', 'roads', 'drainage', 'streetlights', 'parks', 'stray_dogs');

-- Create issues table
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id TEXT NOT NULL UNIQUE,
  category issue_category NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  reporter_name TEXT NOT NULL,
  reporter_contact TEXT NOT NULL,
  image_url TEXT,
  status issue_status NOT NULL DEFAULT 'reported',
  assigned_to TEXT,
  resolution_notes TEXT,
  resolution_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read issues (public transparency)
CREATE POLICY "Anyone can view issues"
ON public.issues FOR SELECT
USING (true);

-- Allow anyone to create issues (public reporting)
CREATE POLICY "Anyone can create issues"
ON public.issues FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_issues_updated_at
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate tracking ID
CREATE OR REPLACE FUNCTION public.generate_tracking_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tracking_id = 'CIV-' || UPPER(SUBSTRING(NEW.id::text, 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-generate tracking ID
CREATE TRIGGER generate_issue_tracking_id
BEFORE INSERT ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.generate_tracking_id();

-- Create officials table
CREATE TABLE public.officials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on officials
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read officials
CREATE POLICY "Anyone can view officials"
ON public.officials FOR SELECT
USING (true);

-- Insert default officials
INSERT INTO public.officials (name, department) VALUES
  ('Ramesh Kumar', 'Sanitation'),
  ('Priya Singh', 'Roads & Infrastructure'),
  ('Arun Sharma', 'Drainage'),
  ('Lakshmi Devi', 'Electrical'),
  ('Vijay Reddy', 'Parks & Recreation'),
  ('Meera Nair', 'Animal Control');

-- Enable realtime for issues
ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;