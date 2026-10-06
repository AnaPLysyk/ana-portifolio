(() => {
  if (window.__portfolioV163RuntimePatch) return;
  window.__portfolioV163RuntimePatch = true;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* ===== v162 — toolbar inferior só com ícones ===== */
  const toolbar = $('#editorCanvasToolbarV156');
  const toolbarIcons = {
    canvasPanelV156: {
      title: 'Fechar painel',
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM14 5v14"/></svg>'
    },
    canvasCenterV156: {
      title: 'Centralizar quadro',
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>'
    },
    canvasPreviewV156: {
      title: 'Visualizar portfólio',
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>'
    },
    canvasEditV156: {
      title: 'Voltar a editar',
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></svg>'
    }
  };

  function syncToolbarIcons() {
    if (!toolbar) return;
    Object.entries(toolbarIcons).forEach(([id, config]) => {
      const button = document.getElementById(id);
      if (!button) return;

      button.classList.add('toolbar-icon-v162');
      if (!button.querySelector('svg')) button.innerHTML = config.svg;

      if (id === 'canvasPanelV156') {
        const collapsed = document.body.classList.contains('editor-panel-collapsed-v158');
        const title = collapsed ? 'Abrir painel' : 'Fechar painel';
        button.title = title;
        button.setAttribute('aria-label', title);
      } else {
        button.title = config.title;
        button.setAttribute('aria-label', config.title);
      }
    });
  }

  syncToolbarIcons();

  if (toolbar && 'MutationObserver' in window) {
    new MutationObserver(syncToolbarIcons).observe(toolbar, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  document.getElementById('canvasPanelV156')?.addEventListener('click', () => {
    setTimeout(syncToolbarIcons, 0);
  });

  /* ===== v163 — foto única no cabeçalho do editor ===== */
  const owner = $('.editor-owner-v85');
  const ownerPhoto = $('#editorOwnerPhotoV86');
  const identityBlock = $('.editor-identity-v86');
  const identityFields = $('.editor-identity-fields-v86');
  const duplicatePhotoWrap = $('.editor-photo-wrap-v88');
  const identityPhoto = $('#editorIdentityPhotoV86');
  const originalFileInput = $('#editorIdentityPhotoInputV86');
  const studio = $('#editorStudio');

  let pendingPhoto = '';

  if (identityBlock) {
    identityBlock.classList.add('editor-identity-single-photo-v163');
  }

  if (identityBlock && identityPhoto) {
    identityPhoto.hidden = true;
    identityPhoto.alt = '';
    if (identityFields && identityPhoto.parentElement !== identityBlock) {
      identityBlock.insertBefore(identityPhoto, identityFields);
    }
  }

  duplicatePhotoWrap?.remove();

  if (owner && ownerPhoto && !$('.editor-owner-photo-wrap-v163')) {
    const wrap = document.createElement('div');
    wrap.className = 'editor-owner-photo-wrap-v163';
    owner.insertBefore(wrap, ownerPhoto);
    wrap.appendChild(ownerPhoto);

    const edit = document.createElement('button');
    edit.id = 'editorPhotoEditV88';
    edit.className = 'editor-photo-edit-v88 editor-owner-photo-edit-v163';
    edit.type = 'button';
    edit.setAttribute('aria-label', 'Editar foto');
    edit.title = 'Editar foto';
    edit.innerHTML = '<span aria-hidden="true">✎</span>';
    wrap.appendChild(edit);
  }

  /* O input legado possuía listener que aplicava a foto imediatamente.
     O clone mantém o mesmo campo visual, mas sem esse listener. */
  let fileInput = originalFileInput;
  if (originalFileInput) {
    const cleanInput = originalFileInput.cloneNode(true);
    originalFileInput.replaceWith(cleanInput);
    fileInput = cleanInput;
  }

  const editButton = $('#editorPhotoEditV88');

  function committedPhoto() {
    return $('.brand-photo')?.src || $('.profile-peek img')?.src || identityPhoto?.src || '';
  }

  function restorePhotoPreview() {
    pendingPhoto = '';
    const saved = committedPhoto();
    if (ownerPhoto && saved) ownerPhoto.src = saved;
    if (fileInput) fileInput.value = '';
  }

  editButton?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    fileInput?.click();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      pendingPhoto = String(reader.result || '');
      if (ownerPhoto && pendingPhoto) ownerPhoto.src = pendingPhoto;

      window.__portfolioEditorDirtyV146 = true;
      const status = $('#editorStatusV82');
      if (status) {
        status.textContent = 'Nova foto em prévia. Ela será aplicada somente ao confirmar e salvar.';
      }
    };
    reader.readAsDataURL(file);
  });

  /* A foto aparece na revisão sem ser aplicada ao portfólio ainda. */
  $('#editorSaveV82')?.addEventListener('click', () => {
    if (!pendingPhoto) return;
    setTimeout(() => {
      const summary = $('#editorConfirmSummaryV146');
      if (!summary || summary.querySelector('[data-photo-summary-v163]')) return;

      const item = document.createElement('div');
      item.className = 'change-group-v146';
      item.dataset.photoSummaryV163 = '1';
      item.innerHTML = '<strong>Perfil</strong><span>Foto atualizada</span>';
      summary.appendChild(item);
    }, 0);
  }, true);

  /* Só aqui a prévia vira foto efetiva do portfólio. */
  $('#editorConfirmSaveV146')?.addEventListener('click', () => {
    if (!pendingPhoto) return;

    const name = $('#editorIdentityNameV86')?.value?.trim() || 'Ana Paula de Lima Lysyk';

    if (identityPhoto) identityPhoto.src = pendingPhoto;
    $$('.brand-photo, .profile-peek img').forEach((img) => {
      img.src = pendingPhoto;
      img.alt = name;
    });
    if (ownerPhoto) ownerPhoto.src = pendingPhoto;

    setTimeout(() => {
      pendingPhoto = '';
      if (fileInput) fileInput.value = '';
    }, 0);
  }, true);

  ['editorRelockV82', 'editorStudioMinimize', 'editorExitConfirmButtonV155'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', () => {
      setTimeout(restorePhotoPreview, 0);
    }, true);
  });

  if (studio && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      const closed = studio.hidden || !document.body.classList.contains('editor-studio-open');
      if (closed && pendingPhoto) restorePhotoPreview();
    });

    observer.observe(studio, {
      attributes: true,
      attributeFilter: ['hidden', 'style']
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
})();

