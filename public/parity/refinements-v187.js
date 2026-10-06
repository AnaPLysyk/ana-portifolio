/* ===== v187 — side-by-side estável + preview público real ===== */
(() => {
  if(window.__portfolioEditorLayoutV187) return;
  window.__portfolioEditorLayoutV187=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const studio=$('#editorStudio');
  const previewButton=$('#canvasPreviewV156');
  const editButton=$('#canvasEditV156');
  const toolbar=$('#editorCanvasToolbarV156');

  if(!studio || !previewButton || !editButton || !toolbar) return;

  const DEVICE_KEY='ana_portfolio_editor_device_v187';

  function safeGet(){
    try{
      const v=localStorage.getItem(DEVICE_KEY);
      if(['desktop','tablet','mobile'].includes(v)) return v;
    }catch{}
    return 'desktop';
  }

  function safeSet(v){
    try{localStorage.setItem(DEVICE_KEY,v);}catch{}
  }

  let device=safeGet();

  /* seletor de aparelho, sem iframe/reparent/resize observer */
  const switcher=document.createElement('div');
  switcher.className='preview-device-switcher-v187';
  switcher.setAttribute('role','group');
  switcher.setAttribute('aria-label','Visualizar responsividade');

  switcher.innerHTML=`
    <button type="button" data-device-v187="desktop" title="Desktop" aria-label="Prévia desktop">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 21h6M12 17v4"/></svg>
    </button>
    <button type="button" data-device-v187="tablet" title="Tablet" aria-label="Prévia tablet">
      <svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M11 18.5h2"/></svg>
    </button>
    <button type="button" data-device-v187="mobile" title="Celular" aria-label="Prévia celular">
      <svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></svg>
    </button>
    <span class="preview-device-label-v187" id="previewDeviceLabelV187"></span>
  `;

  document.body.appendChild(switcher);

  function applyDevice(next){
    device=['desktop','tablet','mobile'].includes(next)?next:'desktop';

    document.body.classList.remove(
      'editor-device-desktop-v187',
      'editor-device-tablet-v187',
      'editor-device-mobile-v187'
    );
    document.body.classList.add('editor-device-'+device+'-v187');

    $$('[data-device-v187]',switcher).forEach(button=>{
      const active=button.dataset.deviceV187===device;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });

    const label=$('#previewDeviceLabelV187');
    if(label){
      label.textContent=device==='desktop'?'Desktop':device==='tablet'?'768 px':'390 px';
    }

    safeSet(device);

    requestAnimationFrame(()=>{
      window.__portfolioFreeIconsV184?.render?.();
    });
  }

  switcher.addEventListener('click',event=>{
    const button=event.target.closest('[data-device-v187]');
    if(!button) return;
    applyDevice(button.dataset.deviceV187);
  });

  function disableEditableForPreview(){
    $$('[contenteditable="true"]').forEach(el=>{
      if(el.closest('#editorStudio,#aiContextPanel')) return;
      el.dataset.wasEditableV187='1';
      el.removeAttribute('contenteditable');
    });
  }

  function restoreEditableAfterPreview(){
    $$('[data-was-editable-v187="1"]').forEach(el=>{
      el.setAttribute('contenteditable','true');
      delete el.dataset.wasEditableV187;
    });
  }

  function enterPublicPreview(event){
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();

    document.body.classList.add('editor-public-preview-v187','editor-preview-v156');
    document.body.classList.remove(
      'editor-canvas-v156',
      'editor-panel-collapsed-v158',
      'editor-page-text-mode',
      'is-panning-v156'
    );

    studio.hidden=false;
    studio.removeAttribute('hidden');
    studio.style.setProperty('display','none','important');

    disableEditableForPreview();

    document.documentElement.style.setProperty('--canvas-x-v156','0px');
    document.documentElement.style.setProperty('--canvas-y-v156','0px');

    requestAnimationFrame(()=>{
      window.scrollTo({top:window.scrollY,left:0,behavior:'auto'});
    });
  }

  function returnToEditor(event){
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();

    document.body.classList.remove('editor-public-preview-v187','editor-preview-v156');
    document.body.classList.add('editor-canvas-v156');

    studio.hidden=false;
    studio.removeAttribute('hidden');
    studio.style.setProperty('display','flex','important');
    studio.style.setProperty('visibility','visible','important');
    studio.style.setProperty('opacity','1','important');
    studio.style.setProperty('pointer-events','auto','important');

    restoreEditableAfterPreview();
    applyDevice(device);
  }

  /*
    Capture=true: v187 vence o handler legado de v156 sem editar o HTML antigo.
  */
  previewButton.addEventListener('click',enterPublicPreview,true);
  editButton.addEventListener('click',returnToEditor,true);

  /* se sair da edição por salvar/cancelar, limpa estados auxiliares */
  if('MutationObserver' in window){
    new MutationObserver(()=>{
      const open=document.body.classList.contains('editor-studio-open');

      if(!open){
        document.body.classList.remove(
          'editor-public-preview-v187',
          'editor-preview-v156',
          'editor-panel-collapsed-v158'
        );
        restoreEditableAfterPreview();
      }else if(!document.body.classList.contains('editor-public-preview-v187')){
        applyDevice(device);
      }
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  applyDevice(device);

  window.__portfolioEditorLayoutV187={
    enterPreview:enterPublicPreview,
    exitPreview:returnToEditor,
    setDevice:applyDevice,
    getDevice:()=>device
  };
})();