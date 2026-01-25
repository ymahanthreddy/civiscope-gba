-- Allow updates to issues table for admin portal
CREATE POLICY "Anyone can update issues" 
  ON public.issues 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);