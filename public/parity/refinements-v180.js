/* ===== v182 — CTA acompanha a esfera como balão lateral ===== */
(() => {
  if (window.__portfolioAgentHintFollowV180) return;
  window.__portfolioAgentHintFollowV180 = true;

  const stage=document.querySelector('.agent-stage');
  const shell=document.querySelector('#brainShell');
  const orb=document.querySelector('#agentButton');
  const legacyHint=document.querySelector('#agentHint');

  if(!stage || !shell || !orb || !legacyHint) return;

  let follow=shell.querySelector('.agent-follow-hint-v180');

  if(!follow){
    follow=document.createElement('div');
    follow.className='agent-follow-hint-v180';

    const button=document.createElement('button');
    button.type='button';
    button.className='agent-follow-hint-button-v180';

    button.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      orb.click();
    });

    follow.appendChild(button);
    shell.appendChild(follow);
  }

  const button=follow.querySelector('button');

  function compactLabel(){
    const source=(legacyHint.textContent||'').toLowerCase();

    if(source.includes('click to') || source.includes('chat with')) return 'Chat with me';
    if(source.includes('habla') || source.includes('conversar conmigo')) return 'Habla conmigo';
    return 'Fale comigo';
  }

  function syncText(){
    if(!button) return;
    button.textContent=compactLabel();
    button.setAttribute('aria-label',legacyHint.textContent?.trim() || button.textContent);
  }

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

  function position(){
    raf=requestAnimationFrame(position);

    if(stage.classList.contains('chat-active')) return;

    const shellRect=shell.getBoundingClientRect();
    const orbRect=orb.getBoundingClientRect();
    if(!shellRect.width || !orbRect.width) return;

    const mobile=innerWidth<=620;

    /*
      Desktop: balão fica na lateral inferior direita da esfera,
      como uma chamada pertencente ao robô.
      Mobile: centraliza abaixo para não escapar da viewport.
    */
    const x=mobile
      ? (orbRect.left-shellRect.left)+(orbRect.width/2)
      : (orbRect.right-shellRect.left)+14;

    const y=mobile
      ? (orbRect.bottom-shellRect.top)+18
      : (orbRect.top-shellRect.top)+(orbRect.height*.68);

    if(Math.abs(x-lastX)>.08){
      follow.style.setProperty('left',x+'px','important');
      lastX=x;
    }
    if(Math.abs(y-lastY)>.08){
      follow.style.setProperty('top',y+'px','important');
      lastY=y;
    }

    const transform=mobile?'translateX(-50%)':'translateX(0)';
    if(follow.style.getPropertyValue('transform')!==transform){
      follow.style.setProperty('transform',transform,'important');
    }
  }

  syncText();
  position();

  addEventListener('pagehide',()=>{
    if(raf) cancelAnimationFrame(raf);
  },{once:true});
})();