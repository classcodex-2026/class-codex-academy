
-- course-thumbnails: public read, admin write
CREATE POLICY "thumbnails public read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'course-thumbnails');
CREATE POLICY "thumbnails admin write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'course-thumbnails' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'course-thumbnails' AND public.has_role(auth.uid(), 'admin'));

-- course-pdfs: admin + enrolled-student read; admin write. Path: <course_id>/...
CREATE POLICY "pdfs enrolled read" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'course-pdfs'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.is_enrolled(auth.uid(), ((storage.foldername(name))[1])::uuid)
    )
  );
CREATE POLICY "pdfs admin write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'course-pdfs' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'course-pdfs' AND public.has_role(auth.uid(), 'admin'));

-- course-resources: same rules
CREATE POLICY "resources enrolled read" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'course-resources'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.is_enrolled(auth.uid(), ((storage.foldername(name))[1])::uuid)
    )
  );
CREATE POLICY "resources admin write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'course-resources' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'course-resources' AND public.has_role(auth.uid(), 'admin'));
