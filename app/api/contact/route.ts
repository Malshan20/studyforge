import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    const supabase = await createClient()

    // Generate ticket number using database function
    const { data: ticketData, error: ticketError } = await supabase.rpc("generate_ticket_number")

    if (ticketError) {
      console.error("[v0] Error generating ticket number:", ticketError)
      throw new Error("Failed to generate ticket number")
    }

    const ticketNumber = ticketData as string

    // Insert contact message
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        ticket_number: ticketNumber,
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: "open",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving contact message:", error)
      throw new Error("Failed to save contact message")
    }

    return NextResponse.json({
      success: true,
      ticketNumber,
      message: "Your message has been received. We'll get back to you soon!",
    })
  } catch (error) {
    console.error("[v0] Contact form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to submit contact form. Please try again." }, { status: 500 })
  }
}
