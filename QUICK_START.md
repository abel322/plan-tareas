# ⚡ Quick Start Guide

## 🚀 Inicio Rápido (5 minutos)

```bash
# 1. Instalar todo
npm install

# 2. Iniciar base de datos
docker-compose up -d postgres

# 3. Configurar DB
npm run db:push

# 4. Cargar datos de ejemplo
npm run db:seed

# 5. Iniciar aplicación
npm run dev
```

**¡Listo!** Abre http://localhost:3000

## 🔑 Login Demo

```
Email: demo@projectflow.com
Password: password123
```

## 📋 Comandos Útiles

### Desarrollo
```bash
npm run dev          # Servidor desarrollo (http://localhost:3000)
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # Linter
```

### Base de Datos
```bash
npm run db:push      # Aplicar schema a DB
npm run db:studio    # Abrir Prisma Studio (http://localhost:5555)
npm run db:generate  # Generar cliente Prisma
npm run db:seed      # Poblar con datos de ejemplo
```

### Docker
```bash
docker-compose up -d              # Iniciar servicios
docker-compose down               # Detener servicios
docker-compose down -v            # Detener y eliminar volúmenes
docker-compose logs postgres      # Ver logs de PostgreSQL
docker-compose ps                 # Ver estado de servicios
```

## 🗺️ Rutas Principales

- `/` - Landing page
- `/dashboard` - Dashboard principal
- `/dashboard/projects` - Lista de proyectos
- `/dashboard/projects/[id]` - Detalle de proyecto
- `/dashboard/analysis` - Calculadoras PERT/CPM
- `/dashboard/tasks` - Lista de tareas (pendiente)
- `/dashboard/analytics` - Analytics (pendiente)

## 🔧 Estructura de Archivos

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Rutas del dashboard
│   ├── api/               # API Routes
│   └── page.tsx           # Landing page
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── layout/           # Layout components
│   ├── projects/         # Componentes de proyectos
│   └── tasks/            # Componentes de tareas
├── lib/                   # Utilidades
│   ├── algorithms/       # PERT y CPM
│   └── validations/      # Schemas Zod
├── prisma/               # Prisma ORM
│   ├── schema.prisma    # Modelo de datos
│   └── seed.ts          # Datos de ejemplo
└── types/                # TypeScript types
```

## 🎯 Flujo de Trabajo Típico

### 1. Crear un Proyecto
1. Ir a `/dashboard/projects`
2. Click en "Nuevo Proyecto"
3. Llenar formulario
4. Ver proyecto creado

### 2. Agregar Tareas
1. Abrir proyecto
2. Click en "Nueva Tarea"
3. Definir detalles
4. Tarea aparece en lista

### 3. Calcular PERT
1. Ir a `/dashboard/analysis`
2. Ingresar tiempos (O, M, P)
3. Click "Calcular PERT"
4. Ver resultados

### 4. Calcular CPM
1. Tener proyecto con tareas y dependencias
2. Ir a análisis CPM
3. Seleccionar proyecto
4. Ver ruta crítica

## 🐛 Troubleshooting Rápido

### Puerto 3000 ocupado
```bash
# Cambiar puerto
PORT=3001 npm run dev
```

### Error de conexión a DB
```bash
# Reiniciar PostgreSQL
docker-compose restart postgres

# Verificar que esté corriendo
docker-compose ps
```

### Limpiar y reiniciar
```bash
# Limpiar todo
docker-compose down -v
rm -rf node_modules .next

# Reinstalar
npm install
docker-compose up -d postgres
npm run db:push
npm run db:seed
npm run dev
```

### Ver logs de errores
```bash
# Logs de Docker
docker-compose logs -f postgres

# Logs de Next.js
# Se muestran en la terminal donde corre npm run dev
```

## 📊 Datos de Ejemplo

El seed crea:
- 1 usuario (demo@projectflow.com)
- 2 proyectos
- 10 tareas
- 3 dependencias
- 2 estimaciones PERT
- 1 objetivo SMART

## 🔄 Resetear Base de Datos

```bash
# Opción 1: Forzar reset
npm run db:push -- --force-reset
npm run db:seed

# Opción 2: Eliminar volumen Docker
docker-compose down -v
docker-compose up -d postgres
npm run db:push
npm run db:seed
```

## 🎨 Personalizar Diseño

Los colores están en `tailwind.config.ts`:

```typescript
colors: {
  midnight: "#0a0e1a",
  "electric-cyan": "#06b6d4",
  intelligence: "#8b5cf6",
  // ... más colores
}
```

## 📝 Próximos Pasos

1. ✅ Explorar dashboard
2. ✅ Crear tu primer proyecto
3. ✅ Agregar tareas
4. ✅ Probar calculadora PERT
5. 🔲 Implementar autenticación
6. 🔲 Agregar visualizaciones
7. 🔲 Deploy a producción

## 🆘 Ayuda

- Documentación: Ver `README.md`
- Instalación detallada: Ver `INSTALLATION.md`
- Resumen técnico: Ver `IMPLEMENTATION_SUMMARY.md`
- Roadmap: Ver `NEXT_STEPS.md`

## 🎓 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Metodología PERT](https://en.wikipedia.org/wiki/Program_evaluation_and_review_technique)
- [Método CPM](https://en.wikipedia.org/wiki/Critical_path_method)

---

**¿Listo para empezar?** 🚀

```bash
npm install && docker-compose up -d && npm run db:push && npm run db:seed && npm run dev
```
