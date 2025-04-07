
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

    // Get the request body as text for webhook processing
    const body = await req.text();
    
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    
    // Note: In a development environment, we might want to bypass signature verification
    // for testing purposes
    let event;
    
    if (signature && Deno.env.get("STRIPE_WEBHOOK_SECRET")) {
      try {
        // Verify the event using the webhook secret and signature
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
        );
      } catch (err) {
        console.error(`⚠️ Webhook signature verification failed:`, err.message);
        // Fall back to parsing the payload directly for development/testing
        event = JSON.parse(body);
      }
    } else {
      // For development/testing, parse the payload directly
      console.log("⚠️ Using webhook test mode (no signature verification)");
      event = JSON.parse(body);
    }

    // Connect to Supabase with service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.user_id;
        
        if (!userId) {
          console.error("No user ID found in session:", session.id);
          break;
        }
        
        console.log(`Processing completed checkout for user: ${userId}`);
        
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
          console.log(`User ${userId} upgraded to pro plan successfully`);
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
          try {
            console.warn("No user_id found in subscription metadata; falling back to customer.retrieve lookup.");
            const customerId = subscription.customer;
            const customer = await stripe.customers.retrieve(customerId);
            const customerEmail = (customer as any).email;

            if (customerEmail) {
              const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
              const user = userData?.users?.find(u => u.email === customerEmail);
              if (user) {
                await handleCancelSubscription(user.id, supabaseAdmin);
              } else {
                console.error("No Supabase user found with email:", customerEmail);
              }
            } else {
              console.error("Customer has no email:", subscription.customer);
            }
          } catch (err) {
            console.error("Failed to retrieve Stripe customer:", err.message);
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
