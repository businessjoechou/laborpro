/**
 * date-utils.js — LaborPro 時區安全日期解析
 *
 * 解決 `new Date('2020-01-01')` 被當 UTC 00:00 → 台北時區變前一天、
 * 年資/月數計算差一天的 bug。
 *
 * 掛載：window.LaborPro.parseDateTW
 * 使用：calc-utils.js / fmt.js 內部以 LaborPro.parseDateTW(str) 取代 new Date(str)
 *
 * 載入順序：必須在 calc-utils.js 與 fmt.js 之前載入。
 */
(function () {
  function parseDateTW(s) {
    if (s == null || s === '') return new Date(NaN);
    if (s instanceof Date) return new Date(s.getTime());
    var str = String(s).trim();
    if (/[TZ]|[+-]\d\d:?\d\d$/.test(str)) return new Date(str);
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(str)) {
      return new Date(str.replace(/\//g, '-') + 'T00:00:00+08:00');
    }
    return new Date(str);
  }
  window.LaborPro = window.LaborPro || {};
  window.LaborPro.parseDateTW = parseDateTW;
})();
