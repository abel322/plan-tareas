"use client"

import { useMemo, useState } from "react"
import { Gantt, Task, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { Button } from "@/components/ui/button"
import { User, Activity, CheckSquare } from "lucide-react"

interface GanttChartProps {
  tasks: any[]
  projectStartDate?: string | null
  projectEndDate?: string | null
}

// Componente personalizado para la cabecera de la lista izquierda
const TaskListHeaderCustom: React.FC<{ headerHeight: number; rowWidth: string }> = ({
  headerHeight,
  rowWidth,
}) => {
  return (
    <div
      style={{
        height: headerHeight,
        width: rowWidth,
        display: "flex",
        alignItems: "center",
        paddingLeft: "16px",
        backgroundColor: "#0d1321",
        borderRight: "1px solid rgba(30, 41, 59, 0.5)",
        borderBottom: "1px solid rgba(30, 41, 59, 0.5)",
        fontSize: "11px",
        fontWeight: 700,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
      }}
    >
      Tarea
    </div>
  )
}

// Componente personalizado para la tabla de tareas de la lista izquierda
const TaskListTableCustom: React.FC<{
  rowHeight: number
  rowWidth: string
  tasks: Task[]
  selectedTaskId: string
  setSelectedTask: (taskId: string) => void
}> = ({ rowHeight, rowWidth, tasks, selectedTaskId, setSelectedTask }) => {
  return (
    <div style={{ width: rowWidth, borderRight: "1px solid rgba(30, 41, 59, 0.5)" }}>
      {tasks.map((task) => {
        const isSelected = selectedTaskId === task.id
        return (
          <div
            key={task.id}
            style={{
              height: rowHeight,
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              paddingRight: "8px",
              backgroundColor: isSelected ? "rgba(6, 182, 212, 0.08)" : "transparent",
              borderBottom: "1px solid rgba(30, 41, 59, 0.3)",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onClick={() => setSelectedTask(task.id)}
            className="hover:bg-surface/10"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-primary truncate w-full">
              {/* Icono dinámico según prioridad/estado de la tarea */}
              {task.styles?.backgroundColor === "#ef4444" ? (
                <Activity className="w-3.5 h-3.5 text-critical shrink-0 animate-pulse" />
              ) : task.progress === 100 ? (
                <CheckSquare className="w-3.5 h-3.5 text-success shrink-0" />
              ) : (
                <User className="w-3.5 h-3.5 text-electric-cyan shrink-0" />
              )}
              <span className="truncate tracking-wide" title={task.name}>
                {task.name}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function GanttChart({ tasks, projectStartDate, projectEndDate }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day)

  const ganttTasks = useMemo<Task[]>(() => {
    if (!tasks || tasks.length === 0) return []

    const defaultStart = projectStartDate ? new Date(projectStartDate) : new Date()
    const validTaskIds = new Set(tasks.map((t) => t.id))

    return tasks.map((task) => {
      const start = task.startDate ? new Date(task.startDate) : defaultStart
      let end = task.endDate ? new Date(task.endDate) : new Date(start.getTime() + 24 * 60 * 60 * 1000)

      if (end.getTime() <= start.getTime()) {
        end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
      }

      let progress = 0
      if (task.status === "COMPLETED") {
        progress = 100
      } else if (task.status === "IN_PROGRESS" || task.status === "REVIEW") {
        progress = 50
      }

      const dependencies = task.dependencies
        ?.map((dep: any) => dep.dependsOnId)
        .filter((depId: string) => validTaskIds.has(depId)) || []

      // Colores sólidos base de referencia (reemplazados por gradientes en CSS)
      const taskStyle = task.isCritical
        ? {
            backgroundColor: "#ef4444", 
            backgroundSelectedColor: "#f43f5e",
            progressColor: "#991b1b", 
            progressSelectedColor: "#be123c",
            textColor: "#ffffff",
            textSelectedColor: "#ffffff",
          }
        : {
            backgroundColor: "#06b6d4", 
            backgroundSelectedColor: "#22d3ee",
            progressColor: "#0891b2", 
            progressSelectedColor: "#0e7490",
            textColor: "#ffffff",
            textSelectedColor: "#ffffff",
          }

      return {
        id: task.id,
        name: task.name,
        start,
        end,
        progress,
        type: "task",
        dependencies,
        styles: taskStyle,
        isDisabled: false,
      } as Task
    })
  }, [tasks, projectStartDate])

  if (ganttTasks.length === 0) {
    return (
      <div className="py-12 text-center border border-border/30 bg-surface/10 rounded-lg">
        <p className="text-ink-secondary">Crea tareas con fechas de inicio y fin definidas para visualizar el diagrama de Gantt</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Definición de gradientes SVG neón ocultos */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <linearGradient id="cyan-neon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="critical-neon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Selectores de vista */}
      <div className="flex items-center justify-between pb-2 border-b border-border/10">
        <span className="text-xs text-ink-tertiary">Escala de tiempo</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={viewMode === ViewMode.Day ? "default" : "outline"}
            className="h-7 text-xs px-3"
            onClick={() => setViewMode(ViewMode.Day)}
          >
            Día
          </Button>
          <Button
            size="sm"
            variant={viewMode === ViewMode.Week ? "default" : "outline"}
            className="h-7 text-xs px-3"
            onClick={() => setViewMode(ViewMode.Week)}
          >
            Semana
          </Button>
          <Button
            size="sm"
            variant={viewMode === ViewMode.Month ? "default" : "outline"}
            className="h-7 text-xs px-3"
            onClick={() => setViewMode(ViewMode.Month)}
          >
            Mes
          </Button>
        </div>
      </div>

      {/* Contenedor del Gantt con altura aumentada significativamente y scroll */}
      <div className="w-full overflow-x-auto rounded-xl border border-border/30 bg-[#070b13] p-4 gantt-container-neon-v2">
        <div className="min-w-[850px]">
          <Gantt
            tasks={ganttTasks}
            viewMode={viewMode}
            locale="es"
            listCellWidth="230px" // Habilitar y dimensionar lista de tareas a la izquierda
            ganttHeight={450} // Altura aumentada significativamente
            rowHeight={50} // Altura de fila cómoda y moderna
            columnWidth={viewMode === ViewMode.Month ? 150 : viewMode === ViewMode.Week ? 120 : 65}
            barCornerRadius={6}
            handleWidth={8}
            todayColor="rgba(6, 182, 212, 0.08)"
            arrowColor="#06b6d4" 
            arrowIndent={20}
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="12px"
            TaskListHeader={TaskListHeaderCustom}
            TaskListTable={TaskListTableCustom}
          />
        </div>
      </div>

      {/* Leyenda y notas explicativas */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 px-2 text-xs">
        <span className="text-ink-tertiary">
          Visualización de cronograma y dependencias del proyecto.
        </span>
        <div className="flex items-center gap-4 text-ink-tertiary">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-electric-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span>Tarea Estándar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#ec4899] shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-pulse" />
            <span>Ruta Crítica (CPM)</span>
          </div>
        </div>
      </div>

      {/* Inyección de estilos globales avanzados neón */}
      <style jsx global>{`
        /* Personalización oscura avanzada */
        .gantt-container-neon-v2 svg {
          background-color: transparent !important;
        }

        /* Textos */
        .gantt-container-neon-v2 text {
          fill: #94a3b8 !important; /* text-slate-400 */
          font-weight: 500;
        }

        /* Rejilla y cuadrícula de fondo */
        .gantt-container-neon-v2 line {
          stroke: rgba(30, 41, 59, 0.4) !important;
        }

        /* Líneas de conexión de dependencias (Elegantes y sutiles) */
        .gantt-container-neon-v2 path {
          stroke: rgba(6, 182, 212, 0.4) !important; /* cian traslúcido */
          stroke-width: 1.5;
          stroke-dasharray: 3 3; /* punteado elegante */
          opacity: 0.8;
          filter: drop-shadow(0 0 1px rgba(6, 182, 212, 0.2));
        }

        /* Flechas de conexión */
        .gantt-container-neon-v2 polygon {
          fill: rgba(6, 182, 212, 0.6) !important;
          stroke: rgba(6, 182, 212, 0.6) !important;
        }

        /* Cabecera del calendario */
        .gantt-container-neon-v2 rect[class*="header"],
        .gantt-container-neon-v2 g[class*="header"] rect {
          fill: #0d1321 !important;
          stroke: rgba(30, 41, 59, 0.5) !important;
        }

        /* Relleno de las barras normales con gradiente y resplandor neón */
        .gantt-container-neon-v2 rect[fill="#06b6d4"] {
          fill: url(#cyan-neon-grad) !important;
          filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.5));
          rx: 6px;
        }

        /* Relleno de las barras críticas con gradiente y resplandor neón */
        .gantt-container-neon-v2 rect[fill="#ef4444"] {
          fill: url(#critical-neon-grad) !important;
          filter: drop-shadow(0 0 5px rgba(236, 72, 153, 0.6));
          rx: 6px;
        }

        /* Progreso interno de las tareas */
        .gantt-container-neon-v2 rect[fill="#0891b2"] {
          fill: #22d3ee !important; /* cian brillante */
          fill-opacity: 0.45;
        }

        .gantt-container-neon-v2 rect[fill="#991b1b"] {
          fill: #f43f5e !important; /* magenta brillante */
          fill-opacity: 0.45;
        }

        /* Nombres de las tareas al lado de la barra */
        .gantt-container-neon-v2 text[class*="bar"] {
          fill: #f8fafc !important;
          font-weight: 600;
          font-size: 11px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </div>
  )
}
