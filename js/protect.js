// स्क्रीनशॉट / रिकॉर्डिंग रुकावट परत — सेटिंग्स data.js के SITE.protection से
window.Protect=(function(){
  const sh=document.getElementById('shield'),hide=()=>sh.classList.add('on'),show=()=>sh.classList.remove('on');
  function init(P){
    sh.addEventListener('click',show);
    if(P.blockCopySelect||P.blockPrint)document.documentElement.classList.add('protect');
    if(P.blockRightClick)document.addEventListener('contextmenu',e=>e.preventDefault());
    if(P.blockCopySelect)['copy','cut','dragstart','selectstart'].forEach(v=>document.addEventListener(v,e=>e.preventDefault()));
    if(P.blockShortcuts){
      document.addEventListener('keydown',e=>{
        const k=(e.key||'').toLowerCase(),c=e.ctrlKey||e.metaKey;
        if(k==='printscreen'||k==='f12'||(c&&['p','s','u','c','a'].includes(k))||(c&&e.shiftKey&&['i','j','c','s'].includes(k))||(e.metaKey&&e.shiftKey&&['3','4','5'].includes(k))){e.preventDefault();hide();}
      },true);
      document.addEventListener('keyup',e=>{if((e.key||'').toLowerCase()==='printscreen'){try{navigator.clipboard.writeText(' ')}catch(_){}hide();}});
    }
    if(P.hideOnBlur){window.addEventListener('blur',hide);document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});}
  }
  function mark(el){ // वॉटरमार्क: विज़िटर ID + समय
    let id='';try{id=sessionStorage.getItem('vid')||''}catch(_){}
    if(!id){id=Math.random().toString(36).slice(2,8).toUpperCase();try{sessionStorage.setItem('vid',id)}catch(_){}}
    const t=id+' • '+new Date().toLocaleString('en-IN');
    const svg="<svg xmlns='http://www.w3.org/2000/svg' width='260' height='140'><text x='20' y='80' font-size='15' font-family='sans-serif' fill='#888' transform='rotate(-25 130 70)'>"+t+"</text></svg>";
    el.style.backgroundImage='url("data:image/svg+xml;utf8,'+encodeURIComponent(svg)+'")';
  }
  return{init,mark};
})();
