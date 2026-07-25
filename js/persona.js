/**
 * LaborPro — Persona visibility utility
 *
 * 2026-05-25 三模組重整：本工具只保留勞工視角；雇主視角移至企業合規管理情境
 * (memory project_pro_three_modules_2026_05_23.md + feedback_consumer_seller_angle_split)。
 * persona 強制 'worker'，舊 localStorage 也覆寫。
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

  try { localStorage.setItem('lp_persona', 'worker'); } catch (_) {}
  window.LP_PERSONA = 'worker';

})();
