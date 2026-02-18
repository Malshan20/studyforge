import { generateObject } from "ai"
import { GeneratedQuestSchema } from "@/lib/types/quest"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { groqModel } from "@/lib/ai/groq"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, difficulty, questionCount = 5 } = await req.json()

    if (!subject || !difficulty) {
      return NextResponse.json({ error: "Subject and difficulty are required" }, { status: 400 })
    }

    // Generate quest using Groq
    const { object: quest } = await generateObject({
      model: groqModel,
      schema: GeneratedQuestSchema,
      prompt: `Generate an educational quiz quest with the following parameters:
      
Subject: ${subject}
Difficulty: ${difficulty}
Number of Questions: ${questionCount}

Create a fun, engaging quest that helps students learn. Include:
1. A catchy title that makes learning exciting
2. A brief description explaining what students will learn
3. ${questionCount} multiple-choice questions with 4 options each
4. Clear explanations for each correct answer
5. Appropriate XP reward based on difficulty (easy: 10-20, medium: 25-40, hard: 45-60)

Make the questions educational but fun, and ensure they're appropriate for the difficulty level.`,
      maxTokens: 2000,
      temperature: 0.8,
    })

    // Save quest to database
    const { data: savedQuest, error: questError } = await supabase
      .from("quests")
      .insert({
        title: quest.title,
        description: quest.description,
        subject: quest.subject,
        difficulty: quest.difficulty,
        xp_reward: quest.xpReward,
        questions: quest.questions,
      })
      .select()
      .single()

    if (questError) {
      console.error("[v0] Error saving quest:", questError)
      return NextResponse.json({ error: "Failed to save quest" }, { status: 500 })
    }

    return NextResponse.json({ quest: savedQuest })
  } catch (error) {
    console.error("[v0] Error generating quest:", error)
    return NextResponse.json({ error: "Failed to generate quest" }, { status: 500 })
  }
}
