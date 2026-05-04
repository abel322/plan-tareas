# Requirements Document

## Introduction

Esta especificación define los requisitos para una aplicación web progresiva (PWA) diseñada para músicos que desean gestionar sus materiales de práctica, registrar sesiones, visualizar su progreso y recibir recomendaciones personalizadas. La aplicación soporta múltiples instrumentos (piano, bajo, batería, guitarra) y proporciona análisis predictivo basado en los patrones de práctica del usuario.

## Glossary

- **System**: La aplicación web progresiva completa de práctica musical
- **User**: Músico registrado que utiliza la aplicación
- **Book**: Documento PDF que contiene material de práctica musical
- **Exercise**: Unidad específica de práctica asociada a un libro (ej: escala, técnica, pieza)
- **Session**: Período de tiempo dedicado a la práctica musical
- **Practice_Timer**: Componente que mide la duración de una sesión de práctica
- **Dashboard**: Interfaz principal que muestra estadísticas y progreso del usuario
- **Level**: Clasificación del usuario (básico, intermedio, avanzado) basada en métricas de práctica
- **Goal**: Meta establecida por el usuario para práctica diaria o semanal
- **Recommendation_Engine**: Componente que genera sugerencias personalizadas
- **Prediction_Engine**: Componente que calcula proyecciones de progreso
- **PDF_Viewer**: Componente que renderiza documentos PDF en la interfaz
- **Auth_Service**: Servicio de autenticación y autorización
- **Storage_Service**: Servicio de almacenamiento de archivos PDF
- **Theme_Manager**: Componente que gestiona modo claro/oscuro

## Requirements

### Requirement 1: Autenticación de Usuarios

**User Story:** Como músico, quiero registrarme y acceder de forma segura a mi cuenta, para que pueda mantener mi información de práctica privada y accesible desde cualquier dispositivo.

#### Acceptance Criteria

1. WHEN un usuario proporciona email y contraseña válidos, THE Auth_Service SHALL crear una cuenta nueva
2. WHEN un usuario proporciona credenciales correctas, THE Auth_Service SHALL generar un token JWT válido por 24 horas
3. WHEN un usuario solicita recuperación de contraseña, THE Auth_Service SHALL enviar un enlace de restablecimiento al email registrado
4. THE Auth_Service SHALL hashear todas las contraseñas usando bcrypt antes de almacenarlas
5. WHEN un token JWT expira, THE System SHALL requerir nueva autenticación
6. THE Auth_Service SHALL validar que el email tenga formato válido antes de crear la cuenta
7. THE Auth_Service SHALL validar que la contraseña tenga al menos 8 caracteres, una mayúscula, una minúscula y un número

### Requirement 2: Gestión de Perfil de Usuario

**User Story:** Como músico, quiero gestionar mi perfil personal, para que pueda personalizar mi experiencia y mantener actualizada mi información.

#### Acceptance Criteria

1. WHEN un usuario accede a su perfil, THE System SHALL mostrar nombre, email, instrumentos y nivel actual
2. WHEN un usuario modifica su información de perfil, THE System SHALL validar y guardar los cambios
3. THE System SHALL permitir al usuario seleccionar uno o más instrumentos (piano, bajo, batería, guitarra)
4. WHEN un usuario cambia su contraseña, THE System SHALL requerir la contraseña actual para confirmar
5. THE System SHALL mostrar estadísticas generales del usuario (tiempo total practicado, sesiones completadas, nivel)

### Requirement 3: Subida y Almacenamiento de Libros PDF

**User Story:** Como músico, quiero subir mis libros de ejercicios en formato PDF, para que pueda acceder a ellos digitalmente durante mis sesiones de práctica.

#### Acceptance Criteria

1. WHEN un usuario selecciona un archivo PDF válido, THE System SHALL subir el archivo al Storage_Service
2. THE System SHALL validar que el archivo sea formato PDF y no exceda 50MB
3. WHEN la subida es exitosa, THE System SHALL crear un registro de Book asociado al usuario
4. THE System SHALL permitir al usuario especificar nombre, instrumento y descripción del libro
5. IF la subida falla, THEN THE System SHALL mostrar un mensaje de error descriptivo y mantener el formulario con los datos ingresados
6. THE System SHALL generar una URL única y segura para acceder al PDF almacenado
7. WHEN un usuario elimina un libro, THE System SHALL remover el archivo del Storage_Service y todos los registros asociados

### Requirement 4: Visualización de PDFs

**User Story:** Como músico, quiero visualizar mis libros PDF dentro de la aplicación, para que no necesite cambiar entre aplicaciones durante mi práctica.

