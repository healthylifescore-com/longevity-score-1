-- Fix security issue: Add user ownership and proper RLS policies to longevity-score table

-- First, add a user_id column to link scores to users
ALTER TABLE public."longevity-score" 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance on user_id lookups
CREATE INDEX idx_longevity_score_user_id ON public."longevity-score"(user_id);

-- Create RLS policy for users to view their own scores
CREATE POLICY "Users can view their own longevity scores" 
ON public."longevity-score" 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Create RLS policy for users to insert their own scores
CREATE POLICY "Users can insert their own longevity scores" 
ON public."longevity-score" 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create RLS policy for users to update their own scores
CREATE POLICY "Users can update their own longevity scores" 
ON public."longevity-score" 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create RLS policy for admins to view all scores
CREATE POLICY "Admins can view all longevity scores" 
ON public."longevity-score" 
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

-- Create RLS policy for admins to manage all scores
CREATE POLICY "Admins can manage all longevity scores" 
ON public."longevity-score" 
FOR ALL 
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