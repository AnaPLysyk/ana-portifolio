(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  if (window.__photoEditorParityLoaded) return;
  window.__photoEditorParityLoaded = true;

  const studio = $('#editorStudio');
  const owner = $('.editor-owner-v85');
  const ownerPhoto = $('#editorOwnerPhotoV86');
  const identityBlock = $('.editor-identity-v86');
  const oldPhotoWrap = $('.editor-photo-wrap-v88');
  const detachedIdentityPhoto = $('#editorIdentityPhotoV86');
  const originalFileInput = $('#editorIdentityPhotoInputV86');

  let pendingPhoto = '';

  /* A foto duplicada sai do conteúdo. A referência é mantida em memória
     apenas porque o protótipo legado ainda a usa internamente ao salvar. */
  oldPhotoWrap?.remove();
  identityBlock?.classList.add('editor-identity-single-photo');

  let topPhotoWrap = $('.editor-owner-photo-wrap-parity');
  if (owner && ownerPhoto && !topPhotoWrap) {
    topPhotoWrap = document.createElement('div');
    topPhotoWrap.className = 'editor-owner-photo-wrap-parity';
    owner.insertBefore(topPhotoWrap, ownerPhoto);
    topPhotoWrap.appendChild(ownerPhoto);

    const editButton = document.createElement('button');
    editButton.id = 'editorPhotoEditParity';
    editButton.className = 'editor-owner-photo-edit-parity';
    editButton.type = 'button';
    editButton.title = 'Editar foto';
    editButton.setAttribute('aria-label', 'Editar foto');
    editButton.innerHTML = '<span aria-hidden="true">✎</span>';
    topPhotoWrap.appendChild(editButton);
  }

  /* Remove o listener antigo do input, que aplicava a imagem imediatamente
     no portfólio, substituindo o elemento por um clone limpo. */
  let fileInput = originalFileInput;
  if (originalFileInput) {
    const clone = originalFileInput.cloneNode(true);
    originalFileInput.replaceWith(clone);
    fileInput = clone;
  }

  const editButton = $('#editorPhotoEditParity');

  const savedPortfolioPhoto = () =>
    $('.brand-photo')?.src ||
    $('.profile-peek img')?.src ||
    '';

  const resetPhotoPreview = () => {
    pendingPhoto = '';
    window.__portfolioPendingPhoto = '';
    const saved = savedPortfolioPhoto();
    if (ownerPhoto && saved) ownerPhoto.src = saved;
    if (fileInput) fileInput.value = '';
  };

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
      window.__portfolioPendingPhoto = pendingPhoto;

      /* Só a foto do cabeçalho muda: é a prévia da edição. */
      if (ownerPhoto && pendingPhoto) ownerPhoto.src = pendingPhoto;

      window.__portfolioEditorDirtyV146 = true;
      const status = $('#editorStatusV82');
      if (status) {
        status.textContent = 'Nova foto em prévia. Ela será aplicada ao portfólio somente depois de salvar.';
      }
    };
    reader.readAsDataURL(file);
  });

  /* Inclui a foto no resumo antes da confirmação. */
  $('#editorSaveV82')?.addEventListener('click', () => {
    if (!pendingPhoto) return;
    setTimeout(() => {
      const summary = $('#editorConfirmSummaryV146');
      if (!summary || summary.querySelector('[data-photo-parity-summary]')) return;

      const group = document.createElement('div');
      group.className = 'change-group-v146';
      group.dataset.photoParitySummary = '1';
      group.innerHTML = '<strong>Perfil</strong><span>Foto atualizada</span>';
      summary.appendChild(group);
    }, 0);
  }, true);

  /* O commit acontece somente no botão final "Confirmar e salvar". */
  $('#editorConfirmSaveV146')?.addEventListener('click', () => {
    if (!pendingPhoto) return;

    const name = $('#editorIdentityNameV86')?.value?.trim() || 'Ana Paula de Lima Lysyk';

    $$('.brand-photo, .profile-peek img').forEach((img) => {
      img.src = pendingPhoto;
      img.alt = name;
    });

    if (ownerPhoto) ownerPhoto.src = pendingPhoto;

    /* O savePage legado lê essa referência. Atualizá-la só aqui garante
       que a foto não seja persistida antes da confirmação. */
    if (detachedIdentityPhoto) detachedIdentityPhoto.src = pendingPhoto;

    setTimeout(() => {
      pendingPhoto = '';
      window.__portfolioPendingPhoto = '';
      if (fileInput) fileInput.value = '';
    }, 0);
  }, true);

  /* Cancelar ou sair desfaz a prévia. */
  ['editorRelockV82', 'editorStudioMinimize', 'editorExitConfirmButtonV155'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', () => {
      setTimeout(resetPhotoPreview, 0);
    }, true);
  });

  if (studio && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      const closed = studio.hidden || !document.body.classList.contains('editor-studio-open');
      if (closed && pendingPhoto) resetPhotoPreview();
    });
    observer.observe(studio, { attributes: true, attributeFilter: ['hidden', 'style'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
})();
