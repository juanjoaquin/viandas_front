# Fetch + Suspense en Next.js — Patrón `*Data` Component

## El problema con fetch en el Page

```tsx
// ❌ Así Suspense no tiene efecto
async function Page() {
  const data = await fetch('/api/ia-models') // bloquea todo el page
  return (
    <Suspense fallback={<Skeleton />}>
      <AITable data={data} /> {/* los datos ya llegaron, no suspende */}
    </Suspense>
  )
}
```

Suspense necesita que el fetch ocurra **dentro** del componente que envuelve, no antes.

---

## La solución — Patrón `*Data` Component

### Estructura de archivos

```
app/ai/
├── page.tsx             ← layout + Suspense (sync)
├── AITableData.tsx      ← fetch
├── AITable.tsx          ← presentación pura
└── AITableSkeleton.tsx  ← placeholder visual
```

---

### `page.tsx` — Solo layout, sin async

```tsx
import { Suspense } from 'react'
import { AITableData } from './AITableData'
import { AITableSkeleton } from './AITableSkeleton'

export default function AIPage() {
  return (
    <main>
      <h1>Modelos IA</h1>

      <Suspense fallback={<AITableSkeleton />}>
        <AITableData />
      </Suspense>
    </main>
  )
}
```

> El page es **sync**. Su único rol es definir el layout y los boundaries de Suspense.

---

### `AITableData.tsx` — Dueño del fetch

```tsx
import { AITable } from './AITable'
import { AIModel } from './types'

export async function AITableData() {
  const res = await fetch('/api/ia-models', {
    next: { revalidate: 60 }, // o cache: 'no-store' para real-time
  })
  const data: AIModel[] = await res.json()

  return <AITable data={data} />
}
```

> Este es el único componente `async`. Suspende hasta que el fetch termina.

---

### `AITable.tsx` — Presentación pura

```tsx
import { AIModel } from './types'

export function AITable({ data }: { data: AIModel[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Provider</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {data.map(model => (
          <tr key={model.id}>
            <td>{model.name}</td>
            <td>{model.provider}</td>
            <td>{model.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

> Sync, sin lógica de datos. Testeable con mocks, reutilizable en cualquier contexto.

---

### `AITableSkeleton.tsx` — Mismo layout que AITable

```tsx
export function AITableSkeleton() {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Provider</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <tr key={i}>
            <td><div className="skeleton w-32 h-4" /></td>
            <td><div className="skeleton w-24 h-4" /></td>
            <td><div className="skeleton w-16 h-4" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## Flujo en runtime

```
1. page.tsx renderiza inmediatamente (sync)
2. Suspense muestra <AITableSkeleton /> al instante
3. AITableData hace el fetch en el servidor
4. Cuando llegan los datos → React reemplaza el skeleton por <AITable data={...} />
```

---

## Escalando con múltiples secciones

Cuando el dashboard crece, cada sección tiene su propio `*Data` component y sus fetches corren **en paralelo**:

```tsx
// page.tsx
export default function AIPage() {
  return (
    <main>
      <Suspense fallback={<AITableSkeleton />}>
        <AITableData />       {/* fetch modelos */}
      </Suspense>

      <Suspense fallback={<MetricsSkeleton />}>
        <AIMetricsData />     {/* fetch métricas — no espera al de arriba */}
      </Suspense>

      <Suspense fallback={<LogsSkeleton />}>
        <AILogsData />        {/* fetch logs — tampoco espera */}
      </Suspense>
    </main>
  )
}
```

Cada sección aparece apenas sus datos llegan, sin bloquear a las demás.

---

## Resumen de responsabilidades

| Archivo          | Responsabilidad                        | ¿Async? |
|------------------|----------------------------------------|---------|
| `page.tsx`       | Layout + boundaries de Suspense        | No      |
| `*Data.tsx`      | Fetch + pasar datos al componente      | Sí      |
| `*Table.tsx`     | Renderizar datos (presentación pura)   | No      |
| `*Skeleton.tsx`  | Placeholder mientras carga             | No      |

---

## Cuándo NO necesitás el componente `*Data` separado

Si la tabla **nunca** va a ser reutilizada con otra fuente de datos, podés hacer el fetch directamente en ella:

```tsx
// Versión simplificada — válida si AITable no se reusar
export async function AITable() {
  const data = await fetch('/api/ia-models').then(r => r.json())
  return <table>...</table>
}
```

Pero en cuanto la tabla se reutilice o quieras testearla con mocks, el patrón `*Data` vale la pena.