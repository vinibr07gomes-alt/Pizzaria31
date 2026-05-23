  // ── Search toggle
  const searchToggle = document.getElementById('searchToggle');
  const headerSearchWrap = document.getElementById('headerSearchWrap');
  const searchClose = document.getElementById('searchClose');
  const searchInputEl = document.getElementById('searchInput');

  function openSearch() {
    headerSearchWrap.classList.add('open');
    searchToggle.classList.add('active');
    document.querySelector('.header-inner').classList.add('search-active');
    setTimeout(() => searchInputEl && searchInputEl.focus(), 220);
  }

  function closeSearch() {
    headerSearchWrap.classList.remove('open');
    searchToggle.classList.remove('active');
    document.querySelector('.header-inner').classList.remove('search-active');
    if (searchInputEl) {
      searchInputEl.value = '';
      searchInputEl.dispatchEvent(new Event('input'));
    }
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose)  searchClose.addEventListener('click', closeSearch);

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && headerSearchWrap && headerSearchWrap.classList.contains('open')) {
      closeSearch();
    }
  });

  // ── FAB Menu
  const fabMain = document.getElementById('fabMain');
  const fabSocials = document.getElementById('fabSocials');
  const fabTop = document.getElementById('fabTop');

  fabMain.addEventListener('click', () => {
    const isOpen = fabSocials.classList.toggle('open');
    fabMain.classList.toggle('open', isOpen);
    fabMain.textContent = isOpen ? '+' : '🍕';
  });
  fabSocials.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      fabSocials.classList.remove('open');
      fabMain.classList.remove('open');
      fabMain.textContent = '🍕';
    });
  });
  window.addEventListener('scroll', () => {
    fabTop.classList.toggle('visible', window.scrollY > 300);
  });
  fabTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const allCards = document.querySelectorAll('.item-card');
  const allBlocks = document.querySelectorAll('.menu-block');
  const searchInput = document.getElementById('searchInput');
  const emptyState = document.getElementById('emptyState');
  const pizzaSubcats = document.getElementById('pizzaSubcats');

  // ── Tab filter
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      searchInput.value = '';

      const tab = btn.dataset.tab;
      pizzaSubcats.classList.toggle('visible', tab === 'pizzas');

      // Reset pizza subcat
      document.querySelectorAll('.subcat-pill').forEach(p => p.classList.remove('active'));
      const allPill = document.querySelector('[data-subcat="all-pizza"]');
      if (allPill) allPill.classList.add('active');

      applyFilter(tab, 'all-pizza');
    });
  });

  // ── Pizza subcategory pills
  document.querySelectorAll('.subcat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.subcat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilter('pizzas', pill.dataset.subcat);
    });
  });

  function applyFilter(tab, pizzaSub) {
    let anyVisible = false;

    allCards.forEach(card => {
      const cat = card.dataset.cat;
      const sub = card.dataset.sub || '';
      const isDoce = card.dataset.doce === 'true';
      let show = false;

      if (tab === 'all') {
        show = true;
      } else if (tab === 'doces') {
        show = isDoce;
      } else if (tab === 'pizzas') {
        if (cat !== 'pizzas') { show = false; }
        else if (pizzaSub === 'all-pizza') { show = true; }
        else { show = sub === pizzaSub; }
      } else {
        show = cat === tab;
      }

      card.classList.toggle('hidden', !show);
      if (show) anyVisible = true;
    });

    // drink-cards
    document.querySelectorAll('.drink-card').forEach(card => {
      const show = tab === 'all' || tab === 'drinks';
      card.classList.toggle('hidden', !show);
      if (show) anyVisible = true;
    });

    // Show/hide section titles
    allBlocks.forEach(block => {
      const sec = block.dataset.section;
      let showBlock = false;
      if (tab === 'all') { showBlock = true; }
      else if (tab === 'doces') { showBlock = sec !== 'porcoes' && sec !== 'bebidas'; }
      else if (tab === sec) { showBlock = true; }
      else if (tab === 'pizzas' && sec === 'pizzas') { showBlock = true; }
      else if (tab === 'bebidas' && sec === 'bebidas') { showBlock = true; }
      else if (tab === 'porcoes' && sec === 'porcoes') { showBlock = true; }
      else if (tab === 'drinks' && sec === 'drinks') { showBlock = true; }
      block.style.display = showBlock ? '' : 'none';
    });

    emptyState.classList.toggle('visible', !anyVisible);
  }

  // ── Search
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();

    if (!q) {
      const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
      const activeSub = document.querySelector('.subcat-pill.active')?.dataset.subcat || 'all-pizza';
      applyFilter(activeTab, activeSub);
      return;
    }

    // Reset tabs visually
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-tab="all"]').classList.add('active');
    allBlocks.forEach(b => b.style.display = '');
    pizzaSubcats.classList.remove('visible');

    let anyVisible = false;
    allCards.forEach(card => {
      const name = card.querySelector('.item-name').textContent.toLowerCase();
      const desc = card.querySelector('.item-desc').textContent.toLowerCase();
      const match = name.includes(q) || desc.includes(q);
      card.classList.toggle('hidden', !match);
      if (match) anyVisible = true;
    });

    document.querySelectorAll('.drink-card').forEach(card => {
      const name = card.querySelector('.drink-name').textContent.toLowerCase();
      const desc = card.querySelector('.drink-desc').textContent.toLowerCase();
      const match = name.includes(q) || desc.includes(q);
      card.classList.toggle('hidden', !match);
      if (match) anyVisible = true;
    });

    emptyState.classList.toggle('visible', !anyVisible);
  });
