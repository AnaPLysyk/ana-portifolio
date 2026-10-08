/* ===== v178 — aparência, layout e elementos do quadro ===== */
(() => {
  if (window.__portfolioAppearanceV178) return;
  window.__portfolioAppearanceV178 = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const panel=$('[data-editor-panel="layout"]');
  if(!panel) return;

  const status=$('#editorStatusV82');
  const confirmSave=$('#editorConfirmSaveV146');
  const cancel=$('#editorRelockV82');
  const exitConfirm=$('#editorExitConfirmButtonV155');

  const STORE='ana_portfolio_appearance_v178';
  const ICON_STORE='ana_portfolio_section_icons_v178';
  const LAYOUT_STORE='ana_portfolio_section_layouts_v178';

  const defaultAppearance={
    accent:'#6ea8ff',
    intensity:72,
    spacing:76
  };

  function safeRead(key,fallback){
    try{
      return {...fallback,...JSON.parse(localStorage.getItem(key)||'{}')};
    }catch{
      return {...fallback};
    }
  }
  function safeWrite(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));}catch{}
  }
  function dirty(message='Aparência alterada. Revise e salve para confirmar.'){
    window.__portfolioEditorDirtyV146=true;
    if(status) status.textContent=message;
  }
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function hexToRgb(hex){
    const clean=String(hex||'').replace('#','').trim();
    const full=clean.length===3?clean.split('').map(c=>c+c).join(''):clean.padEnd(6,'0').slice(0,6);
    const n=parseInt(full,16);
    return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
  }
  function rgbToHex({r,g,b}){
    const part=n=>clamp(Math.round(n),0,255).toString(16).padStart(2,'0');
    return '#'+part(r)+part(g)+part(b);
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

  let savedAppearance=safeRead(STORE,defaultAppearance);
  let draftAppearance={...savedAppearance};

  /* ───── FORMATO DA PÁGINA ───── */
  const firstPreset=$('[data-layout-preset]');
  const presetSection=firstPreset?.closest('.editor-studio-section');

  if(presetSection){
    presetSection.classList.add('appearance-layout-v178');
    const title=presetSection.querySelector('h3');
    const small=presetSection.querySelector('.editor-section-title-v85 small');
    if(small) small.textContent='ESTRUTURA';
    if(title) title.textContent='Formato da página';

    const definitions={
      default:{
        format:'balanced',
        name:'Equilibrado',
        desc:'Fluxo natural e largura intermediária.'
      },
      editorial:{
        format:'editorial',
        name:'Editorial',
        desc:'Leitura mais estreita e títulos maiores.'
      },
      compact:{
        format:'panoramic',
        name:'Panorâmico',
        desc:'Mais largura para conteúdo técnico.'
      }
    };

    $$('[data-layout-preset]',presetSection).forEach(button=>{
      const def=definitions[button.dataset.layoutPreset]||definitions.default;
      button.innerHTML=`
        <span class="page-format-preview-v178" data-format="${def.format}" aria-hidden="true"></span>
        <span class="format-copy-v178">
          <strong>${def.name}</strong>
          <small>${def.desc}</small>
        </span>
      `;
    });
  }

  /* ───── COR DO SISTEMA ───── */
  const legacyColor=$('.editor-color-row-v85');
  const colorSection=legacyColor?.closest('.editor-studio-section');

  const PRESETS=[
    ['#6ea8ff','Azul'],
    ['#9b8cff','Violeta'],
    ['#ff667f','Coral'],
    ['#6bd7bd','Verde']
  ];

  let colorUI=null;
  let customColor=null;
  let intensityInput=null;
  let intensityValue=null;
  let hexValue=null;

  if(colorSection&&legacyColor){
    legacyColor.classList.add('legacy-color-v178');
    const heading=colorSection.querySelector('h3');
    const intro=colorSection.querySelector('p');
    if(heading) heading.textContent='Cor do sistema';
    if(intro) intro.textContent='Uma cor principal gera os tons de destaque, estados e detalhes da interface.';

    colorUI=document.createElement('div');
    colorUI.className='system-color-v178';
    colorUI.innerHTML=`
      <div class="system-color-main-v178">
        <div class="system-color-swatches-v178">
          ${PRESETS.map(([hex,name])=>`
            <button type="button" class="system-swatch-v178"
              data-system-color-v178="${hex}"
              style="--swatch:${hex}"
              title="${name}"
              aria-label="${name}"></button>
          `).join('')}
        </div>
        <label class="system-custom-color-v178" title="Escolher outra cor">
          <input id="systemCustomColorV178" type="color" value="${draftAppearance.accent}">
        </label>
      </div>

      <div class="system-color-preview-v178">
        <div class="system-color-bubbles-v178" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <span class="system-color-hex-v178" id="systemColorHexV178"></span>
      </div>

      <div>
        <div class="design-label-v178" style="margin-bottom:6px">Intensidade dos destaques</div>
        <div class="appearance-range-v178">
          <span class="range-icon-v178">○</span>
          <input id="systemColorIntensityV178" type="range" min="35" max="100" step="1">
          <span class="range-icon-v178">●</span>
          <span class="range-value-v178" id="systemColorIntensityValueV178"></span>
        </div>
      </div>
    `;
    legacyColor.after(colorUI);

    customColor=$('#systemCustomColorV178');
    intensityInput=$('#systemColorIntensityV178');
    intensityValue=$('#systemColorIntensityValueV178');
    hexValue=$('#systemColorHexV178');
  }

  function callLegacyAccent(color){
    const exact=$$('[data-accent]').find(btn=>
      String(btn.dataset.accent||'').toLowerCase()===color.toLowerCase()
    );
    if(exact){
      exact.click();
      return;
    }
    const picker=$('#editorAccentV82');
    if(picker){
      picker.value=color;
      picker.dispatchEvent(new Event('input',{bubbles:true}));
    }
  }

  function applyAccent(color,intensity,{legacy=false,mark=false}={}){
    const amount=clamp(Number(intensity||72),35,100);
    const strength=(amount-35)/65;
    const root=document.documentElement;

    const soft=.055+strength*.105;
    const soft2=.11+strength*.15;
    const glow=.12+strength*.22;
    const mid=mix(color,'#ffffff',.30);
    const deep=mix(color,'#10233f',.44-strength*.08);

    root.style.setProperty('--editor-accent',color);
    root.style.setProperty('--accent',color);
    root.style.setProperty('--about-accent',color);
    root.style.setProperty('--system-accent',color);
    root.style.setProperty('--system-accent-soft',rgba(color,soft));
    root.style.setProperty('--system-accent-soft-2',rgba(color,soft2));
    root.style.setProperty('--system-accent-glow',rgba(color,glow));
    root.style.setProperty('--system-accent-mid',mid);
    root.style.setProperty('--system-accent-deep',deep);

    draftAppearance.accent=color;
    draftAppearance.intensity=amount;

    if(customColor) customColor.value=color;
    if(intensityInput) intensityInput.value=String(amount);
    if(intensityValue) intensityValue.textContent=amount+'%';
    if(hexValue) hexValue.textContent=color.toUpperCase();

    $$('.system-swatch-v178').forEach(btn=>{
      btn.classList.toggle(
        'is-selected',
        String(btn.dataset.systemColorV178||'').toLowerCase()===color.toLowerCase()
      );
    });

    if(legacy) callLegacyAccent(color);
    if(mark) dirty('Cor do sistema atualizada na prévia.');
  }

  $$('.system-swatch-v178').forEach(button=>{
    button.addEventListener('click',()=>{
      applyAccent(button.dataset.systemColorV178,draftAppearance.intensity,{legacy:true,mark:true});
    });
  });
  customColor?.addEventListener('input',()=>{
    applyAccent(customColor.value,draftAppearance.intensity,{legacy:true,mark:true});
  });
  intensityInput?.addEventListener('input',()=>{
    applyAccent(draftAppearance.accent,Number(intensityInput.value),{mark:true});
  });

  /* ───── RESPIRO CONTÍNUO ───── */
  const densityButton=$('[data-density]');
  const densitySection=densityButton?.closest('.editor-studio-section');
  let spacingInput=null;
  let spacingValue=null;

  if(densitySection){
    densitySection.classList.add('spacing-control-v178');
    const old=densitySection.querySelector('.editor-segmented');
    old?.classList.add('legacy-density-v178');

    const small=densitySection.querySelector(':scope>small');
    const heading=densitySection.querySelector('h3');
    if(small) small.textContent='RITMO';
    if(heading) heading.textContent='Respiro da página';

    const control=document.createElement('div');
    control.innerHTML=`
      <div class="design-label-v178" style="margin-bottom:6px">Ajuste contínuo entre seções</div>
      <div class="appearance-range-v178">
        <span class="range-icon-v178" title="Menos espaço">↕</span>
        <input id="pageSpacingV178" type="range" min="44" max="112" step="2">
        <span class="range-icon-v178" title="Mais espaço">↕</span>
        <span class="range-value-v178" id="pageSpacingValueV178"></span>
      </div>
    `;
    densitySection.appendChild(control);

    spacingInput=$('#pageSpacingV178');
    spacingValue=$('#pageSpacingValueV178');
  }

  function applySpacing(value,{mark=false}={}){
    const px=clamp(Number(value||76),44,112);
    draftAppearance.spacing=px;
    document.body.classList.add('portfolio-spacing-v178');
    document.body.classList.remove('portfolio-density-compact');
    document.documentElement.style.setProperty('--section-space-v178',px+'px');

    if(spacingInput) spacingInput.value=String(px);
    if(spacingValue) spacingValue.textContent=px+'px';
    if(mark) dirty('Respiro da página ajustado na prévia.');
  }
  spacingInput?.addEventListener('input',()=>applySpacing(spacingInput.value,{mark:true}));

  /* ───── RODAPÉ MODERNO ───── */
  const footerSection=$('.editor-footer-controls-v94');
  if(footerSection){
    footerSection.classList.add('footer-modern-v178');
    const footerIntro=footerSection.querySelector('p');
    if(footerIntro){
      footerIntro.textContent='Posição, forma e cor da assinatura, sem ocupar espaço desnecessário.';
    }

    const alignIcons={
      left:'<svg class="footer-control-icon-v178" viewBox="0 0 20 20"><path d="M3 5h9M3 10h14M3 15h7"/></svg>',
      center:'<svg class="footer-control-icon-v178" viewBox="0 0 20 20"><path d="M5 5h10M3 10h14M6 15h8"/></svg>',
      right:'<svg class="footer-control-icon-v178" viewBox="0 0 20 20"><path d="M8 5h9M3 10h14M10 15h7"/></svg>'
    };
    const styleIcons={
      line:'<svg class="footer-control-icon-v178" viewBox="0 0 20 20"><path d="M3 10h14"/></svg><span>Linha</span>',
      pill:'<svg class="footer-control-icon-v178" viewBox="0 0 20 20"><rect x="3" y="6" width="14" height="8" rx="4"/></svg><span>Cápsula</span>',
      card:'<svg class="footer-control-icon-v178" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="2"/><path d="M6 8h8M6 12h5"/></svg><span>Bloco</span>'
    };
    const tones={
      muted:['#77879d','Neutra'],
      accent:['var(--system-accent)','Sistema'],
      coral:['#ff667f','Coral'],
      green:['#6bd7bd','Verde']
    };

    $$('[data-footer-align]',footerSection).forEach(btn=>{
      const key=btn.dataset.footerAlign;
      const label=btn.textContent.trim();
      btn.title=label;
      btn.setAttribute('aria-label',label);
      btn.innerHTML=alignIcons[key]||label;
    });
    $$('[data-footer-style]',footerSection).forEach(btn=>{
      const key=btn.dataset.footerStyle;
      btn.innerHTML=styleIcons[key]||btn.textContent;
    });
    $$('[data-footer-tone]',footerSection).forEach(btn=>{
      const [color,label]=tones[btn.dataset.footerTone]||tones.muted;
      btn.innerHTML=`<span class="footer-tone-dot-v178" style="--tone-color:${color}"></span><span>${label}</span>`;
    });
  }

  /* ───── LAYOUTS DE SEÇÃO + ÍCONES ───── */
  const ICONS={
    none:'',
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
    mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>'
  };

  const TARGETS={
    sobre:{
      name:'Sobre',
      section:'#sobre',
      title:'.about-v52-head h2',
      defaults:{icon:'none',size:28,position:'before',system:true,color:'#6ea8ff'},
      layouts:[
        ['flow','Fluxo'],
        ['grid','Grade'],
        ['minimal','Minimal']
      ],
      defaultLayout:'flow'
    },
    competencias:{
      name:'Competências',
      section:'#competencias',
      title:'.competencies-v59-head h2',
      defaults:{icon:'check',size:28,position:'before',system:true,color:'#6ea8ff'},
      layouts:[
        ['grid','Grade'],
        ['list','Lista'],
        ['steps','Etapas']
      ],
      defaultLayout:'grid'
    },
    projetos:{
      name:'Projetos',
      section:'#projetos',
      title:'.github-title-v61 h2',
      defaults:{icon:'github',size:34,position:'before',system:true,color:'#6ea8ff'},
      layouts:[
        ['list','Lista'],
        ['grid','Grade'],
        ['minimal','Minimal']
      ],
      defaultLayout:'list'
    },
    experiencia:{
      name:'Trajetória',
      section:'#experiencia',
      title:'.experience-head-v66 h2',
      defaults:{icon:'timeline',size:30,position:'before',system:true,color:'#6ea8ff'},
      layouts:[
        ['timeline','Linha do tempo'],
        ['stack','Blocos'],
        ['minimal','Minimal']
      ],
      defaultLayout:'timeline'
    },
    contato:{
      name:'Contato',
      section:'#contato',
      title:'.contact-panel h2',
      defaults:{icon:'mail',size:28,position:'before',system:true,color:'#6ea8ff'},
      layouts:[],
      defaultLayout:'default'
    }
  };

  function iconDefaults(){
    const out={};
    Object.entries(TARGETS).forEach(([key,value])=>out[key]={...value.defaults});
    return out;
  }
  function layoutDefaults(){
    const out={};
    Object.entries(TARGETS).forEach(([key,value])=>out[key]=value.defaultLayout);
    return out;
  }

  let savedIcons=safeRead(ICON_STORE,iconDefaults());
  let draftIcons=JSON.parse(JSON.stringify(savedIcons));
  let savedLayouts=safeRead(LAYOUT_STORE,layoutDefaults());
  let draftLayouts={...savedLayouts};

  function ensureTitleHost(key){
    const config=TARGETS[key];
    const title=$(config.title);
    if(!title) return null;

    if(key==='projetos'){
      const existing=title.closest('.github-title-v61');
      existing?.classList.add('section-title-line-v178');
      return existing;
    }

    let host=title.closest('.section-title-line-v178');
    if(host) return host;

    host=document.createElement('div');
    host.className='section-title-line-v178';
    title.parentNode.insertBefore(host,title);
    host.appendChild(title);
    return host;
  }

  function applySectionIcon(key,settings){
    const host=ensureTitleHost(key);
    if(!host) return;

    host.classList.toggle('icon-after-v178',settings.position==='after');

    let icon=host.querySelector(':scope > .section-icon-v178');
    if(!icon){
      icon=document.createElement('span');
      icon.className='section-icon-v178';
      host.insertBefore(icon,host.firstChild);
    }

    icon.dataset.icon=settings.icon;
    icon.innerHTML=ICONS[settings.icon]||'';
    icon.hidden=settings.icon==='none';
    icon.style.width=settings.size+'px';
    icon.style.height=settings.size+'px';
    icon.style.color=settings.system?'var(--system-accent)':settings.color;
    icon.style.flexBasis=settings.size+'px';

    const svg=icon.querySelector('svg');
    if(svg){
      svg.style.width=settings.size+'px';
      svg.style.height=settings.size+'px';
    }

    if(settings.position==='after') host.appendChild(icon);
    else host.insertBefore(icon,host.firstChild);
  }

  function applySectionLayout(key,layout){
    const section=$(TARGETS[key]?.section);
    if(!section) return;
    section.dataset.sectionLayoutV178=layout;
  }

  Object.entries(draftIcons).forEach(([key,settings])=>applySectionIcon(key,settings));
  Object.entries(draftLayouts).forEach(([key,layout])=>applySectionLayout(key,layout));

  const designSection=document.createElement('div');
  designSection.className='editor-studio-section section-design-v178';
  designSection.innerHTML=`
    <div class="editor-section-title-v85">
      <div>
        <small>ELEMENTOS DO QUADRO</small>
        <h3>Layouts e ícones das seções</h3>
      </div>
    </div>
    <p>Escolho a composição de cada seção e adiciono um ícone quando fizer sentido.</p>

    <div class="design-row-v178">
      <span class="design-label-v178">Seção</span>
      <select class="design-select-v178" id="sectionDesignTargetV178">
        ${Object.entries(TARGETS).map(([key,value])=>`<option value="${key}">${value.name}</option>`).join('')}
      </select>
    </div>

    <div class="design-row-v178">
      <span class="design-label-v178">Layout</span>
      <div class="layout-options-v178" id="sectionLayoutOptionsV178"></div>
    </div>

    <div class="design-row-v178">
      <span class="design-label-v178">Ícone</span>
      <div class="icon-options-v178" id="sectionIconOptionsV178">
        ${Object.entries(ICONS).map(([key,svg])=>`
          <button type="button" class="icon-option-v178" data-icon="${key}" title="${key==='none'?'Sem ícone':key}">
            ${svg||'<span style="font-size:.72rem">×</span>'}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="icon-detail-grid-v178">
      <div>
        <div class="design-label-v178" style="margin-bottom:6px">Tamanho</div>
        <div class="appearance-range-v178">
          <span class="range-icon-v178">A</span>
          <input id="sectionIconSizeV178" type="range" min="18" max="54" step="1">
          <span class="range-icon-v178" style="font-size:.92rem">A</span>
          <span class="range-value-v178" id="sectionIconSizeValueV178"></span>
        </div>
      </div>

      <div>
        <div class="design-label-v178" style="margin-bottom:6px">Posição</div>
        <div class="layout-options-v178">
          <button type="button" class="layout-option-v178" data-icon-position-v178="before">Antes</button>
          <button type="button" class="layout-option-v178" data-icon-position-v178="after">Depois</button>
        </div>
      </div>
    </div>

    <div class="icon-color-v178">
      <label>
        <input id="sectionIconUseSystemV178" type="checkbox" checked>
        usar cor do sistema
      </label>
      <input id="sectionIconColorV178" type="color" value="#6ea8ff" title="Cor do ícone">
    </div>
  `;

  footerSection?.after(designSection);

  const targetSelect=$('#sectionDesignTargetV178');
  const layoutOptions=$('#sectionLayoutOptionsV178');
  const iconOptions=$('#sectionIconOptionsV178');
  const iconSize=$('#sectionIconSizeV178');
  const iconSizeValue=$('#sectionIconSizeValueV178');
  const iconSystem=$('#sectionIconUseSystemV178');
  const iconColor=$('#sectionIconColorV178');

  function currentTarget(){return targetSelect?.value||'projetos';}

  function renderDesignControls(){
    const key=currentTarget();
    const config=TARGETS[key];
    const settings=draftIcons[key]||{...config.defaults};
    const layout=draftLayouts[key]||config.defaultLayout;

    if(layoutOptions){
      layoutOptions.innerHTML=config.layouts.length
        ? config.layouts.map(([value,label])=>`
            <button type="button" class="layout-option-v178 ${value===layout?'is-selected':''}" data-section-layout-option-v178="${value}">${label}</button>
          `).join('')
        : '<span class="design-label-v178">Layout atual da seção</span>';
    }

    $$('.icon-option-v178',iconOptions).forEach(btn=>{
      btn.classList.toggle('is-selected',btn.dataset.icon===settings.icon);
    });

    if(iconSize) iconSize.value=String(settings.size);
    if(iconSizeValue) iconSizeValue.textContent=settings.size+'px';

    $$('[data-icon-position-v178]').forEach(btn=>{
      btn.classList.toggle('is-selected',btn.dataset.iconPositionV178===settings.position);
    });

    if(iconSystem) iconSystem.checked=settings.system!==false;
    if(iconColor) iconColor.value=settings.color||draftAppearance.accent;
  }

  targetSelect?.addEventListener('change',renderDesignControls);

  layoutOptions?.addEventListener('click',event=>{
    const button=event.target.closest('[data-section-layout-option-v178]');
    if(!button) return;
    const key=currentTarget();
    draftLayouts[key]=button.dataset.sectionLayoutOptionV178;
    applySectionLayout(key,draftLayouts[key]);
    renderDesignControls();
    dirty('Layout da seção atualizado na prévia.');
  });

  iconOptions?.addEventListener('click',event=>{
    const button=event.target.closest('[data-icon]');
    if(!button) return;
    const key=currentTarget();
    draftIcons[key]={...(draftIcons[key]||TARGETS[key].defaults),icon:button.dataset.icon};
    applySectionIcon(key,draftIcons[key]);
    renderDesignControls();
    dirty('Ícone da seção atualizado na prévia.');
  });

  iconSize?.addEventListener('input',()=>{
    const key=currentTarget();
    draftIcons[key]={...(draftIcons[key]||TARGETS[key].defaults),size:Number(iconSize.value)};
    applySectionIcon(key,draftIcons[key]);
    if(iconSizeValue) iconSizeValue.textContent=iconSize.value+'px';
    dirty('Tamanho do ícone atualizado na prévia.');
  });

  $$('[data-icon-position-v178]').forEach(button=>{
    button.addEventListener('click',()=>{
      const key=currentTarget();
      draftIcons[key]={...(draftIcons[key]||TARGETS[key].defaults),position:button.dataset.iconPositionV178};
      applySectionIcon(key,draftIcons[key]);
      renderDesignControls();
      dirty('Posição do ícone atualizada na prévia.');
    });
  });

  iconSystem?.addEventListener('change',()=>{
    const key=currentTarget();
    draftIcons[key]={...(draftIcons[key]||TARGETS[key].defaults),system:iconSystem.checked};
    applySectionIcon(key,draftIcons[key]);
    dirty('Cor do ícone atualizada na prévia.');
  });

  iconColor?.addEventListener('input',()=>{
    const key=currentTarget();
    draftIcons[key]={...(draftIcons[key]||TARGETS[key].defaults),color:iconColor.value,system:false};
    if(iconSystem) iconSystem.checked=false;
    applySectionIcon(key,draftIcons[key]);
    dirty('Cor do ícone atualizada na prévia.');
  });

  renderDesignControls();

  /* ───── transação salvar/cancelar ───── */
  function applyAllSaved(){
    draftAppearance={...savedAppearance};
    applyAccent(draftAppearance.accent,draftAppearance.intensity);
    applySpacing(draftAppearance.spacing);

    draftIcons=JSON.parse(JSON.stringify(savedIcons));
    Object.entries(draftIcons).forEach(([key,settings])=>applySectionIcon(key,settings));

    draftLayouts={...savedLayouts};
    Object.entries(draftLayouts).forEach(([key,layout])=>applySectionLayout(key,layout));

    renderDesignControls();
  }

  confirmSave?.addEventListener('click',()=>{
    savedAppearance={...draftAppearance};
    savedIcons=JSON.parse(JSON.stringify(draftIcons));
    savedLayouts={...draftLayouts};

    safeWrite(STORE,savedAppearance);
    safeWrite(ICON_STORE,savedIcons);
    safeWrite(LAYOUT_STORE,savedLayouts);
  },true);

  [cancel,exitConfirm].forEach(button=>{
    button?.addEventListener('click',()=>setTimeout(applyAllSaved,0),true);
  });

  /* inicialização */
  applyAccent(draftAppearance.accent,draftAppearance.intensity);
  applySpacing(draftAppearance.spacing);
})();