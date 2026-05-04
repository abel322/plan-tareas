# Implementation Plan: Music Practice PWA

## Overview

Esta aplicación es una PWA completa para gestión de práctica musical con frontend React + TypeScript, backend Node.js + Express + Prisma, y PostgreSQL. La implementación se divide en configuración inicial, backend (autenticación, modelos, servicios de negocio), frontend (componentes, rutas, contextos), y funcionalidades PWA.

## Tasks

- [x] 1. Configuración inicial del proyecto
  - Crear estructura de carpetas (backend/, frontend/, shared/)
  - Inicializar proyecto Node.js en backend/ con TypeScript
  - Inicializar proyecto React con Vite en frontend/
  - Configurar ESLint y Prettier para ambos proyectos
  - Crear archivo .env.example con variables necesarias
  - _Requirements: 20.1, 20.2_

- [x] 2. Configuración de base de datos y Prisma
  - [x] 2.1 Instalar Prisma y dependencias en backend
    - Instalar prisma, @prisma/client, pg
    - Inicializar Prisma con `npx prisma init`
    - _Requirements: 1.1, 2.1_
  
  - [x] 2.2 Crear schema de Prisma completo
    - Definir modelos: User, Book, Exercise, Session, SessionExercise, Goal, LevelHistory
    - Definir enums: Instrument, Difficulty, Level, GoalType
    - Configurar relaciones y índices según diseño
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.1, 10.1, 12.1_
  
  - [x] 2.3 Ejecutar migración inicial
    - Ejecutar `npx prisma migrate dev --name init`
    - Generar Prisma Client
    - _Requirements: 1.1_

- [x] 3. Backend - Autenticación y seguridad
  - [x] 3.1 Implementar servicio de autenticación
    - Instalar bcrypt, jsonwebtoken, zod
    - Crear AuthService con métodos: register, login, hashPassword, verifyPassword, generateToken
    - Implementar validación de email y contraseña según requisitos
    - _Requirements: 1.1, 1.2, 1.4, 1.6, 1.7_
  
  - [x] 3.2 Crear middleware de autenticación JWT
    - Implementar authenticateToken middleware
    - Validar token en header Authorization
    - Extraer userId y agregarlo a req.user
    - _Requirements: 19.1, 19.2, 19.7_
  
  - [x] 3.3 Implementar rate limiting y sanitización
    - Configurar express-rate-limit para login (5 intentos/minuto)
    - Configurar rate limiting general (100 peticiones/15min)
    - Implementar middleware de sanitización de inputs
    - _Requirements: 19.5, 19.6_
  
  - [x] 3.4 Crear rutas de autenticación
    - POST /api/auth/register
    - POST /api/auth/login
    - POST /api/auth/forgot-password
    - POST /api/auth/reset-password
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 4. Backend - Gestión de usuarios
  - [x] 4.1 Crear controladores de usuario
    - GET /api/users/profile - obtener perfil
    - PUT /api/users/profile - actualizar perfil
    - PUT /api/users/password - cambiar contraseña
    - GET /api/users/stats - estadísticas generales
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  
  - [x] 4.2 Implementar validación de actualización de perfil
    - Validar instrumentos seleccionados
    - Validar cambio de contraseña con contraseña actual
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 5. Backend - Almacenamiento y gestión de PDFs
  - [x] 5.1 Implementar StorageService
    - Crear servicio con métodos uploadPDF y deletePDF
    - Implementar lógica para desarrollo (carpeta local uploads/)
    - Implementar lógica para producción (AWS S3)
    - _Requirements: 3.1, 3.6, 3.7_
  
  - [x] 5.2 Configurar multer para subida de archivos
    - Instalar multer y configurar límites (50MB)
    - Validar tipo de archivo (solo PDF)
    - Configurar almacenamiento temporal
    - _Requirements: 3.2_
  
  - [x] 5.3 Crear rutas de gestión de libros
    - GET /api/books - listar libros con búsqueda y filtros
    - POST /api/books - subir nuevo libro
    - GET /api/books/:id - obtener detalle de libro
    - PUT /api/books/:id - actualizar libro
    - DELETE /api/books/:id - eliminar libro y archivo
    - _Requirements: 3.1, 3.3, 3.4, 3.7, 23.1, 23.3_
  
  - [x] 5.4 Implementar autorización de recursos
    - Verificar que usuario solo acceda a sus propios libros
    - Aplicar en todos los endpoints de libros
    - _Requirements: 19.3_

- [x] 6. Backend - Gestión de ejercicios
  - [x] 6.1 Crear controladores de ejercicios
    - GET /api/exercises - listar con filtros por bookId y difficulty
    - POST /api/exercises - crear ejercicio
    - GET /api/exercises/:id - obtener detalle
    - PUT /api/exercises/:id - actualizar ejercicio
    - DELETE /api/exercises/:id - eliminar ejercicio
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 23.2, 23.4_
  
  - [x] 6.2 Implementar validación de ejercicios
    - Validar que bookId pertenezca al usuario
    - Validar formato de páginas
    - Validar dificultad
    - _Requirements: 5.1, 5.2_
  
  - [x] 6.3 Implementar soft delete para ejercicios
    - Mantener registros históricos al eliminar
    - Usar onDelete: Restrict en SessionExercise
    - _Requirements: 5.5_

