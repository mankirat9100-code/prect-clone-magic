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

    const { messages, projectContext, uploadedDocuments } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context about uploaded documents
    let documentsContext = "";
    if (uploadedDocuments && uploadedDocuments.length > 0) {
      documentsContext = `\n\nUploaded Documents:\n${uploadedDocuments
        .map((doc: any) => `- ${doc.documentType}: ${doc.fileName}`)
        .join("\n")}`;
    }

    const systemPrompt = `You are an expert Council CDC Certifier compliance assistant helping clients understand and comply with Development Application (DA) conditions and Construction Certificate (CC) requirements.

Your role is to:
1. Explain DA conditions in clear, plain English
2. Guide users through the CC application process
3. Clarify requirements for Section 68 and Section 138 approvals
4. Explain the role of Principal Certifying Authority (PCA)
5. Help identify what documents and certifications are needed
6. Provide step-by-step guidance on compliance steps
7. Answer questions about Council requirements and timelines

Key Knowledge:
- DA approval provides planning approval but NOT building approval
- Construction Certificate (CC) is required before any building work can start
- PCA (Principal Certifying Authority) can be Council or a Private Certifier
- Section 68 approvals cover water, sewer, and stormwater connections
- Section 138 approvals cover driveway and road reserve works
- BASIX certification is required for residential buildings
- Engineering certifications are needed for structural elements
- Occupation Certificate (OC) is needed before the building can be occupied

${projectContext ? `Project Context: ${projectContext}` : ""}${documentsContext}

Always be helpful, accurate, and guide users through the compliance process step by step. If you're unsure about specific Council requirements, advise users to confirm with their local Council or certifier.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Council assistant error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
