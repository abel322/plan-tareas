"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

interface QuickNoteDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  isDeleting?: boolean
}

export function QuickNoteDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: QuickNoteDeleteDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-critical/30 shadow-2xl">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="w-10 h-10 rounded-full bg-critical/10 border border-critical/30 flex items-center justify-center shrink-0 text-critical">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-text-primary">
              ¿Eliminar nota?
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary mt-1">
              ¿Estás seguro de que deseas eliminar esta nota? Esta acción no se puede deshacer.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-border/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-border/40 hover:bg-surface-elevated"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-critical hover:bg-critical/90 text-white font-semibold gap-1.5 shadow-md shadow-critical/20"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
