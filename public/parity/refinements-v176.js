/* ===== v176 — órbitas completas sem tangente em formato de piso ===== */
(() => {
  if (window.__portfolioOrbitCurvedBottomV176) return;
  window.__portfolioOrbitCurvedBottomV176 = true;

  /*
    Mantém a órbita 100% contínua. Em vez de apagar a parte de baixo,
    adicionamos uma curvatura mínima somente perto da tangente inferior.
    Assim ela nunca vira um pequeno traço horizontal/"piso".
  */
  function orbitPointCurvedBottom(cx,cy,rx,ry,angle,tilt,orbitIndex,time){
    const p=orbitFlexPoint(cx,cy,rx,ry,angle,tilt,orbitIndex,time);

    // Atua apenas na metade inferior da órbita.
    const lower=Math.max(0,Math.sin(angle));
    const influence=Math.pow(lower,5);

    // cos(angle) vale 0 no centro da tangente, mas tem derivada forte ali:
    // isso inclina suavemente o trecho inferior sem abrir/cortar o anel.
    const direction=(orbitIndex % 2 === 0) ? 1 : -1;
    const bend=Math.cos(angle) * ry * .075 * influence * direction;

    // Pequena assimetria temporal para manter a sensação orgânica/quântica.
    const softWave=Math.sin(time*.00055 + orbitIndex*1.7) * ry * .008 * influence;

    return {
      x:p.x,
      y:p.y + bend + softWave
    };
  }

  function drawFullOrbitCurved(ctx,cx,cy,rx,ry,tilt,orbitIndex,time){
    let first=true;
    for(let j=0;j<=168;j++){
      const a=(j/168)*Math.PI*2;
      const p=orbitPointCurvedBottom(cx,cy,rx,ry,a,tilt,orbitIndex,time);
      if(first){
        ctx.moveTo(p.x,p.y);
        first=false;
      }else{
        ctx.lineTo(p.x,p.y);
      }
    }
  }

  function drawOrbitArcCurved(ctx,cx,cy,rx,ry,tilt,start,len,orbitIndex,time){
    let first=true;
    for(let j=0;j<=72;j++){
      const a=start + len*(j/72);
      const p=orbitPointCurvedBottom(cx,cy,rx,ry,a,tilt,orbitIndex,time);
      if(first){
        ctx.moveTo(p.x,p.y);
        first=false;
      }else{
        ctx.lineTo(p.x,p.y);
      }
    }
  }

  try{
    drawQuantum=function(t){
      if(!qCtx || !quantumCanvas){
        requestAnimationFrame(drawQuantum);
        return;
      }

      qCtx.clearRect(0,0,qW,qH);

      const active=!agentStage?.classList.contains('chat-active');
      const targetHover=active && quantumField?.matches(':hover') ? 1 : 0;
      qHover+=(targetHover-qHover)*.045;

      const cx=qW/2 + qPointerX*5;
      const cy=qH/2 + qPointerY*3;
      const ringInfluence=qHover;
      const isLight=document.body.classList.contains('portfolio-theme-light');

      qCtx.save();
      qCtx.globalCompositeOperation=isLight ? 'source-over' : 'lighter';

      qOrbits.forEach((o,oi)=>{
        const rx=qW*o.rx;
        const ry=qH*o.ry;
        const spin=t*o.speed + o.phase;
        const cA=quantumThemeColorV101(o.colorA,isLight);
        const cB=quantumThemeColorV101(o.colorB,isLight);

        /* Anel completo, sem máscara e sem clearRect localizado. */
        qCtx.beginPath();
        drawFullOrbitCurved(qCtx,cx,cy,rx,ry,o.tilt,oi,t);
        qCtx.setLineDash(o.dotted ? (isLight ? [3,4] : [4,5]) : []);
        qCtx.strokeStyle=isLight
          ? `rgba(36,58,93,${o.trackAlpha*1.48})`
          : `rgba(${cA[0]},${cA[1]},${cA[2]},${o.trackAlpha})`;
        qCtx.lineWidth=o.width + (isLight ? .16 : 0);
        qCtx.lineCap='round';
        qCtx.shadowBlur=0;
        qCtx.stroke();

        if(isLight){
          qCtx.beginPath();
          drawFullOrbitCurved(qCtx,cx,cy,rx,ry,o.tilt,oi,t);
          qCtx.setLineDash(o.dotted ? [3,4] : []);
          qCtx.strokeStyle=`rgba(17,31,56,${Math.min(.125,o.trackAlpha*.72)})`;
          qCtx.lineWidth=o.width+.92;
          qCtx.shadowBlur=0;
          qCtx.stroke();
        }

        /* Highlight A */
        qCtx.beginPath();
        drawOrbitArcCurved(qCtx,cx,cy,rx,ry,o.tilt,spin,o.lenA*Math.PI*2,oi,t);
        qCtx.setLineDash([]);
        qCtx.strokeStyle=`rgba(${cA[0]},${cA[1]},${cA[2]},${Math.min(1,o.alpha*(isLight?1.18:1)*(1+ringInfluence*.08))})`;
        qCtx.lineWidth=o.width+(isLight?.78:.52);
        qCtx.lineCap='round';
        qCtx.shadowColor=`rgba(${cA[0]},${cA[1]},${cA[2]},${isLight?.28:.40})`;
        qCtx.shadowBlur=isLight?9:11;
        qCtx.stroke();

        /* Highlight B */
        qCtx.beginPath();
        drawOrbitArcCurved(qCtx,cx,cy,rx,ry,o.tilt,spin+Math.PI,o.lenB*Math.PI*2,oi,t);
        qCtx.strokeStyle=`rgba(${cB[0]},${cB[1]},${cB[2]},${Math.min(1,(o.alpha*.78)*(isLight?1.12:1)*(1+ringInfluence*.06))})`;
        qCtx.lineWidth=o.width+(isLight?.34:.18);
        qCtx.lineCap='round';
        qCtx.shadowColor=`rgba(${cB[0]},${cB[1]},${cB[2]},${isLight?.18:.28})`;
        qCtx.shadowBlur=isLight?6:8;
        qCtx.stroke();
      });

      qParticles.forEach((p,idx)=>{
        const o=qOrbits[p.orbit];
        const a=t*(o.speed+p.speed)+p.phase;
        const pt=orbitPointCurvedBottom(
          cx,cy,qW*o.rx,qH*o.ry,a,o.tilt,p.orbit,t
        );
        const pulse=.55+.45*Math.sin(t*.0024+idx);
        const alpha=p.alpha*(.76+qHover*.34)*(.72+pulse*.3);
        const col=idx%3===0
          ? [255,82,108]
          : (idx%3===1 ? [116,173,255] : [244,247,255]);
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
    console.warn('Ajuste das órbitas v176 não aplicado.',error);
  }
})();