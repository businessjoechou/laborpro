/**
 * calc-utils.js — LaborPro 共用計算函數
 *
 * ## 法源與版本
 * - 勞動基準法（民國 113/07/31 最後修正）
 * - 勞工退休金條例（民國 108/05/15 最後修正）
 * - 最低工資法（民國 112/12/27 制定，113/01/01 施行）
 * - 勞工保險投保薪資分級表：勞動部勞動保 2 字第 1140091863 號令修正，自 115/01/01 施行
 * - 2026 勞保費率 12.5%（普通事故 11.5% + 就業保險 1%）
 * - 2026 職災保險費率 0.21%
 * - 健保分級表：衛福部 114/12/12 公告，自 115/01/01 施行，共 58 級、最高 313,000 元
 *
 * 新年度調整時必須同步更新 LABOR_INSURANCE_BRACKETS_2026、RATES。舊版本請透過 version key 保留。
 */
(function () {

  /**
   * 計算兩個日期之間的年月日差距
   *
   * 年資計算：改以 `totalDays / 365` 換算，避免「日/30 再 月/12」雙重折算誤差。
   * 實務上勞退條例§12 細則以「日」計；勞基法§17 亦以「日」換算（見最高法院 100 台上 1546）。
   *
   * @returns {{ years, months, days, totalMonths, totalDays, serviceYears }}
   */
  function calcMonths(fromStr, toStr) {
    // 透過 LaborPro.parseDateTW 以台北時區解析，避免 new Date('YYYY-MM-DD') 被當 UTC
    var parse = (window.LaborPro && window.LaborPro.parseDateTW) || function (s) { return new Date(s); };
    var d1 = parse(fromStr), d2 = parse(toStr);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) {
      return { years: 0, months: 0, days: 0, totalMonths: 0, totalDays: 0, serviceYears: 0 };
    }

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
    // 年資（法定計算基礎）：以自然日 / 365 換算（勞基法§84-2 實務），避免 30/365 混用誤差
    var serviceYears = totalDays / 365;
    // 向下相容：舊 callers 預期的 totalMonths（非實際月曆月份，而是 serviceYears × 12）
    //   新 callers 建議直接用 serviceYears；日後版本可能棄用 totalMonths 欄位
    var totalMonths = serviceYears * 12;

    return {
      years: years, months: months, days: days,
      totalMonths: totalMonths,
      totalDays: totalDays,
      serviceYears: serviceYears,
    };
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
   * 勞退／勞保老年給付「平均餘命月數」簡表
   *
   * ⚠️ 資訊缺口 TODO（P1，跨輪待辦）：目前採常見簡化表（60歲=288月、65歲=228月、70歲=168月）。
   *   實務之精確值應依「內政部生命表」及「勞工退休基金會 年金生命表」定期更新；
   *   後續應：(a) 建立 LIFE_MONTHS_VERSIONS = { 2026: {...}, 年齡逐歲 }
   *          (b) 註記內政部公告日期／條號
   *          (c) 提供 getLifeMonths(age, { year }) 介面
   *
   * 本函式為**所有頁面的平均餘命月數單一真實來源**，禁止在頁面內硬編複製。
   */
  function getLifeMonths(age) {
    if (age <= 60) return 288; // 約 24 年
    if (age <= 65) return 228; // 約 19 年
    return 168;                // 約 14 年
  }

  /**
   * 勞退新制（勞退條例§24、§24-2）一次領 / 月退
   * - 年資滿 15 年可選月退或一次領；未滿 15 年僅能一次領
   * - 月退 = 個人專戶累積本金與收益 ÷ 平均餘命月數
   * @returns {{ lumpSum, monthlyPension, lifeMonths, canMonthly }}
   */
  function calcPensionNew(accountTotal, age, seniorityYears) {
    var lifeMonths = getLifeMonths(age);
    return {
      lumpSum: accountTotal,
      monthlyPension: accountTotal / lifeMonths,
      lifeMonths: lifeMonths,
      canMonthly: seniorityYears >= 15,
    };
  }

  /**
   * 勞退舊制（勞基法§55）基數計算
   * - 前 15 年每滿 1 年 2 個基數
   * - 第 16 年起每滿 1 年 1 個基數
   * - 合計上限 45 個基數
   * - 強制退休（§54-I-1 或職災）且身心障礙 → 加給基數 20%
   * @returns {{ first15, after15, baseUnits, disabilityUnits, totalUnits, totalPay, capped }}
   */
  function calcPensionOld(totalYears, avgWage, isWorkDisability) {
    var first15 = Math.min(totalYears, 15) * 2;
    var after15 = Math.max(totalYears - 15, 0) * 1;
    var baseUnitsRaw = first15 + after15;
    var baseUnits = Math.min(baseUnitsRaw, 45);
    var capped = baseUnitsRaw > 45;
    var disabilityUnits = isWorkDisability ? baseUnits * 0.2 : 0;
    var totalUnits = baseUnits + disabilityUnits;
    return {
      first15: first15,
      after15: after15,
      baseUnits: baseUnits,
      disabilityUnits: disabilityUnits,
      totalUnits: totalUnits,
      totalPay: totalUnits * avgWage,
      capped: capped,
    };
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
   *
   * 門檻換算：年資「滿 X 個月」採「工作自到職日起滿 X × 30 日」，亦即本函式
   * 之 totalMonths 係以「自然日 / 30」概念之整體估算；臨界點之精確計算請
   * 輔以勞動部令 105.9.10 勞動條 3 字第 1050132270 號函釋之個案判斷。
   *   <6 月：無特休；<12 月：3 日；<24 月：7 日；<36 月：10 日
   *   <60 月：14 日；<120 月：15 日；10 年後每滿 1 年 +1 日，上限 30 日
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
   * 勞工保險投保薪資分級表（2026 版，自 115/01/01 施行）
   * 勞動部勞動保 2 字第 1140091863 號令修正，全時勞工共 11 級
   * @see https://www.bli.gov.tw/0005475.html
   *
   * 部分工時（Part-time）最低投保薪資有獨立下限，本表僅涵蓋全時勞工。
   */
  var LABOR_INSURANCE_BRACKETS_2026 = [
    29500, 30300, 31800, 33300, 34800, 36300,
    38200, 40100, 42000, 43900, 45800
  ];

  /**
   * 2026 年社保費率（驗證來源：勞動部、衛福部 114 年底公告）
   */
  var LABOR_RATES_2026 = {
    /** 勞保費率 12.5% = 普通事故 11.5% + 就業保險 1% */
    labor: 0.125,
    /** 勞保費率：勞工自付 20% */
    laborEmployee: 0.20,
    /** 勞保費率：雇主負擔 70% */
    laborEmployer: 0.70,
    /** 勞保費率：政府補助 10% */
    laborGovt: 0.10,
    /** 職災保險平均費率 0.21%（⚠️ 實際因行業別而異，0.04%~1.13%；請勞保局查行業別碼確認
     *  法源：勞工職業災害保險及保護法§16 + 職業災害保險適用行業別及費率表）*/
    accident: 0.0021,
    /** 健保費率 5.17%（2021/1/1 調整後沿用） */
    nhi: 0.0517,
    /** 健保雇主負擔 60% */
    nhiEmployer: 0.60,
    /** 健保受僱者負擔 30%（餘 10% 政府） */
    nhiEmployee: 0.30,
    /** 勞退月提繳費率 6%（勞退條例§14） */
    pension: 0.06,
    /** 健保平均眷屬口數（2024 衛福部公告） */
    nhiAvgDependents: 0.58,
  };

  /**
   * 勞保投保薪資級距查表（2026 年 11 級表）
   * @param {number} monthlySalary
   * @returns {number} 對應之月投保薪資
   */
  function getLaborInsuranceBracket(monthlySalary) {
    var brackets = LABOR_INSURANCE_BRACKETS_2026;
    for (var i = 0; i < brackets.length; i++) {
      if (monthlySalary <= brackets[i]) return brackets[i];
    }
    return brackets[brackets.length - 1]; // 超過 45,800 亦以最高級計
  }

  /**
   * 雇主社保成本計算（2026 版）
   *
   * 注意：
   * - 健保投保金額分級表與勞保分級表不同（健保有 58 級、最高 313,000）。
   *   本函式目前以勞保級距近似健保投保金額，**僅在月薪 ≤ 45,800 時準確**；
   *   高薪情境應改用獨立的健保分級查表。TODO：另建 `getNhiBracket()`。
   *
   * @param {number} monthlySalary 月薪（實際薪資）
   * @param {number} dependents    眷屬人數（會投保在本員工名下者）；若為 null 則套用平均 0.58 人
   * @returns {{ laborIns, laborAccident, nhi, pension, total, bracket }}
   */
  function calcEmployerInsuranceCost(monthlySalary, dependents) {
    var bracket = getLaborInsuranceBracket(monthlySalary);
    var R = LABOR_RATES_2026;
    var depCount = (dependents == null) ? R.nhiAvgDependents : dependents;

    var laborIns = Math.round(bracket * R.labor * R.laborEmployer);
    var laborAccident = Math.round(bracket * R.accident);
    // 健保本人 + 眷屬：實務上眷屬以平均 0.58 人計；超過 3 口者以 3 口封頂（健保法§27）
    var effectiveDep = Math.min(depCount, 3);
    var nhi = Math.round(bracket * R.nhi * R.nhiEmployer * (1 + effectiveDep));
    var pension = Math.round(monthlySalary * R.pension);
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
   *
   * 法源：
   * - 平日延長工時（勞基法§24）：前 2 小時 × 4/3（+33.3%）、第 3-4 小時 × 5/3（+66.7%）
   * - 休息日出勤（勞基法§24 II、§36）：前 2 小時 × 4/3、2~8 小時 × 5/3、超過 8 小時 × 5/3
   *   （休息日超 2 小時之加成率與平日第 3-4 小時相同，細節見勞動部 106.6.16 勞動條 2
   *   字第 1060131319 號函）
   * - 國定假日（§37、§39）與例假（§36、§40）另依雙倍工資計算，本函式未涵蓋
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
  window.LaborPro.getLifeMonths = getLifeMonths;
  window.LaborPro.calcPensionNew = calcPensionNew;
  window.LaborPro.calcPensionOld = calcPensionOld;
  window.LaborPro.getHourlyRate = getHourlyRate;
  window.LaborPro.getDailyRate = getDailyRate;
  window.LaborPro.getAnnualLeaveDays = getAnnualLeaveDays;
  window.LaborPro.getLaborInsuranceBracket = getLaborInsuranceBracket;
  window.LaborPro.calcEmployerInsuranceCost = calcEmployerInsuranceCost;
  window.LaborPro.calcOvertimeCost = calcOvertimeCost;
  // 2026 年常數（供其他模組重用，避免散落硬編碼）
  window.LaborPro.LABOR_INSURANCE_BRACKETS_2026 = LABOR_INSURANCE_BRACKETS_2026;
  window.LaborPro.LABOR_RATES_2026 = LABOR_RATES_2026;
})();
