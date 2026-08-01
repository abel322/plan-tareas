"use client"

import { useState, useEffect } from "react"
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

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any
  onTaskUpdated?: () => void
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const [loading, setLoading] = useState(false)
  const [estimationMethod, setEstimationMethod] = useState<"CPM" | "PERT">("CPM")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    estimatedDuration: "",
    optimisticTime: "",
    mostLikelyTime: "",
    pessimisticTime: "",
    startDate: "",
    endDate: "",
    isCritical: false,
  })

  useEffect(() => {
    if (task) {
      const isPert =
        task.optimisticTime !== null &&
        task.optimisticTime !== undefined &&
        task.mostLikelyTime !== null &&
        task.mostLikelyTime !== undefined &&
        task.pessimisticTime !== null &&
        task.pessimisticTime !== undefined

      setEstimationMethod(isPert ? "PERT" : "CPM")
      setFormData({
        name: task.name || "",
        description: task.description || "",
        priority: task.priority || "MEDIUM",
        status: task.status || "TODO",
        estimatedDuration: task.estimatedDuration?.toString() || "",
        optimisticTime: task.optimisticTime?.toString() || "",
        mostLikelyTime: task.mostLikelyTime?.toString() || "",
        pessimisticTime: task.pessimisticTime?.toString() || "",
        startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
        endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : "",
        isCritical: task.isCritical || false,
      })
    }
  }, [task])

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

    let finalEstimatedDuration: number | undefined
    let optimisticTime: number | null = null
    let mostLikelyTime: number | null = null
    let pessimisticTime: number | null = null

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
        priority: formData.priority,
        status: formData.status,
        estimatedDuration: finalEstimatedDuration,
        optimisticTime,
        mostLikelyTime,
        pessimisticTime,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        isCritical: formData.isCritical,
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error al actualizar tarea")
      }

      onOpenChange(false)
      if (onTaskUpdated) {
        onTaskUpdated()
      }
    } catch (error: any) {
      console.error("Error:", error)
      alert(error.message || "Error al actualizar tarea")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>
            Modifica los detalles y la estimación de tiempo de la tarea
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre de la Tarea *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Implementar autenticación"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe los detalles de la tarea..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Prioridad</Label>
              <Select
                id="edit-priority"
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
              <Label htmlFor="edit-status">Estado</Label>
              <Select
                id="edit-status"
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
                <Label htmlFor="edit-estimatedDuration">Duración Estimada (días) *</Label>
                <Input
                  id="edit-estimatedDuration"
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedDuration: e.target.value })
                  }
                  placeholder="Ej: 5"
                  required={estimationMethod === "CPM"}
                />
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="edit-optimisticTime" className="text-xs">Optimista (O) *</Label>
                    <Input
                      id="edit-optimisticTime"
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
                    <Label htmlFor="edit-mostLikelyTime" className="text-xs">Más Probable (M) *</Label>
                    <Input
                      id="edit-mostLikelyTime"
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
                    <Label htmlFor="edit-pessimisticTime" className="text-xs">Pesimista (P) *</Label>
                    <Input
                      id="edit-pessimisticTime"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Fecha de Inicio</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-endDate">Fecha de Fin</Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-isCritical"
              checked={formData.isCritical}
              onChange={(e) =>
                setFormData({ ...formData, isCritical: e.target.checked })
              }
              className="w-4 h-4 accent-primary"
            />
            <Label htmlFor="edit-isCritical">Tarea crítica (ruta crítica)</Label>
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
              {loading ? "Actualizando..." : "Actualizar Tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}