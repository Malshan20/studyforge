"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus, RotateCw, Gamepad2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import type { Flashcard } from "@/lib/types/study"

interface FlashcardStudyProps {
  deck: any
  flashcards: Flashcard[]
}

export function FlashcardStudy({ deck, flashcards: initialFlashcards }: FlashcardStudyProps) {
  const [flashcards, setFlashcards] = useState(initialFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const currentCard = flashcards[currentIndex]

  const handleAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const question = formData.get("question") as string
    const answer = formData.get("answer") as string
    const tags = (formData.get("tags") as string).split(",").map((t) => t.trim())

    const { data, error } = await supabase
      .from("flashcards")
      .insert({
        deck_id: deck.id,
        question,
        answer,
        tags,
      })
      .select()
      .single()

    if (error) {
      toast.error("Failed to add card")
    } else {
      toast.success("Card added!")
      setFlashcards([...flashcards, data])
      setOpen(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleRateDifficulty = async (difficulty: number) => {
    if (!currentCard) return

    // Calculate next review interval based on difficulty
    let intervalDays = currentCard.review_interval_days
    if (difficulty <= 2) {
      // Hard - review tomorrow
      intervalDays = 1
    } else if (difficulty === 3) {
      // Medium - review in 3 days
      intervalDays = Math.max(3, intervalDays)
    } else {
      // Easy - double the interval
      intervalDays = Math.min(intervalDays * 2, 30)
    }

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)

    await supabase
      .from("flashcards")
      .update({
        difficulty,
        review_interval_days: intervalDays,
        next_review_date: nextReviewDate.toISOString(),
        times_reviewed: currentCard.times_reviewed + 1,
      })
      .eq("id", currentCard.id)

    toast.success("Progress saved!")
    handleNext()
  }

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevious = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  if (flashcards.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground mb-4">No flashcards in this deck yet</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Flashcard</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCard} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea id="question" name="question" placeholder="Enter the question..." required rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer *</Label>
                  <Textarea id="answer" name="answer" placeholder="Enter the answer..." required rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" name="tags" placeholder="e.g., biology, cells, mitosis" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Card"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{deck.name}</CardTitle>
            <div className="flex gap-2">
              <Link href={`/flashcards?deck=${deck.id}&mode=quiz`}>
                <Button variant="outline">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Quiz Mode
                </Button>
              </Link>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Flashcard</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCard} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question *</Label>
                      <Textarea id="question" name="question" placeholder="Enter the question..." required rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer">Answer *</Label>
                      <Textarea id="answer" name="answer" placeholder="Enter the answer..." required rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" name="tags" placeholder="e.g., biology, cells, mitosis" />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Adding..." : "Add Card"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </CardHeader>
      </Card>

      {/* Flashcard */}
      <div className="relative h-[400px] cursor-pointer perspective-1000" onClick={() => setFlipped(!flipped)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? "answer" : "question"}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Card className="h-full bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/20">
              <CardContent className="h-full flex flex-col items-center justify-center p-8">
                <p className="text-sm text-muted-foreground mb-4">{flipped ? "Answer" : "Question"}</p>
                <p className="text-2xl font-medium text-center">
                  {flipped ? currentCard.answer : currentCard.question}
                </p>
                {currentCard.tags && currentCard.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {currentCard.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-primary/20 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={handlePrevious} className="flex-1 bg-transparent">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" onClick={() => setFlipped(!flipped)} className="flex-1">
          <RotateCw className="mr-2 h-4 w-4" />
          Flip
        </Button>
        <Button variant="outline" onClick={handleNext} className="flex-1 bg-transparent">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Difficulty Rating */}
      {flipped && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium mb-3 text-center">How well did you know this?</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="outline"
                    onClick={() => handleRateDifficulty(rating)}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="text-2xl mb-1">
                      {rating === 1 ? "😰" : rating === 2 ? "😕" : rating === 3 ? "😐" : rating === 4 ? "😊" : "😄"}
                    </span>
                    <span className="text-xs">
                      {rating === 1
                        ? "Hard"
                        : rating === 2
                          ? "Tough"
                          : rating === 3
                            ? "OK"
                            : rating === 4
                              ? "Good"
                              : "Easy"}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
