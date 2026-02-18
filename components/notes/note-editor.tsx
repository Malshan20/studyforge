"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Save, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Note } from "@/lib/types/study"

interface NoteEditorProps {
  note: Note
}

export function NoteEditor({ note: initialNote }: NoteEditorProps) {
  const [note, setNote] = useState(initialNote)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    setNote(initialNote)
  }, [initialNote])

  const handleChange = (field: keyof Note, value: string) => {
    setNote((prev) => ({ ...prev, [field]: value }))

    // Auto-save after 2 seconds of inactivity
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave({ ...note, [field]: value })
    }, 2000)
  }

  const handleSave = async (noteToSave = note) => {
    setIsSaving(true)

    const { error } = await supabase
      .from("notes")
      .update({
        title: noteToSave.title,
        content: noteToSave.content,
        subject: noteToSave.subject,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteToSave.id)

    if (error) {
      toast.error("Failed to save note")
    } else {
      toast.success("Note saved!")
    }

    setIsSaving(false)
  }

  const handleExport = () => {
    const blob = new Blob([note.content || ""], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Note exported!")
  }

  const extractTags = (content: string) => {
    const words = content.toLowerCase().split(/\s+/)
    const commonWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with"])
    const wordFreq: Record<string, number> = {}

    words.forEach((word) => {
      const cleaned = word.replace(/[^a-z]/g, "")
      if (cleaned.length > 3 && !commonWords.has(cleaned)) {
        wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1
      }
    })

    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  const autoTags = note.content ? extractTags(note.content) : []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Input
            value={note.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0"
            placeholder="Note title..."
          />
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleSave()} disabled={isSaving}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Input
            value={note.subject || ""}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="w-48 text-sm"
            placeholder="Subject/Folder"
          />
          {isSaving && <span className="text-xs text-muted-foreground">Saving...</span>}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-6">
        <Textarea
          value={note.content || ""}
          onChange={(e) => handleChange("content", e.target.value)}
          className="min-h-[500px] text-base leading-relaxed border-none shadow-none focus-visible:ring-0 resize-none"
          placeholder="Start typing your notes..."
        />
      </div>

      {/* Tag Cloud */}
      {autoTags.length > 0 && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Suggested tags:</span>
            {autoTags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
