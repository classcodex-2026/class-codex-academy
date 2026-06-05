DROP POLICY IF EXISTS "Anyone submits requests" ON public.consultation_requests;

CREATE POLICY "Anyone submits requests"
  ON public.consultation_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) > 0
    AND length(btrim(email)) BETWEEN 3 AND 320
    AND email LIKE '%_@_%.__%'
    AND length(coalesce(requirement, '')) <= 5000
  );