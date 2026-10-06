const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'backup/index.before-illustrations.html'), 'utf8');
const illustrations = fs.readFileSync(path.join(__dirname, 'illustrations.js'), 'utf8');
const termDefinition = html.match(/const terms = \[[\s\S]*?\n    \];/)[0];
const coverage = vm.runInNewContext(termDefinition+'\n'+illustrations+'\n({total:terms.length,drawings:Object.keys(termVisuals).length,missing:terms.filter(t=>!termVisuals[t.en]).map(t=>t.en)})');
if(coverage.missing.length || coverage.total!==49 || coverage.drawings!==49) throw new Error(JSON.stringify(coverage));

html = html.replace('<html lang="ko">', '<html lang="ja">');
html = html.replace('<title>반도체 후공정 49개 용어 - 한국어/日本語 통합 쉬운 그림 사전</title>', '<title>半導体後工程 49用語 - 韓国語/日本語 統合やさしい図鑑</title>');
html = html.replace('<button class="btn active" id="btnKo">', '<button class="btn" id="btnKo" aria-pressed="false">');
html = html.replace('<button class="btn" id="btnJa">', '<button class="btn active" id="btnJa" aria-pressed="true">');
html = html.replace("    let lang = 'ko';", "    let lang = 'ja';");

html = html.replace('.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}', '.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:16px}');
html = html.replace('    @media print{', `    .card{padding:16px;display:flex;flex-direction:column;min-width:0}
    .term .title{font-size:1.1rem;line-height:1.35}
    .term .subtitle{font-size:.75rem;margin-top:4px}
    .image-wrap{padding:0;margin:3px 0 14px;background:#fff;overflow:hidden;border-color:#deebf4}
    .figure-button{display:block;width:100%;border:0;padding:0;background:#fff;color:var(--ink);font:inherit;cursor:zoom-in;text-align:left}
    .figure-topline{display:flex;justify-content:space-between;gap:10px;padding:9px 12px 0;color:var(--muted);font-size:.72rem;font-weight:700}
    .figure-expand{color:#39739d}
    .term-diagram{display:block;width:100%;height:auto;overflow:hidden}
    .figure-button:hover{background:#f6fbff}
    .figure-button:focus-visible,.btn:focus-visible,.dialog-close:focus-visible,.viewer-nav:focus-visible{outline:3px solid #2b84d8;outline-offset:3px}
    .card .visual-caption{margin-top:12px;padding:9px 10px;border-left:3px solid #bed7e9;background:#f6faff;border-radius:0 8px 8px 0;font-size:.83rem;color:#526c82;line-height:1.65}
    .caption-label{display:block;color:#285778;font-weight:800;font-size:.75rem;margin-bottom:2px}
    .visual-key{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:14px;padding-top:13px;border-top:1px solid var(--line);font-size:.84rem;color:#526c82}
    .visual-key span{display:inline-flex;gap:7px;align-items:center}
    .key-dot{display:inline-block;width:11px;height:11px;border:1px solid #24415b55;border-radius:4px}
    .drawing-note{font-size:.8rem;color:var(--muted);margin:12px 0 0}
    .empty-state{padding:32px;text-align:center;background:#fff;border:1px solid var(--line);border-radius:18px}
    .diagram-viewer{width:min(94vw,960px);max-height:92vh;max-height:92dvh;border:1px solid #c7dbea;border-radius:24px;padding:24px;color:var(--ink);box-shadow:0 24px 90px #14385444;overflow:auto}
    .diagram-viewer::backdrop{background:#183650b8;backdrop-filter:blur(4px)}
    .viewer-header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:12px}
    .viewer-header h2{font-size:clamp(1.35rem,3vw,1.85rem);margin:2px 0 0;line-height:1.3}
    .viewer-category{font-size:.82rem;color:var(--muted);margin:0}
    .dialog-close{border:1px solid var(--line);border-radius:50%;width:40px;height:40px;background:#f4f9fe;color:var(--ink);font-size:25px;cursor:pointer;flex-shrink:0}
    .viewer-drawing{border:1px solid var(--line);border-radius:16px;overflow:auto;background:#fff;overscroll-behavior:contain}
    .viewer-drawing svg{max-height:60vh}
    .viewer-description{margin:16px 0 8px;font-size:1.06rem;font-weight:700}
    .viewer-caption{margin:0;padding:12px 14px;background:#f1f7fc;border-radius:12px;color:#48677e}
    .viewer-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:18px}
    .viewer-nav{border:1px solid var(--line);border-radius:12px;background:#fff;padding:10px 16px;font:inherit;color:var(--ink);font-weight:700;cursor:pointer}
    .viewer-nav:disabled{opacity:.35;cursor:default}
    .viewer-position{font-size:.84rem;color:var(--muted)}
    .viewer-mobile-help{display:none;color:var(--muted);font-size:.79rem;margin:9px 0 0}
    .source-links{margin-top:14px;font-size:.8rem;color:var(--muted)}
    .source-links a{color:#36739d;text-underline-offset:3px}
    @media(max-width:560px){.wrap{padding:18px 10px 32px}.hero{padding:23px 18px}.group{padding:12px}.card{padding:12px}.diagram-viewer{padding:15px;border-radius:18px}.viewer-drawing svg{width:640px;max-width:none;max-height:none}.viewer-drawing{max-height:60vh}.viewer-mobile-help{display:block}.viewer-nav{padding:9px 12px}.figure-topline{font-size:.69rem}}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.card{transition:none}}
    @media print{.toolbar,.figure-expand,.diagram-viewer,.source-links{display:none!important}.card{break-inside:avoid;box-shadow:none}.cards{grid-template-columns:repeat(2,minmax(0,1fr))}.group{border-radius:0}.term-diagram{print-color-adjust:exact}.visual-caption{break-inside:avoid}}
    @media print{`);

