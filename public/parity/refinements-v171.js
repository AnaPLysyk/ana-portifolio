/* ===== v171 — órbita suave + ícone de projetos configurável ===== */
(() => {
  if (window.__portfolioRefinementsV171) return;
  window.__portfolioRefinementsV171 = true;

  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- ÓRBITA: sem chão e sem corte seco ---------- */
  try {
    drawQuantum = function(t) {
      if (!qCtx || !quantumCanvas) {
        requestAnimationFrame(drawQuantum);
        return;
      }

      qCtx.clearRect(0, 0, qW, qH);

      const active = !agentStage?.classList.contains("chat-active");
      const targetHover = active && quantumField?.matches(":hover") ? 1 : 0;
      qHover += (targetHover - qHover) * .045;

      const cx = qW / 2 + qPointerX * 5;
      const cy = qH / 2 + qPointerY * 3;
      const ringInfluence = qHover;
      const isLight = document.body.classList.contains("portfolio-theme-light");

      qCtx.save();
      qCtx.globalCompositeOperation = isLight ? "source-over" : "lighter";

      qOrbits.forEach((o, oi) => {
        const rx = qW * o.rx;
        const ry = qH * o.ry;
        const spin = t * o.speed + o.phase;
        const cA = quantumThemeColorV101(o.colorA, isLight);
        const cB = quantumThemeColorV101(o.colorB, isLight);

        qCtx.beginPath();
        drawOrbitPath(qCtx, cx, cy, rx, ry, o.tilt, oi, t);
        qCtx.setLineDash(o.dotted ? (isLight ? [3,4] : [4,5]) : []);
        qCtx.strokeStyle = isLight
          ? `rgba(36,58,93,${o.trackAlpha * 1.55})`
          : `rgba(${cA[0]},${cA[1]},${cA[2]},${o.trackAlpha})`;
        qCtx.lineWidth = o.width + (isLight ? .18 : 0);
        qCtx.lineCap = "round";
        qCtx.shadowBlur = 0;
        qCtx.stroke();

        if (isLight) {
          qCtx.beginPath();
          drawOrbitPath(qCtx, cx, cy, rx, ry, o.tilt, oi, t);
          qCtx.setLineDash(o.dotted ? [3,4] : []);
          qCtx.strokeStyle = `rgba(17,31,56,${Math.min(.16, o.trackAlpha * .9)})`;
          qCtx.lineWidth = o.width + 1.15;
          qCtx.stroke();
        }

        qCtx.beginPath();
        drawOrbitArc(qCtx, cx, cy, rx, ry, o.tilt, spin, o.lenA * Math.PI * 2, oi, t);
        qCtx.setLineDash([]);
        qCtx.strokeStyle = `rgba(${cA[0]},${cA[1]},${cA[2]},${Math.min(1,o.alpha * (isLight ? 1.2 : 1) * (1 + ringInfluence * .08))})`;
        qCtx.lineWidth = o.width + (isLight ? .85 : .55);
        qCtx.lineCap = "round";
        qCtx.shadowColor = `rgba(${cA[0]},${cA[1]},${cA[2]},${isLight ? .30 : .42})`;
        qCtx.shadowBlur = isLight ? 10 : 12;
        qCtx.stroke();

        qCtx.beginPath();
        drawOrbitArc(qCtx, cx, cy, rx, ry, o.tilt, spin + Math.PI, o.lenB * Math.PI * 2, oi, t);
        qCtx.strokeStyle = `rgba(${cB[0]},${cB[1]},${cB[2]},${Math.min(1,(o.alpha * .78) * (isLight ? 1.15 : 1) * (1 + ringInfluence * .06))})`;
        qCtx.lineWidth = o.width + (isLight ? .38 : .2);
        qCtx.lineCap = "round";
        qCtx.shadowColor = `rgba(${cB[0]},${cB[1]},${cB[2]},${isLight ? .20 : .30})`;
        qCtx.shadowBlur = isLight ? 7 : 9;
        qCtx.stroke();
      });

      qParticles.forEach((p, idx) => {
        const o = qOrbits[p.orbit];
        const a = t * (o.speed + p.speed) + p.phase;
        const pt = orbitFlexPoint(cx, cy, qW * o.rx, qH * o.ry, a, o.tilt, p.orbit, t);
        const pulse = .55 + .45 * Math.sin(t * .0024 + idx);
        const alpha = p.alpha * (.76 + qHover * .34) * (.72 + pulse * .3);
        const col = idx % 3 === 0 ? [255,82,108] : (idx % 3 === 1 ? [116,173,255] : [244,247,255]);
        const drawCol = quantumThemeColorV101(col, isLight);

        qCtx.beginPath();
        qCtx.arc(pt.x, pt.y, p.size * (1 + qHover * .18), 0, Math.PI * 2);
        qCtx.shadowColor = `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${alpha * (isLight ? .22 : .52)})`;
        qCtx.shadowBlur = isLight ? 4 : 5;
        qCtx.fillStyle = `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${Math.min(1,alpha * (isLight ? 1.08 : 1))})`;
        qCtx.fill();
        qCtx.shadowBlur = 0;
      });

      qCtx.restore();

      /* Máscara elíptica suave: remove apenas a sensação de "chão",
         sem terminar o anel com um corte reto. */
      const maskY = cy + Math.max(91, qH * .202);
      const maskRadius = Math.max(118, qW * .245);

      qCtx.save();
      qCtx.translate(cx, maskY);
      qCtx.scale(1, .16);
      qCtx.globalCompositeOperation = "destination-out";

      const fade = qCtx.createRadialGradient(0, 0, 0, 0, 0, maskRadius);
      fade.addColorStop(0, "rgba(0,0,0,.96)");
      fade.addColorStop(.36, "rgba(0,0,0,.76)");
      fade.addColorStop(.68, "rgba(0,0,0,.24)");
      fade.addColorStop(1, "rgba(0,0,0,0)");

      qCtx.fillStyle = fade;
      qCtx.beginPath();
      qCtx.arc(0, 0, maskRadius, 0, Math.PI * 2);
      qCtx.fill();
      qCtx.restore();

      requestAnimationFrame(drawQuantum);
    };
  } catch (error) {
    console.warn("Ajuste de órbita v171 não aplicado.", error);
  }

  /* ---------- ÍCONE DA SEÇÃO DE PROJETOS ---------- */
  const STORAGE_KEY = "ana_portfolio_projects_icon_v171";
  const title = $(".github-title-v61");
  const layoutPanel = $('[data-editor-panel="layout"]');
  const saveButton = $("#editorSaveV82");
  const confirmSave = $("#editorConfirmSaveV146");
  const cancelButton = $("#editorRelockV82");
  const exitConfirm = $("#editorExitConfirmButtonV155");
  const status = $("#editorStatusV82");

  if (!title) return;

  let icon = title.querySelector("svg");
  if (icon) icon.classList.add("projects-heading-icon-v171");

  const ICONS = {
    github: {
      style:"fill",
      viewBox:"0 0 24 24",
      body:'<path d="M12 .7a11.3 11.3 0 0 0-3.57 22.03c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.31-1.25-1.66-1.25-1.66-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.51-.29-5.15-1.26-5.15-5.59 0-1.24.44-2.25 1.16-3.04-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.11 1.16A10.8 10.8 0 0 1 12 6.16c.96 0 1.92.13 2.82.38 2.16-1.46 3.1-1.16 3.1-1.16.62 1.55.24 2.7.12 2.99.72.79 1.16 1.8 1.16 3.04 0 4.34-2.65 5.3-5.17 5.58.41.35.77 1.04.77 2.09v3.1c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z"/>'
    },
    terminal: {
      style:"stroke",
      viewBox:"0 0 24 24",
      body:'<path d="m5 7 4 5-4 5M11 17h8"/>'
    },
    code: {
      style:"stroke",
      viewBox:"0 0 24 24",
      body:'<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'
    },
    folder: {
      style:"stroke",
      viewBox:"0 0 24 24",
      body:'<path d="M3 6.5h6l2 2h10v9.5H3z"/>'
    }
  };

  const defaultSettings = {
    icon:"github",
    color: document.body.classList.contains("portfolio-theme-light") ? "#17365d" : "#dfe8f6",
    position:"before",
    size:34
  };

  function readSaved(){
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch {
      return { ...defaultSettings };
    }
  }

  let savedSettings = readSaved();
  let draftSettings = { ...savedSettings };

  function ensureIcon(){
    if (!icon || !icon.isConnected) {
      icon = document.createElementNS("http://www.w3.org/2000/svg","svg");
      icon.classList.add("projects-heading-icon-v171");
      icon.setAttribute("aria-hidden","true");
      title.insertBefore(icon,title.firstChild);
    }
    return icon;
  }

  function apply(settings){
    const svg = ensureIcon();
    const definition = ICONS[settings.icon] || ICONS.github;

    svg.setAttribute("viewBox",definition.viewBox);
    svg.dataset.iconStyle = definition.style;
    svg.innerHTML = definition.body;

    title.style.setProperty("--projects-icon-color-v171",settings.color);
    svg.style.setProperty("width",settings.size + "px","important");
    svg.style.setProperty("height",settings.size + "px","important");
    svg.style.setProperty("flex-basis",settings.size + "px","important");

    title.classList.toggle("projects-icon-after-v171",settings.position === "after");
  }

  apply(savedSettings);

  if (layoutPanel && !$("#projectsIconEditorV171")) {
    const section = document.createElement("div");
    section.className = "editor-studio-section projects-icon-editor-v171";
    section.id = "projectsIconEditorV171";
    section.innerHTML = `
      <div class="editor-section-title-v85">
        <div>
          <small>PROJETOS</small>
          <h3>Ícone da seção</h3>
        </div>
      </div>
      <p>Troco o símbolo, a posição, a cor e o tamanho usados no título dos repositórios.</p>
      <div class="projects-icon-editor-grid-v171">
        <label>
          Ícone
          <select id="projectsIconKindV171">
            <option value="github">GitHub</option>
            <option value="terminal">Terminal</option>
            <option value="code">Código</option>
            <option value="folder">Pasta</option>
          </select>
        </label>
        <label>
          Posição
          <select id="projectsIconPositionV171">
            <option value="before">Antes do título</option>
            <option value="after">Depois do título</option>
          </select>
        </label>
        <label>
          Cor
          <input id="projectsIconColorV171" type="color">
        </label>
        <label>
          Tamanho
          <div class="projects-icon-size-row-v171">
            <input id="projectsIconSizeV171" type="range" min="24" max="48" step="1">
            <span class="projects-icon-size-value-v171" id="projectsIconSizeValueV171"></span>
          </div>
        </label>
      </div>
    `;
    layoutPanel.appendChild(section);
  }

  const kind = $("#projectsIconKindV171");
  const position = $("#projectsIconPositionV171");
  const color = $("#projectsIconColorV171");
  const size = $("#projectsIconSizeV171");
  const sizeValue = $("#projectsIconSizeValueV171");

  function syncControls(){
    if (kind) kind.value = draftSettings.icon;
    if (position) position.value = draftSettings.position;
    if (color) color.value = draftSettings.color;
    if (size) size.value = String(draftSettings.size);
    if (sizeValue) sizeValue.textContent = draftSettings.size + "px";
  }

  function markDirty(){
    window.__portfolioEditorDirtyV146 = true;
    if (status) status.textContent = "Aparência da seção de projetos alterada. Revise e salve para confirmar.";
  }

  function preview(){
    draftSettings = {
      icon: kind?.value || draftSettings.icon,
      position: position?.value || draftSettings.position,
      color: color?.value || draftSettings.color,
      size: Number(size?.value || draftSettings.size)
    };
    apply(draftSettings);
    if (sizeValue) sizeValue.textContent = draftSettings.size + "px";
    markDirty();
  }

  [kind,position,color,size].forEach(control => control?.addEventListener("input",preview));
  [kind,position,color,size].forEach(control => control?.addEventListener("change",preview));

  confirmSave?.addEventListener("click",()=>{
    savedSettings = { ...draftSettings };
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(savedSettings)); } catch {}
  },true);

  function restoreSaved(){
    draftSettings = { ...savedSettings };
    apply(savedSettings);
    syncControls();
  }

  cancelButton?.addEventListener("click",()=>setTimeout(restoreSaved,0),true);
  exitConfirm?.addEventListener("click",()=>setTimeout(restoreSaved,0),true);

  saveButton?.addEventListener("click",()=>{
    if (JSON.stringify(savedSettings) !== JSON.stringify(draftSettings)) markDirty();
  },true);

  syncControls();
})();
