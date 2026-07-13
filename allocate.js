/* ────────────────────────────────────────────────────────────
   allocate.js — 최종 15사 비중·매수금액 산출 (Phase 3 배분, Round 2 6055 포함)
   방법론(phase3-runbook.md §4):
     ① 기본 비중 ∝ qarpNow (현재가 기준 "좋고 싼" 정도에 비례 — phase2-data.js 단일소스)
     ② 상한 10% / 하한 4% 클립 후 잔여분 미클립 종목에 비례 재배분(반복 수렴)
        — 상한: 단일 종목 의존 방지(분산투자 심사축) / 하한: 테마 필수 종목의 형식적 편입 방지
        — 도호쿠 2사·시바우라 등 "테마상 필수지만 현재가 순위 하위" 종목이 화장품이 되지 않게 보장
     ③ 예산 500만엔에서 매수 수수료 1%×1.1(소비세) 차감 → 투자원금 = 500만/1.011
   사용법: node allocate.js [예산엔]   (기본 5000000)
   출력 금액은 목표 금액 — 실제 주수 = floor(금액/매수일 주가), 체결은 당일 종가(대회 규정).
   ──────────────────────────────────────────────────────────── */
"use strict";
const PHASE2 = require("./phase2-data.js");

const BUDGET = Number(process.argv[2]) || 5000000;
const FEE = 0.01 * 1.1;           // 매수 수수료 1% + 소비세 10%
const CAP = 0.10, FLOOR = 0.04;   // 종목당 상·하한

const H = PHASE2.holdings.map(h => ({ code: h.code, name: h.name, cluster: h.cluster, scope: h.scope, qarpNow: h.qarpNow }));

/* qarpNow 비례 → [FLOOR, CAP] 클립·재배분 (반복 수렴) */
let w = {};
const total = H.reduce((s, h) => s + h.qarpNow, 0);
H.forEach(h => { w[h.code] = h.qarpNow / total; });
for (let iter = 0; iter < 50; iter++) {
  const fixed = new Set();
  H.forEach(h => { if (w[h.code] >= CAP - 1e-12 || w[h.code] <= FLOOR + 1e-12) fixed.add(h.code); });
  let changed = false;
  H.forEach(h => {
    const c = h.code;
    if (w[c] > CAP) { w[c] = CAP; changed = true; }
    if (w[c] < FLOOR) { w[c] = FLOOR; changed = true; }
  });
  const fixedSum = H.filter(h => fixed.has(h.code)).reduce((s, h) => s + w[h.code], 0);
  const freeH = H.filter(h => !fixed.has(h.code));
  const freeQ = freeH.reduce((s, h) => s + h.qarpNow, 0);
  freeH.forEach(h => { w[h.code] = (1 - fixedSum) * h.qarpNow / freeQ; });
  if (!changed && Math.abs(H.reduce((s, h) => s + w[h.code], 0) - 1) < 1e-9) break;
}

const investable = BUDGET / (1 + FEE);
function pad(s, n) { s = String(s); return s + " ".repeat(Math.max(0, n - s.length)); }
function yen(x) { return Math.round(x).toLocaleString("ja-JP"); }

console.log(`예산 ${yen(BUDGET)}엔 / 수수료 실효 ${(FEE * 100).toFixed(1)}% → 투자원금 ${yen(investable)}엔\n`);
console.log(pad("code", 6) + pad("이름", 14) + pad("클러스터", 8) + pad("qarpNow", 9) + pad("비중", 8) + pad("목표금액(엔)", 14) + "수수료(엔)");
let sumW = 0, sumA = 0, sumF = 0;
H.slice().sort((a, b) => w[b.code] - w[a.code]).forEach(h => {
  const amt = investable * w[h.code], fee = amt * FEE;
  sumW += w[h.code]; sumA += amt; sumF += fee;
  console.log(pad(h.code, 6) + pad(h.name, 14) + pad(h.cluster, 8) + pad(h.qarpNow, 9) + pad((w[h.code] * 100).toFixed(2) + "%", 8) + pad(yen(amt), 14) + yen(fee));
});
console.log("\n합계 비중 " + (sumW * 100).toFixed(2) + "% / 매수금액 " + yen(sumA) + "엔 + 수수료 " + yen(sumF) + "엔 = " + yen(sumA + sumF) + "엔");
const kyushu = H.filter(h => h.cluster === "규슈").reduce((s, h) => s + w[h.code], 0);
console.log("클러스터 비중: 규슈 " + (kyushu * 100).toFixed(1) + "% / 도호쿠 " + ((1 - kyushu) * 100).toFixed(1) + "%");
console.log("\n※ 실제 주수 = floor(목표금액 ÷ 매수일 주가). 잔여 현금은 주수 절사에서 자연 발생.");
console.log("※ 매수 전 필수: 48사 시총 재확보 → rescore.js → phase2-data.js 갱신 → 본 스크립트 재실행 (phase3-runbook.md).");
