import { z } from "zod"

export const createQuickNoteSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200, "El título no puede exceder 200 caracteres"),
  content: z.string().max(2000, "El contenido no puede exceder 2000 caracteres").optional().nullable(),
})

export const updateQuickNoteSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200, "El título no puede exceder 200 caracteres").optional(),
  content: z.string().max(2000, "El contenido no puede exceder 2000 caracteres").optional().nullable(),
  isCompleted: z.boolean().optional(),
})
