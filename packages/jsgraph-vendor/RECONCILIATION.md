# Reconciliación del vendor wabis (Fase 1)

Las dos apps llevaban copias **divergidas** del framework. Tras normalizar el
formato de ambas (prettier, mismas opciones) y comparar, la divergencia funcional
real es la siguiente:

| Archivo           | Δ líneas | Naturaleza de la diferencia                                                                                            | Canónico                          |
|-------------------|----------|------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| DataX.js          | 2        | fed añade `export {}` + `globalThis` (ESM). Código idéntico.                                                           | **fed**                           |
| xtc.js            | 2        | idem                                                                                                                   | **fed**                           |
| ModelAnimation.js | 9        | idem                                                                                                                   | **fed**                           |
| jsgx3d.js         | 26       | fed: `inheritsFrom` → prototipado estándar; + ESM exports                                                              | **fed**                           |
| jsg.js            | 48       | fed: `var JsgMat2` (fix global implícito); `document.writeln` → inserción DOM (necesario bajo ESM/Vite); + ESM exports | **fed**                           |
| wiki.js           | 2588     | fed adelgazó mucho (eliminó dead code). edc usa la versión completa.                                                   | **fed** (solo fed lo consume hoy) |

## Decisión

**Canónico = versiones de `fed-wabis-v2`.** No por ser "más nuevas" sino porque
son funcionalmente el mismo framework **más** fixes que el monorepo Vite/ESM
necesita:

- `document.writeln` rompe con carga diferida/módulos → fed lo sustituyó por
  inserción en un punto de montaje (`#jsg-canvas-mount`, con fallback a `body`).
- `var JsgMat2` corrige una fuga de global implícito.
- Patrón ESM (`export` + `globalThis`) permite `import` real conservando los
  globals que el código de app espera.

## Alcance Fase 1

- Mover los **6 archivos compartidos** (jsg, jsgx3d, wiki, DataX, ModelAnimation,
  xtc) a `jsgraph-vendor/src` con la versión canónica (fed).
- Reconectar **fed-wabis-v2** para consumirlos desde `jsgraph-vendor`; eliminar
  sus copias locales. → fed deduplicado, comportamiento idéntico (mismo código).
- **earth-drop-calc** conserva su `vendor/` por ahora: usa `<script>` clásico +
  `document.writeln`; consumir el canónico exige migrarlo a ESM + punto de
  montaje, que es su **Fase 3** (piloto). Allí se completa su dedup y, si hace
  falta, se reconcilia `wiki.js` al superconjunto (re-añadir funciones que edc
  use y que fed eliminó, conservando los fixes de fed).

Archivos NO duplicados (un solo consumidor) quedan fuera del alcance de dedup:
NumFormatter/ControlPanel/Slider/Tabs (solo edc); jsgMouseHandler/EarthMap/
earth-map-data (solo fed).
