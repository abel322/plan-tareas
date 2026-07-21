import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-provider"
import { AuthProvider } from "@/components/providers/session-provider"

export const metadata: Metadata = {
  title: "Project Management Platform",
  description: "Plataforma inteligente de gestión de proyectos con PERT y CPM",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="projectflow-theme">
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
