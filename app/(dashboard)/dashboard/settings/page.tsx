"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Bell,
  Palette,
  Shield,
  Database,
  Mail,
  Save,
  Trash2,
  Download,
  Upload,
  Key,
} from "lucide-react"

import { ChangePasswordDialog } from "@/components/settings/change-password-dialog"
import { TwoFactorDialog } from "@/components/settings/two-factor-dialog"
import { ActiveSessionsDialog } from "@/components/settings/active-sessions-dialog"

type SettingsSection = "profile" | "notifications" | "appearance" | "security" | "data"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false)
  const [activeSessionsDialogOpen, setActiveSessionsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    taskAssigned: true,
    criticalTasks: true,
    weeklyReport: false,
  })
  const [appearance, setAppearance] = useState({
    theme: "dark",
    language: "es",
    dateFormat: "dd/mm/yyyy",
  })

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/profile")
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        })
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert("Perfil actualizado correctamente")
        fetchUser()
      } else {
        alert("Error al actualizar perfil")
      }
    } catch (error) {
      alert("Error al actualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = () => {
    alert("Función de exportación en desarrollo")
  }

  const handleDeleteAccount = () => {
    if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      alert("Función de eliminación en desarrollo")
    }
  }

  const sidebarItems = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "appearance", label: "Apariencia", icon: Palette },
    { id: "security", label: "Seguridad", icon: Shield },
    { id: "data", label: "Datos", icon: Database },
  ] as const

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-ink-secondary">Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-primary">
          Configuración
        </h1>
        <p className="text-ink-secondary mt-1">
          Personaliza tu experiencia en la plataforma
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="flex flex-row overflow-x-auto pb-2 gap-2 lg:flex-col lg:space-y-2 lg:gap-0 lg:pb-0 lg:w-64 shrink-0 border-b border-border/30 lg:border-none">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className="justify-start gap-2 shrink-0 whitespace-nowrap lg:w-full"
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-electric-cyan" />
                  <CardTitle>Perfil de Usuario</CardTitle>
                </div>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-intelligence to-electric-cyan flex items-center justify-center text-white font-bold text-xl">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Cambiar foto
                    </Button>
                    <p className="text-xs text-ink-tertiary mt-1">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <div className="flex items-center gap-2">
                    <Input id="role" value="Administrador" disabled />
                    <Badge variant="intelligence">ADMIN</Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    className="gap-2" 
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Button variant="outline">Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-electric-cyan" />
                  <CardTitle>Notificaciones</CardTitle>
                </div>
                <CardDescription>
                  Configura cómo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "email", label: "Notificaciones por Email", desc: "Recibe actualizaciones por correo" },
                  { key: "taskAssigned", label: "Tareas Asignadas", desc: "Cuando te asignen una tarea" },
                  { key: "criticalTasks", label: "Tareas Críticas", desc: "Alertas de ruta crítica" },
                  { key: "weeklyReport", label: "Resumen Semanal", desc: "Reporte de progreso semanal" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-mid">
                    <div>
                      <p className="font-medium text-ink-primary">{item.label}</p>
                      <p className="text-sm text-ink-tertiary">{item.desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-electric-cyan"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [item.key]: e.target.checked
                      })}
                    />
                  </div>
                ))}
                
                <div className="flex gap-3 pt-4">
                  <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Guardar Preferencias
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Section */}
          {activeSection === "appearance" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-electric-cyan" />
                  <CardTitle>Apariencia</CardTitle>
                </div>
                <CardDescription>
                  Personaliza la interfaz de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select 
                    id="theme" 
                    value={appearance.theme}
                    onChange={(e) => setAppearance({...appearance, theme: e.target.value})}
                  >
                    <option value="dark">Oscuro</option>
                    <option value="light">Claro</option>
                    <option value="auto">Automático</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    id="language" 
                    value={appearance.language}
                    onChange={(e) => setAppearance({...appearance, language: e.target.value})}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Formato de Fecha</Label>
                  <Select 
                    id="dateFormat" 
                    value={appearance.dateFormat}
                    onChange={(e) => setAppearance({...appearance, dateFormat: e.target.value})}
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Aplicar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-electric-cyan" />
                  <CardTitle>Seguridad</CardTitle>
                </div>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-mid">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink-primary">Cambiar Contraseña</p>
                        <p className="text-sm text-ink-tertiary">Actualiza tu contraseña regularmente</p>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setChangePasswordDialogOpen(true)}
                      >
                        <Key className="w-4 h-4" />
                        Cambiar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-mid">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink-primary">Autenticación de Dos Factores (2FA)</p>
                        <p className="text-sm text-ink-tertiary">Añade una capa extra de seguridad a tu cuenta</p>
                      </div>
                      {user?.isTwoFactorEnabled ? (
                        <Badge variant="intelligence">Activado</Badge>
                      ) : (
                        <Badge variant="warning">Desactivado</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => setTwoFactorDialogOpen(true)}
                    >
                      {user?.isTwoFactorEnabled ? "Gestionar 2FA" : "Activar 2FA"}
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-mid">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink-primary">Sesiones Activas</p>
                        <p className="text-sm text-ink-tertiary">Gestiona tus dispositivos y sesiones activas</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setActiveSessionsDialogOpen(true)}
                      >
                        Ver Sesiones
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Section */}
          {activeSection === "data" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-electric-cyan" />
                  <CardTitle>Gestión de Datos</CardTitle>
                </div>
                <CardDescription>
                  Exporta, importa o elimina tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-mid">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink-primary">Exportar Datos</p>
                        <p className="text-sm text-ink-tertiary">Descarga todos tus proyectos y tareas</p>
                      </div>
                      <Button variant="outline" className="gap-2" onClick={handleExportData}>
                        <Download className="w-4 h-4" />
                        Exportar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-mid">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink-primary">Importar Datos</p>
                        <p className="text-sm text-ink-tertiary">Sube un archivo de respaldo</p>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Importar
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-critical/10 border border-critical/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-critical">Eliminar Cuenta</p>
                        <p className="text-sm text-ink-tertiary">Elimina permanentemente tu cuenta y todos los datos</p>
                      </div>
                      <Button variant="outline" className="gap-2 border-critical text-critical hover:bg-critical hover:text-white" onClick={handleDeleteAccount}>
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />

      <TwoFactorDialog
        open={twoFactorDialogOpen}
        onOpenChange={setTwoFactorDialogOpen}
        isEnabled={!!user?.isTwoFactorEnabled}
        onStatusChange={(enabled) => {
          setUser((prev: any) => ({ ...prev, isTwoFactorEnabled: enabled }))
          fetchUser()
        }}
      />

      <ActiveSessionsDialog
        open={activeSessionsDialogOpen}
        onOpenChange={setActiveSessionsDialogOpen}
      />
    </div>
  )
}
