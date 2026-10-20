import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';
env.allowLocalModels = false;
env.useBrowserCache = true;

const $ = id => document.getElementById(id);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (n,a,b) => Math.max(a, Math.min(b, n));

function hexRgba(hex, a) {
  const h = (hex||'#000').replace('#','');
  const f = h.length===3 ? h.split('').map(c=>c+c).join('') : h;
  return `rgba(${parseInt(f.slice(0,2),16)},${parseInt(f.slice(2,4),16)},${parseInt(f.slice(4,6),16)},${a})`;
}
function fmtTC(s, ms=',') {
  s = Math.max(0, s||0);
  const hh = String(Math.floor(s/3600)).padStart(2,'0');
  const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
  const ss = String(Math.floor(s%60)).padStart(2,'0');
  const ms_ = String(Math.floor((s%1)*1000)).padStart(3,'0');
  return `${hh}:${mm}:${ss}${ms}${ms_}`;
}
function fmtShort(s) {
  s = Math.max(0, s||0);
  const m = Math.floor(s/60);
  const sc = (s%60).toFixed(2);
  return `${m}:${sc.padStart(5,'0')}`;
}
function parseTC(str) {
  str = String(str||'').trim().replace(',','.');
  const p = str.split(':').map(Number);
  if (p.some(isNaN)) return NaN;
  if (p.length===3) return p[0]*3600+p[1]*60+p[2];
  if (p.length===2) return p[0]*60+p[1];
  return p[0]||0;
}
function dlBlob(name, content, type='text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content],{type});
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'),{href:url,download:name});
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 30000);
}
function setStatus(el, msg, kind='') {
  el.textContent = msg||'';
  el.classList.toggle('err', kind==='err');
  el.classList.toggle('ok',  kind==='ok');
}
function setProg(el, pct) { el.style.width = clamp(pct,0,100)+'%'; }
function escHtml(t) { return String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function detectPerf() {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const hasGPU = !!navigator.gpu;
  let score = 0;
  if (cores >= 8) score += 3; else if (cores >= 4) score += 2; else score += 1;
  if (mem >= 8) score += 3; else if (mem >= 4) score += 2; else score += 1;
  if (hasGPU) score += 2;
  if (mobile) score -= 1;
  if (score >= 7) return 'high';
  if (score >= 4) return 'mid';
  return 'low';
}
const PERF = detectPerf();
const perfBadge = $('perfBadge');
if (PERF === 'high') { perfBadge.textContent = 'Alto'; perfBadge.className = 'perf-badge perf-high'; }
else if (PERF === 'mid') { perfBadge.textContent = 'Médio'; perfBadge.className = 'perf-badge perf-mid'; }
else { perfBadge.textContent = 'Baixo'; perfBadge.className = 'perf-badge perf-low'; }

if (PERF === 'low') {
  $('modelSel').value = 'Xenova/whisper-tiny';
  $('gpuChk').checked = false;
  $('maxWords').value = 3;
} else {
  $('modelSel').value = 'Xenova/whisper-base';
  $('maxWords').value = 3;
}

const FONTS = {
  inter: '"Inter",system-ui,sans-serif',
  montserrat: '"Montserrat",sans-serif',
  barlow: '"Barlow",sans-serif',
  poppins: '"Poppins",sans-serif',
  oswald: '"Oswald",sans-serif',
  bebas: '"Bebas Neue",sans-serif',
  anton: '"Anton",sans-serif',
  impact: '"Archivo Black",Impact,"Arial Black",sans-serif',
};

const STYLES = [
  { n:'HORMOZI 1', cat:'padrao', css:{color:'#ffffff',hl:'#22e06b',strokeW:0,shadow:84,font:'montserrat',hlFont:'montserrat',up:true,weight:'900'} },
  { n:'HORMOZI 2', cat:'padrao', css:{color:'#ffffff',hl:'#f9ea03',strokeW:0,shadow:84,font:'montserrat',hlFont:'montserrat',up:true,weight:'900'} },
  { n:'BEAST PRO', cat:'padrao', css:{color:'#f9ea03',hl:'#ffffff',stroke:'#000000',strokeW:5,shadow:45,font:'impact',hlFont:'impact',up:true,weight:'900'} },
  { n:'Negativa',  cat:'padrao', css:{color:'#ffffff',hl:'#ffffff',bg:'#000000',stroke:'#000000',strokeW:4,shadow:30,font:'inter',hlFont:'inter',weight:'900'} },
  { n:'LEON',      cat:'padrao', css:{color:'#ffffff',hl:'#ffe600',bg:'#ff4a1c',stroke:'#000000',strokeW:4,shadow:40,font:'inter',hlFont:'inter',up:true,weight:'900'} },
  { n:'LAGUNA',    cat:'padrao', css:{color:'#ffffff',hl:'#00e0ff',stroke:'#000000',strokeW:5,shadow:50,font:'inter',hlFont:'inter',up:true,weight:'900'} },
  { n:'Tuba',      cat:'padrao', css:{color:'#ffffff',hl:'#ff7ad9',stroke:'#000000',strokeW:6,shadow:45,font:'inter',hlFont:'inter',weight:'900'} },
  { n:'Splitz',    cat:'padrao', css:{color:'#e8b98a',hl:'#ffffff',stroke:'#000000',strokeW:4,shadow:45,font:'inter',hlFont:'inter',italic:true,weight:'900'} },
  { n:'Aria',      cat:'padrao', css:{color:'#ffb545',hl:'#ffffff',stroke:'#000000',strokeW:5,shadow:55,font:'poppins',hlFont:'poppins',weight:'900'} },
  { n:'Stack',     cat:'padrao', css:{color:'#ffffff',hl:'#ff5757',stroke:'#000000',strokeW:6,shadow:55,font:'montserrat',hlFont:'montserrat',weight:'900'} },
  { n:'Lume',      cat:'padrao', css:{color:'#ffcf6b',hl:'#ffffff',stroke:'#000000',strokeW:3,shadow:75,font:'oswald',hlFont:'oswald',weight:'700'} },
  { n:'MARCA',     cat:'padrao', css:{color:'#000000',hl:'#000000',bg:'#ffe600',strokeW:0,shadow:10,font:'bebas',hlFont:'bebas',up:true,weight:'400'} },
  { n:'Canto',     cat:'padrao', css:{color:'#c4b5a0',hl:'#ffffff',strokeW:0,shadow:45,font:'inter',hlFont:'inter',italic:true,weight:'700'} },
  { n:'Silk',      cat:'padrao', css:{color:'#7dd3c0',hl:'#ffffff',strokeW:0,shadow:55,font:'poppins',hlFont:'poppins',weight:'800'} },
  { n:'SLASH',     cat:'padrao', css:{color:'#ff4d9a',hl:'#ffffff',stroke:'#000000',strokeW:5,shadow:55,font:'bebas',hlFont:'bebas',up:true,weight:'400'} },
  { n:'Dense',     cat:'padrao', css:{color:'#b8ff3d',hl:'#ffffff',stroke:'#000000',strokeW:5,shadow:45,font:'montserrat',hlFont:'montserrat',up:true,weight:'900'} },
  { n:'Open',      cat:'padrao', css:{color:'#7ec8ff',hl:'#ffffff',stroke:'#000000',strokeW:4,shadow:45,font:'oswald',hlFont:'oswald',weight:'700'} },
  { n:'Rise',      cat:'padrao', css:{color:'#fbbf24',hl:'#ffffff',stroke:'#000000',strokeW:6,shadow:55,font:'anton',hlFont:'anton',up:true,weight:'400'} },
  { n:'PRISM',     cat:'padrao', css:{color:'#e9d5ff',hl:'#c084fc',stroke:'#000000',strokeW:4,shadow:65,font:'poppins',hlFont:'poppins',weight:'800'} },
  { n:'Neon',      cat:'custom', css:{color:'#ffffff',hl:'#ff2bd6',strokeW:0,shadow:0,font:'poppins',hlFont:'poppins',weight:'900',glow:true,glowColor:'#ff2bd6'} },
  { n:'Ice',       cat:'custom', css:{color:'#dff6ff',hl:'#00c2ff',stroke:'#04324d',strokeW:5,shadow:55,font:'montserrat',hlFont:'montserrat',weight:'900'} },
  { n:'Sunset',    cat:'custom', css:{color:'#fff3d6',hl:'#ff8a00',stroke:'#3a1200',strokeW:6,shadow:55,font:'poppins',hlFont:'poppins',up:true,weight:'900'} },
  { n:'Mono',      cat:'custom', css:{color:'#ffffff',hl:'#ffd400',bg:'#000000',strokeW:0,shadow:20,font:'inter',hlFont:'inter',weight:'900'} },
  { n:'Podcast',   cat:'custom', css:{color:'#ffffff',hl:'#7cf6ff',stroke:'#000000',strokeW:4,shadow:45,font:'oswald',hlFont:'oswald',weight:'700'} },
  { n:'Retro',     cat:'custom', css:{color:'#ffe9c7',hl:'#ff5757',stroke:'#5b1f00',strokeW:5,shadow:45,font:'bebas',hlFont:'bebas',italic:true,weight:'400'} },
  { n:'Punch',     cat:'custom', css:{color:'#ffffff',hl:'#ffe600',bg:'#1a6dff',stroke:'#000000',strokeW:3,shadow:45,font:'anton',hlFont:'anton',up:true,weight:'400'} },
  { n:'TikTok Classic', cat:'tiktok', css:{color:'#ffffff',hl:'#00f2ea',stroke:'#000000',strokeW:4,shadow:50,font:'montserrat',hlFont:'montserrat',up:true,weight:'900'} },
  { n:'CapCut Pop', cat:'tiktok', css:{color:'#ffffff',hl:'#ff0050',stroke:'#000000',strokeW:5,shadow:55,font:'poppins',hlFont:'poppins',up:true,weight:'900'} },
  { n:'MrBeast', cat:'tiktok', css:{color:'#ffffff',hl:'#00ff88',stroke:'#000000',strokeW:6,shadow:60,font:'impact',hlFont:'impact',up:true,weight:'900'} },
  { n:'Yellow Fire', cat:'tiktok', css:{color:'#ffe600',hl:'#ffffff',stroke:'#000000',strokeW:5,shadow:50,font:'anton',hlFont:'anton',up:true,weight:'400'} },
  { n:'Clean White', cat:'tiktok', css:{color:'#ffffff',hl:'#ffffff',stroke:'#000000',strokeW:3,shadow:40,font:'inter',hlFont:'inter',weight:'800'} },
  { n:'Pink Viral', cat:'tiktok', css:{color:'#ffffff',hl:'#ff4d9a',stroke:'#000000',strokeW:4,shadow:45,font:'bebas',hlFont:'bebas',up:true,weight:'400'} },
  { n:'Clipa Glow', cat:'tiktok', css:{color:'#ffffff',hl:'#67e8f9',strokeW:0,shadow:0,font:'montserrat',hlFont:'bebas',up:true,weight:'900',glow:true,glowColor:'#22d3ee'} },
  { n:'Inter + Bebas', cat:'mixed', css:{color:'#ffffff',hl:'#22e06b',stroke:'#000000',strokeW:3,shadow:50,font:'inter',hlFont:'bebas',up:true,weight:'800',hlWeight:'400'} },
  { n:'Mont + Anton', cat:'mixed', css:{color:'#ffffff',hl:'#f9ea03',stroke:'#000000',strokeW:4,shadow:55,font:'montserrat',hlFont:'anton',up:true,weight:'900',hlWeight:'400'} },
  { n:'Pop + Impact', cat:'mixed', css:{color:'#ffffff',hl:'#ff0050',stroke:'#000000',strokeW:5,shadow:50,font:'poppins',hlFont:'impact',up:true,weight:'800',hlWeight:'900'} },
  { n:'Barlow + Bebas', cat:'mixed', css:{color:'#e2e8f0',hl:'#38bdf8',stroke:'#000000',strokeW:3,shadow:45,font:'barlow',hlFont:'bebas',up:true,weight:'700',hlWeight:'400'} },
  { n:'Oswald + Anton', cat:'mixed', css:{color:'#ffffff',hl:'#fb923c',stroke:'#000000',strokeW:4,shadow:50,font:'oswald',hlFont:'anton',up:true,weight:'700',hlWeight:'400'} },
  { n:'Inter + Anton', cat:'mixed', css:{color:'#ffffff',hl:'#a78bfa',stroke:'#000000',strokeW:3,shadow:55,font:'inter',hlFont:'anton',up:true,weight:'800',hlWeight:'400'} },
  { n:'Mont + Bebas', cat:'mixed', css:{color:'#ffffff',hl:'#f472b6',stroke:'#000000',strokeW:4,shadow:50,font:'montserrat',hlFont:'bebas',up:true,weight:'900',hlWeight:'400'} },
  { n:'Pop + Oswald', cat:'mixed', css:{color:'#ffffff',hl:'#4ade80',stroke:'#000000',strokeW:3,shadow:45,font:'poppins',hlFont:'oswald',up:true,weight:'800',hlWeight:'700'} },

  /* ── tscaps = prints (fontes já no <link> Google Fonts) ── */
  /* fullBg:true = fundo na faixa inteira | hlBg:true = caixa só na palavra ativa */

  /* Print 1 · itálico creme */
  { n:'MIRA', cat:'tscaps', css:{
    color:'#f3eee6', hl:'#ffffff', strokeW:0, shadow:38,
    font:'poppins', hlFont:'poppins', italic:true, weight:'600', hlWeight:'700'
  }},

  /* Print 2 · ouro metálico */
  { n:'GOLD', cat:'tscaps', css:{
    color:'#e8c547', hl:'#fff0a0', stroke:'#4a3208', strokeW:4, shadow:60,
    font:'anton', hlFont:'anton', up:true, weight:'400',
    glow:true, glowColor:'#f0c040'
  }},

  /* Print 3–4 · branco limpo bold */
  { n:'CLEAN', cat:'tscaps', css:{
    color:'#ffffff', hl:'#ffffff', stroke:'#000000', strokeW:2, shadow:42,
    font:'montserrat', hlFont:'montserrat', up:true, weight:'900'
  }},

  /* Print 6 + 11 · viral amarelo + contorno preto */
  { n:'LOKI', cat:'tscaps', css:{
    color:'#ffffff', hl:'#ffe600', stroke:'#000000', strokeW:7, shadow:48,
    font:'impact', hlFont:'impact', up:true, weight:'900'
  }},

  /* Print 7 · caixa vermelha SÓ na palavra */
  { n:'LEVI', cat:'tscaps', css:{
    color:'#ffffff', hl:'#ffffff', bg:'#e11d48', hlBg:true,
    stroke:'#000000', strokeW:2, shadow:36,
    font:'montserrat', hlFont:'montserrat', up:true, weight:'900'
  }},

  /* Print 10 · branco + ciano */
  { n:'ENZO', cat:'tscaps', css:{
    color:'#ffffff', hl:'#2dd4bf', stroke:'#000000', strokeW:5, shadow:48,
    font:'montserrat', hlFont:'montserrat', up:true, weight:'900'
  }},

  /* Print 13 · barra preta na faixa inteira + vila amarelo */
  { n:'BAR', cat:'tscaps', css:{
    color:'#ffffff', hl:'#facc15', bg:'#0a0a0a', fullBg:true,
    strokeW:0, shadow:18,
    font:'inter', hlFont:'inter', weight:'700', hlWeight:'900'
  }},

  /* Print 8 · verde */
  { n:'MILO', cat:'tscaps', css:{
    color:'#4ade80', hl:'#86efac', strokeW:0, shadow:32,
    font:'poppins', hlFont:'poppins', weight:'800'
  }},

  /* Print 5 · roxo */
  { n:'LYRA', cat:'tscaps', css:{
    color:'#f8fafc', hl:'#a78bfa', strokeW:0, shadow:28,
    font:'poppins', hlFont:'bebas', weight:'600', hlWeight:'400',
    glow:true, glowColor:'#8b5cf6'
  }},

  /* Print 14 · creme literário */
  { n:'PASTOR', cat:'tscaps', css:{
    color:'#efe6d5', hl:'#fff9f0', strokeW:0, shadow:30,
    font:'poppins', hlFont:'poppins', italic:true, weight:'500'
  }},

  /* Print 9 + 12 · outline forte */
  { n:'BEASTX', cat:'tscaps', css:{
    color:'#ffffff', hl:'#fde047', stroke:'#000000', strokeW:8, shadow:52,
    font:'impact', hlFont:'impact', up:true, weight:'900'
  }},

  /* Lena · bolha azul na palavra */
  { n:'LENA', cat:'tscaps', css:{
    color:'#ffffff', hl:'#ffffff', bg:'#2997ff', hlBg:true,
    strokeW:0, shadow:18,
    font:'inter', hlFont:'inter', weight:'700', hlWeight:'900'
  }},

  /* Nyx · terminal fundo inteiro */
  { n:'NYX', cat:'tscaps', css:{
    color:'#00ff41', hl:'#39ff14', bg:'#0d1117', fullBg:true,
    strokeW:0, shadow:0,
    font:'inter', hlFont:'inter', weight:'500', glow:true, glowColor:'#00ff41'
  }},

  /* Elio · laranja */
  { n:'ELIO', cat:'tscaps', css:{
    color:'#ffffff', hl:'#ff6b35', stroke:'#000000', strokeW:5, shadow:48,
    font:'poppins', hlFont:'poppins', up:true, weight:'800'
  }},
];

const state = {
  chunks: [], rawWords: [], transcriber: null,
  activeStyle: 0, activeFilter: 'all', activeLineIdx: -1,
  showCap: true, realcar: true, italicOn: false, ftab: 'main',
  curFont: 'montserrat', curHlFont: 'montserrat',
  curWeight: '900', curHlWeight: '900',
  anim: 'pop',
  burning: false, cancelReq: false,
  ffmpeg: null, ffFetch: null, ffLoading: null,
  srcFile: null, srcUrl: null, pendingProj: null,
  animRaf: 0, playRaf: 0,
};

const vid = $('vid'), cap = $('cap'), capBg = $('capBg');
const sL = $('sL'), s0 = $('s0'), pf = $('pf'), pf0 = $('pf0');

function wordsFromChunk(c) {
  const arr = String(c.text||'').trim().split(/\s+/).filter(Boolean);
  if (!arr.length) return null;
  const dur = Math.max(.01, c.end - c.start);
  const seg = dur / arr.length;
  return arr.map((t,i) => ({ t, s: c.start + i*seg, e: c.start + (i+1)*seg }));
}

function groupWords(words, fallbackText, maxW, maxDur) {
  maxW = Math.max(1, Math.min(6, maxW||3));
  if (!words.length) {
    if (!String(fallbackText||'').trim()) return [];
    return [{ start:0, end:5, text:String(fallbackText).trim(), words:null }];
  }
  const hasWordLevel = words[0] && Array.isArray(words[0].timestamp) && words[0].timestamp[0] != null;
  if (!hasWordLevel) {
    return words.map(w => ({
      start: w.timestamp?.[0] ?? 0,
      end:   w.timestamp?.[1] ?? ((w.timestamp?.[0]||0) + 2),
      text:  String(w.text||'').trim(),
      words: null
    }));
  }
  const out = []; let cur = [];
  for (const w of words) {
    cur.push(w);
    const et = w.timestamp[1] ?? w.timestamp[0];
    const dur = et - cur[0].timestamp[0];
    if (cur.length >= maxW || dur > maxDur || /[.!?]$/.test(String(w.text||'').trim())) {
      out.push(mkGroup(cur)); cur = [];
    }
  }
  if (cur.length) out.push(mkGroup(cur));
  return out;
  function mkGroup(g) {
    const start = g[0].timestamp[0];
    const end   = g[g.length-1].timestamp[1] ?? g[g.length-1].timestamp[0]+1;
    const text  = g.map(x=>String(x.text||'').trim()).join(' ');
    const ws    = g.map(x=>({ t:String(x.text||'').trim(), s:x.timestamp[0], e:x.timestamp[1]??x.timestamp[0]+.4 }));
    return { start, end, text, words:ws };
  }
}

function parseSubs(text, isVtt) {
  const norm = text.replace(/\r/g,'').replace(/^\uFEFF/,'');
  return norm.split(/\n\n+/).map(b=>b.trim()).filter(Boolean).reduce((acc, block) => {
    const lines = block.split('\n').filter(l=>l.trim());
    if (isVtt && /^WEBVTT/.test(lines[0]||'')) return acc;
    const ti = lines.findIndex(l=>l.includes('-->'));
    if (ti<0) return acc;
    const [a,b] = lines[ti].split('-->');
    const start = parseTC(a), end = parseTC((b||'').trim().split(/\s+/)[0]);
    if (isNaN(start)||isNaN(end)) return acc;
    const txt = lines.slice(ti+1).join(' ').replace(/<[^>]+>/g,'').trim();
    if (!txt) return acc;
    const wa = txt.split(/\s+/);
    const seg = (end-start)/Math.max(1,wa.length);
    acc.push({ start, end, text:txt, words: wa.map((w,i)=>({ t:w, s:start+i*seg, e:start+(i+1)*seg })) });
    return acc;
  }, []);
}

function buildShadowCSS(css) {
  if (css.glow) {
    const gc = css.glowColor||css.hl||css.color||'#fff';
    return `0 0 8px ${gc}, 0 0 20px ${gc}, 0 0 36px ${gc}`;
  }
  const stroke = css.stroke && css.stroke!=='transparent' ? css.stroke : '#000';
  const amt = Math.max(2, Math.round((css.shadow||55)/10));
  const layers = [];
  for (let i=1; i<=amt; i++) layers.push(`0 0 ${i*1.5}px ${stroke}`);
  layers.push('0 2px 4px rgba(0,0,0,.7)');
  return layers.join(', ');
}

function renderStyleGrid() {
  const box = $('sgrid'); if (!box) return;
  box.innerHTML = '';
  STYLES.forEach((s,i) => {
    if (state.activeFilter==='padrao' && s.cat!=='padrao') return;
    if (state.activeFilter==='tiktok' && s.cat!=='tiktok') return;
    if (state.activeFilter==='mixed' && s.cat!=='mixed') return;
    if (state.activeFilter==='tscaps' && s.cat!=='tscaps') return;
    if (state.activeFilter==='custom' && s.cat!=='custom') return;
    const chip = document.createElement('div');
    chip.className = 'schip' + (i===state.activeStyle ? ' on' : '');
    chip.dataset.idx = String(i);
    const inner = document.createElement('div');
    inner.className = 'ci';
    const toks = String(s.n).trim().split(/\s+/).slice(0,3);
    const fam = FONTS[s.css.font]||FONTS.inter;
    const shadow = buildShadowCSS(s.css);
    const up = !!s.css.up, italic = !!s.css.italic;
    const stroke = s.css.stroke && s.css.stroke!=='transparent' ? s.css.stroke : 'transparent';
    const sw = Math.min(2.2, (s.css.strokeW||0)/3.5);
    toks.forEach((tok,ti) => {
      const isHl = ti===toks.length-1 && toks.length>1;
      const sp = document.createElement('span');
      sp.className = 'cw';
      sp.textContent = up ? tok.toUpperCase() : tok;
      const col = isHl ? (s.css.hl||s.css.color) : s.css.color;
      const bg  = (isHl && s.css.bg) ? s.css.bg : ((!isHl && s.css.bg && toks.length===1) ? s.css.bg : 'transparent');
      const useFam = isHl ? (FONTS[s.css.hlFont]||fam) : fam;
      Object.assign(sp.style, {
        color: col, fontFamily: useFam, fontWeight: isHl ? (s.css.hlWeight||s.css.weight||'900') : (s.css.weight||'900'),
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: toks.length>1 ? '10.5px' : '11.5px',
        textTransform: up ? 'uppercase' : 'none',
        textShadow: shadow,
        WebkitTextStroke: stroke!=='transparent' ? `${sw}px ${stroke}` : '',
        paintOrder: 'stroke fill',
        background: bg!=='transparent' ? bg : 'transparent',
        padding: bg!=='transparent' ? '2px 4px' : '0',
        borderRadius: bg!=='transparent' ? '3px' : '0',
        display: 'inline-block',
      });
      inner.appendChild(sp);
      if (ti < toks.length-1) {
        const g = document.createElement('span'); g.textContent=' '; g.style.fontSize='9px'; inner.appendChild(g);
      }
    });
    chip.appendChild(inner);
    chip.addEventListener('click', () => applyStyle(i));
    box.appendChild(chip);
  });
}

function applyStyle(i) {
  state.activeStyle = i;
  const s = STYLES[i]?.css||{};
  renderStyleGrid();
  const c1 = (s.color||'#ffffff').startsWith('#') ? s.color : '#ffffff';
  $('c1').value = c1; $('c1D').value = c1;
  $('c2').value = s.hl||'#22e06b';
  state.curFont = s.font||'inter';
  state.curHlFont = s.hlFont||s.font||'inter';
  state.curWeight = s.weight||'900';
  state.curHlWeight = s.hlWeight||s.weight||'900';
  $('fontSel').value = state.ftab==='hl' ? state.curHlFont : state.curFont;
  $('fontWt').value = state.ftab==='hl' ? state.curHlWeight : state.curWeight;
  $('upTog').checked = !!s.up;
  state.italicOn = !!(s.italic||s.italicHl);
  $('strokeW').value = s.strokeW||0; $('strokeWv').textContent = (s.strokeW||0)+' px';
  $('strokeCol').value = (s.stroke && s.stroke!=='transparent') ? s.stroke : '#000000';
  $('shadowAmt').value = s.shadow||55; $('shadowAmtv').textContent = (s.shadow||55)+'%';
  $('shadowCol').value = '#000000';
  $('sizeD').value = $('size').value; $('sizeDv').textContent = $('size').value+' px';
  $('posD').value = $('pos').value; $('posDv').textContent = $('pos').value+'%';
  $('sepName').textContent = STYLES[i].n;
  // hlBg = caixa só na palavra | fullBg = faixa inteira | se só bg sem flag → hlBg
  const wantWordBg = !!(s.hlBg || (s.bg && !s.fullBg));
  const wantFullBg = !!(s.fullBg && s.bg);
  $$('.hlbg-btn').forEach(b=>b.classList.toggle('on', (b.dataset.v==='on')===wantWordBg));
  $('hlbgOpts').classList.toggle('hidden', !wantWordBg);
  if ((wantWordBg||wantFullBg) && (s.bg||'').startsWith('#')) $('bgCol').value = s.bg;
  syncStyleBtns();
  schedRender();
}

function syncStyleBtns() {
  $('btnNorm').classList.toggle('on', !state.italicOn);
  $('btnItal').classList.toggle('on', state.italicOn);
  $('btnAA').classList.toggle('on', !!$('upTog').checked);
  $('btnAa').classList.toggle('on', !$('upTog').checked);
}

function isHlBgOn() {
  const b = document.querySelector('.hlbg-btn.on');
  if (b) return b.dataset.v==='on';
  const s = STYLES[state.activeStyle]?.css||{};
  return !!(s.hlBg || (s.bg && !s.fullBg));
}

function getFont(hl=false) {
  return FONTS[hl ? state.curHlFont : state.curFont]||FONTS.inter;
}

function setAnim(name) {
  state.anim = name;
  ['pop','bounce','scale','fade','slide'].forEach(a => {
    cap.classList.toggle('anim-'+a, a===name);
  });
  $$('.anim-btn').forEach(b => b.classList.toggle('on', b.dataset.anim===name));
}

function buildLines() {
  const box = $('lwrap'); if (!box) return;
  box.innerHTML = '';
  state.chunks.forEach((c,i) => {
    if (i>0) {
      const ins = document.createElement('div');
      ins.style.cssText = 'display:flex;justify-content:center;padding:1px 0';
      const ib = document.createElement('button');
      ib.type='button'; ib.className='ia'; ib.textContent='+'; ib.title='Inserir linha acima';
      ib.style.cssText='width:22px;height:22px;border-radius:50%;';
      ib.addEventListener('click', () => addAfter(i-1));
      ins.appendChild(ib); box.appendChild(ins);
    }
    const row = document.createElement('div');
    row.className = 'line'; row.dataset.idx = String(i);
    const ts = document.createElement('div');
    ts.className = 'lts';
    ts.textContent = fmtShort(c.start)+' – '+fmtShort(c.end);
    ts.title = 'Clique para editar tempos';
    ts.addEventListener('click', () => {
      const ns = prompt('Início (mm:ss.ss)', fmtShort(c.start));
      const ne = prompt('Fim (mm:ss.ss)', fmtShort(c.end));
      if (ns!=null) { const v=parseTC(ns); if(!isNaN(v)&&v>=0) c.start=v; }
      if (ne!=null) { const v=parseTC(ne); if(!isNaN(v)&&v>c.start) c.end=v; }
      buildLines(); schedRender(); saveLocal();
    });
    const body = document.createElement('div'); body.className='lbody';
    const ww = document.createElement('div'); ww.className='lwords';
    const words = c.words?.length ? c.words : (wordsFromChunk(c)||[{t:c.text,s:c.start,e:c.end}]);
    if (!c.words?.length) c.words = words;
    words.forEach(w => {
      const sp = document.createElement('span');
      sp.className='lw'; sp.contentEditable='true'; sp.spellcheck=true;
      sp.textContent = w.t;
      sp.addEventListener('input', () => {
        w.t = sp.textContent.trim()||w.t;
        c.text = words.map(x=>x.t).join(' ');
        schedRender(); saveLocal();
      });
      sp.addEventListener('keydown', e=>{ if(e.key==='Enter'){e.preventDefault();sp.blur();} });
      ww.appendChild(sp);
    });
    body.appendChild(ww);
    const acts = document.createElement('div'); acts.className='lacts';
    acts.append(
      mkAct('✂','Dividir',  ()=>splitLine(i)),
      mkAct('▶','Prévia',   ()=>{ vid.currentTime=c.start; vid.play().catch(()=>{}); }),
      mkAct('🗑','Apagar',  ()=>delLine(i))
    );
    row.append(ts, body, acts);
    box.appendChild(row);
  });
}

function mkAct(txt, title, fn) {
  const b = document.createElement('button');
  b.type='button'; b.className='ia'; b.textContent=txt; b.title=title;
  b.addEventListener('click', e=>{ e.stopPropagation(); fn(); });
  return b;
}
function splitLine(i) {
  const c = state.chunks[i];
  const ws = c.words?.length>1 ? c.words : (wordsFromChunk(c)||[]);
  if (ws.length<2) return;
  const mid=Math.ceil(ws.length/2), a=ws.slice(0,mid), b=ws.slice(mid);
  const makeC = arr => ({ start:arr[0].s, end:arr[arr.length-1].e, text:arr.map(w=>w.t).join(' '), words:arr });
  state.chunks.splice(i,1, makeC(a), makeC(b));
  buildLines(); schedRender(); saveLocal();
}
function delLine(i) {
  if (!confirm('Apagar esta linha?')) return;
  state.chunks.splice(i,1); buildLines(); schedRender(); saveLocal();
}
function addAfter(i) {
  const prev = state.chunks[i], next = state.chunks[i+1];
  const start = prev ? prev.end+.05 : (vid.currentTime||0);
  const end   = next ? Math.min(next.start-.05, start+1.5) : start+1.5;
  const nc = { start, end:Math.max(end,start+.3), text:'nova legenda', words:null };
  nc.words = wordsFromChunk(nc);
  state.chunks.splice(i+1,0,nc); buildLines(); schedRender(); saveLocal();
}

function videoRect() {
  const st = $('stage').getBoundingClientRect();
  const vr = vid.getBoundingClientRect();
  const vw = vid.videoWidth, vh = vid.videoHeight;
  if (!vw||!vh) return { x:0, y:0, w:st.width, h:st.height };
  const ew=vr.width, eh=vr.height;
  const fit = getComputedStyle(vid).objectFit;
  if (fit==='cover') {
    const sc=Math.max(ew/vw,eh/vh);
    const cw=vw*sc, ch=vh*sc;
    return { x:vr.left-st.left+(ew-cw)/2, y:vr.top-st.top+(eh-ch)/2, w:cw, h:ch };
  }
  const sc=Math.min(ew/vw,eh/vh);
  const cw=vw*sc, ch=vh*sc;
  return { x:vr.left-st.left+(ew-cw)/2, y:vr.top-st.top+(eh-ch)/2, w:cw, h:ch };
}

function schedRender() {
  if (state.animRaf) return;
  state.animRaf = requestAnimationFrame(() => { state.animRaf=0; render(); });
}

function render() {
  const t = vid.currentTime||0;
  const s = STYLES[state.activeStyle]?.css; if (!s) return;
  const r = videoRect();
  const rawSz = +$('size').value;
  const sz = Math.max(16, rawSz * (r.h/1080) || rawSz);
  const pos = +$('pos').value;

  // FIXED positioning: flex container already handles width via CSS (78%)
  // We only set top + font-size dynamically
  cap.style.top = (r.y + r.h * pos/100) + 'px';
  cap.style.fontSize = sz + 'px';
  cap.style.fontFamily = getFont(false);
  cap.style.fontStyle = (state.italicOn||s.italic) ? 'italic' : 'normal';
  cap.style.fontWeight = state.curWeight || '900';

  updateActiveLine(t);
  if (!state.showCap) { cap.innerHTML=''; capBg.style.display='none'; return; }

  const c = state.chunks.find(x => t>=x.start && t<=x.end);
  if (!c) { cap.innerHTML=''; capBg.style.display='none'; return; }

  const color = $('c1').value, hl = $('c2').value, up = $('upTog').checked;
  const sw = +$('strokeW').value, scol = $('strokeCol').value||'#000';
  const shAmt = +$('shadowAmt').value, shCol = $('shadowCol').value||'#000000';
  const hlBg = isHlBgOn(), bgCol = hlBg ? ($('bgCol').value||s.bg||'#000') : null;
  const bgOp = hlBg ? (+$('bgOp').value||85)/100 : 0;
  const bgRad = +$('bgRad').value||8;

  let textShadow = 'none';
  if (s.glow) {
    const gc = s.glowColor||hl;
    textShadow = `0 0 ${sz*.3}px ${gc}, 0 0 ${sz*.55}px ${gc}, 0 0 ${sz*.8}px ${gc}`;
  } else if (shAmt>0) {
    const dropY=Math.max(1,sz*.04), dropBlur=Math.max(2,sz*.1*(shAmt/50)), dropAlpha=shAmt/100;
    const wsw=Math.max(1,sw*.4);
    const strokeLayers = (scol!=='transparent'&&sw>0) ? [
      `${wsw}px 0 0 ${scol}`,`-${wsw}px 0 0 ${scol}`,`0 ${wsw}px 0 ${scol}`,`0 -${wsw}px 0 ${scol}`,
      `${wsw*.7}px ${wsw*.7}px 0 ${scol}`,`-${wsw*.7}px ${wsw*.7}px 0 ${scol}`,
      `${wsw*.7}px -${wsw*.7}px 0 ${scol}`,`-${wsw*.7}px -${wsw*.7}px 0 ${scol}`,
    ] : [];
    textShadow = [...strokeLayers, `0 ${dropY}px ${dropBlur}px ${hexRgba(shCol,dropAlpha)}`].join(', ');
  }

  const parts = c.words?.length ? c.words : (wordsFromChunk(c)||[{t:c.text,s:c.start,e:c.end}]);
  const doReal = state.realcar;
  let activeIdx = -1;
  if (doReal) { for(let i=0;i<parts.length;i++){if(t>=parts[i].s&&t<=parts[i].e){activeIdx=i;break;}} }

  const wstroke = sw>0 && scol!=='transparent' ? `${Math.max(.5,sw*.5)}px ${scol}` : '';
  const key = [c.start,c.end,parts.length,up?1:0].join('|');

  if (cap.dataset.key !== key) {
    cap.dataset.key = key;
    cap.dataset.ai = '-1';
    // flex-wrap will handle line breaks automatically
    cap.innerHTML = parts.map(w => `<span class="cw-el">${escHtml(up?String(w.t).toUpperCase():w.t)}</span>`).join('');
    cap.classList.remove('ci'); void cap.offsetWidth; cap.classList.add('ci');
  }

  const prevAI = +(cap.dataset.ai??-1);
  const changed = prevAI !== activeIdx;
  cap.dataset.ai = String(activeIdx);

  cap.querySelectorAll('.cw-el').forEach((el,wi) => {
    const w = parts[wi]; if (!w) return;
    const on = doReal && wi===activeIdx;
    const txt= up ? String(w.t).toUpperCase() : String(w.t);
    if (el.textContent!==txt) el.textContent=txt;
    const wordBg = (hlBg&&on) ? hexRgba(bgCol||hl,Math.max(.8,bgOp)) : (s.bg&&!hlBg ? s.bg : 'transparent');
    el.style.color = on ? hl : color;
    el.style.fontFamily = on ? getFont(true) : getFont(false);
    el.style.fontWeight = on ? (state.curHlWeight||'900') : (state.curWeight||'900');
    el.style.textShadow = textShadow;
    el.style.webkitTextStroke = wstroke;
    el.style.paintOrder = 'stroke fill';
    el.style.background = wordBg;
    el.style.borderRadius = (hlBg&&on) ? bgRad+'px' : (s.bg?'4px':'0');
    el.style.fontStyle = (state.italicOn||s.italic||(on&&s.italicHl)) ? 'italic' : 'normal';
    el.classList.toggle('on', on);
    if (on && changed) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    if (!on) el.classList.remove('pop');
  });

  if (s.bg && !hlBg) {
    requestAnimationFrame(() => {
      const cr=cap.getBoundingClientRect(), stR=$('stage').getBoundingClientRect(), pad=8;
      capBg.style.cssText=`display:block;left:${cr.left-stR.left-pad}px;top:${cr.top-stR.top-pad}px;width:${cr.width+pad*2}px;height:${cr.height+pad*2}px;background:${s.bg};border-radius:4px`;
    });
  } else { capBg.style.display='none'; }
}

function updateActiveLine(t) {
  const idx = state.chunks.findIndex(x=>t>=x.start&&t<=x.end);
  if (idx===state.activeLineIdx) return;
  state.activeLineIdx = idx;
  $$('#lwrap .line').forEach((row,i) => {
    row.classList.toggle('act', i===idx);
    const ws = state.chunks[i]?.words;
    if (!ws) return;
    row.querySelectorAll('.lw').forEach((el,wi) => {
      const w = ws[wi];
      el.classList.toggle('hl', !!(w&&t>=w.s&&t<=w.e));
    });
  });
  if (idx>=0 && !$('tabText').classList.contains('hidden')) {
    $$('#lwrap .line')[idx]?.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
}

function setAiStep(n) {
  $$('#aiSteps .ai-step').forEach(s => {
    const sn = +s.dataset.s;
    s.classList.toggle('done', sn<n);
    s.classList.toggle('cur',  sn===n);
  });
}

async function transcribe(audio) {
  const model = $('modelSel').value;
  const lang = $('langSel').value;
  const useGPU = $('gpuChk').checked && !!navigator.gpu && PERF !== 'low';
  setStatus(sL,'Carregando modelo IA…'); setBusy(true); setProg(pf,0); setAiStep(1);
  try {
    if (!state.transcriber || state.transcriber._model!==model || state.transcriber._gpu!==useGPU) {
      const opts = { progress_callback: p => {
        if (p.status==='progress') { setProg(pf,p.progress||0); setStatus(sL,`Baixando modelo: ${Math.round(p.progress||0)}%`); }
      }};
      if (useGPU) opts.device='webgpu';
      try {
        state.transcriber = await pipeline('automatic-speech-recognition', model, opts);
        state.transcriber._gpu = useGPU;
      } catch(gpuErr) {
        if (useGPU) {
          setStatus(sL,'GPU indisponível, usando CPU…');
          delete opts.device;
          state.transcriber = await pipeline('automatic-speech-recognition', model, opts);
          state.transcriber._gpu = false;
        } else throw gpuErr;
      }
      state.transcriber._model = model;
    }
    setProg(pf,30); setStatus(sL,'Transcrevendo áudio…'); setAiStep(1);
    const tOpts = {
      return_timestamps: 'word', chunk_length_s:30, stride_length_s:5,
      task: $('translateChk').checked ? 'translate' : 'transcribe'
    };
    if (lang) tOpts.language = lang;
    let res;
    try { res = await state.transcriber(audio, tOpts); }
    catch(_) { tOpts.return_timestamps=true; res = await state.transcriber(audio, tOpts); }

    setAiStep(2); setProg(pf,70); setStatus(sL,'Detectando palavras…');
    state.rawWords = (res.chunks||[]).filter(c=>c.timestamp&&c.timestamp[0]!=null);
    setAiStep(3); setProg(pf,90); setStatus(sL,'Montando legendas…');
    const maxW = Math.max(1, +$('maxWords').value||3);
    state.chunks = groupWords(state.rawWords, res.text, maxW, 2.0);
    buildLines(); setProg(pf,100);
    $('waitBox').classList.add('hidden'); $('pvWrap').classList.remove('hidden');
    schedRender(); setStatus(sL,'✅ Pronto! Escolha um estilo.','ok');
    saveLocal();
  } catch(err) {
    console.error(err);
    setStatus(sL, 'Erro na transcrição: '+err.message, 'err');
  } finally { setBusy(false); }
}

async function handleFile(f) {
  if (!f || !f.size) { setStatus(s0,'Arquivo inválido.','err'); return; }
  const ok = /^(video|audio)\//.test(f.type) || /\.(mp4|mov|webm|mkv|mp3|wav|m4a|ogg|aac)$/i.test(f.name);
  if (!ok) { setStatus(s0,'Formato não suportado.','err'); return; }
  setStatus(s0,'Decodificando áudio…');
  if (state.srcUrl) { URL.revokeObjectURL(state.srcUrl); state.srcUrl=null; }
  state.srcFile = f;
  state.srcUrl = URL.createObjectURL(f);
  vid.src = state.srcUrl; vid.load();

  try {
    const buf = await f.arrayBuffer();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error('Seu navegador não suporta áudio.');
    const ctx = new AC({sampleRate:16000});
    let ab;
    try { ab = await ctx.decodeAudioData(buf); }
    catch(e) { throw new Error('Não foi possível decodificar áudio: '+e.message); }
    let data = ab.getChannelData(0);
    if (ab.numberOfChannels>1) {
      const ch1=ab.getChannelData(1); const mix=new Float32Array(data.length);
      for(let i=0;i<data.length;i++) mix[i]=(data[i]+ch1[i])*.5;
      data=mix;
    }
    try { await ctx.close(); } catch(_){}
    showEditor();
    if (state.pendingProj) {
      applyProjData(state.pendingProj); state.pendingProj=null;
      $('waitBox').classList.add('hidden'); $('pvWrap').classList.remove('hidden');
      setStatus(sL,'Projeto carregado.','ok'); return;
    }
    if ($('skipChk').checked) return;
    await transcribe(data);
  } catch(err) {
    console.error(err);
    setStatus(s0,'Erro: '+err.message,'err');
  }
}

function showEditor() {
  $('upSection').classList.add('hidden');
  $('editor').classList.remove('hidden');
  $('mob').style.display='flex';
  $('wm').classList.toggle('show', $('wmChk').checked);
}

async function handleSubFile(sf) {
  try {
    const text = await sf.text();
    const isVtt = /^\uFEFF?WEBVTT/.test(text) || sf.name.toLowerCase().endsWith('.vtt');
    state.chunks = parseSubs(text, isVtt);
    state.rawWords = [];
    buildLines();
    $('waitBox').classList.add('hidden'); $('pvWrap').classList.remove('hidden');
    schedRender(); setStatus(sL,'Legenda importada!','ok');
    saveLocal();
  } catch(err) { setStatus(sL,'Erro ao ler legenda: '+err.message,'err'); }
}

function exportSrt() {
  if (!state.chunks.length) return setStatus(sL,'Sem legendas.','err');
  dlBlob('legenda.srt', state.chunks.map((c,i)=>`${i+1}\n${fmtTC(c.start)} --> ${fmtTC(c.end)}\n${c.text.trim()}\n`).join('\n'));
}
function exportVtt() {
  if (!state.chunks.length) return setStatus(sL,'Sem legendas.','err');
  dlBlob('legenda.vtt', 'WEBVTT\n\n'+state.chunks.map(c=>`${fmtTC(c.start,'.')} --> ${fmtTC(c.end,'.')}\n${c.text.trim()}\n`).join('\n'));
}
function exportTxt() {
  if (!state.chunks.length) return;
  dlBlob('legenda.txt', state.chunks.map(c=>c.text.trim()).join(' '));
}

function getProjectData() {
  return {
    version:7, styleIndex:state.activeStyle, pos:$('pos').value, size:$('size').value,
    c1:$('c1').value, c2:$('c2').value, font:state.curFont, hlFont:state.curHlFont,
    weight:state.curWeight, hlWeight:state.curHlWeight, upToggle:$('upTog').checked,
    strokeW:$('strokeW').value, bgColor:$('bgCol').value, bgOpacity:$('bgOp').value,
    bgRadius:$('bgRad').value, shadowAmt:$('shadowAmt').value, maxWords:$('maxWords').value,
    anim: state.anim, chunks: state.chunks
  };
}
function saveProject() {
  if (!state.chunks.length) return setStatus(sL,'Sem legendas.','err');
  dlBlob('projeto.json', JSON.stringify(getProjectData(),null,2), 'application/json');
}
function saveLocal() {
  try { localStorage.setItem('legendar_auto', JSON.stringify(getProjectData())); } catch(_){}
}
async function loadProject(f) {
  try {
    const data = JSON.parse(await f.text());
    if (!Array.isArray(data.chunks)) throw new Error('Arquivo inválido.');
    if ($('editor').classList.contains('hidden')) {
      state.pendingProj = data;
      setStatus(s0,'Projeto lido! Selecione o vídeo.');
      $('fileInput').click();
    } else {
      applyProjData(data);
      setStatus(sL,'Projeto carregado!','ok');
    }
  } catch(err) { setStatus(s0,'Erro: '+err.message,'err'); }
}
function applyProjData(data) {
  state.chunks = data.chunks||[];
  state.rawWords = [];
  if (data.styleIndex!=null && STYLES[data.styleIndex]) applyStyle(data.styleIndex);
  ['pos','size','c1','c2','strokeW'].forEach(k=>{ if(data[k]!=null) $(k).value=data[k]; });
  if (data.bgColor) $('bgCol').value=data.bgColor;
  if (data.bgOpacity) $('bgOp').value=data.bgOpacity;
  if (data.bgRadius) $('bgRad').value=data.bgRadius;
  if (data.shadowAmt) $('shadowAmt').value=data.shadowAmt;
  if (data.maxWords) $('maxWords').value=data.maxWords;
  if (data.font) state.curFont=data.font;
  if (data.hlFont) state.curHlFont=data.hlFont;
  if (data.weight) state.curWeight=data.weight;
  if (data.hlWeight) state.curHlWeight=data.hlWeight;
  if (data.upToggle!=null) $('upTog').checked=data.upToggle;
  if (data.anim) setAnim(data.anim);
  syncAllLabels(); buildLines(); schedRender();
}

function syncAllLabels() {
  $('posv').textContent = $('pos').value+'%';
  $('sizev').textContent = $('size').value+'px';
  $('sizeDv').textContent = $('size').value+' px';
  $('posDv').textContent = $('pos').value+'%';
  $('strokeWv').textContent = $('strokeW').value+' px';
  $('shadowAmtv').textContent = $('shadowAmt').value+'%';
  $('bgOpv').textContent = $('bgOp').value+'%';
  $('bgRadv').textContent = $('bgRad').value+'px';
  $('maxWordsv').textContent = $('maxWords').value;
}

function setBusy(b) {
  ['burnBtn','burnMob','srtBtn','srtMob','vttBtn','saveBtn','resetBtn','regroupBtn'].forEach(id=>{
    const el=$(id); if(el) el.disabled=b;
  });
}

function onReset() {
  if ((state.chunks.length||state.burning) && !confirm('Descartar e começar de novo?')) return;
  if (state.srcUrl) URL.revokeObjectURL(state.srcUrl);
  try { localStorage.removeItem('legendar_auto'); } catch(_){}
  location.reload();
}

const FFCDN = 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';
function loadScript(src) {
  return new Promise((res,rej)=>{
    if ([...document.scripts].some(s=>s.src===src)){res();return;}
    const s=document.createElement('script');s.src=src;
    s.onload=res; s.onerror=()=>rej(new Error('Falha ao carregar FFmpeg'));
    document.head.appendChild(s);
  });
}
async function ensureFF() {
  if (state.ffmpeg?.isLoaded()) return state.ffmpeg;
  if (state.ffLoading) return state.ffLoading;
  state.ffLoading = (async()=>{
    setStatus(sL,'Carregando FFmpeg (~25MB)…');
    await loadScript(FFCDN);
    if (!window.FFmpeg) throw new Error('FFmpeg não carregou.');
    const {createFFmpeg,fetchFile} = window.FFmpeg;
    state.ffFetch = fetchFile;
    const hasSAB = typeof SharedArrayBuffer!=='undefined';
    const opts = {
      log:false,
      progress:({ratio})=>{
        if(!state.burning)return;
        const p=Math.min(99,Math.max(0,(ratio||0)*100));
        setProg(pf,p); setStatus(sL,`Codificando… ${Math.round(p)}%`);
      }
    };
    if (!hasSAB) { opts.corePath='https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js'; opts.mainName='main'; }
    const ff=createFFmpeg(opts); await ff.load(); state.ffmpeg=ff; return ff;
  })();
  try { return await state.ffLoading; }
  catch (e) { state.ffLoading=null; throw e; }
  finally { state.ffLoading=null; }
}

async function exportBurned() {
  if (!state.srcFile) return setStatus(sL,'Envie um vídeo primeiro.','err');
  if (!state.chunks.length) return setStatus(sL,'Sem legendas.','err');
  if (state.burning) return;
  state.burning=true; state.cancelReq=false; setBusy(true);
  $('burnBtn').disabled=true; $('burnMob').disabled=true;
  $('cancelBtn').classList.remove('hidden'); $('cancelMob').classList.remove('hidden');
  setProg(pf,0);

  const finish=(ok,msg)=>{
    state.burning=false; state.cancelReq=false; setBusy(false);
    $('burnBtn').disabled=false; $('burnMob').disabled=false;
    $('cancelBtn').classList.add('hidden'); $('cancelMob').classList.add('hidden');
    if (!ok) { setStatus(sL,msg||'Falhou.','err'); setProg(pf,0); }
  };

  try {
    await document.fonts.ready;
    const fams = [getFont(false),getFont(true)];
    await Promise.all(fams.flatMap(f=>[900,800,700,400].map(w=>document.fonts.load(`${w} 64px ${f}`).catch(()=>{}))));

    const ff = await ensureFF();
    if (state.cancelReq) return finish(false,'Cancelado.');
    setStatus(sL,'Gerando frames de legenda…');

    const vw = vid.videoWidth||1080, vh = vid.videoHeight||1920;
    let scale = 1;
    if (PERF === 'low') scale = 0.7;
    else if (PERF === 'mid' && (vw>1280||vh>1280)) scale = 0.8;
    // yuv420p exige dimensões pares
    let outW = Math.round(vw * scale);
    let outH = Math.round(vh * scale);
    outW -= outW % 2; outH -= outH % 2;
    if (outW < 2) outW = 2; if (outH < 2) outH = 2;

    const sz = Math.max(20, Math.min(90, Math.round(+$('size').value*(outH/1080))));
    const pos = +$('pos').value;
    const up = $('upTog').checked;
    const color=$('c1').value, hl=$('c2').value;
    const sw = Math.max(0, Math.round(+$('strokeW').value*(outH/1080)*.55));
    const scol = $('strokeCol').value||'#000';
    const shAmt = +$('shadowAmt').value, shCol=$('shadowCol').value||'#000';
    const hlBg = isHlBgOn();
    const s = STYLES[state.activeStyle]?.css || {};
    const bgCol = (hlBg || s.fullBg) ? ($('bgCol').value || s.bg || '#000') : '';
    const bgOp = hlBg ? ((+$('bgOp').value||85)/100) : (s.fullBg ? 0.92 : 0);
    const bgRad = +$('bgRad').value||8;
    const mFam = getFont(false), hFam=getFont(true);
    const doReal = state.realcar;

    const totalWords = state.chunks.reduce((a,c)=>(c.words?.length||1)+a,0);
    let useWordLevel = doReal;
    if (PERF === 'low') useWordLevel = false;
    else if (PERF === 'mid' && totalWords > 120) useWordLevel = false;
    else if (PERF === 'high' && totalWords > 280) useWordLevel = totalWords < 400;

    const animName = state.anim || 'pop';
    const animDur = animName==='bounce' ? 0.34 : (animName==='scale' ? 0.26 : (animName==='fade' ? 0.28 : 0.30));
    // Poucos sub-frames: FFmpeg.wasm quebra com dezenas de inputs
    let animSteps = 1;
    if (useWordLevel) {
      if (PERF === 'high' && totalWords <= 80) animSteps = 4;
      else if (PERF === 'high') animSteps = 2;
      else if (PERF === 'mid' && totalWords <= 60) animSteps = 2;
    }
    const MAX_FRAMES = PERF === 'high' ? 100 : (PERF === 'mid' ? 60 : 40);

    function animScale(p) {
      const e = 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);
      if (animName === 'pop' || animName === 'bounce') {
        if (p < 0.55) return 0.55 + 0.72 * (p / 0.55);
        return 1.27 - 0.09 * ((p - 0.55) / 0.45);
      }
      if (animName === 'scale') return 0.7 + 0.48 * e;
      if (animName === 'fade') return 0.85 + 0.27 * e;
      if (animName === 'slide') return 0.9 + 0.28 * e;
      return 1.18;
    }
    function animAlpha(p) {
      if (animName === 'fade') return Math.min(1, p * 1.4);
      return 1;
    }
    function animDy(p, fSz) {
      if (animName === 'slide') return (1 - Math.min(1, p * 1.2)) * fSz * 0.35;
      if (animName === 'bounce' && p < 0.5) return (1 - p * 2) * fSz * 0.15;
      return 0;
    }

    let frames=[];
    for (const c of state.chunks) {
      if (!c||!(c.end>c.start)||!String(c.text||'').trim()) continue;
      const words = c.words?.length ? c.words : (wordsFromChunk(c)||[{t:c.text,s:c.start,e:c.end}]);
      if (useWordLevel && words.length>1) {
        for (let wi=0;wi<words.length;wi++){
          const w=words[wi];
          const a=Math.max(c.start,w.s??c.start), b=Math.min(c.end,w.e??c.end);
          if(b-a<0.02) continue;
          const span = b - a;
          const aDur = Math.min(animDur, Math.max(0.08, span * 0.55));
          if (animSteps > 1 && aDur >= 0.08) {
            for (let si=0; si<animSteps; si++) {
              const t0 = a + (aDur * si) / animSteps;
              const t1 = a + (aDur * (si + 1)) / animSteps;
              const p = (si + 0.5) / animSteps;
              frames.push({start:t0, end:t1, words, active:wi, ap:p});
            }
            if (a + aDur < b - 0.02) {
              frames.push({start:a + aDur, end:b, words, active:wi, ap:1});
            }
          } else {
            frames.push({start:a, end:b, words, active:wi, ap:1});
          }
        }
      } else {
        frames.push({start:c.start, end:c.end, words, active:-1, ap:1});
      }
    }
    if (!frames.length) throw new Error('Sem frames válidos.');

    // Limita total de overlays (evita Saída vazia no ffmpeg.wasm)
    if (frames.length > MAX_FRAMES) {
      setStatus(sL, `Muitos frames (${frames.length}). Simplificando…`);
      const simplified=[];
      for (const c of state.chunks) {
        if (!c||!(c.end>c.start)||!String(c.text||'').trim()) continue;
        const words = c.words?.length ? c.words : (wordsFromChunk(c)||[{t:c.text,s:c.start,e:c.end}]);
        if (useWordLevel && words.length>1 && simplified.length + words.length <= MAX_FRAMES) {
          for (let wi=0;wi<words.length;wi++){
            const w=words[wi];
            const a=Math.max(c.start,w.s??c.start), b=Math.min(c.end,w.e??c.end);
            if(b-a<0.02) continue;
            simplified.push({start:a, end:b, words, active:wi, ap:1});
          }
        } else {
          simplified.push({start:c.start, end:c.end, words, active:-1, ap:1});
        }
      }
      frames = simplified.slice(0, MAX_FRAMES);
    }

    const timedPngs=[]; // {name,start,end}
    for (let fi=0;fi<frames.length;fi++){
      if (state.cancelReq) return finish(false,'Cancelado.');
      const fr=frames[fi];
      const ap = fr.ap ?? 1;
      const cv=document.createElement('canvas');
      cv.width=outW; cv.height=outH;
      const ctx=cv.getContext('2d',{alpha:true});
      ctx.clearRect(0,0,outW,outH);
      ctx.textBaseline='middle'; ctx.textAlign='left';

      const space=sz*.26, maxLine=outW * 0.78;
      const scOn = animScale(ap);
      const toks=fr.words.map((w,idx)=>({ txt:up?String(w.t).toUpperCase():String(w.t), on:fr.active===idx }));
      const lines=[]; let cur=[],curW=0;
      for (const tk of toks){
        const fam=tk.on?hFam:mFam, fw=tk.on?(state.curHlWeight||'900'):(state.curWeight||'900');
        const layoutSz = tk.on ? sz * 1.18 : sz;
        ctx.font=`${(state.italicOn||s.italic||(tk.on&&s.italicHl))?'italic ':''}${fw} ${layoutSz}px ${fam}`;
        const tw=ctx.measureText(tk.txt).width+space;
        if(curW+tw>maxLine&&cur.length){lines.push({toks:cur,w:curW});cur=[];curW=0;}
        cur.push(tk); curW+=tw;
      }
      if(cur.length) lines.push({toks:cur,w:curW});
      const lh=sz*1.22;
      let y=outH*(pos/100)-((lines.length-1)*lh)/2;

      const useFullBg = !!(s.bg && (s.fullBg || !hlBg));
      if(useFullBg){
        let mxW=0; for(const ln of lines) if(ln.w>mxW) mxW=ln.w;
        const padX=space*1.5, padY=space*.7;
        const bx=(outW-mxW)/2-padX, by=y-(lines.length*lh)/2+lh/2-padY;
        ctx.fillStyle=s.bg;
        ctx.beginPath();
        if(typeof ctx.roundRect==='function') ctx.roundRect(bx,by,mxW+padX*2,lines.length*lh+padY*2,6);
        else ctx.rect(bx,by,mxW+padX*2,lines.length*lh+padY*2);
        ctx.fill();
      }

      for(const ln of lines){
        let x=(outW-ln.w+space)/2;
        for(const tk of ln.toks){
          const isOn=tk.on;
          const fam=isOn?hFam:mFam, fw=isOn?(state.curHlWeight||'900'):(state.curWeight||'900');
          const fSz = isOn ? sz * scOn : sz;
          const dy = isOn ? animDy(ap, sz) : 0;
          const alpha = isOn ? animAlpha(ap) : 1;
          ctx.globalAlpha = alpha;
          const layoutSz = isOn ? sz * 1.18 : sz;
          ctx.font=`${(state.italicOn||s.italic||(isOn&&s.italicHl))?'italic ':''}${fw} ${layoutSz}px ${fam}`;
          const layoutTw=ctx.measureText(tk.txt).width;
          ctx.font=`${(state.italicOn||s.italic||(isOn&&s.italicHl))?'italic ':''}${fw} ${fSz}px ${fam}`;
          const tw=ctx.measureText(tk.txt).width;
          const fillCol=isOn?hl:color;
          const drawX = x + (layoutTw - tw) / 2;
          const drawY = y + dy;
          if(hlBg&&isOn){
            const padX=fSz*.14, padY=fSz*.11;
            ctx.fillStyle=hexRgba(bgCol||hl,Math.max(.75,bgOp||0.85));
            ctx.beginPath();
            if(typeof ctx.roundRect==='function') ctx.roundRect(drawX-padX,drawY-fSz*.55-padY,tw+padX*2,fSz*1.1+padY*2,bgRad);
            else ctx.rect(drawX-padX,drawY-fSz*.55-padY,tw+padX*2,fSz*1.1+padY*2);
            ctx.fill();
          }
          if(s.glow){
            const gc=s.glowColor||hl;
            for(const [blur,al] of [[fSz*1.3,.28],[fSz*.9,.48],[fSz*.5,.68],[fSz*.25,.88]]){
              ctx.shadowColor=gc; ctx.shadowBlur=blur; ctx.globalAlpha=al*alpha; ctx.fillStyle=gc; ctx.fillText(tk.txt,drawX,drawY);
            }
            ctx.globalAlpha=alpha; ctx.shadowBlur=0; ctx.shadowColor='transparent';
          } else if(shAmt>0){
            ctx.shadowColor=hexRgba(shCol,Math.min(1,shAmt/70));
            ctx.shadowBlur=Math.max(4,fSz*.18*(shAmt/50));
            ctx.shadowOffsetY=Math.max(2,fSz*.06);
          } else { ctx.shadowBlur=0; ctx.shadowColor='transparent'; ctx.shadowOffsetY=0; }
          if(sw>0&&scol!=='transparent'){
            ctx.lineWidth=sw*(isOn?1.08:1); ctx.strokeStyle=scol; ctx.lineJoin='round';
            ctx.strokeText(tk.txt,drawX,drawY);
          }
          ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetY=0;
          ctx.fillStyle=fillCol; ctx.fillText(tk.txt,drawX,drawY);
          ctx.globalAlpha = 1;
          x+=layoutTw+space;
        }
        y+=lh;
      }
      const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
      if(!blob) continue;
      const buf=new Uint8Array(await blob.arrayBuffer());
      const nm=`cap${timedPngs.length}.png`;
      ff.FS('writeFile',nm,buf);
      timedPngs.push({name:nm, start:fr.start, end:fr.end});
      if(fi%4===0){ setProg(pf,5+(fi/frames.length)*45); setStatus(sL,`Frame ${fi+1}/${frames.length}…`); }
    }
    if(!timedPngs.length) throw new Error('Nenhum frame gerado.');

    const ext=(state.srcFile.name.match(/\.[a-z0-9]+$/i)||['.mp4'])[0];
    const inN='input'+ext, outN='out.mp4';
    ff.FS('writeFile',inN,await state.ffFetch(state.srcFile));
    setProg(pf,55); setStatus(sL,`Compositando ${timedPngs.length} overlays…`);
    if(state.cancelReq) return finish(false,'Cancelado.');

    let filter='', last='[0:v]';
    for(let i=0;i<timedPngs.length;i++){
      const a=Math.max(0,+timedPngs[i].start).toFixed(3);
      const b=Math.max(+a+.04,+timedPngs[i].end).toFixed(3);
      const out=(i===timedPngs.length-1)?'[vout]':`[v${i}]`;
      filter+=`${last}[${i+1}:v]overlay=0:0:enable='between(t,${a},${b})'${out};`;
      last=out;
    }
    filter=filter.replace(/;$/,'');

    const dur=(Number.isFinite(vid.duration)&&vid.duration>0)?vid.duration:3600;
    const preset = PERF==='low' ? 'ultrafast' : (PERF==='mid' ? 'ultrafast' : 'veryfast');
    const crf = PERF==='low' ? 28 : 23;

    const logs=[];
    const onLog = ({type, message}) => { if (message) logs.push(String(message)); };
    try { ff.setLogger(onLog); } catch(_){}

    const cmd=['-y','-i',inN];
    for(const p of timedPngs) cmd.push('-i', p.name);
    cmd.push(
      '-t', String(dur),
      '-filter_complex', filter,
      '-map', '[vout]',
      '-map', '0:a?',
      '-c:v', 'libx264',
      '-preset', preset,
      '-crf', String(crf),
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-shortest',
      outN
    );

    try {
      await ff.run(...cmd);
    } catch (runErr) {
      console.error('ffmpeg run', runErr, logs.slice(-30));
      // Retry simplificado: 1 overlay por chunk, sem animação
      setStatus(sL,'Retry simplificado…');
      for (const p of timedPngs) { try { ff.FS('unlink', p.name); } catch(_){} }
      timedPngs.length = 0;
      const simple=[];
      for (const c of state.chunks) {
        if (!c||!(c.end>c.start)||!String(c.text||'').trim()) continue;
        const words = c.words?.length ? c.words : (wordsFromChunk(c)||[{t:c.text,s:c.start,e:c.end}]);
        simple.push({start:c.start, end:c.end, words, active:-1, ap:1});
        if (simple.length >= 40) break;
      }
      for (let fi=0;fi<simple.length;fi++){
        const fr=simple[fi];
        const cv=document.createElement('canvas');
        cv.width=outW; cv.height=outH;
        const ctx=cv.getContext('2d',{alpha:true});
        ctx.clearRect(0,0,outW,outH);
        ctx.textBaseline='middle'; ctx.textAlign='left';
        const space=sz*.26, maxLine=outW*0.78;
        const toks=fr.words.map(w=>({txt:up?String(w.t).toUpperCase():String(w.t), on:false}));
        const lines=[]; let cur=[],curW=0;
        for (const tk of toks){
          ctx.font=`${(state.italicOn||s.italic)?'italic ':''}${state.curWeight||'900'} ${sz}px ${mFam}`;
          const tw=ctx.measureText(tk.txt).width+space;
          if(curW+tw>maxLine&&cur.length){lines.push({toks:cur,w:curW});cur=[];curW=0;}
          cur.push(tk); curW+=tw;
        }
        if(cur.length) lines.push({toks:cur,w:curW});
        const lh=sz*1.22;
        let y=outH*(pos/100)-((lines.length-1)*lh)/2;
        if(s.bg){
          let mxW=0; for(const ln of lines) if(ln.w>mxW) mxW=ln.w;
          const padX=space*1.5, padY=space*.7;
          const bx=(outW-mxW)/2-padX, by=y-(lines.length*lh)/2+lh/2-padY;
          ctx.fillStyle=s.bg;
          ctx.beginPath();
          if(typeof ctx.roundRect==='function') ctx.roundRect(bx,by,mxW+padX*2,lines.length*lh+padY*2,6);
          else ctx.rect(bx,by,mxW+padX*2,lines.length*lh+padY*2);
          ctx.fill();
        }
        for(const ln of lines){
          let x=(outW-ln.w+space)/2;
          for(const tk of ln.toks){
            ctx.font=`${(state.italicOn||s.italic)?'italic ':''}${state.curWeight||'900'} ${sz}px ${mFam}`;
            const tw=ctx.measureText(tk.txt).width;
            if(shAmt>0){
              ctx.shadowColor=hexRgba(shCol,Math.min(1,shAmt/70));
              ctx.shadowBlur=Math.max(4,sz*.18*(shAmt/50));
              ctx.shadowOffsetY=Math.max(2,sz*.06);
            }
            if(sw>0){ ctx.lineWidth=sw; ctx.strokeStyle=scol; ctx.lineJoin='round'; ctx.strokeText(tk.txt,x,y); }
            ctx.shadowColor='transparent'; ctx.shadowBlur=0;
            ctx.fillStyle=color; ctx.fillText(tk.txt,x,y);
            x+=tw+space;
          }
          y+=lh;
        }
        const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
        if(!blob) continue;
        const buf=new Uint8Array(await blob.arrayBuffer());
        const nm=`caps${fi}.png`;
        ff.FS('writeFile',nm,buf);
        timedPngs.push({name:nm, start:fr.start, end:fr.end});
      }
      filter=''; last='[0:v]';
      for(let i=0;i<timedPngs.length;i++){
        const a=Math.max(0,+timedPngs[i].start).toFixed(3);
        const b=Math.max(+a+.04,+timedPngs[i].end).toFixed(3);
        const out=(i===timedPngs.length-1)?'[vout]':`[vs${i}]`;
        filter+=`${last}[${i+1}:v]overlay=0:0:enable='between(t,${a},${b})'${out};`;
        last=out;
      }
      filter=filter.replace(/;$/,'');
      const cmd2=['-y','-i',inN];
      for(const p of timedPngs) cmd2.push('-i', p.name);
      cmd2.push('-t',String(dur),'-filter_complex',filter,'-map','[vout]','-map','0:a?',
        '-c:v','libx264','-preset','ultrafast','-crf','28','-pix_fmt','yuv420p',
        '-c:a','aac','-b:a','128k','-movflags','+faststart','-shortest',outN);
      await ff.run(...cmd2);
    }

    let outData;
    try { outData=ff.FS('readFile',outN); }
    catch(e){
      console.error('readFile', e, logs.slice(-40));
      throw new Error('Saída não encontrada. Tente vídeo menor ou menos palavras/slide.');
    }
    if(!outData||outData.length<1000){
      console.error('empty out', outData&&outData.length, logs.slice(-40));
      throw new Error('Saída vazia. Tente: vídeo mais curto, desligar Realçar, ou PC com mais memória.');
    }

    const outBlob=new Blob([outData.buffer],{type:'video/mp4'});
    for(const p of timedPngs){try{ff.FS('unlink',p.name);}catch(_){}}
    try{ff.FS('unlink',inN);}catch(_){}
    try{ff.FS('unlink',outN);}catch(_){}

    dlBlob('video-com-legenda.mp4',outBlob,'video/mp4');
    setProg(pf,100); setStatus(sL,'✅ Vídeo pronto!','ok');
    finish(true);
  } catch(err) {
    console.error(err);
    finish(false,'Erro: '+(err.message||'falha'));
  }
}

function initUpload() {
  $('pickBtn').addEventListener('click', e=>{ e.stopPropagation(); $('fileInput').click(); });
  $('drop').addEventListener('click', ()=>$('fileInput').click());
  $('drop').addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); $('fileInput').click(); } });
  ['dragenter','dragover'].forEach(ev=>$('drop').addEventListener(ev,e=>{ e.preventDefault(); $('drop').classList.add('drag'); }));
  ['dragleave','drop'].forEach(ev=>$('drop').addEventListener(ev,e=>{ e.preventDefault(); $('drop').classList.remove('drag'); }));
  $('drop').addEventListener('drop', e=>{ const f=e.dataTransfer.files[0]; if(f) handleFile(f); });
  $('fileInput').addEventListener('change', ()=>{ const f=$('fileInput').files[0]; if(f) handleFile(f); $('fileInput').value=''; });
  $('skipChk').addEventListener('change', ()=>{
    if ($('skipChk').checked) {
      const handler=e=>{ if(e.target.files[0]) handleSubFile(e.target.files[0]); $('subFile').value=''; };
      $('subFile').addEventListener('change',handler,{once:true});
      $('subFile').click();
    }
  });
  $('wmChk').addEventListener('change', ()=> $('wm').classList.toggle('show', $('wmChk').checked));
  $('openProjBtn').addEventListener('click', ()=>$('projFile').click());
  $('projFile').addEventListener('change', e=>{ const f=e.target.files[0]; e.target.value=''; if(f) loadProject(f); });
}

