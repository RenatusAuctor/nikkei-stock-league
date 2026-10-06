// Each term has its own explanatory drawing. The build embeds this source in index.html.
const illustrationColors = {
  ink:'#24415b', muted:'#6b8093', blue:'#84bce8', blueDark:'#377cab',
  board:'#a1d8bb', boardDark:'#5c987c', copper:'#da954c', gold:'#ebba67',
  metal:'#d5e0ea', resin:'#40556c', purple:'#c8b9e8', pink:'#f7d1de',
  hot:'#e47661', cold:'#66a9d9', good:'#378b64', bad:'#c95764', white:'#ffffff'
};

function illustrationTools(language, prefix){
  const C = illustrationColors;
  let waferIndex = 0;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rect = (x,y,w,h,fill=C.white,rx=7,stroke=C.ink,sw=2,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
  const path = (d,fill='none',stroke=C.ink,sw=3,extra='') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const line = (x1,y1,x2,y2,stroke=C.ink,sw=3,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${extra}/>`;
  const circle = (x,y,r,fill=C.white,stroke=C.ink,sw=2,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
  const ellipse = (x,y,rx,ry,fill=C.white,stroke=C.ink,sw=2) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const text = (x,y,ko,ja=ko,size=20,fill=C.ink,anchor='middle',weight=700) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(language==='ko'?ko:ja)}</text>`;
  const arrow = (x1,y1,x2,y2,color=C.blueDark,sw=4,double=false) => {
    const a = Math.atan2(y2-y1,x2-x1), head=10+sw/2;
    const tip = (x,y,angle) => path(`M ${x-head*Math.cos(angle-.45)} ${y-head*Math.sin(angle-.45)} L ${x} ${y} L ${x-head*Math.cos(angle+.45)} ${y-head*Math.sin(angle+.45)}`,'none',color,sw);
    return line(x1,y1,x2,y2,color,sw)+tip(x2,y2,a)+(double?tip(x1,y1,a+Math.PI):'');
  };
  const check = (x,y,s=10,color=C.good) => path(`M ${x-s*.7} ${y} l ${s*.45} ${s*.5} l ${s} ${-s*1.1}`,'none',color,4);
  const cross = (x,y,s=9,color=C.bad) => line(x-s,y-s,x+s,y+s,color,4)+line(x+s,y-s,x-s,y+s,color,4);
  const chip = (x,y,w,h,fill=C.blue) => rect(x,y,w,h,fill,5)+line(x+8,y+8,x+w-8,y+8,'#ffffff99',3);
  const board = (x,y,w,h) => rect(x,y,w,h,C.board,4)+line(x+6,y+h-7,x+w-6,y+h-7,C.boardDark,3);
  const balls = (x,y,n,gap=36,r=9,fill=C.metal) => Array.from({length:n},(_,i)=>circle(x+i*gap,y,r,fill,C.ink,1.7)).join('');
  const pkg = (x,y,w=70,h=46,fill=C.resin) => {
    let leads='';
    for(let i=1;i<=4;i++) leads+=rect(x+i*w/5-3,y-7,6,7,C.metal,1,C.ink,1)+rect(x+i*w/5-3,y+h,6,7,C.metal,1,C.ink,1);
    return leads+rect(x,y,w,h,fill,7)+circle(x+10,y+10,2.5,C.white,'none',0);
  };
  const clock = (x,y,r=43,label='') => {
    let ticks='';
    for(let i=0;i<12;i++){const a=i*Math.PI/6;ticks+=line(x+Math.sin(a)*(r-9),y-Math.cos(a)*(r-9),x+Math.sin(a)*(r-5),y-Math.cos(a)*(r-5),C.muted,2);}
    return circle(x,y,r,C.white)+ticks+line(x,y,x,y-r*.5,C.ink,4)+line(x,y,x+r*.38,y+r*.15,C.blueDark,4)+circle(x,y,4,C.ink,'none',0)+(label?text(x,y+r+28,label,label,20):'');
  };
  const heat = (x,y,n=3,color=C.hot) => Array.from({length:n},(_,i)=>path(`M ${x+i*23} ${y} q -10 -12 0 -24 q 10 -12 0 -24`,'none',color,4)+arrow(x+i*23,y-47,x+i*23,y-59,color,3)).join('');
  const drop = (x,y,s=15,fill=C.cold) => path(`M ${x} ${y-s} C ${x-s*1.5} ${y+s*.7} ${x-s*.8} ${y+s*1.4} ${x} ${y+s*1.4} C ${x+s*.8} ${y+s*1.4} ${x+s*1.5} ${y+s*.7} ${x} ${y-s} Z`,fill,fill,1);
  const socket = (x,y,w=120,h=75) => {
    let contacts='';
    for(let i=1;i<=5;i++){contacts+=rect(x+i*w/6-3,y+10,6,14,C.gold,1,C.copper,1)+rect(x+i*w/6-3,y+h-24,6,14,C.gold,1,C.copper,1);}
    return board(x,y,w,h)+rect(x+12,y+18,w-24,h-36,C.resin,3)+contacts;
  };
  const wafer = (x,y,r=86,marks=false,packaged=false) => {
    const id=prefix+'-wafer-'+waferIndex++;
    let cells=''; const step=r/3.25;
    for(let row=-3;row<=3;row++) for(let col=-3;col<=3;col++){
      const cx=x+col*step,cy=y+row*step;
      cells+=rect(cx-step*.43,cy-step*.43,step*.86,step*.86,C.blue,2,'#548bbb',1.3);
      if(marks && Math.hypot(col,row)<2.3) cells+=((row===1&&col===1)||(row===-1&&col===0))?cross(cx,cy,4.5):check(cx,cy,5);
      if(packaged) for(const dx of [-4,4]) for(const dy of [-4,4]) cells+=circle(cx+dx,cy+dy,2.5,C.gold,C.copper,.8);
    }
    return `<defs><clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r-3}"/></clipPath></defs>`+circle(x,y,r,'#e9f3fb')+`<g clip-path="url(#${id})">${cells}</g>`+path(`M ${x-8} ${y+r-1} l 8 -7 l 8 7`,'#fff',C.ink,2);
  };
  return {C,rect,path,line,circle,ellipse,text,arrow,check,cross,chip,board,balls,pkg,clock,heat,drop,socket,wafer};
}

const termVisuals = {
  'Wafer Sort': {
    hint:['자르기 전에 검사','切る前に検査'],
    caption:['웨이퍼 위의 칩에 접점을 대고, 정상인지 하나씩 확인해요.','ウェハ上のチップに接点を当て、1個ずつ動作を確かめます。'],
    draw:d => {
      const {C,wafer,rect,line,arrow,text,check,cross,path}=d;
      return wafer(139,177,88,true)+rect(92,61,93,24,C.metal)+[112,138,164].map(x=>line(x,86,x,114,C.copper,4)).join('')+path('M 92 75 H 65 V 137','none',C.muted,3)+arrow(207,155,293,155,C.copper)+rect(310,91,131,143,C.white,12)+rect(324,107,103,96,'#eef8f3',6,C.boardDark)+check(342,129,7)+line(363,129,411,129,C.boardDark,3)+cross(342,154,6)+line(363,154,411,154,C.bad,3)+check(342,180,7)+line(363,180,411,180,C.boardDark,3)+text(139,285,'웨이퍼 위의 칩','ウェハ上のチップ',19)+text(375,264,'정상 / 불량','正常 / 不良',19)+text(139,44,'접점으로 검사','接点を当てる',19);
    }
  },
  'Back Grinding': {
    hint:['뒷면을 갈아 얇게','裏を削って薄く'],
    caption:['회로가 있는 앞면을 보호하고, 웨이퍼 뒷면의 두께를 줄여요.','回路のある表面を守り、ウェハの裏側を削って厚さを減らします。'],
    draw:d => {
      const {C,rect,ellipse,line,arrow,text}=d;
      return rect(40,154,163,64,C.blue,5)+ellipse(121,154,81,14,'#b8d7ed')+rect(40,218,163,10,C.purple,3)+rect(294,198,148,19,C.blue,4)+ellipse(368,198,74,12,'#b8d7ed')+rect(294,217,148,10,C.purple,3)+rect(78,76,87,32,C.metal)+ellipse(121,109,44,9,C.muted)+arrow(121,116,121,137,C.hot)+arrow(226,188,270,188)+text(121,53,'뒷면을 갈기','裏側を削る')+text(121,270,'두꺼운 웨이퍼','厚いウェハ',19)+text(368,270,'얇아진 웨이퍼','薄いウェハ',19)+text(367,173,'두께 ↓','厚さ ↓',22)+line(58,231,58,244,C.purple,3)+text(130,247,'앞면 보호','表面を保護',15,C.muted);
    }
  },
  'Dicing': {
    hint:['웨이퍼를 칩으로 자르기','ウェハを切り分ける'],
    caption:['칩 사이의 길을 따라 자르면, 둥근 웨이퍼가 작은 칩들로 나뉘어요.','チップの間に沿って切ると、丸いウェハが小さなチップに分かれます。'],
    draw:d => {
      const {C,wafer,circle,path,line,arrow,chip,text}=d;
      let dies='';for(let r=0;r<3;r++)for(let c=0;c<3;c++)dies+=chip(310+c*43,105+r*47,34,34);
      return wafer(135,185,88)+circle(139,80,35,C.metal)+circle(139,80,8,C.white)+path('M 116 57 A 32 32 0 0 1 163 63','none',C.muted,4)+arrow(163,63,168,76,C.muted,3)+line(139,120,139,266,C.hot,4,'stroke-dasharray="7 6"')+arrow(236,186,287,186)+dies+text(135,286,'둥근 웨이퍼','丸いウェハ',18)+text(368,266,'잘라낸 칩','切り出したチップ',19)+text(364,64,'하나씩 분리','1個ずつに分ける',20);
    }
  },
  'Singulation': {
    hint:['붙어 있는 제품을 낱개로','つながる製品を個別に'],
    caption:['한 판에 함께 만든 패키지를 마지막에 하나씩 분리해요.','1枚のパネルにまとめて作ったパッケージを、最後に1個ずつ分けます。'],
    draw:d => {
      const {C,board,rect,pkg,line,arrow,text}=d;
      let panel=board(30,75,178,176),parts='';
      for(let r=0;r<3;r++)for(let c=0;c<3;c++){panel+=rect(47+c*51,91+r*52,43,37,C.resin,4);parts+=pkg(301+c*49,89+r*56,37,33);}
      return panel+line(96,75,96,251,C.hot,3,'stroke-dasharray="6 5"')+line(30,141,208,141,C.hot,3,'stroke-dasharray="6 5"')+arrow(230,165,276,165)+parts+text(119,49,'함께 만든 패키지','まとめて作る',18)+text(372,49,'낱개 제품','個別の製品',19)+text(240,285,'마지막에 하나씩 떼어내기','最後に1個ずつ分ける',20);
    }
  },
  'Pick & Place': {
    hint:['집어서 정확히 놓기','つかんで正確に置く'],
    caption:['흡착 도구가 작은 칩을 집고, 정해진 위치로 옮겨 놓아요.','吸着ツールが小さなチップを取り、決めた位置に置きます。'],
    draw:d => {
      const {C,rect,line,chip,board,path,arrow,text}=d;
      let tray=rect(34,181,151,68,'#eaf0f5');for(let i=0;i<3;i++)tray+=chip(47+i*44,199,31,30);
      return rect(86,64,302,16,C.metal,4)+rect(107,81,26,57,C.metal,4)+rect(111,137,18,16,C.resin,2)+chip(101,154,37,30)+tray+board(278,220,160,28)+rect(326,198,60,22,'#e9f6ef',3,C.boardDark,2,'stroke-dasharray="5 4"')+path('M 142 114 H 355 V 174','none',C.blueDark,4,'stroke-dasharray="8 7"')+arrow(355,173,355,191)+chip(337,146,36,30)+text(120,49,'집기','取る')+text(354,49,'옮겨 놓기','運んで置く')+text(111,280,'칩이 놓인 트레이','チップのトレー',18)+text(355,280,'정해진 자리','決めた位置',18);
    }
  },
  'Die Attach': {
    hint:['칩을 바닥에 붙이기','チップを土台に付ける'],
    caption:['접착 재료를 사이에 넣어, 칩을 패키지의 바닥에 고정해요.','接着材料をはさんで、チップをパッケージの土台に固定します。'],
    draw:d => {
      const {C,chip,rect,board,arrow,text,line,drop}=d;
      return chip(146,73,191,47)+arrow(242,133,242,175)+rect(141,188,201,13,C.gold,3,C.copper)+board(95,207,295,37)+drop(86,170,14,C.gold)+line(100,184,141,194,C.copper,2)+text(242,51,'잘라낸 칩','切り出したチップ')+text(360,182,'접착층','接着層',18)+text(242,280,'패키지 바닥에 고정','パッケージの土台に固定',20);
    }
  },
  'Wire Bonding': {
    hint:['가는 금속선으로 연결','細い金属線でつなぐ'],
    caption:['칩 위의 접점과 기판의 접점을 아치 모양의 가는 금속선으로 이어요.','チップ上の接点と基板の接点を、アーチ状の細い金属線で結びます。'],
    draw:d => {
      const {C,board,chip,path,circle,line,text}=d;
      let wires='';for(let i=0;i<3;i++){const a=161+i*21,b=78+i*22;wires+=path(`M ${a} 174 C ${a-7} ${90+i*8} ${b} ${101+i*9} ${b} 214`,'none',C.copper,3.5)+circle(a,174,4,C.gold,C.copper,1)+circle(b,214,4,C.gold,C.copper,1);const c=319-i*21,e=402-i*22;wires+=path(`M ${c} 174 C ${c+7} ${90+i*8} ${e} ${101+i*9} ${e} 214`,'none',C.copper,3.5)+circle(c,174,4,C.gold,C.copper,1)+circle(e,214,4,C.gold,C.copper,1);}
      return board(46,214,388,32)+chip(142,171,196,43)+wires+text(241,195,'칩','チップ',20,C.ink)+text(240,57,'가는 금속선','細い金属線',22)+line(154,67,125,115,C.copper,2)+text(239,278,'기판까지 전기를 연결','基板へ電気をつなぐ',20);
    }
  },
  'Flip Chip': {
    hint:['뒤집어서 아래로 연결','裏返して下に接続'],
    caption:['칩의 접점이 아래를 향하게 뒤집고, 기판에 바로 연결해요.','チップの接点を下向きにして、基板へ直接つなぎます。'],
    draw:d => {
      const {C,chip,balls,board,path,arrow,text}=d;
      return chip(34,121,142,37)+balls(56,110,4,32,10,C.gold)+path('M 182 140 C 209 69 267 73 277 141','none',C.blueDark,4)+arrow(270,130,277,144)+chip(300,150,140,40)+balls(319,201,4,33,10,C.gold)+board(279,214,177,32)+arrow(370,91,370,132)+text(107,67,'접점이 위','接点は上',20)+text(369,67,'접점이 아래','接点は下',20)+text(235,281,'뒤집어 기판에 바로 연결','裏返して基板に直接接続',20);
    }
  },
  'Bump': {
    hint:['칩 위의 작은 금속 돌기','チップ上の小さな突起'],
    caption:['평평한 칩 표면에 만든 돌기가 다른 부품과 닿아 전기를 연결해요.','チップ表面に作った突起が他の部品と接し、電気をつなぎます。'],
    draw:d => {
      const {C,chip,balls,circle,rect,line,text}=d;
      return chip(49,192,380,42)+balls(87,173,6,60,18,C.gold)+line(268,158,330,105,C.copper,2)+circle(359,90,53,'#fff8eb',C.copper,2)+rect(321,106,76,15,C.blue,2)+circle(359,91,23,C.gold,C.copper,2)+text(151,78,'금속 돌기','金属の突起',22)+line(152,88,147,145,C.copper,2)+text(240,272,'돌기로 부품끼리 연결','突起で部品どうしを接続',20);
    }
  },
  'Cu Pillar / Micro-bump': {
    hint:['아주 작은 연결 기둥과 돌기','小さな接続の柱と突起'],
    caption:['구리 기둥이나 미세한 납땜 돌기로, 칩과 기판 또는 칩끼리 연결해요.','銅の柱や小さなはんだの突起で、チップと基板、またはチップどうしを接続します。'],
    draw:d => {
      const {C,chip,board,rect,balls,text}=d;
      let pillars='';for(let i=0;i<3;i++)pillars+=rect(60+i*49,138,25,62,C.copper,3,C.ink,1.5)+rect(60+i*49,200,25,10,C.metal,3,C.ink,1.5);
      return chip(37,96,169,42)+pillars+board(24,212,195,26)+chip(282,110,172,50)+balls(300,169,6,27,9,C.gold)+chip(282,178,172,48)+text(121,64,'Cu Pillar','Cu Pillar',22)+text(368,64,'Micro-bump','Micro-bump',22)+text(121,276,'구리 연결 기둥','銅の接続柱',19)+text(368,276,'미세한 납땜 돌기','微細なはんだ突起',18);
    }
  },
  'Reflow': {
    hint:['녹였다가 굳혀 연결','溶かして固めて接続'],
    caption:['열로 납땜 재료를 녹이고 식히면, 칩과 기판이 단단히 이어져요.','はんだを熱で溶かして冷やすと、チップと基板がしっかりつながります。'],
    draw:d => {
      const {C,chip,board,balls,ellipse,rect,arrow,heat,text}=d;
      let scene='';for(let i=0;i<3;i++){const x=23+i*159;scene+=chip(x+6,130,112,35)+board(x,203,124,22);if(i===0)scene+=balls(x+24,186,3,38,10);else if(i===1)for(let j=0;j<3;j++)scene+=ellipse(x+24+j*38,187,16,13,'#f3c987',C.copper,2);else for(let j=0;j<3;j++)scene+=rect(x+13+j*38,166,22,36,C.metal,6);}
      return scene+heat(214,116,3)+arrow(152,181,170,181)+arrow(308,181,326,181)+text(85,74,'고체 납땜 재료','固体のはんだ',17)+text(244,49,'가열','加熱',21,C.hot)+text(403,74,'식혀 연결','冷やして接続',18)+text(240,276,'가열 → 녹음 → 굳음','加熱 → 溶ける → 固まる',20);
    }
  },
  'Underfill': {
    hint:['연결부 사이의 틈 채우기','接続部のすきまを埋める'],
    caption:['금속 접점 사이의 빈 공간을 수지로 채워, 연결부가 잘 버티게 해요.','金属の接点の間を樹脂で埋め、接続部を丈夫にします。'],
    draw:d => {
      const {C,chip,rect,balls,board,path,arrow,line,text}=d;
      return board(90,222,338,27)+rect(121,170,272,52,C.purple,2,'none',0)+balls(144,196,6,45,13,C.gold)+chip(120,117,274,53)+path('M 32 107 L 55 102 L 93 163 L 75 174 Z',C.metal,C.ink,2)+path('M 83 171 Q 91 184 120 185',C.purple,C.purple,10)+arrow(87,196,118,196,'#8b71b3',3)+text(240,64,'수지로 틈을 채움','樹脂ですきまを埋める',22)+line(342,78,337,185,'#8b71b3',2)+text(240,282,'칩과 기판 사이를 보강','チップと基板の間を補強',20);
    }
  },
  'Molding': {
    hint:['보호 수지로 감싸기','保護樹脂で包む'],
    caption:['연결을 마친 칩을 수지로 감싸, 외부 충격과 습기로부터 보호해요.','接続したチップを樹脂で包み、衝撃や湿気から守ります。'],
    draw:d => {
      const {C,chip,board,path,rect,arrow,text,line}=d;
      const open=board(27,214,178,25)+chip(78,166,72,47)+path('M 83 177 Q 47 112 46 214 M 146 177 Q 182 110 185 214','none',C.copper,3);
      return open+arrow(224,183,264,183)+board(278,214,180,25)+rect(289,115,158,99,C.resin,17)+rect(312,152,111,62,'#f1f5f8',5,C.white,2,'stroke-dasharray="5 4"')+chip(335,174,66,38)+path('M 339 184 Q 321 149 317 210 M 399 184 Q 416 147 419 210','none',C.copper,2.5)+text(119,74,'연결된 칩','接続したチップ',19)+text(369,74,'보호 수지','保護樹脂',20)+line(369,84,369,110,C.muted,2)+text(240,281,'칩을 감싸 보호하기','チップを包んで守る',20);
    }
  },
  'Leadframe': {
    hint:['칩을 받치는 금속 뼈대','チップを支える金属の骨組み'],
    caption:['가운데는 칩을 받치고, 바깥쪽 금속 다리는 전기 연결을 맡아요.','中央がチップを支え、外側の金属の足が電気をつなぎます。'],
    draw:d => {
      const {C,rect,chip,line,text}=d;
      let frame=rect(86,67,306,175,'#fff9ec',7,C.copper,3)+rect(186,115,108,78,C.gold,3,C.copper,2);
      for(let i=0;i<5;i++){frame+=rect(118+i*55,70,13,32,C.gold,2,C.copper,1.5)+rect(118+i*55,208,13,31,C.gold,2,C.copper,1.5);}
      for(let i=0;i<4;i++){frame+=rect(90,108+i*30,70,11,C.gold,2,C.copper,1.5)+rect(321,108+i*30,67,11,C.gold,2,C.copper,1.5);}
      return frame+line(161,108,186,115,C.copper,9)+line(293,193,321,201,C.copper,9)+chip(207,132,65,41)+text(240,41,'금속 뼈대','金属の骨組み',22)+text(240,278,'가운데 받침 + 바깥 연결 다리','中央の土台 + 外側の接続端子',18);
    }
  },
  'Package Substrate': {
    hint:['칩과 큰 기판을 이어주는 판','チップと大きな基板の橋渡し'],
    caption:['작고 촘촘한 배선을 가진 기판이, 칩의 신호를 큰 회로기판으로 이어줘요.','細かな配線のある小さな基板が、チップの信号を大きな基板へつなぎます。'],
    draw:d => {
      const {C,chip,balls,board,rect,line,path,text}=d;
      return chip(181,61,156,46)+balls(198,121,4,41,8,C.gold)+board(113,140,274,49)+line(113,164,387,164,'#e7f4ee',3)+path('M 197 141 V 153 H 155 V 186 M 240 141 V 174 H 208 V 186 M 281 141 V 152 H 333 V 186 M 322 141 V 174 H 282 V 186','none',C.copper,3)+balls(152,208,5,50,10)+board(38,230,404,28)+text(44,91,'칩','チップ',18,C.ink,'start')+line(77,86,176,86,C.muted,2)+text(21,137,'패키지 기판','中間の基板',17,C.boardDark,'start')+line(69,145,111,163,C.boardDark,2)+text(240,286,'큰 회로기판으로 신호 전달','大きな基板へ信号を伝える',20);
    }
  },
  'BGA': {
    hint:['패키지 아래의 납땜 공','パッケージ裏のはんだの玉'],
    caption:['패키지 밑면의 납땜 공을 격자 모양으로 배열해, 회로기판에 연결해요.','パッケージの裏に、はんだの玉を格子状に並べ、基板につなぎます。'],
    draw:d => {
      const {C,rect,circle,balls,line,text}=d;
      let grid=rect(204,59,218,202,C.resin,12);for(let r=0;r<5;r++)for(let c=0;c<5;c++)grid+=circle(231+c*40,88+r*36,10,C.metal,'#8da4b8',1.5);
      return grid+rect(35,158,125,40,C.resin,7)+balls(49,211,5,24,9)+text(314,38,'패키지 밑면','パッケージの裏',20)+text(97,137,'옆에서 본 모습','横から見る',17)+line(160,199,199,199,C.muted,2,'stroke-dasharray="5 4"')+text(240,288,'작은 공이 전기 연결점','小さな玉が電気の接点',20);
    }
  },
  'WLP / WLCSP': {
    hint:['웨이퍼 상태에서 패키징','ウェハのままパッケージ化'],
    caption:['칩을 하나씩 떼어내기 전에 웨이퍼 위에서 접점과 보호층 등을 만들어요.','チップを分ける前に、ウェハ上で接点や保護層などを作ります。'],
    draw:d => {
      const {C,wafer,arrow,chip,balls,line,text}=d;
      return wafer(128,168,91,false,true)+arrow(239,169,280,169)+chip(308,112,129,80)+balls(326,203,4,30,9,C.gold)+line(308,176,437,176,C.purple,8)+text(127,47,'웨이퍼에서 먼저','ウェハ上で先に',20)+text(374,75,'이후 칩으로 분리','その後に切り分ける',18)+text(240,285,'자르기 전부터 패키징','切る前からパッケージ化',20);
    }
  },
  'Fan-Out Packaging': {
    hint:['칩 바깥까지 접점 확장','チップの外へ接点を広げる'],
    caption:['칩보다 넓은 수지 영역까지 배선을 펼쳐, 더 많은 접점을 배치해요.','チップより広い樹脂の領域へ配線を広げ、接点を多く配置します。'],
    draw:d => {
      const {C,rect,chip,path,circle,line,text}=d;
      let routes='';for(let i=0;i<4;i++){const x=185+i*35,end=79+i*47;routes+=path(`M ${x} 171 V ${182+i*5} H ${end} V 228`,'none',C.copper,3)+circle(end,231,8,C.gold,C.copper,1.5);const end2=258+i*47;routes+=path(`M ${x} 118 V ${104-i*5} H ${end2} V 74`,'none',C.copper,3)+circle(end2,72,8,C.gold,C.copper,1.5);}
      return rect(49,61,381,188,'#e9e4f0',12)+rect(170,65,142,180,'none',2,C.blueDark,2,'stroke-dasharray="5 5"')+chip(171,118,140,53)+routes+text(105,121,'칩 밖','チップの外',17,C.muted)+text(241,152,'칩','チップ',20)+line(317,145,400,145,C.muted,2)+text(362,133,'수지','樹脂',17,C.muted)+text(240,283,'넓은 영역으로 연결점 확장','広い領域へ接点を広げる',20);
    }
  },
  'RDL': {
    hint:['접점 위치를 다시 배선','接点の位置を配線で変更'],
    caption:['미세한 배선층으로 원래 접점을 다른 위치의 접점까지 이어줘요.','細かな配線の層で、元の接点を別の位置の接点までつなぎます。'],
    draw:d => {
      const {C,chip,rect,circle,path,text}=d;
      let routes='';for(let i=0;i<4;i++){const a=173+i*44,b=96+i*96;routes+=circle(a,120,6,C.gold,C.copper,1.5)+path(`M ${a} 122 V ${147+i*15} H ${b} V 222`,'none',C.copper,4)+circle(b,229,11,C.gold,C.copper,1.5);}
      return chip(132,72,216,46)+rect(69,130,343,90,'#eee6fa',4,'#bba6d9',2)+routes+text(240,51,'원래 접점','元の接点',20)+text(240,276,'새로운 위치의 접점','新しい位置の接点',20)+text(59,175,'배선층','配線層',16,C.muted,'start');
    }
  },
  'Chiplet': {
    hint:['기능별 작은 칩을 함께','役割別の小さなチップを一緒に'],
    caption:['큰 칩에 넣을 기능을 작은 칩들로 나누어 만들고, 한 패키지에서 연결해요.','大きなチップに入れる機能を小さなチップに分けて作り、1つのパッケージでつなぎます。'],
    draw:d => {
      const {C,rect,chip,board,path,arrow,text}=d;
      return chip(30,94,151,139)+rect(43,110,78,105,'#c5dff1',3,C.blueDark,1)+rect(128,110,38,48,C.gold,3,C.copper,1)+rect(128,167,38,48,C.purple,3,'#927daf',1)+text(81,166,'CPU','CPU',20)+arrow(204,167,250,167)+board(270,82,184,167)+path('M 330 132 H 357 V 196 H 413','none',C.copper,4)+chip(285,111,74,101)+chip(377,110,59,44,C.gold)+chip(377,177,59,44,C.purple)+text(322,166,'CPU','CPU',17)+text(406,138,'MEM','MEM',14)+text(406,204,'I/O','I/O',17)+text(107,60,'큰 칩의 기능','大きなチップの機能',18)+text(363,57,'기능별 작은 칩','役割別の小チップ',18)+text(240,283,'작은 칩들을 하나의 패키지로','小さなチップを1つのパッケージに',18);
    }
  },
  '2.5D Packaging': {
    hint:['중간 연결판 위에 나란히','中間の板の上に並べる'],
    caption:['칩들을 옆으로 나란히 놓고, 아래의 중간 연결판으로 서로 이어줘요.','チップを横に並べ、下の中間の板を使って互いにつなぎます。'],
    draw:d => {
      const {C,chip,balls,rect,board,path,text,line}=d;
      return chip(85,87,132,58)+chip(271,87,124,58,C.purple)+balls(102,161,4,32,8,C.gold)+balls(287,161,4,31,8,C.gold)+rect(59,175,363,35,'#ddd1ef',4)+path('M 119 175 V 188 H 306 V 175 M 180 175 V 199 H 367 V 175','none',C.copper,3)+balls(105,226,7,45,8)+board(40,242,400,24)+text(151,65,'칩 A','チップ A',20)+text(333,65,'칩 B','チップ B',20)+text(241,39,'가까이 나란히 연결','近くで横につなぐ',22)+text(240,295,'중간 연결판','中間の接続板',18,'#7e639c')+path('M 325 288 H 456 V 192 H 425','none','#7e639c',2);
    }
  },
  'TSV': {
    hint:['실리콘을 세로로 관통','シリコンを縦に貫く'],
    caption:['실리콘 안을 뚫고 금속을 채운 통로가, 칩의 위와 아래를 이어줘요.','シリコンを貫いて金属を入れた通路が、チップの上下をつなぎます。'],
    draw:d => {
      const {C,chip,rect,line,arrow,text,circle}=d;
      let vias='';for(const x of [159,229,299])vias+=rect(x,75,21,152,C.copper,2)+circle(x+10,75,11,C.gold,C.copper,1.5);
      return chip(108,75,263,151)+vias+arrow(404,212,404,86,C.copper,4,true)+text(240,44,'실리콘 속 금속 통로','シリコン内の金属の通路',22)+text(58,157,'실리콘','シリコン',17,C.blueDark)+line(66,166,104,166,C.blueDark,2)+text(240,272,'위 ↔ 아래로 전기 연결','上 ↔ 下へ電気をつなぐ',21);
    }
  },
  'HBM': {
    hint:['메모리를 층층이 쌓기','メモリを何層も積む'],
    caption:['메모리 칩을 여러 층으로 쌓고 세로로 연결해, 넓은 통로로 데이터를 주고받아요.','メモリを何層も積んで縦につなぎ、広い通路でデータをやり取りします。'],
    draw:d => {
      const {C,chip,rect,line,arrow,text}=d;
      let stack='';for(let i=0;i<4;i++)stack+=chip(131,59+i*40,218,29,i%2===0?'#91c6ec':'#7db4df');
      for(const x of [173,238,303])stack+=rect(x,57,10,196,C.copper,2,'#b57634',1);
      return chip(113,230,255,27,C.blueDark)+stack+arrow(95,221,95,65,C.copper,4,true)+text(239,34,'메모리 층','メモリの層',21)+text(423,107,'세로','縦の',17,C.copper)+text(423,132,'연결','接続',17,C.copper)+line(391,139,349,139,C.copper,2)+text(239,284,'층층이 쌓아 연결한 메모리','積み重ねてつないだメモリ',20);
    }
  },
  'Hybrid Bonding': {
    hint:['돌기 없이 접점을 직접 붙임','突起なしで接点を直接接合'],
    caption:['평평한 구리 접점과 주변 절연면을 맞대어, 두 칩을 아주 촘촘하게 붙여요.','平らな銅の接点と周囲の絶縁面を合わせ、2つのチップを細かく接合します。'],
    draw:d => {
      const {C,chip,rect,arrow,text}=d;
      let before=chip(25,87,162,44)+rect(25,131,162,10,'#efe5cc',0)+chip(25,200,162,42)+rect(25,191,162,9,'#efe5cc',0),after=chip(287,128,164,52)+chip(287,191,164,51)+rect(287,180,164,11,'#efe5cc',0);
      for(let i=0;i<4;i++){const a=43+i*38,b=304+i*38;before+=rect(a,131,18,10,C.copper,0,C.copper,1)+rect(a,191,18,9,C.copper,0,C.copper,1);after+=rect(b,177,18,19,C.copper,0,C.copper,1);}
      return before+arrow(105,151,105,180,C.copper,3)+arrow(213,176,260,176)+after+text(105,59,'접점을 맞추기','接点を合わせる',19)+text(370,100,'평평한 면끼리 접합','平らな面を接合',18)+text(240,282,'구리 + 절연면을 직접 붙임','銅 + 絶縁面を直接接合',20);
    }
  },
  'Bond Pitch': {
    hint:['접점 중심과 중심의 거리','接点の中心どうしの距離'],
    caption:['접점의 가장자리 사이가 아니라, 이웃한 접점 중심에서 중심까지의 거리예요.','接点の端どうしではなく、隣り合う接点の中心から中心までの距離です。'],
    draw:d => {
      const {C,circle,line,arrow,text,rect}=d;
      let points='';for(const x of [107,240,373])points+=circle(x,184,29,C.gold,C.copper,2)+circle(x,184,4,C.ink,'none',0)+line(x,72,x,216,C.muted,1.5,'stroke-dasharray="5 5"');
      return rect(48,221,387,22,C.blue,3)+points+arrow(107,93,240,93,C.blueDark,3,true)+line(107,78,107,105,C.blueDark,2)+line(240,78,240,105,C.blueDark,2)+text(172,60,'피치','ピッチ',22)+text(240,275,'중심 ↔ 중심','中心 ↔ 中心',24);
    }
  },
  'I/O Density': {
    hint:['같은 넓이에 접점 몇 개?','同じ広さに接点はいくつ？'],
    caption:['같은 면적에 접점을 더 많이 넣을수록, 입출력 연결의 밀도가 높아요.','同じ面積に接点を多く入れるほど、入出力の接続密度が高くなります。'],
    draw:d => {
      const {C,rect,circle,text}=d;
      let dots=rect(33,83,171,161,'#eef6fc',6,C.blueDark,2)+rect(276,83,171,161,'#eef6fc',6,C.blueDark,2);
      for(let r=0;r<2;r++)for(let c=0;c<2;c++)dots+=circle(81+c*75,130+r*66,14,C.gold,C.copper,2);
      for(let r=0;r<4;r++)for(let c=0;c<4;c++)dots+=circle(301+c*40,106+r*38,10,C.gold,C.copper,1.5);
      return dots+text(119,53,'접점 4개','接点 4個',21)+text(362,53,'접점 16개','接点 16個',21)+text(240,280,'같은 넓이, 다른 접점 수','同じ広さ、違う接点の数',20);
    }
  },
  'ATE': {
    hint:['전기 신호로 작동 검사','電気信号で動作を検査'],
    caption:['시험기 본체가 칩에 신호를 보내고, 돌아온 결과를 읽어 정상인지 판단해요.','試験機の本体がチップに信号を送り、返ってきた結果で動作を判断します。'],
    draw:d => {
      const {C,rect,path,line,circle,socket,pkg,arrow,text,check}=d;
      return rect(38,73,168,174,C.metal,10)+rect(56,92,132,82,'#eef8fb',4)+path('M 67 138 H 80 V 117 H 104 V 150 H 128 V 125 H 166','none',C.blueDark,3)+rect(59,191,98,29,C.white,4)+check(175,206,8)+circle(64,237,4,C.muted)+circle(181,237,4,C.muted)+socket(307,181,136,65)+pkg(333,174,83,39)+arrow(222,132,291,132,C.copper,4)+arrow(293,159,223,159,C.blueDark,4)+text(125,47,'시험기 본체','試験機の本体',20)+text(375,150,'검사할 칩','検査するチップ',19)+text(240,283,'신호 보내기 ↔ 결과 읽기','信号を送る ↔ 結果を読む',20);
    }
  },
  'Prober': {
    hint:['웨이퍼를 접점에 맞추는 장비','ウェハを接点に合わせる装置'],
    caption:['웨이퍼의 위치를 정밀하게 움직여, 각 칩이 시험용 접점과 닿게 해요.','ウェハの位置を精密に動かし、各チップを検査用の接点に当てます。'],
    draw:d => {
      const {C,rect,wafer,line,path,arrow,text}=d;
      return rect(39,63,258,191,'#edf1f6',12)+rect(61,86,213,144,C.white,5)+wafer(168,165,62)+rect(110,88,115,21,C.board,3)+[138,167,196].map(x=>line(x,110,x,133,C.copper,3)).join('')+rect(105,233,131,12,C.metal,2)+arrow(103,217,230,217,C.blueDark,3,true)+rect(347,97,94,127,C.metal)+rect(359,111,70,46,'#eaf6f8',3)+text(394,144,'ATE','ATE',21)+path('M 225 91 V 74 H 394 V 95','none',C.muted,4)+text(168,40,'웨이퍼 위치 조정','ウェハの位置を調整',20)+text(240,286,'칩과 시험기를 만나게 해요','チップを試験機につなぐ',20);
    }
  },
  'Probe Card': {
    hint:['웨이퍼에 닿는 바늘 접점','ウェハに触れる針の接点'],
    caption:['카드 아래의 아주 작은 바늘들이 웨이퍼의 칩 접점에 닿아요.','カードの下の小さな針が、ウェハ上のチップの接点に触れます。'],
    draw:d => {
      const {C,rect,ellipse,line,path,circle,chip,text}=d;
      let needles='';for(let i=0;i<5;i++){const x=75+i*29;needles+=path(`M ${x} 125 V 161 l -8 38`,'none',C.copper,3)+rect(x-13,199,10,5,C.gold,1,C.copper,1);}
      return ellipse(137,120,93,22,C.board)+rect(69,107,137,15,C.board,2,C.boardDark,1)+ellipse(137,222,102,26,C.blue)+line(61,221,212,221,'#d2e6f5',2)+needles+line(215,164,291,153,C.muted,2,'stroke-dasharray="5 4"')+circle(364,170,72,'#fff8eb',C.copper,2)+chip(312,199,102,18)+rect(337,193,31,7,C.gold,1,C.copper,1)+path('M 373 118 V 160 L 351 190','none',C.muted,8)+text(137,69,'프로브 카드','プローブカード',20)+text(364,73,'바늘 접점 확대','針の接点を拡大',19)+text(240,284,'바늘이 칩의 접점에 닿아요','針がチップの接点に触れる',20);
    }
  },
  'Final Test': {
    hint:['완성된 패키지를 최종 검사','完成したパッケージを最終検査'],
    caption:['조립과 보호가 끝난 제품을 시험기에 연결해, 출하 전에 기능을 확인해요.','組み立てて保護した製品を試験機につなぎ、出荷前に機能を確かめます。'],
    draw:d => {
      const {C,pkg,arrow,socket,circle,check,text,path}=d;
      return pkg(38,125,142,89)+arrow(209,176,267,176)+socket(300,164,143,88)+pkg(328,174,88,48)+circle(370,87,37,'#e3f4e9',C.good,2)+check(370,87,19)+path('M 352 148 V 130 M 389 148 V 130','none',C.good,3)+text(112,88,'완성된 제품','完成した製品',20)+text(371,43,'정상 작동?','正常に動く？',20)+text(240,286,'출하 전에 마지막 확인','出荷前に最後の確認',20);
    }
  },
  'Handler': {
    hint:['검사할 제품을 넣고 꺼내기','検査する製品を入れて出す'],
    caption:['로봇이 완성된 제품을 검사 자리에 놓고, 검사가 끝나면 다음 자리로 옮겨요.','ロボットが完成品を検査位置に置き、検査が終わると次の位置へ運びます。'],
    draw:d => {
      const {C,rect,pkg,socket,path,arrow,text}=d;
      let trays=rect(21,158,116,88,'#edf1f5')+rect(345,158,116,88,'#edf1f5');for(let r=0;r<2;r++)for(let c=0;c<2;c++)trays+=pkg(33+c*52,170+r*38,40,27)+pkg(357+c*52,170+r*38,40,27);
      return trays+rect(150,69,181,16,C.metal,4)+rect(230,85,20,71,C.metal,3)+pkg(218,157,43,28)+socket(178,209,124,49)+path('M 78 126 Q 149 95 221 126 M 261 126 Q 331 95 403 126','none',C.blueDark,3,'stroke-dasharray="7 6"')+arrow(205,120,221,126)+arrow(387,121,403,126)+text(79,150,'넣기','入れる',18)+text(241,49,'검사 자리로 이동','検査位置へ運ぶ',19)+text(404,150,'꺼내기','取り出す',18)+text(240,286,'검사기의 제품 이동을 자동으로','試験機への製品の移動を自動化',19);
    }
  },
  'Test Socket': {
    hint:['잠깐 꽂아 전기 연결','一時的に差して電気を接続'],
    caption:['접점이 있는 소켓에 제품을 눌러 넣으면, 납땜하지 않고도 검사할 수 있어요.','接点のあるソケットに製品を押し当てると、はんだ付けせずに検査できます。'],
    draw:d => {
      const {C,pkg,socket,arrow,path,text}=d;
      let springs='';for(let i=0;i<5;i++)springs+=path(`M ${158+i*41} 233 l -4 -7 l 8 -7 l -8 -7 l 4 -7`,'none',C.copper,2.5);
      return pkg(164,69,153,69)+arrow(240,151,240,180)+socket(107,194,267,63)+springs+text(240,44,'검사할 패키지','検査するパッケージ',21)+text(67,195,'소켓','ソケット',18)+text(240,285,'잠시 닿게 해서 검사','一時的に接触させて検査',20);
    }
  },
  'Load Board / DUT Board': {
    hint:['시험기와 칩 사이의 전용 기판','試験機とチップの間の専用基板'],
    caption:['시험기의 신호를 배선으로 전달하고, 가운데 소켓에는 검사할 칩을 올려요.','試験機の信号を配線で伝え、中央のソケットに検査するチップを置きます。'],
    draw:d => {
      const {C,board,rect,path,socket,pkg,line,text}=d;
      let traces='';for(let i=0;i<5;i++)traces+=path(`M 145 ${124+i*15} H ${186+i*11} V ${100+i*20} H 268`,'none',C.copper,2.5)+line(352,121+i*20,403,121+i*20,C.copper,2.5);
      return board(145,66,289,190)+traces+socket(258,115,106,90)+pkg(280,137,61,43)+rect(39,116,78,83,C.metal,6)+text(78,163,'ATE','ATE',21)+rect(118,132,27,47,C.gold,2,C.copper,2)+text(291,43,'전용 회로기판','専用の回路基板',21)+text(312,92,'검사할 칩','検査するチップ',17)+text(240,284,'시험기 ↔ 기판 ↔ 칩','試験機 ↔ 基板 ↔ チップ',20);
    }
  },
  'Binning': {
    hint:['검사 결과별로 나누기','検査結果で分ける'],
    caption:['검사 결과에 따라 성능 등급이 다른 정상 제품과 불량 제품을 따로 모아요.','検査結果に合わせ、性能の異なる正常品と不良品を別々に集めます。'],
    draw:d => {
      const {C,pkg,rect,arrow,text,check,cross,path}=d;
      let bins='';const fills=['#e5f5eb','#e7f2fb','#fbe9ec'];for(let i=0;i<3;i++){const x=24+i*157;bins+=rect(x,186,119,66,fills[i],8)+pkg(x+17,199,35,27)+pkg(x+68,199,35,27);}
      return pkg(210,54,61,40)+path('M 240 107 V 126 H 83 V 132 M 240 126 V 132 M 240 126 H 397 V 132','none',C.muted,3)+arrow(83,166,83,178,C.good,3)+arrow(240,166,240,178,C.blueDark,3)+arrow(397,166,397,178,C.bad,3)+bins+text(240,35,'검사 결과','検査の結果',21)+text(83,157,'고성능','高性能',19,C.good)+text(240,157,'일반 성능','標準の性能',18,C.blueDark)+text(397,157,'불량','不良',19,C.bad)+check(125,242,6)+check(282,242,6)+cross(439,242,5)+text(240,284,'결과에 맞춰 분류','結果に合わせて分類',21);
    }
  },
  'Burn-In Test': {
    hint:['가혹한 조건으로 초기 불량 찾기','厳しい条件で初期不良を探す'],
    caption:['전원을 넣고 뜨거운 환경에서 칩을 동작시켜, 처음에 생길 고장을 미리 찾아요.','電源を入れて暑い環境で動かし、使い始めに起きる故障を先に見つけます。'],
    draw:d => {
      const {C,rect,board,pkg,heat,path,circle,cross,check,text}=d;
      let parts='';for(let i=0;i<3;i++)parts+=pkg(100+i*57,171,43,29);
      return rect(66,75,254,182,'#fff2e9',12,C.hot,2.5)+board(89,207,208,19)+parts+heat(160,149,3)+rect(358,110,76,54,C.white,7)+path('M 377 141 H 388 L 396 124 L 395 147 H 415','none',C.copper,3)+path('M 320 211 H 344 V 141 H 356','none',C.copper,3)+text(393,91,'전원','電源',19)+circle(372,227,23,'#fbe6e9',C.bad)+cross(372,227,10)+circle(428,227,23,'#e4f4e9',C.good)+check(428,227,11)+text(190,51,'열 + 작동','熱 + 動作',21,C.hot)+text(240,285,'초기 불량을 미리 찾기','初期不良を先に見つける',20);
    }
  },
  'HTOL': {
    hint:['높은 온도에서 오래 작동','高温で長時間動かす'],
    caption:['높은 온도에서 장시간 작동시키는 시험으로, 장기 신뢰성을 평가해요.','高温で長時間動かす試験で、長期的な信頼性を評価します。'],
    draw:d => {
      const {C,rect,pkg,heat,clock,path,line,text}=d;
      return rect(36,85,251,162,'#fff2e9',12,C.hot,2.5)+pkg(117,165,91,54)+heat(134,150,3)+path('M 38 215 H 19 V 117 H 36','none',C.copper,4)+clock(377,135,52)+line(315,221,439,221,C.blueDark,3)+[315,346,377,408,439].map(x=>line(x,214,x,228,C.blueDark,2)).join('')+text(161,60,'높은 온도 + 전원','高温 + 電源',20,C.hot)+text(377,63,'오랜 시간','長い時間',21)+text(377,252,'시간이 지나도?','時間がたっても？',17)+text(240,286,'장기 신뢰성을 평가','長期の信頼性を評価',20);
    }
  },
  'Temperature Cycling': {
    hint:['뜨겁게 ↔ 차갑게 반복','熱く ↔ 冷たくを繰り返す'],
    caption:['높은 온도와 낮은 온도를 오가며, 패키지와 연결부가 변화에 버티는지 봐요.','高温と低温を行き来させ、パッケージや接続部が温度の変化に耐えるか調べます。'],
    draw:d => {
      const {C,rect,line,pkg,heat,path,arrow,text}=d;
      let snow='';for(let i=0;i<3;i++){const a=i*Math.PI/3;snow+=line(109-23*Math.cos(a),114-23*Math.sin(a),109+23*Math.cos(a),114+23*Math.sin(a),C.cold,3);}
      return rect(31,77,156,166,'#e9f5fd',12,C.cold,2)+rect(293,77,156,166,'#fff0e7',12,C.hot,2)+snow+pkg(64,172,93,47)+pkg(324,172,93,47)+heat(349,152,3)+path('M 195 118 Q 238 83 285 118','none',C.blueDark,4)+arrow(270,106,285,118)+path('M 285 211 Q 241 247 195 211','none',C.blueDark,4)+arrow(210,224,195,211)+text(109,55,'차갑게','冷たく',21,C.cold)+text(371,55,'뜨겁게','熱く',21,C.hot)+text(240,286,'온도 변화를 반복','温度の変化を繰り返す',20);
    }
  },
  'Test Time': {
    hint:['검사 시작부터 끝까지의 시간','検査の開始から終了までの時間'],
    caption:['한 제품의 검사를 시작해서 결과를 얻을 때까지 걸리는 시간이에요.','1個の製品の検査を始めて、結果を得るまでにかかる時間です。'],
    draw:d => {
      const {C,clock,socket,pkg,arrow,line,circle,text,check}=d;
      return clock(117,129,61)+socket(294,127,143,83)+pkg(323,134,84,46)+check(365,81,13)+arrow(193,140,269,140)+line(42,245,440,245,C.muted,3)+circle(43,245,7,C.blueDark,'none',0)+circle(439,245,7,C.good,'none',0)+arrow(69,245,414,245,C.blueDark,3)+text(81,276,'검사 시작','検査開始',19)+text(400,276,'검사 끝','検査終了',19)+text(239,42,'한 개의 검사에 걸린 시간','1個の検査にかかる時間',22)+text(240,231,'걸린 시간','かかった時間',19);
    }
  },
  'Yield': {
    hint:['전체 중 정상 제품의 비율','全体の中で正常品の割合'],
    caption:['예: 칩 10개 중 8개가 정상이면, 수율은 8 ÷ 10 = 80%예요.','例：チップ10個のうち8個が正常なら、歩留まりは8 ÷ 10 = 80%です。'],
    draw:d => {
      const {C,chip,check,cross,text}=d;
      let parts='';for(let i=0;i<10;i++){const x=40+i%5*86,y=70+Math.floor(i/5)*65;parts+=chip(x,y,58,45,i<8?'#c9ead7':'#f2ccd3')+(i<8?check(x+29,y+25,10):cross(x+29,y+25,9));}
      return parts+text(240,43,'정상 8개 / 전체 10개','正常8個 / 全体10個',21)+text(240,241,'8 ÷ 10 = 80%','8 ÷ 10 = 80%',34,C.good)+text(240,280,'예시 수율','歩留まりの例',18,C.muted);
    }
  },
  'UPH': {
    hint:['한 시간에 처리하는 개수','1時間に処理する個数'],
    caption:['예: 장비가 1시간에 제품 120개를 처리하면, 생산성은 120 UPH예요.','例：装置が1時間で120個を処理すれば、生産性は120 UPHです。'],
    draw:d => {
      const {C,clock,rect,pkg,circle,arrow,text}=d;
      let belt=rect(222,182,234,28,C.metal,14);for(let i=0;i<5;i++)belt+=circle(241+i*47,196,8,C.white,C.muted,1.5);for(let i=0;i<3;i++)belt+=pkg(235+i*72,129,54,38);
      return clock(107,136,58)+text(107,223,'1시간','1時間',22)+belt+arrow(232,98,443,98)+text(340,71,'제품을 처리','製品を処理',21)+text(240,273,'120개 / 1시간 = 120 UPH','120個 / 1時間 = 120 UPH',22);
    }
  },
  'OEE': {
    hint:['가동·속도·품질을 함께 보기','稼働・速度・品質をまとめて見る'],
    caption:['가동률 × 성능 × 품질을 함께 계산해, 장비의 힘을 얼마나 잘 썼는지 봐요.','稼働率 × 性能 × 品質を計算し、装置の能力をどれだけ使えたかを見ます。'],
    draw:d => {
      const {C,rect,clock,path,circle,check,line,text}=d;
      let panels='';for(let i=0;i<3;i++)panels+=rect(22+i*160,78,119,134,['#e8f4fc','#fff4de','#e7f5ec'][i],10);
      return panels+clock(81,133,31)+path('M 192 151 A 31 31 0 0 1 253 151','none',C.copper,5)+line(221,151,244,126,C.copper,4)+circle(401,136,32,'#e0f3e7',C.good,2)+check(401,136,17)+text(81,57,'가동률','稼働率',21)+text(241,57,'성능','性能',21)+text(401,57,'품질','品質',21)+text(81,193,'잘 가동?','動いた？',16)+text(241,193,'제 속도?','速度は？',16)+text(401,193,'좋은 제품?','良品は？',16)+text(161,156,'×','×',26,C.muted)+text(321,156,'×','×',26,C.muted)+text(240,263,'가동률 × 성능 × 품질','稼働率 × 性能 × 品質',24);
    }
  },
  'Package Warpage': {
    hint:['열을 받으면 패키지가 휨','熱でパッケージが反る'],
    caption:['패키지 재료들이 열로 서로 다르게 늘어나면, 전체가 휘어질 수 있어요.','材料が熱でそれぞれ違う量だけ伸びると、パッケージ全体が反ることがあります。'],
    draw:d => {
      const {C,rect,balls,circle,line,path,arrow,heat,text}=d;
      const curvedBalls=Array.from({length:6},(_,i)=>{const x=303+i*26,t=(x-289)/159;return circle(x,193+88*t*(1-t),8,C.metal,C.ink,1.7);}).join('');
      return rect(34,155,151,32,C.resin,5)+balls(49,198,6,24,8)+line(23,216,197,216,C.muted,2,'stroke-dasharray="5 5"')+arrow(212,175,260,175)+path('M 289 158 Q 368 202 448 158 L 448 185 Q 368 229 289 185 Z',C.resin,C.ink,2)+curvedBalls+line(279,244,458,244,C.muted,2,'stroke-dasharray="5 5"')+heat(347,142,3)+text(112,91,'평평한 패키지','平らなパッケージ',19)+text(368,59,'열에 의해 휨','熱で反る',21,C.hot)+text(240,285,'평평함 → 휘어짐','平ら → 反り',22);
    }
  },
  'CTE': {
    hint:['온도가 오르면 얼마나 늘어날까?','温度が上がるとどれだけ伸びる？'],
    caption:['같은 온도 변화에서 길이가 더 많이 변하는 재료일수록, 열팽창 계수가 커요.','同じ温度の変化で長さがより大きく変わる材料ほど、熱膨張係数が大きくなります。'],
    draw:d => {
      const {C,rect,line,arrow,text,heat}=d;
      return rect(119,101,242,30,C.blue,5)+rect(91,202,298,30,'#f2b299',5,C.hot,2)+line(119,77,119,247,C.muted,1.5,'stroke-dasharray="4 5"')+line(361,77,361,247,C.muted,1.5,'stroke-dasharray="4 5"')+arrow(91,244,119,244,C.hot,2.5,true)+arrow(361,244,389,244,C.hot,2.5,true)+arrow(240,143,240,186,C.hot,3)+text(240,69,'온도 상승 전','温度が上がる前',21)+text(70,180,'가열','加熱',17,C.hot)+text(323,184,'길이가 늘어남','長さが伸びる',18,C.hot)+text(240,282,'온도 ↑ → 길이 변화','温度 ↑ → 長さの変化',22);
    }
  },
  'Thermal Resistance': {
    hint:['열이 빠져나가기 어려운 정도','熱の逃げにくさ'],
    caption:['열저항이 낮을수록 같은 열을 더 작은 온도 차이로 전달할 수 있어요.','熱抵抗が低いほど、同じ熱をより小さな温度差で伝えられます。'],
    draw:d => {
      const {C,rect,chip,arrow,text,path}=d;
      return rect(39,77,166,27,C.metal,3)+rect(39,111,166,58,'#f1d9d7',4,'#dcb5b1',1)+chip(68,192,108,45,'#ea9b8f')+arrow(107,185,107,112,C.hot,2)+arrow(138,185,138,112,C.hot,2)+rect(277,77,166,27,C.metal,3)+rect(277,111,166,58,'#dbefe6',4,'#a7cab9',1)+chip(305,192,108,45)+arrow(341,185,341,112,C.hot,7)+arrow(376,185,376,112,C.hot,7)+text(122,49,'높은 열저항','高い熱抵抗',21,C.hot)+text(360,49,'낮은 열저항','低い熱抵抗',21,C.good)+text(122,269,'열 전달이 어려움','熱が伝わりにくい',17)+text(360,269,'열 전달이 쉬움','熱が伝わりやすい',17);
    }
  },
  'TIM': {
    hint:['칩과 냉각장치 사이의 열 전달층','チップと冷却部品の間の伝熱層'],
    caption:['칩과 냉각장치 사이의 미세한 틈을 열 전달 재료로 채워, 열이 잘 넘어가게 해요.','チップと冷却部品の間の細かなすきまを伝熱材料で埋め、熱を伝えやすくします。'],
    draw:d => {
      const {C,rect,chip,line,arrow,text}=d;
      let fins='';for(let i=0;i<7;i++)fins+=rect(128+i*37,83,15,61,C.metal,2,C.muted,1.5);
      return fins+rect(126,145,262,27,C.metal,4)+rect(126,172,262,18,C.pink,2,'#c37991',2)+chip(126,190,262,39)+arrow(420,232,420,98,C.hot,4)+text(419,73,'열','熱',19,C.hot)+text(59,125,'냉각장치','冷却部品',17)+line(94,132,122,143,C.muted,2)+text(62,187,'TIM','TIM',22,'#a55f79')+line(87,181,122,181,'#a55f79',2)+text(71,223,'칩','チップ',19)+text(240,282,'틈을 채워 열을 잘 전달','すきまを埋めて熱を伝える',20);
    }
  },
  'Thermal Management': {
    hint:['칩의 열을 밖으로 빼내기','チップの熱を外へ逃がす'],
    caption:['열 전달 재료, 방열판, 공기 흐름 등을 이용해 칩의 열을 외부로 옮겨요.','伝熱材料、放熱板、空気の流れなどで、チップの熱を外へ運びます。'],
    draw:d => {
      const {C,chip,rect,circle,path,line,arrow,text}=d;
      let fins='';for(let i=0;i<5;i++)fins+=rect(171+i*31,144,15,36,C.metal,2,C.muted,1.5);
      let fan='';for(let i=0;i<3;i++)fan+=`<g transform="rotate(${i*120} 240 88)">`+path('M 241 88 C 221 54 259 48 263 74 Q 260 89 241 88 Z',C.blue,C.blueDark,1.5)+'</g>';
      return chip(149,216,183,33)+rect(158,203,164,9,C.pink,2,'#c37991',1.5)+rect(151,181,181,18,C.metal,3)+fins+circle(240,88,44,'#f1f8fd',C.blueDark,2)+fan+circle(240,88,6,C.blueDark,'none',0)+path('M 167 96 C 84 90 90 165 146 166 M 335 166 C 391 154 399 90 430 96','none',C.cold,4)+arrow(124,155,146,166,C.cold,3)+arrow(415,93,430,96,C.cold,3)+arrow(240,197,240,143,C.hot,4)+text(73,61,'공기 흐름','空気の流れ',17,C.cold)+text(394,221,'열 배출','熱を逃がす',18,C.hot)+text(240,283,'열을 냉각장치와 밖으로','熱を冷却部品から外へ',20);
    }
  },
  'Reliability': {
    hint:['오래 사용해도 잘 작동','長く使っても動作する'],
    caption:['시간이 오래 지나도, 정해진 조건에서 고장 없이 동작하는 정도예요.','長い時間がたっても、決められた条件で故障せずに動作する度合いです。'],
    draw:d => {
      const {C,path,pkg,check,circle,line,text}=d;
      let timeline=line(43,239,437,239,C.good,3);for(let i=0;i<5;i++){const x=44+i*98;timeline+=circle(x,239,8,'#e4f4e9',C.good,2)+check(x,213,7);}
      return path('M 240 46 L 323 78 V 137 Q 323 187 240 210 Q 157 187 157 137 V 78 Z','#e7f5ed',C.good,2)+pkg(197,106,86,52)+check(240,180,12)+timeline+text(239,31,'오랫동안 정상 작동','長い間、正常に動作',22)+text(66,275,'사용 시작','使用開始',19)+text(392,275,'오랜 시간 후','長い時間の後',19);
    }
  },
  'MSL': {
    hint:['습기와 납땜 열에 대한 민감도','湿気とリフロー熱への敏感さ'],
    caption:['습기를 머금은 패키지는 재가열 때 손상될 수 있어, 등급에 맞춰 보관·사용 시간을 관리해요.','湿気を吸ったパッケージは再加熱で傷む場合があり、等級に合わせて保管や使用時間を管理します。'],
    draw:d => {
      const {C,pkg,drop,arrow,heat,path,rect,line,text}=d;
      return pkg(29,168,94,51)+drop(45,112,10)+drop(79,99,11)+drop(112,119,9)+arrow(137,193,164,193,C.hot,3)+pkg(182,168,91,51)+heat(205,154,2)+path('M 226 169 l -8 14 l 17 10 l -9 23','none','#f4af9f',3)+line(304,74,304,246,C.muted,1.5,'stroke-dasharray="5 5"')+rect(335,86,114,155,'#edf5fc',8,C.blueDark,2)+line(342,99,442,99,C.blueDark,3)+pkg(356,165,73,42)+drop(392,132,11)+line(376,144,408,114,C.bad,3)+text(78,63,'습기 흡수','吸湿',18)+text(228,63,'납땜 열','リフロー熱',18,C.hot)+text(392,63,'건조 보관','乾燥保管',18,C.blueDark)+text(240,282,'습기에 맞는 취급 등급','湿気に合わせた取り扱いの等級',19);
    }
  },
  'OSAT': {
    hint:['패키징과 검사를 맡는 회사','パッケージと検査を担う会社'],
    caption:['다른 회사에서 만든 칩을 받아, 연결하고 보호하고 검사하는 일을 맡아요.','他社が作ったチップを受け取り、接続・保護・検査を担当します。'],
    draw:d => {
      const {C,wafer,rect,path,pkg,circle,check,arrow,text}=d;
      return wafer(79,162,54)+arrow(143,162,177,162)+path('M 192 129 L 222 107 V 129 L 252 107 V 129 L 282 107 V 129 H 327 V 242 H 192 Z','#e7eef6',C.ink,2)+rect(301,74,21,54,C.metal,2)+text(259,160,'OSAT','OSAT',28)+pkg(208,191,46,29)+circle(291,206,20,'#e3f3e9',C.good,1.5)+check(291,206,10)+arrow(337,166,366,166)+rect(374,129,81,114,'#fff4da',8,C.copper,2)+pkg(389,169,51,35)+text(79,76,'다른 회사의 칩','他社のチップ',17)+text(261,59,'조립·포장·검사','組み立て・保護・検査',19)+text(415,104,'완성품','完成品',19)+text(240,284,'후공정을 대신 맡는 전문 회사','後工程を引き受ける専門会社',20);
    }
  }
};

function termDiagram(term, scope='card'){
  const visual = termVisuals[term.en];
  if(!visual) throw new Error('Missing term illustration: '+term.en);
  const prefix = scope+'-'+terms.indexOf(term);
  const tools = illustrationTools(lang,prefix);
  const title = escapeHTML(term.en+' — '+visual.hint[lang==='ko'?0:1]);
  const caption = escapeHTML(visual.caption[lang==='ko'?0:1]);
  return `<svg class="term-diagram" viewBox="0 0 480 310" role="img" aria-labelledby="${prefix}-title ${prefix}-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="${prefix}-title">${title}</title><desc id="${prefix}-desc">${caption}</desc>
    <rect width="480" height="310" rx="16" fill="#ffffff"/>
    <g font-family="'Malgun Gothic','Yu Gothic',system-ui,sans-serif">${visual.draw(tools)}</g>
  </svg>`;
}
