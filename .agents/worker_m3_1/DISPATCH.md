## 2026-08-07T17:09:28Z
You are Worker M3 for Milestone 3 (International SEO & Mobile-First Polish).
Your working directory is: c:/Users/Hajji/OneDrive - Webryk Studio/Documents/Clients/Demo/L'Épicurienne By Waycha/lepicurienne-demo/.agents/worker_m3_1
Project root is: c:/Users/Hajji/OneDrive - Webryk Studio/Documents/Clients/Demo/L'Épicurienne By Waycha/lepicurienne-demo
Read ORIGINAL_REQUEST.md at: c:/Users/Hajji/OneDrive - Webryk Studio/Documents/Clients/Demo/L'Épicurienne By Waycha/lepicurienne-demo/.agents/ORIGINAL_REQUEST.md
Read PROJECT.md at: c:/Users/Hajji/OneDrive - Webryk Studio/Documents/Clients/Demo/L'Épicurienne By Waycha/lepicurienne-demo/PROJECT.md

Scope & Assignment (Milestone 3 - Features 10, 11, 12):
1. **JSON-LD Structured Data** (`client/index.html`):
   - Inject complete `<script type="application/ld+json">` for `LocalBusiness` / `Restaurant` (or `GourmetStore` / `FoodEstablishment`) with business details: name "L'Épicurienne By Waycha", address "3037 Rue de la Forêt App 26", phone "819-448-3630", email "lepicuriennebywaycha@gmail.com", priceRange "$$", openingHours, sameAs social links.
   - Inject 5 `Product` / `MenuItem` JSON-LD schemas for:
     1) Gingembre ($12, 1L, anti-nausée, maux de gorge, digestion)
     2) Bouye Fraise ($12, 1L, baobab & fraise)
     3) Maad ($15, 1L, trésor sauvage d'Afrique de l'Ouest)
     4) Diabolo Menthe ($12, 1L, menthe fraîche & lait)
     5) Bouye ($12, 1L, baobab 100% naturel)
2. **OpenGraph & Twitter Cards Meta Tags** (`client/index.html`):
   - `og:title`: "L'Épicurienne By Waycha — Jus Artisanaux & Saveurs Authentiques d'Afrique"
   - `og:description`: "Découvrez nos jus naturels faits maison : Gingembre, Bouye, Bouye Fraise, Maad, Diabolo Menthe. 100% naturels, riches en bienfaits."
   - `og:type`: "website"
   - `og:image`: social preview image
   - `twitter:card`: "summary_large_image"
   - `twitter:title`, `twitter:description`, `twitter:image`
   - Canonical tag `<link rel="canonical" href="...">`
   - Viewport meta tag configured properly for mobile
3. **HTML5 Semantics, Accessibility & Mobile Polish**:
   - Ensure proper HTML5 semantic elements (`<main>`, `<header>`, `<footer>`, `<section>`, `<article>`) in `client/index.html` and `client/src/pages/Home.tsx`.
   - Ensure all interactive buttons/links have descriptive `aria-label` attributes where text isn't explicit.
   - Ensure touch targets meet minimum 44x44px sizing for mobile usability.
   - Ensure zero horizontal scroll on mobile viewport.
