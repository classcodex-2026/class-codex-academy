-- Replace the public-read storage policy so it no longer covers course-videos
DROP POLICY IF EXISTS "Public read content buckets" ON storage.objects;

CREATE POLICY "Public read public content buckets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = ANY (ARRAY['course-banners','webinar-banners','site-assets']));

CREATE POLICY "Admins read course videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));