"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Loader2, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AIFlashcardGeneratorProps {
  deckId: string
  subject?: string
}

export function AIFlashcardGenerator({ deckId, subject }: AIFlashcardGeneratorProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast.error("Please paste some content to generate flashcards")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/ai/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, deckId, subject }),
      })

      if (!response.ok) throw new Error("Failed to generate flashcards")

      const data = await response.json()
      toast.success(`Generated ${data.count} flashcards!`)
      setContent("")
      router.refresh()
    } catch (error) {
      toast.error("Failed to generate flashcards")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Flashcard Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">
                <FileText className="h-4 w-4 inline mr-1" />
                Paste your study material
              </Label>
              <Textarea
                id="content"
                placeholder="Paste notes, textbook excerpts, or any study material here. AI will extract key concepts and create flashcards..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tip: The more detailed your content, the better the flashcards!
              </p>
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Flashcards with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
