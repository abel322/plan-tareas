# 🔧 Solución de Problemas - ProjectFlow

## Error: "Error al crear tarea"

Este error generalmente ocurre por una de estas razones:

### 1. Base de Datos No Configurada

**Síntoma:** Error al crear tareas o proyectos

**Solución:**

```bash
# 1. Asegúrate de que PostgreSQL esté corriendo
docker-compose ps

# Si no está corriendo:
docker-compose up -d postgres

# 2. Aplica el schema a la base de datos
npm run db:push

# 3. Carga datos de ejemplo
npm run db:seed

# 4. Reinicia el servidor
npm run dev
```

### 2. Variables de Entorno Incorrectas

**Síntoma:** Error de conexión a la base de datos

**Solución:**

1. Verifica que existe el archivo `.env.local`:
```bash
# Si no existe, cópialo desde el ejemplo
cp .env.example .env.local
```

2. Verifica el contenido de `.env.local`:
```env
DATABASE_URL="postgresql://pmuser:pmpassword@localhost:5432/project_management"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-change-in-production-please"
```

3. Si usas Docker, asegúrate de que las credenciales coincidan con `docker-compose.yml`

### 3. Proyecto No Existe

**Síntoma:** Error "El proyecto especificado no existe"

**Solución:**

1. Primero crea un proyecto desde la página de Proyectos
2. Luego intenta crear la tarea dentro de ese proyecto

### 4. Puerto de PostgreSQL Ocupado

**Síntoma:** Error al iniciar Docker

**Solución:**

```bash
# Opción 1: Detén tu PostgreSQL local
# Windows:
net stop postgresql-x64-15

# Linux/Mac:
sudo systemctl stop postgresql

# Opción 2: Cambia el puerto en docker-compose.yml
# Edita la línea:
ports:
  - "5433:5432"  # Usa 5433 en lugar de 5432

# Y actualiza .env.local:
DATABASE_URL="postgresql://pmuser:pmpassword@localhost:5433/project_management"
```

### 5. Prisma Client No Generado

**Síntoma:** Error "Cannot find module '@prisma/client'"

**Solución:**

```bash
npm run db:generate
npm run dev
```

## Verificar Estado de la Base de Datos

### Ver Datos en Prisma Studio

```bash
npm run db:studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes:
- Ver todas las tablas
- Ver los datos existentes
- Editar datos manualmente
- Verificar que el seed funcionó

### Verificar Conexión

```bash
# Intenta conectarte directamente a PostgreSQL
docker exec -it project-management-db psql -U pmuser -d project_management

# Dentro de psql, verifica las tablas:
\dt

# Ver usuarios:
SELECT * FROM "User";

# Ver proyectos:
SELECT * FROM "Project";

# Salir:
\q
```

## Logs de Depuración

### Ver Logs del Servidor Next.js

Los logs aparecen en la terminal donde ejecutaste `npm run dev`. Busca:

```
Error creating task: [detalles del error]
Error details: [mensaje específico]
```

### Ver Logs de Docker

```bash
# Ver logs de PostgreSQL
docker-compose logs postgres

# Ver logs en tiempo real
docker-compose logs -f postgres
```

## Resetear Todo

Si nada funciona, resetea completamente:

```bash
# 1. Detener y eliminar contenedores
docker-compose down -v

# 2. Eliminar node_modules
rm -rf node_modules package-lock.json

# 3. Reinstalar
npm install

# 4. Reiniciar base de datos
docker-compose up -d postgres

# Espera 5 segundos para que PostgreSQL inicie

# 5. Aplicar schema
npm run db:push

# 6. Cargar datos
npm run db:seed

# 7. Iniciar app
npm run dev
```

## Errores Comunes y Soluciones

### "P2002: Unique constraint failed"

**Causa:** Intentas crear un registro duplicado

**Solución:** Cambia el nombre o verifica que no exista ya

### "P2003: Foreign key constraint failed"

**Causa:** Intentas crear una tarea para un proyecto que no existe

**Solución:** 
1. Ve a Prisma Studio
2. Verifica que el proyecto existe
3. Copia el ID correcto del proyecto

### "P2025: Record not found"

**Causa:** Intentas actualizar/eliminar algo que no existe

**Solución:** Verifica que el ID es correcto

### "Connection refused"

**Causa:** PostgreSQL no está corriendo

**Solución:**
```bash
docker-compose up -d postgres
```

### "Port already in use"

**Causa:** El puerto 3000 o 5432 está ocupado

**Solución:**
```bash
# Para Next.js (puerto 3000)
PORT=3001 npm run dev

# Para PostgreSQL (puerto 5432)
# Edita docker-compose.yml y cambia el puerto
```

## Verificación Paso a Paso

Sigue estos pasos para verificar que todo funciona:

### 1. Verificar Docker

```bash
docker-compose ps
# Deberías ver: project-management-db running
```

### 2. Verificar Base de Datos

```bash
npm run db:studio
# Debería abrir http://localhost:5555
# Verifica que hay datos en User y Project
```

### 3. Verificar Servidor

```bash
npm run dev
# Debería iniciar en http://localhost:3000
# No debería haber errores en la consola
```

### 4. Probar Crear Proyecto

1. Ve a http://localhost:3000/dashboard/projects
2. Click en "Nuevo Proyecto"
3. Completa el formulario
4. Click en "Crear Proyecto"
5. Deberías ser redirigido al detalle del proyecto

### 5. Probar Crear Tarea

1. Dentro de un proyecto
2. Click en "Nueva Tarea"
3. Completa el formulario
4. Click en "Crear Tarea"
5. La tarea debería aparecer en la lista

## Obtener Ayuda

Si sigues teniendo problemas:

1. **Revisa los logs:** Busca mensajes de error específicos
2. **Verifica la consola del navegador:** Presiona F12 y ve a la pestaña Console
3. **Verifica la pestaña Network:** Ve las respuestas de las API
4. **Copia el error completo:** Incluye el stack trace completo

### Información Útil para Reportar Errores

```bash
# Versión de Node
node --version

# Versión de npm
npm --version

# Estado de Docker
docker-compose ps

# Logs recientes
docker-compose logs --tail=50 postgres
```

## Comandos Útiles

```bash
# Ver todas las tablas
npm run db:studio

# Resetear base de datos
npm run db:push -- --force-reset

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar todo
docker-compose restart

# Limpiar todo
docker-compose down -v && npm run db:push && npm run db:seed
```

## Prevención de Problemas

### Antes de Empezar

1. ✅ Verifica que Docker esté instalado y corriendo
2. ✅ Verifica que Node.js 18+ esté instalado
3. ✅ Clona el repositorio completo
4. ✅ Copia `.env.example` a `.env.local`
5. ✅ Ejecuta `npm install`
6. ✅ Ejecuta `docker-compose up -d`
7. ✅ Ejecuta `npm run db:push`
8. ✅ Ejecuta `npm run db:seed`
9. ✅ Ejecuta `npm run dev`

### Durante el Desarrollo

1. ✅ Mantén Docker corriendo
2. ✅ No modifiques el schema sin hacer `db:push`
3. ✅ Guarda cambios antes de probar
4. ✅ Revisa la consola regularmente
5. ✅ Usa Prisma Studio para verificar datos

---

**¿Aún tienes problemas?** Revisa los logs detallados y busca el mensaje de error específico en esta guía.