function initTabs() {
  $$('.stab').forEach(t=>t.addEventListener('click', ()=>{
    $$('.stab').forEach(x=>x.classList.remove('on'));
    t.classList.add('on');
    const isStyle = t.dataset.tab==='style';
    $('tabStyle').classList.toggle('hidden',!isStyle);
    $('tabText').classList.toggle('hidden',isStyle);
    if (isStyle) $('sep').classList.remove('open');
  }));

  $('openSepBtn').addEventListener('click', ()=>{
    $('tabStyle').classList.add('hidden');
    $('tabText').classList.add('hidden');
    $('sep').classList.add('open');
    $('sepName').textContent = STYLES[state.activeStyle]?.n||'Estilo';
  });
  $('closeSepBtn').addEventListener('click', ()=>{
    $('sep').classList.remove('open');
    $('tabStyle').classList.remove('hidden');
    $$('.stab').forEach(t=>{ const on=t.dataset.tab==='style'; t.classList.toggle('on',on); });
  });

  $$('.ftab').forEach(t=>t.addEventListener('click', ()=>{
    $$('.ftab').forEach(x=>x.classList.remove('on')); t.classList.add('on');
    state.ftab = t.dataset.ft||'main';
    $('fontSel').value = state.ftab==='hl' ? state.curHlFont : state.curFont;
    $('fontWt').value = state.ftab==='hl' ? state.curHlWeight : state.curWeight;
  }));
  $('fontSel').addEventListener('change', ()=>{
    if(state.ftab==='hl') state.curHlFont=$('fontSel').value;
    else state.curFont=$('fontSel').value;
    schedRender();
  });
  $('fontWt').addEventListener('change', ()=>{
    if(state.ftab==='hl') state.curHlWeight=$('fontWt').value;
    else state.curWeight=$('fontWt').value;
    schedRender();
  });

  $('btnNorm').addEventListener('click', ()=>{ state.italicOn=false; syncStyleBtns(); schedRender(); });
  $('btnItal').addEventListener('click', ()=>{ state.italicOn=true; syncStyleBtns(); schedRender(); });
  $('btnAA').addEventListener('click', ()=>{ $('upTog').checked=true; syncStyleBtns(); schedRender(); });
  $('btnAa').addEventListener('click', ()=>{ $('upTog').checked=false; syncStyleBtns(); schedRender(); });

  $$('.hlbg-btn').forEach(b=>b.addEventListener('click', ()=>{
    $$('.hlbg-btn').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    $('hlbgOpts').classList.toggle('hidden', b.dataset.v!=='on');
    schedRender();
  }));
  $$('.sf').forEach(b=>b.addEventListener('click', ()=>{
    $$('.sf').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    state.activeFilter=b.dataset.f||'all'; renderStyleGrid();
  }));
  $$('.anim-btn').forEach(b=>b.addEventListener('click', ()=> setAnim(b.dataset.anim)));

  $('createThemeBtn').addEventListener('click', ()=>{
    const name = prompt('Nome do novo tema:','Meu tema');
    if (!name||!name.trim()) return;
    const newS = {
      n: name.trim().toUpperCase(), cat:'custom',
      css:{
        color:$('c1').value, hl:$('c2').value,
        stroke:$('strokeCol').value||'#000000', strokeW:+$('strokeW').value,
        shadow:+$('shadowAmt').value, font:state.curFont, hlFont:state.curHlFont,
        weight:state.curWeight, hlWeight:state.curHlWeight,
        up:$('upTog').checked, italic:state.italicOn,
        glow:!!(STYLES[state.activeStyle]?.css?.glow),
        glowColor:STYLES[state.activeStyle]?.css?.glowColor||null,
        bg:isHlBgOn()?($('bgCol').value||null):null
      }
    };
    STYLES.push(newS);
    state.activeFilter='custom';
    $$('.sf').forEach(b=>b.classList.toggle('on',b.dataset.f==='custom'));
    renderStyleGrid(); applyStyle(STYLES.length-1);
    setStatus(sL,`Tema "${name}" criado!`,'ok');
  });
}

