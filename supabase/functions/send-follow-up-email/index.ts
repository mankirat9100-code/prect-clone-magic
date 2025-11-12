import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FollowUpRequest {
  projectTitle: string;
  projectName: string;
  contactEmail: string;
  contactName: string;
  myQuote: string;
  submittedDate: string;
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

    const {
      projectTitle,
      projectName,
      contactEmail,
      contactName,
      myQuote,
      submittedDate,
    }: FollowUpRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating follow-up email with Lovable AI for:", projectTitle);

    const systemPrompt = `You are a professional consultant writing a polite follow-up email about a submitted quote. Be brief, professional, and respectful of their time.`;
    
    const userPrompt = `Write a brief follow-up email to ${contactName} regarding the ${projectTitle} quote for ${projectName}. 

Key details:
- Quote amount: ${myQuote}
- Submitted: ${submittedDate}

The email should:
1. Politely check in on the status of the proposal
2. Express continued interest in the project
3. Offer to answer any questions or provide additional information
4. Be concise (2-3 short paragraphs maximum)

Do not include a subject line, just the email body.`;

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

    console.log("Follow-up email generated successfully");
    console.log("=== SIMULATED EMAIL SEND ===");
    console.log("To:", contactEmail);
    console.log("Contact:", contactName);
    console.log("Subject:", `Follow-up: ${projectTitle} - ${projectName}`);
    console.log("Body:", emailContent);
    console.log("===========================");

    // In a real implementation, you would send the email here using a service like Resend
    // For now, we're simulating the email send

    return new Response(
      JSON.stringify({
        success: true,
        emailContent,
        message: "Follow-up email generated and simulated send",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-follow-up-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
