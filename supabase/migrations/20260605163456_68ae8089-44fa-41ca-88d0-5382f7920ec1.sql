-- 1) Lock down private course video URLs: admin-only access
DROP POLICY IF EXISTS "Public read videos" ON public.course_videos;
REVOKE SELECT ON public.course_videos FROM anon;

-- 2) Harden user_roles: replace the catch-all ALL policy with explicit
--    per-command admin-only policies to defend against self-assignment
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;

CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) Restrict SECURITY DEFINER function execution to the minimum required roles
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_first_user_as_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_first_user_as_admin() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_first_user_as_admin() TO service_role;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO service_role;