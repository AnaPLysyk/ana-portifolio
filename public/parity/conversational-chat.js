(() => {
  if (window.__portfolioConversationalChatV172) return;
  window.__portfolioConversationalChatV172 = true;

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

  const headTitle = $('.chat-head strong');
  const headSubtitle = $('.chat-head span');
  if (headTitle) headTitle.textContent = 'Ana';
  if (headSubtitle) headSubtitle.textContent = 'converse comigo sobre minha trajetória, projetos e competências';

  const promptLabels = {
    sobre: 'Quem é você?',
    experiencia: 'Sua trajetória',
    automacao: 'Automação',
    projetos: 'Projetos'
  };

  $$('[data-prompt]').forEach(button => {
    const label = promptLabels[button.dataset.prompt];
    if (label) button.textContent = label;
  });

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
    el.setAttribute('aria-label', 'Ana está digitando');
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
      if (content.includes(token)) score += 1.2;
    });

    return score;
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
    if (/quem|sobre|perfil|voce|você|ana/.test(q)) return 'perfil';

    return '';
  }

  function selectContexts(question) {
    const ranked = contexts()
      .map(item => ({ item, score: scoreContext(item, question) }))
      .filter(row => row.score >= 2.5)
      .sort((a, b) => b.score - a.score);

    if (ranked.length) return ranked.slice(0, 2).map(row => row.item);

    if (lastTopic) {
      return contexts()
        .map(item => ({ item, score: scoreContext(item, lastTopic) }))
        .filter(row => row.score >= 2.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, 1)
        .map(row => row.item);
    }

    return [];
  }

  function firstPerson(raw) {
    let text = String(raw || '').replace(/\s+/g, ' ').trim();

    const replacements = [
      [/Ana Paula de Lima Lysyk é QA Analyst Pleno/gi, 'Eu sou QA Analyst Pleno'],
      [/Ana Paula de Lima Lysyk é/gi, 'Eu sou'],
      [/Ana já trabalhou/gi, 'Eu já trabalhei'],
      [/Ana trabalhou/gi, 'Eu trabalhei'],
      [/Ana está cursando/gi, 'Estou cursando'],
      [/Ana está aprofundando/gi, 'Eu estou aprofundando'],
      [/Ana está/gi, 'Eu estou'],
      [/Ana segue desenvolvendo/gi, 'Eu sigo desenvolvendo'],
      [/Ana valida/gi, 'Eu valido'],
      [/Ana usa/gi, 'Eu uso'],
      [/Ana utiliza/gi, 'Eu utilizo'],
      [/Ana desenvolve/gi, 'Eu desenvolvo'],
      [/Ana trabalha/gi, 'Eu trabalho'],
      [/Na automação, Ana/gi, 'Na automação, eu'],
      [/Em API e integração, Ana/gi, 'Em API e integração, eu'],
      [/No banco, Ana/gi, 'No banco, eu'],
      [/No fluxo de QA, Ana/gi, 'No meu fluxo de QA, eu'],
      [/Você pode falar com a Ana/gi, 'Você pode falar comigo'],
      [/desenvolvimentos atuais da Ana/gi, 'meus desenvolvimentos atuais'],
      [/projetos atuais da Ana/gi, 'meus projetos atuais'],
      [/da Ana/gi, 'do meu portfólio'],
      [/Entre os cursos já realizados estão/gi, 'Entre os cursos que eu já realizei estão'],
      [/Em desenvolvimento técnico, aprofunda/gi, 'Em desenvolvimento técnico, estou aprofundando']
    ];

    replacements.forEach(([pattern, value]) => {
      text = text.replace(pattern, value);
    });

    text = text
      .replace(/\bela está\b/gi, 'eu estou')
      .replace(/\bela usa\b/gi, 'eu uso')
      .replace(/\bela trabalha\b/gi, 'eu trabalho')
      .replace(/\bela valida\b/gi, 'eu valido')
      .replace(/\bela desenvolve\b/gi, 'eu desenvolvo');

    return text;
  }

  function trimContent(content, max = 560) {
    const text = firstPerson(content);
    if (text.length <= max) return text;

    const cut = text.slice(0, max);
    const lastSentence = Math.max(
      cut.lastIndexOf('. '),
      cut.lastIndexOf('! '),
      cut.lastIndexOf('? ')
    );

    return lastSentence > 220
      ? cut.slice(0, lastSentence + 1)
      : cut.trim() + '…';
  }

  function friendlyLead(topic, question) {
    const q = normalize(question);

    if (/^(oi|ola|olá|bom dia|boa tarde|boa noite)/.test(q)) {
      return 'Oi! Tudo bem? ';
    }

    if (topic === 'automação') {
      return 'Claro. Na automação, eu venho construindo minha prática de forma bem aplicada ao trabalho de QA. ';
    }

    if (topic === 'projetos') {
      return 'Claro. Meus projetos são uma forma bem prática de mostrar como eu penso e organizo qualidade. ';
    }

    if (topic === 'trajetória') {
      return 'Claro. Minha trajetória foi acontecendo por etapas, e cada uma delas contribuiu bastante para o jeito como eu trabalho hoje. ';
    }

    if (topic === 'API e integrações') {
      return 'Sim. Essa é uma parte mais técnica do meu dia a dia e eu gosto bastante de investigar esse tipo de fluxo. ';
    }

    if (topic === 'perfil') {
      return 'Claro. ';
    }

    return 'Claro. ';
  }

  function closingFor(topic) {
    if (topic === 'automação') {
      return ' Eu gosto de deixar claro que automação já faz parte do meu trabalho, mas ainda é uma frente que estou aprofundando.';
    }

    if (topic === 'projetos') {
      return ' Se quiser, posso te contar um pouco mais sobre um projeto específico.';
    }

    if (topic === 'trajetória') {
      return ' Se quiser, posso detalhar uma das experiências ou focar só na minha evolução dentro de QA.';
    }

    if (topic === 'ferramentas') {
      return ' Também posso separar o que eu uso no dia a dia do que ainda estou aprofundando tecnicamente.';
    }

    return '';
  }

  function responseFor(question) {
    const topic = detectTopic(question);
    if (topic) lastTopic = topic;

    const selected = selectContexts(question);

    if (!selected.length) {
      return 'Essa informação não está registrada no meu portfólio hoje, então prefiro não inventar. Mas pode me perguntar sobre minha trajetória, projetos, automação, API e integrações, ferramentas, formação ou formas de contato.';
    }

    const primary = trimContent(selected[0].content, 500);
    let body = primary;

    if (selected[1] && selected[1].id !== selected[0].id) {
      const secondary = trimContent(selected[1].content, 240);
      if (secondary && !primary.includes(secondary)) body += ' ' + secondary;
    }

    return (friendlyLead(topic, question) + body + closingFor(topic))
      .replace(/\s+/g, ' ')
      .trim();
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
    const response = responseFor(value);
    const delay = Math.min(1350, Math.max(560, 320 + response.length * 1.25));

    await new Promise(resolve => setTimeout(resolve, delay));

    typing.remove();
    addMessage(response, 'bot');
    setBusy(false);
    chatInput.focus();
  }

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
      sobre: 'Oi, Ana. Me conta um pouco sobre você.',
      experiencia: 'Me conta um pouco sobre a sua trajetória profissional.',
      api: 'Como você trabalha com API e integrações?',
      projetos: 'Quais projetos representam melhor o seu trabalho?',
      ferramentas: 'Quais ferramentas você usa no dia a dia?',
      automacao: 'Como você trabalha com automação?',
      banco: 'Como você valida banco e persistência?'
    };

    sendMessage(prompts[button.dataset.prompt] || button.textContent);
  }, true);

  /* Para uma conversa nova, a apresentação já nasce em primeira pessoa. */
  if (!chatMessages.querySelector('.msg.user')) {
    const firstBot = chatMessages.querySelector('.msg.bot');

    if (firstBot) {
      firstBot.textContent = 'Oi, tudo bem? Eu sou a Ana. Posso te contar sobre minha trajetória, meus projetos, minhas competências e a forma como eu trabalho com QA. Pode perguntar do seu jeito.';
      persistHistory();
    } else {
      addMessage('Oi, tudo bem? Eu sou a Ana. Posso te contar sobre minha trajetória, meus projetos, minhas competências e a forma como eu trabalho com QA. Pode perguntar do seu jeito.', 'bot');
    }
  }
})();