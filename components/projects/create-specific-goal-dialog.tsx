"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CreateSpecificGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  onGoalCreated?: () => void
}

export function CreateSpecificGoalDialog({
  open,
  onOpenChange,
  projectId,
  onGoalCreated,
}: CreateSpecificGoalDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Por favor ingresa un nombre para el Objetivo Específico")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/specific-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          projectId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error al crear objetivo específico")
      }

      onOpenChange(false)
      onGoalCreated?.()
      router.refresh()

      setFormData({
        name: "",
        description: "",
      })
    } catch (error: any) {
      console.error("Error:", error)
      alert(error.message || "Error al crear objetivo específico")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Objetivo Específico</DialogTitle>
          <DialogDescription>
            Define un objetivo específico para organizar y agrupar tareas en este proyecto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Nombre del Objetivo *</Label>
            <Input
              id="goal-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Módulo de Autenticación y Seguridad"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-description">Descripción</Label>
            <Textarea
              id="goal-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe lo que se logrará con este objetivo..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : "Crear Objetivo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