html = html.replace('<div class="count" id="resultCount"></div>', '<div class="count" id="resultCount" aria-live="polite"></div>\n    <p class="empty-state hidden" id="noResults"></p>');
html = html.replace('<div class="flowline" id="flowline"></div>', '<div class="flowline" id="flowline"></div>\n      <div class="visual-key" id="visualKey"></div>\n      <p class="drawing-note" id="drawingNote"></p>');
html = html.replace('<p class="small" id="footerSmall"></p>', `<p class="small" id="footerSmall"></p>
      <p class="source-links"><span id="sourceLabel"></span>
        <a href="https://amkor.com/technology/" target="_blank" rel="noopener noreferrer">Amkor · Packaging</a> ·
        <a href="https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/SoIC.htm" target="_blank" rel="noopener noreferrer">TSMC · SoIC</a> ·
        <a href="https://www.ti.com/design-development/packaging.html" target="_blank" rel="noopener noreferrer">TI · Packaging / MSL</a>
      </p>`);
html = html.replace('  <script>', `  <dialog class="diagram-viewer" id="diagramViewer" aria-labelledby="viewerTitle">
    <div class="viewer-header">
      <div><p class="viewer-category" id="viewerCategory"></p><h2 id="viewerTitle"></h2></div>
      <button type="button" class="dialog-close" id="viewerClose" autofocus>×</button>
    </div>
    <div class="viewer-drawing" id="viewerDrawing"></div>
    <p class="viewer-mobile-help" id="viewerMobileHelp"></p>
    <p class="viewer-description" id="viewerDescription"></p>
    <p class="viewer-caption" id="viewerCaption"></p>
    <div class="viewer-footer">
      <button type="button" class="viewer-nav" id="viewerPrev"></button>
      <span class="viewer-position" id="viewerPosition" aria-live="polite"></span>
      <button type="button" class="viewer-nav" id="viewerNext"></button>
    </div>
  </dialog>
  <script>`);

html = html.replace('이 페이지는 49개 용어를 초등학생도 이해하기 쉬운 한 줄 설명과 작은 그림으로 정리한 통합 HTML입니다.', '49개 용어마다 원리를 보여주는 그림과 쉬운 설명이 있어요. 구조와 과정을 눈으로 따라가 보세요.');
html = html.replace('원하는 언어를 누르고, 검색창으로 단어를 찾을 수 있어요.', '한국어·일본어로 읽고, 검색으로 찾으세요. 그림을 누르면 크게 볼 수 있어요.');
html = html.replace('이 파일 하나로 한국어/일본어 버전을 모두 볼 수 있고, 각 용어마다 작은 그림이 함께 들어 있습니다.', '49개 설명 그림이 이 HTML에 모두 들어 있어요. 인터넷 연결 없이도 읽을 수 있고, 그림 속 표기도 언어에 맞춰 바뀝니다.');
html = html.replace('このページは、49個の用語を小学生にもわかりやすい一文と小さなイラストでまとめた統合HTMLです。', '49個の用語それぞれに、仕組みを示す図とやさしい説明があります。構造と工程を目でたどってみましょう。');
html = html.replace('言語ボタンで切り替え、検索ボックスで言葉を探せます。', '韓国語・日本語で読み、検索で探せます。図を押すと大きく見られます。');
html = html.replace('この1つのファイルで韓国語版と日本語版を切り替えて見られ、各用語に小さなイラストが入っています。', '49個の説明図がこのHTMLに入っています。ネット接続なしで読めて、図の表記も言語に合わせて変わります。');
html = html.replace("옆에 있는 두 연결점 사이가 얼마나 가까운지를 나타내는 거리.", "이웃한 두 연결점의 중심에서 중심까지의 거리.");
html = html.replace('となり合う2つの接点がどれくらい近いかを表す距離。', 'となり合う2つの接点の中心から中心までの距離。');
html = html.replace('반도체 패키지가 습기를 얼마나 쉽게 먹는지를 나타내는 등급.', '습기를 먹은 패키지가 납땜 열에 얼마나 민감한지 나타내는 등급.');
html = html.replace('半導体パッケージが湿気をどれくらい気にするかを表す等級。', '湿気を吸ったパッケージが、リフローの熱にどれくらい敏感かを表す等級。');
html = html.replace('납을 뜨겁게 녹였다가 굳혀 칩과 기판을 단단히 연결하는 과정.', '납땜 재료를 열로 녹였다가 굳혀 칩과 기판을 단단히 연결하는 과정.');

