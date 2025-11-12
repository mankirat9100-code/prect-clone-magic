import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  projectId: string;
  startDate: string;
  completionTime: string;
  pricingOption: string;
  priceAmount: string;
  additionalNotes: string;
  attachedFiles: string[];
  draftQuote: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
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
      projectId,
      draftQuote,
      recipientEmail,
      senderName,
      senderEmail,
    }: QuoteEmailRequest = await req.json();

    // Dummy implementation - simulates email sending
    console.log("=== DUMMY EMAIL SIMULATION ===");
    console.log("To:", recipientEmail);
    console.log("From:", senderName, senderEmail);
    console.log("Subject:", `Quote Proposal for Project ${projectId}`);
    console.log("Quote Content:", draftQuote);
    console.log("=============================");

    // Simulate successful email send
    const result = {
      id: `dummy-${Date.now()}`,
      to: recipientEmail,
      from: `${senderName} <noreply@example.com>`,
      subject: `Quote Proposal for Project ${projectId}`,
      status: "simulated",
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
