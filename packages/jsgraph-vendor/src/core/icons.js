// =============================================================================
// icons.js — shared SVG icon library for both apps
//
// Each icon is a function that returns an SVG string. Call with attributes
// like { width: 18, height: 18, class: 'icon' }.
// Usage: import { gridIcon } from 'jsgraph-vendor/src/core/icons.js';
//        button.innerHTML = gridIcon({ width: 18, height: 18 });
// =============================================================================

const SVG = (viewBox, inner, opts) => {
  const w = (opts && opts.width) || 24;
  const h = (opts && opts.height) || 24;
  const cls = (opts && opts.class) || '';
  return `<svg width="${w}" height="${h}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${inner}</svg>`;
};

// ---- fed-wabis-v2 bottom bar icons ----
export const gridIcon = (o) => SVG('0 0 24 24', '<path d="M4 8h16M4 16h16M8 3v18M16 3v18"/>', o);
export const domeIcon = (o) => SVG('0 0 24 24', '<path d="M3 20a9 9 0 0 1 18 0M12 11v9M6 18a7 7 0 0 1 12 0"/>', o);
export const shadowIcon = (o) => SVG('0 0 24 24', '<circle cx="8" cy="7" r="3"/><path d="M10.2 9.8 19 21H5z" fill="currentColor" fill-opacity="0.3"/>', o);
export const sunIcon = (o) => SVG('0 0 24 24', '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" fill="none"/>', o);
export const moonIcon = (o) => SVG('0 0 24 24', '<path d="M15 7a5 5 0 1 1-7.5 6.5A5 5 0 0 1 15 7z" fill="currentColor"/>', o);
export const starsIcon = (o) => SVG('0 0 24 24', '<circle cx="5" cy="7" r="1.5" fill="currentColor"/><circle cx="13" cy="4" r="1.5" fill="currentColor"/><circle cx="20" cy="9" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="18" cy="17" r="1.5" fill="currentColor"/><circle cx="12" cy="20" r="1.2" fill="currentColor"/>', o);
export const orbitsIcon = (o) => SVG('0 0 24 24', '<ellipse cx="12" cy="12" rx="9" ry="4" stroke-dasharray="2.5 2"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke-dasharray="2.5 2"/>', { ...o, 'stroke-width': '1.6' });
export const moveIcon = (o) => SVG('0 0 24 24', '<path d="M12 2v20M2 12h20M5 5l14 14M19 5l-14 14"/><circle cx="12" cy="12" r="3" fill="currentColor"/>', o);
export const domeRaysIcon = (o) => SVG('0 0 24 24', '<path d="M3 20a9 9 0 0 1 18 0M12 20v-8M7.5 20 11 13M16.5 20 13 13"/>', o);
export const sphereRaysIcon = (o) => SVG('0 0 24 24', '<circle cx="12" cy="8" r="3"/><path d="M9 11 5 20M12 11v9M15 11l4 9"/>', o);

// ---- earth-drop-calc bottom bar icons ----
export const measuresIcon = (o) => SVG('0 0 24 24', '<line x1="4" y1="4" x2="20" y2="20"/><polyline points="4 20 4 4 20 4"/>', o);
export const opticsIcon = (o) => SVG('0 0 24 24', '<path d="M3 20a9 9 0 0 1 18 0M12 20v-8M7.5 20 11 13M16.5 20 13 13"/>', o);
export const dataIcon = (o) => SVG('0 0 24 24', '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', o);

// ---- playback icons ----
export const playIcon = (o) => SVG('0 0 24 24', '<path d="M8 5v14l11-7z" fill="currentColor"/>', o);
export const stepBackIcon = (o) => SVG('0 0 24 24', '<path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" fill="currentColor"/>', o);
export const stepFwdIcon = (o) => SVG('0 0 24 24', '<path d="M6 18l8.5-6L6 6v12zm2-6 5.5 3.9V8.1L8 12zM16 6h2v12h-2z" fill="currentColor"/>', o);
export const resetIcon = (o) => SVG('0 0 24 24', '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>', { ...o, 'stroke-width': '2.2' });
export const screenshotIcon = (o) => SVG('0 0 24 24', '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>', o);