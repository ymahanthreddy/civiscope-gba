DROP POLICY IF EXISTS "Anyone can upload issue images" ON storage.objects;
CREATE POLICY "Signed-in owners can upload issue images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'issue-images'
  AND owner_id = (SELECT auth.uid()::text)
);