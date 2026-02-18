import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error("[v0] GROQ_API_KEY not found in environment variables")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const systemPrompt = `You are a compassionate and empathetic stress relief coach for students. Your role is to:
- Listen actively and validate their feelings
- Provide gentle, supportive guidance
- Suggest calming techniques like breathing exercises, mindfulness, or positive reframing
- Keep responses warm, concise (2-3 sentences), and encouraging
- Use a calm, soothing tone with occasional emojis (🌸, 🌿, ✨, 💙)
- Help them feel heard and less alone
- Never give medical advice - suggest professional help if needed
- Focus on immediate stress relief and emotional support

Remember: You're here to help them relax and feel better in this moment.`

    // Format messages for Groq (OpenAI-compatible format)
    const formattedMessages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.8,
        max_tokens: 200,
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
      return NextResponse.json({ error: "No response from Groq" }, { status: 500 })
    }

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Stress relief chat error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
