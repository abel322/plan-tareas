"use client"

import { useState, useEffect, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  StickyNote,
  CheckCircle2,
  ListTodo,
  Search,
  Loader2,
  Sparkles,
  Inbox,
  Archive,
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QuickNoteForm } from "@/components/quick-notes/quick-note-form"
import { QuickNoteCard, QuickNoteItem } from "@/components/quick-notes/quick-note-card"
import { QuickNoteEditDialog } from "@/components/quick-notes/quick-note-edit-dialog"

export default function QuickNotesPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending")
  const [notes, setNotes] = useState<QuickNoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit Dialog State
  const [editingNote, setEditingNote] = useState<QuickNoteItem | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/quick-notes")
      if (!res.ok) throw new Error("Error al obtener las notas")
      const data = await res.json()
      setNotes(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // Handlers
  const handleAddNote = async (title: string, content?: string) => {
    const res = await fetch("/api/quick-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "No se pudo guardar la nota")
    }

    const newNote = await res.json()
    setNotes((prev) => [newNote, ...prev])
  }

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    // Optimistic update
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              isCompleted,
              completedAt: isCompleted ? new Date().toISOString() : null,
            }
          : note
      )
    )

    try {
      const res = await fetch(`/api/quick-notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      })

      if (!res.ok) {
        throw new Error("No se pudo actualizar el estado de la nota")
      }
      const updated = await res.json()
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
    } catch (error) {
      console.error(error)
      // Revert on error
      fetchNotes()
    }
  }

  const handleSaveEdit = async (id: string, title: string, content?: string) => {
    const res = await fetch(`/api/quick-notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Error al actualizar la nota")
    }

    const updated = await res.json()
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
  }

  const handleDelete = async (id: string) => {
    // Optimistic remove
    setNotes((prev) => prev.filter((n) => n.id !== id))

    try {
      const res = await fetch(`/api/quick-notes/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Error al eliminar la nota")
      }
    } catch (error) {
      console.error(error)
      fetchNotes()
    }
  }

  const pendingNotes = notes.filter((n) => !n.isCompleted)
  const completedNotes = notes.filter((n) => n.isCompleted)

  const currentTabNotes = activeTab === "pending" ? pendingNotes : completedNotes

  const filteredNotes = currentTabNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-electric-cyan/20 to-intelligence/20 border border-electric-cyan/30 text-electric-cyan">
              <StickyNote className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                Notas Rápidas & To-Do List
              </h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Gestiona apuntes, ideas y tareas rápidas fuera de la estructura de proyectos PERT/CPM.
              </p>
            </div>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border/40 text-xs font-semibold text-text-secondary flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
            <span>{pendingNotes.length} Pendiente{pendingNotes.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border/40 text-xs font-semibold text-text-secondary flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{completedNotes.length} Completada{completedNotes.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs Switcher */}
        <div className="flex p-1 bg-surface-elevated border border-border/30 rounded-xl max-w-md w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "pending"
                ? "bg-surface text-text-primary shadow-sm border border-electric-cyan/30 text-electric-cyan"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface/40"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Pendientes / Apuntes</span>
            {pendingNotes.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-electric-cyan/20 text-electric-cyan font-bold">
                {pendingNotes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "completed"
                ? "bg-surface text-text-primary shadow-sm border border-emerald-500/30 text-emerald-400"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface/40"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Historial de Completadas</span>
            {completedNotes.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                {completedNotes.length}
              </span>
            )}
          </button>
        </div>

        {/* Real-time search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar nota o apunte..."
            className="pl-9 bg-surface-elevated/60 border-border/30 text-sm focus:border-electric-cyan"
          />
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "pending" && (
        <div className="space-y-6">
          {/* Upper Quick Add Form */}
          <QuickNoteForm onAddNote={handleAddNote} />

          {/* Active Notes List */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-electric-cyan" />
                Notas Activas ({filteredNotes.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchNotes}
                className="h-7 text-xs text-text-tertiary hover:text-text-primary gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Actualizar
              </Button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-tertiary">
                <Loader2 className="w-8 h-8 animate-spin text-electric-cyan" />
                <p className="text-sm">Cargando notas...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 surface-elevated rounded-xl border border-dashed border-border/40 text-center">
                <div className="w-12 h-12 rounded-full bg-surface/80 flex items-center justify-center text-text-tertiary mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-text-primary">No hay notas pendientes</h4>
                <p className="text-sm text-text-tertiary max-w-sm mt-1">
                  {searchQuery
                    ? "No se encontraron notas que coincidan con la búsqueda."
                    : "Usa el formulario de arriba para escribir tu primera nota rápida o apunte."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredNotes.map((note) => (
                    <QuickNoteCard
                      key={note.id}
                      note={note}
                      onToggleComplete={handleToggleComplete}
                      onEdit={(noteToEdit) => {
                        setEditingNote(noteToEdit)
                        setIsEditOpen(true)
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "completed" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
              <Archive className="w-4 h-4 text-emerald-400" />
              Historial de Completadas ({filteredNotes.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNotes}
              className="h-7 text-xs text-text-tertiary hover:text-text-primary gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Actualizar
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-tertiary">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-sm">Cargando historial...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 surface-elevated rounded-xl border border-dashed border-border/40 text-center">
              <div className="w-12 h-12 rounded-full bg-surface/80 flex items-center justify-center text-text-tertiary mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500/50" />
              </div>
              <h4 className="text-base font-semibold text-text-primary">No hay notas completadas aún</h4>
              <p className="text-sm text-text-tertiary max-w-sm mt-1">
                {searchQuery
                  ? "No hay resultados en el historial de completadas."
                  : "Las notas que marques como completadas aparecerán aquí con su registro de fecha y hora."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredNotes.map((note) => (
                  <QuickNoteCard
                    key={note.id}
                    note={note}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <QuickNoteEditDialog
        note={editingNote}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
