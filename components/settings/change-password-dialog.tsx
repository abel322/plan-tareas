"use client"

import { useState } from "react"
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
import { Key, AlertCircle, CheckCircle2 } from "lucide-react"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Por favor completa todos los campos de contraseña.")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("La nueva contraseña y la confirmación no coinciden.")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("La nueva contraseña debe contener al menos 6 caracteres.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al cambiar la contraseña")
      }

      setSuccess("¡Tu contraseña ha sido actualizada con éxito!")
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setTimeout(() => {
        onOpenChange(false)
        setSuccess("")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-electric-cyan" />
            <DialogTitle>Cambiar Contraseña</DialogTitle>
          </div>
          <DialogDescription>
            Ingresa tu contraseña actual y define una nueva contraseña segura para tu cuenta.
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña Actual *</Label>
            <Input
              id="current-password"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña *</Label>
            <Input
              id="new-password"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nueva Contraseña *</Label>
            <Input
              id="confirm-password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
