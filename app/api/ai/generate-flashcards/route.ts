import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { content, deckId, subject } = await req.json()

    if (!content || !deckId) {
      return NextResponse.json({ error: "Content and deck ID are required" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Create educational flashcards from the following content. 
      Generate 8-12 high-quality flashcards that cover the key concepts.
      
      Subject: ${subject || "General"}
      
      Content:
      ${content}
      
      Return ONLY a valid JSON object (no markdown, no code blocks) with this structure:
      {
        "flashcards": [
          {
            "question": "A clear question or prompt",
            "answer": "A concise, accurate answer",
            "difficulty": 3
          }
        ]
      }
      
      Use difficulty as a number from 1-5 (1=easiest, 5=hardest).
      Focus on important concepts, definitions, and relationships.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Groq API error:", errorText)
      return NextResponse.json({ error: "Groq API error", details: errorText }, { status: response.status })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      return NextResponse.json({ error: "No text in Groq response" }, { status: 500 })
    }

    // Remove markdown code blocks if present
    let jsonText = text.trim()
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "")
    }

    const result = JSON.parse(jsonText)

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const flashcardsToInsert = result.flashcards.map((card: any) => ({
      deck_id: deckId,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty || 3,
    }))

    const { data: savedCards, error } = await supabase.from("flashcards").insert(flashcardsToInsert).select()

    if (error) {
      console.error("[v0] Error saving flashcards:", error)
      return NextResponse.json({ error: "Failed to save flashcards" }, { status: 500 })
    }

    return NextResponse.json({ flashcards: savedCards, count: savedCards.length })
  } catch (error) {
    console.error("[v0] Error generating flashcards:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to generate flashcards", details: errorMessage }, { status: 500 })
  }
}
