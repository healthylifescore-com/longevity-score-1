-- Secure email_otps table: remove public access and rely on service role for edge functions

-- Ensure RLS is enabled
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive policies if they exist
DROP POLICY IF EXISTS "Anyone can insert OTP requests" ON public.email_otps;
DROP POLICY IF EXISTS "Anyone can read their OTP" ON public.email_otps;
DROP POLICY IF EXISTS "Anyone can update their OTP verification" ON public.email_otps;

-- Do NOT create any public policies. Edge functions use the service role key and bypass RLS.
-- This prevents clients (anon/authenticated) from reading or writing OTPs directly.

-- Revoke any grants from public roles to be extra safe
REVOKE ALL ON TABLE public.email_otps FROM anon;
REVOKE ALL ON TABLE public.email_otps FROM authenticated;
REVOKE ALL ON TABLE public.email_otps FROM PUBLIC;

-- Optional: tighten function privileges (cleanup_expired_otps should be SECURITY DEFINER already)
-- Keeping as-is; edge functions call it with service role.