#### Acceptance Criteria

1. WHEN un usuario selecciona un libro, THE PDF_Viewer SHALL renderizar el documento completo
2. THE PDF_Viewer SHALL permitir navegación por páginas (anterior, siguiente, ir a página específica)
3. THE PDF_Viewer SHALL permitir zoom in, zoom out y ajuste automático al ancho de pantalla
4. WHILE el usuario visualiza un PDF, THE System SHALL mantener la posición de scroll al cambiar de página
5. THE PDF_Viewer SHALL ser responsivo y adaptarse a dispositivos móviles, tablets y escritorio
6. WHEN el PDF no puede cargarse, THE System SHALL mostrar un mensaje de error y opción para reintentar

### Requirement 5: Gestión de Ejercicios

**User Story:** Como músico, quiero crear y organizar ejercicios específicos dentro de mis libros, para que pueda estructurar mejor mis sesiones de práctica.

#### Acceptance Criteria

1. WHEN un usuario crea un ejercicio, THE System SHALL asociarlo a un libro existente
2. THE System SHALL permitir especificar nombre, descripción, páginas del libro, dificultad (básico, intermedio, avanzado) y notas
3. WHEN un usuario visualiza un libro, THE System SHALL mostrar todos los ejercicios asociados
4. THE System SHALL permitir editar y eliminar ejercicios existentes
5. WHEN un usuario elimina un ejercicio, THE System SHALL mantener los registros históricos de sesiones que lo utilizaron
6. THE System SHALL permitir filtrar ejercicios por instrumento y dificultad

### Requirement 6: Registro de Sesiones de Práctica con Temporizador

**User Story:** Como músico, quiero registrar mis sesiones de práctica con un temporizador integrado, para que pueda medir con precisión el tiempo dedicado a cada ejercicio.

#### Acceptance Criteria

1. WHEN un usuario inicia una sesión, THE Practice_Timer SHALL comenzar a contar el tiempo transcurrido
2. THE Practice_Timer SHALL mostrar el tiempo en formato HH:MM:SS actualizado cada segundo
3. WHEN un usuario pausa el temporizador, THE Practice_Timer SHALL detener el conteo y mantener el tiempo acumulado
4. WHEN un usuario reanuda el temporizador, THE Practice_Timer SHALL continuar desde el tiempo acumulado
5. WHEN un usuario finaliza la sesión, THE System SHALL guardar la duración total, fecha, ejercicios practicados y notas opcionales
6. THE System SHALL permitir agregar múltiples ejercicios a una sesión con duración individual para cada uno
7. IF el usuario cierra la aplicación con una sesión activa, THEN THE System SHALL preguntar si desea guardar la sesión parcial

### Requirement 7: Registro Manual de Sesiones

**User Story:** Como músico, quiero registrar sesiones de práctica manualmente, para que pueda agregar sesiones pasadas o cuando no use el temporizador.

#### Acceptance Criteria

1. WHEN un usuario crea una sesión manual, THE System SHALL permitir especificar fecha, duración, ejercicios y notas
2. THE System SHALL validar que la fecha no sea futura
3. THE System SHALL validar que la duración sea un número positivo en minutos
4. WHEN un usuario guarda una sesión manual, THE System SHALL almacenarla con los mismos atributos que una sesión con temporizador
5. THE System SHALL permitir editar sesiones registradas dentro de las 24 horas posteriores a su creación

### Requirement 8: Dashboard de Estadísticas

**User Story:** Como músico, quiero visualizar mis estadísticas de práctica en un dashboard, para que pueda entender mi progreso y patrones de práctica.

#### Acceptance Criteria

1. WHEN un usuario accede al dashboard, THE System SHALL mostrar tiempo total practicado en el período seleccionado
2. THE Dashboard SHALL mostrar gráfico de tiempo de práctica por día en los últimos 30 días
3. THE Dashboard SHALL mostrar distribución de práctica por instrumento en gráfico circular
4. THE Dashboard SHALL mostrar los 5 ejercicios más practicados con tiempo dedicado a cada uno
5. THE Dashboard SHALL mostrar racha actual (días consecutivos con práctica)
6. THE Dashboard SHALL permitir filtrar estadísticas por rango de fechas personalizado
7. THE Dashboard SHALL mostrar promedio de práctica diaria y semanal
8. WHILE el usuario no tiene sesiones registradas, THE Dashboard SHALL mostrar mensaje motivacional y guía para comenzar

### Requirement 9: Calendario de Práctica

**User Story:** Como músico, quiero ver un calendario visual de mis sesiones, para que pueda identificar patrones y días sin práctica.

#### Acceptance Criteria

