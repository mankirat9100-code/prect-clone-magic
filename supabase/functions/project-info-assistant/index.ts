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

    const { messages, projectContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt with project context
    const systemPrompt = `You are a Project Information Assistant specialized in helping clients understand and document their building projects.

Current Project Context:
${projectContext}

Your role:
- Help clients describe their building projects in detail
- Ask relevant questions to extract key information about the project
- Assist with understanding architectural plans and building requirements
- Guide clients on what information is needed for planning applications
- Explain technical terms and measurements in a friendly way
- Help identify missing information that might be needed
- IMPORTANT: When users correct information (e.g., "the ceiling height is 2.7m, not 2.44m"), acknowledge the correction and use the updated value

Available fields that can be updated:
- ceilingHeight (format: "X.XX m (details)")
- roofArea (format: "XXX.XX m²")
- wallHeight (format: "X.XX m")

When a user corrects a value:
1. Acknowledge the correction in your response
2. Extract the field name and new value
3. Use the tool "update_field" to make the change

When a client describes their project:
- Ask clarifying questions about dimensions, materials, number of rooms, etc.
- Help them think about aspects they might have forgotten (parking, outdoor areas, services)
- Be conversational and supportive
- Break down complex planning requirements into simple language

Be helpful, professional, and thorough in your responses.`;

    console.log('Project Info Assistant request received');

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
        tools: [
          {
            type: "function",
            function: {
              name: "update_field",
              description: "Update a field value in the project information",
              parameters: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    enum: ["ceilingHeight", "roofArea", "wallHeight"],
                    description: "The field to update"
                  },
                  value: {
                    type: "string",
                    description: "The new value for the field"
                  }
                },
                required: ["field", "value"]
              }
            }
          }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status, await response.text());
      
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
    console.log('AI response received successfully');

    // Extract field updates from tool calls if any
    const fieldUpdates: Record<string, string> = {};
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    
    if (toolCalls && Array.isArray(toolCalls)) {
      toolCalls.forEach((toolCall: any) => {
        if (toolCall.function?.name === "update_field") {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            fieldUpdates[args.field] = args.value;
          } catch (e) {
            console.error('Error parsing tool call arguments:', e);
          }
        }
      });
    }

    // Add field updates to response if any
    if (Object.keys(fieldUpdates).length > 0) {
      data.fieldUpdates = fieldUpdates;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Project info assistant error:', error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
