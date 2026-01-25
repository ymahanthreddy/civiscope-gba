-- Add user_id column to issues table to track who created each issue
ALTER TABLE public.issues 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can create issues" ON public.issues;
DROP POLICY IF EXISTS "Anyone can view issues" ON public.issues;
DROP POLICY IF EXISTS "Anyone can update issues" ON public.issues;

-- Create new RLS policies

-- Users can create issues (with their user_id or anonymously)
CREATE POLICY "Users can create issues"
ON public.issues
FOR INSERT
WITH CHECK (true);

-- Users can view their own issues OR admins can view all
CREATE POLICY "Users can view own issues or admin views all"
ON public.issues
FOR SELECT
USING (
  user_id = auth.uid() 
  OR user_id IS NULL 
  OR public.has_role(auth.uid(), 'admin')
);

-- Only admins can update issues
CREATE POLICY "Admins can update issues"
ON public.issues
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));