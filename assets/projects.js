(function () {
    const AR = document.documentElement.lang === 'ar';
    const UI = AR ? {
        latest: 'الأحدث', view: 'عرض المشروع', all: 'الكل', ghostTag: 'التالي في السجل', ghostTitle: 'مشروعكم قد يكون هنا',
        ghostP: 'أسماء العملاء والمراجع متاحة عند الطلب.', ghostGo: 'اطلب المراجع',
        project: 'المشروع', client: 'العميل', location: 'الموقع', year: 'السنة', scope: 'نطاق العمل', notes: 'عن التنفيذ',
        related: 'الخدمات المرتبطة', next: 'المشروع التالي', title: ' | فيلترا للمقاولات الكهروميكانيكية',
        sv: { hvac: 'التكييف والتهوية', electrical: 'الأعمال الكهربائية', plumbing: 'السباكة والصرف', fire: 'مكافحة الحريق' }
    } : {
        latest: 'Latest', view: 'View project', all: 'All', ghostTag: 'Next on the register', ghostTitle: 'Your project could be here',
        ghostP: 'Client names and references are available on request.', ghostGo: 'Request references',
        project: 'Project', client: 'Client', location: 'Location', year: 'Year', scope: 'Scope of work', notes: 'Delivery notes',
        related: 'Related services', next: 'Next project', title: ' | Veltra MEP Contracting',
        sv: { hvac: 'HVAC', electrical: 'Electrical', plumbing: 'Plumbing', fire: 'Firefighting' }
    };
    const base = window.VELTRA_PROJECTS;
    const SEC = AR ? window.VELTRA_SECTORS_AR : window.VELTRA_SECTORS, ART = window.VELTRA_ART;
    const arById = AR ? Object.fromEntries(window.VELTRA_PROJECTS_AR.map(p => [p.id, p])) : {};
    const all = base.map(p => AR ? Object.assign({}, p, arById[p.id]) : p);
    const P = [...all].sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));
    const lt = s => AR ? String(s).replace(/(\d[\d,.]*\s?[A-Za-z]+)/g, '<bdi dir="ltr">$1</bdi>') : s;
    const color = s => `var(--c-${s})`;
    const sheet = p => 'M-1' + String(base.findIndex(x => x.id === p.id) + 1).padStart(2, '0');

    // ---------- register ----------
    const grid = document.getElementById('pgrid');
    if (grid) {
        grid.innerHTML = P.map((p, i) => `
        <a class="pcard${i === 0 ? ' feat' : ''}" href="project.html?id=${p.id}" data-sector="${p.sector}" style="--ac:${color(p.sector)}">
            <div class="pimg"><span class="sheetno">${sheet(p)}</span><span class="yr">${p.year}</span>${ART[p.art]}</div>
            <div class="pbody">
                ${i === 0 ? `<span class="badge">${UI.latest}</span>` : ''}
                <div class="pmeta"><span>${SEC[p.sector]}</span><span>${p.city}</span></div>
                <h3>${p.name}</h3>
                <div class="pscope">${p.scope_short}</div>
                <span class="go">${UI.view}</span>
            </div>
        </a>`).join('') + `
        <a class="pcard ghost" href="contact.html"><span class="gtag">${UI.ghostTag}</span><h3>${UI.ghostTitle}</h3><p>${UI.ghostP}</p><span class="go">${UI.ghostGo}</span></a>`;
        const bar = document.getElementById('filters');
        const counts = {}; P.forEach(p => counts[p.sector] = (counts[p.sector] || 0) + 1);
        bar.innerHTML = `<button class="chip" type="button" aria-pressed="true" data-f="all">${UI.all} <b>${P.length}</b></button>` +
            Object.keys(SEC).filter(k => counts[k]).map(k => `<button class="chip" type="button" aria-pressed="false" data-f="${k}">${SEC[k]} <b>${counts[k]}</b></button>`).join('');
        bar.addEventListener('click', e => {
            const b = e.target.closest('.chip'); if (!b) return;
            bar.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === b));
            const f = b.dataset.f; let first = true;
            grid.querySelectorAll('.pcard:not(.ghost)').forEach(c => {
                const show = f === 'all' || c.dataset.sector === f;
                c.classList.toggle('out', !show);
                c.classList.toggle('feat', show && first && f === 'all'); if (show) first = false;
            });
            grid.querySelector('.ghost').classList.toggle('out', f !== 'all');
        });
        document.getElementById('f-sectors').textContent = Object.keys(counts).length;
        document.getElementById('f-shown').textContent = P.length;
    }

    // ---------- detail ----------
    const root = document.getElementById('detail');
    if (root) {
        const id = new URLSearchParams(location.search).get('id');
        const p = P.find(x => x.id === id);
        if (!p) { location.replace('projects.html'); return; }
        const next = P[(P.indexOf(p) + 1) % P.length];
        document.title = p.name + UI.title;
        document.getElementById('crumb-name').textContent = p.name;
        root.innerHTML = `
        <section class="pd-head" style="--ac:${color(p.sector)}">
            <div class="pmeta"><span>${SEC[p.sector]}</span><span>${p.city}</span><span>${p.year}</span></div>
            <h1>${p.name}</h1>
        </section>
        <div class="pd-sheet" style="--ac:${color(p.sector)}">
            <div class="art">${ART[p.art]}</div>
            <div class="tb"><div><small>${UI.project}</small>${sheet(p)}</div><div><small>${UI.client}</small>${p.client}</div><div><small>${UI.location}</small>${p.city}</div><div><small>${UI.year}</small>${p.year}</div></div>
        </div>
        <dl class="pd-specs">${p.specs.map(s => `<div><dd>${lt(s[1])}</dd><dt>${s[0]}</dt></div>`).join('')}</dl>
        <section class="pd-body">
            <div><h2>${UI.scope}</h2><ol class="pd-scope">${p.scope.map(s => `<li>${lt(s)}</li>`).join('')}</ol></div>
            <div class="pd-notes"><h2>${UI.notes}</h2><p>${lt(p.story)}</p><small>${UI.related}</small><div class="tags">${p.services.map(s => `<a href="services.html#${s}">${UI.sv[s]}</a>`).join('')}</div></div>
        </section>
        <a class="pd-next" href="project.html?id=${next.id}"><div><small>${UI.next}</small><h2>${next.name}</h2></div><span>${AR ? '←' : '→'}</span></a>`;
    }
})();
