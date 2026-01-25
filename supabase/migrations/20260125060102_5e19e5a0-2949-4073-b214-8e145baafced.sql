-- Allow authenticated users to update their own role (for admin login flow)
CREATE POLICY "Allow users to update own role" 
ON public.user_roles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);