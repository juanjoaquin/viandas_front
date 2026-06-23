# Paleta de colores — Viandas Front

Documentación de los colores utilizados en la aplicación. La fuente principal del sistema de diseño está en [`app/globals.css`](app/globals.css).

## Resumen

| Aspecto | Valor |
|---------|-------|
| **Filosofía** | Opción A — verde petróleo + turquesa de acento |
| **Sidebar** | Verde petróleo estructural (`#08372E`) |
| **Acción / botones** | Turquesa vivo (`#1D9E75`) — separado del sidebar |
| **Contenido** | Blanco neutro, sin tinte verde |
| **Formato** | OKLCH (variables CSS) |
| **Temas** | Claro (`:root`) y oscuro (`.dark`) |
| **Border radius base** | `0.625rem` (10px) |

---

## Filosofía de la paleta

- El **sidebar** es puramente estructural: verde petróleo casi negro, no compite con el contenido.
- El **turquesa vivo** queda reservado para lo accionable: botones primarios, ítem activo del menú, focus ring, tags.
- El **contenido** mantiene fondo blanco y bordes grises neutros.

---

## Arquitectura de tokens

Sidebar y acción usan tokens **independientes**:

```css
/* Sidebar — navegación */
--sidebar: #08372E;
--sidebar-active: #1D9E75; /* turquesa, ítem activo */

/* Acción — botones, links, focus */
--primary: var(--brand); /* #1D9E75 */
--primary-hover: #0F6E56;
--primary-foreground: #FFFFFF;
```

---

## Sidebar

| Token | Modo claro | Hex | Uso |
|-------|------------|-----|-----|
| `--sidebar` | `oklch(0.27 0.045 165)` | `#08372E` | Fondo del panel lateral |
| `--sidebar-foreground` | `oklch(1 0 0)` | `#FFFFFF` | Texto e iconos (todos los estados) |
| `--sidebar-accent` | `oklch(0.33 0.055 165)` | `#0F4A3D` | Hover en ítem inactivo |
| `--sidebar-accent-foreground` | `oklch(1 0 0)` | `#FFFFFF` | Texto en hover |
| `--sidebar-active` | `oklch(0.58 0.125 165)` | `#1D9E75` | Fondo ítem activo |
| `--sidebar-active-foreground` | `oklch(1 0 0)` | `#FFFFFF` | Texto ítem activo |
| `--sidebar-primary` | `oklch(0.58 0.125 165)` | `#1D9E75` | Icono del logo |
| `--sidebar-primary-foreground` | `oklch(1 0 0)` | `#FFFFFF` | Icono sobre turquesa |
| `--sidebar-border` | blanco 8% | — | Separadores |
| `--sidebar-ring` | turquesa | `#1D9E75` | Focus ring |

**Estados del menú:**

| Estado | Token | Hex |
|--------|-------|-----|
| Normal | `--sidebar` + `--sidebar-foreground` | `#08372E` / `#FFFFFF` |
| Hover | `--sidebar-accent` | `#0F4A3D` / `#FFFFFF` |
| Activo | `--sidebar-active` | `#1D9E75` / `#FFFFFF` |

---

## Acción (brand / primary)

Botones `default`, `brand`, paginador activo y focus ring.

| Token | Hex | Clase Tailwind |
|-------|-----|----------------|
| `--brand` / `--primary` | `#1D9E75` | `bg-primary`, `bg-brand` |
| `--brand-foreground` | `#FFFFFF` | `text-primary-foreground` |
| `--brand-hover` / `--primary-hover` | `#0F6E56` | `hover:bg-primary-hover` |
| `--brand-muted` | `#E1F5EE` | `bg-brand-muted` |
| `--brand-muted-foreground` | `#04342C` | `text-brand-muted-foreground` |
| `--ring` | `#1D9E75` | `ring-ring`, focus en inputs |

---

## Contenido (modo claro)

| Token | Hex | Clase Tailwind |
|-------|-----|----------------|
| `--background` | `#FFFFFF` | `bg-background` |
| `--foreground` | `#1A1A1A` | `text-foreground` |
| `--card` | `#FFFFFF` | `bg-card` |
| `--muted` | gris muy claro | `bg-muted` |
| `--muted-foreground` | `#6B6B6B` | `text-muted-foreground` |
| `--border` | `#E5E5E5` | `border-border` |

---

## Estados semánticos

| Estado | Token | Hex |
|--------|-------|-----|
| Error (texto) | `--destructive` | `#E24B4A` |
| Error (fondo) | `--destructive-subtle` | `#FCEBEB` |
| Éxito | `--success` | `#639922` |
| Disabled | `--disabled` | `#B4B2A9` |

---

## Modo oscuro

- Sidebar: petróleo ligeramente más claro para contraste.
- Contenido: fondo `#141414` aprox., tarjetas oscuras neutras.
- Turquesa de acción: **sin cambio** (`#1D9E75`) — mantiene visibilidad sobre fondos oscuros.
- Badges: `--brand-muted` pasa a tono petróleo oscuro con texto menta.

---

## Gráficos

| Token | Descripción |
|-------|-------------|
| `--chart-1` | Turquesa de marca |
| `--chart-2` | Cian |
| `--chart-3` | Azul claro |
| `--chart-4` | Coral |
| `--chart-5` | Rojo coral |

---

## Variantes de botón

Definidas en [`components/ui/button.tsx`](components/ui/button.tsx):

| Variante | Colores |
|----------|---------|
| `default` / `brand` | `bg-primary` (`#1D9E75`) / `hover:bg-primary-hover` (`#0F6E56`) |
| `secondary` | `bg-secondary` neutro |
| `outline` | `border-border` / `bg-background` |
| `ghost` | `hover:bg-muted` |
| `destructive` | `bg-destructive/10` / `text-destructive` |
| `link` | `text-primary` |

---

## Badges

Definidos en [`components/ui/badge.tsx`](components/ui/badge.tsx):

| Variante | Colores |
|----------|---------|
| `default` / `success` | `bg-brand-muted` (`#E1F5EE`) / `text-brand-muted-foreground` (`#04342C`) |
| `destructive` | `bg-destructive-subtle` / `text-destructive` |

---

## Fondo del body

| Modo | Valor |
|------|-------|
| Claro | Puntos grises sutiles sobre `#FFFFFF` |
| Oscuro | Puntos blancos al 5% |

---

## Referencias

- Archivo principal: [`app/globals.css`](app/globals.css)
- Sidebar UI: [`components/ui/sidebar.tsx`](components/ui/sidebar.tsx)
- App sidebar: [`app/(plataforma)/components/app-sidebar.tsx`](app/(plataforma)/components/app-sidebar.tsx)
