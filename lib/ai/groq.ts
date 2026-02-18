import { createGroq } from "@ai-sdk/groq"

console.log("[v0] Initializing Groq configuration...")
console.log("[v0] GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY)
console.log("[v0] GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length || 0)

if (!process.env.GROQ_API_KEY) {
  console.error("[v0] ERROR: GROQ_API_KEY is not set in environment variables!")
  throw new Error("GROQ_API_KEY is not set in environment variables. Please add it to your .env.local file.")
}

console.log("[v0] Creating Groq model instance...")

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Using llama-3.3-70b-versatile as the default model (fast and capable)
export const groqModel = groq("llama-3.3-70b-versatile")

console.log("[v0] Groq model configured successfully")
