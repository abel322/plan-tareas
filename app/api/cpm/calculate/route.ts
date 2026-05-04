import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateCPM, CPMTask } from "@/lib/algorithms/cpm"

// POST /api/cpm/calculate - Calcular ruta crítica de un proyecto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId es requerido" },
        { status: 400 }
      )
    }

    // Obtener todas las tareas del proyecto con sus dependencias
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        dependencies: true,
        pertEstimation: true,
      },
    })

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "No hay tareas en este proyecto" },
        { status: 400 }
      )
    }

    // Convertir a formato CPM
    const cpmTasks: CPMTask[] = tasks.map((task) => ({
      id: task.id,
      name: task.name,
      duration: task.estimatedDuration || task.pertEstimation?.expectedTime || 1,
      dependencies: task.dependencies.map((dep) => dep.dependsOnId),
    }))

    // Calcular CPM
    const cpmResult = calculateCPM(cpmTasks)

    // Actualizar tareas críticas en la base de datos
    const criticalTaskIds = cpmResult.criticalPath
    
    // Marcar todas como no críticas primero
    await prisma.task.updateMany({
      where: { projectId },
      data: { isCritical: false },
    })

    // Marcar las críticas
    if (criticalTaskIds.length > 0) {
      await prisma.task.updateMany({
        where: {
          id: { in: criticalTaskIds },
        },
        data: { isCritical: true },
      })
    }

    // Convertir Map a objeto para JSON
    const taskDetailsArray = Array.from(cpmResult.taskDetails.entries()).map(
      ([id, details]) => ({
        id,
        ...details,
      })
    )

    return NextResponse.json({
      projectId,
      criticalPath: cpmResult.criticalPath,
      projectDuration: cpmResult.projectDuration,
      taskDetails: taskDetailsArray,
      criticalTasksCount: criticalTaskIds.length,
    })
  } catch (error: any) {
    console.error("Error calculating CPM:", error)
    return NextResponse.json(
      { error: error.message || "Error al calcular CPM" },
      { status: 500 }
    )
  }
}