/* ===== ajuste fino — CTA mais afastado das órbitas ===== */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);

  function placeAssistantHintWithBreathingRoom() {
    const stage = $('.agent-stage');
    const shell = $('#brainShell');
    const orb = $('#agentButton');
    const field = $('.quantum-field-v37');
    const idle = shell?.querySelector('.brain-idle');

    if (!stage || !shell || !orb || !idle || stage.classList.contains('chat-active')) return;

    const shellRect = shell.getBoundingClientRect();
    const orbRect = orb.getBoundingClientRect();
    const fieldRect = field?.getBoundingClientRect();
    const idleRect = idle.getBoundingClientRect();

    if (!shellRect.width || !orbRect.width) return;

    const centerX = (orbRect.left - shellRect.left) + (orbRect.width / 2);
    const orbitBottom = fieldRect?.height
      ? (fieldRect.bottom - shellRect.top)
      : (orbRect.bottom - shellRect.top);

    const sphereBottom = orbRect.bottom - shellRect.top;
    const visualBottom = Math.max(sphereBottom, orbitBottom - 18);

    const gap = innerWidth <= 480 ? 42 : (innerWidth <= 760 ? 46 : 52);

    let left = centerX;
    let top = visualBottom + gap;

    const half = Math.min((idleRect.width || 220) / 2, 138);
    const min = half + 8;
    const max = shellRect.width - half - 8;

    if (max > min) left = Math.max(min, Math.min(max, left));

    const maxTop = shellRect.height - Math.max(idleRect.height || 34, 34) - 12;
    top = Math.min(top, maxTop);

    idle.style.setProperty('left', left + 'px', 'important');
    idle.style.setProperty('top', top + 'px', 'important');
    idle.style.setProperty('transform', 'translateX(-50%)', 'important');
  }

  const schedule = () => {
    requestAnimationFrame(placeAssistantHintWithBreathingRoom);
    setTimeout(placeAssistantHintWithBreathingRoom, 90);
    setTimeout(placeAssistantHintWithBreathingRoom, 320);
  };

  addEventListener('load', schedule);
  addEventListener('resize', schedule, { passive: true });
  document.fonts?.ready?.then(schedule).catch(() => {});

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(schedule);
    const shell = $('#brainShell');
    const orb = $('#agentButton');
    const field = $('.quantum-field-v37');
    if (shell) ro.observe(shell);
    if (orb) ro.observe(orb);
    if (field) ro.observe(field);
  }

  schedule();
})();


