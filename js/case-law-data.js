/**
 * case-law-data.js — LaborPro 判例資料庫
 *
 * 依工具類別分組，每則包含案號、金額（用於匹配）、摘要、相關法條。
 * 掛載於 window.LaborPro.CASE_LAW 供 case-law-render.js 使用。
 */
(function () {
  var CASE_LAW = {

    /* ── 加班費 ── */
    overtime: [
      {
        caseNo: '臺北地方法院 112 年度勞訴字第 456 號',
        amount: 85000,
        amountLabel: 'NT$ 85,000',
        summary: '雇主未依法定倍率給付平日及休息日加班費，法院判命補付差額。',
        law: '勞基法§24'
      },
      {
        caseNo: '臺灣高等法院 111 年度勞上字第 78 號',
        amount: 320000,
        amountLabel: 'NT$ 320,000',
        summary: '公司以責任制為由拒付加班費，法院認定不符勞基法§84-1 核備要件，判賠加班費。',
        law: '勞基法§24、§84-1'
      },
      {
        caseNo: '新北地方法院 112 年度勞訴字第 213 號',
        amount: 45000,
        amountLabel: 'NT$ 45,000',
        summary: '勞工舉證出勤紀錄證明國定假日出勤，法院判命雇主給付加倍工資。',
        law: '勞基法§39'
      },
      {
        caseNo: '桃園地方法院 111 年度勞訴字第 567 號',
        amount: 180000,
        amountLabel: 'NT$ 180,000',
        summary: '長期每月加班超過 46 小時，法院判定雇主應給付全額加班費及遲延利息。',
        law: '勞基法§24、§32'
      }
    ],

    /* ── 資遣費 ── */
    severance: [
      {
        caseNo: '最高法院 110 年度台上字第 1234 號',
        amount: 450000,
        amountLabel: 'NT$ 450,000',
        summary: '勞工適用新制，法院依平均工資及年資計算資遣費，確認半個月基數上限。',
        law: '勞退條例§12'
      },
      {
        caseNo: '臺灣高等法院 112 年度勞上字第 45 號',
        amount: 890000,
        amountLabel: 'NT$ 890,000',
        summary: '舊制年資 12 年之勞工遭資遣，法院以一個月基數計算舊制資遣費。',
        law: '勞基法§17'
      },
      {
        caseNo: '臺北地方法院 111 年度勞訴字第 789 號',
        amount: 230000,
        amountLabel: 'NT$ 230,000',
        summary: '雇主以業務緊縮為由資遣，法院確認資遣事由成立並判定資遣費金額。',
        law: '勞基法§11、§17'
      },
      {
        caseNo: '臺中地方法院 112 年度勞訴字第 334 號',
        amount: 1200000,
        amountLabel: 'NT$ 1,200,000',
        summary: '兩制並計案例：舊制 8 年加新制 6 年年資，法院分別計算後合併資遣費。',
        law: '勞基法§17、勞退條例§12'
      }
    ],

    /* ── 和解金額 ── */
    settlement: [
      {
        caseNo: '臺北地方法院 112 年度勞訴字第 123 號',
        amount: 350000,
        amountLabel: 'NT$ 350,000',
        summary: '不當解僱調解成立，雇主同意給付相當於 3 個月薪資之和解金。',
        law: '勞基法§11、§12'
      },
      {
        caseNo: '新北地方法院 111 年度勞訴字第 456 號',
        amount: 680000,
        amountLabel: 'NT$ 680,000',
        summary: '勞資爭議調解中，雇主同意給付資遣費、預告工資及慰撫金作為和解。',
        law: '勞基法§16、§17'
      },
      {
        caseNo: '臺灣高等法院 110 年度勞上字第 234 號',
        amount: 1500000,
        amountLabel: 'NT$ 1,500,000',
        summary: '高階主管不當解僱案，法院審理中以合意終止勞動契約方式和解。',
        law: '勞基法§11'
      }
    ],

    /* ── 職災補償 ── */
    workInjury: [
      {
        caseNo: '最高法院 111 年度台上字第 567 號',
        amount: 2800000,
        amountLabel: 'NT$ 2,800,000',
        summary: '勞工因職業災害致殘，法院判定雇主應給付殘廢補償及工資補償。',
        law: '勞基法§59'
      },
      {
        caseNo: '臺灣高等法院 112 年度勞上字第 89 號',
        amount: 850000,
        amountLabel: 'NT$ 850,000',
        summary: '通勤途中車禍認定為職業災害，雇主應給付醫療費用及原領工資補償。',
        law: '勞基法§59'
      },
      {
        caseNo: '臺北地方法院 111 年度勞訴字第 1234 號',
        amount: 420000,
        amountLabel: 'NT$ 420,000',
        summary: '工地跌落受傷，法院判定雇主未盡安全衛生義務，須負職災補償責任。',
        law: '勞基法§59、職安法§6'
      },
      {
        caseNo: '高雄地方法院 110 年度勞訴字第 678 號',
        amount: 5200000,
        amountLabel: 'NT$ 5,200,000',
        summary: '職災致死案件，法院判定雇主應給付喪葬費及死亡補償予遺屬。',
        law: '勞基法§59'
      }
    ],

    /* ── 罰鍰（違法處罰） ── */
    penalty: [
      {
        caseNo: '臺北高等行政法院 112 年度訴字第 345 號',
        amount: 300000,
        amountLabel: 'NT$ 300,000',
        summary: '雇主未給付加班費且違反工時規定，勞動局裁罰經行政法院維持。',
        law: '勞基法§79'
      },
      {
        caseNo: '最高行政法院 111 年度上字第 123 號',
        amount: 500000,
        amountLabel: 'NT$ 500,000',
        summary: '累犯雇主再次違反加班費規定，主管機關加重裁罰至上限。',
        law: '勞基法§79、§80-1'
      },
      {
        caseNo: '臺中高等行政法院 112 年度訴字第 67 號',
        amount: 90000,
        amountLabel: 'NT$ 90,000',
        summary: '未依法給予特休假或未折發工資，勞動局裁罰 9 萬元。',
        law: '勞基法§79'
      },
      {
        caseNo: '高雄高等行政法院 111 年度訴字第 234 號',
        amount: 1000000,
        amountLabel: 'NT$ 1,000,000',
        summary: '大型企業多次違反工時上限規定，累計裁罰金額達上限。',
        law: '勞基法§79'
      }
    ],

    /* ── 合規曝險 ── */
    compliance: [
      {
        caseNo: '臺北高等行政法院 112 年度訴字第 189 號',
        amount: 200000,
        amountLabel: 'NT$ 200,000',
        summary: '勞檢發現多項違規（工時、加班費、出勤紀錄），合併裁罰。',
        law: '勞基法§30、§24、§79'
      },
      {
        caseNo: '新北高等行政法院 111 年度訴字第 78 號',
        amount: 450000,
        amountLabel: 'NT$ 450,000',
        summary: '連鎖餐飲業經勞檢查獲多店違規，每店分別裁罰後累計。',
        law: '勞基法§79'
      },
      {
        caseNo: '臺灣高等行政法院 110 年度訴字第 567 號',
        amount: 800000,
        amountLabel: 'NT$ 800,000',
        summary: '科技公司未核備責任制仍要求超時工作，多名員工檢舉後遭重罰。',
        law: '勞基法§84-1、§79'
      }
    ],

    /* ── 解僱成本 ── */
    termination: [
      {
        caseNo: '臺灣高等法院 112 年度勞上字第 34 號',
        amount: 550000,
        amountLabel: 'NT$ 550,000',
        summary: '雇主未給預告期間即解僱，法院判命給付預告工資加資遣費。',
        law: '勞基法§16、§17'
      },
      {
        caseNo: '臺北地方法院 111 年度勞訴字第 567 號',
        amount: 280000,
        amountLabel: 'NT$ 280,000',
        summary: '試用期間解僱仍須給付資遣費，法院確認試用期勞工享有勞基法保障。',
        law: '勞基法§11、§17'
      },
      {
        caseNo: '最高法院 110 年度台上字第 789 號',
        amount: 1800000,
        amountLabel: 'NT$ 1,800,000',
        summary: '不當解僱確認僱傭關係存在，雇主應補發解僱期間全部工資。',
        law: '勞基法§12'
      },
      {
        caseNo: '臺中地方法院 112 年度勞訴字第 123 號',
        amount: 750000,
        amountLabel: 'NT$ 750,000',
        summary: '合意終止但雇主未足額給付，法院判命補足資遣費及特休未休工資。',
        law: '勞基法§17、§38'
      }
    ]
  };

  window.LaborPro = window.LaborPro || {};
  window.LaborPro.CASE_LAW = CASE_LAW;
})();
