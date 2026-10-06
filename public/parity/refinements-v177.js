/* ===== v177 — canvas com respiro vertical real, sem clipping ===== */
(() => {
  if (window.__portfolioQuantumCanvasPaddingV177) return;
  window.__portfolioQuantumCanvasPaddingV177 = true;

  let designHeightV177 = 0;
  let padV177 = 0;

  function resizeQuantumV177(){
    if(!quantumCanvas || !quantumField) return;

    const rect = quantumField.getBoundingClientRect();
    const cssW = Math.max(1, rect.width);
    const baseH = Math.max(1, rect.height);

    /* Espaço extra só no canvas. A geometria continua usando baseH. */
    padV177 = cssW <= 360 ? 76 : 104;
    designHeightV177 = baseH;

    qDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    qW = cssW;
    qH = baseH + padV177;

    quantumCanvas.width = Math.round(qW * qDpr);
    quantumCanvas.height = Math.round(qH * qDpr);

    quantumCanvas.style.setProperty('position','absolute','important');
    quantumCanvas.style.setProperty('left','0','important');
    quantumCanvas.style.setProperty('top',(-padV177/2) + 'px','important');
    quantumCanvas.style.setProperty('width',qW + 'px','important');
    quantumCanvas.style.setProperty('height',qH + 'px','important');
    quantumCanvas.style.setProperty('max-width','none','important');
    quantumCanvas.style.setProperty('overflow','visible','important');

    quantumField.style.setProperty('overflow','visible','important');

    qCtx = quantumCanvas.getContext('2d');
    qCtx.setTransform(qDpr,0,0,qDpr,0,0);
  }

  try{
    /* Substitui a referência global para os próximos redimensionamentos. */
    resizeQuantum = resizeQuantumV177;
  }catch(_){}

  try{
    drawQuantum = function(t){
      if(!qCtx || !quantumCanvas){
        requestAnimationFrame(drawQuantum);
        return;
      }

      qCtx.clearRect(0,0,qW,qH);

      const active = !agentStage?.classList.contains('chat-active');
      const targetHover = active && quantumField?.matches(':hover') ? 1 : 0;
      qHover += (targetHover-qHover)*.045;

      /*
        cx/cy usam o canvas expandido.
        rx mantém a largura normal.
        ry usa a ALTURA VISUAL ORIGINAL, não qH.
        Resultado: mesmo desenho, com espaço real acima/abaixo para não cortar.
      */
      const cx = qW/2 + qPointerX*5;
      const cy = qH/2 + qPointerY*3;
      const geometryH = designHeightV177 || Math.max(1,qH-padV177);
      const ringInfluence = qHover;
      const isLight = document.body.classList.contains('portfolio-theme-light');

      qCtx.save();
      qCtx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

      qOrbits.forEach((o,oi)=>{
        const rx = qW*o.rx;
        const ry = geometryH*o.ry;
        const spin = t*o.speed + o.phase;
        const cA = quantumThemeColorV101(o.colorA,isLight);
        const cB = quantumThemeColorV101(o.colorB,isLight);

        /* trilha completa */
        qCtx.beginPath();
        drawOrbitPath(qCtx,cx,cy,rx,ry,o.tilt,oi,t);
        qCtx.setLineDash(o.dotted ? (isLight ? [3,4] : [4,5]) : []);
        qCtx.strokeStyle = isLight
          ? `rgba(36,58,93,${o.trackAlpha*1.48})`
          : `rgba(${cA[0]},${cA[1]},${cA[2]},${o.trackAlpha})`;
        qCtx.lineWidth = o.width + (isLight ? .16 : 0);
        qCtx.lineCap = 'round';
        qCtx.shadowBlur = 0;
        qCtx.stroke();

        /* contraste extra no claro */
        if(isLight){
          qCtx.beginPath();
          drawOrbitPath(qCtx,cx,cy,rx,ry,o.tilt,oi,t);
          qCtx.setLineDash(o.dotted ? [3,4] : []);
          qCtx.strokeStyle = `rgba(17,31,56,${Math.min(.125,o.trackAlpha*.72)})`;
          qCtx.lineWidth = o.width + .92;
          qCtx.shadowBlur = 0;
          qCtx.stroke();
        }

        /* highlight A */
        qCtx.beginPath();
        drawOrbitArc(qCtx,cx,cy,rx,ry,o.tilt,spin,o.lenA*Math.PI*2,oi,t);
        qCtx.setLineDash([]);
        qCtx.strokeStyle =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${Math.min(1,o.alpha*(isLight?1.18:1)*(1+ringInfluence*.08))})`;
        qCtx.lineWidth = o.width + (isLight ? .78 : .52);
        qCtx.lineCap = 'round';
        qCtx.shadowColor =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${isLight?.28:.40})`;
        qCtx.shadowBlur = isLight ? 9 : 11;
        qCtx.stroke();

        /* highlight B */
        qCtx.beginPath();
        drawOrbitArc(qCtx,cx,cy,rx,ry,o.tilt,spin+Math.PI,o.lenB*Math.PI*2,oi,t);
        qCtx.strokeStyle =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${Math.min(1,(o.alpha*.78)*(isLight?1.12:1)*(1+ringInfluence*.06))})`;
        qCtx.lineWidth = o.width + (isLight ? .34 : .18);
        qCtx.lineCap = 'round';
        qCtx.shadowColor =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${isLight?.18:.28})`;
        qCtx.shadowBlur = isLight ? 6 : 8;
        qCtx.stroke();
      });

      qParticles.forEach((p,idx)=>{
        const o = qOrbits[p.orbit];
        const a = t*(o.speed+p.speed)+p.phase;
        const pt = orbitFlexPoint(
          cx,cy,qW*o.rx,geometryH*o.ry,a,o.tilt,p.orbit,t
        );

        const pulse=.55+.45*Math.sin(t*.0024+idx);
        const alpha=p.alpha*(.76+qHover*.34)*(.72+pulse*.3);
        const col=idx%3===0
          ? [255,82,108]
          : (idx%3===1 ? [116,173,255] : [244,247,255]);
        const drawCol=quantumThemeColorV101(col,isLight);

        qCtx.beginPath();
        qCtx.arc(pt.x,pt.y,p.size*(1+qHover*.18),0,Math.PI*2);
        qCtx.shadowColor=
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${alpha*(isLight?.20:.48)})`;
        qCtx.shadowBlur=isLight?4:5;
        qCtx.fillStyle=
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${Math.min(1,alpha*(isLight?1.06:1))})`;
        qCtx.fill();
        qCtx.shadowBlur=0;
      });

      qCtx.restore();
      requestAnimationFrame(drawQuantum);
    };
  }catch(error){
    console.warn('Ajuste do canvas quântico v177 não aplicado.',error);
  }

  const refresh=()=>{
    resizeQuantumV177();
  };

  refresh();
  requestAnimationFrame(refresh);
  setTimeout(refresh,80);
  setTimeout(refresh,260);

  window.addEventListener('resize',refresh,{passive:true});

  if('ResizeObserver' in window && quantumField){
    const ro=new ResizeObserver(refresh);
    ro.observe(quantumField);
  }
})();