function initPreview() {
  function startLoop() {
    if (state.playRaf) return;
    const tick=()=>{ state.playRaf=0; render(); if(!vid.paused&&!vid.ended) state.playRaf=requestAnimationFrame(tick); };
    state.playRaf=requestAnimationFrame(tick);
  }
  function stopLoop() { if(state.playRaf){cancelAnimationFrame(state.playRaf);state.playRaf=0;} }
  vid.addEventListener('play', startLoop);
  vid.addEventListener('playing', startLoop);
  vid.addEventListener('pause', stopLoop);
  vid.addEventListener('ended', stopLoop);
  vid.addEventListener('timeupdate', schedRender);
  vid.addEventListener('loadedmetadata', schedRender);
  vid.addEventListener('seeked', schedRender);
  window.addEventListener('resize', schedRender);

  $('pos').addEventListener('input', ()=>{ $('posD').value=$('pos').value; syncAllLabels(); schedRender(); });
  $('size').addEventListener('input',()=>{ $('sizeD').value=$('size').value; syncAllLabels(); schedRender(); });
  $('posD').addEventListener('input', ()=>{ $('pos').value=$('posD').value; syncAllLabels(); schedRender(); });
  $('sizeD').addEventListener('input',()=>{ $('size').value=$('sizeD').value; syncAllLabels(); schedRender(); });
  $('c1').addEventListener('input', ()=>{ $('c1D').value=$('c1').value; schedRender(); });
  $('c1D').addEventListener('input',()=>{ $('c1').value=$('c1D').value; schedRender(); });
  ['c2','upTog','strokeW','strokeCol','shadowAmt','shadowCol','bgCol','bgOp','bgRad'].forEach(id=>{
    $(id)?.addEventListener('input',()=>{ syncAllLabels(); schedRender(); });
  });
  $('realTog').addEventListener('change',()=>{ state.realcar=$('realTog').checked; schedRender(); });

  $('speedSel').addEventListener('change', ()=>{ vid.playbackRate=+$('speedSel').value; });
  $('togCapBtn').addEventListener('click', ()=>{ state.showCap=!state.showCap; $('togCapBtn').classList.toggle('on',!state.showCap); schedRender(); });
  $('togSafeBtn').addEventListener('click',()=>{
    const on = $('safeOv').classList.toggle('on');
    $('togSafeBtn').classList.toggle('on', on);
  });
  $('playBtn').addEventListener('click', ()=>{ if (vid.paused){vid.play().catch(()=>{});}else vid.pause(); });
  vid.addEventListener('play', ()=>$('playBtn').textContent='⏸ Pause');
  vid.addEventListener('pause', ()=>$('playBtn').textContent='▶ Play');
  vid.addEventListener('ended', ()=>$('playBtn').textContent='▶ Play');

  $('ratioSel').addEventListener('change', e=>{
    const v=e.target.value, st=$('stage');
    const is916=v==='9:16';
    st.classList.toggle('r916',is916);
    st.style.aspectRatio=v==='Original'?'auto':v.replace(':','/');
    st.style.maxWidth=v==='Original'?'100%':'320px';
    vid.style.objectFit=v==='Original'?'contain':'cover';
    vid.style.height=v==='Original'?'auto':'100%';
    schedRender();
  });

  $('regroupBtn').addEventListener('click', ()=>{
    if(!state.rawWords.length){setStatus(sL,'Sem dados palavra-a-palavra.','err');return;}
    const maxW=Math.max(1,+$('maxWords').value||2);
    state.chunks=groupWords(state.rawWords,'',maxW,2.0);
    buildLines(); schedRender(); setStatus(sL,'Reagrupado!','ok'); saveLocal();
  });
  $('maxWords').addEventListener('input', ()=>{ $('maxWordsv').textContent=$('maxWords').value; });
  $('addLnBtn').addEventListener('click', ()=>addAfter(state.chunks.length-1));
}

