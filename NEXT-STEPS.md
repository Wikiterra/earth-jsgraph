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

## 3. ✅ HECHO — earth-drop a entrypoint ESM (eliminó el parche del build)

Hecho en 3 commits (Stage 1 `cbc4a17`, Stage 2 `7bf6f62`): paneles via `RenderInto`
(no `document.write`), `js/main.js` único entry ESM, app globalizada, `copy-edc-static`
y `../../packages` fuera, `pnpm --filter earth-drop-calc dev` restaurado. Hicieron falta
**2 parches al vendor** (wabis asume scripts clásicos globales; ESM es strict + module-scoped):
`ControlPanel.AppendixHtml` (`this`→`globalThis`) y `wiki.js` (sincronizar
`globalThis.xOnLoadFinished`, si no el canvas sale en blanco). Validado: 8/8 specs con el
screenshot de edc **idéntico** al baseline pre-migración.

<details><summary>Plan original (para referencia)</summary>

Es el mayor **simplificador** disponible.

- **Qué:** dar a earth-drop un único `<script type="module">` que importe el vendor
  y sus scripts de app (como hace fed en `main-v2.js`), en vez de ~20 `<script>`
  clásicos sueltos.
- **Gana:** Vite lo empaqueta igual que fed →
  - se borra el plugin `copy-edc-static` de `vite.config.js`,
  - desaparece el `../../packages/…` y `pnpm --filter earth-drop-calc dev` vuelve a
    funcionar (hoy edc solo se sirve desde la raíz),
  - habilita depender del core seam por `import`, no por global (Fase 3 completa).
- **OJO, no es trivial (revisión 2026-06-17):** no es solo el canvas. Los ~21 `<script>`
  de app del `<body>` y **los paneles** (`ControlPanel.Render → document.writeln`) se
  inyectan en **parse-time**, posicionados por dónde está cada `<script>`. Pasar a módulo
  (deferred) rompe TODO eso → hay que rearquitecturar la construcción del DOM (de
  `document.write` a montaje programático en divs target). El canvas es la parte fácil
  (branch `#jsg-canvas-mount` que ya tiene `CreateDomObjects`); los paneles son el grueso.
  → **Es un proyecto 🔴, no un quick win.** Hacerlo solo si se decide modernizar edc, y
  con #1 (red de render) ya en verde.

</details>

## 4. 🟡 Extender la costura `createGraph3D` — solo cuando haga falta

No abstraer la superficie de dibujo `g.*` ahora: un solo motor (wabis) = flexibilidad
especulativa. Cuando aparezca un segundo motor real (¿three.js, Fase 5?), portar
método a método dentro de `packages/jsgraph-vendor/src/core/wabisGraph3D.js`
(o un wrapper del grafo), validando cada paso con la red de render (#1).
