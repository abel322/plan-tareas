import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    return NextResponse.json({
      message: "Autenticación de dos factores desactivada con éxito",
      isTwoFactorEnabled: false,
    })
  } catch (error: any) {
    console.error("Error disabling 2FA:", error)
    return NextResponse.json(
      { error: "Error al desactivar 2FA" },
      { status: 500 }
    )
  }
}
