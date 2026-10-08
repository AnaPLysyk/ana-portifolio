/* ===== v191 — botão para trocar painel de lado ===== */
(() => {
  if(window.__portfolioPanelSideV191) return;
  window.__portfolioPanelSideV191=true;

  const $=(s,r=document)=>r.querySelector(s);
  const navActions=$('.nav-actions-v100') || $('.nav');
  if(!navActions) return;

  const STORE='ana_portfolio_editor_panel_side_v191';

  let side='right';
  try{
    const saved=localStorage.getItem(STORE);
    if(saved==='left'||saved==='right') side=saved;
  }catch{}

  const button=document.createElement('button');
  button.type='button';
  button.className='editor-panel-side-toggle-v191';
  button.setAttribute('aria-label','Mover painel de edição para o outro lado');
  button.setAttribute('title','Mover painel');

  function iconFor(current){
    /*
      Mostra a ação disponível:
      painel à direita -> seta apontando para esquerda;
      painel à esquerda -> seta apontando para direita.
    */
    return current==='right'
      ? '<svg viewBox="0 0 24 24"><path d="M9 6 3 12l6 6"/><path d="M3 12h13"/><rect x="17" y="5" width="4" height="14" rx="1"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="m15 6 6 6-6 6"/><path d="M21 12H8"/><rect x="3" y="5" width="4" height="14" rx="1"/></svg>';
  }

  function apply(next){
    side=next==='left'?'left':'right';

    document.body.classList.toggle('editor-panel-left-v191',side==='left');

    button.innerHTML=iconFor(side);
    button.setAttribute(
      'aria-label',
      side==='right'
        ? 'Mover painel de edição para a esquerda'
        : 'Mover painel de edição para a direita'
    );
    button.title=side==='right'?'Painel à direita — mover para esquerda':'Painel à esquerda — mover para direita';

    try{localStorage.setItem(STORE,side);}catch{}
  }

  button.addEventListener('click',()=>{
    apply(side==='right'?'left':'right');
  });

  /* clique direito volta ao padrão: painel à direita */
  button.addEventListener('contextmenu',event=>{
    event.preventDefault();
    apply('right');
  });

  navActions.appendChild(button);
  apply(side);

  if('MutationObserver' in window){
    new MutationObserver(()=>{
      if(!document.body.classList.contains('editor-studio-open')){
        document.body.classList.remove('editor-panel-left-v191');
      }else{
        document.body.classList.toggle('editor-panel-left-v191',side==='left');
      }
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  window.__portfolioPanelSideV191={
    setSide:apply,
    getSide:()=>side
  };
})();