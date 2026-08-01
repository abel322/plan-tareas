import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, isTwoFactorEnabled: true },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Generar nuevo secreto TOTP
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `PlanTareas (${user.email})`,
      issuer: "PlanTareas App",
    })

    const otpauthUrl = secret.otpauth_url || ""
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl)

    return NextResponse.json({
      secret: secret.base32,
      qrCodeUrl,
      otpauthUrl,
    })
  } catch (error: any) {
    console.error("Error setting up 2FA:", error)
    return NextResponse.json(
      { error: "Error al generar la configuración de 2FA" },
      { status: 500 }
    )
  }
}
