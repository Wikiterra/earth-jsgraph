# Roadmap — Advanced Earth Curvature Calculator

Plan de evolución del proyecto tras el refactor inicial (separación wiki → `src/`,
extracción de scripts inline, organización en `core` / `render` / `panels`).

Este documento NO es una lista de deseos genérica: cada punto referencia código real
de este repo y explica **por qué**, **esfuerzo** aproximado y **riesgo**.

---

## ✅ Hecho — convergencia al monorepo `jsgraph-workspace` (jun 2026)

earth-drop-calc dejó de ser standalone: vive en el monorepo junto a fed-wabis-v2,
compartiendo un único vendor wabis (`packages/jsgraph-vendor/src`) y tooling. Completado
respecto a este plan:

- **Fase 1 (tooling): hecha.** ESLint + Prettier + Vite + Playwright a nivel workspace
  (`vendor/` y código legacy ignorados).
- **Fase 2 (red de seguridad): hecha como caracterización.** No es cobertura 80 % de
  ramas, pero congela el comportamiento: snapshots numéricos de `CurveAppClass.Update`
  (incl. los fixes de cámara) + **screenshots del canvas** (Globe por defecto y Globe+FE).
  `pnpm characterize`.
- **Fase 3 (ESM, sin `document.writeln`): hecha.** Paneles via `RenderInto(container)`;
  entry único `js/main.js` (`type=module`); Vite empaqueta. Los globals **siguen
  existiendo** pero expuestos vía `globalThis` (no se eliminaron — el objetivo era quitar
  `document.writeln` y el parse-time, logrado).
- **Bugs latentes (ver Deuda técnica): los 3 arreglados** (`retult`, `IsNaN`, `!tem`).
- **Dedup:** paneles Target 1/2 → factory (−281 L); bloques repetidos de `DrawModel`
  (refinamiento de grid por altura, lat/long globe/flat) → loops/helper.
- **UI compartida:** barra de navegación común con fed (app-switcher).

> **Cambio de principio:** la app **ya NO se abre con doble clic / `file://`** — los
> *bare specifiers* ESM solo los resuelve Vite. Requiere `pnpm --filter earth-drop-calc
> dev` (o `pnpm dev` raíz), igual que fed. Decisión deliberada para poder empaquetar y
> unificar (ver Principio 3, ahora obsoleto).

---

## Principios guía

1. **Cero dependencias en runtime.** El corazón de la app (proyección 3D, física de
   refracción, geometría del horizonte) es código propio en `vendor/jsg*.js` y
   `app/`. Sustituirlo por una librería externa (three.js, etc.) cambiaría el modelo
   de proyección y rompería la fidelidad física. Las dependencias permitidas son
   **solo de desarrollo** (test, lint, build) y nunca llegan al navegador del usuario.
2. **Refactor que preserva comportamiento.** Sin suite de tests, cualquier cambio en
   la matemática es riesgoso. Primero tests, luego refactor.
3. **Debe seguir abriéndose con doble clic.** Mantener la capacidad de correr sin
   build (`file://` / servidor estático simple) hasta que el tooling aporte más de lo
   que cuesta.
4. **Migración por capas, no big-bang.** Cada fase deja la app funcionando.

---

## Estado actual (baseline)

| Área             | Estado                                  | Observación                                                      |
|------------------|-----------------------------------------|------------------------------------------------------------------|
| Arquitectura     | `core` / `render` / `panels` / `vendor` | Limpia a nivel de archivos                                       |
| Namespace        | **Global**                              | `CurveApp`, `graph`, `UpdateAll`, `Jsg*`, `x*`… todo en `window` |
| Carga de paneles | `document.writeln` vía `<script src>`   | Frágil, depende del orden de parseo                              |
| Encoding         | ISO-8859-1 / windows-1252               | `°`, `²`, `µ` como bytes únicos                                  |
| Tests            | **0**                                   | El motor (`CurveAppClass.Update`) es puro y muy testeable        |
| Tipos            | Ninguno                                 | `CurveAppClass` tiene ~100 propiedades sin documentar            |
| Tooling          | Ninguno                                 | Sin lint/format/CI                                               |
| Vendor libs      | One-liners densos                       | `jsg.js`, `jsgx3d.js`, `ControlPanel.js`… ilegibles              |

