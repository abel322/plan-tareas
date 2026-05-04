const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Borrando todos los datos...')

  // Borrar en orden para respetar las relaciones
  await prisma.activityLog.deleteMany()
  console.log('✅ ActivityLog borrado')

  await prisma.pERTEstimation.deleteMany()
  console.log('✅ PERTEstimation borrado')

  await prisma.dependency.deleteMany()
  console.log('✅ Dependency borrado')

  await prisma.task.deleteMany()
  console.log('✅ Task borrado')

  await prisma.objective.deleteMany()
  console.log('✅ Objective borrado')

  await prisma.project.deleteMany()
  console.log('✅ Project borrado')

  await prisma.user.deleteMany()
  console.log('✅ User borrado')

  console.log('🎉 Todos los datos han sido borrados!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
