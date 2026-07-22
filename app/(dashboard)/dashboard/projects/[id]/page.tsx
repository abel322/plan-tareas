"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import Link from "next/link"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const projectRes = await fetch(`/api/projects/${params.id}`)
        if (projectRes.ok) {
          const projectData = await projectRes.json()
          setProject(projectData)
        }

        // Fetch tasks for this project
        const tasksRes = await fetch(`/api/tasks?projectId=${params.id}`)
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }
      } catch (error) {
        console.error("Error fetching project data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [params.id])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-ink-secondary">Cargando...</p>
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-secondary">Proyecto no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedTasks = tasks.filter(t => t.status === "COMPLETED").length
  const criticalTasks = tasks.filter(t => t.isCritical).length
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/projects">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a Proyectos
        </Button>
      </Link>

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
        <Button className="gap-2 shrink-0 self-start sm:self-auto" onClick={() => setCreateTaskDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nueva Tarea
        </Button>
      </div>

      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
        projectId={params.id}
        onTaskCreated={fetchProjectData}
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
                <p className="text-sm text-ink-tertiary">Críticas</p>
                <p className="text-2xl font-bold text-ink-primary">{criticalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tareas del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-ink-secondary">No hay tareas en este proyecto</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group relative flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        task.isCritical
                          ? "border-intelligence/40 critical-path-glow"
                          : "border-graphite/40 hover:border-graphite/60"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
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
                      <div className="flex-1 pr-4">
                        <p
                          className={`font-medium ${
                            task.status === "COMPLETED"
                              ? "text-ink-tertiary line-through"
                              : "text-ink-primary"
                          }`}
                        >
                          {task.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
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
                          className="text-xs"
                        >
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.startDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-ink-tertiary" />
                  <div>
                    <p className="text-ink-tertiary">Inicio</p>
                    <p className="text-ink-primary font-medium">
                      {new Date(project.startDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
              {project.endDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-ink-tertiary" />
                  <div>
                    <p className="text-ink-tertiary">Fin Estimado</p>
                    <p className="text-ink-primary font-medium">
                      {new Date(project.endDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-ink-tertiary" />
                <div>
                  <p className="text-ink-tertiary">Tareas</p>
                  <p className="text-ink-primary font-medium">{tasks.length} tareas</p>
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
        onTaskUpdated={() => {
          // Refresh tasks
          const fetchTasks = async () => {
            try {
              const tasksRes = await fetch(`/api/tasks?projectId=${params.id}`)
              if (tasksRes.ok) {
                const tasksData = await tasksRes.json()
                setTasks(tasksData)
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
