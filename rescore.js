/* ────────────────────────────────────────────────────────────
   rescore.js — 생존 47사 QARP 밸류 재채점 스크립트 (Phase 3 갱신용)
   목적: 시총 수작업 갱신 시 산술을 자동화해 §6.5류 오류(단위 오독·계산 실수)를 차단.
   산식(plan §8.6과 동일, 공표 정수 기반 재현 가능):
     영업익 = sales × opm / 100 (FIGURES, 최신 통기 실적)
     배수: POP = 시총/영업익, PSR = 시총/매출
     백분위 = (자기보다 배수가 비싼 종목 수) / 46 × 100   ← 쌀수록 고득점
     v = round(0.6·POP백분위 + 0.4·PSR백분위)
     qarp = round(0.5·q + 0.5·v)
     rank = qarp 내림차순, 동점 시 v 내림차순
   q(품질)는 Phase 1 산출값 고정(간토전화만 §5 갱신 q=38).
   사용법:
     node rescore.js                     → 저장값 검증(스냅샷 v 47/47 + vNow/qarpNow/rankNow 재현)
     node rescore.js new-caps.json       → 새 시총으로 재채점 (JSON: {"6855": 1200, ...} 단위=억엔)
                                           갱신 안 한 종목은 기존 mktcapNow 유지 — 전량 갱신 권장(코호트 백분위라
                                           일부만 갱신하면 점수 기반이 오염됨, plan §8.4 참조)
   ──────────────────────────────────────────────────────────── */
"use strict";
const FIGURES = require("./screening-data.js");
const PHASE2 = require("./phase2-data.js");

/* 생존 47사 코호트: q = plan §3(간토전화만 §5 갱신 38), mktcapNow = 2026-07-03 종가(plan §8.4·§8.6),
   vSnap = 스냅샷 밸류(검증용), qarpNowExp/rankNowExp = 저장 기대값(plan §8.6 + phase2-data.js) */
