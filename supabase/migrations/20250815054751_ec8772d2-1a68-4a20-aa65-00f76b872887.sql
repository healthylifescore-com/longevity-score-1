-- Fix critical security issue: Secure the email_otps table with proper RLS policies
-- Enable Row Level Security on email_otps table
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role (edge functions) to perform all operations
-- This ensures the send-otp and verify-otp edge functions continue to work
CREATE POLICY "Service role can manage OTPs" 
ON public.email_otps 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Create policy to allow authenticated users to only view their own OTP status (not the code)
-- This allows users to check if they have a pending OTP but not see the actual code
CREATE POLICY "Users can view their own OTP status" 
ON public.email_otps 
FOR SELECT 
TO authenticated
USING (false); -- Completely restrict access for now - edge functions will handle all OTP operations

-- Note: We're not allowing any public access to prevent OTP code exposure
-- All OTP operations will be handled through edge functions using service role