/* ===== v165 — remove micro-arcos que criavam efeito de chão ===== */
(() => {
  if (window.__portfolioNoOrbitFloorV165) return;
  window.__portfolioNoOrbitFloorV165 = true;

  /*
    O protótipo original desenhava, além dos anéis e dos dois highlights móveis,
    um terceiro "micro arco" muito curto em cada órbita. Quando dois ou três
    chegavam perto da tangente inferior ao mesmo tempo, visualmente viravam
    uma base/chão. Mantemos os anéis, partículas e highlights principais e
    eliminamos apenas esse terceiro acento.
  */
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
      const isLightThemeV101 = document.body.classList.contains("portfolio-theme-light");

      qCtx.save();
      qCtx.globalCompositeOperation = isLightThemeV101 ? "source-over" : "lighter";

      qOrbits.forEach((o, oi) => {
        const rx = qW * o.rx;
        const ry = qH * o.ry;
        const tilt = o.tilt;
        const spin = t * o.speed + o.phase;
        const cA = quantumThemeColorV101(o.colorA, isLightThemeV101);
        const cB = quantumThemeColorV101(o.colorB, isLightThemeV101);

        /* anel completo */
        qCtx.beginPath();
        drawOrbitPath(qCtx, cx, cy, rx, ry, tilt, oi, t);
        qCtx.setLineDash(o.dotted ? (isLightThemeV101 ? [3, 4] : [4, 5]) : []);
        qCtx.strokeStyle = isLightThemeV101
          ? `rgba(36,58,93,${o.trackAlpha * 1.55})`
          : `rgba(${cA[0]},${cA[1]},${cA[2]},${o.trackAlpha})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .18 : 0);
        qCtx.lineCap = "round";
        qCtx.shadowBlur = 0;
        qCtx.stroke();

        /* apoio de contraste somente no modo claro */
        if (isLightThemeV101) {
          qCtx.beginPath();
          drawOrbitPath(qCtx, cx, cy, rx, ry, tilt, oi, t);
          qCtx.setLineDash(o.dotted ? [3, 4] : []);
          qCtx.strokeStyle = `rgba(17,31,56,${Math.min(.16, o.trackAlpha * .9)})`;
          qCtx.lineWidth = o.width + 1.25;
          qCtx.stroke();
        }

        /* highlight móvel A */
        qCtx.beginPath();
        drawOrbitArc(qCtx, cx, cy, rx, ry, tilt, spin, o.lenA * Math.PI * 2, oi, t);
        qCtx.setLineDash([]);
        qCtx.strokeStyle =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${Math.min(1, o.alpha * (isLightThemeV101 ? 1.2 : 1) * (1 + ringInfluence * .08))})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .85 : .55);
        qCtx.lineCap = "round";
        qCtx.shadowColor =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${isLightThemeV101 ? .30 : .42})`;
        qCtx.shadowBlur = isLightThemeV101 ? 10 : 12;
        qCtx.stroke();

        /* highlight móvel B */
        qCtx.beginPath();
        drawOrbitArc(qCtx, cx, cy, rx, ry, tilt, spin + Math.PI, o.lenB * Math.PI * 2, oi, t);
        qCtx.strokeStyle =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${Math.min(1, (o.alpha * .78) * (isLightThemeV101 ? 1.15 : 1) * (1 + ringInfluence * .06))})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .38 : .2);
        qCtx.lineCap = "round";
        qCtx.shadowColor =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${isLightThemeV101 ? .20 : .30})`;
        qCtx.shadowBlur = isLightThemeV101 ? 7 : 9;
        qCtx.stroke();

        /*
          Sem o antigo "front accent micro arc".
          Era ele que criava os pequenos traços horizontais abaixo do robô.
        */
      });

      qParticles.forEach((p, idx) => {
        const o = qOrbits[p.orbit];
        const a = t * (o.speed + p.speed) + p.phase;
        const pt = orbitFlexPoint(cx, cy, qW * o.rx, qH * o.ry, a, o.tilt, p.orbit, t);
        const pulse = .55 + .45 * Math.sin(t * .0024 + idx);
        const alpha = p.alpha * (.76 + qHover * .34) * (.72 + pulse * .3);
        const col = idx % 3 === 0
          ? [255, 82, 108]
          : (idx % 3 === 1 ? [116, 173, 255] : [244, 247, 255]);
        const drawCol = quantumThemeColorV101(col, isLightThemeV101);

        qCtx.beginPath();
        qCtx.arc(pt.x, pt.y, p.size * (1 + qHover * .18), 0, Math.PI * 2);
        qCtx.shadowColor =
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${alpha * (isLightThemeV101 ? .22 : .52)})`;
        qCtx.shadowBlur = isLightThemeV101 ? 4 : 5;
        qCtx.fillStyle =
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${Math.min(1, alpha * (isLightThemeV101 ? 1.08 : 1))})`;
        qCtx.fill();
        qCtx.shadowBlur = 0;
      });

      qCtx.restore();
      requestAnimationFrame(drawQuantum);
    };
  } catch (error) {
    console.warn("Não foi possível aplicar o ajuste das órbitas v165.", error);
  }
})();


/* ===== v166 — suprime tangentes inferiores dos highlights ===== */
(() => {
  if (window.__portfolioNoOrbitTangentsV166) return;
  window.__portfolioNoOrbitTangentsV166 = true;

  /*
    Os highlights móveis ainda podiam formar pequenos segmentos horizontais
    no ponto mais baixo da elipse. Esta função quebra somente o trecho do
    highlight quando ele está na tangente inferior; o track completo do anel
    continua existindo, então a órbita não perde forma.
  */
  function drawOrbitHighlightNoFloor(ctx, cx, cy, rx, ry, tilt, start, len, orbitIndex, time) {
    let drawing = false;
    let previous = null;

    for (let j = 0; j <= 72; j++) {
      const a = start + len * (j / 72);
      const p = orbitFlexPoint(cx, cy, rx, ry, a, tilt, orbitIndex, time);

      const nearBottom = p.y > cy + Math.max(18, ry * .70);
      const nearHorizontal = previous ? Math.abs(p.y - previous.y) < 1.25 : false;
      const suppress = nearBottom && nearHorizontal;

      if (suppress) {
        drawing = false;
        previous = p;
        continue;
      }

      if (!drawing) {
        ctx.moveTo(p.x, p.y);
        drawing = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }

      previous = p;
    }
  }

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
      const isLightThemeV101 = document.body.classList.contains("portfolio-theme-light");

      qCtx.save();
      qCtx.globalCompositeOperation = isLightThemeV101 ? "source-over" : "lighter";

      qOrbits.forEach((o, oi) => {
        const rx = qW * o.rx;
        const ry = qH * o.ry;
        const tilt = o.tilt;
        const spin = t * o.speed + o.phase;
        const cA = quantumThemeColorV101(o.colorA, isLightThemeV101);
        const cB = quantumThemeColorV101(o.colorB, isLightThemeV101);

        /* track completo e discreto */
        qCtx.beginPath();
        drawOrbitPath(qCtx, cx, cy, rx, ry, tilt, oi, t);
        qCtx.setLineDash(o.dotted ? (isLightThemeV101 ? [3, 4] : [4, 5]) : []);
        qCtx.strokeStyle = isLightThemeV101
          ? `rgba(36,58,93,${o.trackAlpha * 1.55})`
          : `rgba(${cA[0]},${cA[1]},${cA[2]},${o.trackAlpha})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .18 : 0);
        qCtx.lineCap = "round";
        qCtx.shadowBlur = 0;
        qCtx.stroke();

        if (isLightThemeV101) {
          qCtx.beginPath();
          drawOrbitPath(qCtx, cx, cy, rx, ry, tilt, oi, t);
          qCtx.setLineDash(o.dotted ? [3, 4] : []);
          qCtx.strokeStyle = `rgba(17,31,56,${Math.min(.16, o.trackAlpha * .9)})`;
          qCtx.lineWidth = o.width + 1.25;
          qCtx.stroke();
        }

        /* highlight A — sem tangente inferior */
        qCtx.beginPath();
        drawOrbitHighlightNoFloor(
          qCtx, cx, cy, rx, ry, tilt,
          spin, o.lenA * Math.PI * 2, oi, t
        );
        qCtx.setLineDash([]);
        qCtx.strokeStyle =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${Math.min(1, o.alpha * (isLightThemeV101 ? 1.2 : 1) * (1 + ringInfluence * .08))})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .85 : .55);
        qCtx.lineCap = "round";
        qCtx.shadowColor =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${isLightThemeV101 ? .30 : .42})`;
        qCtx.shadowBlur = isLightThemeV101 ? 10 : 12;
        qCtx.stroke();

        /* highlight B — sem tangente inferior */
        qCtx.beginPath();
        drawOrbitHighlightNoFloor(
          qCtx, cx, cy, rx, ry, tilt,
          spin + Math.PI, o.lenB * Math.PI * 2, oi, t
        );
        qCtx.strokeStyle =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${Math.min(1, (o.alpha * .78) * (isLightThemeV101 ? 1.15 : 1) * (1 + ringInfluence * .06))})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .38 : .2);
        qCtx.lineCap = "round";
        qCtx.shadowColor =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${isLightThemeV101 ? .20 : .30})`;
        qCtx.shadowBlur = isLightThemeV101 ? 7 : 9;
        qCtx.stroke();
      });

      qParticles.forEach((p, idx) => {
        const o = qOrbits[p.orbit];
        const a = t * (o.speed + p.speed) + p.phase;
        const pt = orbitFlexPoint(cx, cy, qW * o.rx, qH * o.ry, a, o.tilt, p.orbit, t);
        const pulse = .55 + .45 * Math.sin(t * .0024 + idx);
        const alpha = p.alpha * (.76 + qHover * .34) * (.72 + pulse * .3);
        const col = idx % 3 === 0
          ? [255, 82, 108]
          : (idx % 3 === 1 ? [116, 173, 255] : [244, 247, 255]);
        const drawCol = quantumThemeColorV101(col, isLightThemeV101);

        qCtx.beginPath();
        qCtx.arc(pt.x, pt.y, p.size * (1 + qHover * .18), 0, Math.PI * 2);
        qCtx.shadowColor =
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${alpha * (isLightThemeV101 ? .22 : .52)})`;
        qCtx.shadowBlur = isLightThemeV101 ? 4 : 5;
        qCtx.fillStyle =
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${Math.min(1, alpha * (isLightThemeV101 ? 1.08 : 1))})`;
        qCtx.fill();
        qCtx.shadowBlur = 0;
      });

      qCtx.restore();
      requestAnimationFrame(drawQuantum);
    };
  } catch (error) {
    console.warn("Não foi possível aplicar o ajuste de tangentes v166.", error);
  }
})();


