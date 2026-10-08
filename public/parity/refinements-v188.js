/* ===== v188 — seletor leve de aparelho, sem mexer no DOM ===== */
(() => {
  if(window.__portfolioEditorDeviceV188) return;
  window.__portfolioEditorDeviceV188=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const studio=$('#editorStudio');
  if(!studio) return;

  const STORE='ana_portfolio_editor_device_v188';
  let device='desktop';

  try{
    const saved=localStorage.getItem(STORE);
    if(['desktop','tablet','mobile'].includes(saved)) device=saved;
  }catch{}

  const switcher=document.createElement('div');
  switcher.className='preview-device-switcher-v188';
  switcher.setAttribute('role','group');
  switcher.setAttribute('aria-label','Prévia por aparelho');

  switcher.innerHTML=`
    <button type="button" data-device-v188="desktop" title="Desktop" aria-label="Desktop">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 21h6M12 17v4"/></svg>
    </button>
    <button type="button" data-device-v188="tablet" title="Tablet" aria-label="Tablet">
      <svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M11 18.5h2"/></svg>
    </button>
    <button type="button" data-device-v188="mobile" title="Celular" aria-label="Celular">
      <svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></svg>
    </button>
    <span class="preview-device-label-v188" id="previewDeviceLabelV188"></span>
  `;

  document.body.appendChild(switcher);

  function apply(next){
    device=['desktop','tablet','mobile'].includes(next)?next:'desktop';

    document.body.classList.remove(
      'editor-device-desktop-v188',
      'editor-device-tablet-v188',
      'editor-device-mobile-v188'
    );
    document.body.classList.add('editor-device-'+device+'-v188');

    $$('[data-device-v188]',switcher).forEach(button=>{
      const active=button.dataset.deviceV188===device;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
    });

    const label=$('#previewDeviceLabelV188');
    if(label) label.textContent=
      device==='desktop'?'Desktop':
      device==='tablet'?'768 px':'390 px';

    try{localStorage.setItem(STORE,device);}catch{}

    requestAnimationFrame(()=>{
      window.__portfolioFreeIconsV184?.render?.();
    });
  }

  switcher.addEventListener('click',event=>{
    const button=event.target.closest('[data-device-v188]');
    if(!button) return;
    apply(button.dataset.deviceV188);
  });

  /* volta sempre ao dispositivo escolhido quando sai do Visualizar */
  if('MutationObserver' in window){
    new MutationObserver(()=>{
      if(document.body.classList.contains('editor-studio-open') &&
         !document.body.classList.contains('editor-preview-v156')){
        apply(device);
      }
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  apply(device);

  window.__portfolioEditorDeviceV188={
    setDevice:apply,
    getDevice:()=>device
  };
})();