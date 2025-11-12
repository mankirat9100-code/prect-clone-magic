import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'accept' | 'decline' | 'message' | 'meeting';
  consultantName: string;
  company: string;
  taskTitle: string;
  existingContext?: string;
}

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

    const { type, consultantName, company, taskTitle, existingContext }: EmailRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case 'accept':
        systemPrompt = "You are a professional project manager writing acceptance emails. Be warm, professional, and clear about next steps.";
        userPrompt = existingContext 
          ? `We have an existing email thread with ${consultantName} from ${company} about the ${taskTitle} task. Write a follow-up email accepting their proposal. Reference our previous conversation naturally. Keep it concise and professional.`
          : `Write a professional email to ${consultantName} from ${company} accepting their proposal for the ${taskTitle} task. Express enthusiasm, confirm acceptance, and suggest next steps for getting started. Keep it concise and warm.`;
        break;
      
      case 'decline':
        systemPrompt = "You are a professional project manager writing polite decline emails. Be respectful, appreciative, and professional.";
        userPrompt = existingContext
          ? `We have an existing email thread with ${consultantName} from ${company} about the ${taskTitle} task. Write a follow-up email politely declining their proposal. Thank them for their time and effort. Keep it professional and respectful.`
          : `Write a professional email to ${consultantName} from ${company} politely declining their proposal for the ${taskTitle} task. Thank them for their submission and wish them well. Keep it brief and respectful.`;
        break;
      
      case 'message':
        systemPrompt = "You are a professional project manager writing inquiry emails. Be clear, specific, and professional.";
        userPrompt = existingContext
          ? `We have an existing email thread with ${consultantName} from ${company} about the ${taskTitle} task. Write a follow-up email asking for more information about their proposal. Be specific about what clarification you need.`
          : `Write a professional email to ${consultantName} from ${company} requesting more information about their proposal for the ${taskTitle} task. Ask thoughtful questions about their approach, timeline, and experience.`;
        break;
      
      case 'meeting':
        systemPrompt = "You are a professional project manager requesting meetings. Be clear, respectful of their time, and suggest specific options.";
        userPrompt = existingContext
          ? `We have an existing email thread with ${consultantName} from ${company} about the ${taskTitle} task. Write a follow-up email requesting a meeting to discuss their proposal in detail. Suggest a few time options.`
          : `Write a professional email to ${consultantName} from ${company} requesting a meeting to discuss their proposal for the ${taskTitle} task. Suggest meeting this week and ask for their availability.`;
        break;
    }

    console.log("Generating email with Lovable AI:", { type, consultantName, company });

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("Lovable AI error:", response.status, await response.text());
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "An error occurred processing your request." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const emailContent = data.choices[0].message.content;

    console.log("Email generated successfully");

    return new Response(
      JSON.stringify({ emailContent }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
