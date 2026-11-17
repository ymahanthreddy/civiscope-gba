DROP POLICY IF EXISTS "Signed-in owners can upload issue images" ON storage.objects;
CREATE POLICY "Issue reporters can upload to their own folder"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'issue-images'
  AND (storage.foldername(name))[1] = COALESCE((SELECT auth.uid()::text), 'anonymous')
);