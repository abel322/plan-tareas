import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import speakeasy from "speakeasy"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { secret, code } = body

    if (!secret || !code) {
      return NextResponse.json(
        { error: "Se requiere el secreto y el código de verificación de 6 dígitos" },
        { status: 400 }
      )
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: code,
      window: 2,
    })

    if (!verified) {
      return NextResponse.json(
        { error: "Código de verificación de 2FA inválido o expirado" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isTwoFactorEnabled: true,
        twoFactorSecret: secret,
      },
    })

    return NextResponse.json({
      message: "Autenticación de dos factores activada con éxito",
      isTwoFactorEnabled: true,
    })
  } catch (error: any) {
    console.error("Error verifying 2FA:", error)
    return NextResponse.json(
      { error: "Error al verificar la autenticación de dos factores" },
      { status: 500 }
    )
  }
}
