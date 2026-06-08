
-- Student status enum
CREATE TYPE public.student_status AS ENUM ('active','inactive','graduated','dropped');
CREATE TYPE public.enrollment_approval AS ENUM ('pending','approved','rejected');
CREATE TYPE public.batch_status AS ENUM ('upcoming','running','completed','cancelled');
CREATE TYPE public.attendance_status AS ENUM ('present','absent','late','excused');
CREATE TYPE public.installment_status AS ENUM ('pending','paid','overdue','waived');

-- profiles additions
ALTER TABLE public.profiles
  ADD COLUMN phone text,
  ADD COLUMN status public.student_status NOT NULL DEFAULT 'active',
  ADD COLUMN notes text;

-- Admin write policy on profiles
CREATE POLICY "Admins write profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- courses additions
ALTER TABLE public.courses
  ADD COLUMN capacity integer;

-- BATCHES
CREATE TABLE public.batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  trainer_name text,
  trainer_email text,
  start_date date,
  end_date date,
  schedule text,
  capacity integer,
  status public.batch_status NOT NULL DEFAULT 'upcoming',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batches TO authenticated;
GRANT ALL ON public.batches TO service_role;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read batches" ON public.batches FOR SELECT USING (true);
CREATE POLICY "Admins write batches" ON public.batches FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_batches_updated BEFORE UPDATE ON public.batches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- enrollments additions
ALTER TABLE public.enrollments
  ADD COLUMN batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  ADD COLUMN approval_status public.enrollment_approval NOT NULL DEFAULT 'approved',
  ADD COLUMN total_fee numeric NOT NULL DEFAULT 0,
  ADD COLUMN discount_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN scholarship_note text,
  ADD COLUMN previous_batch_id uuid;

-- payments additions
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'partial';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'due';
