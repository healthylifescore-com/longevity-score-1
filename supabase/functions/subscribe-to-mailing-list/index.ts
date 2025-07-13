import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  name: string;
  email: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: RequestBody = await req.json();
    
    const accessKey = Deno.env.get("access_key");
    if (!accessKey) {
      throw new Error("Access key not configured");
    }

    // URL encode the name
    const encodedName = encodeURIComponent(name);
    
    const subscribeUrl = `https://www.profitplatform.com/wp-json/pp-site-manager/v1/crm-subscribe/?name=${encodedName}&email=${encodeURIComponent(email)}&access_key=${accessKey}&tags=assessment%20lead`;

    console.log('Subscribing user to mailing list:', { name, email });

    const response = await fetch(subscribeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.text();
    
    console.log('Mailing list subscription response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      throw new Error(`Failed to subscribe: ${response.status} ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to mailing list',
        response: responseData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error subscribing to mailing list:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});