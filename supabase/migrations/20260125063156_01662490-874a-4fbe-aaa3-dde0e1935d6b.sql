-- Add area column to issues table
ALTER TABLE public.issues ADD COLUMN area text;

-- Update the area column to be required for new issues
-- First, let's set existing issues to have a default area
UPDATE public.issues SET area = 'Koramangala' WHERE area IS NULL;