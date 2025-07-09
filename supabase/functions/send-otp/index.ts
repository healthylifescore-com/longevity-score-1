import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendOTPRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean up any existing unverified OTPs for this email
    await supabase
      .from('email_otps')
      .delete()
      .eq('email', email)
      .eq('verified', false);

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('email_otps')
      .insert({
        email,
        otp_code: otpCode,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store OTP');
    }

    // Send OTP via email
    const emailResponse = await resend.emails.send({
      from: "Longevity Quiz <onboarding@resend.dev>",
      to: [email],
      subject: "Your Verification Code - Longevity Quiz",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Email Verification</h1>
          <p>Thank you for completing the longevity quiz! To receive your personalized results, please verify your email address.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; color: #1f2937;">Your Verification Code</h2>
            <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 10px 0;">
              ${otpCode}
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">This code expires in 5 minutes</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This email was sent from the Longevity Quiz application.
          </p>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent to your email" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send verification code" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);