import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LongevityReportRequest {
  firstName: string;
  lastName: string;
  email: string;
  answers: Record<string, any>;
  results: {
    overallScore: number;
    vitality: 'Low' | 'Moderate' | 'Good' | 'Excellent';
    categoryScores: {
      sleep: number;
      diet: number;
      exercise: number;
      stress: number;
      health: number;
    };
    recommendations: {
      supplements: boolean;
      ketogenic: boolean;
      paleo: boolean;
      specificSupplements: string[];
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, answers, results }: LongevityReportRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store results in database
    const { error: dbError } = await supabase
      .from('quiz_responses')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        answers,
        overall_score: results.overallScore,
        vitality: results.vitality,
        category_scores: results.categoryScores,
        recommendations: results.recommendations,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue with email sending even if DB fails
    }

    // Generate recommendation list for email
    const recommendationsList = [];
    
    if (results.recommendations.supplements) {
      recommendationsList.push('• Consider targeted nutritional supplements to address specific health concerns');
    }
    
    if (results.recommendations.specificSupplements.length > 0) {
      results.recommendations.specificSupplements.forEach(supplement => {
        switch (supplement) {
          case 'PrimeBiome':
            recommendationsList.push('• PrimeBiome: Support your gut health and digestive system');
            break;
          case 'Quietum Plus':
            recommendationsList.push('• Quietum Plus: Natural support for ear health and reducing ringing');
            break;
          case 'ProstaVive':
            recommendationsList.push('• ProstaVive: Comprehensive prostate health support');
            break;
          case 'HepatoBurn':
            recommendationsList.push('• HepatoBurn: Support healthy metabolism and energy levels');
            break;
        }
      });
    }
    
    if (results.recommendations.ketogenic) {
      recommendationsList.push('• Consider a ketogenic diet to optimize metabolic health and energy');
    }
    
    if (results.recommendations.paleo) {
      recommendationsList.push('• Consider a paleo diet to reduce inflammation and improve overall health');
    }
    
    // Add general recommendations based on category scores
    if (results.categoryScores.sleep < 70) {
      recommendationsList.push('• Focus on improving sleep quality and consistency (aim for 7-9 hours)');
    }
    
    if (results.categoryScores.exercise < 70) {
      recommendationsList.push('• Increase physical activity with regular exercise (3-5 times per week)');
    }
    
    if (results.categoryScores.stress < 70) {
      recommendationsList.push('• Implement stress management techniques like meditation or deep breathing');
    }
    
    if (results.categoryScores.diet < 70) {
      recommendationsList.push('• Improve your diet with more whole foods and less processed options');
    }
    
    const recommendationsText = recommendationsList.join('\n');

    // Send email with results
    const emailResponse = await resend.emails.send({
      from: "Longevity Assessment <onboarding@resend.dev>",
      to: [email],
      subject: `Your Longevity Score: ${results.overallScore}/100 - ${results.vitality}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Longevity Report</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Personalized Health & Vitality Assessment</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${firstName}!</h2>
            <p style="color: #6b7280; line-height: 1.6;">Thank you for completing our comprehensive longevity assessment. Here are your personalized results:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0;">Your Longevity Score</h3>
              <div style="font-size: 48px; font-weight: bold; color: #3b82f6; margin: 10px 0;">${results.overallScore}/100</div>
              <div style="font-size: 20px; color: #6b7280; font-weight: 500;">${results.vitality}</div>
            </div>

            <h3 style="color: #1f2937; margin: 30px 0 15px 0;">Your Category Scores:</h3>
            <div style="margin-bottom: 30px;">
              ${Object.entries(results.categoryScores)
                .map(([category, score]) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #374151; font-weight: 500;">${category}</span>
                    <span style="color: #3b82f6; font-weight: bold;">${score}/100</span>
                  </div>
                `).join('')}
            </div>

            <h3 style="color: #1f2937; margin: 30px 0 15px 0;">Your Personalized Recommendations:</h3>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <pre style="color: #92400e; line-height: 1.6; white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">${recommendationsText}</pre>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
              <p style="color: #065f46; margin: 0; font-weight: 500;">🎯 Take Action Today!</p>
              <p style="color: #047857; margin: 10px 0 0 0; line-height: 1.6;">Start implementing these recommendations to improve your longevity score and overall health. Small consistent changes lead to remarkable results over time.</p>
            </div>
          </div>

          <div style="text-align: center; color: #6b7280; font-size: 14px; padding: 20px;">
            <p>This report was generated based on your responses to our comprehensive health assessment.</p>
            <p>For more personalized guidance, consider consulting with a healthcare professional.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      message: "Report sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-longevity-report function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);