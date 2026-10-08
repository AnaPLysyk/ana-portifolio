/* ===== v183 — sincronização real da cor + botão de texto estável ===== */
(() => {
  if(window.__portfolioAccentSyncV183) return;
  window.__portfolioAccentSyncV183=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement;
  const textToggle=$('#editorTextToggleV82');

  const STORE='ana_portfolio_appearance_v178';

  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function hexToRgb(hex){
    const clean=String(hex||'').replace('#','').trim();
    const full=clean.length===3?clean.split('').map(c=>c+c).join(''):clean.padEnd(6,'0').slice(0,6);
    const n=parseInt(full,16);
    return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
  }
  function rgbToHex({r,g,b}){
    const p=n=>clamp(Math.round(n),0,255).toString(16).padStart(2,'0');
    return '#'+p(r)+p(g)+p(b);
  }
  function mix(a,b,t){
    const A=hexToRgb(a),B=hexToRgb(b);
    return rgbToHex({
      r:A.r+(B.r-A.r)*t,
      g:A.g+(B.g-A.g)*t,
      b:A.b+(B.b-A.b)*t
    });
  }
  function rgba(hex,a){
    const {r,g,b}=hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }
  function validHex(value){
    return /^#[0-9a-f]{6}$/i.test(String(value||'').trim());
  }

  function savedAccent(){
    try{
      const value=JSON.parse(localStorage.getItem(STORE)||'{}');
      if(validHex(value?.accent)) return value.accent;
    }catch{}
    return '';
  }

  function currentAccent(){
    const custom=$('#systemCustomColorV178')?.value;
    if(validHex(custom)) return custom;

    const selected=$('.system-swatch-v178.is-selected');
    if(validHex(selected?.dataset?.systemColorV178)) return selected.dataset.systemColorV178;

    const oldPicker=$('#editorAccentV82')?.value;
    if(validHex(oldPicker)) return oldPicker;

    const inline=root.style.getPropertyValue('--system-accent').trim();
    if(validHex(inline)) return inline;

    const saved=savedAccent();
    if(validHex(saved)) return saved;

    return '#6ea8ff';
  }

  function syncAccent(color){
    if(!validHex(color)) return;

    const appearance=(()=>{
      try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch{return {};}
    })();
    const intensity=clamp(Number(appearance.intensity||72),35,100);
    const strength=(intensity-35)/65;

    root.style.setProperty('--system-accent',color);
    root.style.setProperty('--accent',color);
    root.style.setProperty('--editor-accent',color);
    root.style.setProperty('--about-accent',color);
    root.style.setProperty('--ui-accent-v183',color);
    root.style.setProperty('--system-accent-soft',rgba(color,.055+strength*.105));
    root.style.setProperty('--system-accent-soft-2',rgba(color,.11+strength*.15));
    root.style.setProperty('--system-accent-glow',rgba(color,.12+strength*.22));
    root.style.setProperty('--system-accent-mid',mix(color,'#ffffff',.30));
    root.style.setProperty('--system-accent-deep',mix(color,'#10233f',.39));

    const picker=$('#editorAccentV82');
    if(picker && picker.value.toLowerCase()!==color.toLowerCase()) picker.value=color;

    const custom=$('#systemCustomColorV178');
    if(custom && custom.value.toLowerCase()!==color.toLowerCase()) custom.value=color;

    $$('.system-swatch-v178').forEach(btn=>{
      btn.classList.toggle(
        'is-selected',
        String(btn.dataset.systemColorV178||'').toLowerCase()===color.toLowerCase()
      );
    });
  }

  function scheduleAccent(color){
    requestAnimationFrame(()=>{
      syncAccent(validHex(color)?color:currentAccent());
      setTimeout(()=>syncAccent(validHex(color)?color:currentAccent()),0);
    });
  }

  document.addEventListener('click',event=>{
    const modern=event.target.closest?.('[data-system-color-v178]');
    if(modern && validHex(modern.dataset.systemColorV178)){
      scheduleAccent(modern.dataset.systemColorV178);
      return;
    }

    const legacy=event.target.closest?.('[data-accent]');
    if(legacy && validHex(legacy.dataset.accent)){
      scheduleAccent(legacy.dataset.accent);
    }
  },true);

  document.addEventListener('input',event=>{
    if(event.target?.id==='systemCustomColorV178' || event.target?.id==='editorAccentV82'){
      if(validHex(event.target.value)) scheduleAccent(event.target.value);
    }

    if(event.target?.id==='systemColorIntensityV178'){
      scheduleAccent(currentAccent());
    }
  },true);

  /* O botão antigo era grande demais e dois scripts reescreviam o texto.
     Mantemos o estado visual compacto e o aria-label completo. */
  function syncTextButton(){
    if(!textToggle) return;

    const active=document.body.classList.contains('editor-page-text-mode');
    const label=active?'Concluir':'Editar textos';
    const aria=active?'Concluir edição de textos':'Editar outros textos direto na página';
    const icon=active
      ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 10 3.2 3.2 7.8-7.8"/></svg>'
      : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 15.5h3l8-8a1.8 1.8 0 0 0-2.5-2.5l-8 8v2.5Z"/><path d="m11.5 6 2.5 2.5"/></svg>';

    const hasSvg=!!textToggle.querySelector('svg');
    if(textToggle.textContent.trim()!==label || !hasSvg){
      textToggle.innerHTML=icon+'<span>'+label+'</span>';
    }

    textToggle.setAttribute('aria-label',aria);
    textToggle.title=aria;
  }

  if(textToggle && 'MutationObserver' in window){
    let fixing=false;
    new MutationObserver(()=>{
      if(fixing) return;
      fixing=true;
      syncTextButton();
      queueMicrotask(()=>{fixing=false;});
    }).observe(textToggle,{childList:true,subtree:true,characterData:true});
  }

  if('MutationObserver' in window){
    new MutationObserver(()=>{
      syncTextButton();
      scheduleAccent();
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  syncAccent(savedAccent()||currentAccent());
  syncTextButton();

  setTimeout(()=>syncAccent(savedAccent()||currentAccent()),80);
  setTimeout(syncTextButton,120);
})();