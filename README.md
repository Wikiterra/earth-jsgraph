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
  curvature-drop-calc/  Calculadora de curvatura/caída (piloto de migración).
  fed-wabis/     Flat Earth Dome Model (wabis-calc-v2).
```

> Hubo dos packages (`jsgraph-vendor` + `jsgraph-core`); el "core" quedó tan fino
> (un adapter) que se fusionó en uno solo. El seam vive en `jsgraph-vendor/src/core/`.

## CSS (arquitectura por capas)

Una sola cascada, de lo compartido a lo específico. Cada app la carga en este orden:

| Capa           | Archivo                                         | Dueño      | Qué                                                                                                                                                |
|----------------|-------------------------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| 1. Tokens      | `jsgraph-vendor/src/core/tokens.css`            | compartido | **Única fuente** de colores, neutros, radios, sombras, **espaciado** (`--space-1..6`) y **touch target** (`--tap-min`). Documenta los breakpoints. |
| 2. Base vendor | `jsgraph-vendor/src/styles.css`                 | vendor     | Estilos del framework wabis (DOM generado: paneles, tabs). Solo lo usa edc. No tocar salvo parche.                                                 |
| 3. Componentes | `jsgraph-vendor/src/core/{shared,appShell}.css` | compartido | Tweaks de componentes comunes a ambas apps + barra de navegación.                                                                                  |
| 4. App         | `apps/<app>/styles/*.css`                       | por app    | Chrome y overrides propios. **Última capa, gana.**                                                                                                 |

- edc carga 1–4 vía `js/main.js` (imports ESM, en orden). fed carga tokens vía `@import`
  al inicio de su `styles/styles.css` y los componentes vía `main.js`.
- Ambas apps usan `styles/` (no `css/`). Los colores de marca (`#ff8033`…) viven **solo**
  en `tokens.css`; el resto referencia `var(--…)`. Colores semánticos de una sola app
  (resaltados de campos, cabeceras de panel) se quedan locales en su `*.css`.

**Mobile-first.** Estilos base = teléfono; se mejoran con `min-width`. Breakpoints
compartidos (las media queries no leen custom properties, son constantes acordadas):
teléfono = base · ajustes finos `<480` · tablet `≥768` · desktop `≥1100` (edc usa `≥1200`
para su grid de 2 columnas, donde las tablas de datos de 4 columnas ya caben sin recortar).
Objetivos táctiles vía `--tap-min` (44px); las tablas de datos de solo-lectura de edc
(4 col., DOM generado, no reflowables por CSS) hacen scroll horizontal dentro de su
`.Scroller` en teléfono mientras el resto de la página cabe en el viewport.

## Principio de dependencias (DIP)

`apps → core seam (createGraph3D) → wabis`

Las apps llaman a **nuestro** `createGraph3D`, no al global del framework
(`NewGraphX3D`). Cambiar el motor de render en el futuro (p. ej. a three.js) es
reescribir solo ese adapter, sin tocar las apps.

## Comandos

```bash
pnpm install                       # instala dependencias del workspace
pnpm --filter curvature-drop-calc dev  # arranca una app (Vite per-app)
pnpm --filter fed-wabis dev     # la otra
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