1. WHEN un usuario accede al calendario, THE System SHALL mostrar vista mensual con indicadores en días con sesiones
2. THE System SHALL usar código de colores para indicar duración de práctica (verde: >60min, amarillo: 30-60min, gris: <30min)
3. WHEN un usuario selecciona un día, THE System SHALL mostrar detalle de todas las sesiones de ese día
4. THE System SHALL permitir navegar entre meses (anterior, siguiente, ir a mes específico)
5. THE System SHALL resaltar el día actual
6. THE System SHALL mostrar la racha actual de días consecutivos con práctica

### Requirement 10: Cálculo Automático de Nivel

**User Story:** Como músico, quiero que el sistema calcule automáticamente mi nivel, para que pueda ver mi progreso de forma objetiva.

#### Acceptance Criteria

1. THE System SHALL calcular el nivel del usuario basado en tiempo total practicado, consistencia (días con práctica en últimos 30 días) y variedad de ejercicios
2. THE System SHALL asignar nivel "básico" cuando el tiempo total sea menor a 20 horas
3. THE System SHALL asignar nivel "intermedio" cuando el tiempo total sea entre 20 y 100 horas Y la consistencia sea mayor al 40%
4. THE System SHALL asignar nivel "avanzado" cuando el tiempo total sea mayor a 100 horas Y la consistencia sea mayor al 60% Y haya practicado al menos 15 ejercicios diferentes
5. WHEN el nivel del usuario cambia, THE System SHALL notificar al usuario y registrar el cambio en el historial
6. THE System SHALL recalcular el nivel después de cada sesión guardada
7. THE System SHALL mostrar progreso visual hacia el siguiente nivel con porcentaje y métricas faltantes

### Requirement 11: Historial de Niveles

**User Story:** Como músico, quiero ver mi historial de cambios de nivel, para que pueda apreciar mi evolución a largo plazo.

#### Acceptance Criteria

1. WHEN un usuario accede al historial de niveles, THE System SHALL mostrar todos los cambios de nivel con fecha
2. THE System SHALL mostrar gráfico de línea temporal con los niveles alcanzados
3. THE System SHALL mostrar tiempo transcurrido en cada nivel
4. THE System SHALL mostrar las métricas que permitieron cada cambio de nivel

### Requirement 12: Establecimiento de Metas

**User Story:** Como músico, quiero establecer metas de práctica diarias y semanales, para que pueda mantener disciplina y motivación.

#### Acceptance Criteria

1. WHEN un usuario crea una meta, THE System SHALL permitir especificar tipo (diaria o semanal), duración objetivo en minutos y fecha de inicio
2. THE System SHALL validar que la duración objetivo sea un número positivo
3. WHEN un usuario tiene una meta activa, THE Dashboard SHALL mostrar progreso actual hacia la meta con barra de progreso
4. THE System SHALL calcular automáticamente el progreso comparando tiempo practicado vs objetivo
5. WHEN un usuario completa una meta, THE System SHALL mostrar notificación de felicitación
6. THE System SHALL permitir editar o desactivar metas existentes
7. THE System SHALL mostrar historial de metas completadas y no completadas

### Requirement 13: Recomendaciones de Práctica

**User Story:** Como músico, quiero recibir recomendaciones personalizadas, para que pueda mejorar la efectividad de mi práctica.

#### Acceptance Criteria

1. WHEN un usuario accede a recomendaciones, THE Recommendation_Engine SHALL analizar los últimos 30 días de práctica
2. IF la consistencia es menor al 50%, THEN THE Recommendation_Engine SHALL sugerir establecer una meta diaria más alcanzable
3. IF el usuario practica menos de 3 ejercicios diferentes, THEN THE Recommendation_Engine SHALL sugerir aumentar la variedad
4. IF el usuario no ha practicado en 3 días consecutivos, THEN THE Recommendation_Engine SHALL enviar recordatorio motivacional
5. THE Recommendation_Engine SHALL sugerir ejercicios no practicados recientemente basándose en el nivel del usuario
6. THE Recommendation_Engine SHALL sugerir incrementar duración de sesiones si el promedio es menor a 30 minutos
7. THE System SHALL mostrar entre 3 y 5 recomendaciones priorizadas por relevancia

### Requirement 14: Predicción de Progreso

**User Story:** Como músico, quiero ver predicciones de cuándo alcanzaré el siguiente nivel, para que pueda planificar mi práctica a largo plazo.

#### Acceptance Criteria

