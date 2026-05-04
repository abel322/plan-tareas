# Design Document: Music Practice PWA

## Overview

La Music Practice PWA es una aplicación web progresiva diseñada para músicos que desean gestionar sus materiales de práctica, registrar sesiones, visualizar su progreso y recibir recomendaciones personalizadas. La aplicación soporta múltiples instrumentos (piano, bajo, batería, guitarra) y proporciona análisis predictivo basado en los patrones de práctica del usuario.

### Objetivos del Sistema

- Proporcionar una plataforma centralizada para gestionar materiales de práctica en formato PDF
- Facilitar el registro preciso de sesiones de práctica con temporizador integrado
- Ofrecer visualización intuitiva de estadísticas y progreso mediante dashboards y gráficos
- Calcular automáticamente el nivel del músico basado en métricas objetivas
- Generar recomendaciones personalizadas y predicciones de progreso
- Funcionar como PWA instalable con capacidades offline
- Garantizar seguridad y privacidad de los datos del usuario

### Stack Tecnológico

**Frontend:**
- React 18 con TypeScript
- Material-UI v5 (componentes y sistema de temas)
- React Router v6 (navegación)
- react-pdf (visualización de PDFs)
- recharts (gráficos y visualizaciones)
- Axios (cliente HTTP)
- Workbox (Service Worker para PWA)

**Backend:**
- Node.js 18+ con Express
- Prisma ORM (gestión de base de datos)
- PostgreSQL (base de datos relacional)
- JWT (autenticación)
- bcrypt (hashing de contraseñas)
- multer (subida de archivos)

**Almacenamiento:**
- AWS S3 (producción) o carpeta local uploads/ (desarrollo)

**Infraestructura:**
- PWA con Service Workers para funcionalidad offline
- HTTPS obligatorio en producción
- Rate limiting con express-rate-limit

## Architecture

### Arquitectura General

La aplicación sigue una arquitectura cliente-servidor con separación clara entre frontend y backend:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │  State Mgmt  │  │ Service Layer│      │
│  │  (Material-  │  │   (React     │  │   (Axios     │      │
│  │     UI)      │  │   Context)   │  │   clients)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │ Service Worker │                        │
│                    │  (Workbox)     │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTPS/REST API
┌────────────────────────────▼──────────────────────────────────┐
│                      Backend (Express)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Routes     │  │ Controllers  │  │   Services   │       │
│  │ (endpoints)  │  │  (business   │  │  (business   │       │
│  │              │  │    logic)    │  │    logic)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘               │
│                            │                                  │
│                    ┌───────▼────────┐                         │
│                    │  Prisma ORM    │                         │
│                    └───────┬────────┘                         │
└────────────────────────────┼───────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    └──────────────────┘
```

### Capas del Sistema

**1. Capa de Presentación (Frontend)**
- Componentes React con Material-UI para interfaz de usuario
- React Context para gestión de estado global (autenticación, tema)
- React Router para navegación entre vistas
- Service Worker para cacheo y funcionalidad offline

**2. Capa de API (Backend)**
- Express server con rutas RESTful
- Middleware de autenticación JWT
- Middleware de validación de datos
- Middleware de manejo de errores

**3. Capa de Lógica de Negocio**
- Servicios para cálculo de nivel
- Motor de recomendaciones
- Motor de predicciones
- Servicios de almacenamiento de archivos

**4. Capa de Datos**
- Prisma ORM para abstracción de base de datos
- PostgreSQL para persistencia
- Migraciones versionadas con Prisma Migrate

### Flujos Principales

**Flujo de Autenticación:**
1. Usuario envía credenciales → Backend valida → Genera JWT → Frontend almacena token
2. Cada petición incluye JWT en header Authorization
3. Backend valida JWT en middleware antes de procesar petición

**Flujo de Subida de PDF:**
1. Usuario selecciona archivo → Frontend valida tamaño/tipo → Envía multipart/form-data
2. Backend recibe con multer → Valida → Sube a S3/local → Crea registro en DB
3. Retorna URL del archivo → Frontend actualiza lista de libros

**Flujo de Sesión de Práctica:**
1. Usuario inicia temporizador → Frontend cuenta tiempo localmente
2. Usuario finaliza → Frontend envía duración + ejercicios → Backend guarda sesión
3. Backend recalcula nivel → Actualiza estadísticas → Retorna datos actualizados
4. Frontend actualiza dashboard y notifica cambios

## Components and Interfaces

### Frontend Components

**1. Layout Components**

```typescript
// AppLayout.tsx - Layout principal con navegación
interface AppLayoutProps {
  children: React.ReactNode;
}

