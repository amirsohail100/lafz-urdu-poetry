(()=>{
const $=s=>document.querySelector(s),root=document.documentElement,P=SITE.protection||{};
const store=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(_){}};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
Protect.init(P);

root.dataset.theme=store('theme')||'dark';
$('#theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';store('theme',root.dataset.theme)};
document.title=SITE.poetName+' — '+SITE.tagline;
$('#brand').textContent=SITE.poetName;SITE.poetName.split(' ').forEach((w,i)=>{const s=el('span','kw',w);s.style.setProperty('--i',i);$('#poet').append(s,' ')});
const A=$('.aurora').children;[0,1,2].forEach(i=>{A[i].style.background=POEMS[i%POEMS.length].colors[i%2]});
$('#tag').textContent=SITE.tagline;$('#foot').textContent=SITE.footer;

/* data.js की lines को शेर/बंद में बाँटना (खाली लाइन = नया बंद) */
const groups=p=>{const out=[];let g=[];p.lines.forEach(l=>{if(l===''){g.length&&out.push(g);g=[]}else g.push(l)});g.length&&out.push(g);return out};

let filter='all';
const types=['all',...new Set(POEMS.map(p=>p.type))];
function chips(){const b=$('#chips');b.replaceChildren();
  types.forEach(t=>{const x=el('button','btn',t==='all'?'All':t);x.type='button';x.setAttribute('aria-pressed',t===filter);
    x.onclick=()=>{filter=t;chips();cards()};b.appendChild(x)})}
function cards(){const g=$('#grid');g.replaceChildren();
  POEMS.filter(p=>filter==='all'||p.type===filter).forEach((p,i)=>{
    const c=el('button','card'+(i===0?' feat':''));c.type='button';
    c.style.setProperty('--c1',p.colors[0]);
    const m=el('div','meta');m.append(el('span','tp',p.type),el('span','',store('like:'+p.id)?'♥':p.mood));
    const n=groups(p).length,f=el('div','foot');f.append(el('span','',n+' parts · '+Math.max(1,Math.round(n/2))+' min'),el('span','go','Read'));
    c.append(m,el('h2','',p.title),el('p','',p.about),f);
    c.onclick=()=>open(p);c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});g.appendChild(c)})}
chips();cards();

/* reader */
const R=$('#reader');let cur=0,io,last,fs=parseFloat(store('fs'))||1.7;
const setFs=v=>{fs=Math.min(2.8,Math.max(1.2,v));root.style.setProperty('--fs',fs+'rem');store('fs',fs)};setFs(fs);
function open(p,keepHash){
  last=document.activeElement;cur=POEMS.indexOf(p);R.style.setProperty('--acc',p.colors[0]);
  const gs=groups(p),a=$('#poem');a.replaceChildren();
  const cover=el('section','pg');cover.append(el('h2','',p.title),el('div','sub',p.type+' · '+gs.length+' parts'),el('div','hint','Scroll ↓'));a.appendChild(cover);
  gs.forEach(g=>{const s=el('section','pg');g.forEach(l=>s.appendChild(el('p','l',l)));a.appendChild(s)});
  const pages=[...a.children];
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');$('#count').textContent=(pages.indexOf(e.target))+' / '+gs.length}}),{root:R,threshold:.55});
  pages.forEach(x=>io.observe(x));
  $('#count').textContent='0 / '+gs.length;
  $('#like').textContent=store('like:'+p.id)?'♥':'♡';
  if(P.watermark)Protect.mark($('#wm'));
  R.classList.add('open');R.scrollTop=0;$('#close').focus();
  if(!keepHash)history.replaceState(null,'','#'+p.id);
}
function close(){R.classList.remove('open');history.replaceState(null,'',location.pathname);cards();last&&last.focus()}
const go=d=>open(POEMS[(cur+d+POEMS.length)%POEMS.length]);
$('#close').onclick=close;$('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);
$('#sm').onclick=()=>setFs(fs-.15);$('#lg').onclick=()=>setFs(fs+.15);
$('#like').onclick=()=>{const k='like:'+POEMS[cur].id;store(k,store(k)?'':'1');$('#like').textContent=store(k)?'♥':'♡'};
$('#shuffle').onclick=()=>open(POEMS[Math.floor(Math.random()*POEMS.length)]);
R.addEventListener('scroll',()=>{$('#rprog').style.width=(R.scrollTop/Math.max(1,R.scrollHeight-R.clientHeight)*100)+'%'});
document.addEventListener('keydown',e=>{if(!R.classList.contains('open'))return;
  if(e.key==='Escape')close();if(e.key==='ArrowLeft')go(1);if(e.key==='ArrowRight')go(-1)});
const fromHash=()=>{const p=POEMS.find(x=>'#'+x.id===location.hash);if(p)open(p,true)};
fromHash();addEventListener('hashchange',fromHash);
})();
