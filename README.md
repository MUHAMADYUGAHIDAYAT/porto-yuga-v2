# Portfolio Website — Muhamad Yuga Hidayat

Website portfolio personal dibangun dengan **HTML/CSS/JS murni** (vanilla, tanpa framework).
Mendukung **dark/light theme** (galaxy ↔ morning scenery), animasi scenic per-section,
form contact dengan WhatsApp fallback, dan optimasi performa (content-visibility,
IntersectionObserver pause, GPU-layer compositing).

---

## Struktur folder

```
porto-yuga/
├── index.html                  # Entry point
├── README.md                   # File ini
│
├── assets/                     # Semua resource yang dipakai oleh website
│   ├── css/
│   │   └── pstyle.css          # Single stylesheet (~6500 baris)
│   ├── js/
│   │   └── main.js             # Single script (~400 baris) — semua interaksi
│   └── img/
│       ├── hero/
│       │   └── santai.jpg      # Foto profil di hero section
│       ├── skills/             # Logo bahasa/framework (Skills section)
│       │   ├── html-logo.png
│       │   ├── css-logo.png
│       │   ├── js-logo.png
│       │   ├── node-js-logo.png
│       │   ├── express-js-logo.png
│       │   └── mongodb-logo.png
│       ├── education/          # Logo institusi (Education timeline)
│       │   ├── universitas.png # Indo Global Mandiri (S1)
│       │   ├── madrasah.png    # PP Sabilul Hasanah (MA)
│       │   ├── smp.png         # SMPN 12 Palembang
│       │   └── sd.png          # SDN 203 Palembang
│       └── projects/           # Preview screenshot project
│           ├── portfolio.png
│           ├── hydroplantura.png
│           └── dashboard.jpg   # (placeholder — belum tersedia)
│

```

## Tema (dark / light)

Toggle theme: button di pojok kanan atas (`#theme-toggle`).
Variabel CSS di `assets/css/pstyle.css` line 14-50:

```css
:root {                    /* dark theme (default) */
    --main-color: #0bb121;        /* hijau */
    --main-color-rgb: 11, 177, 33;
    ...
}
[data-theme="light"] {     /* light theme */
    --main-color: #f97316;        /* orange */
    --main-color-rgb: 249, 115, 22;
    ...
}
```

Theme persisted di `localStorage` (key: `theme`).

---

## Tech stack

- **HTML5** semantic markup
- **CSS3** custom properties, grid, flexbox, clip-path, container queries
- **Vanilla JavaScript** (ES6+) — IntersectionObserver, fetch, native form validation
- **Font Awesome 6.7.2** (CDN)
- **Google Fonts: Poppins** (CDN, preconnect optimized)

Tidak ada build step / bundler — langsung ready dari source.

---

## Performa

- `content-visibility: auto` di section off-screen
- `contain: layout style paint` di scene-decor (paint isolation)
- `transform: translateZ(0)` GPU layer hint
- IntersectionObserver pause untuk animasi off-screen (class `.paused-mq`)
- `prefers-reduced-motion` fallback (animasi disable untuk user yang sensitif)
- Hero particles: 6 (reduced from 10)
- Touch device detection: skip particles di mobile
- Lazy loading + async decoding semua gambar (kecuali hero)

---

## Kontak

- Email: [yugaadvance@gmail.com](mailto:yugaadvance@gmail.com)
- WhatsApp: [+62 877-8031-3222](https://wa.me/6287780313222)
- GitHub: [@MUHAMADYUGAHIDAYAT](https://github.com/MUHAMADYUGAHIDAYAT)
- Instagram: [@yuga_saja](https://www.instagram.com/yuga_saja/)
