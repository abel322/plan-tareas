"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, MoreVertical, Calendar, Users, Edit3, Trash2 } from "lucide-react"
import Link from "next/link"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"

const priorityVariants = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "critical",
  CRITICAL: "intelligence",
} as const

const statusLabels = {
  PLANNING: "Planificación",
  IN_PROGRESS: "En Progreso",
  ON_HOLD: "En Pausa",
  COMPLETED: "Completado",
  ARCHIVED: "Archivado",
}

export default function ProjectsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEditProject = (project: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingProject(project)
    setEditDialogOpen(true)
  }

  const handleDeleteProject = async (project: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`)) {
      try {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: 'DELETE'
        })
        
        if (res.ok) {
          fetchProjects() // Refresh the list
        } else {
          alert('Error al eliminar el proyecto')
        }
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Error al eliminar el proyecto')
      }
    }
  }

  const handleProjectCreated = () => {
    fetchProjects()
    setCreateDialogOpen(false)
  }

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === "IN_PROGRESS").length,
    completed: projects.filter(p => p.status === "COMPLETED").length,
    planning: projects.filter(p => p.status === "PLANNING").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary">
            Proyectos
          </h1>
          <p className="text-ink-secondary mt-1">
            Gestiona y monitorea todos tus proyectos
          </p>
        </div>
        <Button className="gap-2 shrink-0 self-start sm:self-auto" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </Button>
      </div>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onProjectCreated={handleProjectCreated}
      />

      <EditProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={editingProject}
        onProjectUpdated={fetchProjects}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Total</p>
            <p className="text-2xl font-bold text-ink-primary mt-1">{stats.total}</p>
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
            <p className="text-sm text-ink-tertiary">Completados</p>
            <p className="text-2xl font-bold text-success mt-1">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-tertiary">Planificación</p>
            <p className="text-2xl font-bold text-warning mt-1">{stats.planning}</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-ink-secondary">Cargando proyectos...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-secondary">No hay proyectos. Crea uno para comenzar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const totalTasks = project._count?.tasks || 0
            const progress = 0 // TODO: Calculate based on completed tasks
            
            return (
              <div key={project.id} className="group relative">
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Card className="hover:border-electric-cyan/40 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2 pr-4">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-ink-secondary line-clamp-2">
                            {project.description || "Sin descripción"}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-graphite/40 hover:border-electric-cyan/60 hover:bg-electric-cyan/10"
                            onClick={(e) => handleEditProject(project, e)}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-electric-cyan" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-graphite/40 hover:border-critical/60 hover:bg-critical/10"
                            onClick={(e) => handleDeleteProject(project, e)}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-critical" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant={priorityVariants[project.priority as keyof typeof priorityVariants]}>
                          {project.priority}
                        </Badge>
                        <Badge variant="default">
                          {statusLabels[project.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-ink-tertiary">Progreso</span>
                          <span className="font-mono font-medium text-ink-primary">
                            {progress}%
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          variant={
                            progress >= 75
                              ? "success"
                              : progress >= 50
                              ? "default"
                              : "warning"
                          }
                        />
                      </div>

                      {/* Tasks */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-tertiary">Tareas</span>
                        <span className="font-medium text-ink-primary">
                          0 / {totalTasks}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-graphite/30">
                        <div className="flex items-center gap-4 text-xs text-ink-tertiary">
                          {project.endDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(project.endDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{totalTasks}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
