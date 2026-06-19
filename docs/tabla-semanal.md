# Especificaciones de Diseño — Tabla de Planificación de Viandas

> Este documento describe el diseño visual de la tabla principal. No incluye funcionalidad ni lógica de negocio. Sirve como punto de partida para iteraciones futuras.

---

## 1. Filosofía de diseño

La tabla es el centro de la aplicación. El objetivo es que un planificador de viendas la vea y en menos de un segundo entienda:
- Qué días tienen platos asignados
- Qué tipo de menú tiene cada celda
- Dónde hacer clic para agregar o editar

El diseño prioriza **claridad > densidad > ornamentación**.

---

## 2. Layout de la tabla

### Estructura de columnas

```
[Día] | [Menú Saludable] | [Menú Tradicional] | [Menú Vegetariano]
 120px |        1fr        |        1fr         |        1fr
```

- **Columna de días**: Ancho fijo de 120px. Fondo sutil gris. Texto en negrita para el día corto ("Vie 19") y descripción completa debajo en tamaño más pequeño.
- **Columnas de menú**: Ocupan el resto del ancho en partes iguales. Cada celda centrada vertical y horizontalmente.

### Separadores
- Líneas horizontales entre filas: `border-b border-gray-100` (1px, gris muy claro)
- Líneas verticales entre columnas de menú: `border-r border-gray-100`
- Sin borde vertical en la última columna
- Sin borde horizontal en la última fila

### Bordes externos
- Contenedor de la tabla: `rounded-2xl` con `border border-gray-200` y `shadow-sm`
- Fondo del contenedor: blanco (`bg-white`)

---

## 3. Estados de celda

### 3.1 Celda vacía (sin plato seleccionado)

```
┌─────────────────────────────┐
│  [+]  Agregar                │
│  (círculo gris con ícono)    │
└─────────────────────────────┘
```

- **Forma**: `rounded-xl`, ancho completo de la celda (`w-full`)
- **Borde**: `border-2 border-dashed border-gray-200`
- **Hover**: `hover:border-gray-300 hover:bg-gray-50/50`
- **Transición**: `transition-all duration-200`
- **Contenido**: Círculo de 32px (`w-8 h-8`) con fondo `bg-gray-100` que en hover pasa a `bg-gray-200`. Ícono `Plus` de 16px (`w-4 h-4`) en color `text-gray-400` que en hover pasa a `text-gray-600`. Texto "Agregar" en `text-xs font-medium text-gray-400` que en hover pasa a `text-gray-500`.
- **Padding**: `px-4 py-6` (más alto que ancho para que sea "clickeable")
- **Espaciado interno**: `gap-2` entre círculo y texto
- **Efecto**: Todo el grupo de elementos cambia en hover simultáneamente

### 3.2 Celda con plato seleccionado

```
┌─────────────────────────────┐
│ [🥗]  Tarta de verdura      │
│       Calabaza, espinaca...   │
│                        [✎][🗑]│
└─────────────────────────────┘
```

- **Forma**: `rounded-xl`, ancho completo (`w-full`), `relative` (para posicionar botones de acción)
- **Borde**: `border-2` en color sutil por tipo de menú:
  - Saludable: `#a7f3d0` (verde claro)
  - Tradicional: `#bae6fd` (azul claro)
  - Vegetariano: `#fde68a` (amarillo/naranja claro)
- **Fondo**: `bgColor` por tipo de menú:
  - Saludable: `#ecfdf5`
  - Tradicional: `#f0f9ff`
  - Vegetariano: `#fffbeb`
- **Hover**: `hover:shadow-md` (sombra suave que hace "levantar" la celda)
- **Transición**: `transition-all duration-200`
- **Padding**: `px-3 py-3`

#### Contenido interno
- **Layout**: Flex horizontal, `gap-2.5`, alineado al inicio (`items-start`)
- **Ícono de menú**: Cuadrado redondeado de 32px (`w-8 h-8 rounded-lg`) con fondo sutil (`iconBg`) y color del ícono (`color`). Alineado arriba (`mt-0.5`).
- **Texto**: 
  - Nombre del plato: `text-sm font-semibold leading-tight` en color del texto del menú (`textColor`)
  - Descripción: `text-xs text-gray-500 mt-0.5 leading-tight line-clamp-2` (máximo 2 líneas, con elipsis)
- **Truncado**: `min-w-0` y `truncate` en el contenedor para que texto largo no rompa el layout

#### Acciones (editar / eliminar)
- **Visibilidad**: `opacity-0` por defecto, `opacity-1` en hover del grupo (`group-hover:opacity-100`)
- **Posición**: `absolute top-2 right-2` (flotando arriba-derecha de la celda)
- **Layout**: `flex items-center gap-1`
- **Botones**: `p-1.5` con `rounded-lg`, fondo `bg-white/90` (semi-transparente), hover `bg-white`, `shadow-sm`, `border border-gray-200`
- **Íconos**: `Pencil` (3x3px) en `text-gray-600` y `Trash2` en `text-red-500`
- **Transición**: `transition-opacity` en los botones para que aparezcan suavemente

