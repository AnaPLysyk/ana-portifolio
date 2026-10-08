/* ===== v193 — menu de presets reais de dispositivo ===== */
(() => {
  if(window.__portfolioDevicePresetsV193) return;
  window.__portfolioDevicePresetsV193=true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const oldButton=$('.editor-device-toggle-v192');
  if(!oldButton) return;

  const STORE='ana_portfolio_device_preset_v193';

  const iconDesktop='<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.8"/><path d="M9 21h6M12 17v4"/></svg>';
  const iconTablet='<svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M11 18.5h2"/></svg>';
  const iconPhone='<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></svg>';

  const presets=[
    {id:'desktop-1440',name:'Desktop grande',size:'1440 × 900',icon:iconDesktop},
    {id:'laptop-1280',name:'Notebook',size:'1280 × 800',icon:iconDesktop},
    {id:'tablet-landscape',name:'Tablet horizontal',size:'1024 × 768',icon:iconTablet},
    {id:'tablet-portrait',name:'Tablet vertical',size:'768 × 1024',icon:iconTablet},
    {id:'mobile-430',name:'Celular grande',size:'430 × 932',icon:iconPhone},
    {id:'mobile-390',name:'Celular padrão',size:'390 × 844',icon:iconPhone},
    {id:'mobile-360',name:'Celular compacto',size:'360 × 800',icon:iconPhone}
  ];

  let current='desktop-1440';
  try{
    const saved=localStorage.getItem(STORE);
    if(presets.some(p=>p.id===saved)) current=saved;
  }catch{}

  const menu=document.createElement('div');
  menu.className='device-presets-v193';
  menu.setAttribute('role','menu');
  menu.setAttribute('aria-label','Escolher aparelho da prévia');
  menu.innerHTML=presets.map(p=>`
    <button type="button" class="device-preset-v193" data-device-preset-v193="${p.id}" role="menuitem">
      ${p.icon}
      <span><strong>${p.name}</strong><span>Visualização responsiva</span></span>
      <em>${p.size}</em>
    </button>
  `).join('');

  const frame=document.createElement('div');
  frame.className='device-frame-v193';
  frame.setAttribute('aria-hidden','true');

  document.body.appendChild(menu);
  document.body.appendChild(frame);

  function preset(){
    return presets.find(p=>p.id===current) || presets[0];
  }

  function positionMenu(){
    const r=oldButton.getBoundingClientRect();
    const width=220;
    let left=r.left;
    let top=r.top-8;

    if(left+width>innerWidth-8) left=innerWidth-width-8;
    if(left<8) left=8;

    menu.style.left=left+'px';

    const estimated=presets.length*46+16;
    if(top-estimated>8){
      menu.style.top=(top-estimated)+'px';
    }else{
      menu.style.top=(r.bottom+8)+'px';
    }
  }

  function renderButton(){
    const p=preset();
    oldButton.innerHTML=p.icon;
    oldButton.dataset.deviceLabel=p.name+' · '+p.size;
    oldButton.title='Prévia: '+p.name+' ('+p.size+')';
    oldButton.setAttribute('aria-label','Escolher aparelho. Atual: '+p.name+', '+p.size+'.');
  }

  function apply(id){
    if(!presets.some(p=>p.id===id)) id=presets[0].id;
    current=id;

    document.body.dataset.devicePresetV193=current;

    const p=preset();
    frame.dataset.deviceName=p.name;
    frame.dataset.deviceSize=p.size;

    $$('[data-device-preset-v193]',menu).forEach(button=>{
      const active=button.dataset.devicePresetV193===current;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-current',active?'true':'false');
    });

    renderButton();

    try{localStorage.setItem(STORE,current);}catch{}

    requestAnimationFrame(()=>{
      window.__portfolioFreeIconsV184?.render?.();
    });
  }

  function open(){
    positionMenu();
    menu.classList.add('is-open');
    oldButton.setAttribute('aria-expanded','true');
  }

  function close(){
    menu.classList.remove('is-open');
    oldButton.setAttribute('aria-expanded','false');
  }

  /* substitui o ciclo da v192 por menu */
  oldButton.replaceWith(oldButton.cloneNode(true));
  const button=$('.editor-device-toggle-v192');

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();

    if(menu.classList.contains('is-open')) close();
    else open();
  });

  button.addEventListener('contextmenu',event=>{
    event.preventDefault();
    event.stopPropagation();
    apply('desktop-1440');
    close();
  });

  menu.addEventListener('click',event=>{
    const option=event.target.closest('[data-device-preset-v193]');
    if(!option) return;

    apply(option.dataset.devicePresetV193);
    close();
  });

  document.addEventListener('pointerdown',event=>{
    if(!menu.classList.contains('is-open')) return;
    if(event.target.closest('.device-presets-v193,.editor-device-toggle-v192')) return;
    close();
  });

  addEventListener('resize',()=>{
    if(menu.classList.contains('is-open')) positionMenu();
  },{passive:true});

  apply(current);

  window.__portfolioDevicePresetsV193={
    setPreset:apply,
    getPreset:()=>current,
    presets:presets.map(({id,name,size})=>({id,name,size}))
  };
})();