import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/dashboard/app-layout"
import { DeckSelector } from "@/components/flashcards/deck-selector"
import { FlashcardStudy } from "@/components/flashcards/flashcard-study"
import { QuizMode } from "@/components/flashcards/quiz-mode"
import { AIFlashcardGenerator } from "@/components/flashcards/ai-flashcard-generator"

export default async function FlashcardsPage({
  searchParams,
}: {
  searchParams: Promise<{ deck?: string; mode?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all decks
  const { data: decks } = await supabase
    .from("flashcard_decks")
    .select("*, flashcards(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const selectedDeckId = params.deck
  const mode = params.mode || "flashcard"

  let selectedDeck = null
  let flashcards = []

  if (selectedDeckId) {
    const { data: deck } = await supabase
      .from("flashcard_decks")
      .select("*, flashcards(*)")
      .eq("id", selectedDeckId)
      .single()

    selectedDeck = deck
    flashcards = deck?.flashcards || []
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Flashcards & Quizzes</h1>
          <p className="text-muted-foreground mt-2">
            Master your subjects with standard review modes and AI-generated flashcards
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Deck Selector Sidebar */}
          <div className="lg:col-span-1">
            <DeckSelector decks={decks || []} selectedDeckId={selectedDeckId} />
          </div>

          {/* Study Area */}
          <div className="lg:col-span-3">
            {!selectedDeckId ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Select a deck to start studying</p>
              </div>
            ) : (
              <div className="space-y-6">
                <AIFlashcardGenerator deckId={selectedDeckId} subject={selectedDeck?.subject} />

                {mode === "quiz" ? (
                  <QuizMode deck={selectedDeck} flashcards={flashcards} />
                ) : (
                  <FlashcardStudy deck={selectedDeck} flashcards={flashcards} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
