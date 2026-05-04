# 📖 Guía de Usuario - ProjectFlow

## Bienvenido a ProjectFlow

ProjectFlow es una plataforma inteligente de gestión de proyectos que combina herramientas modernas con metodologías científicas de planificación (PERT y CPM) para ayudarte a planificar, ejecutar y optimizar proyectos complejos.

---

## 🚀 Primeros Pasos

### 1. Acceder a la Aplicación

1. Abre tu navegador y ve a: `http://localhost:3000`
2. Verás la página de inicio con información sobre la plataforma
3. Haz clic en **"Ir al Dashboard"** para acceder

### 2. Credenciales de Acceso (Demo)

```
Email: demo@projectflow.com
Password: password123
```

---

## 🏠 Dashboard Principal

Al entrar, verás el **Dashboard** con una vista general de tus proyectos:

### Métricas Principales

- **Proyectos Activos**: Número total de proyectos en curso
- **Tareas Completadas**: Progreso de tareas finalizadas
- **Tareas Pendientes**: Tareas que requieren atención
- **Ruta Crítica**: Tareas críticas en progreso

### Secciones del Dashboard

1. **Proyectos Recientes**: Lista de tus últimos proyectos con barras de progreso
2. **Tareas Críticas**: Tareas en la ruta crítica que requieren atención inmediata (con efecto glow púrpura)

---

## 📁 Gestión de Proyectos

### Ver Todos los Proyectos

1. Haz clic en **"Proyectos"** en el menú lateral
2. Verás una cuadrícula con todos tus proyectos
3. Cada tarjeta muestra:
   - Nombre y descripción del proyecto
   - Badges de prioridad y estado
   - Barra de progreso
   - Número de tareas (completadas/total)
   - Fecha límite y tamaño del equipo

### Crear un Nuevo Proyecto

1. En la página de Proyectos, haz clic en **"Nuevo Proyecto"**
2. Completa el formulario:
   - **Nombre**: Título del proyecto (requerido)
   - **Descripción**: Breve descripción del proyecto
   - **Objetivo Estratégico**: ¿Qué buscas lograr?
   - **Prioridad**: Baja, Media, Alta o Crítica
   - **Estado**: Planificación, En Progreso, En Pausa, Completado
   - **Fechas**: Fecha de inicio y fin estimada
3. Haz clic en **"Crear Proyecto"**
4. Serás redirigido al detalle del proyecto

### Ver Detalle de un Proyecto

1. Haz clic en cualquier tarjeta de proyecto
2. Verás:
   - **Header**: Nombre, badges de prioridad/estado, botón para crear tareas
   - **Métricas**: Progreso total, tareas completadas, pendientes y críticas
   - **Lista de Tareas**: Todas las tareas del proyecto con checkboxes
   - **Sidebar**: Información del proyecto y Objetivo SMART

### Objetivo SMART

Cada proyecto puede tener un objetivo SMART que define:
- **Específico**: ¿Qué se va a lograr?
- **Medible**: ¿Cómo se medirá el éxito?
- **Alcanzable**: ¿Es realista con los recursos disponibles?
- **Relevante**: ¿Por qué es importante?
- **Temporal**: ¿Cuándo se completará?

---

## ✅ Gestión de Tareas

### Ver Todas las Tareas

1. Haz clic en **"Tareas"** en el menú lateral
2. Verás todas las tareas de todos los proyectos
3. Métricas superiores muestran:
   - Total de tareas
   - Completadas
   - En progreso
   - Por hacer
   - Críticas

### Filtrar Tareas

Usa los filtros en la parte superior:

1. **Buscar**: Escribe palabras clave para buscar tareas
2. **Estado**: Filtra por:
   - Todos
   - Por Hacer
   - En Progreso
   - En Revisión
   - Completadas
   - Bloqueadas
3. **Prioridad**: Filtra por:
   - Todas
   - Baja
   - Media
   - Alta
   - Crítica

### Crear una Nueva Tarea

1. Abre un proyecto específico
2. Haz clic en **"Nueva Tarea"**
3. Completa el formulario:
   - **Nombre**: Título de la tarea (requerido)
   - **Descripción**: Detalles de la tarea
   - **Prioridad**: Baja, Media, Alta o Crítica
   - **Estado**: Por Hacer, En Progreso, En Revisión, Completada, Bloqueada
   - **Duración Estimada**: Tiempo en días
   - **Fechas**: Inicio y fin estimados
4. Haz clic en **"Crear Tarea"**

### Identificar Tareas Críticas

Las tareas críticas (en la ruta crítica del proyecto) tienen:
- Un **efecto glow púrpura** pulsante en el borde
- Badge **"Crítica"** de color púrpura
- Son las tareas que NO pueden retrasarse sin afectar la fecha de entrega del proyecto

