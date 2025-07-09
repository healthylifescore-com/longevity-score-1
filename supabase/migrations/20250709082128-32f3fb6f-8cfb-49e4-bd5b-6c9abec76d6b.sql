-- Create table to store OTP codes for email verification
CREATE TABLE public.email_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '5 minutes'),
  verified BOOLEAN NOT NULL DEFAULT false,
  attempt_count INTEGER NOT NULL DEFAULT 0
);

-- Create index for faster lookups
CREATE INDEX idx_email_otps_email_code ON public.email_otps(email, otp_code) WHERE NOT verified;
CREATE INDEX idx_email_otps_expires_at ON public.email_otps(expires_at);

-- Enable RLS
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for OTP verification)
CREATE POLICY "Anyone can insert OTP requests" 
ON public.email_otps 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read their OTP" 
ON public.email_otps 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update their OTP verification" 
ON public.email_otps 
FOR UPDATE 
USING (true);

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.email_otps 
  WHERE expires_at < now();
END;
$$;