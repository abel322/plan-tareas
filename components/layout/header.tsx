"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border/30 bg-background/50 backdrop-blur-sm sticky top-0 z-30 w-full">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Toggle Menu Button (Mobile) & Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden shrink-0 text-text-primary hover:bg-surface"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted shrink-0" />
            <Input
              placeholder="Buscar..."
              className="pl-10 text-sm w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-critical rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  )
}

