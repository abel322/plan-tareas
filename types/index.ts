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

export interface SpecificGoal {
  id: string
  name: string
  description?: string | null
  priority: Priority
  status: TaskStatus
  projectId: string
  predecessorId?: string | null
  predecessor?: SpecificGoal | null
  successors?: SpecificGoal[]
  createdAt: Date
  updatedAt: Date
  tasks?: Task[]
}

export interface Task {
  id: string
  name: string
  description?: string | null
  projectId: string
  specificGoalId?: string | null
  specificGoal?: SpecificGoal | null
  assigneeId?: string | null
  priority: Priority
  status: TaskStatus
  startDate?: Date | null
  endDate?: Date | null
  estimatedDuration: number
  optimisticTime?: number | null
  mostLikelyTime?: number | null
  pessimisticTime?: number | null
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
  specificGoalId?: string
  assigneeId?: string
  priority?: Priority
  status?: TaskStatus
  startDate?: Date
  endDate?: Date
  estimatedDuration?: number
  optimisticTime?: number
  mostLikelyTime?: number
  pessimisticTime?: number
  tags?: string[]
}