---

## 🧮 Análisis PERT/CPM

### ¿Qué es PERT?

**PERT** (Program Evaluation Review Technique) es una metodología que calcula el tiempo esperado de una tarea usando tres estimaciones:

- **Optimista (O)**: Mejor escenario posible
- **Más Probable (M)**: Escenario más realista
- **Pesimista (P)**: Peor escenario posible

**Fórmula**: `E = (O + 4M + P) / 6`

### Usar la Calculadora PERT

1. Ve a **"Análisis PERT/CPM"** en el menú
2. En la sección **"Calculadora PERT"**:
   - Ingresa el **Tiempo Optimista** (ej: 3 días)
   - Ingresa el **Tiempo Más Probable** (ej: 5 días)
   - Ingresa el **Tiempo Pesimista** (ej: 9 días)
3. Haz clic en **"Calcular PERT"**
4. Verás los resultados:
   - **Tiempo Esperado (E)**: Duración estimada
   - **Varianza (V)**: Medida de incertidumbre
   - **Desviación Estándar (σ)**: Dispersión de los tiempos

### Ejemplo Práctico PERT

**Escenario**: Implementar sistema de pagos

```
Optimista: 7 días (todo sale perfecto)
Más Probable: 10 días (escenario normal)
Pesimista: 15 días (surgen problemas)

Resultado:
Tiempo Esperado = (7 + 4×10 + 15) / 6 = 10.33 días
```

### ¿Qué es CPM?

**CPM** (Critical Path Method) identifica la **ruta crítica** del proyecto:

- Secuencia de tareas que determina la duración mínima del proyecto
- Tareas sin holgura (no pueden retrasarse)
- Cualquier retraso en estas tareas retrasa todo el proyecto

### Usar el Análisis CPM

1. En la sección **"Análisis CPM"**
2. Selecciona un proyecto con tareas y dependencias
3. Haz clic en **"Calcular Ruta Crítica"**
4. Verás:
   - **Duración Total**: Tiempo mínimo del proyecto
   - **Tareas Críticas**: Número de tareas en la ruta crítica
   - **Ruta Crítica**: Lista ordenada de tareas críticas

### Interpretar Resultados CPM

- **Tareas Críticas**: Prioriza estas tareas, no pueden retrasarse
- **Duración Total**: Fecha más temprana de finalización
- **Optimización**: Paraleliza tareas no críticas para ganar tiempo

---

## 📊 Analytics

### Ver Métricas de Rendimiento

1. Ve a **"Analytics"** en el menú
2. Verás KPIs principales:
   - **Tasa de Completitud**: % de tareas completadas
   - **Eficiencia**: Rendimiento del equipo
   - **Tiempo Promedio**: Duración promedio de tareas
   - **Objetivos Cumplidos**: Progreso de objetivos

### Rendimiento por Proyecto

Analiza cada proyecto individualmente:
- **En tiempo**: Proyecto avanza según lo planificado (verde)
- **En riesgo**: Posible retraso (amarillo)
- **Retrasado**: Requiere atención inmediata (rojo)

### Rendimiento del Equipo

Métricas del equipo:
- Tareas completadas este mes
- Tareas activas en progreso
- Miembros activos del equipo
- Tareas bloqueadas que requieren atención

### Insights y Recomendaciones

La plataforma genera automáticamente:
- ✅ **Insights positivos**: Áreas donde el equipo destaca
- ⚠️ **Alertas**: Proyectos que requieren atención
- 💡 **Sugerencias**: Optimizaciones para mejorar eficiencia

---

## ⚙️ Configuración

### Perfil de Usuario

1. Ve a **"Configuración"** en el menú
2. En la sección **"Perfil de Usuario"**:
   - Cambia tu foto de perfil
   - Actualiza tu nombre
   - Verifica tu email
   - Consulta tu rol (Usuario, Manager, Admin)

### Notificaciones

Configura cómo recibir notificaciones:
- ✉️ **Notificaciones por Email**: Actualizaciones por correo
- 📋 **Tareas Asignadas**: Cuando te asignen una tarea
- 🚨 **Tareas Críticas**: Alertas de ruta crítica
- 📈 **Resumen Semanal**: Reporte de progreso semanal

### Apariencia

Personaliza la interfaz:
- **Tema**: Oscuro, Claro o Automático
- **Idioma**: Español, English, Português
- **Formato de Fecha**: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD

---

## 🎯 Flujos de Trabajo Recomendados

### Flujo 1: Crear un Proyecto Nuevo

```
1. Dashboard → Proyectos → Nuevo Proyecto
2. Completar información del proyecto
3. Definir Objetivo SMART
4. Crear tareas principales
5. Establecer dependencias entre tareas
6. Calcular ruta crítica (CPM)
7. Monitorear progreso en Dashboard
```

