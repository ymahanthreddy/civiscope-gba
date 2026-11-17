DROP POLICY IF EXISTS "Anonymous or signed-in users can create basic reports" ON public.issues;
CREATE POLICY "Anonymous or signed-in users can create basic reports"
ON public.issues FOR INSERT TO anon, authenticated
WITH CHECK (
  (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  )
  AND status = 'reported'::public.issue_status
  AND assigned_to IS NULL
  AND assigned_worker_id IS NULL
  AND resolution_notes IS NULL
  AND resolution_image IS NULL
  AND closed_at IS NULL
  AND satisfaction_rating IS NULL
  AND (likes_count IS NULL OR likes_count = 0)
  AND (priority IS NULL OR priority = 'medium'::public.issue_priority)
);