// Sidebar.tsx - Navegación lateral (desktop) / Drawer (mobile)
interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

// Header.tsx - Barra superior con usuario y tema
interface HeaderProps {
  onMenuClick: () => void;
}
```

**2. Authentication Components**

```typescript
// Login.tsx
interface LoginFormData {
  email: string;
  password: string;
}

// Register.tsx
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  instruments: Instrument[];
}

// ForgotPassword.tsx
interface ForgotPasswordFormData {
  email: string;
}
```

**3. Book Management Components**

```typescript
// BookList.tsx - Lista de libros con búsqueda y filtros
interface BookListProps {
  searchQuery: string;
  instrumentFilter: Instrument | null;
}

// BookUpload.tsx - Formulario de subida de PDF
interface BookUploadFormData {
  name: string;
  instrument: Instrument;
  description: string;
  file: File;
}

// PDFViewer.tsx - Visualizador de PDF
interface PDFViewerProps {
  url: string;
  onPageChange?: (page: number) => void;
}

interface PDFViewerState {
  numPages: number;
  currentPage: number;
  scale: number;
}
```

**4. Exercise Management Components**

```typescript
// ExerciseList.tsx
interface ExerciseListProps {
  bookId: string;
  onExerciseSelect?: (exercise: Exercise) => void;
}

// ExerciseForm.tsx
interface ExerciseFormData {
  name: string;
  description: string;
  bookId: string;
  pages: string; // "1-5" o "10, 12, 15"
  difficulty: Difficulty;
  notes: string;
}
```

**5. Practice Session Components**

```typescript
// PracticeTimer.tsx - Temporizador de práctica
interface PracticeTimerProps {
  onComplete: (duration: number) => void;
}

interface PracticeTimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
}

// SessionForm.tsx - Registro manual de sesión
interface SessionFormData {
  date: Date;
  durationMinutes: number;
  exercises: { exerciseId: string; durationMinutes: number }[];
  notes: string;
}

// SessionList.tsx - Historial de sesiones
interface SessionListProps {
  dateRange?: { start: Date; end: Date };
  limit?: number;
}
```

**6. Dashboard Components**

```typescript
// Dashboard.tsx - Vista principal de estadísticas
interface DashboardProps {
  userId: string;
}

// StatsCard.tsx - Tarjeta de estadística individual
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
}

// PracticeChart.tsx - Gráfico de tiempo de práctica
interface PracticeChartProps {
  data: { date: string; minutes: number }[];
  dateRange: { start: Date; end: Date };
}

// InstrumentDistribution.tsx - Gráfico circular de instrumentos
interface InstrumentDistributionProps {
  data: { instrument: Instrument; minutes: number }[];
}
```

**7. Calendar Component**

```typescript
// PracticeCalendar.tsx
interface PracticeCalendarProps {
  sessions: Session[];
  onDateSelect: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  totalMinutes: number;
  sessionCount: number;
  color: 'green' | 'yellow' | 'gray' | 'none';
}
```

**8. Level & Progress Components**

```typescript
// LevelDisplay.tsx
interface LevelDisplayProps {
  currentLevel: Level;
  progress: LevelProgress;
}

interface LevelProgress {
  totalHours: number;
  consistency: number;
  exerciseVariety: number;
  nextLevel: Level;
  percentageToNext: number;
  missingRequirements: string[];
}

// LevelHistory.tsx
interface LevelHistoryProps {
  history: LevelChange[];
}

