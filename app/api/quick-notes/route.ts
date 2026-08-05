import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createQuickNoteSchema } from "@/lib/validations/quick-note"
import { auth } from "@/auth"

// GET /api/quick-notes - Obtener todas las notas del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Inicie sesión para ver sus notas." },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const isCompletedParam = searchParams.get("isCompleted")

    const where: any = { userId }
    if (isCompletedParam !== null) {
      where.isCompleted = isCompletedParam === "true"
    }

    const notes = await prisma.quickNote.findMany({
      where,
      orderBy: where.isCompleted ? { completedAt: "desc" } : { createdAt: "desc" },
    })

    return NextResponse.json(notes)
  } catch (error: any) {
    console.error("Error en GET /api/quick-notes:", error)
    return NextResponse.json(
      { error: error.message || "Error al obtener las notas" },
      { status: 500 }
    )
  }
}

// POST /api/quick-notes - Crear una nueva nota rápida
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Inicie sesión para crear notas." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createQuickNoteSchema.parse(body)

    const note = await prisma.quickNote.create({
      data: {
        title: validatedData.title,
        content: validatedData.content || null,
        userId: userId,
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error: any) {
    console.error("Error en POST /api/quick-notes:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error al crear la nota", message: error.message },
      { status: 500 }
    )
  }
}
