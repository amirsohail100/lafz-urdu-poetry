(()=>{
const $=s=>document.querySelector(s),root=document.documentElement,P=SITE.protection||{};
const store=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(_){}};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
Protect.init(P);

root.dataset.theme=store('theme')||'dark';
$('#theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';store('theme',root.dataset.theme)};
document.title=SITE.poetName+' — '+SITE.tagline;
$('#brand').textContent=SITE.poetName;$('#poet').textContent=SITE.poetName;
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
    c.onclick=()=>open(p);g.appendChild(c)})}
chips();cards();

const R=$('#reader');let cur=0,io,last,fs=parseFloat(store('fs'))||1.5;
const setFs=v=>{fs=Math.min(2.6,Math.max(1.1,v));root.style.setProperty('--fs',fs+'rem');store('fs',fs)};setFs(fs);
function open(p,keepHash){
  last=document.activeElement;cur=POEMS.indexOf(p);R.style.setProperty('--acc',p.colors[1]);
  const a=$('#poem');a.replaceChildren(el('h2','',p.title));
  p.lines.forEach(l=>a.appendChild(l===''?el('div','gap'):el('p','ln',l)));
  io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{root:R,threshold:.6});
  a.querySelectorAll('.ln').forEach(n=>io.observe(n));
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
