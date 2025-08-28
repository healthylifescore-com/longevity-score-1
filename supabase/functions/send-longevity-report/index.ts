import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LongevityReportRequest {
  userEmail: string;
  userName: { firstName: string; lastName: string };
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
    console.log("Function called, method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    const body = await req.text();
    console.log("Raw request body:", body);
    
    const { userEmail, userName, answers, results }: LongevityReportRequest = JSON.parse(body);

    console.log("Processing request for:", userEmail);
    console.log("User name:", userName);
    console.log("Results:", results);
    
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Resend API key exists:", !!resendApiKey);
    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY environment variable");
      throw new Error("Resend API key not configured");
    }

    console.log("Creating Resend client");
    const resend = new Resend(resendApiKey);

    // Generate recommendation list for email with affiliate links
    const recommendationsList = [];
    const supplementLinks = [];
    
    if (results.recommendations.supplements) {
      recommendationsList.push('• Consider targeted nutritional supplements to address specific health concerns');
      supplementLinks.push({
        title: 'Essential Supplements Guide',
        description: 'Science-backed supplement recommendations',
        url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/supplement-guide?email=${encodeURIComponent(userEmail)}`
      });
    }
    
    if (results.recommendations.specificSupplements.length > 0) {
      results.recommendations.specificSupplements.forEach(supplement => {
        switch (supplement) {
          case 'PrimeBiome':
            recommendationsList.push('• PrimeBiome: Support your gut health and digestive system');
            supplementLinks.push({
              title: 'PrimeBiome',
              description: 'Support your gut health and digestive system',
              url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/primebiome?email=${encodeURIComponent(userEmail)}`
            });
            break;
          case 'Quietum Plus':
            recommendationsList.push('• Quietum Plus: Natural support for ear health and reducing ringing');
            supplementLinks.push({
              title: 'Quietum Plus',
              description: 'Natural support for ear health and reducing ringing',
              url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/quietum-plus?email=${encodeURIComponent(userEmail)}`
            });
            break;
          case 'ProstaVive':
            recommendationsList.push('• ProstaVive: Comprehensive prostate health support');
            supplementLinks.push({
              title: 'ProstaVive',
              description: 'Comprehensive prostate health support',
              url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/prostav-ive?email=${encodeURIComponent(userEmail)}`
            });
            break;
          case 'HepatoBurn':
            recommendationsList.push('• HepatoBurn: Support healthy metabolism and energy levels');
            supplementLinks.push({
              title: 'HepatoBurn',
              description: 'Support healthy metabolism and energy levels',
              url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/hepato-burn?email=${encodeURIComponent(userEmail)}`
            });
            break;
        }
      });
    }
    
    if (results.recommendations.ketogenic) {
      recommendationsList.push('• Consider a ketogenic diet to optimize metabolic health and energy');
      supplementLinks.push({
        title: 'Keto Breads Cookbook',
        description: 'Delicious keto-friendly bread recipes',
        url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/keto-breads?email=${encodeURIComponent(userEmail)}`
      });
    }
    
    if (results.recommendations.paleo) {
      recommendationsList.push('• Consider a paleo diet to reduce inflammation and improve overall health');
      supplementLinks.push({
        title: 'Healing Soup Diet',
        description: 'Nutrient-rich soups for optimal health',
        url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/soup-diet?email=${encodeURIComponent(userEmail)}`
      });
    }
    
    // Add general recommendations based on category scores
    if (results.categoryScores.sleep < 70) {
      recommendationsList.push('• Focus on improving sleep quality and consistency (aim for 7-9 hours)');
      supplementLinks.push({
        title: 'Sleep Optimization Course',
        description: 'Master the art of restorative sleep',
        url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/sleep-optimizer?email=${encodeURIComponent(userEmail)}`
      });
    }
    
    if (results.categoryScores.exercise < 70) {
      recommendationsList.push('• Increase physical activity with regular exercise (3-5 times per week)');
      supplementLinks.push({
        title: 'Longevity Fitness Program',
        description: 'Age-defying exercise routines',
        url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/fitness-program?email=${encodeURIComponent(userEmail)}`
      });
    }
    
    if (results.categoryScores.stress < 70) {
      recommendationsList.push('• Implement stress management techniques like meditation or deep breathing');
      supplementLinks.push({
        title: 'Stress Management Toolkit',
        description: 'Proven techniques for stress reduction',
        url: `${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/stress-management?email=${encodeURIComponent(userEmail)}`
      });
    }
    
    if (results.categoryScores.diet < 70) {
      recommendationsList.push('• Improve your diet with more whole foods and less processed options');
    }
    
    const recommendationsText = recommendationsList.join('\n');
    
    // Generate supplement links HTML
    const supplementLinksHtml = supplementLinks.map(link => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1e293b;">${link.title}</h4>
        <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">${link.description}</p>
        <a href="${link.url}" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Get This Resource</a>
      </div>
    `).join('');

    const reportUrl = `${req.headers.get('origin') || 'https://healthylifescore.com'}/report?email=${encodeURIComponent(userEmail)}`;
    
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Personalized Longevity Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 30px; }
    .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .score-section { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; }
    .divider { height: 1px; background: #e2e8f0; margin: 30px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Personalized Longevity Report</h1>
      <p>Discover your path to optimal health and vitality</p>
    </div>
    
    <div class="content">
      <p>Dear ${userName.firstName},</p>
      
      <p>Thank you for completing our comprehensive longevity assessment. Your personalized report is now ready and contains valuable insights tailored specifically to your health profile.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${reportUrl}" class="cta-button">View Your Complete Report</a>
      </div>
      
      <div class="score-section">
        <h3>Your Longevity Score: ${results.overallScore}/100</h3>
        <p><strong>Vitality Level:</strong> ${results.vitality}</p>
        <p>Your report includes personalized recommendations for nutrition, exercise, sleep optimization, and stress management based on your unique assessment results.</p>
      </div>
      
      <h3>What's Inside Your Report:</h3>
      <ul>
        <li>Detailed analysis of your current health status</li>
        <li>Personalized nutrition recommendations</li>
        <li>Targeted supplement suggestions</li>
        <li>Exercise routines for your fitness level</li>
        <li>Sleep optimization strategies</li>
        <li>Stress management techniques</li>
        <li>Access to premium health resources</li>
      </ul>
      
      ${supplementLinks.length > 0 ? `
      <div class="divider"></div>
      
      <h3>🎯 Targeted Supplement Support Recommended For You:</h3>
      <p>Based on your assessment results, we've identified these specific resources to help optimize your health:</p>
      
      ${supplementLinksHtml}
      
      <div class="divider"></div>
      ` : ''}
      
      <p><strong>Don't miss out on the exclusive resources in your report!</strong> We've curated premium tools and guides specifically matched to your assessment results to help you achieve your longevity goals.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${reportUrl}" class="cta-button">Access Your Complete Report</a>
      </div>
      
      <p>If you have any questions about your results, please don't hesitate to reach out to our health optimization team.</p>
      
      <p>To your health and longevity,<br>
      The Healthy Life Score Team</p>
    </div>
    
    <div class="footer">
      <p>This email was sent to ${userEmail}</p>
      <p>© 2024 Healthy Life Score. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

    // Send to user
    console.log("Attempting to send email to:", userEmail);
    const userEmailResponse = await resend.emails.send({
      from: "Healthy Life Score <hello@healthylifescore.com>",
      to: [userEmail],
      subject: `${userName.firstName}, Your Personalized Longevity Report is Ready`,
      html: emailContent,
    });
    
    console.log("User email response:", JSON.stringify(userEmailResponse, null, 2));
    
    if (userEmailResponse.error) {
      console.error("Error sending user email:", userEmailResponse.error);
      throw new Error(`Failed to send user email: ${userEmailResponse.error.message}`);
    }

    // Send copy to business email
    console.log("Attempting to send business notification email");
    const businessEmailResponse = await resend.emails.send({
      from: "Healthy Life Score <hello@healthylifescore.com>",
      to: ["hello@healthylifescore.com"],
      subject: `New Assessment: ${userName.firstName} ${userName.lastName} - Score: ${results.overallScore}`,
      html: `
        <h2>New Assessment Completed</h2>
        <p><strong>Name:</strong> ${userName.firstName} ${userName.lastName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Overall Score:</strong> ${results.overallScore}/100</p>
        <p><strong>Vitality Level:</strong> ${results.vitality}</p>
        <h3>Assessment Answers:</h3>
        <pre>${JSON.stringify(answers, null, 2)}</pre>
      `,
    });
    
    console.log("Business email response:", JSON.stringify(businessEmailResponse, null, 2));
    
    if (businessEmailResponse.error) {
      console.error("Error sending business email:", businessEmailResponse.error);
      // Don't throw here since user email was successful
    }

    console.log("Email sent successfully via Resend");

    return new Response(JSON.stringify({ 
      success: true,
      message: "Report sent successfully" 
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