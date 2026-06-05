(function(){
  'use strict';

  /* ── CONFIG ── */
  var WA = '5511997281316';
  var HORARIOS = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00'];
  var MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  var SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  var counters = {est: 0, tot: 0};
  var calState = {
    est: {month: 0, year: 0, sel: null},
    tot: {month: 0, year: 0, sel: null}
  };

  /* init cal state */
  var now = new Date();
  calState.est.month = now.getMonth(); calState.est.year = now.getFullYear();
  calState.tot.month = now.getMonth(); calState.tot.year = now.getFullYear();

  /* ── HORÁRIOS: build ── */
  ['est','tot'].forEach(function(p){
    var inner = document.getElementById(p+'-hinner');
    HORARIOS.forEach(function(h){
      var d = document.createElement('div');
      d.className = 'sel-opt';
      d.textContent = h;
      d.setAttribute('data-val', h);
      inner.appendChild(d);
    });
  });

  /* ── HORÁRIO: toggle dropdown ── */
  ['est','tot'].forEach(function(p){
    var disp  = document.getElementById(p+'-hd');
    var drop  = document.getElementById(p+'-hdrop');
    var hidden= document.getElementById(p+'-h');

    disp.addEventListener('click', function(e){
      e.stopPropagation();
      var wasOpen = drop.classList.contains('open');
      closeAll();
      if(!wasOpen){ drop.classList.add('open'); disp.classList.add('open'); }
    });
    disp.addEventListener('keydown', function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); disp.click(); }
    });
    drop.addEventListener('click', function(e){
      var opt = e.target.closest('.sel-opt');
      if(!opt) return;
      var val = opt.getAttribute('data-val');
      hidden.value = val;
      disp.querySelector('.sel-txt').textContent = val;
      disp.classList.add('has-val');
      drop.querySelectorAll('.sel-opt').forEach(function(o){ o.classList.remove('chosen'); });
      opt.classList.add('chosen');
      drop.classList.remove('open');
      disp.classList.remove('open');
    });
  });

  /* ── CALENDÁRIO: render ── */
  function renderCal(p){
    var s   = calState[p];
    var cal = document.getElementById(p+'-cal');
    var today = new Date(); today.setHours(0,0,0,0);

    var nowY = today.getFullYear(), nowM = today.getMonth();
    var isFirst = (s.year === nowY && s.month === nowM);

    var firstDay   = new Date(s.year, s.month, 1).getDay();
    var daysInMonth= new Date(s.year, s.month+1, 0).getDate();

    var html = '<div class="cal-head">';
    html += '<button class="cal-nav" id="'+p+'-prev"'+(isFirst?' disabled':'')+'>&#8249;</button>';
    html += '<span class="cal-title">'+MESES[s.month]+' '+s.year+'</span>';
    html += '<button class="cal-nav" id="'+p+'-next">&#8250;</button>';
    html += '</div>';
    html += '<div class="cal-wdays">';
    SEMANA.forEach(function(d){ html += '<div class="cal-wd">'+d+'</div>'; });
    html += '</div><div class="cal-grid">';
    for(var i=0;i<firstDay;i++) html += '<div class="cal-d empty"></div>';
    for(var d=1;d<=daysInMonth;d++){
      var date = new Date(s.year, s.month, d); date.setHours(0,0,0,0);
      var cls = 'cal-d';
      if(date < today){ cls += ' disabled'; }
      else {
        if(date.getTime()===today.getTime()) cls += ' today';
        if(s.sel && s.sel.getTime()===date.getTime()) cls += ' selected';
      }
      var dStr = pad(d)+'/'+pad(s.month+1)+'/'+s.year;
      html += '<div class="'+cls+'" data-date="'+dStr+'" data-p="'+p+'">'+d+'</div>';
    }
    html += '</div>';
    cal.innerHTML = html;

    /* nav buttons */
    var prev = document.getElementById(p+'-prev');
    var next = document.getElementById(p+'-next');
    if(prev) prev.addEventListener('click', function(e){ e.stopPropagation(); navCal(p,-1); });
    if(next) next.addEventListener('click', function(e){ e.stopPropagation(); navCal(p,1); });

    /* day clicks */
    cal.querySelectorAll('.cal-d[data-date]').forEach(function(el){
      if(el.classList.contains('disabled')) return;
      el.addEventListener('click', function(e){
        e.stopPropagation();
        var ds = el.getAttribute('data-date');
        var pts = ds.split('/').map(Number);
        calState[p].sel = new Date(pts[2], pts[1]-1, pts[0]);
        document.getElementById(p+'-d').value = ds;
        var disp = document.getElementById(p+'-dd');
        disp.querySelector('.cal-txt').textContent = ds;
        disp.classList.add('has-val');
        renderCal(p);
        document.getElementById(p+'-cal').classList.remove('open');
        disp.classList.remove('open');
      });
    });
  }

  function navCal(p, dir){
    var s = calState[p];
    s.month += dir;
    if(s.month > 11){ s.month=0; s.year++; }
    if(s.month < 0){ s.month=11; s.year--; }
    /* clamp ao mês atual */
    var now2 = new Date();
    if(s.year < now2.getFullYear() || (s.year===now2.getFullYear() && s.month < now2.getMonth())){
      s.month = now2.getMonth(); s.year = now2.getFullYear();
    }
    renderCal(p);
  }

  /* init cals */
  renderCal('est'); renderCal('tot');

  /* ── CALENDÁRIO: toggle ── */
  ['est','tot'].forEach(function(p){
    var disp = document.getElementById(p+'-dd');
    var cal  = document.getElementById(p+'-cal');
    disp.addEventListener('click', function(e){
      e.stopPropagation();
      var wasOpen = cal.classList.contains('open');
      closeAll();
      if(!wasOpen){ cal.classList.add('open'); disp.classList.add('open'); }
    });
    disp.addEventListener('keydown', function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); disp.click(); }
    });
  });

  /* ── CLOSE ALL ── */
  function closeAll(){
    document.querySelectorAll('.sel-drop').forEach(function(d){ d.classList.remove('open'); });
    document.querySelectorAll('.sel-display').forEach(function(d){ d.classList.remove('open'); });
    document.querySelectorAll('.calendar').forEach(function(c){ c.classList.remove('open'); });
    document.querySelectorAll('.cal-display').forEach(function(d){ d.classList.remove('open'); });
  }
  document.addEventListener('click', closeAll);

  /* ── COUNTER ── */
  document.querySelectorAll('.cbtn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var p = btn.getAttribute('data-cid');
      var dir = parseInt(btn.getAttribute('data-dir'));
      counters[p] = Math.max(1, (counters[p]||0) + dir);
      var disp = document.getElementById(p+'-pval');
      disp.textContent = counters[p] + (counters[p]===1?' pessoa':' pessoas');
      disp.classList.remove('empty');
      document.getElementById(p+'-p').value = counters[p];
      disp.style.transform='scale(1.14)';
      setTimeout(function(){ disp.style.transform='scale(1)'; }, 140);
    });
  });

  /* ── TABS ── */
  var track = document.getElementById('tabTrack');
  document.querySelectorAll('.tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(function(b){
        b.classList.remove('active'); b.setAttribute('aria-selected','false');
      });
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');

      if(target==='tot') track.classList.add('right');
      else track.classList.remove('right');

      document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
      var panel = document.getElementById('panel-'+target);
      panel.classList.add('active');
      closeAll();
    });
  });

  /* ── CONFIRMAR → WHATSAPP ── */
  document.querySelectorAll('.btn-confirm').forEach(function(btn){
    btn.addEventListener('click', function(){
      var p   = btn.getAttribute('data-panel');
      var nP  = parseInt(document.getElementById(p+'-p').value)||0;
      var hor = document.getElementById(p+'-h').value;
      var dat = document.getElementById(p+'-d').value;
      var obs = document.getElementById(p+'-obs').value.trim();

      if(nP < 1){  showToast('Por favor, informe o número de pessoas.', true); return; }
      if(!hor){    showToast('Por favor, selecione um horário.', true); return; }
      if(!dat){    showToast('Por favor, selecione uma data.', true); return; }

      var tipo   = p==='est' ? 'Estimativa' : 'Número Total';
      var labelP = p==='est' ? 'Estimativa de pessoas' : 'Número total de pessoas';
      var emojiP = p==='est' ? '📊' : '👥';
      var nLabel = nP===1 ? '1 pessoa' : nP+' pessoas';

      var msg = 'Olá! Gostaria de fazer uma reserva na Pizzaria 3 em 1.\n\n';
msg += '- *Tipo de reserva:* ' + tipo + '\n';
msg += '- *' + labelP + ':* ' + nLabel + '\n';
msg += '- *Horário:* ' + hor + '\n';
msg += '- *Data:* ' + dat + '\n';
if(obs) msg += '- *Observação:* ' + obs + '\n';
msg += '\nAguardo a confirmação!';

      var url = 'https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
      showToast('Abrindo WhatsApp...', false);
      setTimeout(function(){ window.open(url,'_blank'); }, 900);
    });
  });

  /* ── TOAST ── */
  function showToast(msg, isErr){
    var t = document.getElementById('toast');
    var tm= document.getElementById('toast-msg');
    tm.textContent = msg;
    t.classList.remove('err','show');
    if(isErr) t.classList.add('err');
    void t.offsetWidth;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, isErr?2800:1800);
  }

  /* ── HELPER ── */
  function pad(n){ return String(n).padStart(2,'0'); }

})();