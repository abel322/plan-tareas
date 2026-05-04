---
name: creador-de-habilidades
description: Esta habilidad permite al asistente crear nuevas habilidades personalizadas en el workspace siguiendo las mejores prácticas de Antigravity, en idioma español.
---

# Creador de Habilidades

Esta habilidad se utiliza para expandir las capacidades del asistente mediante la creación de nuevas habilidades ("skills") estructuradas y documentadas.

## Cuándo usar esta habilidad

Úsala cuando el usuario solicite crear una nueva "capacidad", "habilidad", "skill" o una guía de trabajo persistente para una tarea específica que no esté cubierta por las habilidades existentes.

## Cómo usar esta habilidad

Para crear una nueva habilidad, sigue estos pasos:

1. **Determinar el Nombre y Propósito**:
   - Define un nombre corto y descriptivo en minúsculas y con guiones (ej. `gestion-de-datos`).
   - Define una descripción clara de una sola oración.

2. **Estructura de Directorios**:
   - Crea una nueva carpeta en `.agents/skills/[nombre-de-la-habilidad]/`.
   - El archivo principal **DEBE** ser `SKILL.md`.

3. **Formato del archivo SKILL.md**:
   Todo `SKILL.md` debe comenzar con el siguiente bloque YAML:
   ```yaml
   ---
   name: [nombre-de-la-habilidad]
   description: [descripción de la habilidad]
   ---
   ```
   Seguido de secciones en Markdown que incluyan:
   - `# [Nombre de la Habilidad]`
   - `## Cuándo usar esta habilidad`: Define los disparadores o condiciones.
   - `## Cómo usar esta habilidad`: Instrucciones paso a paso para el asistente.
   - `## Mejores prácticas`: Consejos de implementación.

4. **Idioma**:
   - Tanto el archivo `SKILL.md` como las instrucciones internas deben estar en **español**, a menos que el usuario solicite lo contrario.

5. **Recursos Adicionales (Opcional)**:
   - Si la habilidad requiere scripts auxiliares, colócalos en una subcarpeta `scripts/`.
   - Si requiere ejemplos, colócalos en `examples/`.
   - Si requiere plantillas o datos, colócalos en `resources/`.

## Ejemplo de Estructura de un SKILL.md

```markdown
---
name: ejemplo-vuelo
description: Instrucciones para pilotar un dron de carga.
---

# Pilotaje de Drones de Carga

Esta habilidad guía al asistente en las maniobras de drones de carga.

## Cuándo usar esta habilidad
Cuando el usuario pida realizar un plan de vuelo o una entrega con drones.

## Cómo usar esta habilidad
1. Verificar batería.
2. Definir coordenadas GPS.
3. Ejecutar despegue vertical.
...
```

## Mandato para el Asistente
Al crear una nueva habilidad, asegúrate de que sea **específica**, **reutilizable** y **fácil de seguir**. Evita instrucciones genéricas; busca proporcionar valor real y automatización donde sea posible.
