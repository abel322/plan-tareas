import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculatePERT } from "@/lib/algorithms/pert"
import { createPERTEstimationSchema } from "@/lib/validations/project"

// POST /api/pert/calculate - Calcular y guardar estimación PERT
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPERTEstimationSchema.parse(body)

    // Calcular valores PERT
    const pertResult = calculatePERT({
      optimistic: validatedData.optimistic,
      mostLikely: validatedData.mostLikely,
      pessimistic: validatedData.pessimistic,
    })

    // Guardar o actualizar en la base de datos
    const pertEstimation = await prisma.pERTEstimation.upsert({
      where: {
        taskId: validatedData.taskId,
      },
      update: {
        optimistic: validatedData.optimistic,
        mostLikely: validatedData.mostLikely,
        pessimistic: validatedData.pessimistic,
        expectedTime: pertResult.expectedTime,
        variance: pertResult.variance,
        standardDev: pertResult.standardDeviation,
      },
      create: {
        taskId: validatedData.taskId,
        optimistic: validatedData.optimistic,
        mostLikely: validatedData.mostLikely,
        pessimistic: validatedData.pessimistic,
        expectedTime: pertResult.expectedTime,
        variance: pertResult.variance,
        standardDev: pertResult.standardDeviation,
      },
    })

    // Actualizar la duración estimada de la tarea
    await prisma.task.update({
      where: { id: validatedData.taskId },
      data: {
        estimatedDuration: pertResult.expectedTime,
      },
    })

    return NextResponse.json({
      ...pertEstimation,
      calculation: pertResult,
    })
  } catch (error: any) {
    console.error("Error calculating PERT:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Error al calcular PERT" },
      { status: 500 }
    )
  }
}
