/**
 * LaborPro — Persona visibility utility
 *
 * CSS class conventions:
 *   .worker-only   → visible to worker only
 *   .employer-only → visible to employer only
 *
 * Include in <head> — uses style injection to prevent FOUC.
 */
(function () {
  // iOS Safe Area
  const safeArea = document.createElement('style');
  safeArea.textContent = `
    :root {
      --sat: env(safe-area-inset-top, 0px);
      --sab: env(safe-area-inset-bottom, 0px);
    }
    body { padding-top: var(--sat); padding-bottom: var(--sab); }
  `;
  (document.head || document.documentElement).appendChild(safeArea);

  const p = localStorage.getItem('lp_persona') || 'worker';
  window.LP_PERSONA = p;

  const hide = [];
  if (p === 'worker')   hide.push('.employer-only');
  if (p === 'employer') hide.push('.worker-only');

  if (hide.length) {
    const style = document.createElement('style');
    style.textContent = hide.join(',') + '{display:none!important}';
    (document.head || document.documentElement).appendChild(style);
  }
})();
