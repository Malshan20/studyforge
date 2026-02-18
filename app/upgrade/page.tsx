"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, Loader2, Sparkles } from "lucide-react"
import { PLAN_DETAILS, PLAN_LIMITS, type Subscription, type UsageTracking } from "@/lib/types/subscription"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<UsageTracking | null>(null)
  const [counts, setCounts] = useState({ flashcards: 0, notes: 0 })

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscription/status")
      const data = await response.json()

      setSubscription(data.subscription)
      setUsage(data.usage)
      setCounts(data.counts)
    } catch (error) {
      console.error("[v0] Error fetching subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_GENIUS_PRICE_ID
    if (!priceId) {
      console.error("[v0] Missing STRIPE_GENIUS_PRICE_ID in env")
      alert("Configuration error: Missing price ID. Please contact support.")
      return
    }

    try {
      setUpgrading(true)

      const response = await fetch("/api/subscription/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("[v0] Error creating checkout:", error)
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const isGenius = subscription?.plan_type === "genius"
  const limits = PLAN_LIMITS[subscription?.plan_type || "scholar"]

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return Math.min((used / limit) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {PLAN_DETAILS[subscription?.plan_type || "scholar"].name} Plan
                </CardTitle>
                <CardDescription>
                  {isGenius ? "You have unlimited access to all features" : "Your current usage and limits"}
                </CardDescription>
              </div>
              {isGenius && (
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Active</span>
                </div>
              )}
            </div>
          </CardHeader>
          {!isGenius && (
            <CardContent className="space-y-6">
              {/* Tasks Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tasks this month</span>
                  <span className="font-medium">
                    {usage?.tasks_created || 0} / {limits.tasks_per_month}
                  </span>
                </div>
                <Progress value={getUsagePercentage(usage?.tasks_created || 0, limits.tasks_per_month)} />
              </div>

              {/* AI Generations Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>AI generations this month</span>
                  <span className="font-medium">
                    {usage?.ai_generations_used || 0} / {limits.ai_generations_per_month}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(usage?.ai_generations_used || 0, limits.ai_generations_per_month)}
                />
              </div>

              {/* Flashcards Count */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Total flashcards</span>
                  <span className="font-medium">
                    {counts.flashcards} / {limits.flashcards_total}
                  </span>
                </div>
                <Progress value={getUsagePercentage(counts.flashcards, limits.flashcards_total)} />
              </div>

              {/* Notes Count */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Total notes</span>
                  <span className="font-medium">
                    {counts.notes} / {limits.notes_total}
                  </span>
                </div>
                <Progress value={getUsagePercentage(counts.notes, limits.notes_total)} />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Upgrade Card */}
        {!isGenius && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Upgrade to Genius</CardTitle>
              <CardDescription>
                Get unlimited access to all features for just ${PLAN_DETAILS.genius.price}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PLAN_DETAILS.genius.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpgrade} disabled={upgrading} className="w-full" size="lg">
                {upgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}