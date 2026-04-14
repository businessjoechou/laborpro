/**
 * calc-utils.js — LaborPro 共用計算函數
 */
(function () {

  /**
   * 計算兩個日期之間的年月日差距
   * @returns {{ years, months, days, totalMonths, totalDays }}
   */
  function calcMonths(fromStr, toStr) {
    var d1 = new Date(fromStr), d2 = new Date(toStr);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) return { years: 0, months: 0, days: 0, totalMonths: 0, totalDays: 0 };

    var years = d2.getFullYear() - d1.getFullYear();
    var months = d2.getMonth() - d1.getMonth();
    var days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      var prev = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prev.getDate();
    }
    if (months < 0) { years--; months += 12; }

    var totalDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    var totalMonths = years * 12 + months + (days / 30);

    return { years: years, months: months, days: days, totalMonths: totalMonths, totalDays: totalDays };
  }

  /**
   * 新制資遣費（勞退條例§12）
   * 每滿1年 = 0.5個月平均薪資，上限6個月
   */
  function calcSeveranceNew(totalMonths, avgWage) {
    var raw = totalMonths / 12 * 0.5;
    return Math.min(raw, 6) * avgWage;
  }

  /**
   * 舊制資遣費（勞基法§17）
   * 每滿1年 = 1個月平均薪資，不足1年按比例，無上限
   */
  function calcSeveranceOld(totalMonths, avgWage) {
    var raw = totalMonths / 12;
    return raw * avgWage;
  }

  /**
   * 預告期間（勞基法§16）
   * @returns {{ days, amount, label }}
   */
  function calcNotice(totalMonths, avgWage) {
    if (totalMonths < 3)  return { days: 0,  amount: 0,                   label: '未滿3個月，無需預告' };
    if (totalMonths < 12) return { days: 10, amount: avgWage / 30 * 10,   label: '3個月以上未滿1年：10日' };
    if (totalMonths < 36) return { days: 20, amount: avgWage / 30 * 20,   label: '1年以上未滿3年：20日' };
    return                       { days: 30, amount: avgWage / 30 * 30,   label: '3年以上：30日' };
  }

  /**
   * 時薪計算（月薪 ÷ 30 ÷ 8）
   */
  function getHourlyRate(monthlySalary) {
    return monthlySalary / 30 / 8;
  }

  /**
   * 日薪計算（月薪 ÷ 30）
   */
  function getDailyRate(monthlySalary) {
    return monthlySalary / 30;
  }

  /**
   * 特休天數查表（勞基法§38）
   */
  function getAnnualLeaveDays(totalMonths) {
    if (totalMonths < 6) return 0;
    if (totalMonths < 12) return 3;
    if (totalMonths < 24) return 7;
    if (totalMonths < 36) return 10;
    if (totalMonths < 60) return 14;
    if (totalMonths < 120) return 15;

    var fullYears = Math.floor(totalMonths / 12);
    return Math.min(15 + (fullYears - 10), 30);
  }

  /**
   * 勞保投保薪資級距查表（2026年）
   * 返回對應的投保薪資
   */
  function getLaborInsuranceBracket(monthlySalary) {
    var brackets = [
      11100, 12540, 13500, 15840, 16500, 17280, 17880, 19047, 20008,
      21009, 22000, 23100, 24000, 25250, 26400, 27600, 28800, 30300,
      31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800
    ];
    for (var i = 0; i < brackets.length; i++) {
      if (monthlySalary <= brackets[i]) return brackets[i];
    }
    return brackets[brackets.length - 1]; // 最高級距
  }

  /**
   * 雇主社保成本計算
   * @param {number} monthlySalary - 月薪
   * @param {number} dependents - 平均眷屬人數
   * @returns {{ laborIns, laborAccident, nhi, pension, total, bracket }}
   */
  function calcEmployerInsuranceCost(monthlySalary, dependents) {
    var bracket = getLaborInsuranceBracket(monthlySalary);
    var laborIns = Math.round(bracket * 0.12 * 0.7);
    var laborAccident = Math.round(bracket * 0.0021);
    var nhi = Math.round(bracket * 0.0517 * 0.6 * (1 + (dependents || 0)));
    var pension = Math.round(monthlySalary * 0.06);
    return {
      laborIns: laborIns,
      laborAccident: laborAccident,
      nhi: nhi,
      pension: pension,
      total: laborIns + laborAccident + nhi + pension,
      bracket: bracket
    };
  }

  /**
   * 加班費計算（雇主角度）
   */
  function calcOvertimeCost(monthlySalary, hours, type) {
    var hourly = monthlySalary / 30 / 8;
    if (type === 'weekday') {
      var h1 = Math.min(hours, 2);
      var h2 = Math.max(Math.min(hours - 2, 2), 0);
      return h1 * hourly * (4/3) + h2 * hourly * (5/3);
    }
    if (type === 'restday') {
      var r1 = Math.min(hours, 2);
      var r2 = Math.max(Math.min(hours - 2, 6), 0);
      var r3 = Math.max(hours - 8, 0);
      return r1 * hourly * (4/3) + r2 * hourly * (5/3) + r3 * hourly * (5/3);
    }
    if (type === 'mixed') {
      var wdH = hours * 0.6, rdH = hours * 0.4;
      return calcOvertimeCost(monthlySalary, wdH, 'weekday') + calcOvertimeCost(monthlySalary, rdH, 'restday');
    }
    return hours * hourly * 2; // holiday
  }

  window.LaborPro = window.LaborPro || {};
  window.LaborPro.calcMonths = calcMonths;
  window.LaborPro.calcSeveranceNew = calcSeveranceNew;
  window.LaborPro.calcSeveranceOld = calcSeveranceOld;
  window.LaborPro.calcNotice = calcNotice;
  window.LaborPro.getHourlyRate = getHourlyRate;
  window.LaborPro.getDailyRate = getDailyRate;
  window.LaborPro.getAnnualLeaveDays = getAnnualLeaveDays;
  window.LaborPro.getLaborInsuranceBracket = getLaborInsuranceBracket;
  window.LaborPro.calcEmployerInsuranceCost = calcEmployerInsuranceCost;
  window.LaborPro.calcOvertimeCost = calcOvertimeCost;
})();
