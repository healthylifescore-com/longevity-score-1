-- Fix security issue: Secure quiz_responses table to prevent data theft

-- Update the INSERT policy to be more restrictive
-- Remove the overly permissive "Anyone can insert" policy
DROP POLICY IF EXISTS "Anyone can insert quiz responses" ON public.quiz_responses;

-- Create new INSERT policy that only allows authenticated users to insert their own data
-- OR allows anonymous users to insert with null user_id (for the quiz flow)
CREATE POLICY "Controlled quiz response insertion" 
ON public.quiz_responses 
FOR INSERT 
WITH CHECK (
  -- Authenticated users can only insert with their own user_id
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
  OR 
  -- Anonymous users can only insert with null user_id (for anonymous quiz flow)
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Update the SELECT policy to be more secure
-- Remove the current policy that might have vulnerabilities
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON public.quiz_responses;

-- Create new SELECT policy that only allows authenticated users to view their own data
-- Anonymous quiz responses should NOT be accessible through the API
CREATE POLICY "Authenticated users can view their own quiz responses" 
ON public.quiz_responses 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Add admin policy for managing quiz responses
CREATE POLICY "Admins can view all quiz responses" 
ON public.quiz_responses 
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

-- Prevent any UPDATE or DELETE operations by regular users for data integrity
-- Only admins should be able to modify quiz responses
CREATE POLICY "Only admins can modify quiz responses" 
ON public.quiz_responses 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "Only admins can delete quiz responses" 
ON public.quiz_responses 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);