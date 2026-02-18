import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/dashboard/app-layout"
import { TodaysFocus } from "@/components/dashboard/todays-focus"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TodaysTasks } from "@/components/dashboard/todays-tasks"
import { QuickQuiz } from "@/components/dashboard/quick-quiz"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch today's tasks
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data: todaysTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .gte("due_date", today.toISOString())
    .lt("due_date", tomorrow.toISOString())
    .order("priority", { ascending: false })

  // Fetch recent flashcard for quick quiz
  const { data: recentDeck } = await supabase
    .from("flashcard_decks")
    .select("*, flashcards(*)")
    .eq("user_id", user.id)
    .limit(1)
    .single()

  // Get random flashcard from recent deck
  const randomCard = recentDeck?.flashcards?.[Math.floor(Math.random() * (recentDeck.flashcards?.length || 0))]

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Today's Focus Section */}
          <TodaysFocus userId={user.id} />

          {/* Quick Actions Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuickActions />
            <TodaysTasks tasks={todaysTasks || []} />
            <QuickQuiz card={randomCard} deckId={recentDeck?.id} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
