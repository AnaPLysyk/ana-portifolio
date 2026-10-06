/* ===== v180 — CTA segue a esfera frame a frame ===== */
(() => {
  if (window.__portfolioAgentHintFollowV180) return;
  window.__portfolioAgentHintFollowV180 = true;

  const stage=document.querySelector('.agent-stage');
  const shell=document.querySelector('#brainShell');
  const orb=document.querySelector('#agentButton');
  const legacyIdle=shell?.querySelector(':scope > .brain-idle');
  const legacyHint=document.querySelector('#agentHint');

  if(!stage || !shell || !orb || !legacyHint) return;

  let follow=shell.querySelector('.agent-follow-hint-v180');

  if(!follow){
    follow=document.createElement('div');
    follow.className='agent-follow-hint-v180';
    follow.setAttribute('aria-hidden','false');

    const button=document.createElement('button');
    button.type='button';
    button.className='agent-follow-hint-button-v180';
    button.textContent=legacyHint.textContent?.trim() || 'Clique para conversar comigo.';
    button.setAttribute('aria-label',button.textContent);

    button.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      orb.click();
    });

    follow.appendChild(button);
    shell.appendChild(follow);
  }

  const followButton=follow.querySelector('button');

  /* Mantém PT/EN/ES sincronizado com o CTA legado. */
  const syncText=()=>{
    const text=legacyHint.textContent?.trim();
    if(!text || !followButton) return;
    if(followButton.textContent!==text){
      followButton.textContent=text;
      followButton.setAttribute('aria-label',text);
    }
  };

  if('MutationObserver' in window){
    new MutationObserver(syncText).observe(legacyHint,{
      childList:true,
      subtree:true,
      characterData:true
    });
  }

  let raf=0;
  let lastX=NaN;
  let lastY=NaN;

  function gapForViewport(){
    const light=document.body.classList.contains('portfolio-theme-light');

    if(innerWidth<=480) return light ? 54 : 48;
    if(innerWidth<=760) return light ? 60 : 54;
    return light ? 66 : 58;
  }

  function position(){
    raf=requestAnimationFrame(position);

    if(stage.classList.contains('chat-active')){
      return;
    }

    const shellRect=shell.getBoundingClientRect();
    const orbRect=orb.getBoundingClientRect();

    if(!shellRect.width || !orbRect.width) return;

    /*
      Usamos o retângulo transformado real da esfera.
      Portanto, qualquer movimento aplicado ao agentButton
      já chega automaticamente ao CTA.
    */
    const x=(orbRect.left-shellRect.left)+(orbRect.width/2);
    const y=(orbRect.bottom-shellRect.top)+gapForViewport();

    if(Math.abs(x-lastX)>.08){
      follow.style.setProperty('left',x+'px','important');
      lastX=x;
    }

    if(Math.abs(y-lastY)>.08){
      follow.style.setProperty('top',y+'px','important');
      lastY=y;
    }

    if(follow.style.getPropertyValue('transform')!=='translateX(-50%)'){
      follow.style.setProperty('transform','translateX(-50%)','important');
    }
  }

  syncText();
  position();

  addEventListener('pagehide',()=>{
    if(raf) cancelAnimationFrame(raf);
  },{once:true});
})();