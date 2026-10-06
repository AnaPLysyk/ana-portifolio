/* ===== v175 — órbita íntegra, sem piso + CTA claro com mais respiro ===== */
(() => {
  if (window.__portfolioOrbitNoFloorV175) return;
  window.__portfolioOrbitNoFloorV175 = true;

  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));

  function lowerTangentFactor(prev,p,cy,ry){
    const y=(prev.y+p.y)/2;
    const bottom=clamp((y-(cy+ry*.50))/(Math.max(1,ry)*.46));
    const dy=Math.abs(p.y-prev.y);
    const horizontal=1-clamp(dy/2.4);
    const floorLike=bottom*bottom*horizontal;
    return Math.max(.08,1-floorLike*.94);
  }

  function strokeHighlightSegments({
    ctx,cx,cy,rx,ry,tilt,start,len,orbitIndex,time,
    color,alpha,width,shadowColor,shadowBlur
  }){
    const steps=78;
    let prev=orbitFlexPoint(cx,cy,rx,ry,start,tilt,orbitIndex,time);

    ctx.setLineDash([]);
    ctx.lineCap='round';
    ctx.lineWidth=width;
    ctx.shadowColor=shadowColor;
    ctx.shadowBlur=shadowBlur;

    for(let j=1;j<=steps;j++){
      const a=start+len*(j/steps);
      const p=orbitFlexPoint(cx,cy,rx,ry,a,tilt,orbitIndex,time);
      const fade=lowerTangentFactor(prev,p,cy,ry);

      ctx.beginPath();
      ctx.moveTo(prev.x,prev.y);
      ctx.lineTo(p.x,p.y);
      ctx.strokeStyle=`rgba(${color[0]},${color[1]},${color[2]},${alpha*fade})`;
      ctx.stroke();

      prev=p;
    }
  }

  try{
    drawQuantum=function(t){
      if(!qCtx||!quantumCanvas){
        requestAnimationFrame(drawQuantum);
        return;
      }

      qCtx.clearRect(0,0,qW,qH);

      const active=!agentStage?.classList.contains('chat-active');
      const targetHover=active&&quantumField?.matches(':hover')?1:0;
      qHover+=(targetHover-qHover)*.045;

      const cx=qW/2+qPointerX*5;
      const cy=qH/2+qPointerY*3;
      const ringInfluence=qHover;
      const isLight=document.body.classList.contains('portfolio-theme-light');

      qCtx.save();
      qCtx.globalCompositeOperation=isLight?'source-over':'lighter';

      qOrbits.forEach((o,oi)=>{
        const rx=qW*o.rx;
        const ry=qH*o.ry;
        const spin=t*o.speed+o.phase;
        const cA=quantumThemeColorV101(o.colorA,isLight);
        const cB=quantumThemeColorV101(o.colorB,isLight);

        /* ÓRBITA COMPLETA: não há clearRect, máscara ou recorte. */
        qCtx.beginPath();
        drawOrbitPath(qCtx,cx,cy,rx,ry,o.tilt,oi,t);
        qCtx.setLineDash(o.dotted?(isLight?[3,4]:[4,5]):[]);
        qCtx.strokeStyle=isLight
          ? `rgba(36,58,93,${o.trackAlpha*1.48})`
          : `rgba(${cA[0]},${cA[1]},${cA[2]},${o.trackAlpha})`;
        qCtx.lineWidth=o.width+(isLight?.16:0);
        qCtx.lineCap='round';
        qCtx.shadowBlur=0;
        qCtx.stroke();

        if(isLight){
          qCtx.beginPath();
          drawOrbitPath(qCtx,cx,cy,rx,ry,o.tilt,oi,t);
          qCtx.setLineDash(o.dotted?[3,4]:[]);
          qCtx.strokeStyle=`rgba(17,31,56,${Math.min(.125,o.trackAlpha*.72)})`;
          qCtx.lineWidth=o.width+.92;
          qCtx.shadowBlur=0;
          qCtx.stroke();
        }

        /* Os highlights continuam girando, mas deixam de parecer um piso
           apenas quando estão quase horizontais na parte mais baixa. */
        strokeHighlightSegments({
          ctx:qCtx,cx,cy,rx,ry,tilt:o.tilt,
          start:spin,len:o.lenA*Math.PI*2,orbitIndex:oi,time:t,
          color:cA,
          alpha:Math.min(1,o.alpha*(isLight?1.18:1)*(1+ringInfluence*.08)),
          width:o.width+(isLight?.78:.52),
          shadowColor:`rgba(${cA[0]},${cA[1]},${cA[2]},${isLight?.28:.40})`,
          shadowBlur:isLight?9:11
        });

        strokeHighlightSegments({
          ctx:qCtx,cx,cy,rx,ry,tilt:o.tilt,
          start:spin+Math.PI,len:o.lenB*Math.PI*2,orbitIndex:oi,time:t,
          color:cB,
          alpha:Math.min(1,(o.alpha*.78)*(isLight?1.12:1)*(1+ringInfluence*.06)),
          width:o.width+(isLight?.34:.18),
          shadowColor:`rgba(${cB[0]},${cB[1]},${cB[2]},${isLight?.18:.28})`,
          shadowBlur:isLight?6:8
        });
      });

      qParticles.forEach((p,idx)=>{
        const o=qOrbits[p.orbit];
        const a=t*(o.speed+p.speed)+p.phase;
        const pt=orbitFlexPoint(cx,cy,qW*o.rx,qH*o.ry,a,o.tilt,p.orbit,t);
        const pulse=.55+.45*Math.sin(t*.0024+idx);
        const alpha=p.alpha*(.76+qHover*.34)*(.72+pulse*.3);
        const col=idx%3===0?[255,82,108]:(idx%3===1?[116,173,255]:[244,247,255]);
        const drawCol=quantumThemeColorV101(col,isLight);

        qCtx.beginPath();
        qCtx.arc(pt.x,pt.y,p.size*(1+qHover*.18),0,Math.PI*2);
        qCtx.shadowColor=`rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${alpha*(isLight?.20:.48)})`;
        qCtx.shadowBlur=isLight?4:5;
        qCtx.fillStyle=`rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${Math.min(1,alpha*(isLight?1.06:1))})`;
        qCtx.fill();
        qCtx.shadowBlur=0;
      });

      qCtx.restore();
      requestAnimationFrame(drawQuantum);
    };
  }catch(error){
    console.warn('Ajuste das órbitas v175 não aplicado.',error);
  }

  /* Mantém o CTA mais afastado no claro. Como versões antigas também
     reposicionam esse elemento, observamos mudanças de estilo e reafirmamos
     a posição final sem afetar o robô. */
  const stage=document.querySelector('.agent-stage');
  const shell=document.querySelector('#brainShell');
  const orb=document.querySelector('#agentButton');
  const field=document.querySelector('.quantum-field-v37');
  const idle=shell?.querySelector('.brain-idle');

  let placing=false;

  function placeHint(){
    if(placing||!stage||!shell||!orb||!idle||stage.classList.contains('chat-active')) return;
    placing=true;

    try{
      const shellRect=shell.getBoundingClientRect();
      const orbRect=orb.getBoundingClientRect();
      const fieldRect=field?.getBoundingClientRect();
      const idleRect=idle.getBoundingClientRect();

      if(!shellRect.width||!orbRect.width) return;

      const centerX=(orbRect.left-shellRect.left)+(orbRect.width/2);
      const orbitBottom=fieldRect?.height
        ? fieldRect.bottom-shellRect.top
        : orbRect.bottom-shellRect.top;
      const sphereBottom=orbRect.bottom-shellRect.top;
      const visualBottom=Math.max(sphereBottom,orbitBottom-14);

      const isLight=document.body.classList.contains('portfolio-theme-light');
      const gap=isLight
        ? (innerWidth<=480?54:(innerWidth<=760?62:70))
        : (innerWidth<=480?42:(innerWidth<=760?46:52));

      let left=centerX;
      let top=visualBottom+gap;

      const half=Math.min((idleRect.width||220)/2,138);
      const min=half+8;
      const max=shellRect.width-half-8;
      if(max>min) left=Math.max(min,Math.min(max,left));

      const maxTop=shellRect.height-Math.max(idleRect.height||34,34)-12;
      top=Math.min(top,maxTop);

      const wantedLeft=left+'px';
      const wantedTop=top+'px';

      if(idle.style.getPropertyValue('left')!==wantedLeft)
        idle.style.setProperty('left',wantedLeft,'important');
      if(idle.style.getPropertyValue('top')!==wantedTop)
        idle.style.setProperty('top',wantedTop,'important');
      if(idle.style.getPropertyValue('transform')!=='translateX(-50%)')
        idle.style.setProperty('transform','translateX(-50%)','important');
    }finally{
      placing=false;
    }
  }

  const schedule=()=>{
    requestAnimationFrame(placeHint);
    setTimeout(placeHint,80);
    setTimeout(placeHint,260);
  };

  addEventListener('load',schedule);
  addEventListener('resize',schedule,{passive:true});
  document.fonts?.ready?.then(schedule).catch(()=>{});

  if(idle&&'MutationObserver' in window){
    new MutationObserver(()=>requestAnimationFrame(placeHint))
      .observe(idle,{attributes:true,attributeFilter:['style']});
  }

  if(document.body&&'MutationObserver' in window){
    new MutationObserver(schedule)
      .observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  if('ResizeObserver' in window){
    const ro=new ResizeObserver(schedule);
    if(shell)ro.observe(shell);
    if(orb)ro.observe(orb);
    if(field)ro.observe(field);
  }

  schedule();
})();