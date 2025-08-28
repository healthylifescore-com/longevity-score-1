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
  <title>Your Longevity Report, ${userName.firstName}!</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: linear-gradient(to bottom right, #dbeafe, #e0e7ff); }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .title { font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .subtitle { font-size: 18px; color: #6b7280; }
    .score-card { background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 40px 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
    .score-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .score-value { font-size: 48px; font-weight: bold; margin-bottom: 20px; }
    .vitality { font-size: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .category-item { text-align: center; padding: 20px; border-radius: 8px; }
    .category-green { background: #d1fae5; color: #065f46; }
    .category-blue { background: #dbeafe; color: #1e40af; }
    .category-yellow { background: #fef3c7; color: #92400e; }
    .category-red { background: #fee2e2; color: #991b1b; }
    .urgent-banner { background: linear-gradient(to right, #ef4444, #f97316); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .urgent-title { font-size: 24px; font-weight: bold; margin-bottom: 15px; }
    .supplement-card { background: linear-gradient(to right, #fef3c7, #fed7aa); border: 4px solid #f59e0b; border-radius: 12px; margin-bottom: 20px; overflow: hidden; }
    .supplement-header { background: #f59e0b; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 16px; }
    .supplement-content { padding: 25px; }
    .supplement-title { font-size: 20px; font-weight: bold; color: #92400e; margin-bottom: 15px; }
    .supplement-description { color: #1f2937; margin-bottom: 20px; line-height: 1.6; }
    .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
    .benefits-box { background: white; padding: 15px; border-radius: 8px; }
    .benefit { color: #059669; font-weight: 600; margin-bottom: 5px; }
    .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; text-align: center; width: 100%; box-sizing: border-box; }
    .doctor-endorsed { background: linear-gradient(to right, #a855f7, #ec4899); }
    .doctor-header { background: #8b5cf6; }
    .doctor-title { color: #7c3aed; }
    .doctor-button { background: #8b5cf6; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; border-radius: 8px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Your Longevity Report, ${userName.firstName}!</h1>
      <p class="subtitle">Comprehensive analysis of your biological vitality and personalized recommendations</p>
    </div>
    
    <div class="score-card">
      <div class="score-title">Your Longevity Score</div>
      <div class="score-value">${results.overallScore}</div>
      <div class="vitality">❤️ Biological Vitality: ${results.vitality}</div>
    </div>
    
    <h2 style="color: #1f2937; margin-bottom: 20px;">📊 Category Breakdown</h2>
    <div class="category-grid">
      <div class="category-item ${results.categoryScores.sleep >= 85 ? 'category-green' : results.categoryScores.sleep >= 70 ? 'category-blue' : results.categoryScores.sleep >= 55 ? 'category-yellow' : 'category-red'}">
        <h3 style="margin: 0 0 10px 0;">Sleep</h3>
        <div style="font-size: 24px; font-weight: bold;">${results.categoryScores.sleep}</div>
        <div style="font-size: 12px;">out of 100</div>
      </div>
      <div class="category-item ${results.categoryScores.diet >= 85 ? 'category-green' : results.categoryScores.diet >= 70 ? 'category-blue' : results.categoryScores.diet >= 55 ? 'category-yellow' : 'category-red'}">
        <h3 style="margin: 0 0 10px 0;">Diet</h3>
        <div style="font-size: 24px; font-weight: bold;">${results.categoryScores.diet}</div>
        <div style="font-size: 12px;">out of 100</div>
      </div>
      <div class="category-item ${results.categoryScores.exercise >= 85 ? 'category-green' : results.categoryScores.exercise >= 70 ? 'category-blue' : results.categoryScores.exercise >= 55 ? 'category-yellow' : 'category-red'}">
        <h3 style="margin: 0 0 10px 0;">Exercise</h3>
        <div style="font-size: 24px; font-weight: bold;">${results.categoryScores.exercise}</div>
        <div style="font-size: 12px;">out of 100</div>
      </div>
      <div class="category-item ${results.categoryScores.stress >= 85 ? 'category-green' : results.categoryScores.stress >= 70 ? 'category-blue' : results.categoryScores.stress >= 55 ? 'category-yellow' : 'category-red'}">
        <h3 style="margin: 0 0 10px 0;">Stress</h3>
        <div style="font-size: 24px; font-weight: bold;">${results.categoryScores.stress}</div>
        <div style="font-size: 12px;">out of 100</div>
      </div>
      <div class="category-item ${results.categoryScores.health >= 85 ? 'category-green' : results.categoryScores.health >= 70 ? 'category-blue' : results.categoryScores.health >= 55 ? 'category-yellow' : 'category-red'}">
        <h3 style="margin: 0 0 10px 0;">Health</h3>
        <div style="font-size: 24px; font-weight: bold;">${results.categoryScores.health}</div>
        <div style="font-size: 12px;">out of 100</div>
      </div>
    </div>
    
    ${supplementLinks.length > 0 ? `
    <div class="urgent-banner">
      <div class="urgent-title">🚨 URGENT: Top Priority Recommendations</div>
      <p style="font-size: 18px; margin: 0;">Based on your health profile, these are the most critical areas to address immediately for maximum longevity impact!</p>
    </div>
    
    ${results.recommendations.specificSupplements.includes('HepatoBurn') ? `
    <div class="supplement-card">
      <div class="supplement-header">⭐ TOP PRIORITY FOR YOUR ENERGY & BELLY FAT CONCERNS ⭐</div>
      <div class="supplement-content">
        <h3 class="supplement-title">HepatoBurn - Breakthrough Discovery</h3>
        <p class="supplement-description">Scientists have discovered a hidden root cause of stubborn belly fat that's been keeping you stuck. This breakthrough solution targets the real problem - not just the symptoms. Users report:</p>
        <div class="benefits-grid">
          <div class="benefits-box">
            <div class="benefit">✅ More Energy</div>
            <div class="benefit">✅ Healthier Skin</div>
            <div class="benefit">✅ Better Sleep</div>
          </div>
          <div class="benefits-box">
            <div class="benefit">✅ Reduced Hunger</div>
            <div class="benefit">✅ Clearer Thinking</div>
            <div class="benefit">✅ Improved Health</div>
          </div>
        </div>
        <a href="${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/hepato-burn?email=${encodeURIComponent(userEmail)}" class="cta-button">🔥 DISCOVER THE ROOT CAUSE - Limited Time Offer! 🔥</a>
      </div>
    </div>
    ` : ''}
    
    ${results.recommendations.specificSupplements.includes('PrimeBiome') ? `
    <div class="supplement-card doctor-endorsed">
      <div class="supplement-header doctor-header">🌟 DOCTOR-ENDORSED FOR YOUR GUT & SKIN ISSUES 🌟</div>
      <div class="supplement-content">
        <h3 class="supplement-title doctor-title">PrimeBiome - Skin-Gut Connection</h3>
        <p class="supplement-description">Your gut and skin issues are connected! PrimeBiome combines unique ingredients designed to support cell turnover by maintaining a healthy skin and gut microbiome for a more youthful appearance.</p>
        <a href="${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/primebiome?email=${encodeURIComponent(userEmail)}" class="cta-button doctor-button">🌟 Transform Your Skin & Gut Health Today! 🌟</a>
      </div>
    </div>
    ` : ''}
    
    ${results.recommendations.specificSupplements.includes('Quietum Plus') ? `
    <div class="supplement-card" style="background: linear-gradient(to right, #dbeafe, #bfdbfe); border-color: #3b82f6;">
      <div class="supplement-header" style="background: #3b82f6;">🔊 BREAKTHROUGH FOR YOUR EAR RINGING CONCERNS 🔊</div>
      <div class="supplement-content">
        <h3 class="supplement-title" style="color: #1e40af;">Quietum Plus - Revolutionary Ear Solution</h3>
        <p class="supplement-description">Ear ringing happens when neural wires get damaged. Quietum Plus feeds, regenerates and rebuilds these pathways for perfect harmony with your brain. Backed by hundreds of clinical studies.</p>
        <a href="${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/quietum-plus?email=${encodeURIComponent(userEmail)}" class="cta-button" style="background: #3b82f6;">🔊 Stop Ear Ringing Naturally - Get Quietum Plus! 🔊</a>
      </div>
    </div>
    ` : ''}
    
    ${results.recommendations.specificSupplements.includes('ProstaVive') ? `
    <div class="supplement-card" style="background: linear-gradient(to right, #d1fae5, #a7f3d0); border-color: #10b981;">
      <div class="supplement-header" style="background: #10b981;">💪 PROSTATE HEALTH BREAKTHROUGH FORMULA 💪</div>
      <div class="supplement-content">
        <h3 class="supplement-title" style="color: #047857;">ProstaVive - Powerful Prostate Formula</h3>
        <p class="supplement-description">These specific, unique nutrients support prostate activity, metabolize cells, maintain healthy blood flow, and help support a healthy prostate size for optimal men's health.</p>
        <a href="${req.headers.get('origin') || 'https://healthylifescore.com'}/redirect/prostav-ive?email=${encodeURIComponent(userEmail)}" class="cta-button" style="background: #10b981;">💪 Boost Your Prostate Health Today! 💪</a>
      </div>
    </div>
    ` : ''}
    ` : ''}
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${reportUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 20px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 20px;">📋 View Your Complete Detailed Report</a>
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