---

## Quick wins (bajo esfuerzo, alto valor)

Hacer antes que las fases grandes. Ninguno añade dependencias de runtime.

- [x] **Migrar a UTF-8.** Reconvertir `index.html` + `.js` + `.css` a UTF-8 y cambiar
      `charset` a `utf-8`. Hoy `°/²/µ` dependen de windows-1252; cualquier editor que
      guarde en UTF-8 los corrompe. Riesgo bajo, alto valor de mantenibilidad.
      → Ya en UTF-8 desde la migración a ESM (jul 2026).
- [x] **`.editorconfig` + `prettier` (dev-only).** Formato consistente. No tocar
      `vendor/` (añadir a `.prettierignore`).
- [x] **Arreglar bugs latentes ya detectados** (ver *Deuda técnica*): `retult` en
      `jsg.js`, `if (!tem)` y `IsNaN` en `ControlPanel.js`.
- [x] **`<meta name="theme-color">` + favicon + `<html lang>`** correctos.
- [ ] **README de “cómo correr”** en root (un servidor estático: `npx serve src`,
      `python -m http.server`, etc.) — `document.writeln` no funciona en `file://`
      en todos los navegadores.
- [x] **Extraer “números mágicos”** del motor a constantes nombradas en
      `app/core/constants.js`: `503`, `0.0343` (fórmula de refracción), `43.2`
      (diagonal de sensor 35 mm), radios por defecto. Documentar su origen físico.

---

## Fases (refactor v2)

### Fase 1 — Tooling de desarrollo (sin runtime deps)
**Objetivo:** red de seguridad y consistencia antes de tocar lógica.
- `package.json` solo con `devDependencies`.
- `prettier` + `eslint` (config mínima, `vendor/` excluido).
- `vitest` o `node:test` para Fase 2.
- (Opcional) GitHub Actions: lint + test en cada push.
- **Esfuerzo:** S · **Riesgo:** nulo · **Bloquea:** Fases 2–6.

### Fase 2 — Tests del motor matemático
**Objetivo:** congelar el comportamiento físico para poder refactorizar sin miedo.
- `CurveAppClass.Update()` y `CompCameraParams()` son funciones puras sobre estado:
  ideales para *golden tests* (entrada → salida esperada).
- Casos clave a fijar:
  - Horizonte: `HorizSurfDist`, `HorizDropAnglFromEyeLvl` para alturas conocidas.
  - Refracción: que `k → dT/dh → R'` sean coherentes en los modos `RefractionSync`.
  - Visibilidad de objeto: `ObjHidden` / `ObjVisi` tras el horizonte.
  - Cámara: `avc` correcto para `ViewcenterHorizon` 0/3 y aim `globe`/`fe`
    (los dos fixes recientes — proteger contra regresión).
- Snapshot del estado serializado por `DataX` para varias URLs de ejemplo.
- **Esfuerzo:** M · **Riesgo:** nulo · **Valor:** altísimo.

### Fase 3 — Módulos ESM reales (eliminar globals + `document.writeln`)
**Objetivo:** `import`/`export` explícitos, sin contaminar `window`, sin parse-time DOM.
- Reemplazar `ControlPanel.Render()` (que hace `document.writeln`) por
  inserción en un contenedor (`container.insertAdjacentHTML` / append). Esto
  desbloquea `type="module"`, `defer`, bundling y abrir en `file://`.
- Convertir `app/**` a módulos: `export function`, `export class CurveApp`.
- Punto de entrada único `app/main.js` que orquesta init (hoy repartido entre
  `setup.js` + `init.js` + orden de `<script>` en `index.html`).
- **Esfuerzo:** L · **Riesgo:** medio (tocar `ControlPanel.js`) · **Requiere:** Fase 2.

