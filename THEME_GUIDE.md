# 🎨 Guía de Temas - ProjectFlow

## Sistema de Temas Light/Dark

ProjectFlow incluye un sistema completo de temas claro/oscuro que se adapta automáticamente a las preferencias del usuario.

---

## 🌓 Cambiar de Tema

### Desde la Interfaz

1. **Botón de Toggle**: En el header (esquina superior derecha), encontrarás un botón con iconos de sol/luna
2. **Click**: Haz clic para alternar entre modo oscuro y claro
3. **Persistencia**: Tu preferencia se guarda automáticamente en el navegador

### Desde Configuración

1. Ve a **Configuración** en el menú lateral
2. En la sección **Apariencia**
3. Selecciona tu tema preferido:
   - **Oscuro**: Tema oscuro permanente
   - **Claro**: Tema claro permanente
   - **Automático**: Sigue las preferencias del sistema

---

## 🎨 Paleta de Colores

### Tema Oscuro (Default)

```css
Fondo Principal: #0a0e1a (midnight)
Superficie: #0f1419 (slate-deep)
Superficie Elevada: #1a1f2e (slate-mid)
Bordes: #2a3142 (graphite)

Texto Principal: #e8edf4
Texto Secundario: #a8b2c1
Texto Terciario: #6b7280
Texto Muted: #4b5563
```

### Tema Claro

```css
Fondo Principal: #f8fafc
Superficie: #ffffff
Superficie Elevada: #f1f5f9
Bordes: #e2e8f0

Texto Principal: #0f172a
Texto Secundario: #475569
Texto Terciario: #94a3b8
Texto Muted: #cbd5e1
```

### Colores de Acento (Compartidos)

```css
Cyan Eléctrico: #06b6d4 (acciones principales)
Intelligence: #8b5cf6 (IA, tareas críticas)
Success: #10b981 (éxito, completado)
Warning: #f59e0b (advertencia, atención)
Critical: #ef4444 (crítico, error)
```

---

## 🔧 Implementación Técnica

### Variables CSS

El sistema usa variables CSS que cambian automáticamente:

```css
/* Dark theme */
--background: 10 14 26;
--surface: 15 20 25;
--text-primary: 232 237 244;

/* Light theme */
.light {
  --background: 248 250 252;
  --surface: 255 255 255;
  --text-primary: 15 23 42;
}
```

### Clases de Tailwind

Usa estas clases para elementos que respetan el tema:

```tsx
// Fondos
bg-background      // Fondo principal
bg-surface         // Superficie (cards, inputs)
bg-surface-elevated // Superficie elevada

// Texto
text-text-primary    // Texto principal
text-text-secondary  // Texto secundario
text-text-tertiary   // Texto terciario
text-text-muted      // Texto deshabilitado

// Bordes
border-border/40     // Borde estándar
```

---

## 💡 Características del Sistema

### 1. Transiciones Suaves

Todos los cambios de tema incluyen transiciones CSS suaves:

```css
transition-colors duration-300
```

### 2. Persistencia Local

La preferencia se guarda en `localStorage`:

```javascript
localStorage.setItem('projectflow-theme', 'dark')
```

### 3. Detección del Sistema

El tema "automático" detecta las preferencias del sistema operativo:

```javascript
window.matchMedia('(prefers-color-scheme: dark)')
```

### 4. Hidratación sin Parpadeo

Usa `suppressHydrationWarning` para evitar parpadeos al cargar:

```tsx
<html suppressHydrationWarning>
```

---

## 🎯 Componentes Adaptados

Todos los componentes UI se adaptan automáticamente:

### Botones

```tsx
// Oscuro: fondo cyan, texto blanco
// Claro: fondo cyan, texto blanco
<Button>Acción</Button>

// Oscuro: borde gris claro, fondo transparente
// Claro: borde gris oscuro, fondo transparente
<Button variant="outline">Cancelar</Button>
```

### Cards

```tsx
// Oscuro: fondo slate-deep, borde graphite
// Claro: fondo blanco, borde gris claro, sombra sutil
<Card>
  <CardContent>Contenido</CardContent>
</Card>
```

### Inputs

```tsx
// Oscuro: fondo slate-deep, texto claro
// Claro: fondo blanco, texto oscuro
<Input placeholder="Buscar..." />
```

