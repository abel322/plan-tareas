import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createProjectSchema } from "@/lib/validations/project"
import { auth } from "@/auth"

// GET /api/projects - Obtener todos los proyectos del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Inicie sesión para ver los proyectos." },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    const where: any = { userId }
    if (status) where.status = status
    if (priority) where.priority = priority

    const projects = await prisma.project.findMany({
      where,
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error("Error en /api/projects:", error)
    return NextResponse.json(
      { error: error.message || "Error al obtener proyectos" },
      { status: 500 }
    )
  }
}

// POST /api/projects - Crear nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Inicie sesión para crear proyectos." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId: userId,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error: any) {
    console.error("Error en /api/projects:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un proyecto con ese nombre" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Error al crear proyecto", message: error.message },
      { status: 500 }
    )
  }
}
