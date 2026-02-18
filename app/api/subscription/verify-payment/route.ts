import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    console.log("[v0] Starting payment verification...")

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error("[v0] STRIPE_SECRET_KEY is not configured")
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    })

    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[v0] User authentication failed:", userError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)

    const { sessionId } = await request.json()
    console.log("[v0] Verifying session:", sessionId)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })

    console.log("[v0] Session retrieved. Payment status:", session.payment_status)

    if (session.payment_status !== "paid") {
      console.error("[v0] Payment not completed. Status:", session.payment_status)
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const subscription = session.subscription as Stripe.Subscription
    console.log("[v0] Stripe subscription ID:", subscription.id)

    // Update user's subscription in database
    const updateData = {
      plan_type: "genius",
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0].price.id,
      status: "active",
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("[v0] Updating subscription with data:", updateData)

    const { data: updatedData, error: updateError } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("user_id", user.id)
      .select()

    if (updateError) {
      console.error("[v0] Error updating subscription:", updateError)
      return NextResponse.json({ error: "Failed to update subscription", details: updateError }, { status: 500 })
    }

    console.log("[v0] Subscription updated successfully:", updatedData)

    return NextResponse.json({ success: true, subscription: updatedData })
  } catch (error: any) {
    console.error("[v0] Error verifying payment:", error)
    console.error("[v0] Error details:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      stack: error?.stack,
    })
    return NextResponse.json({ error: "Failed to verify payment", details: error?.message }, { status: 500 })
  }
}
