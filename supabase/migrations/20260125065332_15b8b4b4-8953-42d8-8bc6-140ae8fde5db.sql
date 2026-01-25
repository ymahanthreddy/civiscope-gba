-- Create storage bucket for issue images
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-images', 'issue-images', true);

-- Allow anyone to upload images to the bucket
CREATE POLICY "Anyone can upload issue images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-images');

-- Allow anyone to view issue images
CREATE POLICY "Issue images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-images');

-- Allow anyone to update their uploaded images
CREATE POLICY "Anyone can update issue images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'issue-images');