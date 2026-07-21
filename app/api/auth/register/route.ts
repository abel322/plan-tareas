import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe un usuario registrado con este correo electrónico" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error en registro:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Datos de registro inválidos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error al registrar el usuario", message: error.message },
      { status: 500 }
    )
  }
}
