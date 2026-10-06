/* ===== v199 — controlador único de editor/responsividade ===== */
(() => {
  if(window.__portfolioWorkspaceV199) return;
  window.__portfolioWorkspaceV199=true;

  const $=(s,r=document)=>r.querySelector(s);

  const studio=$('#editorStudio');
  const toolbar=$('#editorCanvasToolbarV156');
  const oldHandle=$('#editorResizeHandleV93');
  if(!studio || !toolbar || !oldHandle) return;

  const WIDTH_KEY='ana_portfolio_editor_width_v199';
  const DEVICE_KEY='ana_portfolio_device_v199';

  const icons={
    desktop:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 21h6M12 17v4"/></svg>',
    laptop:'<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="11" rx="1.5"/><path d="M3 19h18"/></svg>',
    tabletL:'<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2"/></svg>',
    tabletP:'<svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2"/></svg>',
    phone:'<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/></svg>'
  };

  const devices=[
    {id:'desktop-1440',name:'Desktop grande',w:1440,h:900,r:10,icon:icons.desktop},
    {id:'laptop-1280',name:'Notebook',w:1280,h:800,r:12,icon:icons.laptop},
    {id:'tablet-1024',name:'Tablet horizontal',w:1024,h:768,r:18,icon:icons.tabletL},
    {id:'tablet-768',name:'Tablet vertical',w:768,h:1024,r:20,icon:icons.tabletP},
    {id:'mobile-430',name:'Celular grande',w:430,h:932,r:28,icon:icons.phone},
    {id:'mobile-390',name:'Celular padrão',w:390,h:844,r:28,icon:icons.phone},
    {id:'mobile-360',name:'Celular compacto',w:360,h:800,r:26,icon:icons.phone}
  ];

  let currentDevice='desktop-1440';
  try{
    const saved=localStorage.getItem(DEVICE_KEY);
    if(devices.some(d=>d.id===saved)) currentDevice=saved;
  }catch{}

  /* remove controles antigos desta família se ainda existirem */
  $('.editor-device-toggle-v192')?.remove();
  $('.device-presets-v193')?.remove();
  $('.device-frame-v193')?.remove();
  $('.device-toast-v195')?.remove();

  /* clone do resize remove listeners legados acumulados */
  const handle=oldHandle.cloneNode(true);
  oldHandle.replaceWith(handle);

  function clampWidth(value){
    const viewport=window.innerWidth||1280;
    const min=300;
    const previewMin=360;
    const max=Math.max(min,Math.min(620,viewport-previewMin-12));
    return Math.max(min,Math.min(max,Number(value)||460));
  }

  function setWidth(value,persist=true){
    const next=clampWidth(value);
    document.documentElement.style.setProperty('--editor-panel-width-v93',next+'px');
    if(persist){try{localStorage.setItem(WIDTH_KEY,String(next))}catch{}}
  }

  let storedWidth=460;
  try{
    const raw=Number(localStorage.getItem(WIDTH_KEY));
    if(raw) storedWidth=raw;
  }catch{}
  setWidth(storedWidth,false);

  let pointerId=null;
  handle.addEventListener('pointerdown',event=>{
    if(matchMedia('(pointer:coarse)').matches) return;
    pointerId=event.pointerId;
    handle.setPointerCapture?.(pointerId);
    document.body.classList.add('editor-resizing-v199');

    const move=e=>{
      if(e.pointerId!==pointerId) return;
      setWidth(window.innerWidth-e.clientX,false);
    };
    const up=e=>{
      if(e.pointerId!==pointerId) return;
      handle.releasePointerCapture?.(pointerId);
      pointerId=null;
      document.body.classList.remove('editor-resizing-v199');
      const current=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--editor-panel-width-v93'))||460;
      setWidth(current,true);
      handle.removeEventListener('pointermove',move);
      handle.removeEventListener('pointerup',up);
      handle.removeEventListener('pointercancel',up);
    };

    handle.addEventListener('pointermove',move);
    handle.addEventListener('pointerup',up);
    handle.addEventListener('pointercancel',up);
    event.preventDefault();
  });

  handle.addEventListener('dblclick',()=>setWidth(460,true));

  /* device control */
  const button=document.createElement('button');
  button.type='button';
  button.className='editor-device-toggle-v199 edit-only-v156';
  button.setAttribute('aria-label','Trocar aparelho da prévia');

  const previewBtn=$('#canvasPreviewV156');
  if(previewBtn) toolbar.insertBefore(button,previewBtn);
  else toolbar.appendChild(button);

  const frame=document.createElement('div');
  frame.className='device-frame-v199';
  frame.setAttribute('aria-hidden','true');
  document.body.appendChild(frame);

  const toast=document.createElement('div');
  toast.className='device-toast-v199';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);

  let toastTimer=0;

  function device(){
    return devices.find(d=>d.id===currentDevice)||devices[0];
  }

  function applyDevice(id,notify=false){
    if(!devices.some(d=>d.id===id)) id=devices[0].id;
    currentDevice=id;
    const d=device();

    document.documentElement.style.setProperty('--preview-device-width-v199',d.w+'px');
    document.documentElement.style.setProperty('--preview-device-height-v199',d.h+'px');
    document.documentElement.style.setProperty('--preview-device-radius-v199',d.r+'px');

    button.innerHTML=d.icon;
    button.title=d.name+' · '+d.w+' × '+d.h;
    button.setAttribute('aria-label','Prévia '+d.name+', '+d.w+' por '+d.h+'. Clique para próximo aparelho.');

    try{localStorage.setItem(DEVICE_KEY,id)}catch{}

    requestAnimationFrame(()=>{
      window.__portfolioFreeIconsV184?.render?.();
    });

    if(notify){
      toast.innerHTML='<strong>'+d.name+'</strong><span>'+d.w+' × '+d.h+'</span>';
      const r=button.getBoundingClientRect();
      toast.style.left=Math.max(12,Math.min(innerWidth-220,r.left-70))+'px';
      toast.style.bottom=Math.max(14,innerHeight-r.top+8)+'px';
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),1200);
    }
  }

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    const i=devices.findIndex(d=>d.id===currentDevice);
    applyDevice(devices[(i+1)%devices.length].id,true);
  });

  button.addEventListener('contextmenu',event=>{
    event.preventDefault();
    applyDevice('desktop-1440',true);
  });

  applyDevice(currentDevice,false);

  /* zoom/resize: só re-clampa painel; CSS/container query faz o resto */
  addEventListener('resize',()=>{
    const current=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--editor-panel-width-v93'))||460;
    setWidth(current,false);
  },{passive:true});

  window.__portfolioWorkspaceV199={
    setWidth,
    setDevice:(id)=>applyDevice(id,true),
    getDevice:()=>currentDevice
  };
})();