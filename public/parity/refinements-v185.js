/* ===== v185 — posição independente de Robô e CTA ===== */
(() => {
  if(window.__portfolioAssistantLayoutV185) return;
  window.__portfolioAssistantLayoutV185=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const stage=$('.agent-stage');
  const shell=$('#brainShell');
  const orb=$('#agentButton');
  const field=$('.quantum-field-v37');
  const follow=$('.agent-follow-hint-v180');
  const editorPanel=$('[data-editor-panel="layout"]');

  if(!stage || !shell || !orb || !follow) return;

  const confirmSave=$('#editorConfirmSaveV146');
  const cancel=$('#editorRelockV82');
  const exitConfirm=$('#editorExitConfirmButtonV155');
  const status=$('#editorStatusV82');

  const STORE='ana_portfolio_assistant_layout_v185';
  const defaults={
    robot:{x:50,y:41},
    cta:{x:78,y:28}
  };

  function clone(v){return JSON.parse(JSON.stringify(v));}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}

  function read(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORE)||'null');
      if(parsed?.robot && parsed?.cta){
        return {
          robot:{
            x:Number.isFinite(Number(parsed.robot.x))?Number(parsed.robot.x):defaults.robot.x,
            y:Number.isFinite(Number(parsed.robot.y))?Number(parsed.robot.y):defaults.robot.y
          },
          cta:{
            x:Number.isFinite(Number(parsed.cta.x))?Number(parsed.cta.x):defaults.cta.x,
            y:Number.isFinite(Number(parsed.cta.y))?Number(parsed.cta.y):defaults.cta.y
          }
        };
      }
    }catch{}
    return clone(defaults);
  }

  let saved=read();
  let draft=clone(saved);
  let drag=null;
  let selected=null;

  const frame=document.createElement('span');
  frame.className='assistant-robot-frame-v185';
  frame.setAttribute('aria-hidden','true');
  shell.appendChild(frame);

  const label=document.createElement('span');
  label.className='assistant-element-label-v185';
  label.innerHTML='<svg viewBox="0 0 20 20"><path d="M10 2v16M2 10h16M10 2 7.5 4.5M10 2l2.5 2.5M18 10l-2.5-2.5M18 10l-2.5 2.5M10 18l-2.5-2.5M10 18l2.5-2.5M2 10l2.5-2.5M2 10l2.5 2.5"/></svg><span></span>';
  document.body.appendChild(label);

  function setVars(){
    shell.style.setProperty('--assistant-robot-x-v185',draft.robot.x+'%');
    shell.style.setProperty('--assistant-robot-y-v185',draft.robot.y+'%');
    shell.style.setProperty('--assistant-cta-x-v185',draft.cta.x+'%');
    shell.style.setProperty('--assistant-cta-y-v185',draft.cta.y+'%');

    /*
      A v180 colocava valores inline no CTA.
      Aqui a posição independente passa a ser a única fonte de verdade.
    */
    follow.style.setProperty('left',draft.cta.x+'%','important');
    follow.style.setProperty('top',draft.cta.y+'%','important');
    follow.style.setProperty('transform','translate(-50%,-50%)','important');

    updatePanel();
  }

  function editorOpen(){
    return document.body.classList.contains('editor-studio-open') &&
      !document.body.classList.contains('editor-preview-v156') &&
      !stage.classList.contains('chat-active');
  }

  function markDirty(message){
    window.__portfolioEditorDirtyV146=true;
    if(status) status.textContent=message||'Posição do assistente alterada na prévia. Use ✓ para salvar.';
  }

  function persist(){
    try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{}
  }

  function boundsFor(type){
    const shellRect=shell.getBoundingClientRect();

    if(type==='robot'){
      const visual=field?.getBoundingClientRect() || orb.getBoundingClientRect();
      const halfX=(visual.width/2)/Math.max(1,shellRect.width)*100;
      const halfY=(visual.height/2)/Math.max(1,shellRect.height)*100;
      return {
        minX:Math.min(48,Math.max(4,halfX*.78)),
        maxX:Math.max(52,100-Math.max(4,halfX*.78)),
        minY:Math.min(45,Math.max(4,halfY*.78)),
        maxY:Math.max(55,100-Math.max(4,halfY*.78))
      };
    }

    const r=follow.getBoundingClientRect();
    const halfX=(r.width/2)/Math.max(1,shellRect.width)*100;
    const halfY=(r.height/2)/Math.max(1,shellRect.height)*100;
    return {
      minX:Math.max(2,halfX+1.5),
      maxX:Math.min(98,100-halfX-1.5),
      minY:Math.max(2,halfY+1.5),
      maxY:Math.min(98,100-halfY-1.5)
    };
  }

  function pointFromPointer(type,event){
    const r=shell.getBoundingClientRect();
    const bounds=boundsFor(type);

    return {
      x:clamp(((event.clientX-r.left)/Math.max(1,r.width))*100,bounds.minX,bounds.maxX),
      y:clamp(((event.clientY-r.top)/Math.max(1,r.height))*100,bounds.minY,bounds.maxY)
    };
  }

  function showLabel(type){
    if(!editorOpen()) return;

    const target=type==='robot'?frame:follow;
    const r=target.getBoundingClientRect();
    const name=type==='robot'?'Robô':'Fale comigo';
    const point=draft[type];

    label.querySelector('span').textContent=`${name} · ${Math.round(point.x)}% / ${Math.round(point.y)}%`;
    label.style.left=(r.left+r.width/2)+'px';
    label.style.top=(r.top-8)+'px';
    label.style.transform='translate(-50%,-100%)';
    label.classList.add('is-open');
  }

  function hideLabel(){
    label.classList.remove('is-open');
  }

  function select(type){
    selected=type;
    frame.classList.toggle('is-selected-v185',type==='robot');
    follow.classList.toggle('is-selected-v185',type==='cta');
    showLabel(type);
    updatePanel();
  }

  function clearSelection(){
    selected=null;
    frame.classList.remove('is-selected-v185');
    follow.classList.remove('is-selected-v185');
    hideLabel();
    updatePanel();
  }

  function startDrag(type,event,target){
    if(!editorOpen() || event.button!==0) return;

    event.preventDefault();
    event.stopPropagation();

    select(type);

    drag={
      type,
      target,
      pointerId:event.pointerId,
      startX:event.clientX,
      startY:event.clientY,
      moved:false
    };

    target.classList.add('is-dragging-v185');
    document.body.classList.add('assistant-layout-dragging-v185');

    try{target.setPointerCapture?.(event.pointerId);}catch{}
    showLabel(type);
  }

  function move(event){
    if(!drag || event.pointerId!==drag.pointerId) return;

    event.preventDefault();

    if(Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>3){
      drag.moved=true;
    }

    const p=pointFromPointer(drag.type,event);
    draft[drag.type]={
      x:Number(p.x.toFixed(2)),
      y:Number(p.y.toFixed(2))
    };

    setVars();
    showLabel(drag.type);
    markDirty(
      drag.type==='robot'
        ? 'Posição do robô alterada na prévia. Use ✓ para salvar.'
        : 'Posição do “Fale comigo” alterada na prévia. Use ✓ para salvar.'
    );
  }

  function end(event){
    if(!drag || (event && event.pointerId!==drag.pointerId)) return;

    const current=drag;
    current.target.classList.remove('is-dragging-v185');
    document.body.classList.remove('assistant-layout-dragging-v185');

    try{current.target.releasePointerCapture?.(current.pointerId);}catch{}

    drag=null;
    showLabel(current.type);
  }

  /*
    Robô: arrastar pela esfera move também as órbitas.
    CTA: arrastar pelo próprio balão, de forma totalmente independente.
  */
  orb.addEventListener('pointerdown',event=>startDrag('robot',event,orb),true);
  follow.addEventListener('pointerdown',event=>startDrag('cta',event,follow),true);

  document.addEventListener('pointermove',move,true);
  document.addEventListener('pointerup',end,true);
  document.addEventListener('pointercancel',end,true);

  /*
    No modo edição, um clique não deve abrir o chat.
    Fora dele, o comportamento original continua intacto.
  */
  document.addEventListener('click',event=>{
    if(!editorOpen()) return;

    if(event.target.closest('#agentButton,.agent-follow-hint-v180')){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);

  orb.addEventListener('mouseenter',()=>{ if(editorOpen()&&!drag) showLabel('robot'); });
  orb.addEventListener('mouseleave',()=>{ if(editorOpen()&&!drag&&selected!=='robot') hideLabel(); });
  follow.addEventListener('mouseenter',()=>{ if(editorOpen()&&!drag) showLabel('cta'); });
  follow.addEventListener('mouseleave',()=>{ if(editorOpen()&&!drag&&selected!=='cta') hideLabel(); });

  /* setas refinam a posição selecionada */
  document.addEventListener('keydown',event=>{
    if(!editorOpen() || !selected) return;
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;

    event.preventDefault();

    const step=event.shiftKey?3:0.75;
    const next={...draft[selected]};
    if(event.key==='ArrowLeft') next.x-=step;
    if(event.key==='ArrowRight') next.x+=step;
    if(event.key==='ArrowUp') next.y-=step;
    if(event.key==='ArrowDown') next.y+=step;

    const b=boundsFor(selected);
    next.x=clamp(next.x,b.minX,b.maxX);
    next.y=clamp(next.y,b.minY,b.maxY);

    draft[selected]={
      x:Number(next.x.toFixed(2)),
      y:Number(next.y.toFixed(2))
    };

    setVars();
    showLabel(selected);
    markDirty();
  },true);

  /* ───────── painel compacto ───────── */
  let editorBlock=null;

  function ensureEditorBlock(){
    if(!editorPanel || editorBlock) return;

    editorBlock=document.createElement('div');
    editorBlock.className='assistant-layout-editor-v185';
    editorBlock.innerHTML=`
      <div>
        <small>ASSISTENTE NA HOME</small>
        <h3>Posição dos elementos</h3>
        <p>Selecione e arraste cada elemento diretamente na página. Robô e chamada são independentes.</p>
      </div>

      <div class="assistant-layout-row-v185">
        <strong>Robô</strong>
        <span class="assistant-layout-coords-v185" data-assistant-coords-v185="robot"></span>
        <button type="button" class="assistant-layout-select-v185" data-assistant-select-v185="robot">Selecionar</button>
      </div>

      <div class="assistant-layout-row-v185">
        <strong>Fale comigo</strong>
        <span class="assistant-layout-coords-v185" data-assistant-coords-v185="cta"></span>
        <button type="button" class="assistant-layout-select-v185" data-assistant-select-v185="cta">Selecionar</button>
      </div>
    `;

    const builder=$('.element-builder-v181',editorPanel);
    if(builder) editorPanel.insertBefore(editorBlock,builder);
    else editorPanel.appendChild(editorBlock);

    editorBlock.addEventListener('click',event=>{
      const button=event.target.closest('[data-assistant-select-v185]');
      if(!button) return;

      const type=button.dataset.assistantSelectV185;
      select(type);

      const target=type==='robot'?orb:follow;
      target.scrollIntoView?.({behavior:'smooth',block:'center',inline:'center'});

      setTimeout(()=>showLabel(type),320);
    });
  }

  function updatePanel(){
    ensureEditorBlock();
    if(!editorBlock) return;

    ['robot','cta'].forEach(type=>{
      const el=editorBlock.querySelector('[data-assistant-coords-v185="'+type+'"]');
      if(el) el.textContent=`${Math.round(draft[type].x)}% · ${Math.round(draft[type].y)}%`;

      const button=editorBlock.querySelector('[data-assistant-select-v185="'+type+'"]');
      if(button) button.textContent=selected===type?'Selecionado':'Selecionar';
    });
  }

  confirmSave?.addEventListener('click',()=>{
    saved=clone(draft);
    persist();
    clearSelection();
  },true);

  function restoreSaved(){
    draft=clone(saved);
    setVars();
    clearSelection();
  }

  cancel?.addEventListener('click',()=>setTimeout(restoreSaved,0),true);
  exitConfirm?.addEventListener('click',()=>setTimeout(restoreSaved,0),true);

  if('MutationObserver' in window){
    new MutationObserver(()=>{
      if(editorOpen()){
        ensureEditorBlock();
        setVars();
      }else{
        clearSelection();
      }
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  addEventListener('resize',()=>{
    setVars();
    if(selected) showLabel(selected);
  },{passive:true});

  setVars();
  ensureEditorBlock();

  window.__portfolioAssistantLayoutV185={
    getDraft:()=>clone(draft),
    getSaved:()=>clone(saved),
    select,
    restore:restoreSaved
  };
})();