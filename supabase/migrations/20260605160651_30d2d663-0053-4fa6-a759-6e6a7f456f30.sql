
-- Public read for the 4 buckets so we can use public URLs on the website
CREATE POLICY "Public read content buckets" ON storage.objects FOR SELECT
USING (bucket_id IN ('course-banners','webinar-banners','course-videos','site-assets'));

-- Admins can write
CREATE POLICY "Admins upload to content buckets" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('course-banners','webinar-banners','course-videos','site-assets') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update content buckets" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('course-banners','webinar-banners','course-videos','site-assets') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete content buckets" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('course-banners','webinar-banners','course-videos','site-assets') AND public.has_role(auth.uid(),'admin'));
