# jsgraph-workspace

Monorepo (pnpm + TypeScript) que unifica las dos apps construidas sobre el
framework **wabis** (jsg / jsgx3d, © Walter Bislins) y elimina la duplicación
del motor gráfico entre ellas.

> Alcance: solo las apps que usan wabis. Los demás proyectos de `wikiterra-apps/`
> (clock-24h-sun, moon-photos-map, sphere-drop-calc, aether-cosmology-fed-model)
> son repos independientes y **no** forman parte de este monorepo.

## Estructura

```
packages/
  jsgraph-vendor/        Único package compartido:
    src/                 · framework wabis, INTACTO salvo parches mínimos (ver MIGRATION-PLAN §8)
    src/core/            · seam SOLID propio (createGraph3D + port Graph3D.ts)
apps/
  earth-drop-calc/  Calculadora de curvatura/caída (piloto de migración).
  fed-wabis-v2/     Flat Earth Dome Model (wabis-calc-v2).
```

> Hubo dos packages (`jsgraph-vendor` + `jsgraph-core`); el "core" quedó tan fino
> (un adapter) que se fusionó en uno solo. El seam vive en `jsgraph-vendor/src/core/`.

## Principio de dependencias (DIP)

`apps → core seam (createGraph3D) → wabis`

Las apps llaman a **nuestro** `createGraph3D`, no al global del framework
(`NewGraphX3D`). Cambiar el motor de render en el futuro (p. ej. a three.js) es
reescribir solo ese adapter, sin tocar las apps.

## Comandos

```bash
pnpm install                       # instala dependencias del workspace
pnpm --filter earth-drop-calc dev  # arranca una app (Vite per-app)
pnpm --filter fed-wabis-v2 dev     # la otra
pnpm dev                           # o el Vite raíz: sirve AMBAS (sub-paths /apps/…)
pnpm build     # build estático unificado de las dos apps → dist/ (GitHub Pages)
pnpm preview   # sirve dist/ localmente (como lo verá Pages)
pnpm characterize  # red de seguridad: snapshots matemáticos + screenshots de canvas
pnpm typecheck     # type-check del seam TS (src/core)
pnpm lint          # ESLint (ignora vendor y código legacy)
```

Las dos apps comparten un **único** vendor wabis (`packages/jsgraph-vendor/src`) y
cada una lo carga con un único entry ESM (`js/main*.js`) por *bare specifiers*, así que
Vite las empaqueta igual y `pnpm --filter <app> dev` funciona en ambas.

> **No** abrir `index.html` con VSCode Live Preview ni un servidor estático de
> archivos: los *bare specifiers* (`import 'jsgraph-vendor/src/wiki.js'`) sólo los
> resuelve Vite/pnpm (`bare specifier ... was not remapped to anything`).
> 
> Para desarrollo local necesitas **Vite** (`pnpm dev` o `pnpm --filter <app> dev`).
> Las apps NO funcionan con doble clic (`file://`) ni servidores estáticos simples
> por los bare specifiers ESM.

Ver [MIGRATION-PLAN.md](../MIGRATION-PLAN.md) para el plan por fases.
