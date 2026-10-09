(function(){
    // subtle parallax on schematic
    const art = document.getElementById('schematic');
    if (art) document.addEventListener('mousemove', e => {
        const x = (e.clientX - innerWidth / 2) * 0.012, y = (e.clientY - innerHeight / 2) * 0.012;
        art.style.transform = `translate(${x}px, ${y}px)`;
    });
    // scroll reveal
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
    document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });

    // nav: dropdown + mobile menu
    const more = document.querySelector('.more'), moreBtn = more.querySelector('button');
    const burger = document.querySelector('.burger'), mm = document.getElementById('mobile-menu');
    const setMore = o => { more.classList.toggle('open', o); moreBtn.setAttribute('aria-expanded', o); };
    const setMM = o => { mm.hidden = !o; burger.setAttribute('aria-expanded', o); };
    moreBtn.addEventListener('click', () => setMore(!more.classList.contains('open')));
    burger.addEventListener('click', () => setMM(mm.hidden));
    mm.addEventListener('click', e => { if (e.target.closest('a')) setMM(false); });
    document.addEventListener('click', e => { if (!more.contains(e.target)) setMore(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMore(false); setMM(false); } });
    matchMedia('(min-width:1101px)').addEventListener('change', () => setMM(false));

    // current page in nav
    const page = document.body.dataset.page;
    if (page) document.querySelectorAll('nav > a, .mobile-menu > a').forEach(a => { if (a.getAttribute('href') === page + '.html') a.setAttribute('aria-current', 'page'); });
    // sub-nav scroll spy
    const chips = document.querySelectorAll('.subnav a');
    if (chips.length) {
        const spy = new IntersectionObserver(es => es.forEach(en => {
            if (en.isIntersecting) chips.forEach(c => c.classList.toggle('on', c.dataset.for === en.target.id));
        }), { rootMargin: '-40% 0px -55% 0px' });
        document.querySelectorAll('[data-spy]').forEach(s => spy.observe(s));
    }
    // placeholder for downloads that need a real PDF
    document.addEventListener('click', e => {
        const a = e.target.closest('[data-profile]'); if (!a) return;
        e.preventDefault();
        let t = document.getElementById('profile-toast');
        if (!t) { t = document.createElement('div'); t.id = 'profile-toast'; t.setAttribute('role', 'status'); t.style.cssText = 'position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:300;background:#eef2f8;color:#16325c;padding:14px 22px;font:400 .85rem/1.5 "JetBrains Mono","IBM Plex Sans Arabic",monospace;box-shadow:0 20px 40px rgba(0,0,0,.4);max-width:90vw;text-align:center'; document.body.appendChild(t); }
        t.textContent = document.documentElement.lang === 'ar' ? 'في الموقع الفعلي يُحمَّل ملف الشركة (PDF) من هنا.' : 'On the live site, this downloads the company profile (PDF).';
        t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => t.hidden = true, 3200);
    });
})();
