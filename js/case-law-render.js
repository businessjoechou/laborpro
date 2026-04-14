/**
 * case-law-render.js — LaborPro 判例面板渲染
 *
 * 依計算金額動態匹配最接近的判例，產生可收合面板 HTML。
 * 掛載於 window.LaborPro.renderCaseLaw 供各工具頁呼叫。
 */
(function () {
  /**
   * 渲染可收合判例面板
   * @param {string} category - LaborPro.CASE_LAW 中的 key
   * @param {number} amount   - 計算出的金額
   * @param {string} containerId - 面板插入在此元素之後
   */
  function renderCaseLaw(category, amount, containerId) {
    var cases = (window.LaborPro.CASE_LAW || {})[category];
    if (!cases || !cases.length || !amount || amount <= 0) return;

    // 計算分數並排序
    var scored = cases.map(function (c) {
      var maxVal = Math.max(c.amount, amount);
      var score = maxVal > 0 ? 1 - Math.abs(c.amount - amount) / maxVal : 0;
      return { c: c, score: score };
    }).sort(function (a, b) { return b.score - a.score; });

    // 取前 3 則
    var top = scored.slice(0, 3);

    // 產生 HTML
    var casesHtml = top.map(function (item) {
      var c = item.c;
      return '<div class="cl-item">' +
        '<div class="cl-case-no">' + c.caseNo + '</div>' +
        '<div class="cl-amount">' + c.amountLabel + '</div>' +
        '<div class="cl-summary">' + c.summary + '</div>' +
        (c.law ? '<div class="cl-law">' + c.law + '</div>' : '') +
      '</div>';
    }).join('');

    var panelId = 'caseLawPanel_' + category;
    var panelHtml =
      '<div class="case-law-panel cl-open" id="' + panelId + '">' +
        '<button class="cl-toggle" onclick="this.parentElement.classList.toggle(\'cl-open\')">' +
          '<span class="cl-toggle-icon">\u25B6</span>' +
          '<span>\u2696\uFE0F \u76F8\u95DC\u5224\u4F8B\u53C3\u8003 (' + top.length + ' \u5247)</span>' +
        '</button>' +
        '<div class="cl-body">' + casesHtml + '</div>' +
      '</div>';

    // 插入到目標元素之後
    var target = document.getElementById(containerId);
    if (!target) return;

    // 重複計算時先移除舊面板
    var existing = document.getElementById(panelId);
    if (existing) existing.remove();

    target.insertAdjacentHTML('afterend', panelHtml);
  }

  window.LaborPro = window.LaborPro || {};
  window.LaborPro.renderCaseLaw = renderCaseLaw;
})();
