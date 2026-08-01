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
import { CreateSpecificGoalDialog } from "@/components/projects/create-specific-goal-dialog"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  specificGoalId?: string
  onTaskCreated?: () => void
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  specificGoalId,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [projectTasks, setProjectTasks] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [specificGoals, setSpecificGoals] = useState<any[]>([])
  const [loadingSpecificGoals, setLoadingSpecificGoals] = useState(false)
  const [innerGoalDialogOpen, setInnerGoalDialogOpen] = useState(false)
  const [estimationMethod, setEstimationMethod] = useState<"CPM" | "PERT">("CPM")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedProjectId: projectId || "",
    specificGoalId: "",
    priority: "MEDIUM",
    status: "TODO",
    startDate: "",
    endDate: "",
    estimatedDuration: "",
    optimisticTime: "",
    mostLikelyTime: "",
    pessimisticTime: "",
    dependsOnId: "",
  })

  // Sincronizar projectId por prop si cambia
  useEffect(() => {
    if (projectId) {
      setFormData((prev) => ({ ...prev, selectedProjectId: projectId }))
    }
  }, [projectId])

  // Sincronizar specificGoalId por prop si cambia
  useEffect(() => {
    if (specificGoalId) {
      setFormData((prev) => ({ ...prev, specificGoalId: specificGoalId }))
    }
  }, [specificGoalId])

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

  const fetchProjectDetails = async () => {
    const targetProjectId = projectId || formData.selectedProjectId
    if (!targetProjectId) return
    setLoadingSpecificGoals(true)
    try {
      const [tasksRes, goalsRes] = await Promise.all([
        fetch(`/api/tasks?projectId=${targetProjectId}`),
        fetch(`/api/specific-goals?projectId=${targetProjectId}`),
      ])

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setProjectTasks(tasksData)
      }

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json()
        setSpecificGoals(goalsData)
      }
    } catch (error) {
      console.error("Error al cargar datos del proyecto:", error)
    } finally {
      setLoadingSpecificGoals(false)
    }
  }

  // Cargar tareas y Objetivos Específicos del proyecto seleccionado
  useEffect(() => {
    if (open) {
      fetchProjectDetails()
    }
  }, [open, projectId, formData.selectedProjectId])

  // Cálculo en tiempo real de Te PERT: Te = (O + 4*M + P) / 6
  const calculatedTe = (() => {
    const o = parseFloat(formData.optimisticTime)
    const m = parseFloat(formData.mostLikelyTime)
    const p = parseFloat(formData.pessimisticTime)
    if (!isNaN(o) && !isNaN(m) && !isNaN(p)) {
      return Math.round(((o + 4 * m + p) / 6) * 100) / 100
    }
    return null
  })()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetProjectId = projectId || formData.selectedProjectId

    if (!targetProjectId) {
      alert("Por favor selecciona un proyecto")
      return
    }

    if (!formData.specificGoalId) {
      alert("Por favor selecciona un Objetivo Específico para asociar a esta tarea")
      return
    }

    let finalEstimatedDuration: number | undefined
    let optimisticTime: number | undefined
    let mostLikelyTime: number | undefined
    let pessimisticTime: number | undefined

    if (estimationMethod === "CPM") {
      if (!formData.estimatedDuration) {
        alert("Por favor ingresa la duración estimada para CPM")
        return
      }
      finalEstimatedDuration = parseFloat(formData.estimatedDuration)
    } else {
      if (calculatedTe === null) {
        alert("Por favor completa los 3 tiempos de PERT (Optimista, Más Probable, Pesimista)")
        return
      }
      const o = parseFloat(formData.optimisticTime)
      const m = parseFloat(formData.mostLikelyTime)
      const p = parseFloat(formData.pessimisticTime)
      if (o > m || m > p) {
        alert("En la estimación PERT debe cumplirse: Optimista ≤ Más Probable ≤ Pesimista")
        return
      }
      optimisticTime = o
      mostLikelyTime = m
      pessimisticTime = p
      finalEstimatedDuration = calculatedTe
    }

    setLoading(true)

    try {
      const taskData = {
        name: formData.name,
        description: formData.description || undefined,
        projectId: targetProjectId,
        specificGoalId: formData.specificGoalId || undefined,
        priority: formData.priority,
        status: formData.status,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        estimatedDuration: finalEstimatedDuration,
        optimisticTime,
        mostLikelyTime,
        pessimisticTime,
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
        specificGoalId: "",
        priority: "MEDIUM",
        status: "TODO",
        startDate: "",
        endDate: "",
        estimatedDuration: "",
        optimisticTime: "",
        mostLikelyTime: "",
        pessimisticTime: "",
        dependsOnId: "",
      })
      setEstimationMethod("CPM")
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
            Agrega una nueva tarea con estimación CPM o PERT y vincúlala a un proyecto
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
                <p className="text-xs text-muted-foreground">Cargando proyectos...</p>
              ) : projects.length === 0 ? (
                <p className="text-xs text-destructive">
                  No tienes proyectos creados. Crea un proyecto primero.
                </p>
              ) : (
                <Select
                  id="selectedProjectId"
                  value={formData.selectedProjectId}
                  onChange={(e) =>
                    setFormData({ ...formData, selectedProjectId: e.target.value, specificGoalId: "", dependsOnId: "" })
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

          {/* Selección de Objetivo Específico */}
          <div className="space-y-2">
            <Label htmlFor="specificGoalId">Objetivo Específico *</Label>
            {loadingSpecificGoals ? (
              <p className="text-xs text-muted-foreground">Cargando objetivos específicos...</p>
            ) : (
              <Select
                id="specificGoalId"
                value={formData.specificGoalId}
                onChange={(e) =>
                  setFormData({ ...formData, specificGoalId: e.target.value })
                }
                required
              >
                <option value="">Selecciona un Objetivo Específico...</option>
                {specificGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </Select>
            )}
            {!loadingSpecificGoals && (projectId || formData.selectedProjectId) && specificGoals.length === 0 && (
              <div className="space-y-1">
                <p className="text-xs text-amber-500 font-medium">
                  Este proyecto no tiene Objetivos Específicos definidos.
                </p>
                <button
                  type="button"
                  onClick={() => setInnerGoalDialogOpen(true)}
                  className="text-xs text-electric-cyan font-bold hover:underline"
                >
                  + Crear Objetivo Específico
                </button>
              </div>
            )}
          </div>

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

          {/* Selector de Metodología de Estimación de Tiempo (CPM / PERT) */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Label className="font-semibold text-sm">Metodología de Estimación</Label>
              <div className="flex bg-muted p-1 rounded-lg self-start sm:self-auto border">
                <button
                  type="button"
                  onClick={() => setEstimationMethod("CPM")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    estimationMethod === "CPM"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  CPM (Tiempo Fijo)
                </button>
                <button
                  type="button"
                  onClick={() => setEstimationMethod("PERT")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    estimationMethod === "PERT"
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  PERT (3 Tiempos)
                </button>
              </div>
            </div>

            {estimationMethod === "CPM" ? (
              <div className="space-y-2 pt-2">
                <Label htmlFor="estimatedDuration">Duración Estimada (días) *</Label>
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
                  required={estimationMethod === "CPM"}
                />
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="optimisticTime" className="text-xs">Optimista (O) *</Label>
                    <Input
                      id="optimisticTime"
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.optimisticTime}
                      onChange={(e) =>
                        setFormData({ ...formData, optimisticTime: e.target.value })
                      }
                      placeholder="Ej: 2"
                      required={estimationMethod === "PERT"}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mostLikelyTime" className="text-xs">Más Probable (M) *</Label>
                    <Input
                      id="mostLikelyTime"
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.mostLikelyTime}
                      onChange={(e) =>
                        setFormData({ ...formData, mostLikelyTime: e.target.value })
                      }
                      placeholder="Ej: 4"
                      required={estimationMethod === "PERT"}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pessimisticTime" className="text-xs">Pesimista (P) *</Label>
                    <Input
                      id="pessimisticTime"
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.pessimisticTime}
                      onChange={(e) =>
                        setFormData({ ...formData, pessimisticTime: e.target.value })
                      }
                      placeholder="Ej: 8"
                      required={estimationMethod === "PERT"}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-md bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium text-primary">Duración Calculada (Te):</span>
                  <span className="text-sm font-bold text-primary">
                    {calculatedTe !== null ? `${calculatedTe} días` : "--"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground italic">
                  Fórmula PERT: Te = (O + 4×M + P) / 6
                </p>
              </div>
            )}
          </div>

          {/* Tarea Predecesora (PERT/CPM) */}
          <div className="space-y-2">
            <Label htmlFor="dependsOnId">Tarea Predecesora (Dependencia)</Label>
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
      <CreateSpecificGoalDialog
        open={innerGoalDialogOpen}
        onOpenChange={setInnerGoalDialogOpen}
        projectId={projectId || formData.selectedProjectId}
        onGoalCreated={fetchProjectDetails}
      />
    </Dialog>
  )
}
