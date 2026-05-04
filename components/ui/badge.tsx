import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-elevated text-text-primary border border-border/40",
        success: "bg-success/10 text-success border border-success/30",
        warning: "bg-warning/10 text-warning border border-warning/30",
        critical: "bg-critical/10 text-critical border border-critical/30",
        intelligence: "bg-intelligence/10 text-intelligence border border-intelligence/30",
        cyan: "bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
