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
    const { issueId, category, description, location } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client with service role for admin operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch available officials/engineers
    const { data: officials, error: officialsError } = await supabase
      .from('officials')
      .select('*');

    if (officialsError) {
      console.error('Error fetching officials:', officialsError);
      throw new Error('Failed to fetch officials');
    }

    if (!officials || officials.length === 0) {
      console.log('No officials available for assignment');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No officials available for assignment' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use AI to determine the best engineer for this issue
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an intelligent task assignment AI for a civic issue management system. 
Your job is to analyze incoming civic issues and assign them to the most appropriate engineer/official based on their department and expertise.

Available officials and their departments:
${officials.map(o => `- ${o.name} (Department: ${o.department})`).join('\n')}

Category to Department mapping guidelines:
- garbage: Sanitation, Waste Management, Public Works
- roads: Roads, Infrastructure, Public Works, Civil Engineering
- drainage: Drainage, Water Management, Public Works
- streetlights: Electrical, Public Works, Infrastructure
- parks: Parks, Recreation, Horticulture, Environment
- stray_dogs: Animal Control, Municipal Services

Analyze the issue and return ONLY the exact name of the most suitable official from the list above. No explanation needed.`
          },
          {
            role: "user",
            content: `New civic issue reported:
Category: ${category}
Description: ${description}
Location: ${location}

Which official should handle this issue? Return only their exact name.`
          }
        ],
        max_tokens: 50,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        console.error('AI rate limit exceeded');
        // Fallback: assign to first available official
        const fallbackOfficial = officials[0];
        await supabase
          .from('issues')
          .update({ 
            assigned_to: fallbackOfficial.name,
            status: 'assigned'
          })
          .eq('id', issueId);
        
        return new Response(JSON.stringify({ 
          success: true, 
          assignedTo: fallbackOfficial.name,
          aiPowered: false,
          message: 'Assigned using fallback (rate limit)' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const suggestedName = aiData.choices?.[0]?.message?.content?.trim();
    
    console.log('AI suggested official:', suggestedName);

    // Find the official by name (case-insensitive match)
    const matchedOfficial = officials.find(o => 
      o.name.toLowerCase() === suggestedName?.toLowerCase() ||
      suggestedName?.toLowerCase().includes(o.name.toLowerCase())
    );

    const assignedOfficial = matchedOfficial || officials[0];

    // Update the issue with assignment
    const { error: updateError } = await supabase
      .from('issues')
      .update({ 
        assigned_to: assignedOfficial.name,
        status: 'assigned'
      })
      .eq('id', issueId);

    if (updateError) {
      console.error('Error updating issue:', updateError);
      throw new Error('Failed to assign issue');
    }

    console.log(`Issue ${issueId} assigned to ${assignedOfficial.name} by Agentic AI`);

    return new Response(JSON.stringify({ 
      success: true, 
      assignedTo: assignedOfficial.name,
      department: assignedOfficial.department,
      aiPowered: true,
      message: `Automatically assigned to ${assignedOfficial.name} (${assignedOfficial.department}) by Agentic AI`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Auto-assign error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
