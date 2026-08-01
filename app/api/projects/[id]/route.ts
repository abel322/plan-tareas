import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateProjectSchema } from "@/lib/validations/project"

// GET /api/projects/[id] - Obtener proyecto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        objectives: true,
        specificGoals: {
          include: {
            predecessor: true,
            tasks: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        tasks: {
          include: {
            specificGoal: true,
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            pertEstimation: true,
            dependencies: {
              include: {
                dependsOn: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    // Asegurarse de retornar un arreglo vacío si no existen tareas
    const responseData = {
      ...project,
      tasks: project.tasks || [],
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Error en GET /api/projects/[id]:", error)
    return NextResponse.json(
      { error: error.message || "Error al obtener proyecto" },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Actualizar proyecto
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Error en PATCH /api/projects/[id]:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error al actualizar proyecto", message: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Actualizar proyecto completo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Error en PUT /api/projects/[id]:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error al actualizar proyecto", message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Eliminar proyecto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Proyecto eliminado" })
  } catch (error: any) {
    console.error("Error en DELETE /api/projects/[id]:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error al eliminar proyecto", message: error.message },
      { status: 500 }
    )
  }
}
