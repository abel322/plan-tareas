# 🚀 Project Management Platform

Plataforma inteligente de gestión de proyectos con metodologías científicas PERT y CPM.

## ✨ Características

- 📊 **Dashboard Analítico**: Visualización en tiempo real del estado de proyectos
- 🎯 **Objetivos SMART**: Sistema de definición de objetivos estructurados
- 📈 **Análisis PERT**: Cálculo de tiempos esperados con estimaciones probabilísticas
- 🔍 **Método CPM**: Identificación automática de rutas críticas
- 📅 **Diagramas de Gantt**: Cronogramas interactivos
- 🌐 **Diagramas PERT**: Visualización de redes de tareas
- 🎨 **Diseño Futurista**: Interfaz oscura con efectos de glow y animaciones
- 🔐 **Autenticación Segura**: Sistema de usuarios con roles

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Visualización**: Recharts, D3.js, React Flow
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: Auth.js (NextAuth v5)
- **Deploy**: Docker, compatible con Dokploy

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd project-management-platform
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_management"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. **Configurar la base de datos**
```bash
npm run db:push
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🗄️ Base de Datos

### Configurar PostgreSQL con Docker

```bash
docker run --name postgres-pm \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=project_management \
  -p 5432:5432 \
  -d postgres:15
```

### Comandos Prisma

```bash
# Generar cliente de Prisma
npm run db:generate

# Aplicar cambios al schema
npm run db:push

# Abrir Prisma Studio
npm run db:studio
```

## 📁 Estructura del Proyecto

```
project-management-platform/
├── app/                      # Next.js App Router
│   ├── (dashboard)/         # Rutas del dashboard
│   │   ├── dashboard/       # Página principal
│   │   └── layout.tsx       # Layout con sidebar
│   ├── api/                 # API Routes
│   ├── globals.css          # Estilos globales
│   └── layout.tsx           # Root layout
├── components/              # Componentes React
│   ├── ui/                  # Componentes base (shadcn)
│   ├── layout/              # Sidebar, Header
│   ├── charts/              # Gráficos y visualizaciones
│   └── diagrams/            # Diagramas PERT/CPM
├── lib/                     # Utilidades y lógica
│   ├── algorithms/          # PERT y CPM
│   ├── prisma.ts           # Cliente de Prisma
│   └── utils.ts            # Funciones auxiliares
├── prisma/                  # Schema y migraciones
│   └── schema.prisma       # Modelo de datos
└── types/                   # Tipos de TypeScript
```

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
--midnight: #0a0e1a          /* Fondo base */
--slate-deep: #0f1419        /* Superficie elevada */
--slate-mid: #1a1f2e         /* Superficie más elevada */
--graphite: #2a3142          /* Bordes */

--ink-primary: #e8edf4       /* Texto principal */
--ink-secondary: #a8b2c1     /* Texto secundario */
--ink-tertiary: #6b7280      /* Metadata */

--electric-cyan: #06b6d4     /* Accent principal */
--intelligence: #8b5cf6      /* IA y análisis */
--success: #10b981           /* Éxito */
--warning: #f59e0b           /* Advertencia */
--critical: #ef4444          /* Crítico */
```

### Signature: Critical Path Glow

Las tareas en la ruta crítica tienen un efecto de glow pulsante único:

```css
.critical-path-glow {
  animation: criticalPulse 2s ease-in-out infinite;
  border-color: rgb(139 92 246 / 0.6);
}
```

## 🧮 Algoritmos

### PERT (Program Evaluation Review Technique)

Calcula el tiempo esperado de una tarea:

```typescript
E = (O + 4M + P) / 6
```

Donde:
- O = Tiempo optimista
- M = Tiempo más probable
- P = Tiempo pesimista

### CPM (Critical Path Method)

Identifica la ruta crítica del proyecto:
- Calcula Early Start (ES) y Early Finish (EF)
- Calcula Late Start (LS) y Late Finish (LF)
- Identifica tareas con holgura = 0 (críticas)

## 🚢 Deploy con Docker

```bash
# Build
docker build -t project-management-platform .

# Run
docker-compose up -d
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run db:push      # Aplicar schema a DB
npm run db:studio    # Abrir Prisma Studio
npm run db:generate  # Generar cliente Prisma
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- Metodologías PERT y CPM
- shadcn/ui por los componentes base
- Vercel por Next.js
- Prisma por el ORM
