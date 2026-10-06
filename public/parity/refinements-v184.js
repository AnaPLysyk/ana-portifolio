/* ===== v184 — posicionamento livre dos ícones ===== */
(() => {
  if(window.__portfolioFreeIconsV184) return;
  window.__portfolioFreeIconsV184=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const TARGETS={
    sobre:'#sobre',
    competencias:'#competencias',
    projetos:'#projetos',
    experiencia:'#experiencia',
    contato:'#contato'
  };

  const FALLBACK_ICONS={
    github:'<svg viewBox="0 0 24 24"><path d="M12 .7a11.3 11.3 0 0 0-3.57 22.03c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.31-1.25-1.66-1.25-1.66-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.51-.29-5.15-1.26-5.15-5.59 0-1.24.44-2.25 1.16-3.04-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.11 1.16A10.8 10.8 0 0 1 12 6.16c.96 0 1.92.13 2.82.38 2.16-1.46 3.1-1.16 3.1-1.16.62 1.55.24 2.7.12 2.99.72.79 1.16 1.8 1.16 3.04 0 4.34-2.65 5.3-5.17 5.58.41.35.77 1.04.77 2.09v3.1c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z"/></svg>',
    timeline:'<svg viewBox="0 0 24 24"><path d="M7 4v16M7 7h9M7 12h7M7 17h10"/><circle cx="7" cy="7" r="1.7"/><circle cx="7" cy="12" r="1.7"/><circle cx="7" cy="17" r="1.7"/></svg>',
    code:'<svg viewBox="0 0 24 24"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
    terminal:'<svg viewBox="0 0 24 24"><path d="m5 7 4 5-4 5M11 17h8"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="9"/></svg>',
    database:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7" ry="3"/><path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
    briefcase:'<svg viewBox="0 0 24 24"><path d="M4 8h16v11H4zM9 8V5h6v3M4 12h16"/></svg>',
    spark:'<svg viewBox="0 0 24 24"><path d="m12 2 1.6 5.1L19 9l-5.4 1.9L12 16l-1.6-5.1L5 9l5.4-1.9L12 2Z"/></svg>',
    user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6"/></svg>',
    link:'<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/></svg>',
    mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    bug:'<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="11" rx="5"/><path d="M9 7V5M15 7V5M4 10h3M17 10h3M4 15h3M17 15h3M9 12h6"/></svg>',
    shield:'<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>'
  };

  const status=$('#editorStatusV82');
  let selectedId=null;
  let drag=null;
  let rendering=false;
  let hint=null;

  function api(){
    return window.__portfolioElementsV181;
  }

  function getIconMarkup(icon){
    const source=$('.element-icon-choice-v181[data-icon="'+CSS.escape(icon||'')+'"]');
    return source?.innerHTML || FALLBACK_ICONS[icon] || '';
  }

  function sectionFor(item){
    return $(TARGETS[item.target]||'');
  }

  function defaultPoint(item,section){
    /*
      Primeira posição: perto do título, mas já dentro de coordenadas livres.
      Depois do primeiro drag, x/y ficam gravados no item.
    */
    const title=section.querySelector('h2,h1,h3');
    const sr=section.getBoundingClientRect();

    if(title){
      const tr=title.getBoundingClientRect();
      const x=((tr.left-sr.left)+(item.position==='after'?tr.width+22:-22))/Math.max(1,sr.width)*100;
      const y=((tr.top-sr.top)+(tr.height/2))/Math.max(1,sr.height)*100;
      return {
        x:Math.max(2,Math.min(98,x)),
        y:Math.max(3,Math.min(97,y))
      };
    }

    return {x:8,y:12};
  }

  function ensureZone(section){
    section.classList.add('free-element-zone-v184');

    if(!section.querySelector(':scope > .free-drop-zone-v184')){
      const zone=document.createElement('span');
      zone.className='free-drop-zone-v184';
      zone.setAttribute('aria-hidden','true');
      section.prepend(zone);
    }
  }

  function ensureHint(){
    if(hint && hint.isConnected) return hint;
    hint=document.createElement('div');
    hint.className='free-icon-hint-v184';
    hint.textContent='Arraste para posicionar';
    document.body.appendChild(hint);
    return hint;
  }

  function showHint(el,text='Arraste para posicionar'){
    if(!document.body.classList.contains('editor-studio-open')) return;
    const h=ensureHint();
    const r=el.getBoundingClientRect();

    h.textContent=text;
    h.style.left=(r.left+r.width/2)+'px';
    h.style.top=(r.top-9)+'px';
    h.classList.add('is-open');
  }

  function hideHint(){
    hint?.classList.remove('is-open');
  }

  function render(){
    if(rendering) return;
    const elementApi=api();
    if(!elementApi?.getDraft) return;

    rendering=true;
    document.body.classList.add('free-icon-canvas-v184');

    try{
      $$('.free-icon-v184').forEach(el=>el.remove());
      Object.values(TARGETS).forEach(selector=>{
        const section=$(selector);
        if(section) ensureZone(section);
      });

      const items=elementApi.getDraft();

      items
        .filter(item=>item?.type==='icon')
        .forEach(item=>{
          const section=sectionFor(item);
          if(!section) return;

          ensureZone(section);

          const point=Number.isFinite(Number(item.x)) && Number.isFinite(Number(item.y))
            ? {x:Number(item.x),y:Number(item.y)}
            : defaultPoint(item,section);

          const el=document.createElement('span');
          el.className='generated-element-v181 generated-icon-v181 free-icon-v184';
          el.dataset.freeIconIdV184=item.id;
          el.dataset.icon=item.icon||'';
          el.setAttribute('role','button');
          el.setAttribute('tabindex',document.body.classList.contains('editor-studio-open')?'0':'-1');
          el.setAttribute('aria-label','Ícone '+(item.icon||'')+'. Arraste para posicionar.');
          el.innerHTML=getIconMarkup(item.icon);
          el.style.setProperty('--free-x-v184',point.x+'%');
          el.style.setProperty('--free-y-v184',point.y+'%');
          el.style.setProperty('--element-color',item.system!==false?'var(--system-accent)':(item.color||'#6ea8ff'));
          el.style.width=(item.size||30)+'px';
          el.style.height=(item.size||30)+'px';

          if(selectedId===item.id) el.classList.add('is-selected-v184');

          section.appendChild(el);
        });
    }finally{
      rendering=false;
    }

    syncEditorNote();
  }

  function setSelected(id){
    selectedId=id;
    $$('.free-icon-v184').forEach(el=>{
      el.classList.toggle('is-selected-v184',el.dataset.freeIconIdV184===id);
    });
    syncEditorNote();
  }

  function coordsFor(id){
    const item=api()?.getDraft?.().find(entry=>entry.id===id);
    if(!item) return null;
    return {
      x:Number.isFinite(Number(item.x))?Math.round(Number(item.x)):null,
      y:Number.isFinite(Number(item.y))?Math.round(Number(item.y)):null
    };
  }

  function syncEditorNote(){
    const creator=$('#elementCreatorV181');
    if(!creator) return;

    const typeSelected=$('[data-element-type-v181="icon"].is-selected',creator);
    if(!typeSelected) return;

    const inlineGrid=creator.querySelector('.element-inline-grid-v181');
    if(!inlineGrid) return;

    const positionBlock=[...inlineGrid.children].find(node=>
      node.querySelector?.('[data-element-position-v181]')
    );
    if(!positionBlock) return;

    positionBlock.innerHTML=`
      <span>Posição</span>
      <div class="free-position-note-v184">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2v16M2 10h16M10 2 7.5 4.5M10 2l2.5 2.5M18 10l-2.5-2.5M18 10l-2.5 2.5M10 18l-2.5-2.5M10 18l2.5-2.5M2 10l2.5-2.5M2 10l2.5 2.5"/>
        </svg>
        <span>Arraste o ícone direto na seção.</span>
        <span class="free-position-coords-v184" id="freePositionCoordsV184"></span>
      </div>
    `;

    const coords=$('#freePositionCoordsV184');
    const itemId=selectedId;
    const current=itemId?coordsFor(itemId):null;
    if(coords) coords.textContent=current?.x!=null ? `${current.x}% · ${current.y}%` : 'livre';
  }

  function editorIsOpen(){
    return document.body.classList.contains('editor-studio-open');
  }

  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}

  function pointerToPercent(section,event,sizePx){
    const r=section.getBoundingClientRect();
    const halfX=(sizePx/2)/Math.max(1,r.width)*100;
    const halfY=(sizePx/2)/Math.max(1,r.height)*100;

    return {
      x:clamp(((event.clientX-r.left)/Math.max(1,r.width))*100,halfX,100-halfX),
      y:clamp(((event.clientY-r.top)/Math.max(1,r.height))*100,halfY,100-halfY)
    };
  }

  document.addEventListener('pointerdown',event=>{
    const el=event.target.closest?.('.free-icon-v184');
    if(!el || !editorIsOpen()) return;

    const itemId=el.dataset.freeIconIdV184;
    const item=api()?.getDraft?.().find(entry=>entry.id===itemId);
    const section=el.closest('.free-element-zone-v184');

    if(!item || !section) return;

    event.preventDefault();
    event.stopPropagation();

    setSelected(itemId);

    drag={
      id:itemId,
      el,
      section,
      pointerId:event.pointerId,
      startX:event.clientX,
      startY:event.clientY,
      moved:false,
      size:Number(item.size||30)
    };

    try{el.setPointerCapture(event.pointerId);}catch{}

    el.classList.add('is-dragging-v184');
    section.classList.add('is-drag-target-v184');
    document.body.classList.add('free-icon-dragging-v184');
    showHint(el,'Solte onde quiser');
  },true);

  document.addEventListener('pointermove',event=>{
    if(!drag || event.pointerId!==drag.pointerId) return;

    const distance=Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY);
    if(distance>3) drag.moved=true;

    const point=pointerToPercent(drag.section,event,drag.size);

    drag.el.style.setProperty('--free-x-v184',point.x+'%');
    drag.el.style.setProperty('--free-y-v184',point.y+'%');

    api()?.updateItem?.(
      drag.id,
      {x:Number(point.x.toFixed(2)),y:Number(point.y.toFixed(2)),position:'free'},
      {
        apply:false,
        render:false,
        markDirty:true,
        message:'Ícone reposicionado na prévia. Use ✓ para salvar.'
      }
    );

    const h=ensureHint();
    const r=drag.el.getBoundingClientRect();
    h.style.left=(r.left+r.width/2)+'px';
    h.style.top=(r.top-9)+'px';
    h.textContent=`${Math.round(point.x)}% · ${Math.round(point.y)}%`;

    const coords=$('#freePositionCoordsV184');
    if(coords) coords.textContent=`${Math.round(point.x)}% · ${Math.round(point.y)}%`;
  },true);

  function finishDrag(event){
    if(!drag || (event && event.pointerId!==drag.pointerId)) return;

    const {id,el,section,moved}=drag;

    el.classList.remove('is-dragging-v184');
    section.classList.remove('is-drag-target-v184');
    document.body.classList.remove('free-icon-dragging-v184');
    hideHint();

    try{el.releasePointerCapture(drag.pointerId);}catch{}

    drag=null;

    /*
      Atualiza a descrição na lista sem reaplicar a renderização antiga.
      O MutationObserver abaixo recoloca o ícone livre imediatamente.
    */
    api()?.renderList?.();
    requestAnimationFrame(render);

    if(!moved){
      const row=$('[data-element-id-v181="'+CSS.escape(id)+'"]');
      row?.click();
      setTimeout(syncEditorNote,0);
    }
  }

  document.addEventListener('pointerup',finishDrag,true);
  document.addEventListener('pointercancel',finishDrag,true);

  document.addEventListener('mouseenter',event=>{
    const el=event.target.closest?.('.free-icon-v184');
    if(el && editorIsOpen() && !drag) showHint(el);
  },true);

  document.addEventListener('mouseleave',event=>{
    if(event.target.closest?.('.free-icon-v184') && !drag) hideHint();
  },true);

  /* Teclado: setas também refinam a posição quando o ícone está selecionado. */
  document.addEventListener('keydown',event=>{
    const el=event.target.closest?.('.free-icon-v184');
    if(!el || !editorIsOpen()) return;
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;

    event.preventDefault();
    const id=el.dataset.freeIconIdV184;
    const item=api()?.getDraft?.().find(entry=>entry.id===id);
    if(!item) return;

    const section=el.closest('.free-element-zone-v184');
    const point=Number.isFinite(Number(item.x)) && Number.isFinite(Number(item.y))
      ? {x:Number(item.x),y:Number(item.y)}
      : defaultPoint(item,section);

    const step=event.shiftKey?5:1;
    if(event.key==='ArrowLeft') point.x-=step;
    if(event.key==='ArrowRight') point.x+=step;
    if(event.key==='ArrowUp') point.y-=step;
    if(event.key==='ArrowDown') point.y+=step;

    point.x=clamp(point.x,1,99);
    point.y=clamp(point.y,1,99);

    api()?.updateItem?.(
      id,
      {x:Number(point.x.toFixed(2)),y:Number(point.y.toFixed(2)),position:'free'},
      {apply:false,render:false,message:'Posição do ícone ajustada na prévia.'}
    );

    el.style.setProperty('--free-x-v184',point.x+'%');
    el.style.setProperty('--free-y-v184',point.y+'%');
    syncEditorNote();
  },true);

  /* Mudanças de tamanho/cor/ícone no painel atualizam a peça livre. */
  const list=$('#elementListV181');
  if(list && 'MutationObserver' in window){
    new MutationObserver(()=>requestAnimationFrame(render))
      .observe(list,{childList:true,subtree:true});
  }

  const creator=$('#elementCreatorV181');
  if(creator && 'MutationObserver' in window){
    new MutationObserver(()=>setTimeout(syncEditorNote,0))
      .observe(creator,{childList:true,subtree:true});
  }

  if('MutationObserver' in window){
    new MutationObserver(()=>{
      $$('.free-icon-v184').forEach(el=>{
        el.tabIndex=editorIsOpen()?0:-1;
      });
      if(!editorIsOpen()){
        selectedId=null;
        hideHint();
      }
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  addEventListener('resize',()=>requestAnimationFrame(render),{passive:true});

  setTimeout(render,20);
  setTimeout(render,160);
  setTimeout(render,420);

  window.__portfolioFreeIconsV184={
    render,
    select:setSelected
  };
})();