- [x] 7. Backend - Sesiones de práctica
  - [x] 7.1 Crear controladores de sesiones
    - GET /api/sessions - listar con paginación y filtros de fecha
    - POST /api/sessions - crear sesión (manual o desde temporizador)
    - GET /api/sessions/:id - obtener detalle
    - PUT /api/sessions/:id - editar sesión (solo dentro de 24h)
    - DELETE /api/sessions/:id - eliminar sesión
    - _Requirements: 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 20.4_
  
  - [x] 7.2 Implementar validación de sesiones
    - Validar que fecha no sea futura
    - Validar duración positiva
    - Validar que ejercicios pertenezcan al usuario
    - Validar edición solo dentro de 24h
    - _Requirements: 7.2, 7.3, 7.5_
  
  - [x] 7.3 Crear SessionExercise al guardar sesión
    - Guardar relación muchos-a-muchos con duraciones individuales
    - _Requirements: 6.6_

- [x] 8. Backend - Cálculo de nivel
  - [x] 8.1 Implementar LevelCalculationService
    - Crear método calculateLevel(userId)
    - Calcular totalHours desde todas las sesiones
    - Calcular consistency (% días con práctica en últimos 30 días)
    - Calcular exerciseVariety (ejercicios únicos practicados)
    - _Requirements: 10.1, 10.6_
  
  - [x] 8.2 Implementar lógica de niveles
    - BASIC: < 20 horas
    - INTERMEDIATE: 20-100 horas Y consistency > 40%
    - ADVANCED: > 100 horas Y consistency > 60% Y variety >= 15
    - _Requirements: 10.2, 10.3, 10.4_
  
  - [x] 8.3 Implementar notificación de cambio de nivel
    - Detectar cambio de nivel al guardar sesión
    - Crear registro en LevelHistory
    - Retornar indicador de cambio en respuesta
    - _Requirements: 10.5_
  
  - [x] 8.4 Crear endpoint de nivel actual
    - GET /api/levels/current - nivel y progreso hacia siguiente
    - Calcular métricas faltantes para siguiente nivel
    - _Requirements: 10.7_
  
  - [x] 8.5 Crear endpoint de historial de niveles
    - GET /api/levels/history - todos los cambios de nivel
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 9. Backend - Dashboard y estadísticas
  - [x] 9.1 Crear endpoints de estadísticas
    - GET /api/dashboard/stats - tiempo total, promedios, racha, sesiones
    - GET /api/dashboard/practice-chart - datos para gráfico de últimos 30 días
    - GET /api/dashboard/instrument-distribution - distribución por instrumento
    - GET /api/dashboard/top-exercises - top 5 ejercicios más practicados
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.7_
  
  - [x] 9.2 Implementar cálculo de racha
    - Calcular días consecutivos con al menos una sesión
    - Considerar zona horaria del usuario
    - _Requirements: 8.5, 9.6_
  
  - [x] 9.3 Implementar filtros de fecha
    - Permitir filtrar estadísticas por rango personalizado
    - _Requirements: 8.6_

- [x] 10. Backend - Metas de práctica
  - [x] 10.1 Crear controladores de metas
    - GET /api/goals - listar metas (filtro por activas)
    - POST /api/goals - crear meta
    - GET /api/goals/:id - obtener meta con progreso actual
    - PUT /api/goals/:id - actualizar meta
    - DELETE /api/goals/:id - eliminar meta
    - _Requirements: 12.1, 12.2, 12.6, 12.7_
  
  - [x] 10.2 Implementar cálculo de progreso de metas
    - Para metas diarias: comparar tiempo hoy vs objetivo
    - Para metas semanales: comparar tiempo esta semana vs objetivo
    - Retornar porcentaje de completitud
    - _Requirements: 12.3, 12.4_
  
  - [x] 10.3 Implementar detección de meta completada
    - Verificar al guardar sesión si se completó meta
    - Retornar indicador en respuesta
    - _Requirements: 12.5_

- [x] 11. Backend - Motor de recomendaciones
  - [x] 11.1 Implementar RecommendationEngine
    - Crear método generateRecommendations(userId)
    - Analizar últimos 30 días de sesiones
    - _Requirements: 13.1_
  
  - [x] 11.2 Implementar reglas de recomendación
    - Consistencia < 50%: sugerir meta más alcanzable
    - Ejercicios únicos < 3: sugerir aumentar variedad
    - Sin práctica en 3+ días: enviar recordatorio
    - Promedio < 30 min: sugerir incrementar duración
    - Sugerir ejercicios no practicados recientemente
    - _Requirements: 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [x] 11.3 Priorizar y limitar recomendaciones
    - Ordenar por prioridad (high, medium, low)
    - Retornar máximo 5 recomendaciones
    - _Requirements: 13.7_
  
  - [x] 11.4 Crear endpoint de recomendaciones
    - GET /api/recommendations
    - _Requirements: 13.1_

