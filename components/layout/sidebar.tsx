"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  Network,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proyectos", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Tareas", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Análisis PERT/CPM", href: "/dashboard/analysis", icon: Network },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-background border-r border-border/30 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-cyan to-intelligence flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-text-primary">ProjectFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-surface text-text-primary border-l-2 border-electric-cyan"
                  : "text-text-secondary hover:bg-surface/50 hover:text-text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-intelligence to-electric-cyan" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Usuario</p>
            <p className="text-xs text-text-tertiary truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
