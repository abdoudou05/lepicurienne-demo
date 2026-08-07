# Handoff Report: Branding, SEO & Verification Specification (Spec Miner 3)

**From**: Spec Miner 3 (Branding, SEO & Verification Specialist)  
**To**: Orchestrator & Implementer Team  
**Date**: 2026-08-07  
**Working Directory**: `c:/Users/Hajji/OneDrive - Webryk Studio/Documents/Clients/Demo/L'Épicurienne By Waycha/lepicurienne-demo/.agents/spec_miner_survey_3`  
**Project Directory**: `c:/Users/Hajji/OneDrive - Webryk Studio/Documents/Clients/Demo/L'Épicurienne By Waycha/lepicurienne-demo`  

---

## 1. Observation
Direct, verifiable observations captured during code inspection and command executions:

- **Footer Attribution (`client/src/pages/Home.tsx:977-985`)**:
  - Existing footer contains `© {new Date().getFullYear()} L'Épicurienne By Waycha. {t.footer.rights}`.
  - **Verbatim missing item**: No attribution or link to Webryk Studio (`https://webryk.ca`).
- **Contact Details (`client/src/pages/Home.tsx:182,183,930-974`)**:
  - `t.footer.location` is currently `"Québec, QC, Canada"`. Missing specific street address `3037 Rue de la Forêt App 26`.
  - `t.footer.phone` is currently `"Sur réservation"` (FR) / `"By reservation"` (EN). Missing phone number `819-448-3630` and `tel:` anchor.
  - Email displayed as static text `lepicuriennebywaycha@gmail.com` without `mailto:` protocol link.
  - Instagram icon link has `href="#"` without URL (`https://www.instagram.com/waycha88`).
  - Facebook icon points to `https://www.facebook.com/profile.php?id=100067137965610`.
- **SEO & Head Tags (`client/index.html:1-26`)**:
  - Standard `<title>` and `<meta name="description">` present.
  - **Verbatim missing items**: 0 OpenGraph (`og:*`) tags, 0 Twitter Cards (`twitter:*`) tags, 0 JSON-LD (`<script type="application/ld+json">`) tags.
  - Warning during Vite build regarding unhandled placeholders `%VITE_ANALYTICS_ENDPOINT%` and `%VITE_ANALYTICS_WEBSITE_ID%` in `/index.html`.
- **TypeScript Typecheck (`npm run check`)**:
  - Executed `tsc --noEmit`. Exit code: `0`. 0 errors.
- **Production Build (`npm run build`)**:
  - Executed `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`.
  - Exit code: `0`. Artifacts generated in `dist/public` and `dist/index.js`.
- **Git Repository State (`git status`, `git branch`, `git remote -v`)**:
  - Active branch: `master`.
  - Up-to-date with `origin/master` (`https://github.com/abdoudou05/lepicurienne-demo.git`).

---

## 2. Logic Chain

1. **Branding & Contact Requirements (R2)**:
   - *Observation*: `ORIGINAL_REQUEST.md` lines 23-24 require explicit footer attribution `"Conçu avec passion par Webryk Studio"` (linking to `https://webryk.ca`, opening in a new tab) and pickup contact details (`3037 Rue de la Forêt App 26`, Phone: `819-448-3630`, IG: `@waycha88`, FB: `l'epicurienne by Waycha`, Email: `lepicuriennebywaycha@gmail.com`).
   - *Logic*: Current `Home.tsx` contains placeholder/generic strings for location (`"Québec, QC, Canada"`), phone (`"Sur réservation"`), stub Instagram link (`href="#"`), and zero Webryk Studio attribution. Updating `copy.fr.footer` / `copy.en.footer` and wrapping location, phone, email, and social icons in proper HTML5 `<a>` tags with `tel:`, `mailto:`, and `target="_blank"` attributes directly fulfills R2.

2. **International SEO & Accessibility Requirements (R3)**:
   - *Observation*: `client/index.html` has no JSON-LD structured data and no OpenGraph / Twitter Card meta tags.
   - *Logic*: Search engines and social platforms require structured microdata (JSON-LD `LocalBusiness`/`Restaurant` and `Product` schemas for all 5 drinks) and OpenGraph/Twitter Card metadata for maximum indexing visibility, rich snippet generation, and social card previews. Adding static JSON-LD script blocks and OpenGraph meta tags in `index.html` satisfies R3.
   - *Logic*: Accessibility requires interactive components (social links, mobile menu toggle, submit buttons) to have explicit `aria-label` attributes, minimum 44x44px touch bounding boxes, and visible keyboard focus rings.

3. **Verification & Git Production Push Requirements (R4)**:
   - *Observation*: Both `npm run check` and `npm run build` pass clean with exit code 0. Git repository is on `master` branch pointing to `https://github.com/abdoudou05/lepicurienne-demo.git`.
   - *Logic*: The codebase is stable for implementation. Once implementers complete R1, R2, and R3 changes, executing `npm run check && npm run build` followed by git staging, commit, and push to `master` will trigger Cloudflare Pages automatic deployment as requested in R4.

---

## 3. Caveats
- **Analytics Placeholders in `index.html`**: Lines 19-22 in `client/index.html` reference `%VITE_ANALYTICS_ENDPOINT%/umami`. Vite prints a mild warning when building without these environment variables set. This does not block the build, but cleaning or wrapping the script prevents noise.
- **Windows File Locking (EBUSY)**: On Windows operating systems, concurrent file access by OneDrive or antivirus during `vite build` clean/copy phases can occasionally trigger `EBUSY: resource busy or locked`. Rerunning `npm run build` completes with exit code 0.

---

## 4. Conclusion
The specification mining for R2, R3, and R4 is complete. Precise gap analysis, target HTML/TSX code snippets, JSON-LD schemas, meta tag specifications, and verification steps are fully documented in `analysis.md` and this handoff report.

---

## 5. Verification Method

To independently verify all findings and test subsequent implementation:

1. **Verify Webryk Studio Footer Attribution & Contact Info**:
   - Inspect `client/src/pages/Home.tsx` footer section.
   - Confirm presence of `Conçu avec passion par <a href="https://webryk.ca" target="_blank" rel="noopener noreferrer">Webryk Studio</a>`.
   - Confirm address `3037 Rue de la Forêt App 26`, phone `819-448-3630` (`tel:8194483630`), IG `@waycha88` (`https://www.instagram.com/waycha88`), FB (`https://www.facebook.com/profile.php?id=100067137965610`), and email `lepicuriennebywaycha@gmail.com` (`mailto:lepicuriennebywaycha@gmail.com`).

2. **Verify SEO & OpenGraph & JSON-LD**:
   - Inspect `client/index.html`.
   - Validate presence of `<script type="application/ld+json">` containing `@type: ["Restaurant", "LocalBusiness"]` and 5 `@type: "Product"` objects.
   - Validate OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`) and Twitter Card (`twitter:card`, `twitter:title`, `twitter:image`) meta tags.

3. **Verify Build & Git Commands**:
   - Run `npm run check` -> Must complete with exit code 0.
   - Run `npm run build` -> Must complete with exit code 0 and build assets in `dist/public/`.
   - Run `git status` -> Must confirm `master` branch tracking `origin/master`.
