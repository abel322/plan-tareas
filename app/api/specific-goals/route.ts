import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSpecificGoalSchema } from "@/lib/validations/project"
import { auth } from "@/auth"

// GET /api/specific-goals?projectId=...
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get("projectId")

    const where: any = {}
    if (projectId) {
      where.projectId = projectId
    }
    where.project = {
      userId: session.user.id
    }

    const goals = await prisma.specificGoal.findMany({
      where,
      include: {
        predecessor: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
          },
        },
        successors: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        tasks: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            isCritical: true,
            estimatedDuration: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(goals)
  } catch (error: any) {
    console.error("Error fetching specific goals:", error)
    return NextResponse.json(
      { error: error.message || "Error al obtener objetivos específicos" },
      { status: 500 }
    )
  }
}

// POST /api/specific-goals - Crear nuevo objetivo específico
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSpecificGoalSchema.parse(body)

    const goal = await prisma.specificGoal.create({
      data: {
        ...validatedData,
        predecessorId: validatedData.predecessorId || null,
      },
      include: {
        predecessor: true,
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error: any) {
    console.error("Error creating specific goal:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error al crear objetivo específico", message: error.message },
      { status: 500 }
    )
  }
}