interface LevelChange {
  id: string;
  previousLevel: Level;
  newLevel: Level;
  achievedAt: Date;
  metrics: {
    totalHours: number;
    consistency: number;
    exerciseVariety: number;
  };
}
```

**9. Goals Components**

```typescript
// GoalForm.tsx
interface GoalFormData {
  type: 'daily' | 'weekly';
  targetMinutes: number;
  startDate: Date;
}

// GoalProgress.tsx
interface GoalProgressProps {
  goal: Goal;
  currentProgress: number;
}

// GoalHistory.tsx
interface GoalHistoryProps {
  goals: Goal[];
}
```

**10. Recommendations & Predictions Components**

```typescript
// RecommendationsList.tsx
interface RecommendationsListProps {
  recommendations: Recommendation[];
}

interface Recommendation {
  id: string;
  type: 'consistency' | 'variety' | 'duration' | 'exercise';
  priority: 'high' | 'medium' | 'low';
  message: string;
  actionable: boolean;
}

// PredictionDisplay.tsx
interface PredictionDisplayProps {
  prediction: LevelPrediction;
}

interface LevelPrediction {
  nextLevel: Level;
  estimatedDate: Date;
  scenarios: {
    name: string;
    dailyMinutes: number;
    estimatedDays: number;
  }[];
}
```

### Backend API Endpoints

**Authentication Endpoints**

```typescript
POST /api/auth/register
Body: { name: string, email: string, password: string, instruments: Instrument[] }
Response: { user: User, token: string }

POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, token: string }

POST /api/auth/forgot-password
Body: { email: string }
Response: { message: string }

POST /api/auth/reset-password
Body: { token: string, newPassword: string }
Response: { message: string }
```

**User Endpoints**

```typescript
GET /api/users/profile
Headers: { Authorization: "Bearer <token>" }
Response: { user: User }

PUT /api/users/profile
Headers: { Authorization: "Bearer <token>" }
Body: { name?: string, instruments?: Instrument[] }
Response: { user: User }

PUT /api/users/password
Headers: { Authorization: "Bearer <token>" }
Body: { currentPassword: string, newPassword: string }
Response: { message: string }

GET /api/users/stats
Headers: { Authorization: "Bearer <token>" }
Response: { totalMinutes: number, sessionCount: number, currentLevel: Level, streak: number }
```

**Book Endpoints**

```typescript
GET /api/books
Headers: { Authorization: "Bearer <token>" }
Query: { search?: string, instrument?: Instrument }
Response: { books: Book[] }

POST /api/books
Headers: { Authorization: "Bearer <token>", Content-Type: "multipart/form-data" }
Body: FormData { name: string, instrument: Instrument, description: string, file: File }
Response: { book: Book }

GET /api/books/:id
Headers: { Authorization: "Bearer <token>" }
Response: { book: Book }

PUT /api/books/:id
Headers: { Authorization: "Bearer <token>" }
Body: { name?: string, description?: string }
Response: { book: Book }

DELETE /api/books/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message: string }
```

**Exercise Endpoints**

```typescript
GET /api/exercises
Headers: { Authorization: "Bearer <token>" }
Query: { bookId?: string, difficulty?: Difficulty }
Response: { exercises: Exercise[] }

POST /api/exercises
Headers: { Authorization: "Bearer <token>" }
Body: { name: string, description: string, bookId: string, pages: string, difficulty: Difficulty, notes: string }
Response: { exercise: Exercise }

GET /api/exercises/:id
Headers: { Authorization: "Bearer <token>" }
Response: { exercise: Exercise }

PUT /api/exercises/:id
Headers: { Authorization: "Bearer <token>" }
Body: { name?: string, description?: string, pages?: string, difficulty?: Difficulty, notes?: string }
Response: { exercise: Exercise }

DELETE /api/exercises/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message: string }
```

**Session Endpoints**

```typescript
GET /api/sessions
Headers: { Authorization: "Bearer <token>" }
Query: { startDate?: string, endDate?: string, limit?: number, offset?: number }
Response: { sessions: Session[], total: number }

POST /api/sessions
Headers: { Authorization: "Bearer <token>" }
Body: { date: string, durationMinutes: number, exercises: { exerciseId: string, durationMinutes: number }[], notes: string }
Response: { session: Session, levelChanged: boolean, newLevel?: Level }

