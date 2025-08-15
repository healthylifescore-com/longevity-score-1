-- Fix security issue: Restrict affiliate_clicks table access to admins only
-- Remove the public read policy that exposes sensitive marketing data
DROP POLICY IF EXISTS "Anyone can view clicks" ON public.affiliate_clicks;

-- Create new policy that only allows admins to view affiliate click data
CREATE POLICY "Only admins can view affiliate clicks" 
ON public.affiliate_clicks 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Keep the insert policy as-is since clicks need to be tracked from public redirect links
-- This allows the redirect functionality to continue working