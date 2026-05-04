"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

export default function AnalyticsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks')
        ])

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData)
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate KPIs
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "COMPLETED").length
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0"
  
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS").length
  const efficiency = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100 + 15)) : 0
  
  // Calculate average duration (mock for now)
  const avgDuration = tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + (t.estimatedDuration || 5), 0) / tasks.length) : 0
  
  const completedProjects = projects.filter(p => p.status === "COMPLETED").length
  const totalProjects = projects.length

  // Calculate project performance
  const projectsWithProgress = projects.map(project => {
    const projectTasks = tasks.filter(t => t.projectId === project.id)
    const projectCompleted = projectTasks.filter(t => t.status === "COMPLETED").length
    const progress = projectTasks.length > 0 ? Math.round((projectCompleted / projectTasks.length) * 100) : 0
    
    let status = "on-track"
    if (progress < 30 && project.status === "IN_PROGRESS") status = "delayed"
    else if (progress < 60 && project.status === "IN_PROGRESS") status = "at-risk"
    
    return { ...project, progress, performanceStatus: status, taskCount: projectTasks.length }
  })

  const blockedTasks = tasks.filter(t => t.status === "BLOCKED").length
  const criticalTasks = tasks.filter(t => t.isCritical).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-ink-secondary">Cargando analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary">
          Analytics
        </h1>
        <p className="text-ink-secondary mt-1">
          Análisis detallado del rendimiento de tus proyectos
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Tasa de Completitud</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-ink-tertiary">{completedTasks} de {totalTasks} tareas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Eficiencia</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">{efficiency}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-electric-cyan/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-electric-cyan" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-ink-tertiary">Basado en tareas completadas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">{avgDuration}d</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-ink-tertiary">Duración estimada por tarea</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Proyectos Completados</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">{completedProjects}/{totalProjects}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-intelligence/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-intelligence" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0} variant="success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            {projectsWithProgress.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-ink-secondary">No hay proyectos para analizar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectsWithProgress.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-primary font-medium">{project.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-ink-secondary">{project.progress}%</span>
                        <Badge
                          variant={
                            project.performanceStatus === "on-track"
                              ? "success"
                              : project.performanceStatus === "at-risk"
                              ? "warning"
                              : "critical"
                          }
                          className="text-xs"
                        >
                          {project.performanceStatus === "on-track"
                            ? "En tiempo"
                            : project.performanceStatus === "at-risk"
                            ? "En riesgo"
                            : "Retrasado"}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={project.progress}
                      variant={
                        project.performanceStatus === "on-track"
                          ? "success"
                          : project.performanceStatus === "at-risk"
                          ? "warning"
                          : "critical"
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento del Equipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-mid">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm text-ink-tertiary">Completadas</span>
                </div>
                <p className="text-2xl font-bold text-ink-primary">{completedTasks}</p>
                <p className="text-xs text-ink-tertiary mt-1">Total</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-mid">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-electric-cyan" />
                  <span className="text-sm text-ink-tertiary">En Progreso</span>
                </div>
                <p className="text-2xl font-bold text-ink-primary">{inProgressTasks}</p>
                <p className="text-xs text-ink-tertiary mt-1">Activas</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-mid">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-intelligence" />
                  <span className="text-sm text-ink-tertiary">Proyectos</span>
                </div>
                <p className="text-2xl font-bold text-ink-primary">{projects.length}</p>
                <p className="text-xs text-ink-tertiary mt-1">Activos</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-mid">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm text-ink-tertiary">Bloqueadas</span>
                </div>
                <p className="text-2xl font-bold text-ink-primary">{blockedTasks}</p>
                <p className="text-xs text-ink-tertiary mt-1">Requieren atención</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights y Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 && projects.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-ink-secondary">Crea proyectos y tareas para ver insights personalizados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completionRate >= "70" && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/30">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-success">Buen rendimiento general</p>
                    <p className="text-sm text-ink-secondary mt-1">
                      El equipo está cumpliendo con el {completionRate}% de las tareas. Mantén el ritmo actual.
                    </p>
                  </div>
                </div>
              )}

              {projectsWithProgress.some(p => p.performanceStatus === "at-risk" || p.performanceStatus === "delayed") && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Atención requerida</p>
                    <p className="text-sm text-ink-secondary mt-1">
                      {projectsWithProgress.filter(p => p.performanceStatus === "at-risk" || p.performanceStatus === "delayed").length} proyecto(s) 
                      {projectsWithProgress.filter(p => p.performanceStatus === "at-risk" || p.performanceStatus === "delayed").length === 1 ? " está" : " están"} en riesgo de retraso. 
                      Considera reasignar recursos.
                    </p>
                  </div>
                </div>
              )}

              {criticalTasks > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-intelligence/10 border border-intelligence/30">
                  <Target className="w-5 h-5 text-intelligence shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-intelligence">Tareas críticas detectadas</p>
                    <p className="text-sm text-ink-secondary mt-1">
                      Hay {criticalTasks} tarea{criticalTasks !== 1 ? "s" : ""} crítica{criticalTasks !== 1 ? "s" : ""} que requieren atención prioritaria.
                    </p>
                  </div>
                </div>
              )}

              {tasks.length === 0 && projects.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Sin tareas asignadas</p>
                    <p className="text-sm text-ink-secondary mt-1">
                      Tienes {projects.length} proyecto{projects.length !== 1 ? "s" : ""} sin tareas. Añade tareas para comenzar a trabajar.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
