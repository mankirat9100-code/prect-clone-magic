import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, captchaToken } = await req.json();

    // Get client IP from headers
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit using the function
    const { data: canProceed, error: rateLimitError } = await supabase
      .rpc('check_public_chat_rate_limit', { 
        _ip_address: clientIP,
        _max_requests: 5,
        _time_window_hours: 1
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      throw new Error('Rate limit check failed');
    }

    if (!canProceed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. You\'ve reached the maximum of 5 messages per hour. Sign up for unlimited access!' 
        }), 
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate message count (max 5 in conversation)
    if (messages.length > 10) {
      return new Response(
        JSON.stringify({ error: 'Message limit exceeded for demo' }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Record the request
    await supabase.from('public_chat_requests').insert({
      ip_address: clientIP,
      user_agent: userAgent,
      messages_count: 1,
    });

    // Call Lovable AI with demo-specific system prompt
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are Trevor, an AI assistant for Ask Trevor - a platform that connects construction professionals with expert consultants.

THIS IS A LIMITED DEMO. In this demo mode, you can:
- Answer general questions about construction projects and consulting
- Explain what Ask Trevor does and how it works
- Discuss types of consultants needed for different projects (architects, engineers, project managers, etc.)
- Provide general construction industry advice

You CANNOT in demo mode:
- Search actual consultant databases
- Provide real consultant contact information or recommendations
- Access user projects or data
- Show pricing or make bookings

Be helpful and showcase the value of Ask Trevor, but remind users that full features (real consultant matching, direct messaging, project management) require signing up.

Keep responses concise (under 200 words) to demonstrate value quickly.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 300,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service is currently busy. Please try again in a moment.' }), 
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Demo temporarily unavailable. Please try again later.' }), 
          {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Stream the response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });

  } catch (error) {
    console.error('Error in trevor-public-demo:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred processing your request' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
