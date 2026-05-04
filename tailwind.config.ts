import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors (CSS variables)
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--surface-elevated) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-tertiary": "rgb(var(--text-tertiary) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted) / <alpha-value>)",
        
        // Accent colors
        "electric-cyan": "#06b6d4",
        intelligence: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b",
        critical: "#ef4444",
        
        // Legacy colors (for backwards compatibility)
        midnight: "#0a0e1a",
        "slate-deep": "#0f1419",
        "slate-mid": "#1a1f2e",
        graphite: "#2a3142",
        "ink-primary": "#e8edf4",
        "ink-secondary": "#a8b2c1",
        "ink-tertiary": "#6b7280",
        "ink-muted": "#4b5563",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        criticalPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139, 92, 246, 0.4)" },
          "50%": { boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.6)" },
        },
      },
      animation: {
        "critical-pulse": "criticalPulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

export default config
