# 🚀 Guía de Instalación

## Requisitos Previos

- Node.js 18+ instalado
- Docker y Docker Compose (opcional, para PostgreSQL)
- Git

## Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd project-management-platform
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

#### Opción A: Usar Docker (Recomendado)

```bash
# Iniciar PostgreSQL con Docker Compose
docker-compose up -d postgres

# Esperar unos segundos para que PostgreSQL inicie
```

#### Opción B: PostgreSQL Local

Si ya tienes PostgreSQL instalado localmente:

1. Crear base de datos:
```sql
CREATE DATABASE project_management;
```

2. Actualizar `.env.local` con tus credenciales

### 4. Configurar Variables de Entorno

El archivo `.env.local` ya está configurado con valores por defecto:

```env
DATABASE_URL="postgresql://pmuser:pmpassword@localhost:5432/project_management"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-change-in-production-please"
```

### 5. Aplicar Schema de Base de Datos

```bash
npm run db:push
```

### 6. Poblar Base de Datos con Datos de Ejemplo

```bash
npm run db:seed
```

Esto creará:
- 1 usuario demo (email: `demo@projectflow.com`, password: `password123`)
- 2 proyectos de ejemplo
- Múltiples tareas con dependencias
- Estimaciones PERT
- Objetivos SMART

### 7. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 🎯 Credenciales de Acceso

```
Email: demo@projectflow.com
Password: password123
```

## 📊 Explorar la Base de Datos

Para abrir Prisma Studio y ver/editar datos:

```bash
npm run db:studio
```

Se abrirá en: **http://localhost:5555**

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

- Verifica que PostgreSQL esté corriendo:
  ```bash
  docker-compose ps
  ```
- Si no está corriendo:
  ```bash
  docker-compose up -d postgres
  ```

### Error: "Port 5432 already in use"

- Ya tienes PostgreSQL corriendo localmente
- Opción 1: Detén tu PostgreSQL local
- Opción 2: Cambia el puerto en `docker-compose.yml` y `.env.local`

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error al hacer seed

```bash
# Limpiar base de datos y volver a intentar
npm run db:push --force-reset
npm run db:seed
```

## 🔄 Reiniciar Todo

Si quieres empezar desde cero:

```bash
# Detener y eliminar contenedores
docker-compose down -v

# Eliminar node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Reiniciar base de datos
docker-compose up -d postgres
npm run db:push
npm run db:seed

# Iniciar aplicación
npm run dev
```

## 📝 Próximos Pasos

Una vez instalado:

1. Explora el Dashboard en `/dashboard`
2. Revisa los proyectos de ejemplo en `/dashboard/projects`
3. Prueba la calculadora PERT/CPM en `/dashboard/analysis`
4. Crea tu primer proyecto personalizado

## 🆘 Ayuda

Si encuentras problemas:

1. Revisa los logs de Docker: `docker-compose logs postgres`
2. Verifica la conexión a la base de datos en Prisma Studio
3. Consulta la documentación de Next.js y Prisma
