import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@projectflow.com' },
    update: {},
    create: {
      email: 'demo@projectflow.com',
      name: 'Usuario Demo',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuario creado:', user.email)

  // Crear proyectos
  const project1 = await prisma.project.create({
    data: {
      name: 'Plataforma E-commerce',
      description: 'Desarrollo completo de tienda online con pasarela de pagos integrada',
      objective: 'Lanzar una plataforma e-commerce funcional que permita a los usuarios comprar productos online',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      progress: 75,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-30'),
      userId: user.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'App Móvil iOS',
      description: 'Aplicación nativa para gestión de inventario',
      objective: 'Crear app móvil que facilite la gestión de inventario en tiempo real',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      progress: 45,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-15'),
      userId: user.id,
    },
  })

  console.log('✅ Proyectos creados')

  // Crear objetivos SMART para proyecto 1
  await prisma.objective.create({
    data: {
      projectId: project1.id,
      specific: 'Desarrollar plataforma e-commerce funcional con carrito y pagos',
      measurable: '15 funcionalidades completadas, 100% de tests pasando',
      achievable: 'Equipo de 5 desarrolladores con experiencia en e-commerce',
      relevant: 'Aumentar ventas online en 40% y reducir costos operativos',
      timeBound: '105 días (15 semanas) desde inicio hasta lanzamiento',
    },
  })

  console.log('✅ Objetivos SMART creados')

  // Crear tareas para proyecto 1
  const task1 = await prisma.task.create({
    data: {
      name: 'Diseño de interfaz de usuario',
      description: 'Crear mockups y prototipos de todas las pantallas',
      projectId: project1.id,
      assigneeId: user.id,
      priority: 'HIGH',
      status: 'COMPLETED',
      estimatedDuration: 5,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      isCritical: true,
    },
  })

  const task2 = await prisma.task.create({
    data: {
      name: 'Implementar sistema de autenticación',
      description: 'Login, registro y recuperación de contraseña',
      projectId: project1.id,
      assigneeId: user.id,
      priority: 'CRITICAL',
      status: 'COMPLETED',
      estimatedDuration: 7,
      startDate: new Date('2024-01-21'),
      endDate: new Date('2024-01-28'),
      isCritical: true,
    },
  })

  const task3 = await prisma.task.create({
    data: {
      name: 'Integrar pasarela de pagos',
      description: 'Implementar Stripe para procesar pagos',
      projectId: project1.id,
      assigneeId: user.id,
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      estimatedDuration: 10,
      startDate: new Date('2024-02-01'),
      isCritical: true,
    },
  })

  const task4 = await prisma.task.create({
    data: {
      name: 'Desarrollar carrito de compras',
      description: 'Funcionalidad completa de carrito con persistencia',
      projectId: project1.id,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      estimatedDuration: 8,
      startDate: new Date('2024-02-05'),
      isCritical: false,
    },
  })

  const task5 = await prisma.task.create({
    data: {
      name: 'Sistema de gestión de inventario',
      description: 'CRUD de productos y control de stock',
      projectId: project1.id,
      priority: 'MEDIUM',
      status: 'TODO',
      estimatedDuration: 12,
      isCritical: false,
    },
  })

  const task6 = await prisma.task.create({
    data: {
      name: 'Panel de administración',
      description: 'Dashboard para gestionar pedidos y productos',
      projectId: project1.id,
      priority: 'MEDIUM',
      status: 'TODO',
      estimatedDuration: 15,
      isCritical: false,
    },
  })

  console.log('✅ Tareas creadas')

  // Crear dependencias
  await prisma.dependency.create({
    data: {
      taskId: task2.id,
      dependsOnId: task1.id,
      type: 'FINISH_TO_START',
    },
  })

  await prisma.dependency.create({
    data: {
      taskId: task3.id,
      dependsOnId: task2.id,
      type: 'FINISH_TO_START',
    },
  })

  await prisma.dependency.create({
    data: {
      taskId: task4.id,
      dependsOnId: task2.id,
      type: 'FINISH_TO_START',
    },
  })

  console.log('✅ Dependencias creadas')

  // Crear estimaciones PERT
  await prisma.pERTEstimation.create({
    data: {
      taskId: task3.id,
      optimistic: 7,
      mostLikely: 10,
      pessimistic: 15,
      expectedTime: 10.33,
      variance: 1.78,
      standardDev: 1.33,
    },
  })

  await prisma.pERTEstimation.create({
    data: {
      taskId: task4.id,
      optimistic: 5,
      mostLikely: 8,
      pessimistic: 12,
      expectedTime: 8.17,
      variance: 1.36,
      standardDev: 1.17,
    },
  })

  console.log('✅ Estimaciones PERT creadas')

  // Crear tareas para proyecto 2
  await prisma.task.createMany({
    data: [
      {
        name: 'Configurar proyecto React Native',
        projectId: project2.id,
        assigneeId: user.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        estimatedDuration: 2,
      },
      {
        name: 'Diseñar pantallas principales',
        projectId: project2.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        estimatedDuration: 5,
      },
      {
        name: 'Implementar navegación',
        projectId: project2.id,
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        estimatedDuration: 3,
      },
      {
        name: 'Integrar API de inventario',
        projectId: project2.id,
        priority: 'CRITICAL',
        status: 'TODO',
        estimatedDuration: 8,
        isCritical: true,
      },
    ],
  })

  console.log('✅ Tareas del proyecto 2 creadas')

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
