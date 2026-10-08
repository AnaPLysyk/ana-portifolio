/* ===== v195 — ciclo de aparelhos sem modal ===== */
(() => {
  if(window.__portfolioDeviceCycleV195) return;
  window.__portfolioDeviceCycleV195=true;

  const $=(s,r=document)=>r.querySelector(s);

  const oldButton=$('.editor-device-toggle-v192');
  if(!oldButton) return;

  const STORE='ana_portfolio_device_preset_v193';

  const icons={
    desktop:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 21h6M12 17v4"/></svg>',
    laptop:'<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="11" rx="1.5"/><path d="M3 19h18M7 15l-1 4M17 15l1 4"/></svg>',
    tabletLandscape:'<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M18.5 11v2"/></svg>',
    tabletPortrait:'<svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M11 18.5h2"/></svg>',
    phone:'<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></svg>'
  };

  const presets=[
    {id:'desktop-1440',name:'Desktop grande',size:'1440 × 900',icon:icons.desktop},
    {id:'laptop-1280',name:'Notebook',size:'1280 × 800',icon:icons.laptop},
    {id:'tablet-landscape',name:'Tablet horizontal',size:'1024 × 768',icon:icons.tabletLandscape},
    {id:'tablet-portrait',name:'Tablet vertical',size:'768 × 1024',icon:icons.tabletPortrait},
    {id:'mobile-430',name:'Celular grande',size:'430 × 932',icon:icons.phone},
    {id:'mobile-390',name:'Celular padrão',size:'390 × 844',icon:icons.phone},
    {id:'mobile-360',name:'Celular compacto',size:'360 × 800',icon:icons.phone}
  ];

  let current='desktop-1440';
  try{
    const saved=localStorage.getItem(STORE);
    if(presets.some(p=>p.id===saved)) current=saved;
  }catch{}

  /*
    Clona o botão para remover handlers antigos da v192/v193.
    Mantemos a mesma classe/posição da toolbar.
  */
  const button=oldButton.cloneNode(true);
  oldButton.replaceWith(button);

  const toast=document.createElement('div');
  toast.className='device-toast-v195';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);

  let toastTimer=0;

  function getPreset(){
    return presets.find(p=>p.id===current) || presets[0];
  }

  function positionToast(){
    const r=button.getBoundingClientRect();
    const width=Math.min(260,window.innerWidth-24);

    let left=r.left+(r.width/2);
    let top=r.top-10;

    toast.style.maxWidth=width+'px';

    requestAnimationFrame(()=>{
      const tr=toast.getBoundingClientRect();

      left=Math.max(12+(tr.width/2),Math.min(window.innerWidth-12-(tr.width/2),left));

      const above=top-tr.height;
      if(above>=10){
        toast.style.left=left+'px';
        toast.style.top=above+'px';
      }else{
        toast.style.left=left+'px';
        toast.style.top=(r.bottom+9)+'px';
      }

      toast.style.transform='translateX(-50%) translateY(0) scale(1)';
    });
  }

  function showToast(){
    const p=getPreset();

    toast.innerHTML=p.icon+'<strong>'+p.name+'</strong><span>'+p.size+'</span>';
    positionToast();

    toast.classList.remove('is-visible');
    requestAnimationFrame(()=>toast.classList.add('is-visible'));

    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>{
      toast.classList.remove('is-visible');
    },1350);
  }

  function syncLegacyClasses(){
    /* v196: aparelho afeta somente a prévia.
       Não aplicamos mais classes legadas no body que possam alterar o editor. */
    document.body.classList.remove(
      'editor-device-desktop-v192',
      'editor-device-tablet-v192',
      'editor-device-mobile-v192'
    );
  }

  function apply(id,{notify=false}={}){
    if(!presets.some(p=>p.id===id)) id=presets[0].id;
    current=id;

    const p=getPreset();

    document.body.dataset.devicePresetV193=current;
    syncLegacyClasses();

    button.innerHTML=p.icon;
    button.title='Prévia: '+p.name+' · '+p.size+' — clique para trocar';
    button.setAttribute(
      'aria-label',
      'Prévia '+p.name+', '+p.size+'. Clique para próximo aparelho.'
    );

    const frame=$('.device-frame-v193');
    if(frame){
      frame.dataset.deviceName=p.name;
      frame.dataset.deviceSize=p.size;
    }

    try{localStorage.setItem(STORE,current);}catch{}

    requestAnimationFrame(()=>{
      window.__portfolioFreeIconsV184?.render?.();
      window.dispatchEvent(new Event('portfolio-device-change'));
    });

    if(notify) showToast();
  }

  function next(){
    const index=presets.findIndex(p=>p.id===current);
    apply(presets[(index+1)%presets.length].id,{notify:true});
  }

  function previous(){
    const index=presets.findIndex(p=>p.id===current);
    apply(presets[(index-1+presets.length)%presets.length].id,{notify:true});
  }

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    next();
  });

  /*
    Shift + clique volta um aparelho.
    Clique direito continua voltando direto para Desktop.
  */
  button.addEventListener('pointerdown',event=>{
    if(event.button===0 && event.shiftKey){
      event.preventDefault();
      event.stopPropagation();
      previous();
    }
  },true);

  button.addEventListener('contextmenu',event=>{
    event.preventDefault();
    event.stopPropagation();
    apply('desktop-1440',{notify:true});
  });

  addEventListener('resize',()=>{
    if(toast.classList.contains('is-visible')) positionToast();
  },{passive:true});

  apply(current,{notify:false});

  window.__portfolioDeviceCycleV195={
    next,
    previous,
    setPreset:(id)=>apply(id,{notify:true}),
    getPreset:()=>current,
    presets:presets.map(({id,name,size})=>({id,name,size}))
  };
})();