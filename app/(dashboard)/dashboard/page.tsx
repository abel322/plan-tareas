import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary">
          Dashboard
        </h1>
        <p className="text-ink-secondary mt-1">
          Resumen general de tus proyectos y tareas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Proyectos Activos</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-electric-cyan/10 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-electric-cyan" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-success">+0</span>
              <span className="text-ink-tertiary">este mes</span>
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Tareas Completadas</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={0} max={0} variant="success" />
              <p className="text-xs text-ink-tertiary mt-2">0 de 0 tareas</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Tareas Pendientes</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-warning">0 críticas</span>
              <span className="text-ink-tertiary">requieren atención</span>
            </div>
          </CardContent>
        </Card>

        {/* Critical Path */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-tertiary">Ruta Crítica</p>
                <p className="text-3xl font-bold text-ink-primary mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-intelligence/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-intelligence" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="text-intelligence">Tareas críticas</span>
              <span className="text-ink-tertiary">en progreso</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Recientes</CardTitle>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <p className="text-ink-secondary">No hay proyectos para mostrar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Críticas</CardTitle>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <p className="text-ink-secondary">No hay tareas críticas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
