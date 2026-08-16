# Hamza Younas — Web Presence (Spec)

Date: 2026-08-16

## Goal
Professional, creative, animated DevOps-themed web presence for Hamza Younas (Senior DevOps Engineer, AWS SA-Associate). Two deliverables sharing one visual language.

## Positioning
Personal portfolio (job-seeking Senior DevOps Engineer). CTAs: Download CV, Get in touch.

## Brand / Visual language
- Dark tech theme: base `#0a0e14`, panels `#111722`, text `#e6edf3`, muted `#8b98a5`.
- Accents: terminal green `#3fb950`, cyan `#39d0d8`, subtle amber for warnings.
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code/terminal). Google Fonts.
- Motion: pure CSS + vanilla JS (IntersectionObserver). No frameworks, no heavy libs. Respect `prefers-reduced-motion`. Fully responsive.

## Deliverable 1 — hamzayounas.com (new animated portfolio)
Static: `index.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/img/hamza.jpeg`, `contact.php`, `Hamza-Younas-CV.pdf`, favicon.
Sections (zig-zag alternating):
1. Hero — animated terminal typing `whoami`, name/title, live metrics, CTAs, animated node-network background.
2. Animated CI/CD pipeline — SVG Commit→Build→Test→Deploy→Monitor with glowing packet on scroll.
3. About — summary + AWS cert badge (verify link).
4. Skills — grouped animated tech grid with scroll-reveal.
5. Experience — vertical zig-zag timeline, scroll-triggered.
6. Achievements — animated metric counters.
7. Contact — zig-zag CTA band + PHP form + direct links (email, LinkedIn, GitHub, WhatsApp `+92 346 211 5115`).

## Deliverable 2 — hamzayounas.dev (CV redesign + fixes)
- Keep 2-col CV structure, restyle to dark-tech brand, clean `@media print` light mode.
- Fix `max-width: 12 00px` bug + other issues. Cross-link to .com. Standalone `index.html`.
- Preserve privacy-policy.html + terms-of-service.html.

## Contact
- `contact.php`: validate name/email/message, send via mail(), honeypot spam guard, JSON response.
- Direct: mailto hamza.younas94@gmail.com, LinkedIn, GitHub, WhatsApp.

## Deploy (after user review)
- Namecheap LiteSpeed. SSH `ssh -p 21098 pakmfguk@premium909.web-hosting.com` (confirm .com docroot first).
- Nothing live without explicit OK.

## Data source
Content carried from current https://hamzayounas.dev CV (verified).
