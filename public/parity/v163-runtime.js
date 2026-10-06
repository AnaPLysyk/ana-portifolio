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

    const gap = innerWidth <= 480 ? 28 : (innerWidth <= 760 ? 30 : 34);

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