const start = html.indexOf('    function categoryColor');
const end = html.indexOf('    function renderStatic(){');
if(start<0||end<start)throw new Error('Could not find original card renderer.');
const cardRenderer = `
    function cardHTML(term){
      const visual = termVisuals[term.en];
      const index = terms.indexOf(term);
      const chosen = lang==='ko'?0:1;
      const description = lang==='ko'?term.ko:term.ja;
      const subtitle = uiText[lang].categories[term.cat];
      const expand = lang==='ko'?'크게 보기 ↗':'拡大する ↗';
      const openLabel = term.en + (lang==='ko'?' 설명 그림 크게 보기':' の説明図を拡大する');
      const search = [term.en,term.ko,term.ja,uiText.ko.categories[term.cat],uiText.ja.categories[term.cat],...visual.hint,...visual.caption].join(' ').toLowerCase();
      return \`<article class="card" data-term="\${index}" data-search="\${escapeHTML(search)}">
        <div class="term">
          <div class="miniicon" aria-hidden="true">\${term.icon}</div>
          <div><div class="title">\${escapeHTML(term.en)}</div><span class="subtitle">\${escapeHTML(subtitle)}</span></div>
        </div>
        <div class="image-wrap"><button type="button" class="figure-button" data-term="\${index}" aria-label="\${escapeHTML(openLabel)}" aria-haspopup="dialog">
          <span class="figure-topline"><span>\${String(index+1).padStart(2,'0')} / 49</span><span class="figure-expand">\${expand}</span></span>
          \${termDiagram(term)}
        </button></div>
        <p class="term-description">\${escapeHTML(description)}</p>
        <p class="visual-caption"><span class="caption-label">\${lang==='ko'?'그림 읽기':'図の読み方'}</span>\${escapeHTML(visual.caption[chosen])}</p>
      </article>\`;
    }

`;
html = html.slice(0,start)+illustrations+'\n'+cardRenderer+html.slice(end);

html = html.replace('      const t = uiText[lang];', '      const t = uiText[lang];\n      document.title = t.heroTitle;');
html = html.replace("      document.getElementById('footerSmall').textContent = t.footerSmall;", `      document.getElementById('footerSmall').textContent = t.footerSmall;
      document.getElementById('noResults').textContent = lang==='ko'?'일치하는 용어가 없어요. 다른 단어로 찾아보세요.':'一致する用語がありません。別の言葉で検索してください。';
      document.getElementById('sourceLabel').textContent = lang==='ko'?'개념 확인 자료: ':'概念の参考資料：';
      document.getElementById('drawingNote').textContent = lang==='ko'?'그림은 원리를 이해하기 위한 설명도예요. 실제 크기와 비율은 다를 수 있어요.':'図は仕組みを理解するための模式図です。実際の大きさや比率とは異なります。';
      const visualKey = lang==='ko'?['칩 / 실리콘','기판','금속 연결','열의 이동']:['チップ / シリコン','基板','金属の接続','熱の移動'];
      document.getElementById('visualKey').innerHTML = visualKey.map((label,i)=>\`<span><i class="key-dot" style="background:\${[illustrationColors.blue,illustrationColors.board,illustrationColors.copper,illustrationColors.hot][i]}"></i>\${label}</span>\`).join('');`);
html = html.replace("if(ok){ shown++; if(q) highlightText(card, document.getElementById('searchBox').value.trim()); }", `if(ok){
          shown++;
          if(q) card.querySelectorAll('.term,.term-description,.visual-caption').forEach(part=>highlightText(part,document.getElementById('searchBox').value.trim()));
        }`);
