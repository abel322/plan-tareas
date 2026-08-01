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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, CheckCircle2, QrCode } from "lucide-react"

interface TwoFactorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEnabled: boolean
  onStatusChange?: (enabled: boolean) => void
}

export function TwoFactorDialog({
  open,
  onOpenChange,
  isEnabled,
  onStatusChange,
}: TwoFactorDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

  useEffect(() => {
    if (open && !isEnabled) {
      // Generar nuevo QR y Secreto cuando se abre el modal para activar
      setLoading(true)
      setError("")
      fetch("/api/user/2fa/setup", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.qrCodeUrl && data.secret) {
            setQrCodeUrl(data.qrCodeUrl)
            setSecret(data.secret)
          } else {
            setError(data.error || "Error al generar código 2FA")
          }
        })
        .catch(() => setError("Error de conexión al servidor"))
        .finally(() => setLoading(false))
    }
  }, [open, isEnabled])

  const handleVerifyAndEnable = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!verificationCode || verificationCode.length < 6) {
      setError("Por favor ingresa el código de 6 dígitos de tu aplicación autenticadora.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/user/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          code: verificationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al verificar el código")
      }

      setSuccess("¡Autenticación de Dos Factores activada con éxito!")
      onStatusChange?.(true)

      setTimeout(() => {
        onOpenChange(false)
        setSuccess("")
        setVerificationCode("")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Código incorrecto")
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    if (!confirm("¿Estás seguro de que deseas desactivar la Autenticación de Dos Factores?")) {
      return
    }

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/user/2fa/disable", { method: "POST" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al desactivar 2FA")
      }

      setSuccess("2FA desactivado correctamente.")
      onStatusChange?.(false)

      setTimeout(() => {
        onOpenChange(false)
        setSuccess("")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Error al desactivar 2FA")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-electric-cyan" />
            <DialogTitle>
              {isEnabled ? "Desactivar 2FA" : "Configurar Autenticación de Dos Factores (2FA)"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isEnabled
              ? "Tu cuenta cuenta actualmente con la protección de autenticación en 2 pasos."
              : "Escanea el código QR con una app de autenticación (Google Authenticator, Authy, 1Password)."}
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

        {isEnabled ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-lg border border-success/30 bg-success/10 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-success shrink-0" />
              <div>
                <p className="font-semibold text-sm text-ink-primary">2FA Activo</p>
                <p className="text-xs text-ink-secondary">
                  Tu cuenta está protegida. Necesitarás tu código TOTP cada vez que inicies sesión.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
              <Button
                variant="outline"
                onClick={handleDisable}
                disabled={loading}
                className="flex-1 border-critical text-critical hover:bg-critical hover:text-white"
              >
                {loading ? "Procesando..." : "Desactivar 2FA"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerifyAndEnable} className="space-y-4 pt-2">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 border rounded-xl bg-surface/30 space-y-3">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Código QR de Autenticación 2FA"
                  className="w-44 h-44 rounded-lg bg-white p-2"
                />
              ) : (
                <div className="w-44 h-44 rounded-lg bg-muted flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-muted-foreground animate-pulse" />
                </div>
              )}
              {secret && (
                <div className="text-center">
                  <p className="text-[11px] text-ink-tertiary">¿No puedes escanear el QR?</p>
                  <p className="text-xs font-mono font-bold text-electric-cyan tracking-wider select-all mt-0.5">
                    {secret}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code">Código de Verificación (6 dígitos) *</Label>
              <Input
                id="verification-code"
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.trim())}
                placeholder="123456"
                className="text-center text-lg tracking-widest font-mono"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Verificando..." : "Verificar y Activar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
