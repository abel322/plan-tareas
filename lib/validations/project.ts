import { z } from "zod"

export const createProjectSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  description: z.string().max(500).optional(),
  objective: z.string().max(500).optional(),
  priority: z.string().default("MEDIUM"),
  status: z.string().default("PLANNING"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const createSpecificGoalSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(200),
  description: z.string().max(1000).optional(),
  projectId: z.string().min(1, "El ID del proyecto es requerido"),
})

export const updateSpecificGoalSchema = createSpecificGoalSchema.partial().omit({ projectId: true })

export const createTaskSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(200),
  description: z.string().max(1000).optional(),
  projectId: z.string().min(1, "El ID del proyecto es requerido"),
  specificGoalId: z.string().optional().nullable(),
  assigneeId: z.string().optional(),
  priority: z.string().default("MEDIUM"),
  status: z.string().default("TODO"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedDuration: z.number().min(0).optional(),
  optimisticTime: z.number().min(0).optional().nullable(),
  mostLikelyTime: z.number().min(0).optional().nullable(),
  pessimisticTime: z.number().min(0).optional().nullable(),
  tags: z.string().optional(),
  dependsOnId: z.string().optional(),
})

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true })

export const createPERTEstimationSchema = z.object({
  taskId: z.string().min(1),
  optimistic: z.number().positive("El tiempo optimista debe ser positivo"),
  mostLikely: z.number().positive("El tiempo más probable debe ser positivo"),
  pessimistic: z.number().positive("El tiempo pesimista debe ser positivo"),
}).refine(
  (data) => data.optimistic <= data.mostLikely && data.mostLikely <= data.pessimistic,
  {
    message: "Debe cumplirse: Optimista ≤ Más Probable ≤ Pesimista",
  }
)