GET /api/sessions/:id
Headers: { Authorization: "Bearer <token>" }
Response: { session: Session }

PUT /api/sessions/:id
Headers: { Authorization: "Bearer <token>" }
Body: { durationMinutes?: number, exercises?: { exerciseId: string, durationMinutes: number }[], notes?: string }
Response: { session: Session }

DELETE /api/sessions/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message: string }
```

**Dashboard Endpoints**

```typescript
GET /api/dashboard/stats
Headers: { Authorization: "Bearer <token>" }
Query: { startDate?: string, endDate?: string }
Response: {
  totalMinutes: number,
  averageDaily: number,
  averageWeekly: number,
  streak: number,
  sessionCount: number
}

GET /api/dashboard/practice-chart
Headers: { Authorization: "Bearer <token>" }
Query: { days?: number } // default 30
Response: { data: { date: string, minutes: number }[] }

GET /api/dashboard/instrument-distribution
Headers: { Authorization: "Bearer <token>" }
Query: { startDate?: string, endDate?: string }
Response: { data: { instrument: Instrument, minutes: number, percentage: number }[] }

GET /api/dashboard/top-exercises
Headers: { Authorization: "Bearer <token>" }
Query: { limit?: number } // default 5
Response: { exercises: { exercise: Exercise, totalMinutes: number, sessionCount: number }[] }
```

**Level Endpoints**

```typescript
GET /api/levels/current
Headers: { Authorization: "Bearer <token>" }
Response: { level: Level, progress: LevelProgress }

GET /api/levels/history
Headers: { Authorization: "Bearer <token>" }
Response: { history: LevelChange[] }
```

**Goal Endpoints**

```typescript
GET /api/goals
Headers: { Authorization: "Bearer <token>" }
Query: { active?: boolean }
Response: { goals: Goal[] }

POST /api/goals
Headers: { Authorization: "Bearer <token>" }
Body: { type: 'daily' | 'weekly', targetMinutes: number, startDate: string }
Response: { goal: Goal }

GET /api/goals/:id
Headers: { Authorization: "Bearer <token>" }
Response: { goal: Goal, progress: number }

PUT /api/goals/:id
Headers: { Authorization: "Bearer <token>" }
Body: { targetMinutes?: number, active?: boolean }
Response: { goal: Goal }

DELETE /api/goals/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message: string }
```

**Recommendation Endpoints**

```typescript
GET /api/recommendations
Headers: { Authorization: "Bearer <token>" }
Response: { recommendations: Recommendation[] }
```

**Prediction Endpoints**

```typescript
GET /api/predictions/next-level
Headers: { Authorization: "Bearer <token>" }
Response: { prediction: LevelPrediction | null, insufficientData: boolean }
```

**Export Endpoints**

```typescript
GET /api/export/data
Headers: { Authorization: "Bearer <token>" }
Response: JSON file download

