import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateSpecificGoalSchema } from "@/lib/validations/project"
import { auth } from "@/auth"

// PATCH /api/specific-goals/[id] - Actualizar objetivo específico
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSpecificGoalSchema.parse(body)

    const goal = await prisma.specificGoal.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        predecessorId: validatedData.predecessorId === "" ? null : validatedData.predecessorId,
      },
      include: {
        predecessor: true,
      },
    })

    return NextResponse.json(goal)
  } catch (error: any) {
    console.error("Error updating specific goal:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Objetivo específico no encontrado" },
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
      { error: "Error al actualizar objetivo específico" },
      { status: 500 }
    )
  }
}

// DELETE /api/specific-goals/[id] - Eliminar objetivo específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    await prisma.specificGoal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Objetivo específico eliminado" })
  } catch (error: any) {
    console.error("Error deleting specific goal:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Objetivo específico no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Error al eliminar objetivo específico" },
      { status: 500 }
    )
  }
}
