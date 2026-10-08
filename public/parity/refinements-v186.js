/* ===== v186 — workspace de preview + troca de aparelho ===== */
(() => {
  if(window.__portfolioPreviewWorkspaceV186) return;
  window.__portfolioPreviewWorkspaceV186=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const studio=$('#editorStudio');
  const header=$('body > header.topbar');
  const main=$('body > main');
  const footer=$('body > footer#portfolioFooter');

  if(!studio || !header || !main || !footer) return;

  const STORE='ana_portfolio_preview_device_v186';

  function safeGet(){
    try{
      const value=localStorage.getItem(STORE);
      if(['desktop','tablet','mobile'].includes(value)) return value;
    }catch{}
    return 'desktop';
  }

  function safeSet(value){
    try{localStorage.setItem(STORE,value);}catch{}
  }

  /* cria uma viewport própria sem mudar o HTML final quando o editor fecha */
  const workspace=document.createElement('div');
  workspace.className='portfolio-preview-workspace-v186';

  const frame=document.createElement('div');
  frame.className='portfolio-preview-frame-v186';

  header.parentNode.insertBefore(workspace,header);
  workspace.appendChild(frame);
  frame.appendChild(header);
  frame.appendChild(main);
  frame.appendChild(footer);

  /* seletor visual de dispositivo */
  const switcher=document.createElement('div');
  switcher.className='preview-device-switcher-v186';
  switcher.setAttribute('role','group');
  switcher.setAttribute('aria-label','Tamanho da prévia');

  switcher.innerHTML=`
    <button type="button" data-preview-device-v186="desktop" title="Desktop" aria-label="Prévia desktop">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 21h6M12 17v4"/></svg>
    </button>
    <button type="button" data-preview-device-v186="tablet" title="Tablet" aria-label="Prévia tablet">
      <svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M11 18.5h2"/></svg>
    </button>
    <button type="button" data-preview-device-v186="mobile" title="Mobile" aria-label="Prévia mobile">
      <svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></svg>
    </button>
    <span class="preview-device-size-v186" id="previewDeviceSizeV186"></span>
  `;

  document.body.appendChild(switcher);

  let device=safeGet();

  function sizeLabel(){
    if(device==='tablet') return '768 px';
    if(device==='mobile') return '390 px';
    return 'Auto';
  }

  function applyDevice(next,{scrollTop=false}={}){
    device=['desktop','tablet','mobile'].includes(next)?next:'desktop';

    document.body.classList.remove(
      'preview-device-desktop-v186',
      'preview-device-tablet-v186',
      'preview-device-mobile-v186'
    );
    document.body.classList.add('preview-device-'+device+'-v186');

    $$('[data-preview-device-v186]',switcher).forEach(button=>{
      const active=button.dataset.previewDeviceV186===device;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });

    const label=$('#previewDeviceSizeV186');
    if(label) label.textContent=sizeLabel();

    safeSet(device);

    if(scrollTop && document.body.classList.contains('editor-studio-open')){
      workspace.scrollTo({top:0,behavior:'smooth'});
    }

    /* componentes que calculam posição por boundingClientRect precisam recalcular */
    requestAnimationFrame(()=>{
      window.dispatchEvent(new Event('resize'));
      window.__portfolioFreeIconsV184?.render?.();
    });
  }

  switcher.addEventListener('click',event=>{
    const button=event.target.closest('[data-preview-device-v186]');
    if(!button) return;
    applyDevice(button.dataset.previewDeviceV186,{scrollTop:true});
  });

  /* atalhos: 1 desktop, 2 tablet, 3 mobile quando o editor está aberto */
  document.addEventListener('keydown',event=>{
    if(!document.body.classList.contains('editor-studio-open')) return;
    if(event.ctrlKey || event.metaKey || event.altKey) return;
    if(event.target.closest('input,textarea,select,[contenteditable="true"]')) return;

    if(event.key==='1') applyDevice('desktop');
    if(event.key==='2') applyDevice('tablet');
    if(event.key==='3') applyDevice('mobile');
  });

  function syncEditorState(){
    const open=document.body.classList.contains('editor-studio-open');

    if(open){
      applyDevice(device);
      frame.setAttribute('aria-label','Prévia do portfólio em '+device);
    }else{
      frame.removeAttribute('aria-label');
    }
  }

  if('MutationObserver' in window){
    new MutationObserver(syncEditorState)
      .observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  applyDevice(device);
  syncEditorState();

  window.__portfolioPreviewV186={
    setDevice:applyDevice,
    getDevice:()=>device,
    frame,
    workspace
  };
})();