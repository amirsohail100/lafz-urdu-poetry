(()=>{
const $=s=>document.querySelector(s),root=document.documentElement,P=SITE.protection||{};
const store=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(_){}};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
Protect.init(P);

root.dataset.theme=store('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
$('#theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';store('theme',root.dataset.theme)};

document.title=SITE.poetName+' — '+SITE.tagline;
$('#brand').textContent=SITE.poetName;$('#poet').textContent=SITE.poetName;
$('#tag').textContent=SITE.tagline;$('#foot').textContent=SITE.footer;
const mq=POEMS.map(p=>p.mood+' '+p.title).join('   ✦   ')+'   ✦   ';$('#mq').textContent=mq+mq;

let filter='all';
const types=['all',...new Set(POEMS.map(p=>p.type))];
function chips(){const box=$('#chips');box.replaceChildren();
  types.forEach(t=>{const b=el('button','pill',t==='all'?'All · سب':t);b.type='button';b.setAttribute('aria-pressed',t===filter);
    b.onclick=()=>{filter=t;chips();cards()};box.appendChild(b)})}
function cards(){const g=$('#grid');g.replaceChildren();
  POEMS.filter(p=>filter==='all'||p.type===filter).forEach((p,i)=>{
    const c=el('button','card');c.type='button';
    c.style.setProperty('--c1',p.colors[0]);c.style.setProperty('--c2',p.colors[1]);
    c.style.setProperty('--r',(i%2?1.2:-1.2)+'deg');
    const m=el('div','meta');m.append(el('span','tp',p.type),el('span','',store('like:'+p.id)?'♥':p.mood));
    c.append(m,el('h2','',p.title),el('p','',p.about),el('span','cta','Read ↗'));
    c.onclick=()=>open(p);g.appendChild(c)})}
chips();cards();
})();