const COHORT = {
  "6855": { name: "일본전자재료", q: 70, vSnap: 86, mktcapNow: 1136, qarpNowExp: 69, rankNowExp: 1 },
  "5706": { name: "미쓰이금속", q: 54, vSnap: 100, mktcapNow: 22242, qarpNowExp: 63, rankNowExp: 7 },
  "6627": { name: "테라프로브", q: 59, vSnap: 93, mktcapNow: 1288, qarpNowExp: 66, rankNowExp: 3 },
  "4966": { name: "우에무라공업", q: 67, vSnap: 83, mktcapNow: 4820, qarpNowExp: 52, rankNowExp: 19 },
  "6590": { name: "시바우라메카", q: 37, vSnap: 97, mktcapNow: 4178, qarpNowExp: 33, rankNowExp: 43 },
  "6857": { name: "어드밴테스트", q: 74, vSnap: 57, mktcapNow: 214805, qarpNowExp: 39, rankNowExp: 38 },
  "6941": { name: "야마이치전기", q: 55, vSnap: 74, mktcapNow: 2056, qarpNowExp: 57, rankNowExp: 15 },
  "4626": { name: "다이요HD", q: 64, vSnap: 59, mktcapNow: 5830, qarpNowExp: 60, rankNowExp: 13 },
  "5333": { name: "일본가이시", q: 33, vSnap: 88, mktcapNow: 21839, qarpNowExp: 40, rankNowExp: 33 },
  "6859": { name: "에스펙", q: 42, vSnap: 78, mktcapNow: 1015, qarpNowExp: 66, rankNowExp: 2 },
  "4368": { name: "후소화학", q: 66, vSnap: 52, mktcapNow: 4613, qarpNowExp: 47, rankNowExp: 26 },
  "4047": { name: "간토전화", q: 38, vSnap: 85, mktcapNow: 2003, qarpNowExp: 35, rankNowExp: 40 },
  "6368": { name: "오르가노", q: 46, vSnap: 67, mktcapNow: 7476, qarpNowExp: 47, rankNowExp: 25 },
  "5334": { name: "니테라", q: 34, vSnap: 76, mktcapNow: 21897, qarpNowExp: 54, rankNowExp: 18 },
  "6490": { name: "일본필러(PILLAR)", q: 55, vSnap: 54, mktcapNow: 2682, qarpNowExp: 48, rankNowExp: 24 },
  "4203": { name: "스미토모BL", q: 56, vSnap: 53, mktcapNow: 6624, qarpNowExp: 64, rankNowExp: 5 },
  "6856": { name: "호리바", q: 44, vSnap: 64, mktcapNow: 11688, qarpNowExp: 46, rankNowExp: 28 },
  "5393": { name: "니치아스", q: 27, vSnap: 80, mktcapNow: 7550, qarpNowExp: 42, rankNowExp: 32 },
  "4109": { name: "스텔라케미파", q: 49, vSnap: 57, mktcapNow: 817, qarpNowExp: 61, rankNowExp: 10 },
  "4980": { name: "덱세리얼즈", q: 57, vSnap: 40, mktcapNow: 7510, qarpNowExp: 49, rankNowExp: 23 },
  "6258": { name: "히라타기공", q: 25, vSnap: 71, mktcapNow: 997, qarpNowExp: 61, rankNowExp: 9 },
  "3110": { name: "닛토방적", q: 30, vSnap: 66, mktcapNow: 6837, qarpNowExp: 25, rankNowExp: 45 },
  "4971": { name: "메크", q: 80, vSnap: 13, mktcapNow: 2028, qarpNowExp: 47, rankNowExp: 27 },
  "7995": { name: "발카", q: 43, vSnap: 50, mktcapNow: 1325, qarpNowExp: 55, rankNowExp: 17 },
  "4186": { name: "도쿄오카(TOK)", q: 56, vSnap: 37, mktcapNow: 13872, qarpNowExp: 39, rankNowExp: 36 },
  "7745": { name: "A&D홀론", q: 26, vSnap: 67, mktcapNow: 813, qarpNowExp: 63, rankNowExp: 6 },
  "4062": { name: "이비덴", q: 37, vSnap: 55, mktcapNow: 65767, qarpNowExp: 20, rankNowExp: 46 },
  "6361": { name: "에바라", q: 29, vSnap: 62, mktcapNow: 27720, qarpNowExp: 39, rankNowExp: 35 },
  "5208": { name: "아리사와", q: 31, vSnap: 60, mktcapNow: 936, qarpNowExp: 56, rankNowExp: 16 },
  "6988": { name: "닛토덴코", q: 30, vSnap: 57, mktcapNow: 21866, qarpNowExp: 60, rankNowExp: 12 },
  "6146": { name: "디스코", q: 86, vSnap: 0, mktcapNow: 83083, qarpNowExp: 45, rankNowExp: 30 },
  "7729": { name: "도쿄정밀", q: 59, vSnap: 27, mktcapNow: 8190, qarpNowExp: 46, rankNowExp: 29 },
  "4462": { name: "이시하라케미컬", q: 38, vSnap: 46, mktcapNow: 514, qarpNowExp: 62, rankNowExp: 8 },
  "6871": { name: "마이크로닉스", q: 68, vSnap: 13, mktcapNow: 6404, qarpNowExp: 39, rankNowExp: 37 },
  "6323": { name: "로체", q: 49, vSnap: 27, mktcapNow: 8714, qarpNowExp: 35, rankNowExp: 41 },
  "6370": { name: "구리타공업", q: 38, vSnap: 38, mktcapNow: 10920, qarpNowExp: 51, rankNowExp: 20 },
  "6961": { name: "엔플라스", q: 44, vSnap: 25, mktcapNow: 1294, qarpNowExp: 49, rankNowExp: 22 },
  "6383": { name: "다이후쿠", q: 33, vSnap: 31, mktcapNow: 27776, qarpNowExp: 33, rankNowExp: 42 },
  "6728": { name: "알박(ULVAC)", q: 24, vSnap: 40, mktcapNow: 4975, qarpNowExp: 49, rankNowExp: 21 },
  "7713": { name: "시그마광기", q: 29, vSnap: 34, mktcapNow: 159, qarpNowExp: 60, rankNowExp: 11 },
  "6315": { name: "TOWA", q: 58, vSnap: 2, mktcapNow: 2506, qarpNowExp: 40, rankNowExp: 34 },
  "5384": { name: "후지미", q: 47, vSnap: 11, mktcapNow: 3596, qarpNowExp: 38, rankNowExp: 39 },
  "5310": { name: "도요탄소", q: 45, vSnap: 9, mktcapNow: 1619, qarpNowExp: 44, rankNowExp: 31 },
  "6327": { name: "기타가와정기", q: 25, vSnap: 23, mktcapNow: 694, qarpNowExp: 14, rankNowExp: 47 },
  "4970": { name: "도요합성", q: 26, vSnap: 21, mktcapNow: 1399, qarpNowExp: 27, rankNowExp: 44 },
  "6266": { name: "타츠모", q: 31, vSnap: 15, mktcapNow: 724, qarpNowExp: 57, rankNowExp: 14 },
  "6338": { name: "타카토리", q: 31, vSnap: 7, mktcapNow: 94, qarpNowExp: 64, rankNowExp: 4 },
};

const CODES = Object.keys(COHORT);
if (CODES.length !== 47) { console.error("코호트가 47사가 아님: " + CODES.length); process.exit(1); }

function opIncome(code) { const f = FIGURES[code]; return f.sales * f.opm / 100; }

