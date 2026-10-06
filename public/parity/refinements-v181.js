/* ===== v181 — gerador de elementos do quadro ===== */
(() => {
  if (window.__portfolioElementBuilderV181) return;
  window.__portfolioElementBuilderV181 = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const panel=$('[data-editor-panel="layout"]');
  if(!panel) return;

  const status=$('#editorStatusV82');
  const confirmSave=$('#editorConfirmSaveV146');
  const cancel=$('#editorRelockV82');
  const exitConfirm=$('#editorExitConfirmButtonV155');

  const STORE='ana_portfolio_elements_v181';

  const ICONS={
    github:'<svg viewBox="0 0 24 24"><path d="M12 .7a11.3 11.3 0 0 0-3.57 22.03c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.31-1.25-1.66-1.25-1.66-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.51-.29-5.15-1.26-5.15-5.59 0-1.24.44-2.25 1.16-3.04-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.11 1.16A10.8 10.8 0 0 1 12 6.16c.96 0 1.92.13 2.82.38 2.16-1.46 3.1-1.16 3.1-1.16.62 1.55.24 2.7.12 2.99.72.79 1.16 1.8 1.16 3.04 0 4.34-2.65 5.3-5.17 5.58.41.35.77 1.04.77 2.09v3.1c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z"/></svg>',
    timeline:'<svg viewBox="0 0 24 24"><path d="M7 4v16M7 7h9M7 12h7M7 17h10"/><circle cx="7" cy="7" r="1.7"/><circle cx="7" cy="12" r="1.7"/><circle cx="7" cy="17" r="1.7"/></svg>',
    code:'<svg viewBox="0 0 24 24"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
    terminal:'<svg viewBox="0 0 24 24"><path d="m5 7 4 5-4 5M11 17h8"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="9"/></svg>',
    database:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7" ry="3"/><path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
    briefcase:'<svg viewBox="0 0 24 24"><path d="M4 8h16v11H4zM9 8V5h6v3M4 12h16"/></svg>',
    spark:'<svg viewBox="0 0 24 24"><path d="m12 2 1.6 5.1L19 9l-5.4 1.9L12 16l-1.6-5.1L5 9l5.4-1.9L12 2ZM19 15l.8 2.4L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.6L19 15Z"/></svg>',
    user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6"/></svg>',
    link:'<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/></svg>',
    mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    bug:'<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="11" rx="5"/><path d="M9 7V5M15 7V5M4 10h3M17 10h3M4 15h3M17 15h3M9 12h6"/></svg>',
    shield:'<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>'
  };

  const ICON_LABELS={
    github:'GitHub',timeline:'Linha do tempo',code:'Código',terminal:'Terminal',
    check:'Validação',database:'Banco',briefcase:'Trabalho',spark:'Destaque',
    user:'Perfil',link:'Link',mail:'Contato',bug:'Bug',shield:'Qualidade'
  };

  const TARGETS={
    sobre:{name:'Sobre',section:'#sobre',title:'.about-v52-head h2'},
    competencias:{name:'Competências',section:'#competencias',title:'.competencies-v59-head h2'},
    projetos:{name:'Projetos',section:'#projetos',title:'.github-title-v61 h2'},
    experiencia:{name:'Trajetória',section:'#experiencia',title:'.experience-head-v66 h2'},
    contato:{name:'Contato',section:'#contato',title:'.contact-panel h2'}
  };

  const LAYOUTS={
    sobre:[['flow','Fluxo'],['grid','Grade'],['minimal','Minimal']],
    competencias:[['grid','Grade'],['list','Lista'],['steps','Etapas']],
    projetos:[['list','Lista'],['grid','Grade'],['minimal','Minimal']],
    experiencia:[['timeline','Linha do tempo'],['stack','Blocos'],['minimal','Minimal']],
    contato:[['default','Padrão']]
  };

  const defaults={
    type:'icon',
    target:'projetos',
    position:'before',
    icon:'github',
    size:30,
    system:true,
    color:'#6ea8ff',
    text:'Destaque',
    width:58,
    thickness:2,
    layout:'list'
  };

  function id(){
    return 'el_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
  }

  function read(){
    try{
      const value=JSON.parse(localStorage.getItem(STORE)||'null');
      if(Array.isArray(value)) return value;
    }catch{}

    /* primeira carga: preserva apenas o GitHub que já existia visualmente */
    return [{
      ...defaults,
      id:id(),
      type:'icon',
      target:'projetos',
      icon:'github',
      size:30,
      position:'before'
    }];
  }

  function clone(value){return JSON.parse(JSON.stringify(value));}

  let saved=read();
  let draft=clone(saved);
  let editingId=null;
  let working={...defaults};

  function persist(){
    try{localStorage.setItem(STORE,JSON.stringify(saved));}catch{}
  }

  function dirty(message){
    window.__portfolioEditorDirtyV146=true;
    if(status) status.textContent=message||'Elementos do quadro alterados. Revise e salve para confirmar.';
  }

  function titleHost(target){
    const config=TARGETS[target];
    const title=$(config?.title||'');
    if(!title) return null;

    let host=title.closest('.section-title-line-v181,.section-title-line-v178,.github-title-v61');
    if(!host){
      host=document.createElement('div');
      host.className='section-title-line-v181';
      host.style.display='flex';
      host.style.alignItems='center';
      host.style.gap='12px';
      title.parentNode.insertBefore(host,title);
      host.appendChild(title);
    }
    return host;
  }

  function elementColor(item){
    return item.system!==false?'var(--system-accent)':(item.color||'#6ea8ff');
  }

  function applyAll(){
    document.body.classList.add('elements-v181-ready');
    $$('[data-generated-element-v181]').forEach(el=>el.remove());

    draft.forEach(item=>{
      const config=TARGETS[item.target];
      const section=$(config?.section||'');
      if(!section) return;

      if(item.type==='layout'){
        section.dataset.sectionLayoutV178=item.layout;
        return;
      }

      const host=titleHost(item.target);
      if(!host) return;

      if(item.type==='icon'){
        const el=document.createElement('span');
        el.className='generated-element-v181 generated-icon-v181';
        el.dataset.generatedElementV181=item.id;
        el.dataset.icon=item.icon;
        el.innerHTML=ICONS[item.icon]||'';
        el.style.setProperty('--element-color',elementColor(item));
        el.style.width=item.size+'px';
        el.style.height=item.size+'px';
        el.style.flexBasis=item.size+'px';

        if(item.position==='after') host.appendChild(el);
        else host.insertBefore(el,host.firstChild);
      }

      if(item.type==='badge'){
        const el=document.createElement('span');
        el.className='generated-element-v181 generated-badge-v181';
        el.dataset.generatedElementV181=item.id;
        el.textContent=item.text||'Destaque';
        el.style.setProperty('--element-color',elementColor(item));

        if(item.position==='before') host.insertBefore(el,host.firstChild);
        else host.appendChild(el);
      }

      if(item.type==='divider'){
        const el=document.createElement('span');
        el.className='generated-element-v181 generated-divider-v181';
        el.dataset.generatedElementV181=item.id;
        el.style.setProperty('--element-color',elementColor(item));
        el.style.width=(item.width||58)+'%';
        el.style.height=(item.thickness||2)+'px';

        const head=host.parentElement;
        head?.appendChild(el);
      }
    });
  }

  const builder=document.createElement('div');
  builder.className='element-builder-v181';
  builder.innerHTML=`
    <div class="element-builder-head-v181">
      <div>
        <small>ELEMENTOS DO QUADRO</small>
        <h3>Biblioteca de elementos</h3>
        <p>Adicione elementos só quando eles ajudarem a compor uma seção ou um bloco.</p>
      </div>
      <button type="button" class="element-add-v181" id="elementAddV181">
        <svg viewBox="0 0 20 20"><path d="M10 4v12M4 10h12"/></svg>
        Adicionar
      </button>
    </div>

    <div class="element-list-v181" id="elementListV181"></div>

    <div class="element-creator-v181" id="elementCreatorV181">
      <div class="element-creator-top-v181">
        <strong id="elementCreatorTitleV181">Novo elemento</strong>
        <button type="button" class="element-creator-close-v181" id="elementCreatorCloseV181" aria-label="Fechar">×</button>
      </div>

      <div class="element-type-tabs-v181">
        <button type="button" data-element-type-v181="icon">Ícone</button>
        <button type="button" data-element-type-v181="badge">Badge</button>
        <button type="button" data-element-type-v181="divider">Divisor</button>
        <button type="button" data-element-type-v181="layout">Layout</button>
      </div>

      <div class="element-preview-v181" id="elementPreviewV181"></div>

      <div class="element-fields-v181">
        <div class="element-field-row-v181">
          <span class="element-field-label-v181">Destino</span>
          <div class="element-field-v181">
            <select id="elementTargetV181">
              ${Object.entries(TARGETS).map(([key,value])=>`<option value="${key}">${value.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="elementDynamicFieldsV181"></div>
      </div>

      <div class="element-actions-v181">
        <button type="button" class="element-remove-v181" id="elementRemoveV181">Remover</button>
        <button type="button" class="element-save-v181" id="elementSaveV181">Adicionar elemento</button>
      </div>
    </div>
  `;

  const oldDesign=$('.section-design-v178');
  if(oldDesign) oldDesign.after(builder);
  else panel.appendChild(builder);

  const list=$('#elementListV181');
  const creator=$('#elementCreatorV181');
  const creatorTitle=$('#elementCreatorTitleV181');
  const target=$('#elementTargetV181');
  const dynamic=$('#elementDynamicFieldsV181');
  const preview=$('#elementPreviewV181');
  const saveButton=$('#elementSaveV181');
  const removeButton=$('#elementRemoveV181');

  function typeIcon(item){
    if(item.type==='icon') return {icon:item.icon,svg:ICONS[item.icon]||'',label:ICON_LABELS[item.icon]||'Ícone'};
    if(item.type==='badge') return {icon:'spark',svg:ICONS.spark,label:'Badge'};
    if(item.type==='divider') return {icon:'code',svg:ICONS.code,label:'Divisor'};
    return {icon:'timeline',svg:ICONS.timeline,label:'Layout'};
  }

  function itemDescription(item){
    const targetName=TARGETS[item.target]?.name||item.target;
    if(item.type==='icon') return `${targetName} · ${ICON_LABELS[item.icon]||item.icon} · ${item.size}px`;
    if(item.type==='badge') return `${targetName} · "${item.text||'Destaque'}"`;
    if(item.type==='divider') return `${targetName} · ${item.width}% · ${item.thickness}px`;
    const label=LAYOUTS[item.target]?.find(([key])=>key===item.layout)?.[1]||item.layout;
    return `${targetName} · ${label}`;
  }

  function renderList(){
    list.innerHTML='';

    if(!draft.length){
      list.innerHTML='<div class="element-list-empty-v181">Nenhum elemento adicional. Use “Adicionar” quando quiser compor uma seção.</div>';
      return;
    }

    draft.forEach(item=>{
      const info=typeIcon(item);
      const button=document.createElement('button');
      button.type='button';
      button.className='element-item-v181'+(editingId===item.id?' is-editing':'');
      button.dataset.elementIdV181=item.id;
      button.innerHTML=`
        <span class="element-item-icon-v181" data-icon="${info.icon}">${info.svg}</span>
        <span class="element-item-copy-v181">
          <strong>${info.label}</strong>
          <span>${itemDescription(item)}</span>
        </span>
        <span class="element-item-chevron-v181">›</span>
      `;
      list.appendChild(button);
    });
  }

  function colorControls(){
    return `
      <div class="element-control-v181">
        <span>Cor</span>
        <div class="element-color-v181">
          <button type="button" class="element-system-color-v181 ${working.system!==false?'is-selected':''}" id="elementSystemColorV181">Sistema</button>
          <input id="elementColorV181" type="color" value="${working.color||'#6ea8ff'}" ${working.system!==false?'disabled':''}>
        </div>
      </div>
    `;
  }

  function positionControl(){
    return `
      <div class="element-control-v181">
        <span>Posição</span>
        <div class="element-segment-v181">
          <button type="button" data-element-position-v181="before" class="${working.position==='before'?'is-selected':''}">Antes</button>
          <button type="button" data-element-position-v181="after" class="${working.position==='after'?'is-selected':''}">Depois</button>
        </div>
      </div>
    `;
  }

  function renderDynamic(){
    dynamic.innerHTML='';

    if(working.type==='icon'){
      dynamic.innerHTML=`
        <div class="element-field-row-v181">
          <span class="element-field-label-v181">Ícone</span>
          <div class="element-icon-library-v181">
            ${Object.entries(ICONS).map(([key,svg])=>`
              <button type="button" class="element-icon-choice-v181 ${working.icon===key?'is-selected':''}" data-icon="${key}" title="${ICON_LABELS[key]||key}">${svg}</button>
            `).join('')}
          </div>
        </div>

        <div class="element-inline-grid-v181">
          <div class="element-control-v181">
            <span>Tamanho</span>
            <div class="element-range-v181">
              <input id="elementSizeV181" type="range" min="16" max="60" step="1" value="${working.size}">
              <output id="elementSizeOutputV181">${working.size}px</output>
            </div>
          </div>
          ${positionControl()}
        </div>
        ${colorControls()}
      `;
    }

    if(working.type==='badge'){
      dynamic.innerHTML=`
        <div class="element-field-row-v181">
          <span class="element-field-label-v181">Texto</span>
          <div class="element-field-v181">
            <input id="elementTextV181" type="text" maxlength="34" value="${String(working.text||'Destaque').replace(/"/g,'&quot;')}">
          </div>
        </div>
        <div class="element-inline-grid-v181">
          ${positionControl()}
          ${colorControls()}
        </div>
      `;
    }

    if(working.type==='divider'){
      dynamic.innerHTML=`
        <div class="element-inline-grid-v181">
          <div class="element-control-v181">
            <span>Largura</span>
            <div class="element-range-v181">
              <input id="elementWidthV181" type="range" min="20" max="100" step="2" value="${working.width}">
              <output id="elementWidthOutputV181">${working.width}%</output>
            </div>
          </div>
          <div class="element-control-v181">
            <span>Espessura</span>
            <div class="element-range-v181">
              <input id="elementThicknessV181" type="range" min="1" max="6" step="1" value="${working.thickness}">
              <output id="elementThicknessOutputV181">${working.thickness}px</output>
            </div>
          </div>
        </div>
        ${colorControls()}
      `;
    }

    if(working.type==='layout'){
      const options=LAYOUTS[working.target]||[['default','Padrão']];
      if(!options.some(([key])=>key===working.layout)) working.layout=options[0][0];

      dynamic.innerHTML=`
        <div class="element-field-row-v181">
          <span class="element-field-label-v181">Formato</span>
          <div class="element-segment-v181" style="grid-template-columns:repeat(${Math.min(options.length,3)},minmax(0,1fr))">
            ${options.map(([key,label])=>`
              <button type="button" data-layout-choice-v181="${key}" class="${working.layout===key?'is-selected':''}">${label}</button>
            `).join('')}
          </div>
        </div>
      `;
    }

    bindDynamic();
    renderPreview();
  }

  function renderPreview(){
    preview.innerHTML='';
    const color=working.system!==false?'var(--system-accent)':working.color;

    if(working.type==='icon'){
      const el=document.createElement('span');
      el.className='element-preview-icon-v181';
      el.dataset.icon=working.icon;
      el.innerHTML=ICONS[working.icon]||'';
      el.style.width=working.size+'px';
      el.style.height=working.size+'px';
      el.style.color=color;
      preview.appendChild(el);
    }

    if(working.type==='badge'){
      const el=document.createElement('span');
      el.className='element-preview-badge-v181';
      el.textContent=working.text||'Destaque';
      el.style.color=color;
      el.style.borderColor=`color-mix(in srgb,${color} 38%,var(--line))`;
      preview.appendChild(el);
    }

    if(working.type==='divider'){
      const el=document.createElement('span');
      el.className='element-preview-divider-v181';
      el.style.width=(working.width||58)+'%';
      el.style.height=(working.thickness||2)+'px';
      el.style.background=color;
      preview.appendChild(el);
    }

    if(working.type==='layout'){
      const el=document.createElement('span');
      el.className='element-preview-layout-v181';
      el.dataset.layout=working.layout;
      preview.appendChild(el);
    }
  }

  function bindDynamic(){
    $$('.element-icon-choice-v181',dynamic).forEach(button=>{
      button.addEventListener('click',()=>{
        working.icon=button.dataset.icon;
        renderDynamic();
      });
    });

    $('#elementSizeV181')?.addEventListener('input',event=>{
      working.size=Number(event.target.value);
      const out=$('#elementSizeOutputV181');
      if(out) out.value=working.size+'px';
      renderPreview();
    });

    $$('[data-element-position-v181]',dynamic).forEach(button=>{
      button.addEventListener('click',()=>{
        working.position=button.dataset.elementPositionV181;
        renderDynamic();
      });
    });

    const system=$('#elementSystemColorV181');
    const color=$('#elementColorV181');

    system?.addEventListener('click',()=>{
      working.system=!working.system;
      renderDynamic();
    });

    color?.addEventListener('input',()=>{
      working.system=false;
      working.color=color.value;
      renderPreview();
    });

    $('#elementTextV181')?.addEventListener('input',event=>{
      working.text=event.target.value;
      renderPreview();
    });

    $('#elementWidthV181')?.addEventListener('input',event=>{
      working.width=Number(event.target.value);
      const out=$('#elementWidthOutputV181');
      if(out) out.value=working.width+'%';
      renderPreview();
    });

    $('#elementThicknessV181')?.addEventListener('input',event=>{
      working.thickness=Number(event.target.value);
      const out=$('#elementThicknessOutputV181');
      if(out) out.value=working.thickness+'px';
      renderPreview();
    });

    $$('[data-layout-choice-v181]',dynamic).forEach(button=>{
      button.addEventListener('click',()=>{
        working.layout=button.dataset.layoutChoiceV181;
        renderDynamic();
      });
    });
  }

  function renderCreator(){
    target.value=working.target;
    creator.classList.toggle('is-editing',Boolean(editingId));
    creatorTitle.textContent=editingId?'Editar elemento':'Novo elemento';
    saveButton.textContent=editingId?'Salvar alterações':'Adicionar elemento';

    $$('[data-element-type-v181]',creator).forEach(button=>{
      button.classList.toggle('is-selected',button.dataset.elementTypeV181===working.type);
      button.disabled=Boolean(editingId);
      button.style.opacity=editingId && button.dataset.elementTypeV181!==working.type ? '.42' : '1';
    });

    renderDynamic();
  }

  function openNew(){
    editingId=null;
    working={...defaults,target:'projetos'};
    creator.classList.add('is-open');
    renderCreator();
    renderList();
  }

  function openEdit(itemId){
    const item=draft.find(entry=>entry.id===itemId);
    if(!item) return;
    editingId=itemId;
    working=clone(item);
    creator.classList.add('is-open');
    renderCreator();
    renderList();
  }

  function closeCreator(){
    editingId=null;
    creator.classList.remove('is-open','is-editing');
    renderList();
  }

  $('#elementAddV181')?.addEventListener('click',openNew);
  $('#elementCreatorCloseV181')?.addEventListener('click',closeCreator);

  list.addEventListener('click',event=>{
    const item=event.target.closest('[data-element-id-v181]');
    if(item) openEdit(item.dataset.elementIdV181);
  });

  $$('[data-element-type-v181]',creator).forEach(button=>{
    button.addEventListener('click',()=>{
      if(editingId) return;
      working.type=button.dataset.elementTypeV181;

      if(working.type==='layout'){
        const options=LAYOUTS[working.target]||[['default','Padrão']];
        working.layout=options[0][0];
      }
      renderCreator();
    });
  });

  target.addEventListener('change',()=>{
    working.target=target.value;
    if(working.type==='layout'){
      const options=LAYOUTS[working.target]||[['default','Padrão']];
      working.layout=options[0][0];
    }
    renderDynamic();
  });

  saveButton.addEventListener('click',()=>{
    if(editingId){
      const index=draft.findIndex(item=>item.id===editingId);
      if(index>=0) draft[index]={...working,id:editingId};
    }else{
      /*
        Um layout por seção: se já existir uma configuração de layout
        para o mesmo destino, substituímos em vez de empilhar.
      */
      if(working.type==='layout'){
        draft=draft.filter(item=>!(item.type==='layout' && item.target===working.target));
      }
      draft.push({...working,id:id()});
    }

    applyAll();
    dirty(editingId?'Elemento atualizado na prévia.':'Elemento adicionado à prévia.');
    closeCreator();
    renderList();
  });

  removeButton.addEventListener('click',()=>{
    if(!editingId) return;
    draft=draft.filter(item=>item.id!==editingId);
    applyAll();
    dirty('Elemento removido da prévia.');
    closeCreator();
    renderList();
  });

  confirmSave?.addEventListener('click',()=>{
    saved=clone(draft);
    persist();
  },true);

  function restoreSaved(){
    draft=clone(saved);
    applyAll();
    closeCreator();
    renderList();
  }

  cancel?.addEventListener('click',()=>setTimeout(restoreSaved,0),true);
  exitConfirm?.addEventListener('click',()=>setTimeout(restoreSaved,0),true);

  applyAll();
  renderList();
})();