---

## 4. Cabecera de la tabla

### Columna de días
- Etiqueta: "DÍA" en `text-xs font-semibold text-gray-400 uppercase tracking-wider`
- Posición: `px-4 py-3` alineado a la izquierda

### Columnas de menú
- **Layout**: Centrado (`text-center`)
- **Estructura**: Flex horizontal centrado con `gap-2`
- **Ícono**: Cuadrado de 28px (`w-7 h-7 rounded-lg`) con fondo `iconBg` e ícono coloreado con `color`
- **Texto**:
  - Nombre del menú: `text-sm font-semibold` en color `textColor`
  - Precio: `text-xs font-medium text-gray-400` debajo

---

## 5. Columna de días (lateral izquierda)

- **Ancho**: 120px fijo
- **Fondo**: `bg-gray-50/50` (gris muy tenue, semi-transparente)
- **Borde derecho**: `border-r border-gray-100`
- **Contenido**: Centrado verticalmente (`flex flex-col justify-center`)
- **Día corto**: `text-sm font-bold text-gray-900` (ej: "Vie 19")
- **Fecha completa**: `text-xs text-gray-500 mt-0.5` (ej: "Viernes 19 de junio")

---

## 6. Colores por tipo de menú

| Menú | Border | Bg (celda) | Icon Bg | Texto |
|---|---|---|---|---|
| Saludable | `#a7f3d0` | `#ecfdf5` | `#d1fae5` | `#065f46` |
| Tradicional | `#bae6fd` | `#f0f9ff` | `#e0f2fe` | `#075985` |
| Vegetariano | `#fde68a` | `#fffbeb` | `#fef3c7` | `#92400e` |

Todos los colores son del sistema Tailwind (emerald-200, sky-200, amber-200, etc.) pero aplicados manualmente para control exacto.

---

## 7. Resumen inferior (footer)

- **Posición**: Debajo de la tabla, `mt-6`
- **Forma**: `rounded-xl` con `bg-gray-50` y `border border-gray-200`
- **Padding**: `px-4 py-4`
- **Layout**: `flex items-center justify-between`
- **Izquierda**: Resumen por tipo de menú. Cada uno tiene:
  - Ícono de 24px (`w-6 h-6 rounded-md`) con fondo `iconBg` y color
  - Texto: `text-sm text-gray-600` con cantidad en `font-semibold text-gray-900`
  - Separados por `gap-6`
- **Derecha**: Total estimado
  - Etiqueta: `text-sm text-gray-500`
  - Monto: `font-bold text-gray-900`
  - Ícono `ArrowRight` de 14px en `text-gray-400`

---

## 8. Principios aplicados

1. **Jerarquía visual clara**: Los platos seleccionados tienen más peso visual (color + sombra) que las celdas vacías. Esto guía la atención a lo que ya está planificado.

2. **Código de colores intuitivo**: Cada tipo de menú tiene su propia "personalidad" de color (verde=saludable, azul=tradicional, naranja=vegetariano). El usuario aprende esto una vez y luego reconoce al instante.

3. **Progresive disclosure**: Las acciones de editar/eliminar no están siempre visibles. Aparecen solo al hover, reduciendo la carga visual sin sacrificar funcionalidad.

4. **Espaciado generoso**: `px-3 py-3` en celdas, `px-4 py-5` en la columna de días. La tabla no se siente "amontonada".

5. **Bordes sutiles**: Las líneas divisorias son gris-100 (`#f3f4f6`), casi invisibles pero suficientes para delimitar. Nunca negro puro.

6. **Hover states significativos**: Toda la celda responde al hover. No solo el botón, no solo el borde. Todo cambia simultáneamente.

7. **Border radius consistente**: Todas las celdas, botones, y contenedores usan `rounded-xl` o `rounded-2xl`. No hay esquinas puntiagudas.

---

## 9. Oportunidades de iteración (ideas para el futuro)

- **Strikethrough para platos eliminados**: Si se quiere "desactivar" sin borrar, un estado con línea tachada y opacidad reducida.
- **Mini thumbnails de platos**: Agregar una imagen pequeña (40x40px) en la celda junto al ícono.
- **Badges de información**: Calorías, alérgenos, o etiquetas "Nuevo" en la celda.
- **Diferentes densidades**: Un toggle para cambiar entre "compacto" (menos padding) y "expandido" (más info visible).
- **Celdas con preview de imagen**: Reemplazar el ícono genérico por una foto real del plato.
- **Estado "loading"**: Skeleton shimmer mientras carga los datos del backend.
- **Drag & drop visual**: Un estado "arrastrando" con borde punteado animado y sombra más pronunciada.
- **Resaltado de día actual**: La fila del día de hoy con un borde izquierdo de 3px en color de acento.
- **Tooltips**: Al hover sobre la celda, mostrar más detalles del plato (precio, ingredientes completos).
- **Colapsar días**: Botón para colapsar/expandir filas de días que ya pasaron.
- **Modo oscuro**: Invertir todos los colores (bg gris oscuro, texto claro, celdas con fondos oscuros sutil).
