"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { CreateSpecificGoalDialog } from "@/components/projects/create-specific-goal-dialog"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Target,
  Trash2,
} from "lucide-react"

export default function GoalsPage() {
  const [projectFilter, setProjectFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const [projects, setProjects] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Dialogs
  const [createGoalOpen, setCreateGoalOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [selectedGoalForTask, setSelectedGoalForTask] = useState<any>(null)

  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({})

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        setProjects(await res.json())
      }
    } catch (err) {
      console.error("Error fetching projects:", err)
    }
  }

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const url = projectFilter === "ALL"
        ? "/api/specific-goals"
        : `/api/specific-goals?projectId=${projectFilter}`
      const res = await fetch(url)
      if (res.ok) {
        setGoals(await res.json())
      }
    } catch (err) {
      console.error("Error fetching goals:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [projectFilter])

  const toggleGoalExpand = (goalId: string) => {
    setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }))
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este Objetivo Específico? Esta acción no se puede deshacer.")) {
      try {
        const res = await fetch(`/api/specific-goals/${goalId}`, {
          method: "DELETE",
        })
        if (res.ok) {
          setGoals((prev) => prev.filter((g) => g.id !== goalId))
        } else {
          alert("Error al eliminar el objetivo específico")
        }
      } catch (err) {
        console.error(err)
        alert("Error al eliminar el objetivo específico")
      }
    }
  }

  const handleToggleTaskStatus = async (task: any) => {
    const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED"
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        fetchGoals()
      } else {
        alert("Error al actualizar la tarea")
      }
    } catch (error) {
      console.error(error)
      alert("Error al actualizar la tarea")
    }
  }

  const filteredGoals = goals.filter((goal) => {
    const matchesStatus = statusFilter === "ALL" || goal.status === statusFilter
    const matchesPriority = priorityFilter === "ALL" || goal.priority === priorityFilter
    const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.status === "COMPLETED").length,
    inProgress: goals.filter((g) => g.status === "IN_PROGRESS").length,
    todo: goals.filter((g) => g.status === "TODO").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary flex items-center gap-2">
            <Target className="w-8 h-8 text-electric-cyan" />
            Objetivos Específicos
          </h1>
          <p className="text-ink-secondary mt-1">
            Estructura los objetivos y asóciales tareas secuenciales para tu proyecto
          </p>
        </div>
        <div className="relative group">
          <Button
            className="gap-2 shrink-0 self-start sm:self-auto bg-electric-cyan text-midnight font-bold hover:bg-electric-cyan/95 shadow-lg shadow-electric-cyan/20"
            onClick={() => setCreateGoalOpen(true)}
            disabled={projectFilter === "ALL"}
            title={projectFilter === "ALL" ? "Selecciona un Proyecto primero" : "Nuevo Objetivo"}
          >
            <Plus className="w-4 h-4" />
            Nuevo Objetivo Específico
          </Button>
          {projectFilter === "ALL" && (
            <p className="text-[11px] text-amber-500 mt-1 font-semibold">
              * Selecciona un Proyecto específico para agregar objetivos.
            </p>
          )}
        </div>
      </div>

      <CreateSpecificGoalDialog
        open={createGoalOpen}
        onOpenChange={setCreateGoalOpen}
        projectId={projectFilter}
        onGoalCreated={fetchGoals}
      />

      {selectedGoalForTask && (
        <CreateTaskDialog
          open={createTaskOpen}
          onOpenChange={setCreateTaskOpen}
          projectId={selectedGoalForTask.projectId}
          specificGoalId={selectedGoalForTask.id}
          onTaskCreated={fetchGoals}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Total Objetivos</p>
            <p className="text-2xl font-bold text-ink-primary mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Completados</p>
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
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Proyecto *</Label>
              <Select
                id="project"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="ALL">Todos los Proyectos</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado del Objetivo</Label>
              <Select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todos los Estados</option>
                <option value="TODO">Por Hacer</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completados</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad del Objetivo</Label>
              <Select
                id="priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">Todas las Prioridades</option>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Buscar Objetivo</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <Input
                  id="search"
                  placeholder="Filtrar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specific Goals List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-ink-secondary">Cargando objetivos...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Filter className="w-12 h-12 text-ink-muted mx-auto mb-4" />
                <p className="text-ink-secondary">
                  {goals.length === 0
                    ? "No hay Objetivos Específicos creados. Selecciona un Proyecto para comenzar."
                    : "No se encontraron Objetivos Específicos con los filtros aplicados"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredGoals.map((goal) => {
              const totalTasks = goal.tasks?.length || 0
              const completedTasks = goal.tasks?.filter((t: any) => t.status === "COMPLETED").length || 0
              const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
              const isExpanded = !!expandedGoals[goal.id]

              return (
                <Card key={goal.id} className="border-border/40 hover:border-border/60 transition-all overflow-hidden">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Target className="w-5 h-5 text-electric-cyan shrink-0" />
                          <h3 className="font-bold text-lg text-ink-primary">{goal.name}</h3>
                          <Badge variant={
                            goal.priority === "CRITICAL" ? "critical" :
                            goal.priority === "HIGH" ? "warning" : "default"
                          }>
                            {goal.priority}
                          </Badge>
                          <Badge variant="outline">
                            {goal.status === "COMPLETED" ? "Completado" :
                             goal.status === "IN_PROGRESS" ? "En Progreso" : "Por Hacer"}
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-ink-secondary">{goal.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleGoalExpand(goal.id)}
                          className="gap-1.5"
                        >
                          {isExpanded ? "Ocultar Tareas" : `Ver Tareas (${totalTasks})`}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-graphite/40 hover:border-critical/60 hover:bg-critical/10"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-critical" />
                        </Button>
                      </div>
                    </div>

                    {/* Goal Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-ink-tertiary">
                        <span>Progreso de Tareas ({completedTasks}/{totalTasks})</span>
                        <span className="text-electric-cyan">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-electric-cyan transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Expanded Task list */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-border/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-ink-primary">Tareas Asociadas</h4>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedGoalForTask(goal)
                              setCreateTaskOpen(true)
                            }}
                            className="gap-1.5 bg-electric-cyan/10 hover:bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30 font-semibold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Agregar Tarea a este Objetivo
                          </Button>
                        </div>

                        {totalTasks === 0 ? (
                          <p className="text-xs text-ink-muted italic py-3 text-center">
                            No hay tareas asociadas a este objetivo específico.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {goal.tasks.map((task: any) => (
                              <div
                                key={task.id}
                                className={`flex items-center justify-between p-3 rounded-lg border border-border/20 bg-surface/5 hover:bg-surface/10 transition-all ${
                                  task.isCritical ? "border-intelligence/50 bg-intelligence/5 critical-path-glow" : ""
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                                      task.status === "COMPLETED" ? "bg-success border-success text-midnight" : "border-ink-tertiary"
                                    }`}
                                    onClick={() => handleToggleTaskStatus(task)}
                                  >
                                    {task.status === "COMPLETED" && (
                                      <CheckCircle2 className="w-3 h-3 text-midnight" />
                                    )}
                                  </div>
                                  <span className={`text-sm font-medium truncate ${task.status === "COMPLETED" ? "text-ink-tertiary line-through" : "text-ink-primary"}`}>
                                    {task.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  {task.isCritical && (
                                    <Badge variant="intelligence" className="text-[10px] py-0 shrink-0">
                                      Crítica
                                    </Badge>
                                  )}
                                  <Badge variant={task.priority === "CRITICAL" ? "critical" : task.priority === "HIGH" ? "warning" : "default"} className="text-[10px] py-0 shrink-0">
                                    {task.priority}
                                  </Badge>
                                  {task.estimatedDuration && (
                                    <span className="text-xs text-ink-tertiary shrink-0 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-electric-cyan" />
                                      {task.estimatedDuration}d
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
