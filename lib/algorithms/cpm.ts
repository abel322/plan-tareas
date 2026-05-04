/**
 * CPM (Critical Path Method) Algorithm
 * Calcula la ruta crítica de un proyecto
 */

export interface CPMTask {
  id: string
  name: string
  duration: number
  dependencies: string[] // IDs de tareas de las que depende
}

export interface CPMResult {
  criticalPath: string[]
  projectDuration: number
  taskDetails: Map<string, TaskDetails>
}

export interface TaskDetails {
  id: string
  name: string
  duration: number
  earlyStart: number    // ES - Inicio más temprano
  earlyFinish: number   // EF - Fin más temprano
  lateStart: number     // LS - Inicio más tardío
  lateFinish: number    // LF - Fin más tardío
  slack: number         // Holgura = LS - ES (o LF - EF)
  isCritical: boolean   // Crítica si slack = 0
}

/**
 * Calcula la ruta crítica usando el método CPM
 */
export function calculateCPM(tasks: CPMTask[]): CPMResult {
  if (tasks.length === 0) {
    return {
      criticalPath: [],
      projectDuration: 0,
      taskDetails: new Map()
    }
  }

  // Crear mapa de tareas
  const taskMap = new Map<string, CPMTask>()
  tasks.forEach(task => taskMap.set(task.id, task))

  // Inicializar detalles de tareas
  const taskDetails = new Map<string, TaskDetails>()
  tasks.forEach(task => {
    taskDetails.set(task.id, {
      id: task.id,
      name: task.name,
      duration: task.duration,
      earlyStart: 0,
      earlyFinish: 0,
      lateStart: 0,
      lateFinish: 0,
      slack: 0,
      isCritical: false
    })
  })

  // Forward Pass: Calcular ES y EF
  const visited = new Set<string>()
  const calculateForward = (taskId: string): number => {
    if (visited.has(taskId)) {
      return taskDetails.get(taskId)!.earlyFinish
    }

    visited.add(taskId)
    const task = taskMap.get(taskId)!
    const details = taskDetails.get(taskId)!

    // ES = max(EF de todas las dependencias)
    let maxEF = 0
    for (const depId of task.dependencies) {
      const depEF = calculateForward(depId)
      maxEF = Math.max(maxEF, depEF)
    }

    details.earlyStart = maxEF
    details.earlyFinish = maxEF + task.duration

    return details.earlyFinish
  }

  // Calcular forward pass para todas las tareas
  let projectDuration = 0
  tasks.forEach(task => {
    const ef = calculateForward(task.id)
    projectDuration = Math.max(projectDuration, ef)
  })

  // Backward Pass: Calcular LS y LF
  const calculateBackward = (taskId: string, projectEnd: number) => {
    const task = taskMap.get(taskId)!
    const details = taskDetails.get(taskId)!

    // Encontrar todas las tareas que dependen de esta
    const dependents = tasks.filter(t => t.dependencies.includes(taskId))

    if (dependents.length === 0) {
      // Tarea final
      details.lateFinish = projectEnd
    } else {
      // LF = min(LS de todas las tareas dependientes)
      let minLS = Infinity
      dependents.forEach(dep => {
        const depDetails = taskDetails.get(dep.id)!
        minLS = Math.min(minLS, depDetails.lateStart)
      })
      details.lateFinish = minLS
    }

    details.lateStart = details.lateFinish - task.duration
    details.slack = details.lateStart - details.earlyStart
    details.isCritical = details.slack === 0
  }

  // Inicializar tareas finales
  tasks.forEach(task => {
    const details = taskDetails.get(task.id)!
    if (details.earlyFinish === projectDuration) {
      details.lateFinish = projectDuration
      details.lateStart = projectDuration - task.duration
    }
  })

  // Calcular backward pass en orden topológico inverso
  const sortedTasks = topologicalSort(tasks).reverse()
  sortedTasks.forEach(task => {
    calculateBackward(task.id, projectDuration)
  })

  // Encontrar ruta crítica
  const criticalPath = findCriticalPath(tasks, taskDetails)

  return {
    criticalPath,
    projectDuration,
    taskDetails
  }
}

/**
 * Ordenamiento topológico de tareas
 */
function topologicalSort(tasks: CPMTask[]): CPMTask[] {
  const sorted: CPMTask[] = []
  const visited = new Set<string>()
  const temp = new Set<string>()

  const visit = (taskId: string) => {
    if (temp.has(taskId)) {
      throw new Error('Dependencia circular detectada')
    }
    if (visited.has(taskId)) return

    temp.add(taskId)
    const task = tasks.find(t => t.id === taskId)!
    
    task.dependencies.forEach(depId => visit(depId))
    
    temp.delete(taskId)
    visited.add(taskId)
    sorted.push(task)
  }

  tasks.forEach(task => {
    if (!visited.has(task.id)) {
      visit(task.id)
    }
  })

  return sorted
}

/**
 * Encuentra la ruta crítica (tareas con slack = 0)
 */
function findCriticalPath(
  tasks: CPMTask[],
  taskDetails: Map<string, TaskDetails>
): string[] {
  const criticalTasks = tasks
    .filter(task => taskDetails.get(task.id)!.isCritical)
    .sort((a, b) => {
      const aDetails = taskDetails.get(a.id)!
      const bDetails = taskDetails.get(b.id)!
      return aDetails.earlyStart - bDetails.earlyStart
    })

  return criticalTasks.map(task => task.id)
}
