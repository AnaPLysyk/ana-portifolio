/* ===== v182 — live elements + Canva-like text controls ===== */
(() => {
  if(window.__portfolioEditingV182) return;
  window.__portfolioEditingV182=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const status=$('#editorStatusV82');
  const confirmSave=$('#editorConfirmSaveV146');
  const cancel=$('#editorRelockV82');
  const exitConfirm=$('#editorExitConfirmButtonV155');

  const ICONS={
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

  const TARGETS={
    sobre:{section:'#sobre',title:['#sobre .about-v52-head h2','#sobre h2']},
    competencias:{section:'#competencias',title:['#competencias .competencies-v59-head h2','#competencias h2']},
    projetos:{section:'#projetos',title:['#projetos .github-title-v61 h2','#projetos h2']},
    experiencia:{section:'#experiencia',title:['#experiencia .experience-head-v66 h2','#experiencia h2']},
    contato:{section:'#contato',title:['#contato .contact-panel h2','#contato h2']}
  };

  function first(list){
    for(const selector of list||[]){
      const el=$(selector);
      if(el) return el;
    }
    return null;
  }

  function ensureTitleHost(target){
    const config=TARGETS[target];
    const title=first(config?.title);
    if(!title) return null;

    let host=title.closest('.section-title-line-v181,.section-title-line-v178,.github-title-v61');

    if(!host || (host.classList.contains('github-title-v61') && !host.classList.contains('section-title-line-v181'))){
      if(host?.classList.contains('github-title-v61')){
        host.classList.add('section-title-line-v181');
      }else{
        host=document.createElement('div');
        host.className='section-title-line-v181';
        title.parentNode.insertBefore(host,title);
        host.appendChild(title);
      }
    }

    host.classList.add('section-title-line-v181');
    return host;
  }

  function elementColor(item){
    return item.system!==false?'var(--system-accent)':(item.color||'#6ea8ff');
  }

  function renderElements(items){
    $$('[data-v182-rendered-element]').forEach(el=>el.remove());

    Object.values(TARGETS).forEach(config=>{
      const section=$(config.section);
      if(section) section.removeAttribute('data-section-layout-v178');
    });

    (items||[]).forEach(item=>{
      const config=TARGETS[item.target];
      const section=$(config?.section||'');
      if(!section) return;

      if(item.type==='layout'){
        section.dataset.sectionLayoutV178=item.layout;
        return;
      }

      const host=ensureTitleHost(item.target);
      if(!host) return;

      if(item.type==='icon'){
        const el=document.createElement('span');
        el.className='generated-element-v181 generated-icon-v181';
        el.dataset.v182RenderedElement=item.id||'runtime';
        el.dataset.icon=item.icon;
        el.innerHTML=ICONS[item.icon]||'';
        el.style.setProperty('--element-color',elementColor(item));
        el.style.width=(item.size||30)+'px';
        el.style.height=(item.size||30)+'px';
        el.style.flexBasis=(item.size||30)+'px';

        if(item.position==='after') host.appendChild(el);
        else host.insertBefore(el,host.firstChild);
      }

      if(item.type==='badge'){
        const el=document.createElement('span');
        el.className='generated-element-v181 generated-badge-v181';
        el.dataset.v182RenderedElement=item.id||'runtime';
        el.textContent=item.text||'Destaque';
        el.style.setProperty('--element-color',elementColor(item));
        if(item.position==='before') host.insertBefore(el,host.firstChild);
        else host.appendChild(el);
      }

      if(item.type==='divider'){
        const el=document.createElement('span');
        el.className='generated-element-v181 generated-divider-v181';
        el.dataset.v182RenderedElement=item.id||'runtime';
        el.style.setProperty('--element-color',elementColor(item));
        el.style.width=(item.width||58)+'%';
        el.style.height=(item.thickness||2)+'px';
        host.parentElement?.appendChild(el);
      }
    });
  }

  function refreshElements(){
    const api=window.__portfolioElementsV181;
    if(api?.getDraft){
      renderElements(api.getDraft());
    }
  }

  setTimeout(refreshElements,40);
  setTimeout(refreshElements,220);

  /* sempre que a lista do builder muda, reaplica no quadro */
  const elementList=$('#elementListV181');
  if(elementList && 'MutationObserver' in window){
    new MutationObserver(()=>setTimeout(refreshElements,0))
      .observe(elementList,{childList:true,subtree:true});
  }

  /* ───────── toolbar contextual de texto ───────── */
  const toolbar=document.createElement('div');
  toolbar.className='text-context-v182';
  toolbar.innerHTML=`
    <select class="text-font-v182" id="textFontV182" aria-label="Fonte">
      <option value='"Inter",system-ui,sans-serif'>Inter</option>
      <option value='"Space Grotesk","Inter",sans-serif'>Space Grotesk</option>
      <option value='"IBM Plex Mono",ui-monospace,monospace'>IBM Plex Mono</option>
      <option value='Georgia,"Times New Roman",serif'>Georgia</option>
      <option value='system-ui,-apple-system,"Segoe UI",sans-serif'>Sistema</option>
    </select>
    <input class="text-size-v182" id="textSizeV182" type="number" min="10" max="96" step="1" aria-label="Tamanho da fonte">
    <input class="text-color-v182" id="textColorV182" type="color" aria-label="Cor do texto">
    <span class="text-tool-divider-v182"></span>
    <label class="text-range-control-v182" title="Largura do bloco">
      <span>Bloco</span>
      <input id="textBlockWidthV182" type="range" min="40" max="100" step="2">
      <output id="textBlockWidthOutputV182"></output>
    </label>
    <label class="text-range-control-v182" title="Espaço interno do bloco">
      <span>Espaço</span>
      <input id="textBlockPaddingV182" type="range" min="0" max="36" step="2">
      <output id="textBlockPaddingOutputV182"></output>
    </label>
    <button class="text-reset-v182" id="textResetV182" type="button">Redefinir</button>
  `;
  document.body.appendChild(toolbar);

  const font=$('#textFontV182');
  const size=$('#textSizeV182');
  const color=$('#textColorV182');
  const width=$('#textBlockWidthV182');
  const widthOut=$('#textBlockWidthOutputV182');
  const padding=$('#textBlockPaddingV182');
  const paddingOut=$('#textBlockPaddingOutputV182');

  const BLOCK_STORE='ana_portfolio_block_styles_v182';
  let savedBlocks={};
  try{savedBlocks=JSON.parse(localStorage.getItem(BLOCK_STORE)||'{}')||{};}catch{}
  let draftBlocks=JSON.parse(JSON.stringify(savedBlocks));

  let active=null;
  let activeBlock=null;

  function hex(colorValue){
    if(!colorValue) return '#f3f6fc';
    if(colorValue.startsWith('#')) return colorValue.slice(0,7);
    const m=colorValue.match(/\d+(?:\.\d+)?/g);
    if(!m||m.length<3) return '#f3f6fc';
    return '#'+m.slice(0,3).map(v=>Math.max(0,Math.min(255,Math.round(Number(v)))).toString(16).padStart(2,'0')).join('');
  }

  function blockFor(el){
    return el?.closest?.(
      '.custom-card-v156,.custom-text-v156,.repo-card,.timeline-item-v66,.competencies-v59-item,'+
      '.about-v52-highlight,.about-v52-row,.about-v52-routine-grid article,.about-v52-intro-copy,'+
      '.contact-link,.hero-copy,.experience-intro-v66'
    ) || el;
  }

  function stableBlockKey(el){
    if(!el) return '';
    if(!el.dataset.blockStableV182){
      const section=el.closest('section[id]')?.id || (el.closest('header')?'header':'page');
      const candidates=[...document.querySelectorAll(
        '.custom-card-v156,.custom-text-v156,.repo-card,.timeline-item-v66,.competencies-v59-item,'+
        '.about-v52-highlight,.about-v52-row,.about-v52-routine-grid article,.about-v52-intro-copy,'+
        '.contact-link,.hero-copy,.experience-intro-v66'
      )];
      const same=candidates.filter(node=>(node.closest('section[id]')?.id || (node.closest('header')?'header':'page'))===section);
      const index=Math.max(0,same.indexOf(el));
      el.dataset.blockStableV182=section+':block:'+index;
    }
    return el.dataset.blockStableV182;
  }

  function markDirty(){
    window.__portfolioEditorDirtyV146=true;
    if(status) status.textContent='Formatação do texto alterada na prévia. Use ✓ para revisar e salvar.';
  }

  function applySavedBlockStyles(){
    Object.entries(draftBlocks).forEach(([key,style])=>{
      const el=$$('[data-block-stable-v182]').find(node=>node.dataset.blockStableV182===key);
      if(!el) return;
      if(style.width) el.style.width=style.width;
      if(style.maxWidth) el.style.maxWidth=style.maxWidth;
      if(style.paddingInline) el.style.paddingInline=style.paddingInline;
    });
  }

  function identifyBlocks(){
    $$(
      '.custom-card-v156,.custom-text-v156,.repo-card,.timeline-item-v66,.competencies-v59-item,'+
      '.about-v52-highlight,.about-v52-row,.about-v52-routine-grid article,.about-v52-intro-copy,'+
      '.contact-link,.hero-copy,.experience-intro-v66'
    ).forEach(stableBlockKey);
    applySavedBlockStyles();
  }

  function positionToolbar(){
    if(!active || !document.body.classList.contains('editor-page-text-mode')){
      toolbar.classList.remove('is-open');
      return;
    }

    const rect=active.getBoundingClientRect();
    const studio=$('#editorStudio');
    const studioRect=studio && !studio.hidden ? studio.getBoundingClientRect() : null;
    const maxRight=studioRect && studioRect.left>320 ? studioRect.left-10 : innerWidth-10;

    toolbar.classList.add('is-open');
    const tr=toolbar.getBoundingClientRect();

    let left=rect.left;
    let top=rect.top-tr.height-10;

    if(top<8) top=rect.bottom+10;
    left=Math.max(8,Math.min(left,maxRight-tr.width));

    toolbar.style.left=left+'px';
    toolbar.style.top=top+'px';
  }

  function updateToolbar(){
    if(!active) return;

    const computed=getComputedStyle(active);
    const family=computed.fontFamily.toLowerCase();

    const options=[...font.options];
    const match=options.find(option=>{
      const first=option.value.split(',')[0].replace(/["']/g,'').toLowerCase();
      return family.includes(first);
    });
    if(match) font.value=match.value;

    size.value=String(Math.round(parseFloat(computed.fontSize)||16));
    color.value=hex(computed.color);

    activeBlock=blockFor(active);
    const blockComputed=getComputedStyle(activeBlock);
    const parentWidth=activeBlock.parentElement?.getBoundingClientRect().width || activeBlock.getBoundingClientRect().width || 1;
    const blockWidth=activeBlock.getBoundingClientRect().width || parentWidth;
    const percent=Math.max(40,Math.min(100,Math.round((blockWidth/parentWidth)*100)));

    width.value=String(percent);
    widthOut.value=percent+'%';

    const pad=Math.round(parseFloat(blockComputed.paddingLeft)||0);
    padding.value=String(Math.max(0,Math.min(36,pad)));
    paddingOut.value=padding.value+'px';

    positionToolbar();
  }

  function selectText(el){
    $$('.text-selected-v182').forEach(node=>node.classList.remove('text-selected-v182'));
    $$('.text-block-selected-v182').forEach(node=>node.classList.remove('text-block-selected-v182'));

    active=el;
    active.classList.add('text-selected-v182');
    activeBlock=blockFor(active);
    if(activeBlock && activeBlock!==active) activeBlock.classList.add('text-block-selected-v182');

    updateToolbar();
  }

  function closeToolbar(){
    active?.classList.remove('text-selected-v182');
    activeBlock?.classList.remove('text-block-selected-v182');
    active=null;
    activeBlock=null;
    toolbar.classList.remove('is-open');
  }

  function textModeActive(){
    return document.body.classList.contains('editor-page-text-mode');
  }

  document.addEventListener('focusin',event=>{
    if(!textModeActive()) return;
    const el=event.target.closest?.('[contenteditable="true"]');
    if(!el || el.closest('#editorStudio,#aiContextPanel,.text-context-v182')) return;
    selectText(el);
  },true);

  document.addEventListener('click',event=>{
    if(!textModeActive()) return;

    if(event.target.closest('.text-context-v182')) return;

    const el=event.target.closest?.('[contenteditable="true"]');
    if(el && !el.closest('#editorStudio,#aiContextPanel')){
      selectText(el);
      return;
    }

    if(!event.target.closest('#editorStudio')) closeToolbar();
  },true);

  font.addEventListener('change',()=>{
    if(!active) return;
    active.style.fontFamily=font.value;
    markDirty();
    positionToolbar();
  });

  size.addEventListener('input',()=>{
    if(!active) return;
    const px=Math.max(10,Math.min(96,Number(size.value)||16));
    active.style.fontSize=px+'px';
    markDirty();
    positionToolbar();
  });

  color.addEventListener('input',()=>{
    if(!active) return;
    active.style.color=color.value;
    active.style.webkitTextFillColor=color.value;
    markDirty();
  });

  width.addEventListener('input',()=>{
    if(!activeBlock) return;
    const value=Math.max(40,Math.min(100,Number(width.value)||100));
    activeBlock.style.width=value+'%';
    activeBlock.style.maxWidth=value+'%';
    widthOut.value=value+'%';

    const key=stableBlockKey(activeBlock);
    draftBlocks[key]={
      ...(draftBlocks[key]||{}),
      width:value+'%',
      maxWidth:value+'%'
    };

    markDirty();
    positionToolbar();
  });

  padding.addEventListener('input',()=>{
    if(!activeBlock) return;
    const value=Math.max(0,Math.min(36,Number(padding.value)||0));
    activeBlock.style.paddingInline=value+'px';
    paddingOut.value=value+'px';

    const key=stableBlockKey(activeBlock);
    draftBlocks[key]={
      ...(draftBlocks[key]||{}),
      paddingInline:value+'px'
    };

    markDirty();
    positionToolbar();
  });

  $('#textResetV182')?.addEventListener('click',()=>{
    if(!active) return;

    active.style.removeProperty('font-family');
    active.style.removeProperty('font-size');
    active.style.removeProperty('color');
    active.style.removeProperty('-webkit-text-fill-color');

    if(activeBlock){
      activeBlock.style.removeProperty('width');
      activeBlock.style.removeProperty('max-width');
      activeBlock.style.removeProperty('padding-inline');
      const key=stableBlockKey(activeBlock);
      delete draftBlocks[key];
    }

    markDirty();
    updateToolbar();
  });

  confirmSave?.addEventListener('click',()=>{
    savedBlocks=JSON.parse(JSON.stringify(draftBlocks));
    try{localStorage.setItem(BLOCK_STORE,JSON.stringify(savedBlocks));}catch{}
  },true);

  function restoreBlocks(){
    draftBlocks=JSON.parse(JSON.stringify(savedBlocks));
    identifyBlocks();

    $$('[data-block-stable-v182]').forEach(el=>{
      const key=el.dataset.blockStableV182;
      const style=draftBlocks[key];
      if(!style){
        el.style.removeProperty('width');
        el.style.removeProperty('max-width');
        el.style.removeProperty('padding-inline');
      }
    });

    closeToolbar();
  }

  cancel?.addEventListener('click',()=>setTimeout(restoreBlocks,0),true);
  exitConfirm?.addEventListener('click',()=>setTimeout(restoreBlocks,0),true);

  const textToggle=$('#editorTextToggleV82');
  textToggle?.addEventListener('click',()=>{
    setTimeout(()=>{
      if(!textModeActive()) closeToolbar();
      identifyBlocks();
    },0);
  },true);

  addEventListener('resize',()=>requestAnimationFrame(positionToolbar),{passive:true});
  addEventListener('scroll',()=>requestAnimationFrame(positionToolbar),{passive:true,capture:true});

  identifyBlocks();
})();