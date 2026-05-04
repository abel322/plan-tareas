# 🚀 Configuración Sin Docker

## Opción 1: SQLite (Recomendado - Más Fácil)

SQLite es una base de datos que no requiere servidor. Perfecta para desarrollo.

### Pasos:

```bash
# 1. El proyecto ya está configurado para SQLite
# Verifica que .env.local tenga:
# DATABASE_URL="file:./dev.db"

# 2. Instala las dependencias
npm install

# 3. Genera el cliente de Prisma
npm run db:generate

# 4. Crea la base de datos
npm run db:push

# 5. Carga datos de ejemplo
npm run db:seed

# 6. Inicia la aplicación
npm run dev
```

¡Listo! La aplicación estará en http://localhost:3000

### Ventajas de SQLite:
- ✅ No requiere instalación de servidor
- ✅ Base de datos en un solo archivo
- ✅ Perfecta para desarrollo
- ✅ Fácil de resetear (solo borra el archivo)

### Ubicación de la Base de Datos:
El archivo `dev.db` se creará en la carpeta `prisma/`

---

## Opción 2: PostgreSQL Local (Avanzado)

Si prefieres usar PostgreSQL sin Docker:

### Windows:

1. **Descargar PostgreSQL:**
   - Ve a: https://www.postgresql.org/download/windows/
   - Descarga el instalador
   - Ejecuta e instala con configuración por defecto

2. **Configurar:**
   ```bash
   # Durante la instalación, anota:
   # - Usuario: postgres
   # - Contraseña: [la que elijas]
   # - Puerto: 5432
   ```

3. **Crear Base de Datos:**
   ```bash
   # Abre pgAdmin (instalado con PostgreSQL)
   # O usa la terminal:
   psql -U postgres
   
   # Dentro de psql:
   CREATE DATABASE project_management;
   \q
   ```

4. **Actualizar .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/project_management"
   ```

5. **Continuar con setup:**
   ```bash
   npm run db:push
   npm run db:seed
   npm run dev
   ```

---

## Opción 3: Base de Datos en la Nube (Gratis)

### Usar Supabase (Gratis):

1. **Crear cuenta:**
   - Ve a: https://supabase.com
   - Crea una cuenta gratis
   - Crea un nuevo proyecto

2. **Obtener URL de conexión:**
   - En tu proyecto, ve a Settings → Database
   - Copia la "Connection string" (URI)
   - Cambia `[YOUR-PASSWORD]` por tu contraseña

3. **Actualizar .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

4. **Setup:**
   ```bash
   npm run db:push
   npm run db:seed
   npm run dev
   ```

### Usar Neon (Gratis):

1. **Crear cuenta:**
   - Ve a: https://neon.tech
   - Crea una cuenta gratis
   - Crea un nuevo proyecto

2. **Copiar connection string:**
   - Copia la URL de conexión que te dan

3. **Actualizar .env.local:**
   ```env
   DATABASE_URL="[la URL que copiaste]"
   ```

4. **Setup:**
   ```bash
   npm run db:push
   npm run db:seed
   npm run dev
   ```

---

## Comandos Útiles

### Con SQLite:

```bash
# Ver la base de datos
npm run db:studio

# Resetear base de datos
rm prisma/dev.db
npm run db:push
npm run db:seed

# Backup
cp prisma/dev.db prisma/dev.db.backup
```

### Verificar Configuración:

```bash
# Ver qué base de datos estás usando
cat .env.local

# Generar cliente Prisma
npm run db:generate

# Ver estructura de la base de datos
npm run db:studio
```

---

## Solución de Problemas

### Error: "Environment variable not found: DATABASE_URL"

**Solución:**
```bash
# Verifica que existe .env.local
ls .env.local

# Si no existe, créalo:
echo 'DATABASE_URL="file:./dev.db"' > .env.local
```

### Error: "Can't reach database server"

**Solución con SQLite:**
```bash
# Asegúrate de que la ruta es correcta
# En .env.local debe ser:
DATABASE_URL="file:./dev.db"

# Regenera el cliente
npm run db:generate
npm run db:push
```

**Solución con PostgreSQL:**
```bash
# Verifica que PostgreSQL esté corriendo
# Windows:
services.msc
# Busca "postgresql" y verifica que esté "Running"

# O reinicia el servicio:
net stop postgresql-x64-15
net start postgresql-x64-15
```

### Error: "Prisma Client not generated"

**Solución:**
```bash
npm run db:generate
```

---

## Migrar de SQLite a PostgreSQL (Futuro)

Cuando quieras migrar a PostgreSQL:

1. **Exportar datos:**
   ```bash
   npm run db:studio
   # Exporta los datos manualmente
   ```

2. **Cambiar configuración:**
   ```prisma
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Actualizar .env.local:**
   ```env
   DATABASE_URL="postgresql://..."
   ```

4. **Aplicar cambios:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

---

## Recomendación

Para desarrollo local sin Docker, usa **SQLite**:
- ✅ Más fácil de configurar
- ✅ No requiere servicios adicionales
- ✅ Suficiente para desarrollo
- ✅ Fácil de resetear

Para producción o trabajo en equipo, usa **PostgreSQL** (con Docker o en la nube).

---

## Siguiente Paso

Ejecuta estos comandos en orden:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

¡Y listo! 🎉
