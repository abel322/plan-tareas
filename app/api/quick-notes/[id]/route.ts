import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateQuickNoteSchema } from "@/lib/validations/quick-note"
import { auth } from "@/auth"

// PATCH /api/quick-notes/[id] - Actualizar nota rápida (título, contenido, o isCompleted)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado." },
        { status: 401 }
      )
    }

    const { id } = params

    // Verificar que la nota existe y pertenece al usuario
    const existingNote = await prisma.quickNote.findFirst({
      where: { id, userId },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: "Nota no encontrada o sin permisos de edición." },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateQuickNoteSchema.parse(body)

    const updateData: any = {}
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.content !== undefined) updateData.content = validatedData.content

    if (validatedData.isCompleted !== undefined) {
      updateData.isCompleted = validatedData.isCompleted
      if (validatedData.isCompleted) {
        updateData.completedAt = new Date()
      } else {
        updateData.completedAt = null
      }
    }

    const updatedNote = await prisma.quickNote.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedNote)
  } catch (error: any) {
    console.error("Error en PATCH /api/quick-notes/[id]:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos de actualización inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error al actualizar la nota", message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/quick-notes/[id] - Eliminar nota rápida
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado." },
        { status: 401 }
      )
    }

    const { id } = params

    const existingNote = await prisma.quickNote.findFirst({
      where: { id, userId },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: "Nota no encontrada o sin permisos de eliminación." },
        { status: 404 }
      )
    }

    await prisma.quickNote.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Nota eliminada correctamente" })
  } catch (error: any) {
    console.error("Error en DELETE /api/quick-notes/[id]:", error)
    return NextResponse.json(
      { error: "Error al eliminar la nota", message: error.message },
      { status: 500 }
    )
  }
}
