# ROADMAP — jsgraph-workspace

Roadmap único del monorepo: estado, pendiente y principios de las dos apps
(earth-drop-calc, fed-wabis-v2) sobre el vendor wabis compartido. Plan
arquitectónico por fases en [../MIGRATION-PLAN.md](../MIGRATION-PLAN.md).

> Red de seguridad antes de tocar nada: `pnpm characterize` (9 tests — matemática +
> screenshots de canvas). Verde = no rompiste ni el cálculo ni el dibujo.

## Principios

- **0 dependencias en runtime.** El motor (proyección 3D, refracción, geometría del horizonte) es código propio. Las deps son solo de desarrollo (Vite/ESLint/Playwright), nunca llegan al navegador. Nada de three.js/React "porque sí".
- **Refactor que preserva comportamiento.** No tocar `vendor/` ni `core/` sin la red de seguridad cubriéndolo. No romper compatibilidad de URLs de estado (`DataX`).
- **Nativo antes que librería; sin abstracción sin un 2º caso de uso real.**
- **Por capas, no big-bang.** Cada cambio deja ambas apps funcionando y shippables.

## ✅ Hecho

**Monorepo / infra**
- pnpm + Vite; ambas apps arrancan bajo Vite; build unificado → `dist/` + workflow
  GitHub Pages; `origin` → `Wikiterra/earth-jsgraph`. — `48c6e66`
- **Vendor wabis único** (`packages/jsgraph-vendor/src`); `jsgraph-core` fusionado dentro;
  el seam `createGraph3D` (sobre `NewGraphX3D`) vive en `src/core/`. — `c1d0c28`, `ec7c38f`
- **Red de seguridad:** snapshots matemáticos + screenshots de canvas por app +
  escenario Globe+FE de edc. — `5d8c176`, `5bdc6f4`
- Tooling: ESLint + Prettier + Playwright + `@ts-check`; `.editorconfig`, meta/favicon.

**earth-drop-calc**
- A ESM: entry único `js/main.js`, paneles vía `RenderInto` (fuera `document.writeln` y
  parse-time), Vite empaqueta, `pnpm --filter earth-drop-calc dev` restaurado. — `cbc4a17`
- UTF-8; constantes físicas a `constants.js`; capas `physics.js` + `sliderMapping.js`;
  helpers comunes; JSDoc + `wabis.d.ts` (0 errores TS); 3 bugs latentes arreglados;
  paneles Target 1/2 → factory; barra de navegación común con fed.

**fed-wabis-v2** (Fases 1–14, detalle en git history)
- Limpieza HTML/CMS, layout full-screen, calendario, CSS mobile-first, accesibilidad
  ARIA, conversión a ESM (`main-v2.js`), descomposición de `app.js` (3232 → 453 L) y
  `wiki.js` (920 → 424 L), `Tabs.js` eliminado, timeline scrubber, play/pause, barras
  reorganizadas (Layers/Params/Rays/Luminaries).

**Vendor modernizado:** `xtc.js` (IE legacy fuera), `Tabs.js` (ARIA), `Slider.js`
(`<input type="range">` nativo). — `7342d0f`, `bc5bfc3`

- Activar Pages (manual, 1 vez). Build, workflow y `origin` ya existen. Falta solo el toggle en GitHub: **Settings → Pages → Source: GitHub Actions** → push para disparar `deploy.yml`.
- **Producto — eye-level / horizonte:** vista anclada al **eye-level** por defecto
  (`ViewcenterHorizon=3`); FE tratada como **plano infinito** → su horizonte coincide
  con el eye-level (`avc=0`); el horizonte del globo **baja** bajo el eye-level al subir
  la altura. Eye-level dibujado en ambos modelos. Solo cambió la cámara — la física
  (snapshots matemáticos) intacta; baselines de render regenerados.

**CSS / diseño (jun 2026)**
- **Sistema de diseño compartido:** `core/tokens.css` (colores de marca, neutros,
  radios, sombras, espaciado `--space-*`, `--tap-min`); ambas apps lo consumen.
  Capas documentadas (tokens → vendor → componentes → app); carpetas unificadas a
  `styles/`. — `671d148`, `6f0ac82`
- **edc mobile-first + wide-screen:** cascada base = teléfono, card ≥768, grid de 2
  columnas (gráfico | datos) ≥1200; tabs/sliders táctiles. fed: barra inferior con
  scroll en móvil (controles ya no se recortan). — `f2fe9a7`, `44a5c3a`

**Arquitectura / calidad (jun 2026)**
- **Fronteras ESM reales (edc):** `physics`/`units`/`sliderMapping` ahora `export`;
  sus consumidores `import`. El resto del bag global se volvió **contrato explícito
  enforced por ESLint `no-undef`** (vendor + helpers + singletons + modelos
  string-bound declarados). fed: mismo contrato (su `FeDomeApp` es un objeto
  cohesivo por method-partials, sin módulos sueltos que convertir). — `cea9a97`, `93947eb`
- **Bugs latentes encontrados por el contrato/lint y arreglados:** rama muerta
  `sizeType==1` en `objectRenderer`; typo `Jsgvect3`→`JsgVect3` y `ae=` sin declarar
  (crash en strict mode) en `EarthMap.js`. — `1be5f1b`, `93947eb`
- **Código muerto eliminado:** `computeViewCenterAngle`, `compViewDist`, `BVal`/`BUnit`,
  imports redundantes en `main.js`. — `84feb19`, `146acc3`

## 🚫 NO hacer (hasta que haya necesidad real)

- **2º motor de render (three.js):** el render vectorial esquemático es ventaja, no deuda;
  violaría "0 deps runtime". La costura `createGraph3D` ya está si algún día hace falta.
- **`ControlPanel.js`** (~400 L one-liner denso): único vendor sin modernizar; tocar solo
  si un bug/feature lo exige.
- **Dividir más `app.js`** de fed (~450 L cohesivas) — churn sin ganancia.
- **`xEvent` → `addEventListener` nativo** / **pinch-zoom de 2 dedos** en fed: cirugía
  sin demanda actual.
