import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otpCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otpCode }: VerifyOTPRequest = await req.json();

    if (!email || !otpCode) {
      return new Response(
        JSON.stringify({ error: "Email and OTP code are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, clean up expired OTPs
    await supabase.rpc('cleanup_expired_otps');

    // Find the OTP record
    const { data: otpRecord, error: fetchError } = await supabase
      .from('email_otps')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (fetchError || !otpRecord) {
      // Increment attempt count for any matching email
      await supabase
        .from('email_otps')
        .update({ attempt_count: supabase.raw('attempt_count + 1') })
        .eq('email', email)
        .eq('verified', false);

      return new Response(
        JSON.stringify({ 
          error: "Invalid or expired verification code",
          verified: false 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check attempt limit (max 3 attempts)
    if (otpRecord.attempt_count >= 2) {
      // Delete the OTP record after max attempts
      await supabase
        .from('email_otps')
        .delete()
        .eq('id', otpRecord.id);

      return new Response(
        JSON.stringify({ 
          error: "Too many failed attempts. Please request a new verification code.",
          verified: false 
        }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('email_otps')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error updating OTP:', updateError);
      throw new Error('Failed to verify OTP');
    }

    // Clean up old verified OTPs for this email
    await supabase
      .from('email_otps')
      .delete()
      .eq('email', email)
      .neq('id', otpRecord.id);

    console.log(`OTP verified successfully for email: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: true,
        message: "Email verified successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to verify code",
        verified: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);