"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Network, Calculator, TrendingUp, AlertTriangle } from "lucide-react"

export default function AnalysisPage() {
  const [pertData, setPertData] = useState({
    optimistic: "",
    mostLikely: "",
    pessimistic: "",
  })
  const [pertResult, setPertResult] = useState<any>(null)
  const [cpmLoading, setCpmLoading] = useState(false)
  const [cpmResult, setCpmResult] = useState<any>(null)

  const calculatePERT = () => {
    const o = parseFloat(pertData.optimistic)
    const m = parseFloat(pertData.mostLikely)
    const p = parseFloat(pertData.pessimistic)

    if (!o || !m || !p) {
      alert("Por favor ingresa todos los valores")
      return
    }

    if (o > m || m > p) {
      alert("Debe cumplirse: Optimista ≤ Más Probable ≤ Pesimista")
      return
    }

    const expectedTime = (o + 4 * m + p) / 6
    const variance = Math.pow((p - o) / 6, 2)
    const standardDev = Math.sqrt(variance)

    setPertResult({
      expectedTime: expectedTime.toFixed(2),
      variance: variance.toFixed(4),
      standardDev: standardDev.toFixed(2),
    })
  }

  const calculateCPM = async () => {
    setCpmLoading(true)
    try {
      // Aquí iría la llamada real a la API
      // const response = await fetch("/api/cpm/calculate", {
      //   method: "POST",
      //   body: JSON.stringify({ projectId: "..." })
      // })
      
      // Mock result
      setTimeout(() => {
        setCpmResult({
          projectDuration: 45,
          criticalPath: ["Tarea 1", "Tarea 3", "Tarea 5"],
          criticalTasksCount: 3,
        })
        setCpmLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error:", error)
      setCpmLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary">
          Análisis PERT/CPM
        </h1>
        <p className="text-ink-secondary mt-1">
          Herramientas de análisis científico para planificación de proyectos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PERT Calculator */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-intelligence" />
              <CardTitle>Calculadora PERT</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-ink-secondary">
              Calcula el tiempo esperado usando tres estimaciones
            </p>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="optimistic">Tiempo Optimista (O)</Label>
                <Input
                  id="optimistic"
                  type="number"
                  step="0.5"
                  value={pertData.optimistic}
                  onChange={(e) =>
                    setPertData({ ...pertData, optimistic: e.target.value })
                  }
                  placeholder="Ej: 3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mostLikely">Tiempo Más Probable (M)</Label>
                <Input
                  id="mostLikely"
                  type="number"
                  step="0.5"
                  value={pertData.mostLikely}
                  onChange={(e) =>
                    setPertData({ ...pertData, mostLikely: e.target.value })
                  }
                  placeholder="Ej: 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pessimistic">Tiempo Pesimista (P)</Label>
                <Input
                  id="pessimistic"
                  type="number"
                  step="0.5"
                  value={pertData.pessimistic}
                  onChange={(e) =>
                    setPertData({ ...pertData, pessimistic: e.target.value })
                  }
                  placeholder="Ej: 9"
                />
              </div>
            </div>

            <Button onClick={calculatePERT} className="w-full">
              Calcular PERT
            </Button>

            {pertResult && (
              <div className="space-y-3 pt-4 border-t border-graphite/30">
                <h4 className="font-medium text-ink-primary">Resultados:</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-mid">
                    <span className="text-sm text-ink-secondary">Tiempo Esperado (E)</span>
                    <span className="font-mono font-bold text-electric-cyan">
                      {pertResult.expectedTime} días
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-mid">
                    <span className="text-sm text-ink-secondary">Varianza (V)</span>
                    <span className="font-mono font-medium text-ink-primary">
                      {pertResult.variance}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-mid">
                    <span className="text-sm text-ink-secondary">Desviación Estándar (σ)</span>
                    <span className="font-mono font-medium text-ink-primary">
                      {pertResult.standardDev}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-intelligence/10 border border-intelligence/30">
                  <p className="text-xs text-ink-secondary">
                    <strong className="text-intelligence">Fórmula:</strong> E = (O + 4M + P) / 6
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CPM Calculator */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-electric-cyan" />
              <CardTitle>Análisis CPM</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-ink-secondary">
              Identifica la ruta crítica de tu proyecto
            </p>

            <div className="p-4 rounded-lg bg-slate-mid space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-ink-primary">
                  Selecciona un proyecto
                </span>
              </div>
              <p className="text-xs text-ink-tertiary">
                El análisis CPM requiere un proyecto con tareas y dependencias configuradas
              </p>
            </div>

            <Button
              onClick={calculateCPM}
              disabled={cpmLoading}
              className="w-full"
              variant="outline"
            >
              {cpmLoading ? "Calculando..." : "Calcular Ruta Crítica"}
            </Button>

            {cpmResult && (
              <div className="space-y-3 pt-4 border-t border-graphite/30">
                <h4 className="font-medium text-ink-primary">Resultados:</h4>

                <div className="p-4 rounded-lg bg-slate-mid space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink-secondary">Duración Total</span>
                    <span className="font-mono font-bold text-electric-cyan text-xl">
                      {cpmResult.projectDuration} días
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink-secondary">Tareas Críticas</span>
                    <Badge variant="intelligence">
                      {cpmResult.criticalTasksCount}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-ink-primary">Ruta Crítica:</p>
                  <div className="space-y-2">
                    {cpmResult.criticalPath.map((task: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg border border-intelligence/40 critical-path-glow"
                      >
                        <div className="w-6 h-6 rounded-full bg-intelligence/20 flex items-center justify-center text-xs font-bold text-intelligence">
                          {i + 1}
                        </div>
                        <span className="text-sm text-ink-primary">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">¿Qué es PERT?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-secondary">
            <p>
              <strong className="text-ink-primary">Program Evaluation Review Technique</strong> es una
              metodología que utiliza tres estimaciones de tiempo para calcular la duración esperada de una tarea:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-ink-primary">Optimista (O):</strong> Mejor escenario posible</li>
              <li><strong className="text-ink-primary">Más Probable (M):</strong> Escenario más realista</li>
              <li><strong className="text-ink-primary">Pesimista (P):</strong> Peor escenario posible</li>
            </ul>
            <p className="pt-2">
              La fórmula PERT pondera el tiempo más probable 4 veces más que los extremos,
              proporcionando una estimación más precisa.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">¿Qué es CPM?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-secondary">
            <p>
              <strong className="text-ink-primary">Critical Path Method</strong> identifica la secuencia
              de tareas que determina la duración mínima del proyecto.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-ink-primary">Ruta Crítica:</strong> Secuencia de tareas sin holgura</li>
              <li><strong className="text-ink-primary">Holgura:</strong> Tiempo que una tarea puede retrasarse</li>
              <li><strong className="text-ink-primary">Tareas Críticas:</strong> No pueden retrasarse sin afectar el proyecto</li>
            </ul>
            <p className="pt-2">
              Cualquier retraso en una tarea crítica retrasa todo el proyecto.
              Optimizar estas tareas es clave para cumplir plazos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