### Fase 4 — Separación de capas (Model / View / Render / State)
**Objetivo:** `CurveAppClass` hoy mezcla 3 responsabilidades. Separarlas.
- Hoy `Update()` hace, en una sola función de ~400 líneas:
  1. **Validación de inputs** (clamps de altura, refracción, etc.).
  2. **Sincronización slider↔valor** (`HeightSlider`, `RefractionSlider`, logs…).
  3. **Física** (horizonte, refracción, geometría del objeto).
- Propuesta:
  - `core/model.js` — estado + validación.
  - `core/physics.js` — funciones puras de geometría/refracción (sin `this`).
  - `core/sliderMapping.js` — mapeos log/lineal slider↔valor.
  - `state/` — `DataX` aislado detrás de una interfaz propia.
- Beneficio: la física pura se testea trivialmente y se reusa (p. ej. para tests).
- **Esfuerzo:** L · **Riesgo:** medio · **Requiere:** Fases 2–3.

### Fase 5 — Tipado (JSDoc primero, TS opcional)
**Objetivo:** documentar las ~100 propiedades de `CurveAppClass` y firmas de render.
- Empezar con **JSDoc + `// @ts-check`**: tipos sin build, el editor valida.
- Si se adopta build (Fase 3), evaluar migrar `app/**` a TypeScript (dev-only;
  compila a JS, no es dependencia de runtime).
- **Esfuerzo:** M (JSDoc) / L (TS) · **Riesgo:** bajo.

### Fase 6 — Refactor de las librerías vendor
**Objetivo:** hacer legible/mantenible el código propio del autor original.
- `jsg.js` (2D), `jsgx3d.js` (3D), `ControlPanel.js`, `Slider.js`, `Tabs.js`,
  `DataX.js`, `NumFormatter.js`: hoy one-liners.
- Estrategia segura: *beautify* automático (prettier) → tests de humo → dividir por
  responsabilidad → renombrar. **Nunca** sin tests de la Fase 2 cubriendo lo que
  consumen.
- Candidatos a **reemplazo por nativo** (eliminaría vendor sin añadir deps):
  - `Slider.js` → `<input type="range">` + estilado CSS.
  - `Tabs.js` → `<details>`/ARIA tabs nativos o un mini-controlador propio.
  - `xtc.js` → APIs modernas de `selectionStart/End` (el código IE legacy sobra).
- `ControlPanel.js` y `jsg*` probablemente se quedan (son el núcleo).
- **Esfuerzo:** XL · **Riesgo:** alto · **Requiere:** Fase 2 sí o sí.

### Fase 7 — Rendimiento de render
**Objetivo:** el `DrawModel` (~800 líneas) redibuja todo en cada cambio.
- Medir primero (no optimizar a ciegas).
- Ideas:
  - *Dirty flags*: no recomputar la malla del globo si solo cambió el zoom.
  - Separar capas estáticas (rejilla) de dinámicas (objetos) en canvas distintos.
  - `requestAnimationFrame` batching para arrastres (el `Slider` ya usa rAF;
    `UpdateAll` no).
  - Cachear polígonos de rejilla entre frames.
  - Descomponer `DrawModel` en `drawSky/drawGlobe/drawFlat/drawObjects/drawHud`.
- **Esfuerzo:** M–L · **Riesgo:** medio.

### Fase 8 — UX, accesibilidad, responsive, i18n
- **Accesibilidad:** roles ARIA en tabs/sliders, foco visible, `aria-label` en el
  `<canvas>` con descripción textual del resultado, navegación por teclado.
- **Responsive:** el contenedor `.CalcApp` ya limita ancho; falta layout móvil real
  para los paneles anchos (hoy hay scroll horizontal `.Scroller`).
- **i18n:** strings hoy hardcodeados en inglés (UI) con comentarios en alemán
  (origen). Extraer a un diccionario; permitir ES/EN/DE.
- **Persistencia:** además de URL (`DataX`), permitir `localStorage` para “última
  sesión”.
- **Re-añadir documentación/ecuaciones:** se quitó MathJax; podría volver como
  imágenes/SVG estáticos o KaTeX (dev-time, pre-renderizado) sin runtime pesado.
- **Esfuerzo:** M–L · **Riesgo:** bajo.

---

## Evaluación de librerías

> Regla: solo **dev dependencies**. Nada que llegue al bundle del usuario.