- [x] 12. Backend - Motor de predicciones
  - [x] 12.1 Implementar PredictionEngine
    - Crear método predictNextLevel(userId)
    - Verificar datos suficientes (mínimo 7 días)
    - Calcular promedio diario de práctica
    - _Requirements: 14.1, 14.2, 14.6_
  
  - [x] 12.2 Calcular escenarios de predicción
    - Conservador: mantener ritmo actual
    - Moderado: 30 min diarios
    - Ambicioso: 60 min diarios
    - Calcular días estimados para cada escenario
    - _Requirements: 14.4, 14.5_
  
  - [x] 12.3 Calcular fecha estimada
    - Usar escenario conservador para fecha principal
    - _Requirements: 14.3_
  
  - [x] 12.4 Crear endpoint de predicciones
    - GET /api/predictions/next-level
    - Retornar null si datos insuficientes
    - _Requirements: 14.1, 14.6, 14.7_

- [x] 13. Backend - Exportación de datos
  - [x] 13.1 Implementar exportación JSON
    - GET /api/export/data
    - Incluir todos los libros, ejercicios, sesiones del usuario
    - Incluir metadatos (fecha, versión, usuario)
    - _Requirements: 22.1, 22.2, 22.4_
  
  - [x] 13.2 Implementar exportación CSV
    - GET /api/export/stats?format=csv
    - Exportar estadísticas en formato CSV
    - _Requirements: 22.3_
  
  - [x] 13.3 Configurar descarga automática
    - Configurar headers Content-Disposition
    - _Requirements: 22.5_

- [x] 14. Backend - Manejo de errores y validación
  - [x] 14.1 Crear middleware de manejo de errores global
    - Capturar errores de validación Zod
    - Capturar errores de Prisma
    - Capturar errores de red/servidor
    - Retornar mensajes apropiados sin exponer detalles técnicos
    - _Requirements: 24.1, 24.2, 24.3_
  
  - [x] 14.2 Implementar logging de errores
    - Registrar errores en consola/archivo para debugging
    - _Requirements: 24.3_
  
  - [x] 14.3 Crear schemas de validación Zod
    - registerSchema, loginSchema, bookSchema, exerciseSchema
    - sessionSchema, goalSchema
    - _Requirements: 18.1, 18.2, 18.3, 18.6_

- [x] 15. Checkpoint - Backend completo
  - Verificar que todos los endpoints funcionen correctamente
  - Probar autenticación y autorización
  - Verificar cálculos de nivel, recomendaciones y predicciones
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Frontend - Configuración inicial
  - [x] 16.1 Configurar Vite con React y TypeScript
    - Crear proyecto con `npm create vite@latest`
    - Configurar tsconfig.json
    - _Requirements: 20.1_
  
  - [x] 16.2 Instalar dependencias principales
    - @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
    - react-router-dom, axios
    - react-pdf, recharts
    - workbox-precaching, workbox-routing, workbox-strategies
    - _Requirements: 20.2_
  
  - [x] 16.3 Configurar estructura de carpetas
    - src/components/, src/pages/, src/contexts/, src/services/, src/types/
    - src/utils/, src/hooks/
    - _Requirements: 20.1_

- [x] 17. Frontend - Configuración de tema y Material-UI
  - [x] 17.1 Crear tema personalizado
    - Configurar paleta con colores azul-morado
    - Definir tema claro y oscuro
    - Configurar tipografía
    - _Requirements: 15.3_
  
  - [x] 17.2 Crear ThemeContext
    - Implementar toggle entre modo claro y oscuro
    - Persistir preferencia en localStorage
    - Detectar preferencia del sistema en primera visita
    - _Requirements: 15.1, 15.2, 15.5_
  
  - [x] 17.3 Configurar ThemeProvider en App
    - Envolver aplicación con ThemeProvider
    - Aplicar CssBaseline de Material-UI
    - _Requirements: 15.1_

- [x] 18. Frontend - Sistema de autenticación
  - [x] 18.1 Crear tipos TypeScript
    - User, LoginFormData, RegisterFormData, AuthResponse
    - _Requirements: 1.1_
  
  - [x] 18.2 Crear servicio de autenticación (authService.ts)
    - Métodos: login, register, logout, forgotPassword
    - Configurar axios con baseURL
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 18.3 Crear AuthContext
    - Estado: user, token, isAuthenticated, isLoading
    - Métodos: login, register, logout, updateProfile
    - Persistir token en localStorage
    - Cargar usuario al iniciar aplicación
    - _Requirements: 1.2, 1.5, 19.7_
  
  - [x] 18.4 Configurar interceptor de axios
    - Agregar token JWT a todas las peticiones
    - Manejar respuestas 401/403 y redirigir a login
    - _Requirements: 19.1, 19.7_
  
  - [x] 18.5 Crear componente Login
    - Formulario con email y contraseña
    - Validación de campos
    - Mostrar errores de validación
    - Llamar a authContext.login
    - _Requirements: 1.2, 18.1, 18.2, 18.3_
  
  - [x] 18.6 Crear componente Register
    - Formulario con name, email, password, confirmPassword, instruments
    - Validación de campos (email, contraseña con requisitos)
    - Selector múltiple de instrumentos
    - _Requirements: 1.1, 1.6, 1.7, 18.1, 18.2_
  
  - [x] 18.7 Crear componente ForgotPassword
    - Formulario con email
    - _Requirements: 1.3_
  
  - [x] 18.8 Crear ProtectedRoute wrapper
    - Verificar autenticación antes de renderizar rutas
    - Redirigir a /login si no autenticado
    - _Requirements: 19.1_

