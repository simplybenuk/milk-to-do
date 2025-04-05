
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import Stripe from "https://esm.sh/stripe@12.0.0?dts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // This is a public endpoint, so we don't need authentication
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing Stripe signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the webhook secret
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return new Response(
        JSON.stringify({ error: "Stripe webhook secret not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the request body as text
    const body = await req.text();
    
    // Verify the event and construct the event object
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Connect to Supabase with service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.user_id;
        
        if (!userId) {
          console.error("No user ID found in session:", session.id);
          break;
        }
        
        // Get the pro plan ID
        const { data: proPlans, error: planError } = await supabaseAdmin
          .from("plans")
          .select("id")
          .eq("name", "pro")
          .limit(1);
          
        if (planError || !proPlans || proPlans.length === 0) {
          console.error("Failed to get pro plan ID:", planError);
          break;
        }
        
        const proPlanId = proPlans[0].id;
        
        // Update user's plan to pro
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ 
            plan_id: proPlanId,
            plan_started_at: new Date().toISOString()
          })
          .eq("id", userId);
          
        if (updateError) {
          console.error("Failed to update user plan:", updateError);
        } else {
          console.log(`User ${userId} upgraded to pro plan`);
        }
        
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        // Handle subscription updates (e.g., plan changes, payment method updates)
        console.log("Subscription updated:", subscription.id);
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;
        
        if (!userId) {
          // Try to find the user by customer ID
          const { data: customers } = await stripe.customers.search({
            query: `id:'${subscription.customer}'`,
          });
          
          if (customers && customers.data.length > 0) {
            const customerEmail = customers.data[0].email;
            if (customerEmail) {
              // Find user by email
              const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
              const user = userData?.users?.find(u => u.email === customerEmail);
              if (user) {
                await handleCancelSubscription(user.id, supabaseAdmin);
              }
            }
          }
        } else {
          await handleCancelSubscription(userId, supabaseAdmin);
        }
        
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Helper function to handle subscription cancellations
async function handleCancelSubscription(userId: string, supabaseAdmin: any) {
  // Get the free plan ID
  const { data: freePlans, error: planError } = await supabaseAdmin
    .from("plans")
    .select("id")
    .eq("name", "free")
    .limit(1);
    
  if (planError || !freePlans || freePlans.length === 0) {
    console.error("Failed to get free plan ID:", planError);
    return;
  }
  
  const freePlanId = freePlans[0].id;
  
  // Update user's plan to free
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ 
      plan_id: freePlanId,
      plan_started_at: new Date().toISOString()
    })
    .eq("id", userId);
    
  if (updateError) {
    console.error("Failed to downgrade user plan:", updateError);
  } else {
    console.log(`User ${userId} downgraded to free plan`);
  }
}
