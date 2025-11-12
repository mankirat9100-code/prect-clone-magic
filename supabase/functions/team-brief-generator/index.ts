import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { masterBrief, role, currentBrief, modification } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (masterBrief) {
      // Generate individual briefs from master brief
      systemPrompt = `You are a construction project coordinator. Given a master project brief, create specific, detailed briefs for each type of consultant mentioned. Return a JSON object where keys are consultant roles (like "Building Designer", "Structural Engineer", etc.) and values are the specific briefs for each role.

Each brief should be:
- Specific to that consultant's expertise
- Include key responsibilities and deliverables
- Mention any relevant standards or requirements
- Be clear and actionable

Return ONLY valid JSON in this format:
{
  "Building Designer": "brief text here",
  "Structural Engineer": "brief text here",
  ...
}`;

      userPrompt = `Master project brief:\n\n${masterBrief}\n\nGenerate individual briefs for all consultant types mentioned.`;
    } else if (role && modification) {
      // Modify existing brief
      systemPrompt = `You are a construction project coordinator. Modify the consultant brief based on the user's instructions. Return ONLY the updated brief text, without any JSON formatting or additional explanation.`;

      userPrompt = `Current brief for ${role}:\n\n${currentBrief || 'No brief yet'}\n\nModification requested:\n${modification}\n\nReturn the updated brief:`;
    } else {
      throw new Error("Invalid request parameters");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status, await response.text());
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      return new Response(
        JSON.stringify({ error: "An error occurred processing your request." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    if (masterBrief) {
      // Parse JSON response for master brief
      try {
        const briefs = JSON.parse(content);
        return new Response(
          JSON.stringify({ briefs }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        return new Response(
          JSON.stringify({ error: "Failed to parse AI response" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Return plain text for modification
      return new Response(
        JSON.stringify({ brief: content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Brief generator error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
