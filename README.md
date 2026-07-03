# Urbetrack Control

SPA de gestión de higiene urbana desarrollada como desafío técnico para Urbetrack. Es un centro de operaciones donde un operador municipal monitorea el estado del mobiliario urbano (papeleras, contenedores, bancos), hace seguimiento de incidentes reportados en la vía pública, y administra la flota de vehículos asignada a cada zona de la ciudad.

## Vista previa

<img width="1917" height="967" alt="Captura de pantalla 2026-07-02 174251" src="https://github.com/user-attachments/assets/b4032453-2634-4bb8-9918-9636e0bf84b8" />


## Stack

- **React 19 + TypeScript + Vite** — requisitos excluyentes del desafío.
- **React Query (@tanstack/react-query)** — fetching, cache, sincronización e invalidación de datos del servidor.
- **Zustand** — estado global de UI (zona activa seleccionada en el sidebar).
- **Zod** — validación de formularios de alta, con los mismos schemas sirviendo de fuente de verdad para los tipos (`z.infer`).
- **Tailwind CSS v4** — estilos, vía el plugin oficial `@tailwindcss/vite`.
- **Radix UI** (Dialog, Select, Label, Toast) — primitivos accesibles sin estilos, con wrappers propios en `src/components/ui`.
- **React Router** — navegación entre Panel / Assets / Incidentes / Flota.
- **Vitest + React Testing Library** — tests unitarios y de componentes.

## Cómo correrlo

**1. Backend** (mockeado, provisto por Urbetrack):

```bash
# en la carpeta del backend
pnpm dev
# queda escuchando en http://localhost:3000
```

**2. Frontend:**

```bash
pnpm install
pnpm run dev
# http://localhost:5173
```

El frontend pega a `/api/*`, que Vite redirige a `http://localhost:3000/*` (ver `server.proxy` en `vite.config.ts`). Esto evita configurar CORS en el backend mockeado.

**3. Tests:**

```bash
pnpm test        # una corrida
pnpm test:watch  # modo watch
```

**4. Build de producción:**

```bash
pnpm build
pnpm preview
```

## Funcionalidades

- Dashboard con métricas generales por ciudad o zona.
- Listado de Assets con filtros por tipo y estado, con vista en tabla o mapa.
- Alta de Assets.
- Listado de Incidentes con filtros por tipo, estado y zona.
- Alta de Incidentes.
- Listado de Vehículos con filtros por tipo, estado y zona.
- Alta de Vehículos.
- Selección global de zona desde el sidebar.
- Paginación en los listados.
- Validación de formularios con Zod.

## Concepto y alcance

La consigna pedía temática libre "relacionada a logística de higiene urbana". El backend mockeado expone 3 entidades reales — **Assets** (papeleras/contenedores/bancos), **Incidentes** (desbordes, daños, basurales) y **Vehículos** — todas relacionadas entre sí por `zoneId`. A partir de ese modelo, el proyecto se plantea como un **centro de operaciones**: el operador elige una zona en el sidebar o ve la ciudad completa y desde ahí monitorea assets, gestiona incidentes y consulta la flota disponible.

### User stories planificadas

| # | Historia | Estado |
|---|----------|--------|
| 1 | Como operador, quiero ver un panel con el estado general de la ciudad (o de una zona) para priorizar dónde intervenir | Implementada |
| 2 | Como operador, quiero listar y filtrar assets por tipo y estado para ubicar rápido lo que necesita atención | Implementada |
| 3 | Como operador, quiero dar de alta un asset urbano nuevo | Implementada |
| 4 | Como operador, quiero listar y filtrar incidentes por tipo, estado y zona | Implementada |
| 5 | Como operador, quiero reportar un incidente nuevo | Implementada |
| 6 | Como operador, quiero ver la flota de vehículos por zona, tipo y estado | Implementada |
| 7 | Como operador, quiero dar de alta un vehículo nuevo | Implementada |
| 8 | Como operador, quiero cambiar el estado de un incidente (`REPORTED → IN_PROGRESS → RESOLVED`) | No implementada — ver "Decisiones" |