- [x] 19. Frontend - Sistema de notificaciones
  - [x] 19.1 Crear NotificationContext
    - Estado: array de notificaciones
    - Métodos: showNotification, hideNotification
    - Auto-ocultar después de duración especificada
    - _Requirements: 17.1, 17.2, 17.6_
  
  - [x] 19.2 Crear componente NotificationToast
    - Usar Snackbar de Material-UI
    - Colores según tipo (success: verde, error: rojo)
    - Permitir cierre manual
    - _Requirements: 17.1, 17.2, 17.6_
  
  - [x] 19.3 Integrar notificaciones en operaciones
    - Mostrar notificación en login exitoso/fallido
    - Mostrar notificación en operaciones CRUD
    - Mostrar notificación en cambio de nivel
    - Mostrar notificación en meta completada
    - _Requirements: 17.1, 17.2, 17.4, 17.5_

- [x] 20. Frontend - Layout y navegación
  - [x] 20.1 Crear componente AppLayout
    - Estructura con Header y Sidebar
    - Outlet para rutas hijas
    - _Requirements: 16.1, 16.2_
  
  - [x] 20.2 Crear componente Header
    - Barra superior con botón de menú (móvil)
    - Nombre de usuario
    - Toggle de tema
    - Botón de logout
    - _Requirements: 15.1, 16.2_
  
  - [x] 20.3 Crear componente Sidebar
    - Navegación lateral permanente en desktop
    - Drawer colapsable en móvil
    - Links a todas las secciones
    - Iconos de Material-UI
    - _Requirements: 16.2, 16.3_
  
  - [x] 20.4 Configurar React Router
    - Crear router con todas las rutas
    - Rutas públicas: /login, /register, /forgot-password
    - Rutas protegidas: /, /books, /exercises, /practice, /sessions, /calendar, /level, /goals, /recommendations, /predictions, /profile, /export
    - Ruta 404
    - _Requirements: 16.1, 19.1_
  
  - [x] 20.5 Implementar diseño responsivo en layout
    - Breakpoints: móvil (<600px), tablet (600-960px), desktop (>960px)
    - Ajustar navegación según tamaño de pantalla
    - _Requirements: 16.1, 16.2, 16.3_

- [x] 21. Frontend - Gestión de perfil
  - [x] 21.1 Crear componente Profile
    - Mostrar información del usuario
    - Formulario de edición (name, instruments)
    - Formulario de cambio de contraseña
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 21.2 Implementar actualización de perfil
    - Validar campos antes de enviar
    - Llamar a API PUT /api/users/profile
    - Actualizar AuthContext con nuevos datos
    - _Requirements: 2.2, 2.3_
  
  - [x] 21.3 Implementar cambio de contraseña
    - Validar contraseña actual
    - Validar nueva contraseña con requisitos
    - _Requirements: 2.4_

- [x] 22. Frontend - Gestión de libros PDF
  - [x] 22.1 Crear servicio de libros (bookService.ts)
    - Métodos: getBooks, getBook, uploadBook, updateBook, deleteBook
    - _Requirements: 3.1, 3.3, 3.4, 3.7_
  
  - [x] 22.2 Crear componente BookList
    - Listar libros en grid/lista
    - Barra de búsqueda con debouncing (300ms)
    - Filtro por instrumento
    - Paginación si > 20 libros
    - Botón para subir nuevo libro
    - _Requirements: 3.3, 20.4, 20.7, 23.1, 23.3, 23.5_
  
  - [x] 22.3 Crear componente BookUpload
    - Formulario con name, instrument, description, file
    - Validar tipo de archivo (PDF) y tamaño (< 50MB)
    - Mostrar progreso de subida
    - Manejar errores de subida
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 18.4_
  
  - [x] 22.4 Crear componente BookDetail
    - Mostrar información del libro
    - Botones para editar y eliminar
    - Listar ejercicios asociados
    - Botón para ver PDF
    - _Requirements: 3.3, 3.4, 3.7, 5.3_
  
  - [x] 22.5 Implementar confirmación de eliminación
    - Dialog de confirmación antes de eliminar
    - _Requirements: 3.7_

- [x] 23. Frontend - Visualizador de PDF
  - [x] 23.1 Crear componente PDFViewer
    - Usar react-pdf para renderizar PDF
    - Controles de navegación (anterior, siguiente, ir a página)
    - Controles de zoom (in, out, ajustar a ancho)
    - Mantener posición de scroll al cambiar página
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 23.2 Implementar diseño responsivo del visor
    - Ajustar tamaño según dispositivo
    - Optimizar para móvil, tablet y desktop
    - _Requirements: 4.5, 16.5_
  
  - [x] 23.3 Manejar errores de carga de PDF
    - Mostrar mensaje de error
    - Botón para reintentar
    - _Requirements: 4.6, 24.1_

