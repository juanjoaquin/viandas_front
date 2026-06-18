# Especificaciones de Iteración para la Interfaz de Clientes

Este documento contiene la estructura y las directivas visuales y funcionales de la sección principal de la aplicación **Viandas App** (excluyendo el Sidebar de navegación). Utiliza este archivo para guiar a cualquier IA en el desarrollo, iteración y mantenimiento de los componentes principales.

---

## 🎨 Principios de Diseño Coherente (Sleek Slate Theme)
- **Tipografía**: Títulos sin serifas limpios (`Inter` o similar) combinados con fuentes monospace (`JetBrains Mono`) para datos y métricas secundarias si es necesario.
- **Micro-interacciones**: Transiciones suaves al pasar el mouse por encima (`hover:bg-slate-50`) y feedback visual instantáneo (ej. confirmación al copiar).
- **Consistencia Visual**: Bordes redondeados consistentes (`rounded-xl` y `rounded-lg`) y sombras sutiles (`shadow-3xs`, `shadow-xs`).

---

## 🏗️ Estructura del Layout Principal (Ignorar Sidebar de Navegación)

### 1. Cabecera (Header Area)
El encabezado está fijado en la parte superior del contenido principal (`sticky top-0 z-10 bg-white`):
- **Migas de pan (Breadcrumbs)**: Indicadores de plataforma sutiles en mayúsculas (`PLATAFORMA / CLIENTES` o `REPARTOS`).
- **Título**: Letra grande en negrita (`text-xl font-bold text-slate-900`).
- **Descripción**: Subtítulo explicativo breve, de color uniforme (`text-xs text-slate-500`).
- **Botón de Acción**: Botón llamativo pero elegante tipo *"Agregar Cliente"* en la esquina superior derecha (`bg-emerald-600 hover:bg-emerald-700 text-white`).

---

### 2. Tarjeta de Controles de Búsqueda y Filtros
Ubicada justo encima de la tabla de registros:
- **Control Segmentado (Tabs)**: Tres botones agrupados con un fondo claro (`bg-slate-100`) para filtrar por tipo: **"Todos"**, **"Empresas"** y **"Particulares"**.
  - El botón seleccionado tiene un fondo blanco puro con un borde sutil para denotar elevación física.
  - El tag de *"Todos"* lleva un badge integrado con el conteo numérico total filtrado.
- **Buscador (Search Input)**: Campo de texto redondeado con icono de lupa a la izquierda y un botón dinámico con una `"X"` para borrar el término de búsqueda ingresado.

*(Nota: Se eliminaron por completo las tarjetas de métricas del dashboard superior y los desplegables de dietas/estados que anteriormente ocupaban esta sección.)*

---

### 3. Tabla de Clientes (Customers Table)
Un contenedor de color blanco con bordes redondeados y sombra sutil (`rounded-xl border border-slate-200 overflow-hidden`):

#### **Columnas Definidas (En orden riguroso)**:
1. **Nombre**
   - **Icono de Inicial**: Un avatar circular redondeado (`rounded-full`) con fondo gris sutil (`bg-slate-100 border-slate-200`) que muestra únicamente la primera inicial en mayúscula del nombre del cliente.
   - **Nombre en Negrita**: Se muestra el nombre del cliente con un corte de texto elegante en pantallas reducidas (`truncate font-bold`).
   - **Contacto Corporativo**: Si el cliente es de tipo *Empresa* y tiene un representante asignado, añade un detalle secundario en letra pequeña: `👤 Contacto: [Nombre del Contacto]`.
2. **Tipo**
   - Se representa utilizando un badge con icono integrado:
     - **Empresa**: Color azul/índigo con un icono de maletín (`Briefcase`).
     - **Particular**: Color naranja con un icono de usuario (`User`).
3. **Teléfono**
   - Muestra el número telefónico en fuente monoespaciada para óptima legibilidad.
   - Integra funcionalidad de click para copiar automáticamente al portapapeles, proporcionando un feedback visual inmediato que dice *"Copia OK"*.
4. **Dirección**
   - Muestra el domicilio de entrega con estilos limpios sin ningún tipo de horas, agendas ni elementos extras relacionados a agendas térmicas o campanas.
5. **Acciones**
   - Ubicadas hacia el extremo derecho con alineación derecha de la columna (`text-right`).
   - Botones minimalistas en cuadrícula compacta:
     - **Imprimir**: Icono de impresora (`Printer`) para stickers de viandas.
     - **Editar**: Icono de lápiz (`Edit3`) para modificar registros.
     - **Eliminar**: Icono de basura (`Trash2`) con feedback de peligro rojizo al pasar el ratón.

---

### 4. Pie de Tabla e Historiales
Se ubica al pie de la tabla de datos como cierre visual del grid:
- **Conteo General**: Indica el número actual de clientes mostrados respecto al total general (`Mostrando [X] clientes de un total de [Y] registrados.`).
- **Estado Vacío (Empty State)**: Si la búsqueda no arroja registros, muestra un contenedor centrado con un icono de bandeja vacía (`Inbox`), título amigable, aviso de *"No se encontraron registros que coincidan..."* y un botón manual de *"Remover Filtros"*.

---

## 🚫 Restricciones y Directivas de Mantenimiento para la IA
1. **NO modificar el Sidebar izquierdo**: Toda la barra lateral de navegación con el menú de viandas corporativas, preferencias, logotipo de control y versiones debe permanecer intacto.
2. **NO reintroducir la selección de checklists grupales**: El borrado grupal o despachos masivos con selectores cuadrados en cada fila fue desestimado para priorizar la limpieza y flujo directo en cada fila de datos de cliente.
3. **NO agregar de vuelta las insignias de dieta (Sin TACC, Vegano) ni estados (Activo, Pausado) en las celdas principales de la tabla**: El usuario prefiere un despliegue literal, directo y sin ruido visual en este tablero.