GET /api/export/stats
Headers: { Authorization: "Bearer <token>" }
Query: { format: 'csv' | 'json' }
Response: CSV or JSON file download
```

## Data Models

### Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Instrument {
  PIANO
  BASS
  DRUMS
  GUITAR
}

enum Difficulty {
  BASIC
  INTERMEDIATE
  ADVANCED
}

enum Level {
  BASIC
  INTERMEDIATE
  ADVANCED
}

enum GoalType {
  DAILY
  WEEKLY
}

model User {
  id            String      @id @default(uuid())
  name          String
  email         String      @unique
  password      String      // bcrypt hashed
  instruments   Instrument[]
  currentLevel  Level       @default(BASIC)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  books         Book[]
  sessions      Session[]
  goals         Goal[]
  levelHistory  LevelHistory[]
  
  @@index([email])
}

model Book {
  id            String      @id @default(uuid())
  name          String
  instrument    Instrument
  description   String      @default("")
  fileUrl       String      // S3 URL or local path
  fileKey       String      // S3 key for deletion
  userId        String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercises     Exercise[]
  
  @@index([userId])
  @@index([instrument])
}

model Exercise {
  id            String      @id @default(uuid())
  name          String
  description   String      @default("")
  bookId        String
  pages         String      // "1-5" or "10, 12, 15"
  difficulty    Difficulty
  notes         String      @default("")
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  book          Book        @relation(fields: [bookId], references: [id], onDelete: Cascade)
  sessionExercises SessionExercise[]
  
  @@index([bookId])
  @@index([difficulty])
}

model Session {
  id              String      @id @default(uuid())
  userId          String
  date            DateTime
  durationMinutes Int
  notes           String      @default("")
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercises       SessionExercise[]
  
  @@index([userId])
  @@index([date])
}

model SessionExercise {
  id              String      @id @default(uuid())
  sessionId       String
  exerciseId      String
  durationMinutes Int
  
  session         Session     @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  exercise        Exercise    @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
  
  @@unique([sessionId, exerciseId])
  @@index([sessionId])
  @@index([exerciseId])
}

model Goal {
  id              String      @id @default(uuid())
  userId          String
  type            GoalType
  targetMinutes   Int
  startDate       DateTime
  active          Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([active])
}

model LevelHistory {
  id              String      @id @default(uuid())
  userId          String
  previousLevel   Level
  newLevel        Level
  achievedAt      DateTime    @default(now())
  totalHours      Float
  consistency     Float       // percentage
  exerciseVariety Int
  
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([achievedAt])
}
```

### Data Model Relationships

```
User (1) ──────< (N) Book
User (1) ──────< (N) Session
User (1) ──────< (N) Goal
User (1) ──────< (N) LevelHistory

Book (1) ──────< (N) Exercise

Session (1) ──────< (N) SessionExercise
Exercise (1) ──────< (N) SessionExercise
```

### Business Logic Services

**LevelCalculationService**

```typescript
interface LevelMetrics {
  totalHours: number;
  consistency: number; // percentage of days with practice in last 30 days
  exerciseVariety: number; // count of unique exercises practiced
}

class LevelCalculationService {
  async calculateLevel(userId: string): Promise<Level> {
    const metrics = await this.getMetrics(userId);
    
    // BASIC: < 20 hours
    if (metrics.totalHours < 20) {
      return Level.BASIC;
    }
    
    // INTERMEDIATE: 20-100 hours AND consistency > 40%
    if (metrics.totalHours >= 20 && metrics.totalHours < 100 && metrics.consistency > 40) {
      return Level.INTERMEDIATE;
    }
    
    // ADVANCED: > 100 hours AND consistency > 60% AND variety >= 15
    if (metrics.totalHours >= 100 && metrics.consistency > 60 && metrics.exerciseVariety >= 15) {
      return Level.ADVANCED;
    }
    
    // Default to current level if requirements not met
    return await this.getCurrentLevel(userId);
  }
  
  async getProgressToNextLevel(userId: string): Promise<LevelProgress> {
    // Calculate what's needed to reach next level
  }
  
  private async getMetrics(userId: string): Promise<LevelMetrics> {
    // Query sessions and calculate metrics
  }
}
```

**RecommendationEngine**