- [x] 24. Frontend - Gestión de ejercicios
  - [x] 24.1 Crear servicio de ejercicios (exerciseService.ts)
    - Métodos: getExercises, getExercise, createExercise, updateExercise, deleteExercise
    - _Requirements: 5.1, 5.3, 5.4_
  
  - [x] 24.2 Crear componente ExerciseList
    - Listar ejercicios con información del libro
    - Filtros por instrumento y dificultad
    - Búsqueda en nombre y descripción
    - Botón para crear nuevo ejercicio
    - _Requirements: 5.3, 5.6, 23.2, 23.4, 23.6_
  
  - [x] 24.3 Crear componente ExerciseForm
    - Formulario para crear/editar ejercicio
    - Campos: name, description, bookId (selector), pages, difficulty, notes
    - Validación de campos
    - _Requirements: 5.1, 5.2, 5.4, 18.1, 18.2_
  
  - [x] 24.4 Implementar confirmación de eliminación
    - Dialog de confirmación
    - Informar que se mantendrán registros históricos
    - _Requirements: 5.4, 5.5_

- [x] 25. Frontend - Temporizador de práctica
  - [x] 25.1 Crear componente PracticeTimer
    - Estado: isRunning, isPaused, elapsedSeconds
    - Mostrar tiempo en formato HH:MM:SS
    - Botones: Start, Pause, Resume, Stop
    - Actualizar cada segundo cuando está corriendo
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 25.2 Implementar selección de ejercicios
    - Permitir agregar múltiples ejercicios a la sesión
    - Mostrar lista de ejercicios seleccionados
    - _Requirements: 6.6_
  
  - [x] 25.3 Implementar guardado de sesión
    - Al finalizar, abrir formulario con duración pre-llenada
    - Permitir agregar notas
    - Enviar a POST /api/sessions
    - _Requirements: 6.5_
  
  - [x] 25.4 Manejar cierre de aplicación con sesión activa
    - Detectar beforeunload
    - Preguntar si desea guardar sesión parcial
    - _Requirements: 6.7_

- [x] 26. Frontend - Registro manual de sesiones
  - [x] 26.1 Crear servicio de sesiones (sessionService.ts)
    - Métodos: getSessions, createSession, updateSession, deleteSession
    - _Requirements: 6.5, 7.1, 7.5_
  
  - [x] 26.2 Crear componente SessionForm
    - Formulario con date, durationMinutes, exercises (múltiples con duración), notes
    - Validar que fecha no sea futura
    - Validar duración positiva
    - Selector de ejercicios con duración individual
    - _Requirements: 7.1, 7.2, 7.3, 18.1, 18.2_
  
  - [x] 26.3 Crear componente SessionList
    - Listar sesiones con paginación
    - Filtros por rango de fechas
    - Mostrar fecha, duración, ejercicios
    - Botones para editar (solo < 24h) y eliminar
    - _Requirements: 7.4, 7.5, 20.4_
  
  - [x] 26.4 Implementar edición de sesiones
    - Verificar que sesión tenga < 24h
    - Deshabilitar edición si > 24h
    - _Requirements: 7.5_

- [x] 27. Frontend - Dashboard de estadísticas
  - [x] 27.1 Crear servicio de dashboard (dashboardService.ts)
    - Métodos: getStats, getPracticeChart, getInstrumentDistribution, getTopExercises
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x] 27.2 Crear componente Dashboard
    - Layout con grid de tarjetas de estadísticas
    - Reorganizar en columna única en móvil
    - _Requirements: 8.1, 16.6, 20.6_
  
  - [x] 27.3 Crear componente StatsCard
    - Mostrar título, valor, icono
    - Opcional: tendencia (up/down)
    - _Requirements: 8.1_
  
  - [x] 27.4 Crear tarjetas de estadísticas principales
    - Tiempo total practicado
    - Promedio diario
    - Promedio semanal
    - Racha actual
    - Número de sesiones
    - _Requirements: 8.1, 8.5, 8.7_
  
  - [x] 27.5 Crear componente PracticeChart
    - Usar recharts para gráfico de barras/líneas
    - Mostrar últimos 30 días por defecto
    - Cargar datos de forma asíncrona
    - _Requirements: 8.2, 20.6_
  
  - [x] 27.6 Crear componente InstrumentDistribution
    - Usar recharts para gráfico circular
    - Mostrar distribución por instrumento
    - _Requirements: 8.3_
  
  - [x] 27.7 Crear componente TopExercises
    - Listar top 5 ejercicios con tiempo dedicado
    - _Requirements: 8.4_
  
  - [x] 27.8 Implementar filtros de fecha
    - Selector de rango de fechas personalizado
    - Actualizar todas las estadísticas al cambiar filtro
    - _Requirements: 8.6_
  
  - [x] 27.9 Mostrar mensaje cuando no hay datos
    - Mensaje motivacional y guía para comenzar
    - _Requirements: 8.8_

