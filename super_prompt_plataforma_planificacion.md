# SUPER PROMPT

## Plataforma Inteligente de Gestión de Proyectos y Planificación Estratégica

Actúa como un **arquitecto de software senior, experto en gestión de
proyectos, inteligencia artificial aplicada a productividad y sistemas
de planificación empresarial**.

Diseña y desarrolla una **plataforma web avanzada de planificación
estratégica y gestión de proyectos**, que combine lo mejor de
herramientas como:

-   Notion
-   ClickUp
-   Monday.com
-   Asana

pero integrando **metodologías científicas de planificación** como:

-   SMART Goals
-   PERT (Program Evaluation Review Technique)
-   CPM (Critical Path Method)

El objetivo es crear una **plataforma inteligente que ayude a
planificar, ejecutar y optimizar proyectos complejos**, con
visualización avanzada, análisis predictivo y planificación estratégica.

------------------------------------------------------------------------

# Objetivo de la aplicación

La aplicación debe permitir a los usuarios:

-   Planificar proyectos complejos
-   Dividir objetivos en tareas estructuradas
-   Analizar dependencias
-   Calcular rutas críticas
-   Estimar tiempos con modelos probabilísticos
-   Visualizar planes mediante diagramas interactivos
-   Recibir sugerencias inteligentes para optimizar el proyecto

Debe ser una **herramienta profesional de planificación estratégica y
productividad**.

------------------------------------------------------------------------

# Arquitectura tecnológica

## Frontend

Framework principal:

-   Next.js

Librerías:

-   React
-   Tailwind CSS
-   shadcn/ui
-   Framer Motion

Visualización de datos:

-   Recharts
-   D3.js
-   React Flow

------------------------------------------------------------------------

## Backend

Servidor:

-   Node.js
-   Next.js API Routes

ORM:

-   Prisma

------------------------------------------------------------------------

## Base de datos

-   PostgreSQL

------------------------------------------------------------------------

## Autenticación

-   Auth.js

------------------------------------------------------------------------

## Infraestructura

Contenedores:

-   Docker

Deploy:

-   VPS
-   Compatible con Dokploy

------------------------------------------------------------------------

# Módulos principales del sistema

## 1. Gestión de proyectos

El sistema debe permitir:

-   Crear proyectos
-   Editar proyectos
-   Archivar proyectos
-   Gestionar múltiples proyectos simultáneamente

Cada proyecto incluye:

-   nombre
-   descripción
-   objetivo estratégico
-   prioridad
-   estado
-   fecha inicio
-   fecha límite
-   progreso

------------------------------------------------------------------------

# 2. Sistema de objetivos SMART

El sistema debe ayudar al usuario a definir objetivos que cumplan con la
metodología SMART:

-   Specific
-   Measurable
-   Achievable
-   Relevant
-   Time-bound

El sistema debe guiar al usuario con preguntas inteligentes.

Ejemplo:

Objetivo: Lanzar una aplicación móvil.

SMART generado:

Specific → desarrollar app funcional\
Measurable → 12 funcionalidades completadas\
Achievable → equipo de 3 desarrolladores\
Relevant → aumentar ingresos\
Time-bound → 120 días

El sistema debe validar automáticamente si el objetivo cumple SMART.

------------------------------------------------------------------------

# 3. Sistema avanzado de tareas

Cada proyecto puede dividirse en tareas.

Cada tarea incluye:

-   nombre
-   descripción
-   responsable
-   prioridad
-   estado
-   fecha inicio
-   fecha fin
-   duración estimada
-   dependencias
-   etiquetas

------------------------------------------------------------------------

# 4. Sistema de dependencias de tareas

Las tareas pueden depender de otras.

Tipos de dependencias:

-   Finish to Start
-   Start to Start
-   Finish to Finish
-   Start to Finish

El sistema debe generar automáticamente **redes de tareas**.

------------------------------------------------------------------------

# 5. Sistema PERT

Cada tarea debe incluir tres estimaciones:

-   Optimista (O)
-   Más probable (M)
-   Pesimista (P)

El sistema debe calcular:

Tiempo esperado:

E = (O + 4M + P) / 6

También calcular:

-   varianza
-   desviación estándar
-   probabilidad de finalización

------------------------------------------------------------------------

# 6. Método CPM (Critical Path)

El sistema debe:

-   Analizar todas las tareas
-   Calcular automáticamente:
    -   ruta crítica
    -   duración total del proyecto
    -   tareas críticas

Las tareas críticas deben resaltarse visualmente.

------------------------------------------------------------------------

# 7. Visualizaciones avanzadas

La aplicación debe generar:

## Diagrama de Gantt

Cronograma del proyecto.

## Diagrama PERT

Red de tareas con nodos.

## Diagrama de ruta crítica

Identificación visual de tareas críticas.

## Dashboard analítico

Gráficos de:

-   progreso del proyecto
-   carga de trabajo
-   tiempo estimado vs real
-   eficiencia del equipo

------------------------------------------------------------------------

# 8. Inteligencia de planificación

El sistema debe incluir funciones inteligentes como:

Detección automática de:

-   cuellos de botella
-   tareas críticas
-   sobrecarga de trabajo

Sugerencias automáticas:

-   redistribución de tareas
-   paralelización de procesos
-   optimización de calendario

------------------------------------------------------------------------

# 9. Dashboard principal

El dashboard debe mostrar:

-   proyectos activos
-   progreso global
-   alertas de retraso
-   próximas tareas críticas

Gráficos:

-   productividad
-   cumplimiento de objetivos
-   rendimiento de proyectos

------------------------------------------------------------------------

# 10. Sistema de predicción

El sistema debe analizar:

-   historial de tareas
-   tiempos reales
-   rendimiento del proyecto

Para predecir:

-   probabilidad de retraso
-   fecha estimada de finalización

------------------------------------------------------------------------

# 11. Base de datos

Tablas principales:

-   Users
-   Projects
-   Objectives
-   Tasks
-   Dependencies
-   PERT_Estimations
-   Activity_Log

------------------------------------------------------------------------

# 12. Interfaz de usuario

Diseño:

-   moderno
-   minimalista
-   profesional
-   elegante

Modo:

-   claro
-   oscuro

Componentes:

-   paneles analíticos
-   tarjetas inteligentes
-   drag and drop de tareas
-   diagramas interactivos

Animaciones con Framer Motion.

------------------------------------------------------------------------

# 13. Estructura del proyecto

/app\
/dashboard\
/projects\
/tasks\
/analytics

/components\
/ui\
/charts\
/diagrams

/lib\
/prisma\
/utils

/api

------------------------------------------------------------------------

# 14. Seguridad

-   autenticación segura
-   protección de API
-   roles de usuario

------------------------------------------------------------------------

# 15. Resultado esperado

El sistema debe generar:

-   aplicación full stack
-   frontend moderno
-   backend escalable
-   base de datos
-   lógica PERT
-   lógica CPM
-   dashboard analítico
-   diagramas interactivos
-   sistema SMART

La aplicación debe quedar **lista para producción y escalable**.