Prioricé las historias 1–7 porque cubren las tres entidades del dominio con filtros y alta (que sí están documentadas y soportadas por el backend), dejando el panel como pieza que integra toda la información. La historia 8 quedó fuera del alcance de forma consciente (ver más abajo).

## Decisiones de diseño técnicas

- **Por qué no hay cambio de estado de incidentes vía API**: `API.md` sólo documenta `GET` y `POST` para `/incidents` — no hay `PATCH`/`PUT`. Antes que simular una mutación optimista contra un endpoint que no existe (y que se pisaría solo en el próximo refetch), preferí no construir esa feature y dejarla documentada como próximo paso, a la espera de que el backend exponga la transición de estado.
- **Filtro de zona en Assets es client-side**: `/assets` sólo documenta `status` y `type` como query params (no `zoneId`), mientras que `/incidents` y `/vehicles` sí soportan `zoneId`. Para Assets, el filtro de zona activa se aplica sobre la respuesta ya traída en el cliente; para Incidentes y Vehículos viaja como query param real. Está comentado en el código (`AssetsPage.tsx`) para que quede claro por qué el patrón difiere entre páginas.
- **Formularios con `FormData` + Zod, sin librería de forms**: dado el tamaño de los formularios (4-6 campos, sin campos dependientes complejos), usar `react-hook-form` hubiese sido una dependencia más para un problema chico. Los schemas de `src/types/index.ts` validan el `FormData` crudo (con `z.coerce` para lat/lng/capacity) y los errores se mapean a cada campo.
- **Radix Select vs. `<select>` nativo**: Radix `Select` no participa de `FormData` (su estado vive fuera del DOM del form), así que se usa sólo para los filtros controlados de las páginas de listado. Los formularios de alta usan un `<select>` nativo estilizado (`components/ui/NativeSelect.tsx`) para poder leer todo con `FormData` sin duplicar estado por campo.
- **Zona activa en Zustand, no en la URL**: se comparte entre Panel/Assets/Incidentes/Flota. Preferí un store global chico antes que levantar el estado hasta `App` o persistirlo en la URL, que hubiese sido razonable pero agregaba complejidad de sincronización no justificada para el alcance del desafío.
- **Identidad visual**: paleta oscura + acento naranja señal — evocando uniformes/camiones de higiene urbana y tableros de control municipal, sin caer en el "dashboard SaaS genérico". Tipografía Space Grotesk (display) + Inter (texto) + IBM Plex Mono (datos: badges de estado, IDs, fechas), para separar visualmente "dato crudo" de "contenido editorial".

## Estructura

```
src/
  components/ui/       # sistema de diseño: Button, Badge, Select, Dialog, Field, Toast, etc.
  components/layout/    # AppShell (sidebar + nav), PageHeader
  features/
    assets/            # api, hooks (React Query), componentes (página, tabla, form de alta)
    incidents/
    vehicles/
    zones/             # sólo lectura (GET /zones, GET /zones/:id)
  pages/               # DashboardPage (agrega datos de los 3 dominios)
  store/               # useZoneFilterStore (Zustand)
  types/                # tipos + schemas Zod, únicos por todo el proyecto
  lib/                  # cliente http, utils (cn, formatDate)
```

## Arquitectura

El proyecto sigue una organización por funcionalidades (*feature-first*), donde cada dominio encapsula sus componentes, hooks y acceso a la API.

```text
src/
  features/
    assets/
    incidents/
    vehicles/
    zones/
```

Los componentes reutilizables se concentran en `components/ui`, mientras que la infraestructura compartida (`lib`, `store` y `types`) permanece desacoplada de las features para favorecer la reutilización y el mantenimiento. Esta organización permite que cada módulo evolucione de forma independiente, manteniendo una separación clara entre la lógica de negocio, la presentación y los servicios compartidos.

 ❤️ Hecho con amor by Andrés Vallarino.