html = html.replace("      document.getElementById('resultCount').textContent = uiText[lang].resultCount(shown);", "      document.getElementById('resultCount').textContent = uiText[lang].resultCount(shown);\n      document.getElementById('noResults').classList.toggle('hidden',shown!==0);");
html = html.replace("      document.documentElement.lang = lang === 'ko' ? 'ko' : 'ja';", "      document.documentElement.lang = lang === 'ko' ? 'ko' : 'ja';\n      document.getElementById('btnKo').setAttribute('aria-pressed',String(lang==='ko'));\n      document.getElementById('btnJa').setAttribute('aria-pressed',String(lang==='ja'));");
html = html.replace('      sb.placeholder = t.searchPlaceholder;', "      sb.placeholder = t.searchPlaceholder;\n      sb.setAttribute('aria-label',lang==='ko'?'용어 검색':'用語検索');");

const oldHighlight = html.indexOf('    function highlightText(node, query){');
const afterHighlight = html.indexOf('    function filterCards(){',oldHighlight);
html = html.slice(0,oldHighlight)+`    function highlightText(node,query){
      if(!query) return;
      const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
      const nodes=[];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(n=>{
        const regex = new RegExp(escapeRegExp(query),'gi');
        const source = n.nodeValue;
        let match, last=0;
        const fragment=document.createDocumentFragment();
        while((match=regex.exec(source))!==null){
          fragment.appendChild(document.createTextNode(source.slice(last,match.index)));
          const mark=document.createElement('mark');mark.className='hit';mark.textContent=match[0];fragment.appendChild(mark);
          last=match.index+match[0].length;
        }
        if(last){fragment.appendChild(document.createTextNode(source.slice(last)));n.replaceWith(fragment);}
      });
    }

`+html.slice(afterHighlight);

const viewerCode = `
    let viewerIndex=0;
    const viewer=document.getElementById('diagramViewer');
    function renderViewer(){
      const term=terms[viewerIndex], visual=termVisuals[term.en];
      document.getElementById('viewerTitle').textContent=term.en;
      document.getElementById('viewerCategory').textContent=uiText[lang].categories[term.cat];
      document.getElementById('viewerDrawing').innerHTML=termDiagram(term,'viewer');
      document.getElementById('viewerDescription').textContent=lang==='ko'?term.ko:term.ja;
      document.getElementById('viewerCaption').textContent=visual.caption[lang==='ko'?0:1];
      document.getElementById('viewerClose').setAttribute('aria-label',lang==='ko'?'그림 닫기':'図を閉じる');
      document.getElementById('viewerMobileHelp').textContent=lang==='ko'?'그림을 좌우로 밀어서 살펴보세요.':'図を左右に動かしてご覧ください。';
      document.getElementById('viewerPrev').textContent=lang==='ko'?'← 이전':'← 前へ';
      document.getElementById('viewerNext').textContent=lang==='ko'?'다음 →':'次へ →';
      document.getElementById('viewerPrev').disabled=viewerIndex===0;
      document.getElementById('viewerNext').disabled=viewerIndex===terms.length-1;
      document.getElementById('viewerPosition').textContent=(viewerIndex+1)+' / '+terms.length;
      requestAnimationFrame(()=>{
        const drawing=document.getElementById('viewerDrawing');drawing.scrollLeft=Math.max(0,(drawing.scrollWidth-drawing.clientWidth)/2);drawing.scrollTop=0;
      });
    }
    function openViewer(index){
      viewerIndex=index;renderViewer();viewer.showModal();
    }
    function moveViewer(delta){
      if(viewerIndex+delta<0||viewerIndex+delta>=terms.length)return;
      viewerIndex+=delta;renderViewer();
    }
    document.getElementById('groups').addEventListener('click',event=>{
      const button=event.target.closest('.figure-button');
      if(button)openViewer(Number(button.dataset.term));
    });
    document.getElementById('viewerClose').addEventListener('click',()=>viewer.close());
    document.getElementById('viewerPrev').addEventListener('click',()=>moveViewer(-1));
    document.getElementById('viewerNext').addEventListener('click',()=>moveViewer(1));
    viewer.addEventListener('click',event=>{
      if(event.target!==viewer)return;
      const bounds=viewer.getBoundingClientRect();
      if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)viewer.close();
    });
    viewer.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();moveViewer(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();moveViewer(1);}
    });

`;
html=html.replace("    setLang('ko');",viewerCode+"    setLang('ja');");
html=html.replace(/\r\n/g,'\n');
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(path.join(root,'index.html'),html,'utf8');
console.log('Saved index.html with '+coverage.drawings+' unique diagrams, Korean/Japanese labels, and an enlargement viewer.');
