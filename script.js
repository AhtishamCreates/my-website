const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => [...o.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll progress bar
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

// Mobile menu
const burger = $('#burger'), menu = $('#menu');
burger.onclick = () => burger.setAttribute('aria-expanded', menu.classList.toggle('open'));
$$('#menu a').forEach(a => a.onclick = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); });

// Marquees: duplicate content so the loop is seamless
$$('.track').forEach(t => t.innerHTML += t.innerHTML);

// Counters
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count; let n = 0;
  const step = () => { n += Math.ceil(end / 40); el.textContent = Math.min(n, end); if (n < end && !reduce) requestAnimationFrame(step); else el.textContent = end; };
  step(); io.unobserve(el);
}), { threshold: .6 });
$$('[data-count]').forEach(el => io.observe(el));

// Portfolio filter
$$('.filters button').forEach(b => b.onclick = () => {
  $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
  $$('.work article').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.t !== b.dataset.f));
});

// Price estimator
const boxes = $$('.calc input'), fmt = n => '$' + n.toLocaleString('en-US');
const calc = () => {
  const on = boxes.filter(b => b.checked);
  const sum = on.reduce((t, b) => t + +b.dataset.p, 0);
  $('#total').textContent = sum ? `${fmt(Math.round(sum * .9))} - ${fmt(Math.round(sum * 1.5))}` : '$0';
  const msg = sum ? `Hi Nexora, I need: ${on.map(b => b.dataset.n).join(', ')}. Estimated ${$('#total').textContent}. Can we talk?` : 'Hi Nexora, I would like to discuss a project.';
  $('#wa').href = 'https://wa.me/923190743401?text=' + encodeURIComponent(msg);
};
boxes.forEach(b => b.onchange = calc);

// Testimonials
const qs = $$('#slider blockquote'); let q = 0;
setInterval(() => { qs[q].classList.remove('show'); q = (q + 1) % qs.length; qs[q].classList.add('show'); }, 5000);

// Contact form: opens the visitor's email app with the message filled in
$('#form').onsubmit = e => {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  let ok = true;
  ['name', 'email', 'msg'].forEach(k => {
    const bad = !d[k].trim() || (k === 'email' && !/^\S+@\S+\.\S+$/.test(d[k]));
    f.elements[k].classList.toggle('err', bad); if (bad) ok = false;
  });
  const s = $('#status');
  if (!ok) { s.textContent = 'Please add your name, a valid email and project details.'; return; }
  const body = `Name: ${d.name}\nEmail: ${d.email}\nService: ${d.service}\n\n${d.msg}`;
  location.href = `mailto:ahtishamjutt6122009@gmail.com?subject=${encodeURIComponent('New project enquiry: ' + d.service)}&body=${encodeURIComponent(body)}`;
  s.textContent = 'Opening your email app. Press send to finish.';
};

$('#year').textContent = new Date().getFullYear();
