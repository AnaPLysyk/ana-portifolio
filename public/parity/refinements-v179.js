/* ===== v179 — composição de seção simplificada ===== */
(() => {
  if (window.__portfolioSectionDesignV179) return;
  window.__portfolioSectionDesignV179 = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  function enhance(){
    const section=$('.section-design-v178');
    if(!section || section.dataset.v179Ready==='true') return;
    section.dataset.v179Ready='true';

    const rows=$$('.design-row-v178',section);
    const sectionRow=rows[0];
    const layoutRow=rows[1];
    const iconRow=rows[2];

    const iconOptions=$('#sectionIconOptionsV178');
    const detailGrid=section.querySelector('.icon-detail-grid-v178');
    const colorRow=section.querySelector('.icon-color-v178');

    if(!iconRow || !iconOptions || !detailGrid || !colorRow) return;

    iconRow.classList.add('icon-row-v179');

    const iconShell=document.createElement('div');
    iconShell.className='icon-picker-shell-v179';

    const summary=document.createElement('div');
    summary.className='icon-picker-summary-v179';
    summary.innerHTML=`
      <div class="icon-picker-preview-v179" id="iconPickerPreviewV179"></div>
      <div class="icon-picker-copy-v179">
        <strong id="iconPickerNameV179">Ícone da seção</strong>
        <span>Escolha um símbolo só quando ele ajudar a leitura.</span>
      </div>
      <button type="button" class="icon-picker-toggle-v179" id="iconPickerToggleV179" aria-expanded="false">
        Trocar
      </button>
    `;

    const library=document.createElement('div');
    library.className='icon-library-v179';
    library.appendChild(iconOptions);

    iconShell.appendChild(summary);
    iconShell.appendChild(library);

    const rowValue=iconRow.children[1];
    if(rowValue) rowValue.replaceWith(iconShell);
    else iconRow.appendChild(iconShell);

    const sizeBlock=detailGrid.children[0];
    const positionBlock=detailGrid.children[1];

    const controls=document.createElement('div');
    controls.className='icon-controls-strip-v179';

    const sizeWrap=document.createElement('div');
    sizeWrap.className='control-block-v179';
    sizeWrap.innerHTML='<span class="control-label-v179">Tamanho</span>';
    const range=sizeBlock?.querySelector('.appearance-range-v178');
    if(range) sizeWrap.appendChild(range);

    const positionWrap=document.createElement('div');
    positionWrap.className='control-block-v179';
    positionWrap.innerHTML='<span class="control-label-v179">Posição</span>';
    const positionButtons=positionBlock?.querySelector('.layout-options-v178');
    if(positionButtons){
      positionButtons.classList.add('position-toggle-v179');
      positionWrap.appendChild(positionButtons);
    }

    const colorWrap=document.createElement('div');
    colorWrap.className='control-block-v179';
    colorWrap.innerHTML='<span class="control-label-v179">Cor</span>';

    const compactColor=document.createElement('div');
    compactColor.className='icon-color-compact-v179';

    const systemCheckbox=$('#sectionIconUseSystemV178');
    const colorInput=$('#sectionIconColorV178');

    const systemButton=document.createElement('button');
    systemButton.type='button';
    systemButton.className='icon-system-toggle-v179';
    systemButton.id='iconSystemToggleV179';
    systemButton.textContent='Sistema';

    if(colorInput) compactColor.appendChild(systemButton);
    if(colorInput) compactColor.appendChild(colorInput);

    colorWrap.appendChild(compactColor);

    controls.appendChild(sizeWrap);
    controls.appendChild(positionWrap);
    controls.appendChild(colorWrap);

    iconShell.appendChild(controls);

    const toggle=$('#iconPickerToggleV179');
    toggle?.addEventListener('click',()=>{
      const open=library.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?'Fechar':'Trocar';
    });

    systemButton.addEventListener('click',()=>{
      if(!systemCheckbox) return;
      systemCheckbox.checked=!systemCheckbox.checked;
      systemCheckbox.dispatchEvent(new Event('change',{bubbles:true}));
      refresh();
    });

    const labels={
      none:'Sem ícone',
      github:'GitHub',
      timeline:'Linha do tempo',
      code:'Código',
      terminal:'Terminal',
      check:'Validação',
      database:'Banco de dados',
      briefcase:'Trabalho',
      spark:'Destaque',
      user:'Perfil',
      link:'Link',
      mail:'Contato'
    };

    function refresh(){
      const selected=$('.icon-option-v178.is-selected',iconOptions) || $('.icon-option-v178',iconOptions);
      const preview=$('#iconPickerPreviewV179');
      const name=$('#iconPickerNameV179');

      if(selected && preview){
        preview.dataset.icon=selected.dataset.icon||'none';
        preview.innerHTML=selected.innerHTML;
      }
      if(name){
        name.textContent=labels[selected?.dataset.icon] || 'Ícone da seção';
      }

      const useSystem=systemCheckbox?.checked!==false;
      systemButton.classList.toggle('is-active',useSystem);

      if(colorInput){
        colorInput.disabled=useSystem;
        colorInput.style.opacity=useSystem?'.42':'1';
      }
    }

    iconOptions.addEventListener('click',()=>{
      setTimeout(()=>{
        refresh();
        library.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded','false');
        if(toggle) toggle.textContent='Trocar';
      },0);
    });

    $('#sectionDesignTargetV178')?.addEventListener('change',()=>setTimeout(refresh,0));
    $('#sectionIconSizeV178')?.addEventListener('input',refresh);
    colorInput?.addEventListener('input',refresh);
    systemCheckbox?.addEventListener('change',refresh);

    refresh();

    /* texto mais simples */
    const heading=section.querySelector('.editor-section-title-v85 h3');
    const kicker=section.querySelector('.editor-section-title-v85 small');
    const intro=section.querySelector(':scope > p');

    if(kicker) kicker.textContent='DESIGN DA SEÇÃO';
    if(heading) heading.textContent='Composição da seção';
    if(intro) intro.textContent='Escolha o layout e, se fizer sentido, um ícone para acompanhar o título.';

    const rowLabels=$$('.design-label-v178',section);
    if(rowLabels[0]) rowLabels[0].textContent='Seção';
    if(rowLabels[1]) rowLabels[1].textContent='Layout';
    if(rowLabels[2]) rowLabels[2].textContent='Ícone';
  }

  const run=()=>setTimeout(enhance,0);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',run,{once:true});
  }else{
    run();
  }

  setTimeout(enhance,120);
  setTimeout(enhance,320);
})();