| Librería             | Para qué             | A favor                              | En contra                                                          | Recomendación                                               |
|----------------------|----------------------|--------------------------------------|--------------------------------------------------------------------|-------------------------------------------------------------|
| Prettier             | Formato              | Estándar, cero config                | —                                                                  | **Adoptar** (dev)                                           |
| ESLint               | Lint                 | Atrapa bugs (`IsNaN`, globals)       | Config inicial                                                     | **Adoptar** (dev)                                           |
| Vitest / `node:test` | Tests                | Rápido, sin browser para lógica pura | —                                                                  | **Adoptar** (dev)                                           |
| TypeScript           | Tipos                | Seguridad en `CurveAppClass`         | Requiere build                                                     | **Evaluar** tras Fase 3                                     |
| Vite                 | Build/dev server     | HMR, bundling, ESM                   | Rompe “abrir sin build”                                            | **Evaluar** tras Fase 3                                     |
| Playwright           | Tests E2E del canvas | Verifica render real                 | Pesado                                                             | **Opcional**, Fase 7+                                       |
| three.js / regl      | Render 3D            | Maduro, WebGL                        | **Cambia el modelo de proyección y la física**; dependencia grande | **No** (viola Principio 1)                                  |
| Slider/Tabs UI libs  | Widgets              | Menos código propio                  | Dependencia + estilo ajeno                                         | **No** — preferir **nativo** (`<input range>`, `<details>`) |
| KaTeX                | Ecuaciones docs      | Ligero vs MathJax                    | Build step                                                         | **Opcional** (pre-render)                                   |

---

## Deuda técnica conocida

Bugs/latentes ya visibles en el código (heredados del original):

- `vendor/jsg.js` — `ParseHWInt`: `if (result <= 0) retult = 1;` → typo, asigna a
  global inexistente `retult` en vez de `result`.
- `vendor/ControlPanel.js` — `CpCheckboxField.GetValueRef`: `if (!tem)` (debería ser
  `item`); lógica invertida además.
- `vendor/ControlPanel.js` — `CpRadiobuttonField.ToValueStr`: usa `IsNaN` (no existe;
  es `isNaN`) → lanzaría si se entra por esa rama.
- Propiedades muertas en `CurveAppMetaData`: `Flerspective`, `RefDistance`
  (marcadas `// feature removed`) — limpiar tras confirmar que `DataX` no las exige
  para compatibilidad de URLs antiguas.
- `metadata.js` — `ObjSurfDist` tiene indentación/spacing inconsistente (cosmético).
- Strings de unidades con bytes windows-1252 (`°C/m`) — se corrige con la migración
  a UTF-8.

---

## Métricas de éxito

- ✅ Cobertura de tests del motor físico > 80 % de ramas de `Update()`.
- ✅ `0` variables globales nuevas; `window.*` solo donde el vendor lo exija.
- ✅ La app abre sin errores de consola (excepto ruido de extensiones del navegador).
- ✅ Lint y tests pasan en CI.
- ✅ Lighthouse: accesibilidad > 90.
- ✅ Bundle de runtime sigue siendo **0 dependencias externas**.

---

## Anti-objetivos (qué NO hacer)

- ❌ Reescribir la física/proyección sobre una librería 3D genérica.
- ❌ Añadir un framework (React/Vue) “porque sí” — la UI es declarativa vía
  `ControlPanels` y no lo justifica.
- ❌ Optimizar render antes de medir.
- ❌ Tocar `vendor/` o `core/` sin los tests de la Fase 2.
- ❌ Romper la compatibilidad de las URLs de estado (`DataX`) sin una migración.

---

## Orden sugerido

```
Quick wins  →  Fase 1 (tooling)  →  Fase 2 (tests)  ─┬─→ Fase 3 (ESM)  → Fase 4 (capas)
                                                     ├─→ Fase 5 (tipos)
                                                     └─→ Fase 6 (vendor)  → Fase 7 (perf)
                                                                            Fase 8 (UX) en paralelo
```

La **Fase 2 (tests) es el cuello de botella**: desbloquea todo lo demás con seguridad.
