/**
 * fmt.js — LaborPro 共用格式化工具
 */
(function () {
  function fmt(n) {
    if (n == null || isNaN(n)) return '—';
    return 'NT$ ' + Math.round(n).toLocaleString('zh-TW');
  }

  function fmtNum(n) {
    if (n == null || isNaN(n)) return '—';
    return Math.round(n).toLocaleString('zh-TW');
  }

  function fmtPercent(n, decimals) {
    if (n == null || isNaN(n)) return '—';
    return (n * 100).toFixed(decimals || 1) + '%';
  }

  function fmtTenure(y, m, d) {
    var parts = [];
    if (y) parts.push(y + ' 年');
    if (m) parts.push(m + ' 個月');
    if (d) parts.push(d + ' 天');
    return parts.join(' ') || '0 天';
  }

  function fmtDate(dateStr) {
    if (!dateStr) return '—';
    var parse = (window.LaborPro && window.LaborPro.parseDateTW) || function (s) { return new Date(s); };
    var d = parse(dateStr);
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
  }

  window.LaborPro = window.LaborPro || {};
  window.LaborPro.fmt = fmt;
  window.LaborPro.fmtNum = fmtNum;
  window.LaborPro.fmtPercent = fmtPercent;
  window.LaborPro.fmtTenure = fmtTenure;
  window.LaborPro.fmtDate = fmtDate;
})();
