
-- Add worker to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'worker';

-- Create worker status enum
CREATE TYPE public.worker_status AS ENUM ('pending', 'approved', 'rejected');

-- Create priority enum
CREATE TYPE public.issue_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create worker_profiles table
CREATE TABLE public.worker_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  department TEXT NOT NULL,
  phone TEXT,
  specialization TEXT,
  status public.worker_status NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view approved workers" ON public.worker_profiles
  FOR SELECT USING (
    status = 'approved' OR 
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Workers can update own profile" ON public.worker_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert worker profile" ON public.worker_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any worker profile" ON public.worker_profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Add columns to issues table
ALTER TABLE public.issues 
  ADD COLUMN IF NOT EXISTS priority public.issue_priority DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS assigned_worker_id UUID,
  ADD COLUMN IF NOT EXISTS satisfaction_rating INTEGER;

-- Create issue_comments table
CREATE TABLE public.issue_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID,
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'note',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON public.issue_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add comments" ON public.issue_comments
  FOR INSERT WITH CHECK (true);

-- Create satisfaction_ratings table
CREATE TABLE public.satisfaction_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID,
  reporter_contact TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(issue_id)
);

ALTER TABLE public.satisfaction_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON public.satisfaction_ratings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add ratings" ON public.satisfaction_ratings
  FOR INSERT WITH CHECK (true);

-- Update issues SELECT policy to include workers seeing assigned issues
DROP POLICY IF EXISTS "Users can view own issues or admin views all" ON public.issues;
CREATE POLICY "Users can view relevant issues" ON public.issues
  FOR SELECT USING (
    (user_id = auth.uid()) OR 
    (user_id IS NULL) OR 
    public.has_role(auth.uid(), 'admin') OR
    (assigned_worker_id = auth.uid())
  );

-- Allow workers to update assigned issues
CREATE POLICY "Workers can update assigned issues" ON public.issues
  FOR UPDATE USING (assigned_worker_id = auth.uid());

-- Create SLA trigger function
CREATE OR REPLACE FUNCTION public.set_sla_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sla_deadline IS NULL THEN
    CASE NEW.priority
      WHEN 'critical' THEN NEW.sla_deadline = NEW.created_at + INTERVAL '24 hours';
      WHEN 'high' THEN NEW.sla_deadline = NEW.created_at + INTERVAL '48 hours';
      WHEN 'medium' THEN NEW.sla_deadline = NEW.created_at + INTERVAL '72 hours';
      WHEN 'low' THEN NEW.sla_deadline = NEW.created_at + INTERVAL '7 days';
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_issue_sla_deadline
  BEFORE INSERT ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.set_sla_deadline();

-- Add realtime for worker_profiles and issue_comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.worker_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.issue_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.satisfaction_ratings;
