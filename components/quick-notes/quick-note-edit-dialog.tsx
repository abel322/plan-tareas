"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QuickNoteItem } from "./quick-note-card"
import { Loader2 } from "lucide-react"

interface QuickNoteEditDialogProps {
  note: QuickNoteItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, title: string, content?: string) => Promise<void>
}

export function QuickNoteEditDialog({
  note,
  open,
  onOpenChange,
  onSave,
}: QuickNoteEditDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title || "")
      setContent(note.content || "")
      setError(null)
    }
  }, [note])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note) return

    if (!title.trim()) {
      setError("El título no puede estar vacío.")
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await onSave(note.id, title.trim(), content.trim() || undefined)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Error al actualizar la nota")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Nota Rápidas</DialogTitle>
          <DialogDescription>
            Modifica el título y el contenido o apunte de tu nota.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Título *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la nota..."
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-content">Contenido / Observaciones (Opcional)</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detalles adicionales..."
              rows={4}
              disabled={isSaving}
            />
          </div>

          {error && <p className="text-xs text-critical font-medium">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="bg-electric-cyan text-background hover:bg-electric-cyan/90 font-semibold"
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
