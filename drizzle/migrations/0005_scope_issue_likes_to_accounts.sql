DROP POLICY IF EXISTS "Anyone can view likes" ON public.issue_likes;
DROP POLICY IF EXISTS "Users can like issues" ON public.issue_likes;
CREATE POLICY "Users can view own likes or admins can view likes"
ON public.issue_likes FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Signed-in users can like as themselves"
ON public.issue_likes FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_issue_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.issues
    SET likes_count = COALESCE(likes_count, 0) + 1
    WHERE id = NEW.issue_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.issues
    SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
    WHERE id = OLD.issue_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE TRIGGER sync_issue_likes_count_after_change
AFTER INSERT OR DELETE ON public.issue_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_issue_likes_count();