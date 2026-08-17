/* ============================================================
   Hamza Younas — hamzayounas.com  ·  vanilla JS
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- terminal typing ---------- */
  var cmdEl = document.getElementById('type-cmd');
  var outEl = document.getElementById('type-out');
  var cursor = document.getElementById('cursor');
  if (cmdEl && outEl) {
    var cmd = 'whoami --role';
    var out =
      'Hamza Younas\n' +
      '<b>Senior DevOps Engineer</b> · AWS Certified SA\n' +
      'infra: <b>AWS · Kubernetes · Terraform</b>\n' +
      'status: <b>uptime 99.9% · 1M+ installs</b>';
    if (reduce) {
      cmdEl.textContent = cmd;
      outEl.innerHTML = out;
      if (cursor) cursor.style.display = 'none';
    } else {
      var i = 0;
      (function typeCmd() {
        if (i <= cmd.length) {
          cmdEl.textContent = cmd.slice(0, i++);
          setTimeout(typeCmd, 70);
        } else {
          setTimeout(typeOut, 350);
        }
      })();
      function typeOut() {
        // reveal output lines progressively
        var lines = out.split('\n');
        var li = 0;
        (function next() {
          if (li < lines.length) {
            outEl.innerHTML += (li ? '\n' : '') + lines[li++];
            setTimeout(next, 260);
          }
        })();
      }
    }
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el, idx) {
      // stagger cards inside a grid
      if (el.parentElement && (el.parentElement.classList.contains('skill-grid') ||
          el.parentElement.classList.contains('hero-metrics'))) {
        el.style.transitionDelay = (idx % 4) * 0.08 + 's';
      }
      ro.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduce) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.metric-num');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- pipeline animation ---------- */
  var track = document.getElementById('pipelineTrack');
  var packet = document.getElementById('plPacket');
  var status = document.getElementById('plStatus');
  var stages = track ? track.querySelectorAll('.pl-stage') : [];
  var deployLog = document.getElementById('deployLog');
  var logItems = deployLog ? deployLog.querySelectorAll('li') : [];
  var labels = ['building…', 'testing…', 'deploying…', 'monitoring…', 'deployed ✓'];
  function setDeployLog(activeIdx) {
    logItems.forEach(function (item, idx) {
      item.classList.toggle('active', idx === activeIdx);
      item.classList.toggle('done', idx < activeIdx);
    });
  }
  function runPipeline() {
    if (!packet || !stages.length) return;
    var n = stages.length;
    stages.forEach(function (s) { s.classList.remove('active', 'done'); });
    setDeployLog(0);
    packet.classList.add('run');
    var idx = 0;
    stages[0].classList.add('active');
    packet.style.left = '0%';
    if (status) status.innerHTML = '<span class="run">●</span> commit received…';
    var timer = setInterval(function () {
      stages[idx].classList.remove('active');
      stages[idx].classList.add('done');
      idx++;
      if (idx >= n) {
        clearInterval(timer);
        setDeployLog(n);
        if (status) status.innerHTML = '<span class="ok">●</span> deployed to production · healthy';
        return;
      }
      stages[idx].classList.add('active');
      setDeployLog(idx);
      packet.style.left = (idx / (n - 1)) * 100 + '%';
      if (status) status.innerHTML = '<span class="run">●</span> ' + labels[idx - 1];
    }, 1000);
  }
  if (track) {
    if (reduce) {
      stages.forEach(function (s) { s.classList.add('done'); });
      setDeployLog(logItems.length);
      if (status) status.innerHTML = '<span class="ok">●</span> deployed to production · healthy';
    } else if ('IntersectionObserver' in window) {
      var po = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runPipeline(); po.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      po.observe(track);
    }
  }

  /* ---------- proof meter animation ---------- */
  document.querySelectorAll('.proof-meter').forEach(function (meter) {
    meter.style.setProperty('--meter', (meter.getAttribute('data-level') || '0') + '%');
  });

  /* ---------- contact form (AJAX to contact.php) ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var submitBtn = document.getElementById('submitBtn');
  function setNote(type, msg) {
    if (!note) return;
    note.className = 'form-note ' + (type || '');
    note.textContent = msg || '';
  }
  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      setNote('', '');
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var lastSent = parseInt(window.localStorage.getItem('hy-contact-last') || '0', 10);
      if (lastSent && Date.now() - lastSent < 30000) {
        setNote('err', 'Please wait a moment before sending another message.');
        return;
      }
      if (!name || !email || !message) {
        setNote('err', 'Please fill in every field.');
        return;
      }
      if (!validEmail(email)) {
        setNote('err', 'That email address looks invalid.');
        return;
      }
      if (message.length < 20) {
        setNote('err', 'Please add a little more detail so I can reply usefully.');
        return;
      }
      submitBtn.disabled = true;
      var original = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      setNote('busy', 'Sending securely…');
      fetch('contact.php', { method: 'POST', body: new FormData(form), headers: { 'X-Requested-With': 'fetch' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'Unexpected response.' }; }); })
        .then(function (data) {
          if (data.ok) {
            setNote('ok', data.message || 'Message sent. I\'ll get back to you soon.');
            window.localStorage.setItem('hy-contact-last', String(Date.now()));
            form.reset();
          } else {
            setNote('err', data.error || 'Something went wrong. Email me directly instead.');
          }
        })
        .catch(function () {
          setNote('err', 'Network error. Email hamza.younas94@gmail.com instead.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
        });
    });
  }

  /* ---------- background node network ---------- */
  var canvas = document.getElementById('bg-net');
  if (canvas && !reduce && window.innerWidth > 640) {
    var ctx = canvas.getContext('2d');
    var w, h, nodes, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var COUNT;
    function resize() {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      COUNT = Math.min(70, Math.floor(window.innerWidth / 22));
      nodes = [];
      for (var i = 0; i < COUNT; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25 * DPR,
          vy: (Math.random() - 0.5) * 0.25 * DPR
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);
    var LINK = 130 * DPR;
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 * DPR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(57,208,216,0.55)';
        ctx.fill();
        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = 'rgba(63,185,80,' + (0.14 * (1 - dist / LINK)) + ')';
            ctx.lineWidth = DPR;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  }
})();
