// Shared app shell — injects the "WikiTerra Jsgraph" brand + a light/dark theme
// toggle into the existing #top-bar of each app, and applies the saved theme.
// The theme choice is shared with the static site via the same localStorage key.
// Runs as a side-effect import.
import './appShell.css';

const root = document.documentElement;

function applyTheme(t) {
  root.setAttribute('data-theme', t);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#120c24' : '#f5f6f8');
}

// Initial theme: stored choice, else OS preference. (An inline <head> script in
// each app sets this pre-paint; re-applying here is harmless and idempotent.)
function initialTheme() {
  try {
    return localStorage.getItem('theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (e) { return 'dark'; }
}
applyTheme(root.getAttribute('data-theme') || initialTheme());

const SUN = '<svg class="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON = '<svg class="moon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 7a5 5 0 1 1-7.5 6.5A5 5 0 0 0 15 7z"/></svg>';

const bar = document.getElementById('top-bar');
if (bar) {
  const brand = document.createElement('a');
  brand.className = 'app-shell-brand';
  brand.href = '../../';
  brand.innerHTML = 'WikiTerra<span class="brand-suffix"> Jsgraph</span>';
  bar.insertBefore(brand, bar.firstChild);

  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.className = 'app-shell-theme';
  toggle.setAttribute('aria-label', 'Toggle color theme');
  toggle.innerHTML = SUN + MOON;
  const sync = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  sync();
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    sync();
  });
  bar.appendChild(toggle);
}
