/* ═══════════════════════════════════════════
   HSE Engineer Portfolio — script.js
═══════════════════════════════════════════ */
'use strict';

/* ── Preloader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.getElementById('loader');
    l.classList.add('out');
    setTimeout(() => l.remove(), 800);
  }, 900);
});

/* ── Custom Cursor ── */
(function(){
  const dot = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if(!dot || window.matchMedia('(hover:none)').matches) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
  });
  (function loop(){
    rx += (mx-rx)*.13; ry += (my-ry)*.13;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.svc-card,.cert-card,.sk-card,.tag,.itag,.cert-pill,.ah-item,.floating-social-link,.floating-social-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ── Sticky nav ── */
(function(){
  const nav = document.getElementById('nav');
  const fn = () => nav.classList.toggle('solid', scrollY > 20);
  addEventListener('scroll', fn, {passive:true});
  fn();
})();

/* ── Hamburger ── */
(function(){
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  const cta = document.getElementById('navCta');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const o = btn.classList.toggle('open');
    links.classList.toggle('mob-open', o);
    cta.classList.toggle('mob-open', o);
  });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    btn.classList.remove('open');
    links.classList.remove('mob-open');
    cta.classList.remove('mob-open');
  }));
})();

/* ── Active nav link ── */
(function(){
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const fn = () => {
    let cur = '';
    sections.forEach(s => { if(scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#'+cur));
  };
  addEventListener('scroll', fn, {passive:true});
  fn();
})();

/* ── Scroll reveal ── */
(function(){
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, {threshold:.1, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el => obs.observe(el));
})();

/* ── Hero counters ── */
(function(){
  const els = document.querySelectorAll('[data-count]');
  let done = false;
  const obs = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting && !done){
      done = true;
      els.forEach(el => {
        const target = +el.dataset.count;
        const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
        const t0 = performance.now(), dur = 1600;
        const tick = now => {
          const p = Math.min((now-t0)/dur, 1);
          el.innerHTML = Math.round((1-Math.pow(1-p,3))*target) + suffix;
          if(p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  }, {threshold:.3});
  const hero = document.getElementById('home');
  if(hero) obs.observe(hero);
})();

/* ── Skill bars ── */
(function(){
  const fills = document.querySelectorAll('.sk-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        setTimeout(() => { e.target.style.width = e.target.dataset.w + '%'; }, 150);
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.3});
  fills.forEach(f => obs.observe(f));
})();

/* ── Back to top ── */
(function(){
  const btt = document.getElementById('btt');
  addEventListener('scroll', () => btt.classList.toggle('show', scrollY > 400), {passive:true});
  btt.addEventListener('click', () => scrollTo({top:0,behavior:'smooth'}));
})();

/* ── Contact form ── */
(function(){
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn = document.getElementById('submitBtn');
  if(!form) return;

  const rules = {
    fname:    { el: document.getElementById('fname'),    err: document.getElementById('fnameErr'),    check: v => !v.trim() ? 'Name is required.' : v.trim().length < 2 ? 'At least 2 characters.' : '' },
    femail:   { el: document.getElementById('femail'),   err: document.getElementById('femailErr'),   check: v => !v.trim() ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Invalid email.' : '' },
    fservice: { el: document.getElementById('fservice'), err: document.getElementById('fserviceErr'), check: v => !v ? 'Please select a service.' : '' },
    fmessage: { el: document.getElementById('fmessage'), err: document.getElementById('fmessageErr'), check: v => !v.trim() ? 'Message is required.' : v.trim().length < 20 ? 'At least 20 characters.' : '' },
  };

  const validate = key => {
    const r = rules[key], msg = r.check(r.el.value);
    r.el.classList.toggle('err', !!msg);
    r.err.textContent = msg;
    return !msg;
  };

  Object.keys(rules).forEach(k => {
    rules[k].el.addEventListener('blur', () => validate(k));
    rules[k].el.addEventListener('input', () => { if(rules[k].el.classList.contains('err')) validate(k); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const valid = Object.keys(rules).map(validate).every(Boolean);
    if(!valid) return;
    btn.classList.add('loading'); btn.disabled = true;
    await new Promise(r => setTimeout(r, 1600));
    form.style.display = 'none';
    success.classList.add('show');
    setTimeout(() => {
      success.classList.remove('show');
      form.reset(); form.style.display = '';
      btn.classList.remove('loading'); btn.disabled = false;
      Object.keys(rules).forEach(k => { rules[k].el.classList.remove('err'); rules[k].err.textContent = ''; });
    }, 6000);
  });
})();

/* ── Floating Social Menu ── */
(function(){
  const menu = document.querySelector('.floating-social');
  const toggle = document.querySelector('.floating-social-toggle');
  const links = document.querySelectorAll('.floating-social-link');
  if(!menu || !toggle) return;
  
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    if(isOpen){
      links.forEach((link, idx) => {
        link.style.animation = 'none';
        setTimeout(() => {
          link.style.animation = `linkBounce .5s cubic-bezier(.34,1.56,.64,1) ${idx * 0.08}s both`;
        }, 10);
      });
    }
  });
  
  links.forEach(link => {
    link.addEventListener('click', e => {
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.width = '1px';
      ripple.style.height = '1px';
      ripple.style.background = 'rgba(255,255,255,.8)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.left = e.offsetX + 'px';
      ripple.style.top = e.offsetY + 'px';
      ripple.style.animation = 'rippleEffect .6s ease-out forwards';
      link.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      setTimeout(() => menu.classList.remove('open'), 200);
    });
  });
  
  document.addEventListener('click', e => {
    if(!menu.contains(e.target)){
      menu.classList.remove('open');
    }
  });
})();

/* Add ripple animation keyframe */
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleEffect{
    from{
      width:1px;height:1px;box-shadow:0 0 0 0 rgba(255,255,255,.8);
    }
    to{
      width:100%;height:100%;box-shadow:0 0 0 40px rgba(255,255,255,0);
    }
  }
`;
document.head.appendChild(style);

console.log('%cKhalid Al-Mansouri — HSE Portfolio ✓','color:#b8f040;font-weight:bold;font-size:14px');
