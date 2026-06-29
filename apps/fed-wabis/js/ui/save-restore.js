export function sync() {}

export function init() {
  const btn = document.getElementById('share-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    // GetAppStateUrl appends "&state=..."; on a bare URL (no "?") that param is
    // never parsed back, so the state wouldn't restore. Build "...?state=...".
    const base = location.origin + location.pathname;
    const url = DataX.GetAppStateUrl(base, true).replace('&state=', '?state=');
    try {
      await navigator.clipboard.writeText(url);
      const t = btn.getAttribute('title');
      btn.setAttribute('title', 'Link copied!');
      setTimeout(() => btn.setAttribute('title', t), 1500);
    } catch (e) {
      prompt('Copy this link:', url);
    }
  });
}
