ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS skills text[],
  ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.worker_profiles.full_name IS 'Display name of the municipal worker';
COMMENT ON COLUMN public.worker_profiles.skills IS 'List of worker specializations/departments';
COMMENT ON COLUMN public.worker_profiles.city_id IS 'City the worker is based in';