function initExports() {
  $('srtBtn').addEventListener('click', exportSrt);
  $('vttBtn').addEventListener('click', exportVtt);
  $('srtMob').addEventListener('click', exportSrt);
  $('saveBtn').addEventListener('click', saveProject);
  $('resetBtn').addEventListener('click', onReset);
  $('moreMob').addEventListener('click', ()=>{
    const menu=[['Baixar .VTT',exportVtt],['Baixar .TXT',exportTxt],['Salvar projeto',saveProject],['Novo vídeo',onReset]];
    const c=prompt('Escolha:\n'+menu.map((m,i)=>`${i+1}. ${m[0]}`).join('\n'));
    const idx=parseInt(c,10)-1;
    if(idx>=0&&idx<menu.length) menu[idx][1]();
  });
}

function initBurn() {
  $('burnBtn').addEventListener('click', exportBurned);
  $('burnMob').addEventListener('click', exportBurned);
  $('cancelBtn').addEventListener('click', ()=>{ state.cancelReq=true; });
  $('cancelMob').addEventListener('click', ()=>{ state.cancelReq=true; });
}

(function boot(){
  renderStyleGrid();
  initTabs();
  initUpload();
  initPreview();
  initExports();
  initBurn();
  applyStyle(0);
  setAnim('pop');
  syncAllLabels();
  try {
    const raw = localStorage.getItem('legendar_auto');
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.chunks?.length) {
        setStatus(s0,'Projeto anterior encontrado. Envie o mesmo vídeo para continuar.');
      }
    }
  } catch(_){}
  window.addEventListener('beforeunload', e=>{
    if(state.chunks.length||state.burning){ e.preventDefault(); e.returnValue=''; }
  });
})();
