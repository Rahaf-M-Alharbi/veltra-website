# Veltra MEP Contracting

Static, bilingual (English / Arabic) concept website. No build step.

- `index.html`, `services.html`, `projects.html`, `project.html?id=…`, `about.html`, `certifications.html`, `careers.html`, `contact.html`: English pages
- `ar/`: the same pages in Arabic (RTL)
- `assets/`: shared styles (`site.css`, one `*.css` per page, `ar*.css` for Arabic), scripts (`site.js`, `footer.js`, `projects.js`) and data (`projects-data*.js`, `project-art.js`)

Run locally: `python3 -m http.server 8765` then open http://localhost:8765

Deploy: upload the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).