```typescript
interface RecommendationContext {
  userId: string;
  last30DaysSessions: Session[];
  currentLevel: Level;
  exercises: Exercise[];
}

class RecommendationEngine {
  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    const context = await this.buildContext(userId);
    const recommendations: Recommendation[] = [];
    
    // Check consistency
    const consistency = this.calculateConsistency(context.last30DaysSessions);
    if (consistency < 50) {
      recommendations.push({
        type: 'consistency',
        priority: 'high',
        message: 'Tu consistencia es baja. Intenta establecer una meta diaria más alcanzable.',
        actionable: true
      });
    }
    
    // Check variety
    const uniqueExercises = this.getUniqueExercises(context.last30DaysSessions);
    if (uniqueExercises.length < 3) {
      recommendations.push({
        type: 'variety',
        priority: 'medium',
        message: 'Aumenta la variedad de ejercicios para un desarrollo más completo.',
        actionable: true
      });
    }
    
    // Check inactivity
    const daysSinceLastSession = this.getDaysSinceLastSession(context.last30DaysSessions);
    if (daysSinceLastSession >= 3) {
      recommendations.push({
        type: 'consistency',
        priority: 'high',
        message: '¡No has practicado en 3 días! Retoma tu rutina hoy.',
        actionable: true
      });
    }
    
    // Check session duration
    const avgDuration = this.getAverageDuration(context.last30DaysSessions);
    if (avgDuration < 30) {
      recommendations.push({
        type: 'duration',
        priority: 'medium',
        message: 'Tus sesiones promedio son cortas. Intenta practicar al menos 30 minutos.',
        actionable: true
      });
    }
    
    // Suggest unpracticed exercises
    const unpracticedExercises = this.getUnpracticedExercises(context);
    if (unpracticedExercises.length > 0) {
      recommendations.push({
        type: 'exercise',
        priority: 'low',
        message: `Tienes ${unpracticedExercises.length} ejercicios sin practicar recientemente.`,
        actionable: true
      });
    }
    
    return recommendations.slice(0, 5); // Return top 5
  }
}
```

**PredictionEngine**

```typescript
interface Scenario {
  name: string;
  dailyMinutes: number;
  estimatedDays: number;
}

class PredictionEngine {
  async predictNextLevel(userId: string): Promise<LevelPrediction | null> {
    const sessions = await this.getLast30DaysSessions(userId);
    
    if (sessions.length < 7) {
      return null; // Insufficient data
    }
    
    const currentLevel = await this.getCurrentLevel(userId);
    const currentMetrics = await this.getMetrics(userId);
    const nextLevel = this.getNextLevel(currentLevel);
    
    if (!nextLevel) {
      return null; // Already at max level
    }
    
    const requirements = this.getLevelRequirements(nextLevel);
    const avgDailyMinutes = this.getAverageDailyMinutes(sessions);
    
    // Calculate scenarios
    const scenarios: Scenario[] = [
      {
        name: 'Conservador (mantener ritmo actual)',
        dailyMinutes: avgDailyMinutes,
        estimatedDays: this.calculateDays(currentMetrics, requirements, avgDailyMinutes)
      },
      {
        name: 'Moderado (30 min diarios)',
        dailyMinutes: 30,
        estimatedDays: this.calculateDays(currentMetrics, requirements, 30)
      },
      {
        name: 'Ambicioso (60 min diarios)',
        dailyMinutes: 60,
        estimatedDays: this.calculateDays(currentMetrics, requirements, 60)
      }
    ];
    
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + scenarios[0].estimatedDays);
    
    return {
      nextLevel,
      estimatedDate,
      scenarios
    };
  }
  
  private calculateDays(current: LevelMetrics, required: LevelMetrics, dailyMinutes: number): number {
    // Calculate based on missing hours, consistency improvement, etc.
  }
}
```


**StorageService**

```typescript
interface UploadResult {
  url: string;
  key: string;
}

class StorageService {
  async uploadPDF(file: Buffer, filename: string, userId: string): Promise<UploadResult> {
    if (process.env.NODE_ENV === 'production') {
      return this.uploadToS3(file, filename, userId);
    } else {
      return this.uploadToLocal(file, filename, userId);
    }
  }
  
  async deletePDF(key: string): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      return this.deleteFromS3(key);
    } else {
      return this.deleteFromLocal(key);
    }
  }
  
  private async uploadToS3(file: Buffer, filename: string, userId: string): Promise<UploadResult> {
    // AWS S3 upload logic
    const key = `users/${userId}/books/${Date.now()}-${filename}`;
    // Upload to S3 bucket
    const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
    return { url, key };
  }
  
  private async uploadToLocal(file: Buffer, filename: string, userId: string): Promise<UploadResult> {
    const key = `users/${userId}/books/${Date.now()}-${filename}`;
    const filepath = path.join(process.cwd(), 'uploads', key);
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true });
    await fs.promises.writeFile(filepath, file);
    const url = `/uploads/${key}`;
    return { url, key };
  }
}
```

### Frontend State Management

**AuthContext**

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Usage: const { user, login, logout } = useAuth();
```

**ThemeContext**

```typescript
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

