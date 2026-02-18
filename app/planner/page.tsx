import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/dashboard/app-layout"
import { CalendarView } from "@/components/planner/calendar-view"
import { TaskList } from "@/components/planner/task-list"
import { PomodoroTimer } from "@/components/planner/pomodoro-timer"
import { AISuggestions } from "@/components/planner/ai-suggestions"
import { StudyPlanGenerator } from "@/components/planner/study-plan-generator"
import { SavedStudyPlans } from "@/components/planner/saved-study-plans"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function PlannerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true })

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Study Planner</h1>
          <p className="text-muted-foreground mt-2">
            Generate weekly AI study plans, manage tasks, and use the Pomodoro timer to stay focused
          </p>
        </div>

        <Tabs defaultValue="planner" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="planner">Planner</TabsTrigger>
            <TabsTrigger value="saved-plans">My Study Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Calendar & Tasks */}
              <div className="lg:col-span-2 space-y-6">
                <CalendarView tasks={tasks || []} />
                <TaskList tasks={tasks || []} />
              </div>

              {/* Right Column - Pomodoro & AI */}
              <div className="space-y-6">
                <PomodoroTimer />
                <StudyPlanGenerator />
                <AISuggestions />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved-plans">
            <SavedStudyPlans />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
