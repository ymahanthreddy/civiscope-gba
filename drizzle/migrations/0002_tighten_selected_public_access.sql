DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile or admins can view profiles"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can view comments" ON public.issue_comments;
DROP POLICY IF EXISTS "Authenticated users can add comments" ON public.issue_comments;
CREATE POLICY "Users can view own comments or admins can view comments"
ON public.issue_comments FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Users can add comments as themselves"
ON public.issue_comments FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can add ratings" ON public.satisfaction_ratings;
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.satisfaction_ratings;
CREATE POLICY "Reporters can add ratings for their issues"
ON public.satisfaction_ratings FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.issues AS i
    WHERE i.id = issue_id AND i.user_id = auth.uid()
  )
);
CREATE POLICY "Users can view own ratings or admins can view ratings"
ON public.satisfaction_ratings FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can create issues" ON public.issues;
CREATE POLICY "Anonymous or signed-in users can create their own reports"
ON public.issues FOR INSERT TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL)
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can view officials" ON public.officials;
CREATE POLICY "Admins can view officials"
ON public.officials FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
REVOKE SELECT ON public.officials FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.officials TO service_role;
CREATE OR REPLACE VIEW public.public_officials
WITH (security_barrier = true)
AS SELECT id, name, department, created_at FROM public.officials;
GRANT SELECT ON public.public_officials TO anon, authenticated;
GRANT ALL ON public.public_officials TO service_role;

DROP POLICY IF EXISTS "Anyone can update issue images" ON storage.objects;
CREATE POLICY "Owners can update their issue images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'issue-images' AND owner_id = (SELECT auth.uid()::text))
WITH CHECK (bucket_id = 'issue-images' AND owner_id = (SELECT auth.uid()::text));