"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Network, Target, LogOut, LogIn } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-intelligence/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric-cyan/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-electric-cyan via-intelligence to-electric-cyan bg-clip-text text-transparent">
              Gestión Inteligente
            </span>
            <br />
            <span className="text-text-primary">de Proyectos</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Planifica, ejecuta y optimiza proyectos complejos con metodologías científicas PERT y CPM
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-surface/50 border border-border/30 rounded-lg p-6 space-y-3">
            <div className="w-12 h-12 rounded-lg bg-electric-cyan/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-electric-cyan" />
            </div>
            <h3 className="font-bold text-text-primary">Objetivos SMART</h3>
            <p className="text-sm text-text-secondary">
              Define objetivos específicos, medibles y alcanzables
            </p>
          </div>

          <div className="bg-surface/50 border border-border/30 rounded-lg p-6 space-y-3">
            <div className="w-12 h-12 rounded-lg bg-intelligence/10 flex items-center justify-center">
              <Network className="w-6 h-6 text-intelligence" />
            </div>
            <h3 className="font-bold text-text-primary">Análisis PERT/CPM</h3>
            <p className="text-sm text-text-secondary">
              Calcula rutas críticas y optimiza tiempos
            </p>
          </div>

          <div className="bg-surface/50 border border-border/30 rounded-lg p-6 space-y-3">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-bold text-text-primary">Visualización Avanzada</h3>
            <p className="text-sm text-text-secondary">
              Diagramas de Gantt, PERT y analytics en tiempo real
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href={isAuthenticated ? "/dashboard" : "/login"}>
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Ir al Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <Button
              size="lg"
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="gap-2 w-full sm:w-auto text-critical border-critical/30 hover:bg-critical/10"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión ({session?.user?.name || session?.user?.email})
            </Button>
          ) : (
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
