/* Phase 2 최종 포트폴리오 단일소스 — screening-data.js(FIGURES) 기반 QARP 산출 스냅샷
   name/niche/anchor=KO, nameJa/nicheJa/anchorJa=JA. q=품질 v=밸류 qarp=종합(0.5q+0.5v)
   kind=backbone(Quality×Value)/anchor(가설앵커 오버레이). 간토전화(4047)는 실적OPM6.8%<8 게이트 제외. */
var PHASE2 = {
  meta: { screened:100, survived:47, final:19 },
  holdings: [
    {"code":"6855","name":"일본전자재료","nameJa":"日本電子材料","cat":"인프라","q":70,"v":86,"qarp":78,"rank":1,"kind":"backbone","anchor":"입지: 구마모토 기쿠치 주력공장(JASM 인근)","anchorJa":"立地: 熊本菊池の主力工場(JASM近接)","niche":"프로브카드 국내 2위","nicheJa":"프로브카드 국내 2위","pop":4.8,"cluster":"도호쿠"},
    {"code":"5706","name":"미쓰이금속광업","nameJa":"三井金属鉱山","cat":"소재·부품","q":54,"v":100,"qarp":77,"rank":2,"kind":"backbone","anchor":"","anchorJa":"","niche":"극박 동박 MicroThin 세계 약 100%","nicheJa":"極薄銅箔 MicroThin 世界約100%","pop":2,"cluster":"규슈"},
    {"code":"6627","name":"테라프로브","nameJa":"テラプローブ","cat":"인프라","q":59,"v":93,"qarp":76,"rank":3,"kind":"backbone","anchor":"입지: 구마모토 九州事業所","anchorJa":"立地: 熊本 九州事業所","niche":"메모리·LSI 테스트 수탁 국내 톱급","nicheJa":"メモリ・LSIテスト受託 国内トップ級","pop":4.3,"cluster":"규슈"},
    {"code":"4966","name":"우에무라공업","nameJa":"上村工業","cat":"패키징","q":67,"v":83,"qarp":75,"rank":4,"kind":"backbone","anchor":"","anchorJa":"","niche":"기판용 무전해 금도금(ENEPIG) 1위","nicheJa":"基板用無電解金めっき(ENEPIG)1位","pop":5.2,"cluster":"규슈"},
    {"code":"6590","name":"시바우라 메카트로닉스","nameJa":"芝浦メカトロニクス","cat":"인프라","q":37,"v":97,"qarp":67,"rank":5,"kind":"backbone","anchor":"공급: TSMC 선단패키징 우수공급사","anchorJa":"供給: TSMC先端パッケージ優秀サプライヤー","niche":"플립칩 본더·매엽 세정 고점유","nicheJa":"フリップチップボンダ・枚葉洗浄 高シェア","pop":4.1,"cluster":"규슈"},
    {"code":"6857","name":"어드밴테스트","nameJa":"アドバンテスト","cat":"인프라","q":74,"v":57,"qarp":65,"rank":6,"kind":"backbone","anchor":"","anchorJa":"","niche":"메모리·SoC 테스터 세계 톱","nicheJa":"メモリ・SoCテスタ世界トップ","pop":7,"cluster":"규슈"},
    {"code":"6941","name":"야마이치전기","nameJa":"山一電機","cat":"인프라","q":55,"v":74,"qarp":64,"rank":7,"kind":"backbone","anchor":"","anchorJa":"","niche":"번인·테스트 소켓 세계 상위","nicheJa":"バーンイン・テストソケット世界上位","pop":6.8,"cluster":"규슈"},
    {"code":"4626","name":"다이요HD","nameJa":"太陽ホールディングス","cat":"소재·부품","q":64,"v":59,"qarp":62,"rank":8,"kind":"backbone","anchor":"입지: 기타큐슈 사업소(부분)","anchorJa":"立地: 北九州事業所(部分)","niche":"솔더 레지스트 세계 1위","nicheJa":"ソルダーレジスト世界1位","pop":7.7,"cluster":"규슈"},
    {"code":"5333","name":"일본가이시","nameJa":"日本ガイシ","cat":"장치부재","q":33,"v":88,"qarp":61,"rank":9,"kind":"backbone","anchor":"","anchorJa":"","niche":"정전척·세라믹 히터 세계 상위","nicheJa":"静電チャック・セラミックヒーター世界上位","pop":6.5,"cluster":"규슈"},
    {"code":"6859","name":"에스펙","nameJa":"エスペック","cat":"인프라","q":42,"v":78,"qarp":60,"rank":10,"kind":"backbone","anchor":"","anchorJa":"","niche":"신뢰성·번인용 환경시험기 세계 1위","nicheJa":"信頼性・バーンイン環境試験器世界1位","pop":8.2,"cluster":"규슈"},
    {"code":"4368","name":"후소화학공업","nameJa":"扶桑化学工業","cat":"소재·부품","q":66,"v":52,"qarp":59,"rank":11,"kind":"backbone","anchor":"","anchorJa":"","niche":"초고순도 콜로이달 실리카 세계 독점급","nicheJa":"超高純度コロイダルシリカ世界独占級","pop":8.5,"cluster":"홋카이도"},
    {"code":"6368","name":"오르가노","nameJa":"オルガノ","cat":"장치부재","q":46,"v":67,"qarp":57,"rank":13,"kind":"backbone","anchor":"공급: TSMC 초순수 직접납품·수상","anchorJa":"供給: TSMC超純水を直接納入・受賞","niche":"초순수 제조장치(TSMC 실적 풍부)","nicheJa":"超純水製造装置(TSMC実績豊富)","pop":7.4,"cluster":"규슈"},
    {"code":"5334","name":"일본특수도업","nameJa":"日本特殊陶業","cat":"패키징","q":34,"v":76,"qarp":55,"rank":14,"kind":"backbone","anchor":"","anchorJa":"","niche":"세라믹·FC-BGA 패키지 기판 상위","nicheJa":"セラミック・FC-BGAパッケージ基板上位","pop":7.1,"cluster":"규슈"},
    {"code":"6490","name":"일본필러공업","nameJa":"日本ピラー工業","cat":"장치부재","q":55,"v":54,"qarp":55,"rank":15,"kind":"backbone","anchor":"","anchorJa":"","niche":"초고순도 불소수지 조인트 세계 톱급","nicheJa":"超高純度フッ素樹脂継手世界トップ級","pop":8.7,"cluster":"규슈"},
    {"code":"4203","name":"스미토모 베이클라이트","nameJa":"住友ベークライト","cat":"소재·부품","q":56,"v":53,"qarp":54,"rank":16,"kind":"backbone","anchor":"","anchorJa":"","niche":"에폭시 봉지재 세계 1위","nicheJa":"エポキシ封止材世界1位","pop":10.7,"cluster":"규슈"},
    {"code":"6856","name":"호리바제작소","nameJa":"堀場製作所","cat":"장치부재","q":44,"v":64,"qarp":54,"rank":17,"kind":"anchor","anchor":"입지: 자회사 堀場エステック 구마모토","anchorJa":"立地: 子会社 堀場エステック 熊本","niche":"매스플로 컨트롤러(MFC) 세계 약 60%","nicheJa":"マスフローコントローラ(MFC)世界約60%","pop":8.5,"cluster":"규슈"},
    {"code":"4186","name":"도쿄오카공업","nameJa":"東京応化工業","cat":"소재·부품","q":56,"v":37,"qarp":46,"rank":25,"kind":"anchor","anchor":"입지+공급: 구마모토·고리야마 신공장 / TSMC 서플라이어","anchorJa":"立地+供給: 熊本・郡山新工場 / TSMCサプライヤー","niche":"후공정 후막 포토레지스트 세계 톱","nicheJa":"後工程厚膜フォトレジスト世界トップ","pop":10.1,"cluster":"규슈"},
    {"code":"6146","name":"디스코","nameJa":"ディスコ","cat":"인프라","q":86,"v":0,"qarp":43,"rank":31,"kind":"anchor","anchor":"공급: TSMC 선단패키징 우수공급사(다이싱 세계1위)","anchorJa":"供給: TSMC先端パッケージ優秀サプライヤー(ダイシング世界1位)","niche":"다이싱 소·그라인더 세계 1위(소모품 일체)","nicheJa":"ダイシングソー・グラインダー世界1位","pop":49.2,"cluster":"규슈"},
    {"code":"6323","name":"로체","nameJa":"ローツェ","cat":"인프라","q":49,"v":27,"qarp":38,"rank":35,"kind":"anchor","anchor":"입지: Rorze 구마모토 거점","anchorJa":"立地: Rorze 熊本拠点","niche":"웨이퍼·레티클 반송로봇·EFEM 고점유","nicheJa":"ウェハ・レチクル搬送ロボット・EFEM高シェア","pop":12.2,"cluster":"규슈"}
  ]
};
if (typeof module!=='undefined' && module.exports) module.exports = PHASE2;
