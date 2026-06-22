// Shared app shell — injects WikiTerra branding + app-switcher links into the
// existing #top-bar of each app. Runs as a side-effect import.
import './appShell.css';

const APPS = [
  { slug: 'earth-drop-calc', label: 'Drop Curvature Calculator' },
  { slug: 'fed-wabis', label: 'Earth Dome Model' },
];

const path = location.pathname;
const links = APPS.map((a) => {
  const active = path.includes('/' + a.slug + '/') || path.endsWith('/' + a.slug);
  return `<a href="../${a.slug}/"${active ? ' class="active" aria-current="page"' : ''}>${a.label}</a>`;
}).join('');

const bar = document.getElementById('top-bar');
if (bar) {
  const wrap = document.createElement('span');
  wrap.className = 'app-shell-group';
  wrap.innerHTML = `<a class="app-shell-brand" href="../../">WikiTerra</a><nav class="app-shell-links">${links}<a href="../../wiki.html">Docs</a></nav>`;
  bar.insertBefore(wrap, bar.firstChild);
}
