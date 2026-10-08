(() => {
  if (window.__portfolioRefinementsV173) return;
  window.__portfolioRefinementsV173 = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* esfera: camada separada para manter a cor na borda */
  const orb = $('#agentButton.brain-orb');
  if (orb && !orb.querySelector('.orb-face-shade-v173')) {
    const shade = document.createElement('span');
    shade.className = 'orb-face-shade-v173';
    shade.setAttribute('aria-hidden','true');

    const edge = document.createElement('span');
    edge.className = 'orb-edge-v173';
    edge.setAttribute('aria-hidden','true');

    orb.appendChild(shade);
    orb.appendChild(edge);
  }

  /* alinhamento mais visual */
  const alignIcons = {
    left:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h10M3 10h14M3 15h8"/></svg>',
    center:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5h10M3 10h14M6 15h8"/></svg>',
    right:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5h10M3 10h14M9 15h8"/></svg>'
  };

  $$('[data-footer-align]').forEach(button => {
    const key = button.dataset.footerAlign;
    if (!alignIcons[key]) return;
    button.setAttribute('aria-label', button.textContent.trim());
    button.title = button.textContent.trim();
    button.innerHTML = alignIcons[key];
  });

  /* a cor existente continua sendo a fonte de verdade;
     estas variáveis derivadas fazem chips/bolhas seguirem a mesma família */
  const accentInput = $('#editorAccentV82');

  function currentAccent() {
    return accentInput?.value ||
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
      '#6ea8ff';
  }

  function syncAccentFamily(color = currentAccent()) {
    document.documentElement.style.setProperty('--system-accent', color);
  }

  $$('[data-accent]').forEach(button => {
    button.addEventListener('click', () => {
      requestAnimationFrame(() => syncAccentFamily(button.dataset.accent));
    });
  });

  accentInput?.addEventListener('input', () => syncAccentFamily(accentInput.value));
  accentInput?.addEventListener('change', () => syncAccentFamily(accentInput.value));

  /* restaura/salva pode trocar --accent sem disparar input */
  const root = document.documentElement;
  if ('MutationObserver' in window) {
    new MutationObserver(() => syncAccentFamily()).observe(root,{
      attributes:true,
      attributeFilter:['style']
    });
  }

  syncAccentFamily();
})();