### Flujo 2: Planificar una Tarea Compleja

```
1. Identificar la tarea
2. Ir a Análisis PERT/CPM
3. Estimar tiempos (Optimista, Probable, Pesimista)
4. Calcular PERT para obtener tiempo esperado
5. Crear tarea con duración calculada
6. Asignar responsable
7. Monitorear en sección Tareas
```

### Flujo 3: Optimizar un Proyecto Retrasado

```
1. Ir a Analytics
2. Identificar proyecto en riesgo
3. Abrir detalle del proyecto
4. Calcular ruta crítica (CPM)
5. Identificar tareas críticas
6. Priorizar recursos en tareas críticas
7. Buscar tareas no críticas para paralelizar
8. Reasignar equipo según necesidad
```

### Flujo 4: Revisión Semanal

```
1. Abrir Dashboard
2. Revisar métricas principales
3. Ir a Analytics para ver tendencias
4. Revisar Tareas Críticas
5. Verificar proyectos en riesgo
6. Ajustar prioridades según insights
7. Comunicar cambios al equipo
```

---

## 💡 Consejos y Mejores Prácticas

### Para Proyectos

✅ **Sí hacer:**
- Define objetivos SMART claros desde el inicio
- Actualiza el progreso regularmente
- Revisa la ruta crítica semanalmente
- Mantén las fechas realistas

❌ **No hacer:**
- No crees proyectos sin objetivo claro
- No ignores las tareas críticas
- No sobrecargues un solo proyecto con demasiadas tareas
- No olvides actualizar el estado

### Para Tareas

✅ **Sí hacer:**
- Usa descripciones claras y específicas
- Establece duraciones realistas con PERT
- Marca dependencias entre tareas
- Asigna responsables a cada tarea

❌ **No hacer:**
- No crees tareas demasiado grandes (divídelas)
- No ignores las estimaciones de tiempo
- No dejes tareas sin asignar
- No olvides actualizar el estado

### Para Análisis

✅ **Sí hacer:**
- Calcula PERT para tareas inciertas
- Recalcula CPM cuando cambien dependencias
- Revisa Analytics semanalmente
- Actúa sobre los insights generados

❌ **No hacer:**
- No ignores las alertas de riesgo
- No asumas que todo está bien sin verificar
- No tomes decisiones sin datos
- No olvides documentar cambios importantes

---

## 🔍 Glosario de Términos

### Términos de Proyectos

- **Proyecto**: Conjunto de tareas con un objetivo común
- **Objetivo SMART**: Objetivo específico, medible, alcanzable, relevante y temporal
- **Progreso**: Porcentaje de completitud del proyecto
- **Prioridad**: Importancia relativa (Baja, Media, Alta, Crítica)
- **Estado**: Fase actual (Planificación, En Progreso, En Pausa, Completado, Archivado)

### Términos de Tareas

- **Tarea**: Unidad de trabajo dentro de un proyecto
- **Dependencia**: Relación entre tareas (una debe completarse antes que otra)
- **Duración Estimada**: Tiempo esperado para completar la tarea
- **Tarea Crítica**: Tarea en la ruta crítica que no puede retrasarse
- **Holgura**: Tiempo que una tarea puede retrasarse sin afectar el proyecto

### Términos PERT

- **Tiempo Optimista (O)**: Mejor escenario posible
- **Tiempo Más Probable (M)**: Escenario más realista
- **Tiempo Pesimista (P)**: Peor escenario posible
- **Tiempo Esperado (E)**: Promedio ponderado de los tres tiempos
- **Varianza**: Medida de incertidumbre en la estimación
- **Desviación Estándar**: Dispersión de los tiempos posibles

### Términos CPM

- **Ruta Crítica**: Secuencia de tareas que determina la duración del proyecto
- **Early Start (ES)**: Inicio más temprano posible de una tarea
- **Early Finish (EF)**: Fin más temprano posible de una tarea
- **Late Start (LS)**: Inicio más tardío sin retrasar el proyecto
- **Late Finish (LF)**: Fin más tardío sin retrasar el proyecto
- **Holgura (Slack)**: Diferencia entre LS y ES (o LF y EF)

---

## 🎨 Elementos Visuales Únicos

### Critical Path Glow

Las tareas en la ruta crítica tienen un **efecto visual único**:
- Borde con glow púrpura pulsante
- Animación suave que llama la atención
- Badge "Crítica" de color púrpura
- Indica que la tarea NO puede retrasarse

### Código de Colores

- 🔵 **Cyan Eléctrico**: Acciones principales, progreso normal
- 🟣 **Púrpura (Intelligence)**: Tareas críticas, análisis IA
- 🟢 **Verde**: Éxito, completado, en tiempo
- 🟡 **Amarillo**: Advertencia, en riesgo, atención
- 🔴 **Rojo**: Crítico, retrasado, error

