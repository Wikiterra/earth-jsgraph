# Próximos pasos — refactors fáciles primero

Mejoras concretas ordenadas por **esfuerzo creciente**. Regla de oro: la red de
seguridad (`pnpm characterize`, 6 specs) protege la matemática — valida con ella
tras cada cambio y nada de esto debería romperse a ciegas.

Para el plan arquitectónico completo por fases, ver
[../MIGRATION-PLAN.md](../MIGRATION-PLAN.md).

---

## 1. 🟢 Red de seguridad de RENDER (lo más rentable)

Hoy las specs solo comparan la **matemática**; los bugs de dibujo (p. ej. el
`offsetWidth` que salió al converger el vendor) se pillaron con probes manuales.

- **Qué:** añadir en `tools/characterization/` una captura del canvas por app y
  comparar contra baseline.
- **Por qué:** convierte cualquier refactor de render en *seguro* en vez de *a ciegas*.
  Es el habilitador del resto (#2 y #3).
- **Primer paso:** en cada spec, tras cargar la app:
  ```ts
  await expect(page.locator('#FeGraph-Canvas')).toHaveScreenshot();   // fed
  await expect(page.locator('canvas')).toHaveScreenshot();            // edc
  ```
  `pnpm characterize:update` genera los baseline (commitéalos).

## 2. 🟢 Reaplicar parches del vendor si se actualiza wabis

El vendor dejó de ser intacto: tiene el codemod + 1 parche manual.

- **Qué/cómo:** al traer una versión nueva de walter.bislins.ch → recopiar las
  fuentes, correr `node tools/esm-globalize.mjs <archivos>`, reponer el parche de
  `CreateDomObjects` en `jsg.js` (marcado `// ponytail:`), `pnpm characterize`.
- Detalle de los 5 escollos en MIGRATION-PLAN §8.

## 3. 🟡 earth-drop a un entrypoint ESM → elimina el parche del build

Es el mayor **simplificador** disponible.

- **Qué:** dar a earth-drop un único `<script type="module">` que importe el vendor
  y sus scripts de app (como hace fed en `main-v2.js`), en vez de ~20 `<script>`
  clásicos sueltos.
- **Gana:** Vite lo empaqueta igual que fed →
  - se borra el plugin `copy-edc-static` de `vite.config.js`,
  - desaparece el `../../packages/…` y `pnpm --filter earth-drop-calc dev` vuelve a
    funcionar (hoy edc solo se sirve desde la raíz),
  - habilita depender de `jsgraph-core` por `import`, no por global (Fase 3 completa).
- **Cuidado:** el canvas se inyecta con `document.write` en parse-time; al pasar a
  módulo (deferred) hay que usar el branch `#jsg-canvas-mount` que **ya** tiene
  `CreateDomObjects` → basta añadir ese `<div id="jsg-canvas-mount">` al HTML.
- **Hazlo con #1 ya en verde** (toca el render).

## 4. 🟡 Extender la costura `createGraph3D` — solo cuando haga falta

No abstraer la superficie de dibujo `g.*` ahora: un solo motor (wabis) = flexibilidad
especulativa. Cuando aparezca un segundo motor real (¿three.js, Fase 5?), portar
método a método dentro de `packages/jsgraph-core/src/adapters/wabis/wabisGraph3D.js`
(o un wrapper del grafo), validando cada paso con la red de render (#1).
