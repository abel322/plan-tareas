import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userAgent = request.headers.get("user-agent") || "Navegador Web"
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1"

    // Obtener sesiones del usuario
    let userSessions = await prisma.userSession.findMany({
      where: { userId: session.user.id },
      orderBy: { lastActive: "desc" },
    })

    // Si no existen sesiones registradas para el usuario, registrar la sesión actual
    if (userSessions.length === 0) {
      const currentSession = await prisma.userSession.create({
        data: {
          userId: session.user.id,
          userAgent,
          ipAddress,
          isCurrent: true,
          lastActive: new Date(),
        },
      })
      userSessions = [currentSession]
    }

    return NextResponse.json(userSessions)
  } catch (error: any) {
    console.error("Error fetching user sessions:", error)
    return NextResponse.json(
      { error: "Error al obtener sesiones de usuario" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Revocar todas las sesiones secundarias exceptuando la actual
    await prisma.userSession.deleteMany({
      where: {
        userId: session.user.id,
        isCurrent: false,
      },
    })

    return NextResponse.json({ message: "Se han cerrado todas las demás sesiones activas" })
  } catch (error: any) {
    console.error("Error revoking other sessions:", error)
    return NextResponse.json(
      { error: "Error al cerrar las demás sesiones" },
      { status: 500 }
    )
  }
}