### Badges de Prioridad

- **Baja**: Gris (puede esperar)
- **Media**: Amarillo (importante)
- **Alta**: Rojo (urgente)
- **Crítica**: Púrpura (máxima prioridad)

---

## 🆘 Solución de Problemas

### No veo mis proyectos

1. Verifica que estés en la sección correcta (Proyectos)
2. Revisa los filtros aplicados
3. Asegúrate de haber creado al menos un proyecto
4. Recarga la página (F5)

### Las tareas críticas no se muestran

1. Primero debes calcular la ruta crítica (CPM)
2. Ve a Análisis PERT/CPM
3. Selecciona el proyecto
4. Haz clic en "Calcular Ruta Crítica"
5. Las tareas críticas se marcarán automáticamente

### Los cálculos PERT no funcionan

1. Verifica que los valores cumplan: O ≤ M ≤ P
2. Asegúrate de ingresar números positivos
3. Usa punto (.) para decimales, no coma (,)
4. Ejemplo válido: O=3, M=5, P=9

### La aplicación está lenta

1. Cierra pestañas innecesarias del navegador
2. Limpia la caché del navegador
3. Verifica tu conexión a internet
4. Reinicia el servidor de desarrollo

---

## 📞 Soporte y Recursos

### Documentación Adicional

- `README.md` - Información general del proyecto
- `INSTALLATION.md` - Guía de instalación detallada
- `QUICK_START.md` - Inicio rápido en 5 minutos
- `IMPLEMENTATION_SUMMARY.md` - Detalles técnicos

### Recursos de Aprendizaje

- [Metodología PERT](https://en.wikipedia.org/wiki/Program_evaluation_and_review_technique)
- [Método CPM](https://en.wikipedia.org/wiki/Critical_path_method)
- [Objetivos SMART](https://es.wikipedia.org/wiki/SMART_(objetivos))

### Atajos de Teclado

- `Ctrl + K` - Búsqueda rápida (próximamente)
- `Ctrl + N` - Nuevo proyecto (próximamente)
- `Ctrl + T` - Nueva tarea (próximamente)

---

## 🎓 Tutorial Paso a Paso

### Ejemplo Completo: Proyecto E-commerce

#### Paso 1: Crear el Proyecto

1. Ve a Proyectos → Nuevo Proyecto
2. Completa:
   ```
   Nombre: Tienda Online de Ropa
   Descripción: Plataforma e-commerce con carrito y pagos
   Objetivo: Lanzar tienda funcional en 3 meses
   Prioridad: Alta
   Estado: Planificación
   Fecha Inicio: Hoy
   Fecha Fin: +90 días
   ```
3. Crear Proyecto

#### Paso 2: Definir Objetivo SMART

```
Específico: Desarrollar tienda online con 50 productos
Medible: 100 ventas en el primer mes
Alcanzable: Equipo de 4 desarrolladores
Relevante: Expandir negocio al canal digital
Temporal: 90 días desde hoy
```

#### Paso 3: Crear Tareas Principales

1. **Diseño UI/UX**
   - Duración: 10 días
   - Prioridad: Alta
   - Estado: Por Hacer

2. **Desarrollo Frontend**
   - Duración: 20 días
   - Prioridad: Alta
   - Dependencia: Diseño UI/UX

3. **Desarrollo Backend**
   - Duración: 25 días
   - Prioridad: Crítica
   - Dependencia: Diseño UI/UX

4. **Integración de Pagos**
   - Duración: 8 días
   - Prioridad: Crítica
   - Dependencia: Backend

5. **Testing**
   - Duración: 10 días
   - Prioridad: Alta
   - Dependencia: Frontend, Backend, Pagos

#### Paso 4: Calcular Ruta Crítica

1. Ve a Análisis PERT/CPM
2. Selecciona "Tienda Online de Ropa"
3. Calcular CPM
4. Resultado: Diseño → Backend → Pagos → Testing (63 días)

#### Paso 5: Monitorear y Ajustar

1. Revisa Dashboard diariamente
2. Actualiza progreso de tareas
3. Verifica Analytics semanalmente
4. Ajusta recursos según necesidad

---

## ✨ Funcionalidades Avanzadas (Próximamente)

- 📊 Diagramas de Gantt interactivos
- 🌐 Diagramas PERT visuales
- 🤖 Sugerencias de IA para optimización
- 📱 Notificaciones en tiempo real
- 📄 Exportar reportes PDF
- 👥 Colaboración en tiempo real
- 📈 Análisis predictivo con ML
- 🔗 Integraciones con otras herramientas

---

**¿Necesitas ayuda?** Consulta la documentación técnica o contacta al equipo de soporte.

**¡Feliz planificación! 🚀**