1. WHEN un usuario accede a predicciones, THE Prediction_Engine SHALL calcular tiempo estimado para alcanzar el siguiente nivel
2. THE Prediction_Engine SHALL basar la predicción en el promedio de práctica de los últimos 30 días
3. THE Prediction_Engine SHALL mostrar fecha estimada de alcance del siguiente nivel
4. THE Prediction_Engine SHALL mostrar escenarios hipotéticos: "Si practicas X minutos diarios, alcanzarás el nivel en Y días"
5. THE Prediction_Engine SHALL generar al menos 3 escenarios (conservador, moderado, ambicioso)
6. IF los datos históricos son insuficientes (menos de 7 días), THEN THE System SHALL mostrar mensaje indicando que se necesitan más datos
7. THE System SHALL actualizar las predicciones semanalmente o después de cambios significativos en patrones de práctica

### Requirement 15: Gestión de Temas Visuales

**User Story:** Como músico, quiero alternar entre modo claro y oscuro, para que pueda usar la aplicación cómodamente en diferentes condiciones de iluminación.

#### Acceptance Criteria

1. WHEN un usuario selecciona un tema, THE Theme_Manager SHALL aplicar el tema inmediatamente a toda la interfaz
2. THE Theme_Manager SHALL persistir la preferencia del usuario en el navegador
3. THE System SHALL usar paleta de colores con gradientes azul-morado en componentes clave
4. THE System SHALL asegurar contraste adecuado en ambos temas para legibilidad
5. WHEN el usuario accede por primera vez, THE System SHALL detectar la preferencia del sistema operativo y aplicar el tema correspondiente

### Requirement 16: Diseño Responsivo

**User Story:** Como músico, quiero usar la aplicación en cualquier dispositivo, para que pueda acceder a mis materiales desde mi teléfono, tablet o computadora.

#### Acceptance Criteria

1. THE System SHALL adaptar el layout automáticamente a pantallas móviles (< 600px), tablets (600-960px) y escritorio (> 960px)
2. WHILE el usuario está en dispositivo móvil, THE System SHALL usar navegación tipo drawer colapsable
3. WHILE el usuario está en escritorio, THE System SHALL usar navegación lateral permanente
4. THE System SHALL asegurar que todos los botones y elementos interactivos tengan tamaño mínimo de 44x44px en móvil
5. THE PDF_Viewer SHALL optimizar la visualización según el tamaño de pantalla
6. THE Dashboard SHALL reorganizar gráficos en columna única en móvil y múltiples columnas en escritorio

### Requirement 17: Notificaciones y Feedback

**User Story:** Como músico, quiero recibir notificaciones claras sobre mis acciones, para que sepa cuando las operaciones son exitosas o fallan.

#### Acceptance Criteria

1. WHEN una operación es exitosa, THE System SHALL mostrar notificación toast verde con mensaje descriptivo por 3 segundos
2. WHEN una operación falla, THE System SHALL mostrar notificación toast roja con mensaje de error descriptivo por 5 segundos
3. WHEN una operación está en progreso, THE System SHALL mostrar indicador de carga
4. THE System SHALL mostrar notificación cuando el usuario completa una meta
5. THE System SHALL mostrar notificación cuando el usuario alcanza un nuevo nivel
6. THE System SHALL permitir al usuario cerrar notificaciones manualmente

### Requirement 18: Validación de Datos

**User Story:** Como músico, quiero que el sistema valide mis entradas, para que pueda corregir errores antes de guardar información.

#### Acceptance Criteria

1. WHEN un usuario envía un formulario, THE System SHALL validar todos los campos requeridos antes de procesar
2. THE System SHALL mostrar mensajes de error específicos junto a cada campo inválido
3. THE System SHALL validar formatos de email, longitud de contraseñas y rangos numéricos
4. THE System SHALL prevenir envío de formularios con datos inválidos
5. THE System SHALL mantener los datos válidos en el formulario cuando hay errores de validación
6. THE System SHALL usar esquemas de validación consistentes en frontend y backend

### Requirement 19: Seguridad y Autorización

**User Story:** Como músico, quiero que mis datos estén protegidos, para que solo yo pueda acceder a mi información de práctica.

#### Acceptance Criteria

1. THE System SHALL requerir autenticación para todas las rutas excepto login, registro y recuperación de contraseña
2. THE System SHALL validar el token JWT en cada petición al backend
3. THE System SHALL asegurar que los usuarios solo puedan acceder a sus propios libros, ejercicios y sesiones
4. THE System SHALL usar HTTPS para todas las comunicaciones
5. THE System SHALL implementar rate limiting para prevenir ataques de fuerza bruta (máximo 5 intentos de login por minuto)
6. THE System SHALL sanitizar todas las entradas de usuario para prevenir inyección SQL y XSS
7. WHEN un token es inválido o expirado, THE System SHALL redirigir al usuario a la página de login

