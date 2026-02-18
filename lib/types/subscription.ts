export type PlanType = "scholar" | "genius"

export interface Subscription {
  id: string
  user_id: string
  plan_type: PlanType
  stripe_customer_id?: string
  stripe_subscription_id?: string
  stripe_price_id?: string
  status: "active" | "canceled" | "past_due"
  current_period_start?: string
  current_period_end?: string
  created_at: string
  updated_at: string
}

export interface UsageTracking {
  id: string
  user_id: string
  month_year: string
  tasks_created: number
  ai_generations_used: number
  created_at: string
  updated_at: string
}

export interface PlanLimits {
  tasks_per_month: number
  flashcards_total: number
  notes_total: number
  ai_generations_per_month: number
  voice_to_text: boolean
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  scholar: {
    tasks_per_month: 50,
    flashcards_total: 100,
    notes_total: 20,
    ai_generations_per_month: 5,
    voice_to_text: false,
  },
  genius: {
    tasks_per_month: -1, // unlimited
    flashcards_total: -1, // unlimited
    notes_total: -1, // unlimited
    ai_generations_per_month: -1, // unlimited
    voice_to_text: true,
  },
}

export const PLAN_DETAILS = {
  scholar: {
    name: "Scholar",
    price: 0,
    description: "Perfect for students starting their journey",
    features: [
      "50 tasks per month",
      "100 flashcards total",
      "20 notes total",
      "5 AI study plans per month",
      "5 AI flashcard generations per month",
      "Basic progress tracking",
      "Pomodoro timer",
      "Standard review modes",
    ],
  },
  genius: {
    name: "Genius",
    price: 4.99,
    description: "For serious students who want unlimited access",
    features: [
      "Unlimited tasks",
      "Unlimited flashcards",
      "Unlimited AI study plans",
      "Unlimited AI flashcard generations",
      "Priority email support",
    ],
  },
}