- [x] 28. Frontend - Calendario de práctica
  - [x] 28.1 Crear componente PracticeCalendar
    - Vista mensual con días del mes
    - Indicadores en días con sesiones
    - Código de colores: verde (>60min), amarillo (30-60min), gris (<30min)
    - _Requirements: 9.1, 9.2_
  
  - [x] 28.2 Implementar navegación de meses
    - Botones anterior, siguiente, ir a mes específico
    - Resaltar día actual
    - _Requirements: 9.4, 9.5_
  
  - [x] 28.3 Implementar detalle de día
    - Al hacer clic en día, mostrar todas las sesiones
    - Modal o panel lateral con detalles
    - _Requirements: 9.3_
  
  - [x] 28.4 Mostrar racha actual
    - Calcular y mostrar días consecutivos con práctica
    - _Requirements: 9.6_

- [x] 29. Frontend - Sistema de niveles
  - [x] 29.1 Crear servicio de niveles (levelService.ts)
    - Métodos: getCurrentLevel, getLevelHistory
    - _Requirements: 10.1, 11.1_
  
  - [x] 29.2 Crear componente LevelDisplay
    - Mostrar nivel actual con badge/chip
    - Mostrar progreso hacia siguiente nivel
    - Barra de progreso con porcentaje
    - Mostrar métricas actuales y requeridas
    - _Requirements: 10.1, 10.7_
  
  - [x] 29.3 Crear componente LevelHistory
    - Listar todos los cambios de nivel
    - Mostrar fecha y métricas de cada cambio
    - Gráfico de línea temporal
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 29.4 Implementar notificación de cambio de nivel
    - Detectar cambio en respuesta de POST /api/sessions
    - Mostrar notificación especial de felicitación
    - _Requirements: 10.5, 17.5_

- [x] 30. Frontend - Metas de práctica
  - [x] 30.1 Crear servicio de metas (goalService.ts)
    - Métodos: getGoals, createGoal, updateGoal, deleteGoal
    - _Requirements: 12.1, 12.6_
  
  - [x] 30.2 Crear componente GoalForm
    - Formulario con type (daily/weekly), targetMinutes, startDate
    - Validar duración positiva
    - _Requirements: 12.1, 12.2, 18.1, 18.2_
  
  - [x] 30.3 Crear componente GoalProgress
    - Mostrar meta con barra de progreso
    - Calcular progreso actual vs objetivo
    - Mostrar porcentaje de completitud
    - _Requirements: 12.3, 12.4_
  
  - [x] 30.4 Mostrar meta activa en Dashboard
    - Integrar GoalProgress en Dashboard
    - _Requirements: 12.3_
  
  - [x] 30.5 Crear componente GoalHistory
    - Listar metas completadas y no completadas
    - Filtrar por activas/inactivas
    - _Requirements: 12.7_
  
  - [x] 30.6 Implementar notificación de meta completada
    - Detectar en respuesta de POST /api/sessions
    - Mostrar notificación de felicitación
    - _Requirements: 12.5, 17.5_

- [x] 31. Frontend - Recomendaciones
  - [x] 31.1 Crear servicio de recomendaciones (recommendationService.ts)
    - Método: getRecommendations
    - _Requirements: 13.1_
  
  - [x] 31.2 Crear componente RecommendationsList
    - Listar recomendaciones con iconos según tipo
    - Código de colores según prioridad (high: rojo, medium: amarillo, low: azul)
    - Mostrar mensaje y tipo de recomendación
    - _Requirements: 13.7_
  
  - [x] 31.3 Mostrar recomendaciones en Dashboard
    - Sección de recomendaciones en Dashboard
    - Mostrar 3 principales
    - Link a página completa de recomendaciones
    - _Requirements: 13.1_

- [x] 32. Frontend - Predicciones
  - [x] 32.1 Crear servicio de predicciones (predictionService.ts)
    - Método: getNextLevelPrediction
    - _Requirements: 14.1_
  
  - [x] 32.2 Crear componente PredictionDisplay
    - Mostrar siguiente nivel objetivo
    - Mostrar fecha estimada
    - Tabla con 3 escenarios (conservador, moderado, ambicioso)
    - Mostrar días estimados para cada escenario
    - _Requirements: 14.3, 14.4, 14.5_
  
  - [x] 32.3 Manejar datos insuficientes
    - Mostrar mensaje cuando hay < 7 días de datos
    - _Requirements: 14.6_
  
  - [x] 32.4 Mostrar predicción en Dashboard
    - Sección de predicción en Dashboard
    - Link a página completa de predicciones
    - _Requirements: 14.1_

- [x] 33. Frontend - Exportación de datos
  - [x] 33.1 Crear servicio de exportación (exportService.ts)
    - Métodos: exportData (JSON), exportStats (CSV)
    - _Requirements: 22.1, 22.3_
  
  - [x] 33.2 Crear componente ExportData
    - Botón para exportar datos completos (JSON)
    - Botón para exportar estadísticas (CSV)
    - Mostrar indicador de carga durante exportación
    - Iniciar descarga automática
    - _Requirements: 22.1, 22.3, 22.4, 22.5_