/* caps: {code: 시총(억엔)} — 47사 전체 */
function score(caps) {
  const rows = CODES.map(code => {
    const f = FIGURES[code];
    return { code, name: COHORT[code].name, q: COHORT[code].q, cap: caps[code],
      pop: caps[code] / opIncome(code), psr: caps[code] / f.sales };
  });
  for (const r of rows) {
    const popPct = rows.filter(o => o.pop > r.pop).length / 46 * 100;
    const psrPct = rows.filter(o => o.psr > r.psr).length / 46 * 100;
    r.v = Math.round(0.6 * popPct + 0.4 * psrPct);
    r.qarp = Math.round(0.5 * r.q + 0.5 * r.v);
  }
  rows.sort((a, b) => b.qarp - a.qarp || b.v - a.v);
  rows.forEach((r, i) => { r.rank = i + 1; });
  return rows;
}

function pad(s, n) { s = String(s); return s + " ".repeat(Math.max(0, n - s.length)); }

const overridePath = process.argv[2];
if (!overridePath) {
  /* ── 검증 모드 ── */
  let bad = 0;

  // 1) 스냅샷 v 재현 (FIGURES.mktcap)
  const snapCaps = {}; CODES.forEach(c => { snapCaps[c] = FIGURES[c].mktcap; });
  const snap = score(snapCaps);
  for (const r of snap) {
    if (r.v !== COHORT[r.code].vSnap) { console.log(`  ✗ v스냅샷 불일치 ${r.code} ${r.name}: 계산 ${r.v} vs 저장 ${COHORT[r.code].vSnap}`); bad++; }
  }
  console.log(`[1] 스냅샷 v 재현: ${47 - snap.filter(r => r.v !== COHORT[r.code].vSnap).length}/47 일치`);

  // 2) vNow/qarpNow/rankNow 재현 (mktcapNow 2026-07-03)
  const nowCaps = {}; CODES.forEach(c => { nowCaps[c] = COHORT[c].mktcapNow; });
  const now = score(nowCaps);
  for (const r of now) {
    const exp = COHORT[r.code];
    if (r.qarp !== exp.qarpNowExp || r.rank !== exp.rankNowExp) {
      console.log(`  ✗ Now 불일치 ${r.code} ${r.name}: 계산 qarp ${r.qarp}(#${r.rank}) vs 저장 ${exp.qarpNowExp}(#${exp.rankNowExp})`); bad++;
    }
  }
  console.log(`[2] qarpNow·rankNow 재현: ${47 - now.filter(r => r.qarp !== COHORT[r.code].qarpNowExp || r.rank !== COHORT[r.code].rankNowExp).length}/47 일치`);

  // 3) phase2-data.js의 14사 vNow 대조
  let vBad = 0;
  for (const h of PHASE2.holdings) {
    const r = now.find(o => o.code === h.code);
    if (r.v !== h.vNow) { console.log(`  ✗ vNow 불일치 ${h.code} ${h.name}: 계산 ${r.v} vs data.js ${h.vNow}`); vBad++; bad++; }
  }
  console.log(`[3] 최종 14사 vNow(phase2-data.js) 대조: ${14 - vBad}/14 일치`);

  console.log(bad === 0 ? "\n✅ 전 항목 재현 성공 — 산식·데이터 무결" : `\n⚠ 불일치 ${bad}건 — 원인 확인 필요`);
} else {
  /* ── 재채점 모드 ── */
  const upd = JSON.parse(require("fs").readFileSync(overridePath, "utf8"));
  const caps = {}; CODES.forEach(c => { caps[c] = (c in upd) ? upd[c] : COHORT[c].mktcapNow; });
  const missing = CODES.filter(c => !(c in upd));
  if (missing.length) console.log(`⚠ 시총 미갱신 ${missing.length}사(기존 2026-07-03 값 유지): ${missing.join(",")}\n  → 코호트 백분위 점수라 전량 갱신 권장 (plan §8.4 오염 주의)\n`);
  const rows = score(caps);
  console.log(pad("rank", 5) + pad("code", 6) + pad("이름", 14) + pad("시총(억)", 10) + pad("POP", 7) + pad("PSR", 6) + pad("v", 4) + pad("q", 4) + "qarp");
  for (const r of rows) {
    const mark = PHASE2.holdings.some(h => h.code === r.code) ? "◆" : " ";
    console.log(mark + pad("#" + r.rank, 4) + pad(r.code, 6) + pad(r.name, 14) + pad(Math.round(r.cap), 10) + pad(r.pop.toFixed(1), 7) + pad(r.psr.toFixed(2), 6) + pad(r.v, 4) + pad(r.q, 4) + r.qarp);
  }
  console.log("\n◆ = 최종 14사. 이 표를 근거로 phase2-data.js의 mktcapNow·popNow·vNow·qarpNow·rankNow를 갱신할 것.");
}
