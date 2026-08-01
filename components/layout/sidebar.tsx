"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  Network,
  X,
  LogOut,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proyectos", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Objetivos Específicos", href: "/dashboard/tasks", icon: Target },
  { name: "Análisis PERT/CPM", href: "/dashboard/analysis", icon: Network },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const userName = session?.user?.name || "Usuario"
  const userEmail = session?.user?.email || "Sin correo"

  return (
    <aside
      className={cn(
        "w-64 bg-background border-r border-border/30 flex flex-col shrink-0 transition-transform duration-300 ease-in-out",
        "md:static md:translate-x-0 md:min-h-screen md:z-auto",
        "fixed inset-y-0 left-0 z-50 h-full shadow-2xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Logo & Close Button */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-cyan to-intelligence flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-text-primary">ProjectFlow</span>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden text-text-tertiary hover:text-text-primary p-1 rounded-lg hover:bg-surface transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-surface text-text-primary border-l-2 border-electric-cyan"
                  : "text-text-secondary hover:bg-surface/50 hover:text-text-primary"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/30 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-intelligence to-electric-cyan shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase">
            {userName.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{userName}</p>
            <p className="text-xs text-text-tertiary truncate">{userEmail}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full justify-start text-xs text-text-tertiary hover:text-critical hover:bg-critical/10 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
