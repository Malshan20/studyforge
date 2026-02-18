import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { plan, goals } = body

    const startDate = new Date(plan.startDate)
    const endDate = new Date(plan.endDate)
    const durationWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

    // Insert study plan with all required fields
    const { data: studyPlan, error: planError } = await supabase
      .from("study_plans")
      .insert({
        user_id: user.id,
        title: plan.title,
        subject: plan.subject,
        start_date: plan.startDate,
        end_date: plan.endDate,
        duration: plan.duration,
        difficulty: plan.difficulty || "intermediate",
        duration_weeks: durationWeeks,
        goals_text: plan.goals,
        tips: plan.tips,
        status: "active",
      })
      .select()
      .single()

    if (planError) throw planError

    if (goals && goals.length > 0) {
      const goalsToInsert = goals.map((goal: any) => ({
        study_plan_id: studyPlan.id, // Changed from plan_id to study_plan_id
        user_id: user.id, // Add user_id as it's required
        title: goal.title,
        description: goal.description,
        priority: goal.priority,
        due_date: goal.dueDate,
        estimated_hours: goal.estimatedHours,
      }))

      const { error: goalsError } = await supabase.from("study_goals").insert(goalsToInsert) // Changed from study_plan_goals to study_goals

      if (goalsError) throw goalsError
    }

    return NextResponse.json({ success: true, planId: studyPlan.id })
  } catch (error: any) {
    console.error("[v0] Error saving study plan:", error)
    return NextResponse.json({ error: error.message || "Failed to save study plan" }, { status: 500 })
  }
}
