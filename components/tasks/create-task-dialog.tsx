"use client"

import { useState, useEffect } from "react"
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
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  onTaskCreated?: () => void
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [projectTasks, setProjectTasks] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedProjectId: projectId || "",
    priority: "MEDIUM",
    status: "TODO",
    startDate: "",
    endDate: "",
    estimatedDuration: "",
    dependsOnId: "",
  })

  // Sincronizar projectId por prop si cambia
  useEffect(() => {
    if (projectId) {
      setFormData((prev) => ({ ...prev, selectedProjectId: projectId }))
    }
  }, [projectId])

  // Cargar lista de proyectos si no hay projectId prop
  useEffect(() => {
    if (open) {
      const fetchProjects = async () => {
        setLoadingProjects(true)
        try {
          const res = await fetch("/api/projects")
          if (res.ok) {
            const data = await res.json()
            setProjects(data)
            if (!projectId && data.length > 0 && !formData.selectedProjectId) {
              setFormData((prev) => ({ ...prev, selectedProjectId: data[0].id }))
            }
          }
        } catch (error) {
          console.error("Error al cargar proyectos:", error)
        } finally {
          setLoadingProjects(false)
        }
      }

      fetchProjects()
    }
  }, [open, projectId])

  // Cargar tareas del proyecto seleccionado para dependencias
  useEffect(() => {
    const targetProjectId = projectId || formData.selectedProjectId
    if (open && targetProjectId) {
      const fetchProjectTasks = async () => {
        try {
          const res = await fetch(`/api/tasks?projectId=${targetProjectId}`)
          if (res.ok) {
            const data = await res.json()
            setProjectTasks(data)
          }
        } catch (error) {
          console.error("Error al cargar tareas del proyecto:", error)
        }
      }

      fetchProjectTasks()
    }
  }, [open, projectId, formData.selectedProjectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetProjectId = projectId || formData.selectedProjectId

    if (!targetProjectId) {
      alert("Por favor selecciona un proyecto")
      return
    }

    setLoading(true)

    try {
      const taskData = {
        name: formData.name,
        description: formData.description || undefined,
        projectId: targetProjectId,
        priority: formData.priority,
        status: formData.status,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        estimatedDuration: formData.estimatedDuration
          ? parseFloat(formData.estimatedDuration)
          : undefined,
        dependsOnId: formData.dependsOnId || undefined,
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error al crear tarea")
      }

      onOpenChange(false)
      onTaskCreated?.()
      router.refresh()

      // Reset Form
      setFormData({
        name: "",
        description: "",
        selectedProjectId: projectId || (projects[0]?.id || ""),
        priority: "MEDIUM",
        status: "TODO",
        startDate: "",
        endDate: "",
        estimatedDuration: "",
        dependsOnId: "",
      })
    } catch (error: any) {
      console.error("Error:", error)
      alert(error.message || "Error al crear tarea")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Agrega una nueva tarea y vincúlala a un proyecto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nombre de la Tarea */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Tarea *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Diseñar arquitectura del sistema"
              required
            />
          </div>

          {/* Selección de Proyecto (si no está predeterminado) */}
          {!projectId && (
            <div className="space-y-2">
              <Label htmlFor="selectedProjectId">Proyecto *</Label>
              {loadingProjects ? (
                <p className="text-xs text-ink-tertiary">Cargando proyectos...</p>
              ) : projects.length === 0 ? (
                <p className="text-xs text-critical">
                  No tienes proyectos creados. Crea un proyecto primero.
                </p>
              ) : (
                <Select
                  id="selectedProjectId"
                  value={formData.selectedProjectId}
                  onChange={(e) =>
                    setFormData({ ...formData, selectedProjectId: e.target.value, dependsOnId: "" })
                  }
                  required
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          )}

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe los detalles de la tarea..."
              rows={3}
            />
          </div>

          {/* Prioridad y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="TODO">Por Hacer</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="REVIEW">En Revisión</option>
                <option value="COMPLETED">Completada</option>
                <option value="BLOCKED">Bloqueada</option>
              </Select>
            </div>
          </div>

          {/* Duración Estimada y Predecesora (PERT/CPM) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Duración Estimada (días)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                step="0.5"
                min="0"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedDuration: e.target.value })
                }
                placeholder="Ej: 3.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependsOnId">Tarea Predecesora (PERT/CPM)</Label>
              <Select
                id="dependsOnId"
                value={formData.dependsOnId}
                onChange={(e) =>
                  setFormData({ ...formData, dependsOnId: e.target.value })
                }
              >
                <option value="">Ninguna</option>
                {projectTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Fechas Inicio y Fin */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
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
            <Button
              type="submit"
              disabled={loading || (!projectId && projects.length === 0)}
              className="flex-1"
            >
              {loading ? "Creando..." : "Crear Tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