/* ===== v167 — remove qualquer microtrecho horizontal inferior ===== */
(() => {
  if (window.__portfolioNoOrbitFloorV167) return;
  window.__portfolioNoOrbitFloorV167 = true;

  function drawOrbitPathNoFloor(ctx, cx, cy, rx, ry, tilt, orbitIndex, time) {
    let drawing = false;
    let previous = null;

    for (let j = 0; j <= 180; j++) {
      const a = (Math.PI * 2) * (j / 180);
      const p = orbitFlexPoint(cx, cy, rx, ry, a, tilt, orbitIndex, time);

      const nearBottom = p.y > cy + Math.max(16, ry * .68);
      const nearlyHorizontal = previous ? Math.abs(p.y - previous.y) < 1.35 : false;
      const shortFloorSegment = nearBottom && nearlyHorizontal;

      if (shortFloorSegment) {
        drawing = false;
        previous = p;
        continue;
      }

      if (!drawing) {
        ctx.moveTo(p.x, p.y);
        drawing = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }

      previous = p;
    }
  }

  function drawOrbitHighlightNoFloorV167(ctx, cx, cy, rx, ry, tilt, start, len, orbitIndex, time) {
    let drawing = false;
    let previous = null;

    for (let j = 0; j <= 72; j++) {
      const a = start + len * (j / 72);
      const p = orbitFlexPoint(cx, cy, rx, ry, a, tilt, orbitIndex, time);

      const nearBottom = p.y > cy + Math.max(16, ry * .68);
      const nearlyHorizontal = previous ? Math.abs(p.y - previous.y) < 1.35 : false;
      const shortFloorSegment = nearBottom && nearlyHorizontal;

      if (shortFloorSegment) {
        drawing = false;
        previous = p;
        continue;
      }

      if (!drawing) {
        ctx.moveTo(p.x, p.y);
        drawing = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }

      previous = p;
    }
  }

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
      const isLightThemeV101 = document.body.classList.contains("portfolio-theme-light");

      qCtx.save();
      qCtx.globalCompositeOperation = isLightThemeV101 ? "source-over" : "lighter";

      qOrbits.forEach((o, oi) => {
        const rx = qW * o.rx;
        const ry = qH * o.ry;
        const tilt = o.tilt;
        const spin = t * o.speed + o.phase;
        const cA = quantumThemeColorV101(o.colorA, isLightThemeV101);
        const cB = quantumThemeColorV101(o.colorB, isLightThemeV101);

        /* track completo, mas sem a tangente inferior que parece chão */
        qCtx.beginPath();
        drawOrbitPathNoFloor(qCtx, cx, cy, rx, ry, tilt, oi, t);
        qCtx.setLineDash(o.dotted ? (isLightThemeV101 ? [3, 4] : [4, 5]) : []);
        qCtx.strokeStyle = isLightThemeV101
          ? `rgba(36,58,93,${o.trackAlpha * 1.55})`
          : `rgba(${cA[0]},${cA[1]},${cA[2]},${o.trackAlpha})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .18 : 0);
        qCtx.lineCap = "round";
        qCtx.shadowBlur = 0;
        qCtx.stroke();

        if (isLightThemeV101) {
          qCtx.beginPath();
          drawOrbitPathNoFloor(qCtx, cx, cy, rx, ry, tilt, oi, t);
          qCtx.setLineDash(o.dotted ? [3, 4] : []);
          qCtx.strokeStyle = `rgba(17,31,56,${Math.min(.16, o.trackAlpha * .9)})`;
          qCtx.lineWidth = o.width + 1.25;
          qCtx.stroke();
        }

        /* highlight A */
        qCtx.beginPath();
        drawOrbitHighlightNoFloorV167(
          qCtx, cx, cy, rx, ry, tilt,
          spin, o.lenA * Math.PI * 2, oi, t
        );
        qCtx.setLineDash([]);
        qCtx.strokeStyle =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${Math.min(1, o.alpha * (isLightThemeV101 ? 1.2 : 1) * (1 + ringInfluence * .08))})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .85 : .55);
        qCtx.lineCap = "round";
        qCtx.shadowColor =
          `rgba(${cA[0]},${cA[1]},${cA[2]},${isLightThemeV101 ? .30 : .42})`;
        qCtx.shadowBlur = isLightThemeV101 ? 10 : 12;
        qCtx.stroke();

        /* highlight B */
        qCtx.beginPath();
        drawOrbitHighlightNoFloorV167(
          qCtx, cx, cy, rx, ry, tilt,
          spin + Math.PI, o.lenB * Math.PI * 2, oi, t
        );
        qCtx.strokeStyle =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${Math.min(1, (o.alpha * .78) * (isLightThemeV101 ? 1.15 : 1) * (1 + ringInfluence * .06))})`;
        qCtx.lineWidth = o.width + (isLightThemeV101 ? .38 : .2);
        qCtx.lineCap = "round";
        qCtx.shadowColor =
          `rgba(${cB[0]},${cB[1]},${cB[2]},${isLightThemeV101 ? .20 : .30})`;
        qCtx.shadowBlur = isLightThemeV101 ? 7 : 9;
        qCtx.stroke();
      });

      qParticles.forEach((p, idx) => {
        const o = qOrbits[p.orbit];
        const a = t * (o.speed + p.speed) + p.phase;
        const pt = orbitFlexPoint(cx, cy, qW * o.rx, qH * o.ry, a, o.tilt, p.orbit, t);
        const pulse = .55 + .45 * Math.sin(t * .0024 + idx);
        const alpha = p.alpha * (.76 + qHover * .34) * (.72 + pulse * .3);
        const col = idx % 3 === 0
          ? [255, 82, 108]
          : (idx % 3 === 1 ? [116, 173, 255] : [244, 247, 255]);
        const drawCol = quantumThemeColorV101(col, isLightThemeV101);

        qCtx.beginPath();
        qCtx.arc(pt.x, pt.y, p.size * (1 + qHover * .18), 0, Math.PI * 2);
        qCtx.shadowColor =
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${alpha * (isLightThemeV101 ? .22 : .52)})`;
        qCtx.shadowBlur = isLightThemeV101 ? 4 : 5;
        qCtx.fillStyle =
          `rgba(${drawCol[0]},${drawCol[1]},${drawCol[2]},${Math.min(1, alpha * (isLightThemeV101 ? 1.08 : 1))})`;
        qCtx.fill();
        qCtx.shadowBlur = 0;
      });

      qCtx.restore();
      requestAnimationFrame(drawQuantum);
    };
  } catch (error) {
    console.warn("Não foi possível aplicar o ajuste das órbitas v167.", error);
  }
})();


/* ===== v168 — cleanup final abaixo da esfera ===== */
(() => {
  if (window.__portfolioOrbitCleanupV168) return;
  window.__portfolioOrbitCleanupV168 = true;

  const previousDrawQuantum = typeof drawQuantum === 'function' ? drawQuantum : null;
  if (!previousDrawQuantum) return;

  drawQuantum = function(t) {
    previousDrawQuantum(t);

    try {
      if (!qCtx || !quantumCanvas) return;

      const cx = qW / 2 + qPointerX * 5;
      const cy = qH / 2 + qPointerY * 3;

      const cleanupWidth = Math.max(118, qW * 0.20);
      const cleanupHeight = Math.max(10, qH * 0.022);
      const cleanupX = cx - cleanupWidth / 2;
      const cleanupY = cy + Math.max(84, qH * 0.185);

      qCtx.save();
      qCtx.globalCompositeOperation = 'destination-out';
      qCtx.fillStyle = '#000';
      qCtx.fillRect(cleanupX, cleanupY, cleanupWidth, cleanupHeight);
      qCtx.restore();
    } catch (_) {}
  };
})();


/* ===== v169 — estabilização final e limpeza inferior ampliada ===== */
(() => {
  if (window.__portfolioOrbitStableV169) return;
  window.__portfolioOrbitStableV169 = true;

  const field = document.querySelector('.quantum-field-v37');
  const canvas = document.getElementById('quantumCanvas');

  /* Evita a "tremida" de bootstrap: zera influência do ponteiro e
     deixa o campo aparecer só quando tamanho/fontes/layout já assentaram. */
  try {
    qPointerX = 0;
    qPointerY = 0;
    qRingPullX = 0;
    qRingPullY = 0;
    qHover = 0;
  } catch (_) {}

  function revealStableOrbit() {
    try {
      if (typeof resizeQuantum === 'function') resizeQuantum();
      qPointerX = 0;
      qPointerY = 0;
      qRingPullX = 0;
      qRingPullY = 0;
      qHover = 0;
    } catch (_) {}

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        field?.classList.add('is-orbit-ready-v169');
      });
    });
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => setTimeout(revealStableOrbit, 90)).catch(() => {
      setTimeout(revealStableOrbit, 150);
    });
  } else {
    setTimeout(revealStableOrbit, 150);
  }

  window.addEventListener('load', () => setTimeout(revealStableOrbit, 80), { once:true });

  /* Camada de limpeza final: pega também o pequeno resíduo lateral,
     mas continua limitada a uma faixa rasa abaixo da esfera. */
  if (typeof drawQuantum === 'function') {
    const stableDraw = drawQuantum;

    drawQuantum = function(t) {
      stableDraw(t);

      try {
        if (!qCtx || !canvas || !qW || !qH) return;

        const cx = qW / 2 + qPointerX * 5;
        const cy = qH / 2 + qPointerY * 3;

        const cleanupWidth = Math.max(190, qW * 0.42);
        const cleanupHeight = Math.max(13, qH * 0.029);
        const cleanupX = cx - cleanupWidth / 2;
        const cleanupY = cy + Math.max(82, qH * 0.178);

        qCtx.save();
        qCtx.globalCompositeOperation = 'destination-out';
        qCtx.fillStyle = '#000';
        qCtx.fillRect(cleanupX, cleanupY, cleanupWidth, cleanupHeight);
        qCtx.restore();
      } catch (_) {}
    };
  }
})();
