/**
 * PERT (Program Evaluation Review Technique) Algorithm
 * Calcula el tiempo esperado y la varianza de una tarea
 */

export interface PERTInput {
  optimistic: number    // O - Tiempo optimista
  mostLikely: number    // M - Tiempo más probable
  pessimistic: number   // P - Tiempo pesimista
}

export interface PERTResult {
  expectedTime: number      // E = (O + 4M + P) / 6
  variance: number          // V = ((P - O) / 6)²
  standardDeviation: number // σ = √V
}

/**
 * Calcula el tiempo esperado usando la fórmula PERT
 */
export function calculatePERT(input: PERTInput): PERTResult {
  const { optimistic, mostLikely, pessimistic } = input

  // Validación
  if (optimistic < 0 || mostLikely < 0 || pessimistic < 0) {
    throw new Error('Los tiempos no pueden ser negativos')
  }

  if (optimistic > mostLikely || mostLikely > pessimistic) {
    throw new Error('Debe cumplirse: Optimista ≤ Más Probable ≤ Pesimista')
  }

  // Tiempo esperado: E = (O + 4M + P) / 6
  const expectedTime = (optimistic + 4 * mostLikely + pessimistic) / 6

  // Varianza: V = ((P - O) / 6)²
  const variance = Math.pow((pessimistic - optimistic) / 6, 2)

  // Desviación estándar: σ = √V
  const standardDeviation = Math.sqrt(variance)

  return {
    expectedTime: Number(expectedTime.toFixed(2)),
    variance: Number(variance.toFixed(4)),
    standardDeviation: Number(standardDeviation.toFixed(2))
  }
}

/**
 * Calcula la probabilidad de completar el proyecto en un tiempo dado
 * usando la distribución normal
 */
export function calculateCompletionProbability(
  expectedTime: number,
  standardDeviation: number,
  targetTime: number
): number {
  if (standardDeviation === 0) return targetTime >= expectedTime ? 1 : 0

  // Z-score: Z = (T - E) / σ
  const zScore = (targetTime - expectedTime) / standardDeviation

  // Aproximación de la función de distribución acumulativa normal
  return normalCDF(zScore)
}

/**
 * Función de distribución acumulativa normal estándar (aproximación)
 */
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp(-z * z / 2)
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  
  return z > 0 ? 1 - probability : probability
}