### Badges

```tsx
// Se adaptan manteniendo los colores de acento
<Badge variant="success">Completado</Badge>
<Badge variant="critical">Urgente</Badge>
```

---

## 🌟 Efectos Especiales

### Critical Path Glow

El efecto de glow en tareas críticas se adapta al tema:

**Tema Oscuro:**
- Glow púrpura brillante
- Animación pulsante intensa

**Tema Claro:**
- Glow púrpura suave
- Sombra sutil adicional
- Mantiene visibilidad sin ser agresivo

```css
.light .critical-path-glow {
  box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
}
```

---

## 📱 Responsive y Accesibilidad

### Contraste

Ambos temas cumplen con WCAG AA:

- **Oscuro**: Texto claro sobre fondo oscuro (ratio 12:1)
- **Claro**: Texto oscuro sobre fondo claro (ratio 15:1)

### Preferencias del Usuario

Respeta las preferencias de accesibilidad:

- `prefers-color-scheme`: Detecta preferencia del sistema
- `prefers-reduced-motion`: Reduce animaciones si está activo

---

## 🔨 Personalización Avanzada

### Agregar Nuevos Colores

1. Edita `tailwind.config.ts`:

```typescript
colors: {
  'custom-color': '#hexcode',
}
```

2. Agrega variables CSS en `globals.css`:

```css
:root {
  --custom-color: r g b;
}

.light {
  --custom-color: r g b;
}
```

3. Usa en componentes:

```tsx
<div className="bg-custom-color">...</div>
```

### Crear Tema Personalizado

Puedes crear temas adicionales:

```typescript
// lib/theme-provider.tsx
type Theme = "dark" | "light" | "system" | "custom"
```

---

## 🐛 Solución de Problemas

### El tema no cambia

1. Verifica que el botón de toggle esté visible
2. Limpia el localStorage: `localStorage.clear()`
3. Recarga la página (F5)

### Colores incorrectos

1. Verifica que uses las clases correctas (`text-text-primary` no `text-ink-primary`)
2. Asegúrate de que el componente esté dentro del `ThemeProvider`
3. Revisa que no haya estilos inline que sobrescriban

### Parpadeo al cargar

1. Verifica que `suppressHydrationWarning` esté en el `<html>`
2. Asegúrate de que el tema se cargue antes del render
3. Usa `defaultTheme` en el `ThemeProvider`

---

## 📊 Comparación de Temas

| Característica | Tema Oscuro | Tema Claro |
|---------------|-------------|------------|
| Fondo | Azul medianoche oscuro | Gris muy claro |
| Contraste | Alto (12:1) | Muy alto (15:1) |
| Fatiga visual | Baja en ambientes oscuros | Baja en ambientes iluminados |
| Consumo energía | Menor (OLED) | Mayor |
| Profesionalidad | Técnico, moderno | Limpio, corporativo |
| Mejor para | Trabajo nocturno, desarrollo | Oficina, presentaciones |

---

## 🎓 Mejores Prácticas

### Para Usuarios

✅ **Sí hacer:**
- Usa el tema que sea más cómodo para tus ojos
- Cambia según la hora del día
- Prueba el modo automático
- Ajusta el brillo de tu pantalla

❌ **No hacer:**
- No fuerces un tema si te causa fatiga visual
- No uses tema claro en ambientes muy oscuros
- No ignores las preferencias de accesibilidad

### Para Desarrolladores

✅ **Sí hacer:**
- Usa variables CSS para colores
- Prueba ambos temas al desarrollar
- Mantén contraste adecuado
- Usa clases semánticas (`text-text-primary`)

❌ **No hacer:**
- No uses colores hardcodeados
- No asumas que todos usan tema oscuro
- No olvides probar el critical path glow
- No uses `text-white` o `text-black` directamente

---

## 🚀 Futuras Mejoras

Próximas funcionalidades planeadas:

- 🎨 Temas personalizados por usuario
- 🌈 Selector de colores de acento
- 📅 Cambio automático según hora del día
- 💾 Sincronización entre dispositivos
- 🎭 Temas adicionales (high contrast, sepia)
- 🔧 Editor visual de temas

---

## 📚 Recursos

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

**¡Disfruta de tu tema preferido! 🌓**
