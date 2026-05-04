"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  User,
  Edit3,
  Trash2,
} from "lucide-react"

const priorityVariants = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "critical",
  CRITICAL: "intelligence",
} as const

const statusLabels = {
  TODO: "Por Hacer",
  IN_PROGRESS: "En Progreso",
  REVIEW: "En Revisión",
  COMPLETED: "Completada",
  BLOCKED: "Bloqueada",
}

const statusColors = {
  TODO: "text-ink-tertiary",
  IN_PROGRESS: "text-electric-cyan",
  REVIEW: "text-warning",
  COMPLETED: "text-success",
  BLOCKED: "text-critical",
}

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks')
        if (res.ok) {
          const data = await res.json()
          setTasks(data)
        }
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleEditTask = (task: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingTask(task)
    setEditDialogOpen(true)
  }

  const handleDeleteTask = async (task: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.name}"? Esta acción no se puede deshacer.`)) {
      try {
        const res = await fetch(`/api/tasks/${task.id}`, {
          method: 'DELETE'
        })
        
        if (res.ok) {
          setTasks(tasks.filter(t => t.id !== task.id)) // Remove from state
        } else {
          alert('Error al eliminar la tarea')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Error al eliminar la tarea')
      }
    }
  }

  const handleToggleTaskStatus = async (task: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED"
    
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
      } else {
        alert('Error al actualizar la tarea')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Error al actualizar la tarea')
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter
    const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    critical: tasks.filter((t) => t.isCritical).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary">
          Tareas
        </h1>
        <p className="text-ink-secondary mt-1">
          Gestiona todas las tareas de tus proyectos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Total</p>
            <p className="text-2xl font-bold text-ink-primary mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Completadas</p>
            <p className="text-2xl font-bold text-success mt-1">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">En Progreso</p>
            <p className="text-2xl font-bold text-electric-cyan mt-1">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Por Hacer</p>
            <p className="text-2xl font-bold text-warning mt-1">{stats.todo}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Críticas</p>
            <p className="text-2xl font-bold text-intelligence mt-1">{stats.critical}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <Input
                  id="search"
                  placeholder="Buscar tareas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todos</option>
                <option value="TODO">Por Hacer</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="REVIEW">En Revisión</option>
                <option value="COMPLETED">Completadas</option>
                <option value="BLOCKED">Bloqueadas</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                id="priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">Todas</option>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-ink-secondary">Cargando tareas...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Filter className="w-12 h-12 text-ink-muted mx-auto mb-4" />
                <p className="text-ink-secondary">
                  {tasks.length === 0 
                    ? "No hay tareas. Crea un proyecto y añade tareas para comenzar."
                    : "No se encontraron tareas con los filtros aplicados"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="group relative">
                <Card
                  className={`hover:border-electric-cyan/40 transition-all cursor-pointer ${
                    task.isCritical ? "critical-path-glow" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all ${
                          task.status === "COMPLETED"
                            ? "bg-success border-success"
                            : "border-graphite hover:border-electric-cyan"
                        }`}
                        onClick={(e) => handleToggleTaskStatus(task, e)}
                      >
                        {task.status === "COMPLETED" && (
                          <CheckCircle2 className="w-3 h-3 text-midnight" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 pr-4">
                              <h3
                                className={`font-medium ${
                                  task.status === "COMPLETED"
                                    ? "text-ink-tertiary line-through"
                                    : "text-ink-primary"
                                }`}
                              >
                                {task.name}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-ink-secondary mt-1">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {task.isCritical && (
                                <Badge variant="intelligence" className="text-xs">
                                  Crítica
                                </Badge>
                              )}
                              <Badge variant={priorityVariants[task.priority as keyof typeof priorityVariants]} className="text-xs">
                                {task.priority}
                              </Badge>
                              <div className="flex gap-1 ml-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 w-7 p-0 border-graphite/40 hover:border-electric-cyan/60 hover:bg-electric-cyan/10"
                                  onClick={(e) => handleEditTask(task, e)}
                                >
                                  <Edit3 className="w-3 h-3 text-electric-cyan" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 w-7 p-0 border-graphite/40 hover:border-critical/60 hover:bg-critical/10"
                                  onClick={(e) => handleDeleteTask(task, e)}
                                >
                                  <Trash2 className="w-3 h-3 text-critical" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-tertiary">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${statusColors[task.status as keyof typeof statusColors].replace('text-', 'bg-')}`} />
                            <span>{statusLabels[task.status as keyof typeof statusLabels]}</span>
                          </div>

                          {task.estimatedDuration && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedDuration} días</span>
                            </div>
                          )}

                          {task.assignee && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3" />
                              <span>{task.assignee.name}</span>
                            </div>
                          )}

                          {task.startDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(task.startDate).toLocaleDateString('es-ES', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          )}

                          {task.project && (
                            <>
                              <div className="flex items-center gap-1.5">
                                <span className="text-ink-muted">•</span>
                                <span>{task.project.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && filteredTasks.length > 0 && (
        <p className="text-sm text-ink-tertiary text-center">
          Mostrando {filteredTasks.length} de {tasks.length} tareas
        </p>
      )}

      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={editingTask}
        onTaskUpdated={() => {
          // Refresh tasks
          const fetchTasks = async () => {
            try {
              const res = await fetch('/api/tasks')
              if (res.ok) {
                const data = await res.json()
                setTasks(data)
              }
            } catch (error) {
              console.error("Error fetching tasks:", error)
            }
          }
          fetchTasks()
        }}
      />
    </div>
  )
}
