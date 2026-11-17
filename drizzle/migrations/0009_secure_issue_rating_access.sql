DROP POLICY IF EXISTS "Reporters can add ratings for their issues" ON public.satisfaction_ratings;
CREATE POLICY "Reporters can rate their closed issues"
ON public.satisfaction_ratings FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.issues AS i
    WHERE i.id = issue_id
      AND i.user_id = auth.uid()
      AND i.status = 'closed'::public.issue_status
  )
);