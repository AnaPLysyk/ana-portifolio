(() => {
  if (window.__portfolioConversationalChatV164) return;
  window.__portfolioConversationalChatV164 = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const chatForm = $('#chatForm');
  const chatInput = $('#chatInput');
  const chatMessages = $('#chatMessages');
  const agentChat = $('#agentChat');
  const agentStage = $('.agent-stage');
  const storageKey = 'ana-portfolio-brain-history-v1';
  const contextStore = 'ana_portfolio_ai_contexts_v1';

  if (!chatForm || !chatInput || !chatMessages) return;

  let answering = false;
  let lastTopic = '';

  function scrollBottom() {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: 'smooth'
    });
  }

  function persistHistory() {
    try {
      const items = $$('.msg', chatMessages)
        .filter(el => !el.classList.contains('typing-v164'))
        .slice(-24)
        .map(el => ({
          who: el.classList.contains('user') ? 'user' : 'bot',
          text: el.textContent || ''
        }));

      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  }

  function addMessage(text, who = 'bot') {
    const el = document.createElement('div');
    el.className = 'msg ' + who;
    el.textContent = String(text || '').trim();
    chatMessages.appendChild(el);
    persistHistory();
    scrollBottom();
    return el;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'msg bot typing-v164';
    el.setAttribute('aria-label', 'Assistente digitando');
    el.innerHTML = [
      '<span class="typing-dot-v164"></span>',
      '<span class="typing-dot-v164"></span>',
      '<span class="typing-dot-v164"></span>'
    ].join('');
    chatMessages.appendChild(el);
    scrollBottom();
    return el;
  }

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function contexts() {
    if (Array.isArray(window.__anaRuntimeContexts)) {
      return window.__anaRuntimeContexts
        .filter(item => item && item.enabled !== false)
        .map(item => ({ ...item }));
    }

    try {
      const saved = JSON.parse(localStorage.getItem(contextStore) || '[]');
      if (Array.isArray(saved) && saved.length) {
        return saved.filter(item => item && item.enabled !== false);
      }
    } catch {}

    return Array.isArray(window.__anaDefaultContexts)
      ? window.__anaDefaultContexts.filter(item => item && item.enabled !== false)
      : [];
  }

  function scoreContext(item, question) {
    const q = normalize(question);
    const tokens = q.split(' ').filter(token => token.length >= 3);

    const title = normalize(item.title);
    const category = normalize(item.category);
    const content = normalize(item.content);
    const keywords = String(item.keywords || '')
      .split(',')
      .map(normalize)
      .filter(Boolean);

    let score = 0;

    keywords.forEach(keyword => {
      if (keyword && q.includes(keyword)) score += 8;
    });

    tokens.forEach(token => {
      if (title.includes(token)) score += 4;
      if (category.includes(token)) score += 2.5;
      if (content.includes(token)) score += 1.25;
    });

    return score;
  }

  function selectContexts(question) {
    const ranked = contexts()
      .map(item => ({ item, score: scoreContext(item, question) }))
      .filter(row => row.score >= 2.5)
      .sort((a, b) => b.score - a.score);

    if (!ranked.length && lastTopic) {
      return contexts()
        .map(item => ({ item, score: scoreContext(item, lastTopic) }))
        .filter(row => row.score >= 2.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, 1)
        .map(row => row.item);
    }

    return ranked.slice(0, 2).map(row => row.item);
  }

  function detectTopic(question) {
    const q = normalize(question);
    if (/automat|playwright|typescript|bdd|e2e/.test(q)) return 'automação';
    if (/api|postman|rest|json|payload|integrac/.test(q)) return 'API e integrações';
    if (/banco|sql|mysql|persist/.test(q)) return 'banco e persistência';
    if (/projet|github|repo|orchestrator|smart|quality control/.test(q)) return 'projetos';
    if (/experi|trajet|trabalh|empresa|carreira/.test(q)) return 'trajetória';
    if (/ferrament|stack|qase|jira|sonar|git|keycloak/.test(q)) return 'ferramentas';
    if (/formac|curso|faculdade|ciencia da computacao|udemy/.test(q)) return 'formação';
    if (/contato|linkedin|email|whatsapp|telefone/.test(q)) return 'contato';
    if (/quem|sobre|perfil|ana/.test(q)) return 'perfil';
    return '';
  }

  function trimContent(content, max = 560) {
    const text = String(content || '').replace(/\s+/g, ' ').trim();
    if (text.length <= max) return text;

    const cut = text.slice(0, max);
    const lastSentence = Math.max(
      cut.lastIndexOf('. '),
      cut.lastIndexOf('! '),
      cut.lastIndexOf('? ')
    );

    return (lastSentence > 220 ? cut.slice(0, lastSentence + 1) : cut.trim() + '…');
  }

  function friendlyLead(topic, question) {
    const q = normalize(question);

    if (/como ela|como a ana/.test(q)) {
      if (topic === 'automação') return 'Claro. Na automação, a Ana está construindo essa prática de forma bem aplicada ao trabalho de QA.';
      if (topic === 'API e integrações') return 'Sim. Essa é uma parte bem técnica do trabalho dela.';
      if (topic === 'projetos') return 'Claro. Os projetos ajudam bastante a enxergar como ela organiza e aplica o trabalho de QA.';
      if (topic === 'trajetória') return 'Claro. A trajetória dela mostra uma evolução bem gradual, saindo de experiências de atendimento e investigação até chegar ao QA.';
    }

    if (/por que|porque/.test(q)) return 'Pelo que a Ana deixou registrado no portfólio,';
    if (/me conte|fala|fale|conta/.test(q)) return 'Claro. ';
    if (/qual|quais/.test(q)) return 'Sim. ';
    if (/oi|ola|bom dia|boa tarde|boa noite/.test(q)) return 'Oi! Que bom ter você por aqui. ';

    return topic ? 'Claro. ' : '';
  }

  function conversationalResponse(question) {
    const topic = detectTopic(question);
    if (topic) lastTopic = topic;

    const selected = selectContexts(question);

    if (!selected.length) {
      return 'Eu consigo te contar bastante coisa sobre a Ana, mas prefiro não inventar o que não está registrado no portfólio. Você pode me perguntar sobre trajetória, automação, projetos, API e integrações, ferramentas, formação ou formas de contato.';
    }

    const lead = friendlyLead(topic, question);
    const primary = trimContent(selected[0].content, 500);

    let body = primary;

    if (selected[1] && selected[1].id !== selected[0].id) {
      const secondary = trimContent(selected[1].content, 260);
      if (secondary && !primary.includes(secondary)) {
        body += ' ' + secondary;
      }
    }

    const q = normalize(question);
    let close = '';

    if (/automat|playwright|typescript/.test(q)) {
      close = ' O ponto importante é que ela apresenta automação como uma frente em evolução, sem tentar passar uma experiência maior do que realmente tem.';
    } else if (/projet|github|repo/.test(q)) {
      close = ' Se quiser, eu também posso detalhar um projeto específico.';
    } else if (/experi|trajet|carreira/.test(q)) {
      close = ' Se quiser, posso te contar essa trajetória por empresa ou focar só na evolução dela dentro de QA.';
    } else if (/ferrament|stack/.test(q)) {
      close = ' Posso separar também o que ela usa no dia a dia do que ainda está aprofundando tecnicamente.';
    }

    return (lead + body + close).replace(/\s+/g, ' ').trim();
  }

  function setBusy(value) {
    answering = value;
    chatInput.disabled = value;
    const button = chatForm.querySelector('button[type="submit"]');
    if (button) button.disabled = value;
  }

  async function sendMessage(text) {
    const value = String(text || '').trim();
    if (!value || answering) return;

    if (!agentChat?.classList.contains('open')) {
      agentChat?.classList.add('open');
      agentStage?.classList.add('chat-active');
    }

    addMessage(value, 'user');
    chatInput.value = '';
    setBusy(true);

    const typing = showTyping();
    const response = conversationalResponse(value);

    const delay = Math.min(1250, Math.max(520, 320 + response.length * 1.35));

    await new Promise(resolve => setTimeout(resolve, delay));

    typing.remove();
    addMessage(response, 'bot');
    setBusy(false);
    chatInput.focus();
  }

  /* Captura antes do listener legado para evitar resposta duplicada. */
  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    sendMessage(chatInput.value);
  }, true);

  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-prompt]');
    if (!button || !agentChat?.contains(button)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const prompts = {
      sobre: 'Quem é a Ana?',
      experiencia: 'Me conta um pouco sobre a trajetória profissional da Ana.',
      api: 'Como a Ana trabalha com API e integrações?',
      projetos: 'Quais projetos representam melhor o trabalho da Ana?',
      ferramentas: 'Quais ferramentas a Ana usa no dia a dia?',
      automacao: 'Como ela trabalha com automação?',
      banco: 'Como ela valida banco e persistência?'
    };

    sendMessage(prompts[button.dataset.prompt] || button.textContent);
  }, true);

  /* Saudação mais natural para uma sessão nova. */
  if (!chatMessages.querySelector('.msg.user')) {
    const firstBot = chatMessages.querySelector('.msg.bot');
    if (firstBot && /Oi\. Eu sou o assistente da Ana/i.test(firstBot.textContent || '')) {
      firstBot.textContent = 'Oi! Eu sou o assistente da Ana. Posso te contar sobre a trajetória dela, projetos, competências e a forma como ela trabalha com QA. Pode perguntar do seu jeito.';
      persistHistory();
    }
  }
})();