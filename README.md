# Hamza Younas — Web Presence

Two static sites sharing one dark DevOps brand.

| Folder | Domain | What |
|---|---|---|
| `com/` | hamzayounas.com | Animated portfolio (hero terminal, CI/CD pipeline animation, zig-zag sections, skills, timeline, contact form) |
| `dev/` | hamzayounas.dev | CV — redesigned to match brand, clean print/PDF mode |

## Stack
Pure static HTML/CSS/vanilla JS. No framework, no build step. One PHP file for the contact form. Google Fonts (Space Grotesk / Inter / JetBrains Mono). Runs anywhere; sized for Namecheap LiteSpeed.

## com/ structure
```
com/
├── index.html
├── contact.php              # mail() handler, honeypot spam guard, JSON responses
├── Hamza-Younas-CV.pdf      # generated from dev/ print mode; linked by "Download CV"
└── assets/
    ├── css/style.css
    ├── js/main.js           # typing, IntersectionObserver reveals, counters, pipeline, node-net canvas, nav
    └── img/{hamza.jpeg,favicon.svg}
```

## dev/ structure
```
dev/
├── index.html               # 2-col CV, dark screen theme + light @media print
├── hamza.jpeg
├── privacy-policy.html       # preserved from old site
└── terms-of-service.html     # preserved from old site
```

## Motion / a11y
- All motion is CSS + IntersectionObserver. Honors `prefers-reduced-motion` (disables canvas, shows everything static).
- Fully responsive; nav collapses to hamburger < 900px.

## Contact form
`contact.php` emails `hamza.younas94@gmail.com`. Update `$TO` at the top to change recipient. Requires PHP `mail()` (LiteSpeed/cPanel has it). Falls back to direct email link if sending fails.

## Regenerate the CV PDF
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="com/Hamza-Younas-CV.pdf" \
  "file://$PWD/dev/index.html"
```

## Deploy (Namecheap cPanel — pakmfguk account)
SSH: `ssh -p 21098 pakmfguk@premium909.web-hosting.com` (domain is Cloudflare-proxied; use the server host, not the domain).
- Confirm the exact docroots first (`hamzayounas.com` vs addon-domain path for `hamzayounas.dev`).
- Upload `com/*` → hamzayounas.com docroot; `dev/*` → hamzayounas.dev docroot.
- `.dev` is behind Cloudflare — purge cache after upload.

## Fixes applied to the old .dev CV
- `max-width: 12 00px` (invalid, had a space) → valid layout.
- Full redesign to dark-tech brand + proper light print mode.
- Profile photo was truncated on the old download (188 KB, half black); replaced with full 1.34 MB source, cropped to remove an AI "sparkle" glyph in the corner, re-encoded as a real JPEG.

## Notes
- Photo `hamza.jpeg` is actually JPEG bytes now (was a mislabelled PNG). 900×900, sparkle removed.
- Email on the old CV was Cloudflare-obfuscated; using `hamza.younas94@gmail.com`.
