/* ===== v192 — botão único Desktop / Tablet / Celular ===== */
(() => {
  if(window.__portfolioDeviceToggleV192) return;
  window.__portfolioDeviceToggleV192=true;

  const $=(s,r=document)=>r.querySelector(s);

  const toolbar=$('#editorCanvasToolbarV156');
  if(!toolbar) return;

  const STORE='ana_portfolio_editor_device_v192';

  const devices=['desktop','tablet','mobile'];
  let device='desktop';

  try{
    const saved=localStorage.getItem(STORE);
    if(devices.includes(saved)) device=saved;
  }catch{}

  const icons={
    desktop:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 21h6M12 17v4"/></svg>',
    tablet:'<svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M11 18.5h2"/></svg>',
    mobile:'<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></svg>'
  };

  const labels={
    desktop:'Desktop',
    tablet:'Tablet · 768 px',
    mobile:'Celular · 390 px'
  };

  const button=document.createElement('button');
  button.type='button';
  button.className='editor-device-toggle-v192 edit-only-v156';
  button.setAttribute('aria-label','Trocar aparelho da prévia');

  function apply(next){
    device=devices.includes(next)?next:'desktop';

    document.body.classList.remove(
      'editor-device-desktop-v192',
      'editor-device-tablet-v192',
      'editor-device-mobile-v192'
    );

    document.body.classList.add('editor-device-'+device+'-v192');

    button.innerHTML=icons[device];
    button.dataset.deviceLabel=labels[device];
    button.title='Prévia: '+labels[device]+' — clique para trocar';
    button.setAttribute('aria-label','Prévia '+labels[device]+'. Clique para trocar de aparelho.');

    try{localStorage.setItem(STORE,device);}catch{}

    requestAnimationFrame(()=>{
      window.__portfolioFreeIconsV184?.render?.();
    });
  }

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();

    const index=devices.indexOf(device);
    apply(devices[(index+1)%devices.length]);
  });

  /* clique direito volta direto para Desktop */
  button.addEventListener('contextmenu',event=>{
    event.preventDefault();
    event.stopPropagation();
    apply('desktop');
  });

  const previewButton=$('#canvasPreviewV156');
  if(previewButton){
    toolbar.insertBefore(button,previewButton);
  }else{
    toolbar.appendChild(button);
  }

  apply(device);

  window.__portfolioDeviceToggleV192={
    setDevice:apply,
    getDevice:()=>device
  };
})();