- [x] 34. Frontend - Búsqueda y filtrado
  - [x] 34.1 Crear hook useDebounce
    - Implementar debouncing con delay de 300ms
    - _Requirements: 20.7, 23.1_
  
  - [x] 34.2 Implementar búsqueda en BookList
    - Campo de búsqueda con debouncing
    - Buscar en nombre y descripción
    - Mostrar contador de resultados
    - _Requirements: 23.1, 23.2, 23.5_
  
  - [x] 34.3 Implementar búsqueda en ExerciseList
    - Campo de búsqueda con debouncing
    - Buscar en nombre, descripción y notas
    - _Requirements: 23.1, 23.2_
  
  - [x] 34.4 Mostrar mensaje cuando no hay resultados
    - Mensaje indicando que no se encontraron coincidencias
    - _Requirements: 23.6_

- [x] 35. Frontend - Manejo de errores
  - [x] 35.1 Crear Error Boundary component
    - Capturar errores de renderizado
    - Mostrar UI de fallback
    - No romper toda la aplicación
    - _Requirements: 24.4, 24.5_
  
  - [x] 35.2 Implementar manejo de errores en servicios
    - Try-catch en todas las llamadas axios
    - Mostrar notificaciones de error descriptivas
    - Mantener estado de aplicación después de errores
    - _Requirements: 24.1, 24.6_
  
  - [x] 35.3 Crear componente LoadingSpinner
    - Mostrar durante operaciones asíncronas
    - _Requirements: 17.3_
  
  - [x] 35.4 Implementar estados de carga
    - Mostrar indicadores de carga en componentes
    - Deshabilitar botones durante operaciones
    - _Requirements: 17.3_

- [x] 36. Frontend - Accesibilidad
  - [x] 36.1 Agregar etiquetas ARIA
    - aria-label, aria-labelledby, aria-describedby en componentes interactivos
    - role apropiado en elementos personalizados
    - _Requirements: 25.1_
  
  - [x] 36.2 Implementar navegación por teclado
    - Asegurar orden lógico de tabs
    - Manejar eventos de teclado en componentes interactivos
    - _Requirements: 25.2_
  
  - [x] 36.3 Verificar contraste de colores
    - Asegurar ratio mínimo 4.5:1 en ambos temas
    - _Requirements: 25.3_
  
  - [x] 36.4 Agregar texto alternativo
    - alt en imágenes
    - aria-label en iconos
    - _Requirements: 25.4_
  
  - [x] 36.5 Implementar anuncios para lectores de pantalla
    - Usar aria-live para cambios dinámicos
    - Anunciar notificaciones y actualizaciones
    - _Requirements: 25.5_
  
  - [x] 36.6 Verificar zoom
    - Probar zoom hasta 200%
    - Asegurar que no se pierda funcionalidad
    - _Requirements: 25.6_

- [x] 37. Checkpoint - Frontend completo
  - Verificar que todas las páginas funcionen correctamente
  - Probar flujos completos de usuario
  - Verificar diseño responsivo en diferentes dispositivos
  - Verificar accesibilidad básica
  - Ensure all tests pass, ask the user if questions arise.

- [x] 38. PWA - Configuración y Service Worker
  - [x] 38.1 Crear manifest.json
    - Configurar name, short_name, description, start_url
    - Configurar display: standalone
    - Configurar theme_color y background_color
    - Definir iconos en múltiples tamaños (72, 96, 128, 144, 152, 192, 384, 512)
    - _Requirements: 21.2_
  
  - [x] 38.2 Generar iconos de PWA
    - Crear iconos en todos los tamaños requeridos
    - Guardar en carpeta public/icons/
    - _Requirements: 21.2_
  
  - [x] 38.3 Configurar Service Worker con Workbox
    - Implementar precacheAndRoute para assets estáticos
    - Configurar CacheFirst para PDFs (30 días, max 50 archivos)
    - Configurar NetworkFirst para API (5 min, max 100 entradas)
    - Configurar CacheFirst para imágenes (30 días, max 60 archivos)
    - Configurar StaleWhileRevalidate para CSS y fonts
    - _Requirements: 21.3, 21.4, 20.3_
  
  - [x] 38.4 Implementar fallback offline
    - Crear página offline.html
    - Servir offline.html cuando no hay conexión
    - _Requirements: 21.4_
  
  - [x] 38.5 Implementar indicador de estado de conexión
    - Detectar online/offline
    - Mostrar banner cuando está offline
    - _Requirements: 21.7_
  
  - [x] 38.6 Implementar cola de sincronización offline
    - Encolar operaciones de escritura cuando está offline
    - Sincronizar al reconectar
    - _Requirements: 21.6_
  
  - [x] 38.7 Registrar Service Worker en aplicación
    - Registrar en index.html o main.tsx
    - Manejar actualizaciones del Service Worker
    - _Requirements: 21.3_

- [x] 39. PWA - Funcionalidad offline
  - [x] 39.1 Implementar caché de PDFs
    - Cachear PDFs al visualizarlos
    - Permitir acceso offline a PDFs cacheados
    - _Requirements: 21.5, 20.3_
  
  - [x] 39.2 Implementar caché de datos de usuario
    - Cachear libros, ejercicios, sesiones en IndexedDB
    - Mostrar datos cacheados cuando está offline
    - _Requirements: 21.4_
  
  - [x] 39.3 Mostrar mensaje cuando no hay conexión
    - Indicar que está en modo offline
    - Informar qué funcionalidades están limitadas
    - _Requirements: 21.4_