### Requirement 20: Rendimiento y Optimización

**User Story:** Como músico, quiero que la aplicación cargue rápidamente, para que pueda comenzar a practicar sin demoras.

#### Acceptance Criteria

1. THE System SHALL cargar la página inicial en menos de 2 segundos en conexión 4G
2. THE System SHALL implementar lazy loading para componentes de rutas no visitadas
3. THE System SHALL cachear archivos PDF descargados para acceso offline
4. THE System SHALL paginar listas de libros y sesiones cuando excedan 20 elementos
5. THE System SHALL comprimir imágenes y assets estáticos
6. THE Dashboard SHALL cargar gráficos de forma asíncrona sin bloquear la interfaz
7. THE System SHALL implementar debouncing en campos de búsqueda con delay de 300ms

### Requirement 21: Funcionalidad PWA

**User Story:** Como músico, quiero instalar la aplicación en mi dispositivo, para que pueda acceder rápidamente como si fuera una app nativa.

#### Acceptance Criteria

1. THE System SHALL proporcionar un manifest.json con iconos, nombre y configuración de PWA
2. THE System SHALL implementar Service Worker para cacheo de assets estáticos
3. THE System SHALL permitir instalación en dispositivos móviles y escritorio
4. THE System SHALL funcionar offline mostrando contenido cacheado y mensaje cuando no hay conexión
5. WHEN el usuario está offline, THE System SHALL permitir visualizar PDFs previamente cargados
6. WHEN el usuario está offline, THE System SHALL encolar operaciones de escritura para sincronizar al reconectar
7. THE System SHALL mostrar indicador visual del estado de conexión

### Requirement 22: Exportación de Datos

**User Story:** Como músico, quiero exportar mis datos de práctica, para que pueda hacer respaldos o análisis externos.

#### Acceptance Criteria

1. WHEN un usuario solicita exportación, THE System SHALL generar archivo JSON con todos sus libros, ejercicios y sesiones
2. THE System SHALL incluir metadatos de exportación (fecha, versión, usuario)
3. THE System SHALL permitir exportar estadísticas en formato CSV
4. THE System SHALL generar el archivo de exportación en menos de 5 segundos
5. WHEN la exportación está lista, THE System SHALL iniciar descarga automática del archivo

### Requirement 23: Búsqueda y Filtrado

**User Story:** Como músico, quiero buscar y filtrar mis libros y ejercicios, para que pueda encontrar rápidamente lo que necesito.

#### Acceptance Criteria

1. WHEN un usuario escribe en el campo de búsqueda, THE System SHALL filtrar resultados en tiempo real
2. THE System SHALL buscar en nombres, descripciones y notas de libros y ejercicios
3. THE System SHALL permitir filtrar libros por instrumento
4. THE System SHALL permitir filtrar ejercicios por dificultad
5. THE System SHALL mostrar contador de resultados encontrados
6. WHEN no hay resultados, THE System SHALL mostrar mensaje indicando que no se encontraron coincidencias

### Requirement 24: Gestión de Errores

**User Story:** Como músico, quiero que la aplicación maneje errores gracefully, para que pueda continuar usando la aplicación incluso cuando algo falla.

#### Acceptance Criteria

1. WHEN ocurre un error de red, THE System SHALL mostrar mensaje descriptivo y opción para reintentar
2. WHEN ocurre un error del servidor, THE System SHALL mostrar mensaje genérico sin exponer detalles técnicos
3. THE System SHALL registrar errores en el servidor para debugging
4. THE System SHALL implementar boundary components en React para capturar errores de renderizado
5. WHEN un componente falla, THE System SHALL mostrar UI de fallback sin romper toda la aplicación
6. THE System SHALL mantener el estado de la aplicación después de errores recuperables

### Requirement 25: Accesibilidad

**User Story:** Como músico con necesidades de accesibilidad, quiero que la aplicación sea usable con tecnologías asistivas, para que pueda aprovechar todas las funcionalidades.

#### Acceptance Criteria

1. THE System SHALL usar etiquetas ARIA apropiadas en todos los componentes interactivos
2. THE System SHALL permitir navegación completa por teclado con orden lógico de tabs
3. THE System SHALL mantener ratios de contraste mínimos de 4.5:1 para texto normal
4. THE System SHALL proporcionar texto alternativo para iconos y elementos visuales
5. THE System SHALL anunciar cambios dinámicos de contenido a lectores de pantalla
6. THE System SHALL permitir zoom hasta 200% sin pérdida de funcionalidad
