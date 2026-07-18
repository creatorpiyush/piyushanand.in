(function(){
  // Typing effect for hero terminal
  var target = document.getElementById('typeTarget');
  var full = "Piyush Anand — Software Engineer (AI · Flutter · DevOps · Node.js)";
  var statusLine = document.getElementById('statusLine');
  var statusTarget = document.getElementById('statusTarget');
  var statusFull = "🟢 available — always shipping something new";
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    target.textContent = full;
    statusLine.style.opacity = 1;
    statusTarget.textContent = statusFull;
  } else {
    var i = 0;
    function typeChar(){
      if(i <= full.length){
        target.innerHTML = full.slice(0, i) + '<span class="cursor"></span>';
        i++;
        setTimeout(typeChar, 32);
      } else {
        setTimeout(typeStatus, 400);
      }
    }
    function typeStatus(){
      statusLine.style.transition = 'opacity .3s ease';
      statusLine.style.opacity = 1;
      var j = 0;
      function step(){
        if(j <= statusFull.length){
          statusTarget.innerHTML = statusFull.slice(0, j) + '<span class="cursor"></span>';
          j++;
          setTimeout(step, 26);
        } else {
          statusTarget.innerHTML = statusFull + '<span class="cursor"></span>';
        }
      }
      step();
    }
    typeChar();
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // Scrollspy for file tree + status bar + breadcrumb + language mode
  var links = document.querySelectorAll('.file-tree a');
  var sections = Array.prototype.map.call(links, function(l){ return document.querySelector(l.getAttribute('href')); });
  var statusCurrent = document.getElementById('status-current');
  var statusLang = document.getElementById('status-lang');
  var statusLnCol = document.getElementById('status-lncol');
  var bcCurrent = document.getElementById('bcCurrent');
  var fileNames = { hero:'whoami.sh', about:'about.md', experience:'experience.log', projects:'projects/', skills:'skills.json', contact:'contact.sh' };
  var langNames = { hero:'Shell Script', about:'Markdown', experience:'Log File', projects:'Directory', skills:'JSON', contact:'Shell Script' };
  var lastId = null;

  function onScroll(){
    var pos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function(sec){ if(sec && sec.offsetTop <= pos){ current = sec; } });
    if(current){
      var id = current.id;
      if(id !== lastId){
        lastId = id;
        links.forEach(function(l){ l.classList.remove('active'); });
        var activeLink = document.querySelector('.file-tree a[href="#'+id+'"]');
        if(activeLink) activeLink.classList.add('active');
        if(fileNames[id]){ statusCurrent.textContent = fileNames[id]; bcCurrent.textContent = fileNames[id]; }
        if(langNames[id] && statusLang) statusLang.textContent = langNames[id];
      }
    }
    if(statusLnCol){
      var line = Math.max(1, Math.round(window.scrollY / 18) + 1);
      var col = (window.scrollY % 37) + 1;
      statusLnCol.textContent = 'Ln ' + line + ', Col ' + col;
    }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile sidebar toggle
  var sidebar = document.getElementById('sidebar');
  var mobileToggle = document.getElementById('mobileToggle');
  mobileToggle.addEventListener('click', function(){ sidebar.classList.toggle('open'); });
  links.forEach(function(l){ l.addEventListener('click', function(){ sidebar.classList.remove('open'); }); });

  // Copy email button
  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var val = btn.getAttribute('data-copy');
      var restore = btn.textContent;
      if(navigator.clipboard){
        navigator.clipboard.writeText(val).then(function(){
          btn.textContent = 'copied!';
          setTimeout(function(){ btn.textContent = restore; }, 1600);
        });
      }
    });
  });

  // Command palette
  var paletteItems = [
    {label:'whoami.sh', sub:'Hero / intro', href:'#hero'},
    {label:'about.md', sub:'Summary', href:'#about'},
    {label:'experience.log', sub:'Career history', href:'#experience'},
    {label:'projects/', sub:'Side projects', href:'#projects'},
    {label:'skills.json', sub:'Skills & certifications', href:'#skills'},
    {label:'contact.sh', sub:'Get in touch', href:'#contact'}
  ];
  var overlay = document.getElementById('paletteOverlay');
  var input = document.getElementById('paletteInput');
  var results = document.getElementById('paletteResults');
  var selIndex = 0;
  var filtered = paletteItems.slice();

  function renderResults(){
    results.innerHTML = '';
    if(filtered.length === 0){
      results.innerHTML = '<div class="palette-empty">No matching files</div>';
      return;
    }
    filtered.forEach(function(item, idx){
      var div = document.createElement('div');
      div.className = 'palette-item' + (idx === selIndex ? ' sel' : '');
      div.innerHTML = '<span class="icon">›</span><span>' + item.label + '</span><span style="margin-left:auto;color:var(--text-faint);font-size:11px;">' + item.sub + '</span>';
      div.addEventListener('click', function(){ jumpTo(item.href); });
      results.appendChild(div);
    });
  }

  function openPalette(){
    overlay.classList.add('open');
    input.value = '';
    filtered = paletteItems.slice();
    selIndex = 0;
    renderResults();
    setTimeout(function(){ input.focus(); }, 10);
  }
  function closePalette(){ overlay.classList.remove('open'); }
  function jumpTo(href){
    closePalette();
    var el = document.querySelector(href);
    if(el) el.scrollIntoView({behavior: reduced ? 'auto' : 'smooth'});
  }

  document.getElementById('paletteOpenBtn').addEventListener('click', openPalette);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closePalette(); });

  document.addEventListener('keydown', function(e){
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      overlay.classList.contains('open') ? closePalette() : openPalette();
    } else if(e.key === 'Escape'){
      closePalette();
      closeThemePicker();
    } else if(overlay.classList.contains('open')){
      if(e.key === 'ArrowDown'){ e.preventDefault(); selIndex = Math.min(selIndex+1, filtered.length-1); renderResults(); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); selIndex = Math.max(selIndex-1, 0); renderResults(); }
      else if(e.key === 'Enter'){ e.preventDefault(); if(filtered[selIndex]) jumpTo(filtered[selIndex].href); }
    }
  });

  input.addEventListener('input', function(){
    var q = input.value.toLowerCase();
    filtered = paletteItems.filter(function(item){ return item.label.toLowerCase().indexOf(q) !== -1 || item.sub.toLowerCase().indexOf(q) !== -1; });
    selIndex = 0;
    renderResults();
  });

  // ---------- Theme switcher ----------
  var themes = [
    { key:'aurora',   name:'Aurora',   sub:'default · signature',  colors:['#0A0E14','#4FD1C5','#A399F0','#E8B34F'] },
    { key:'dracula',  name:'Dracula',  sub:'purple night',         colors:['#282A36','#8BE9FD','#BD93F9','#FF79C6'] },
    { key:'onedark',  name:'One Dark', sub:'Atom classic',         colors:['#282C34','#61AFEF','#C678DD','#98C379'] },
    { key:'nord',     name:'Nord',     sub:'arctic, north-bluish', colors:['#2E3440','#88C0D0','#B48EAD','#A3BE8C'] },
    { key:'light',    name:'Light',    sub:'clean, high-contrast', colors:['#FFFFFF','#0F8C82','#6639BA','#9A6700'] }
  ];
  var themeOverlay = document.getElementById('themeOverlay');
  var themeResults = document.getElementById('themeResults');
  var themeBtnLabel = document.getElementById('themeBtnLabel');
  var savedTheme = 'aurora';
  try{ savedTheme = localStorage.getItem('portfolio-theme') || 'aurora'; }catch(e){}

  function applyTheme(key, persist){
    if(key === 'aurora'){ document.documentElement.removeAttribute('data-theme'); }
    else{ document.documentElement.setAttribute('data-theme', key); }
    var t = themes.filter(function(x){ return x.key === key; })[0] || themes[0];
    themeBtnLabel.textContent = t.name;
    if(persist){ try{ localStorage.setItem('portfolio-theme', key); }catch(e){} }
    renderThemeResults();
  }

  function renderThemeResults(){
    themeResults.innerHTML = '';
    themes.forEach(function(t){
      var active = (document.documentElement.getAttribute('data-theme') || 'aurora') === t.key;
      var div = document.createElement('div');
      div.className = 'theme-item' + (active ? ' sel' : '');
      var swatch = t.colors.map(function(c){ return '<i style="background:'+c+'"></i>'; }).join('');
      div.innerHTML = '<span class="theme-swatch">'+swatch+'</span><span class="tname">'+t.name+'</span><span class="tsub">'+t.sub+'</span><span class="tcheck">'+(active?'✓':'')+'</span>';
      div.addEventListener('click', function(){ applyTheme(t.key, true); closeThemePicker(); });
      themeResults.appendChild(div);
    });
  }

  function openThemePicker(){ themeOverlay.classList.add('open'); renderThemeResults(); }
  function closeThemePicker(){ themeOverlay.classList.remove('open'); }

  document.getElementById('themeOpenBtn').addEventListener('click', openThemePicker);
  themeOverlay.addEventListener('click', function(e){ if(e.target === themeOverlay) closeThemePicker(); });

  applyTheme(savedTheme, false);

  // ---------- Scroll progress bar ----------
  var progressBar = document.getElementById('scrollProgress');
  function updateProgress(){
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  // ---------- Animated stat counters ----------
  var statEls = document.querySelectorAll('.stat b[data-count]');
  function animateCount(el){
    var target = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var num = parseFloat(target);
    if(isNaN(num)){ el.textContent = target; return; }
    if(reduced){ el.textContent = target + suffix; return; }
    var start = 0, duration = 1100, startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = start + (num - start) * eased;
      el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window && statEls.length){
    var statIo = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ animateCount(e.target); statIo.unobserve(e.target); }
      });
    }, {threshold:0.4});
    statEls.forEach(function(el){ statIo.observe(el); });
  }

  // ---------- Activity bar: navigation + sidebar collapse ----------
  document.querySelectorAll('.ab-icon[data-goto]').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.ab-icon').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      jumpTo(btn.getAttribute('data-goto'));
    });
  });
  var searchIconBtn = document.getElementById('searchIconBtn');
  if(searchIconBtn) searchIconBtn.addEventListener('click', openPalette);

  var explorerIconBtn = document.getElementById('explorerIconBtn');
  if(explorerIconBtn){
    explorerIconBtn.addEventListener('click', function(){
      document.body.classList.toggle('sidebar-collapsed');
      explorerIconBtn.classList.toggle('active', !document.body.classList.contains('sidebar-collapsed'));
    });
  }
  var settingsIconBtn = document.getElementById('settingsIconBtn');
  if(settingsIconBtn) settingsIconBtn.addEventListener('click', openThemePicker);

  // ---------- Minimap ----------
  var minimapTrack = document.getElementById('minimapTrack');
  var minimapViewport = document.getElementById('minimapViewport');
  var minimap = document.getElementById('minimap');
  if(minimapTrack){
    var mmColors = ['var(--teal)','var(--violet)','var(--sky)','var(--amber)','var(--sage)','var(--text-faint)'];
    var mmSeed = 42;
    function rand(){ mmSeed = (mmSeed * 9301 + 49297) % 233280; return mmSeed / 233280; }
    var lineCount = 130;
    var frag = document.createDocumentFragment();
    for(var n = 0; n < lineCount; n++){
      var el = document.createElement('div');
      el.className = 'mm-line';
      var w = 20 + Math.floor(rand() * 78);
      var isGap = rand() < 0.08;
      el.style.width = isGap ? '0%' : w + '%';
      el.style.background = mmColors[Math.floor(rand() * mmColors.length)];
      el.style.marginBottom = isGap ? '7px' : '0';
      frag.appendChild(el);
    }
    minimapTrack.appendChild(frag);

    function syncMinimap(){
      var h = document.documentElement;
      var scrollTop = h.scrollTop || document.body.scrollTop;
      var scrollHeight = (h.scrollHeight || document.body.scrollHeight);
      var viewH = h.clientHeight;
      var trackH = minimap.clientHeight;
      var vpH = Math.max(30, (viewH / scrollHeight) * trackH);
      var maxTop = trackH - vpH;
      var pct = (scrollHeight - viewH) > 0 ? scrollTop / (scrollHeight - viewH) : 0;
      minimapViewport.style.height = vpH + 'px';
      minimapViewport.style.top = (pct * maxTop) + 'px';
    }
    document.addEventListener('scroll', syncMinimap, {passive:true});
    window.addEventListener('resize', syncMinimap);
    syncMinimap();

    function scrollFromMinimapEvent(e){
      var rect = minimap.getBoundingClientRect();
      var y = (e.clientY - rect.top) / rect.height;
      var h = document.documentElement;
      var scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      window.scrollTo({ top: y * scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    }
    var mmDragging = false;
    minimap.addEventListener('mousedown', function(e){ mmDragging = true; scrollFromMinimapEvent(e); });
    document.addEventListener('mousemove', function(e){ if(mmDragging) scrollFromMinimapEvent(e); });
    document.addEventListener('mouseup', function(){ mmDragging = false; });
  }

  // ---------- Terminal / Problems panel ----------
  var termPanel = document.getElementById('termPanel');
  var termToggleBtn = document.getElementById('termToggleBtn');
  var termCloseBtn = document.getElementById('termCloseBtn');
  var termOut = document.getElementById('termOut');
  var termBodyTerminal = document.getElementById('termBodyTerminal');
  var termBodyProblems = document.getElementById('termBodyProblems');
  var termTabs = document.querySelectorAll('.term-tab');
  var buildRan = false;

  var buildLines = [
    { text: '> compiling 4+ years of experience...', cls: '' },
    { text: '  ✔ done in 0.4s', cls: 'ok' },
    { text: '> bundling 5,000,000+ users (Flutter loyalty app)...', cls: '' },
    { text: '  ✔ done in 0.6s', cls: 'ok' },
    { text: '> optimizing RAG pipeline on Azure OpenAI...', cls: '' },
    { text: '  ✔ done in 0.3s', cls: 'ok' },
    { text: '> running CI/CD, cutting release effort by 60%...', cls: '' },
    { text: '  ✔ done in 0.2s', cls: 'ok' },
    { text: '', cls: '' },
    { text: '✔ Build succeeded — 0 errors, 0 warnings', cls: 'ok' },
    { text: 'ℹ Available for new opportunities. Scroll to contact.sh →', cls: 'info' }
  ];

  function runBuildEasterEgg(){
    if(buildRan || reduced){
      if(reduced){ termOut.textContent = buildLines.map(function(l){ return l.text; }).join('\n'); }
      buildRan = true;
      return;
    }
    buildRan = true;
    var li = 0;
    function nextLine(){
      if(li >= buildLines.length){ return; }
      var line = buildLines[li];
      var span = document.createElement('div');
      if(line.cls) span.className = line.cls;
      span.textContent = line.text;
      termOut.appendChild(span);
      li++;
      setTimeout(nextLine, 260);
    }
    nextLine();
  }

  function openTermPanel(){
    termPanel.classList.add('open');
    runBuildEasterEgg();
  }
  function closeTermPanel(){ termPanel.classList.remove('open'); }

  if(termToggleBtn) termToggleBtn.addEventListener('click', function(){
    termPanel.classList.contains('open') ? closeTermPanel() : openTermPanel();
  });
  if(termCloseBtn) termCloseBtn.addEventListener('click', closeTermPanel);

  termTabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      termTabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      var isTerminal = tab.getAttribute('data-tab') === 'terminal';
      termBodyTerminal.hidden = !isTerminal;
      termBodyProblems.hidden = isTerminal;
    });
  });

  document.addEventListener('keydown', function(e){
    if(e.key === '`' && (e.ctrlKey || e.metaKey)){
      e.preventDefault();
      termPanel.classList.contains('open') ? closeTermPanel() : openTermPanel();
    }
  });
})();
