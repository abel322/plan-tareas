"use client"

import { useState } from "react"
import { Plus, ChevronDown, ChevronUp, StickyNote, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface QuickNoteFormProps {
  onAddNote: (title: string, content?: string) => Promise<void>
}

export function QuickNoteForm({ onAddNote }: QuickNoteFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [showContent, setShowContent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Por favor ingresa un título para la nota.")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await onAddNote(title.trim(), content.trim() || undefined)
      setTitle("")
      setContent("")
      setShowContent(false)
    } catch (err: any) {
      setError(err.message || "Error al crear la nota")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="surface-elevated rounded-xl border border-border/40 p-4 shadow-lg transition-all focus-within:border-electric-cyan/50">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-electric-cyan shrink-0" />
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (error) setError(null)
            }}
            placeholder="¿Qué tienes pendiente o deseas anotar? (Ej: Revisar informe PERT...)"
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base font-medium px-1 placeholder:text-text-tertiary"
            disabled={isSubmitting}
          />
        </div>

        {(showContent || content.length > 0) && (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Detalles u observaciones opcionales..."
            rows={3}
            className="bg-background/50 border-border/30 text-sm focus:border-electric-cyan resize-none"
            disabled={isSubmitting}
          />
        )}

        {error && (
          <p className="text-xs text-critical px-1 font-medium">{error}</p>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border/20">
          <button
            type="button"
            onClick={() => setShowContent(!showContent)}
            className="text-xs text-text-tertiary hover:text-electric-cyan flex items-center gap-1 transition-colors px-1 py-0.5 rounded"
          >
            {showContent ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Ocultar detalles
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> + Añadir contenido o detalles
              </>
            )}
          </button>

          <Button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            size="sm"
            className="bg-gradient-to-r from-electric-cyan to-intelligence hover:opacity-95 text-white font-medium gap-1.5 shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Agregar Nota</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
