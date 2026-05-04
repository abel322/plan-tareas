import { Priority, Status, TaskStatus, DependencyType, Role } from "@prisma/client"

export type { Priority, Status, TaskStatus, DependencyType, Role }

export interface Project {
  id: string
  name: string
  description?: string | null
  objective?: string | null
  priority: Priority
  status: Status
  startDate?: Date | null
  endDate?: Date | null
  progress: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  name: string
  description?: string | null
  projectId: string
  assigneeId?: string | null
  priority: Priority
  status: TaskStatus
  startDate?: Date | null
  endDate?: Date | null
  estimatedDuration?: number | null
  tags: string[]
  isCritical: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectInput {
  name: string
  description?: string
  objective?: string
  priority?: Priority
  status?: Status
  startDate?: Date
  endDate?: Date
}

export interface CreateTaskInput {
  name: string
  description?: string
  projectId: string
  assigneeId?: string
  priority?: Priority
  status?: TaskStatus
  startDate?: Date
  endDate?: Date
  estimatedDuration?: number
  tags?: string[]
}
