import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createProjectSchema } from "@/lib/validations/project"

// GET /api/projects - Obtener todos los proyectos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    const where: any = {}
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
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Error al obtener proyectos" },
      { status: 500 }
    )
  }
}

// POST /api/projects - Crear nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Datos recibidos para proyecto:", body)
    
    const validatedData = createProjectSchema.parse(body)
    console.log("Datos validados:", validatedData)

    // TODO: Obtener userId de la sesión
    // Por ahora, buscar o crear el primer usuario en la base de datos
    let firstUser = await prisma.user.findFirst()
    
    if (!firstUser) {
      // Crear usuario por defecto si no existe
      firstUser = await prisma.user.create({
        data: {
          name: "Usuario Demo",
          email: "demo@projectflow.com",
        },
      })
    }

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId: firstUser.id,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      },
    })

    console.log("Proyecto creado:", project)
    return NextResponse.json(project, { status: 201 })
  } catch (error: any) {
    console.error("Error creating project:", error)
    console.error("Error details:", error.message)
    console.error("Error stack:", error.stack)
    
    if (error.name === "ZodError") {
      console.error("Validation errors:", error.errors)
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
