import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createTaskSchema } from "@/lib/validations/project"

// GET /api/tasks - Obtener todas las tareas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    const where: any = {}
    if (projectId) where.projectId = projectId
    if (status) where.status = status
    if (priority) where.priority = priority

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        pertEstimation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Error al obtener tareas" },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Crear nueva tarea
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Datos recibidos:", body)
    
    const validatedData = createTaskSchema.parse(body)
    console.log("Datos validados:", validatedData)

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    console.error("Error creating task:", error)
    console.error("Error details:", error.message)
    console.error("Error stack:", error.stack)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una tarea con esos datos" },
        { status: 409 }
      )
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "El proyecto especificado no existe" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error al crear tarea", message: error.message },
      { status: 500 }
    )
  }
}