- [x] 40. Optimización y rendimiento
  - [x] 40.1 Implementar lazy loading de rutas
    - Usar React.lazy y Suspense para code splitting
    - Cargar componentes de rutas bajo demanda
    - _Requirements: 20.2_
  
  - [x] 40.2 Optimizar imágenes y assets
    - Comprimir imágenes
    - Usar formatos modernos (WebP)
    - _Requirements: 20.5_
  
  - [x] 40.3 Implementar paginación
    - Paginar listas de libros (> 20 elementos)
    - Paginar listas de sesiones (> 20 elementos)
    - _Requirements: 20.4_
  
  - [x] 40.4 Optimizar carga de gráficos
    - Cargar gráficos de forma asíncrona
    - No bloquear renderizado del Dashboard
    - _Requirements: 20.6_
  
  - [x] 40.5 Verificar tiempo de carga inicial
    - Medir tiempo de carga en conexión 4G
    - Optimizar si excede 2 segundos
    - _Requirements: 20.1_

- [ ]* 41. Testing y validación
  - [ ]* 41.1 Configurar framework de testing
    - Instalar Vitest, React Testing Library
    - Configurar archivos de setup
    - _Requirements: 20.1_
  
  - [ ]* 41.2 Escribir tests unitarios para servicios
    - Tests para authService, bookService, exerciseService, sessionService
    - Tests para LevelCalculationService, RecommendationEngine, PredictionEngine
    - _Requirements: 1.1, 3.1, 5.1, 6.1, 10.1, 13.1, 14.1_
  
  - [ ]* 41.3 Escribir tests de componentes críticos
    - Tests para Login, Register, PracticeTimer
    - Tests para Dashboard, LevelDisplay
    - _Requirements: 1.1, 6.1, 8.1, 10.1_
  
  - [ ]* 41.4 Escribir tests de integración
    - Test de flujo completo: registro → login → crear libro → crear ejercicio → registrar sesión
    - Test de cálculo de nivel después de sesiones
    - _Requirements: 1.1, 3.1, 5.1, 6.1, 10.1_
  
  - [ ]* 41.5 Realizar pruebas de accesibilidad
    - Usar herramientas como axe-core
    - Verificar navegación por teclado
    - Probar con lector de pantalla
    - _Requirements: 25.1, 25.2, 25.5_

- [x] 42. Deployment y configuración de producción
  - [x] 42.1 Configurar variables de entorno
    - Crear .env.production con variables de producción
    - Configurar DATABASE_URL, JWT_SECRET, S3 credentials
    - _Requirements: 19.4_
  
  - [x] 42.2 Configurar HTTPS
    - Obtener certificado SSL
    - Configurar servidor para usar HTTPS
    - _Requirements: 19.4_
  
  - [x] 42.3 Configurar CORS
    - Permitir solo dominios autorizados
    - Configurar headers apropiados
    - _Requirements: 19.4_
  
  - [x] 42.4 Configurar PostgreSQL en producción
    - Crear base de datos en servidor/servicio cloud
    - Ejecutar migraciones de Prisma
    - _Requirements: 1.1_
  
  - [x] 42.5 Configurar AWS S3 para almacenamiento
    - Crear bucket S3
    - Configurar políticas de acceso
    - Configurar credenciales en backend
    - _Requirements: 3.1, 3.6_
  
  - [x] 42.6 Build de producción
    - Ejecutar build del frontend (npm run build)
    - Ejecutar build del backend (tsc)
    - _Requirements: 20.1_
  
  - [x] 42.7 Configurar servidor de producción
    - Configurar Node.js server
    - Configurar reverse proxy (nginx)
    - Configurar PM2 o similar para gestión de procesos
    - _Requirements: 19.4_

- [x] 43. Documentación
  - [x] 43.1 Crear README.md
    - Descripción del proyecto
    - Instrucciones de instalación
    - Instrucciones de desarrollo
    - Instrucciones de deployment
    - _Requirements: 20.1_
  
  - [x] 43.2 Documentar API endpoints
    - Crear documentación de API (Swagger/OpenAPI opcional)
    - Documentar request/response de cada endpoint
    - _Requirements: 1.1_
  
  - [x] 43.3 Documentar variables de entorno
    - Listar todas las variables necesarias
    - Explicar propósito de cada una
    - _Requirements: 19.4_

- [ ] 44. Final checkpoint - Aplicación completa
  - Verificar que toda la funcionalidad esté implementada
  - Probar flujos completos de usuario end-to-end
  - Verificar PWA instalable en móvil y desktop
  - Verificar funcionalidad offline
  - Verificar rendimiento y tiempos de carga
  - Verificar seguridad y autenticación
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Las tareas marcadas con `*` son opcionales (testing) y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- La implementación sigue el orden: backend → frontend → PWA → optimización → deployment
- TypeScript se usa en todo el stack para type safety
- Material-UI proporciona componentes consistentes y accesibles
- Prisma simplifica las operaciones de base de datos
- Workbox facilita la implementación de PWA
