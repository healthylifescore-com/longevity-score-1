-- Create affiliate_clicks table for tracking link clicks
CREATE TABLE public.affiliate_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id TEXT NOT NULL,
  user_email TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliate_clicks
CREATE POLICY "Anyone can insert clicks" 
ON public.affiliate_clicks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view clicks" 
ON public.affiliate_clicks 
FOR SELECT 
USING (true);