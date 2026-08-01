"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { CreateSpecificGoalDialog } from "@/components/projects/create-specific-goal-dialog"
import dynamic from "next/dynamic"

const GanttChart = dynamic(
  () => import("@/components/projects/gantt-chart").then((mod) => mod.GanttChart),
  { ssr: false }
)

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [createGoalDialogOpen, setCreateGoalDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [specificGoals, setSpecificGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"goals" | "tasks" | "gantt">("goals")

  const fetchProjectData = async () => {
    try {
      // Fetch project details
      const projectRes = await fetch(`/api/projects/${id}`)
      if (projectRes.ok) {
        const projectData = await projectRes.json()
        setProject(projectData)
        setTasks(projectData?.tasks || [])
        setSpecificGoals(projectData?.specificGoals || [])
      } else {
        setProject(null)
      }
    } catch (error) {
      console.error("Error fetching project data:", error)
      setProject(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProjectData()
    }
  }, [id])

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
          setTasks((prev) => prev.filter(t => t.id !== task.id))
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
        setTasks((prev) => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
      } else {
        alert('Error al actualizar la tarea')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Error al actualizar la tarea')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-9 w-32 bg-surface rounded-lg" />
        
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-64 bg-surface rounded-lg" />
              <div className="h-6 w-16 bg-surface rounded" />
              <div className="h-6 w-20 bg-surface rounded" />
            </div>
            <div className="h-4 w-full max-w-xl bg-surface rounded" />
          </div>
          <div className="h-10 w-32 bg-surface rounded-lg shrink-0" />
        </div>

        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/30 bg-surface/20">
              <CardContent className="pt-6">
                <div className="h-4 w-24 bg-surface rounded mb-2" />
                <div className="h-8 w-16 bg-surface rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-border/30 bg-surface/20">
              <CardHeader>
                <div className="h-6 w-48 bg-surface rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-surface rounded-lg" />
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border-border/30 bg-surface/20">
              <CardHeader>
                <div className="h-5 w-32 bg-surface rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-surface rounded" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/projects">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a Proyectos
          </Button>
        </Link>
        <Card className="border-border/30">
          <CardContent className="py-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-critical mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-ink-primary">Proyecto no encontrado</h3>
              <p className="text-sm text-ink-secondary">
                El proyecto que intentas ver no existe o no tienes permisos para acceder a él.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedTasks = tasks.filter(t => t.status === "COMPLETED").length
  const criticalTasks = tasks.filter(t => t.isCritical).length
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const handleDeleteGoal = async (goal: any) => {
    if (confirm(`¿Estás seguro de eliminar el objetivo "${goal.name}"?`)) {
      try {
        const res = await fetch(`/api/specific-goals/${goal.id}`, {
          method: "DELETE",
        })
        if (res.ok) {
          setSpecificGoals((prev) => prev.filter((g) => g.id !== goal.id))
          fetchProjectData()
        } else {
          alert("Error al eliminar el objetivo específico")
        }
      } catch (error) {
        console.error("Error deleting goal:", error)
        alert("Error al eliminar el objetivo específico")
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/projects">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a Proyectos
        </Button>
      </Link>

      {/* Step Banner if no specific goals exist */}
      {specificGoals.length === 0 && (
        <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Paso 1 Recomendado:</strong> Crea un <strong>Objetivo Específico</strong> antes de agregar tareas para estructurar adecuadamente la jerarquía de tu proyecto.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateGoalDialogOpen(true)}
            className="gap-1.5 shrink-0 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold"
          >
            <Target className="w-3.5 h-3.5" />
            Crear Objetivo Ahora
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary">
              {project.name}
            </h1>
            <Badge variant="critical">{project.priority}</Badge>
            <Badge variant="default">{project.status === "IN_PROGRESS" ? "En Progreso" : project.status}</Badge>
          </div>
          <p className="text-ink-secondary max-w-3xl">
            {project.description || "Sin descripción"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant={specificGoals.length === 0 ? "default" : "outline"}
            className={`gap-2 ${specificGoals.length === 0 ? "bg-electric-cyan text-midnight font-bold hover:bg-electric-cyan/90 shadow-lg shadow-electric-cyan/20" : ""}`}
            onClick={() => setCreateGoalDialogOpen(true)}
          >
            <Target className="w-4 h-4" />
            Nuevo Objetivo
          </Button>
          <div className="relative group">
            <Button
              className="gap-2 shrink-0 self-start sm:self-auto"
              onClick={() => setCreateTaskDialogOpen(true)}
              disabled={specificGoals.length === 0}
              title={specificGoals.length === 0 ? "Crea primero un objetivo específico para asociarle tareas" : "Nueva Tarea"}
            >
              <Plus className="w-4 h-4" />
              Nueva Tarea
            </Button>
          </div>
        </div>
      </div>

      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
        projectId={id}
        onTaskCreated={fetchProjectData}
      />

      <CreateSpecificGoalDialog
        open={createGoalDialogOpen}
        onOpenChange={setCreateGoalDialogOpen}
        projectId={id}
        onGoalCreated={fetchProjectData}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Progreso Total</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">{progress}%</p>
              </div>
              <div className="w-16 h-16">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(42, 49, 66, 0.4)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray={`${progress}, 100`}
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-ink-tertiary">Completadas</p>
                <p className="text-2xl font-bold text-ink-primary">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-ink-tertiary">Pendientes</p>
                <p className="text-2xl font-bold text-ink-primary">{tasks.length - completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-intelligence/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-intelligence" />
              </div>
              <div>
                <p className="text-sm text-ink-tertiary">Objetivos Específicos</p>
                <p className="text-2xl font-bold text-ink-primary">{specificGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Reordered: Objetivos Específicos | Lista de Tareas | Diagrama de Gantt */}
      <div className="flex border-b border-border/20 pt-2">
        <button
          onClick={() => setActiveTab("goals")}
          className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "goals"
              ? "border-electric-cyan text-electric-cyan bg-electric-cyan/5"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface/10"
          }`}
        >
          Objetivos Específicos ({specificGoals.length})
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "tasks"
              ? "border-electric-cyan text-electric-cyan bg-electric-cyan/5"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface/10"
          }`}
        >
          Lista de Tareas ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab("gantt")}
          className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "gantt"
              ? "border-electric-cyan text-electric-cyan bg-electric-cyan/5"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface/10"
          }`}
        >
          Diagrama de Gantt
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Content (Goals, Tasks or Gantt) */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "tasks" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-ink-primary">
                  Tareas Agrupadas por Objetivo Específico
                </h2>
                <Button
                  size="sm"
                  onClick={() => setCreateTaskDialogOpen(true)}
                  disabled={specificGoals.length === 0}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Tarea
                </Button>
              </div>

              {tasks.length === 0 ? (
                <Card className="border-border/30">
                  <CardContent className="py-12 text-center space-y-3">
                    <p className="text-ink-secondary font-medium">No hay tareas en este proyecto</p>
                    <p className="text-xs text-ink-tertiary">
                      {specificGoals.length === 0
                        ? "Crea un objetivo específico antes de comenzar a registrar tareas."
                        : "Haz clic en 'Nueva Tarea' para vincular actividades a tus Objetivos Específicos."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Group Tasks By Specific Goal */}
                  {specificGoals.map((goal) => {
                    const goalTasks = tasks.filter((t) => t.specificGoalId === goal.id)
                    const completedGoalTasks = goalTasks.filter((t) => t.status === "COMPLETED").length
                    const goalProgress =
                      goalTasks.length > 0
                        ? Math.round((completedGoalTasks / goalTasks.length) * 100)
                        : 0

                    return (
                      <Card key={goal.id} className="border-border/40 overflow-hidden shadow-sm">
                        <CardHeader className="bg-surface/30 py-3.5 px-4 flex flex-row items-center justify-between border-b border-border/30">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Target className="w-4.5 h-4.5 text-electric-cyan shrink-0" />
                            <CardTitle className="text-base font-bold text-ink-primary truncate">
                              {goal.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs shrink-0 ml-1">
                              {completedGoalTasks}/{goalTasks.length} Completadas
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-electric-cyan">{goalProgress}%</span>
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-electric-cyan transition-all duration-300"
                                style={{ width: `${goalProgress}%` }}
                              />
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4">
                          {goalTasks.length === 0 ? (
                            <p className="text-xs text-ink-muted italic py-3 text-center">
                              No hay tareas registradas para este objetivo específico.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {goalTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className={`group relative flex items-center justify-between gap-4 p-4 rounded-lg border transition-all ${
                                    task.isCritical
                                      ? "border-intelligence/50 bg-intelligence/5 critical-path-glow"
                                      : "border-border/40 bg-surface/10 hover:bg-surface/30 hover:border-border/60"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                                        task.status === "COMPLETED"
                                          ? "bg-success border-success text-midnight"
                                          : "border-text-secondary hover:border-electric-cyan"
                                      }`}
                                      onClick={(e) => handleToggleTaskStatus(task, e)}
                                    >
                                      {task.status === "COMPLETED" && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-midnight stroke-[3]" />
                                      )}
                                    </div>
                                    <div className="flex-1 pr-4 min-w-0">
                                      <p
                                        className={`font-semibold text-sm tracking-wide transition-all ${
                                          task.status === "COMPLETED"
                                            ? "text-text-muted line-through opacity-70"
                                            : "text-text-primary"
                                        }`}
                                      >
                                        {task.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {task.isCritical && (
                                      <Badge variant="intelligence" className="text-xs">
                                        Crítica
                                      </Badge>
                                    )}
                                    <Badge
                                      variant={
                                        task.priority === "CRITICAL"
                                          ? "critical"
                                          : task.priority === "HIGH"
                                          ? "warning"
                                          : "default"
                                      }
                                      className="text-xs font-semibold"
                                    >
                                      {task.priority}
                                    </Badge>
                                    <div className="flex gap-1.5 ml-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 border-border/60 hover:border-electric-cyan hover:bg-electric-cyan/20 transition-all"
                                        onClick={(e) => handleEditTask(task, e)}
                                      >
                                        <Edit3 className="w-4 h-4 text-electric-cyan" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 border-border/60 hover:border-critical hover:bg-critical/20 transition-all"
                                        onClick={(e) => handleDeleteTask(task, e)}
                                      >
                                        <Trash2 className="w-4 h-4 text-critical" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}

                  {/* Tasks without specificGoalId (if any exist) */}
                  {tasks.some((t) => !t.specificGoalId) && (
                    <Card className="border-border/30 overflow-hidden">
                      <CardHeader className="bg-surface/20 py-3 px-4 border-b border-border/20">
                        <CardTitle className="text-sm font-bold text-ink-tertiary">
                          Otras Tareas (Sin Objetivo Asignado)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {tasks
                          .filter((t) => !t.specificGoalId)
                          .map((task) => (
                            <div
                              key={task.id}
                              className={`group relative flex items-center justify-between gap-4 p-4 rounded-lg border transition-all ${
                                task.isCritical
                                  ? "border-intelligence/50 bg-intelligence/5 critical-path-glow"
                                  : "border-border/40 bg-surface/10 hover:bg-surface/30 hover:border-border/60"
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                                    task.status === "COMPLETED"
                                      ? "bg-success border-success text-midnight"
                                      : "border-text-secondary hover:border-electric-cyan"
                                  }`}
                                  onClick={(e) => handleToggleTaskStatus(task, e)}
                                >
                                  {task.status === "COMPLETED" && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-midnight stroke-[3]" />
                                  )}
                                </div>
                                <div className="flex-1 pr-4 min-w-0">
                                  <p
                                    className={`font-semibold text-sm tracking-wide transition-all ${
                                      task.status === "COMPLETED"
                                        ? "text-text-muted line-through opacity-70"
                                        : "text-text-primary"
                                    }`}
                                  >
                                    {task.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {task.isCritical && (
                                  <Badge variant="intelligence" className="text-xs">
                                    Crítica
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    task.priority === "CRITICAL"
                                      ? "critical"
                                      : task.priority === "HIGH"
                                      ? "warning"
                                      : "default"
                                  }
                                  className="text-xs font-semibold"
                                >
                                  {task.priority}
                                </Badge>
                                <div className="flex gap-1.5 ml-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-border/60 hover:border-electric-cyan hover:bg-electric-cyan/20 transition-all"
                                    onClick={(e) => handleEditTask(task, e)}
                                  >
                                    <Edit3 className="w-4 h-4 text-electric-cyan" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-border/60 hover:border-critical hover:bg-critical/20 transition-all"
                                    onClick={(e) => handleDeleteTask(task, e)}
                                  >
                                    <Trash2 className="w-4 h-4 text-critical" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === "goals" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink-primary">
                    Objetivos Específicos & Secuencia
                  </h2>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Estructura jerárquica con dependencias secuenciales e hitos en paralelo
                  </p>
                </div>
                <Button size="sm" onClick={() => setCreateGoalDialogOpen(true)} className="gap-2 self-start sm:self-auto">
                  <Plus className="w-4 h-4" />
                  Agregar Objetivo
                </Button>
              </div>

              {specificGoals.length === 0 ? (
                <Card className="border-border/30">
                  <CardContent className="py-12 text-center space-y-4">
                    <Target className="w-12 h-12 text-electric-cyan mx-auto opacity-60" />
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-ink-primary">No hay Objetivos Específicos</h3>
                      <p className="text-sm text-ink-secondary">
                        Crea objetivos específicos para estructurar jerárquicamente tu proyecto.
                      </p>
                    </div>
                    <Button onClick={() => setCreateGoalDialogOpen(true)} variant="outline" className="gap-2 mt-2">
                      <Plus className="w-4 h-4" />
                      Crear Primer Objetivo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Visual Summary Flow */}
                  <div className="p-4 border rounded-xl bg-muted/20 space-y-3">
                    <h3 className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">
                      Esquema de Ejecución del Proyecto
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center text-xs">
                      {specificGoals.map((g, idx) => {
                        const isParallel = !g.predecessorId
                        const isBlocked = g.predecessorId && g.predecessor?.status !== "COMPLETED"
                        return (
                          <div key={g.id} className="flex items-center gap-1.5">
                            <span
                              className={`px-2.5 py-1 rounded-md border font-medium flex items-center gap-1.5 ${
                                isParallel
                                  ? "border-electric-cyan/40 bg-electric-cyan/10 text-electric-cyan"
                                  : isBlocked
                                  ? "border-warning/40 bg-warning/10 text-warning"
                                  : "border-success/40 bg-success/10 text-success"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {g.name}
                              <span className="text-[10px] opacity-75">
                                ({isParallel ? "Paralelo" : isBlocked ? "Bloqueado" : "Listo"})
                              </span>
                            </span>
                            {idx < specificGoals.length - 1 && (
                              <span className="text-ink-tertiary font-bold">→</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* List of Goals */}
                  <div className="space-y-4">
                    {specificGoals.map((goal) => {
                      const goalTasks = tasks.filter((t) => t.specificGoalId === goal.id)
                      const completedGoalTasks = goalTasks.filter((t) => t.status === "COMPLETED").length
                      const goalProgress =
                        goalTasks.length > 0
                          ? Math.round((completedGoalTasks / goalTasks.length) * 100)
                          : 0

                      const isParallel = !goal.predecessorId
                      const predecessorName = goal.predecessor?.name
                      const isPredecessorDone = goal.predecessor?.status === "COMPLETED"

                      return (
                        <Card
                          key={goal.id}
                          className={`border transition-all ${
                            isParallel
                              ? "border-border/40 hover:border-electric-cyan/50"
                              : !isPredecessorDone
                              ? "border-warning/30 bg-warning/5"
                              : "border-success/30 bg-success/5"
                          }`}
                        >
                          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="text-lg font-bold text-ink-primary">
                                  {goal.name}
                                </CardTitle>
                                <Badge
                                  variant={
                                    goal.priority === "CRITICAL"
                                      ? "critical"
                                      : goal.priority === "HIGH"
                                      ? "warning"
                                      : "default"
                                  }
                                  className="text-xs"
                                >
                                  {goal.priority || "MEDIA"}
                                </Badge>
                                {isParallel ? (
                                  <Badge variant="outline" className="text-xs border-electric-cyan/40 text-electric-cyan bg-electric-cyan/10">
                                    Ejecución en Paralelo
                                  </Badge>
                                ) : !isPredecessorDone ? (
                                  <Badge variant="outline" className="text-xs border-warning/40 text-warning bg-warning/10">
                                    Secuencial - Bloqueado por: {predecessorName || "Predecesor"}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs border-success/40 text-success bg-success/10">
                                    Secuencial - Desbloqueado (Predecesor Listo)
                                  </Badge>
                                )}
                              </div>
                              {goal.description && (
                                <p className="text-sm text-ink-secondary">{goal.description}</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-critical hover:bg-critical/10 shrink-0"
                              onClick={() => handleDeleteGoal(goal)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            {/* Goal Progress Bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-ink-secondary">Progreso del Objetivo</span>
                                <span className="text-electric-cyan">
                                  {goalProgress}% ({completedGoalTasks}/{goalTasks.length} tareas)
                                </span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-electric-cyan transition-all duration-300"
                                  style={{ width: `${goalProgress}%` }}
                                />
                              </div>
                            </div>

                            {/* Goal Tasks List */}
                            <div className="pt-2">
                              <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
                                Tareas Vinculadas ({goalTasks.length})
                              </p>
                              {goalTasks.length === 0 ? (
                                <p className="text-xs text-ink-muted italic py-1">
                                  No hay tareas vinculadas a este objetivo.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {goalTasks.map((task) => (
                                    <div
                                      key={task.id}
                                      className="flex items-center justify-between p-2.5 rounded-md bg-muted/40 border border-border/20 text-sm"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <div
                                          className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                                            task.status === "COMPLETED"
                                              ? "bg-success border-success text-midnight"
                                              : "border-text-secondary"
                                          }`}
                                          onClick={(e) => handleToggleTaskStatus(task, e)}
                                        >
                                          {task.status === "COMPLETED" && (
                                            <CheckCircle2 className="w-3 h-3 text-midnight" />
                                          )}
                                        </div>
                                        <span
                                          className={
                                            task.status === "COMPLETED"
                                              ? "line-through text-ink-tertiary"
                                              : "text-ink-primary font-medium"
                                          }
                                        >
                                          {task.name}
                                        </span>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {task.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="border-border/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cronograma del Proyecto (Gantt)</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-electric-cyan" />
                  Visualización Temporal
                </Badge>
              </CardHeader>
              <CardContent>
                <GanttChart
                  tasks={tasks}
                  projectStartDate={project.startDate}
                  projectEndDate={project.endDate}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {project.startDate && (
                <div className="flex items-center gap-3 text-sm border-b border-border/20 pb-3">
                  <Calendar className="w-4 h-4 text-ink-tertiary" />
                  <div>
                    <p className="text-ink-tertiary text-xs">Inicio</p>
                    <p className="text-ink-primary font-medium">
                      {new Date(project.startDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
              {project.endDate && (
                <div className="flex items-center gap-3 text-sm border-b border-border/20 pb-3">
                  <Calendar className="w-4 h-4 text-ink-tertiary" />
                  <div>
                    <p className="text-ink-tertiary text-xs">Fin Estimado</p>
                    <p className="text-ink-primary font-medium">
                      {new Date(project.endDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-ink-tertiary" />
                <div>
                  <p className="text-ink-tertiary text-xs">Tareas</p>
                  <p className="text-ink-primary font-medium">
                    {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMART Objective */}
          {project.objective && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-electric-cyan" />
                  <CardTitle className="text-base">Objetivo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-primary">{project.objective}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={editingTask}
        onTaskUpdated={fetchProjectData}
      />
    </div>
  )
}