// Custom theme with blue-purple gradient
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#5E35B1', // Deep purple
      light: '#9162E4',
      dark: '#311B92',
    },
    secondary: {
      main: '#1E88E5', // Blue
      light: '#6AB7FF',
      dark: '#005CB2',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

**NotificationContext**

```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: Notification['type'], message: string, duration?: number) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);
```

### PWA Configuration

**manifest.json**

```json
{
  "name": "Music Practice PWA",
  "short_name": "MusicPractice",
  "description": "Gestiona tus sesiones de práctica musical",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#5E35B1",
  "theme_color": "#5E35B1",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker Strategy (Workbox)**

```typescript
// service-worker.ts

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache PDF files with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'document' && request.url.includes('.pdf'),
  new CacheFirst({
    cacheName: 'pdf-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache API responses with NetworkFirst strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache fonts and CSS with StaleWhileRevalidate
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
```

### Validation Schemas

**Zod Schemas (Backend)**

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  instruments: z.array(z.enum(['PIANO', 'BASS', 'DRUMS', 'GUITAR'])).min(1, 'Selecciona al menos un instrumento'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const bookSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  instrument: z.enum(['PIANO', 'BASS', 'DRUMS', 'GUITAR']),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  bookId: z.string().uuid('ID de libro inválido'),
  pages: z.string().min(1, 'Las páginas son requeridas'),
  difficulty: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED']),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});

export const sessionSchema = z.object({
  date: z.string().datetime('Fecha inválida'),
  durationMinutes: z.number().int().positive('La duración debe ser positiva'),
  exercises: z.array(z.object({
    exerciseId: z.string().uuid('ID de ejercicio inválido'),
    durationMinutes: z.number().int().positive('La duración debe ser positiva'),
  })),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});

export const goalSchema = z.object({
  type: z.enum(['DAILY', 'WEEKLY']),
  targetMinutes: z.number().int().positive('El objetivo debe ser positivo'),
  startDate: z.string().datetime('Fecha inválida'),
});
```

### Security Middleware

**JWT Authentication Middleware**

```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JWTPayload {
  userId: string;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
```

**Rate Limiting Middleware**

```typescript
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Demasiados intentos de login. Intenta de nuevo en 1 minuto.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Demasiadas peticiones. Intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Input Sanitization Middleware**

```typescript
import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      }
    });
  }
  next();
};
```

### Routing Structure

**Frontend Routes (React Router)**

```typescript
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'books', element: <BookList /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'books/upload', element: <BookUpload /> },
      { path: 'exercises', element: <ExerciseList /> },
      { path: 'exercises/new', element: <ExerciseForm /> },
      { path: 'exercises/:id/edit', element: <ExerciseForm /> },
      { path: 'practice', element: <PracticeTimer /> },
      { path: 'sessions', element: <SessionList /> },
      { path: 'sessions/new', element: <SessionForm /> },
      { path: 'calendar', element: <PracticeCalendar /> },
      { path: 'level', element: <LevelDisplay /> },
      { path: 'level/history', element: <LevelHistory /> },
      { path: 'goals', element: <GoalList /> },
      { path: 'goals/new', element: <GoalForm /> },
      { path: 'recommendations', element: <RecommendationsList /> },
      { path: 'predictions', element: <PredictionDisplay /> },
      { path: 'profile', element: <Profile /> },
      { path: 'export', element: <ExportData /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
```

**Backend Routes (Express)**

```typescript
import express from 'express';

const app = express();

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/books', authenticateToken, bookRoutes);
app.use('/api/exercises', authenticateToken, exerciseRoutes);
app.use('/api/sessions', authenticateToken, sessionRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/levels', authenticateToken, levelRoutes);
app.use('/api/goals', authenticateToken, goalRoutes);
app.use('/api/recommendations', authenticateToken, recommendationRoutes);
app.use('/api/predictions', authenticateToken, predictionRoutes);
app.use('/api/export', authenticateToken, exportRoutes);

// Static file serving for uploads (development)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// Error handling middleware
app.use(errorHandler);
```

