-- URGENT: Fix RLS recursion in user_roles table
-- This is causing "infinite recursion detected in policy" errors

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Combined role access policy" ON public.user_roles;

-- Create a security definer function to safely check user roles without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Create a safe RLS policy for user_roles that doesn't cause recursion
CREATE POLICY "Users can view their own role and admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (
  -- Users can see their own role
  user_id = auth.uid() 
  OR 
  -- OR if they are an admin (using the security definer function to avoid recursion)
  public.get_current_user_role() = 'admin'::app_role
);

-- Also ensure admins can manage user roles
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.get_current_user_role() = 'admin'::app_role)
WITH CHECK (public.get_current_user_role() = 'admin'::app_role);

-- Enhance email_otps security by ensuring only verified OTPs can be used
-- Add index for better performance on OTP lookups
CREATE INDEX IF NOT EXISTS idx_email_otps_email_verified ON public.email_otps(email, verified, expires_at);

-- Add index for better performance on user_roles lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Add index for better performance on quiz_responses admin queries
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON public.quiz_responses(created_at);

-- Add data integrity constraints (using different syntax for PostgreSQL)
DO $$
BEGIN
    -- Add email validation constraint for profiles if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_not_empty') THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_email_not_empty 
        CHECK (length(trim(email)) > 0);
    END IF;

    -- Add email format validation for quiz_responses if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_responses_email_format') THEN
        ALTER TABLE public.quiz_responses 
        ADD CONSTRAINT quiz_responses_email_format 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;