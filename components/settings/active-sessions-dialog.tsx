"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone, AlertCircle, CheckCircle2, LogOut } from "lucide-react"

interface ActiveSessionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActiveSessionsDialog({
  open,
  onOpenChange,
}: ActiveSessionsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [sessions, setSessions] = useState<any[]>([])

  const fetchSessions = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/user/sessions")
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
      } else {
        setError("Error al cargar las sesiones activas")
      }
    } catch (err) {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchSessions()
    }
  }, [open])

  const handleRevokeOthers = async () => {
    if (!confirm("¿Deseas cerrar todas las demás sesiones activas excepto esta?")) {
      return
    }

    setRevoking(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/user/sessions", { method: "DELETE" })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al cerrar las demás sesiones")
      }

      setSuccess("Se han revocado correctamente todas las demás sesiones.")
      fetchSessions()

      setTimeout(() => {
        setSuccess("")
      }, 2500)
    } catch (err: any) {
      setError(err.message || "Error al revocar sesiones")
    } finally {
      setRevoking(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-electric-cyan" />
            <DialogTitle>Sesiones Activas</DialogTitle>
          </div>
          <DialogDescription>
            Lista de navegadores y dispositivos con acceso activo a tu cuenta.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-critical/10 border border-critical/30 flex items-center gap-2 text-xs text-critical">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2 text-xs text-success">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-ink-tertiary text-center py-6">Cargando sesiones activas...</p>
          ) : sessions.length === 0 ? (
            <div className="p-4 rounded-lg bg-surface/20 border border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-electric-cyan" />
                <div>
                  <p className="font-semibold text-sm text-ink-primary">Navegador Actual</p>
                  <p className="text-xs text-ink-tertiary">Sesión activa actual</p>
                </div>
              </div>
              <Badge variant="intelligence">Sesión Actual</Badge>
            </div>
          ) : (
            sessions.map((sess) => {
              const isMobile = /mobile/i.test(sess.userAgent || "")
              const DeviceIcon = isMobile ? Smartphone : Laptop

              return (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-electric-cyan/10 flex items-center justify-center shrink-0">
                      <DeviceIcon className="w-4 h-4 text-electric-cyan" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-semibold text-ink-primary truncate">
                        {sess.userAgent || "Dispositivo Desconocido"}
                      </p>
                      <p className="text-ink-tertiary text-[11px]">
                        IP: {sess.ipAddress || "127.0.0.1"} • Última actividad:{" "}
                        {new Date(sess.lastActive).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {sess.isCurrent ? (
                    <Badge variant="intelligence" className="shrink-0">
                      Sesión Actual
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0 text-ink-tertiary">
                      Activo
                    </Badge>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cerrar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRevokeOthers}
            disabled={revoking || loading}
            className="flex-1 border-critical text-critical hover:bg-critical hover:text-white gap-2"
          >
            <LogOut className="w-4 h-4" />
            {revoking ? "Cerrando..." : "Cerrar Otras Sesiones"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
