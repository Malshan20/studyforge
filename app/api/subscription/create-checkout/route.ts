import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error("[v0] STRIPE_SECRET_KEY is not configured in environment variables")
      return NextResponse.json(
        { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local file." },
        { status: 500 },
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-09-30.clover",
    })

    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    console.log("[v0] Creating checkout session for user:", user.id, "with price:", priceId)

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      console.log("[v0] Creating new Stripe customer for user:", user.id)
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id
      console.log("[v0] Created Stripe customer:", customerId)

      // Create or update subscription with customer ID
      const { error: upsertError } = await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          stripe_customer_id: customerId,
          plan_type: "scholar", // Fixed column name from 'plan' to 'plan_type' to match database schema
          status: "active",
        },
        {
          onConflict: "user_id",
        },
      )

      if (upsertError) {
        console.error("[v0] Error upserting subscription:", upsertError)
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) {
      console.error("[v0] NEXT_PUBLIC_SITE_URL is not configured")
      return NextResponse.json(
        { error: "Site URL is not configured. Please add NEXT_PUBLIC_SITE_URL to your .env.local file." },
        { status: 500 },
      )
    }

    console.log("[v0] Creating Stripe checkout session...")
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/upgrade?canceled=true`,
      metadata: {
        user_id: user.id,
      },
    })

    console.log("[v0] Checkout session created:", session.id)
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("[v0] Error creating checkout session:", error)
    console.error("[v0] Error details:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
    })
    return NextResponse.json({ error: error?.message || "Failed to create checkout session" }, { status: 500 })
  }
}
