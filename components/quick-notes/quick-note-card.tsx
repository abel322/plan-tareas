"use client"

import { motion } from "framer-motion"
import { Check, Edit3, Trash2, RotateCcw, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface QuickNoteItem {
  id: string
  title: string
  content?: string | null
  isCompleted: boolean
  completedAt?: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
}

interface QuickNoteCardProps {
  note: QuickNoteItem
  onToggleComplete: (id: string, isCompleted: boolean) => void
  onEdit?: (note: QuickNoteItem) => void
  onDelete: (id: string) => void
}

export function QuickNoteCard({
  note,
  onToggleComplete,
  onEdit,
  onDelete,
}: QuickNoteCardProps) {
  const formatDate = (dateValue?: string | Date | null) => {
    if (!dateValue) return ""
    const d = new Date(dateValue)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group relative rounded-xl border p-4 transition-all duration-200 shadow-md",
        note.isCompleted
          ? "bg-surface/40 border-border/20 opacity-80 hover:opacity-100"
          : "bg-surface/80 hover:bg-surface border-border/40 hover:border-electric-cyan/40 hover:shadow-electric-cyan/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Toggle Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(note.id, !note.isCompleted)}
          className={cn(
            "mt-0.5 shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-electric-cyan/50",
            note.isCompleted
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
              : "border-border/60 hover:border-electric-cyan bg-background/50 hover:bg-electric-cyan/10 text-transparent"
          )}
          title={note.isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
        >
          <Check className={cn("w-4 h-4 transition-transform", note.isCompleted ? "scale-100" : "scale-0 group-hover:scale-75 group-hover:text-electric-cyan")} />
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-base font-semibold text-text-primary leading-snug break-words transition-colors",
              note.isCompleted && "line-through text-text-tertiary"
            )}
          >
            {note.title}
          </h4>

          {note.content && (
            <p
              className={cn(
                "mt-1.5 text-sm text-text-secondary whitespace-pre-wrap break-words leading-relaxed",
                note.isCompleted && "text-text-tertiary/70"
              )}
            >
              {note.content}
            </p>
          )}

          {/* Dates footer */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
            {!note.isCompleted ? (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-electric-cyan/70" />
                Creado {formatDate(note.createdAt)}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Completado {formatDate(note.completedAt || note.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {note.isCompleted ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(note.id, false)}
              className="h-8 px-2 text-xs text-electric-cyan hover:text-electric-cyan hover:bg-electric-cyan/10 gap-1"
              title="Restaurar a pendientes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </Button>
          ) : (
            onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(note)}
                className="h-8 w-8 p-0 text-text-tertiary hover:text-text-primary hover:bg-surface-elevated"
                title="Editar nota"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="h-8 w-8 p-0 text-text-tertiary hover:text-critical hover:bg-critical/10"
            title={note.isCompleted ? "Eliminar definitivamente" : "Eliminar nota"}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
