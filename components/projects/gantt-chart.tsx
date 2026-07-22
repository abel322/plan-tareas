"use client"

import { useMemo, useState } from "react"
import { Gantt, Task, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { Button } from "@/components/ui/button"
import { Code, Database, FileText, CheckCircle2, Terminal } from "lucide-react"

interface GanttChartProps {
  tasks: any[]
  projectStartDate?: string | null
  projectEndDate?: string | null
}

// Función para obtener el icono según el tipo o nombre de tarea
const getTaskIcon = (name: string, isCompleted: boolean) => {
  if (isCompleted) return <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
  
  const lowerName = name.toLowerCase()
  if (lowerName.includes("diseño") || lowerName.includes("ui") || lowerName.includes("carrusel") || lowerName.includes("mockup")) {
    return <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
  }
  if (lowerName.includes("api") || lowerName.includes("endpoint") || lowerName.includes("backend") || lowerName.includes("auth")) {
    return <Code className="w-3.5 h-3.5 text-electric-cyan shrink-0" />
  }
  if (lowerName.includes("base") || lowerName.includes("db") || lowerName.includes("prisma") || lowerName.includes("postgres")) {
    return <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
  }
  return <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
}

// Componente de Tooltip Personalizado de Alta Fidelidad
const GanttTooltipCustom: React.FC<{
  task: Task
  fontSize: string
  fontFamily: string
}> = ({ task }) => {
  const t = task as any
  return (
    <div className="bg-[#0B0F19]/95 border border-electric-cyan/40 rounded-xl p-4 shadow-2xl backdrop-blur-md min-w-[240px] space-y-2 pointer-events-none text-xs text-slate-300">
      <div className="flex items-center justify-between gap-3 border-b border-border/20 pb-2">
        <span className="font-bold text-white text-sm truncate max-w-[160px]" title={t.name}>
          {t.name}
        </span>
        {t.isCritical && (
          <span className="bg-critical/10 text-critical text-[10px] px-2 py-0.5 rounded border border-critical/30 animate-pulse font-semibold">
            Ruta Crítica
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-500">Inicio:</span>
          <span className="text-slate-300 font-medium">{t.start.toLocaleDateString('es-ES')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Fin:</span>
          <span className="text-slate-300 font-medium">{t.end.toLocaleDateString('es-ES')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Progreso:</span>
          <span className="text-electric-cyan font-bold bg-electric-cyan/10 px-1.5 py-0.5 rounded">
            {t.progress}%
          </span>
        </div>
        {t.assigneeName && (
          <div className="flex justify-between border-t border-border/10 pt-2 mt-2">
            <span className="text-slate-500">Responsable:</span>
            <span className="text-slate-200 font-medium truncate max-w-[130px]">{t.assigneeName}</span>
          </div>
        )}
      </div>
    </div>
  )
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
        borderRight: "1px solid rgba(30, 41, 59, 0.4)",
        borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
        fontSize: "11px",
        fontWeight: 700,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
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
    <div style={{ width: rowWidth, borderRight: "1px solid rgba(30, 41, 59, 0.4)" }}>
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
              borderBottom: "1px solid rgba(30, 41, 59, 0.15)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onClick={() => setSelectedTask(task.id)}
            className={`transition-all duration-150 ${
              isSelected 
                ? "bg-[#1e293b]/70 border-l-2 border-electric-cyan text-white shadow-inner" 
                : "text-slate-400 hover:bg-[#1e293b]/40 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold truncate w-full">
              {getTaskIcon(task.name, task.progress === 100)}
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

      // Colores de referencia que capturamos en CSS para aplicar degradados
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
        isCritical: task.isCritical,
        assigneeName: task.assignee?.name || null
      } as any
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
      {/* Definición de gradientes SVG neón para barras */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <linearGradient id="cyan-to-pink-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-400 */}
            <stop offset="100%" stopColor="#ec4899" /> {/* pink-500 */}
          </linearGradient>
          <linearGradient id="critical-neon-grad-v3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
      </svg>

      {/* Selectores de escala en la esquina superior derecha */}
      <div className="flex items-center justify-between pb-2 border-b border-border/10">
        <span className="text-xs text-ink-tertiary">Escala de tiempo</span>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className={`h-7 text-xs px-3 transition-all duration-200 ${
              viewMode === ViewMode.Day
                ? "bg-electric-cyan border-electric-cyan text-midnight font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                : "text-slate-400 border-border/40 hover:text-white"
            }`}
            onClick={() => setViewMode(ViewMode.Day)}
          >
            Día
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`h-7 text-xs px-3 transition-all duration-200 ${
              viewMode === ViewMode.Week
                ? "bg-electric-cyan border-electric-cyan text-midnight font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                : "text-slate-400 border-border/40 hover:text-white"
            }`}
            onClick={() => setViewMode(ViewMode.Week)}
          >
            Semana
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`h-7 text-xs px-3 transition-all duration-200 ${
              viewMode === ViewMode.Month
                ? "bg-electric-cyan border-electric-cyan text-midnight font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                : "text-slate-400 border-border/40 hover:text-white"
            }`}
            onClick={() => setViewMode(ViewMode.Month)}
          >
            Mes
          </Button>
        </div>
      </div>

      {/* Contenedor con altura aumentada de Gantt (h-[500px]) */}
      <div className="w-full h-[540px] overflow-y-auto overflow-x-auto rounded-xl border border-border/30 bg-[#070b13] p-4 gantt-container-neon-v3">
        <div className="min-w-[850px]">
          <Gantt
            tasks={ganttTasks}
            viewMode={viewMode}
            locale="es"
            listCellWidth="230px" 
            ganttHeight={450} 
            rowHeight={55} 
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
            TooltipContent={GanttTooltipCustom}
          />
        </div>
      </div>

      {/* Leyenda y notas explicativas */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 px-2 text-xs">
        <span className="text-ink-tertiary">
          Pasa el cursor sobre las barras de tareas para ver los detalles del responsable y el cronograma.
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

      {/* Estilos CSS globales avanzados de visualización neón en SVG */}
      <style jsx global>{`
        /* Ocultar scrollbars por defecto del Gantt interno para no duplicar */
        .gantt-container-neon-v3 div[class*="scroll"] {
          scrollbar-width: none;
        }
        .gantt-container-neon-v3 div[class*="scroll"]::-webkit-scrollbar {
          display: none;
        }

        .gantt-container-neon-v3 svg {
          background-color: transparent !important;
        }

        /* Fechas y texto del gráfico */
        .gantt-container-neon-v3 text {
          fill: #94a3b8 !important; /* text-slate-400 */
          font-weight: 500;
        }

        /* Rejillas horizontales y verticales de fondo */
        .gantt-container-neon-v3 line {
          stroke: rgba(30, 41, 59, 0.35) !important;
        }

        /* Líneas de conexión de dependencias (Líneas continuas, elegantes y curvas) */
        .gantt-container-neon-v3 path {
          stroke: rgba(34, 211, 238, 0.65) !important; /* cian neón translúcido */
          stroke-width: 1.8;
          stroke-dasharray: none !important;
          opacity: 0.85;
          filter: drop-shadow(0 0 2px rgba(6, 182, 212, 0.3));
          transition: stroke-width 0.2s ease;
        }

        /* Puntos/Cabezales de flechas */
        .gantt-container-neon-v3 polygon {
          fill: rgba(34, 211, 238, 0.8) !important;
          stroke: rgba(34, 211, 238, 0.8) !important;
        }

        /* Cabecera del calendario superior */
        .gantt-container-neon-v3 rect[class*="header"],
        .gantt-container-neon-v3 g[class*="header"] rect {
          fill: #0d1321 !important;
          stroke: rgba(30, 41, 59, 0.45) !important;
        }

        /* Barras de tareas estándar (Gradiente de cyan-400 a pink-500) */
        .gantt-container-neon-v3 rect[fill="#06b6d4"] {
          fill: url(#cyan-to-pink-grad) !important;
          filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.5));
          rx: 6px;
        }

        /* Barras de tareas críticas (Gradiente de rose-500 a rojo neón) */
        .gantt-container-neon-v3 rect[fill="#ef4444"] {
          fill: url(#critical-neon-grad-v3) !important;
          filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.65));
          rx: 6px;
        }

        /* Color de progreso de la barra */
        .gantt-container-neon-v3 rect[fill="#0891b2"] {
          fill: #22d3ee !important;
          fill-opacity: 0.4;
        }

        .gantt-container-neon-v3 rect[fill="#991b1b"] {
          fill: #f43f5e !important;
          fill-opacity: 0.4;
        }

        /* Texto explicativo en las barras */
        .gantt-container-neon-v3 text[class*="bar"] {
          fill: #ffffff !important;
          font-weight: 600;
          font-size: 11px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </div>
  )
}
