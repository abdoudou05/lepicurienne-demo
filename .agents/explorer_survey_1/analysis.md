# Codebase Architecture & Tech Stack Analysis Report
**Project:** L'Épicurienne By Waycha Website Polish & Enhancement  
**Agent:** Explorer 1 (Codebase Architecture & Tech Stack Specialist)  
**Date:** 2026-08-07  

---

## Executive Summary
The L'Épicurienne By Waycha website is a high-performance single-page application built with React 19, Vite 7, TypeScript 5.6, Tailwind CSS v4, and Framer Motion, using Express on Node.js for backend static serving and Cloudflare Pages SPA deployment via Wrangler. TypeScript compilation (`npm run check`) succeeds with 0 errors; the build setup is functional, though minor HTML asset warnings exist around unreplaced Umami analytics placeholders in `client/index.html`.

---

## 1. Directory Structure & Architecture

```
lepicurienne-demo/
├── client/                      # Frontend Application Root (Vite root)
│   ├── index.html               # Main HTML entry point (meta tags, fonts, mount point)
│   ├── public/                  # Static public assets
│   │   └── assets/              # Logos, high-res photos, product bottle renders
│   └── src/                     # React application source code
│       ├── main.tsx             # React DOM entry point
│       ├── App.tsx              # Application shell (Providers, Router, ErrorBoundary)
│       ├── index.css            # Tailwind v4 import & theme variables (@theme inline)
│       ├── const.ts             # Auth & cookie constants (re-exports @shared/const)
│       ├── components/          # React components
│       │   ├── ErrorBoundary.tsx# App-level error boundary
│       │   ├── ManusDialog.tsx  # Debug dialog component
│       │   ├── Map.tsx          # Map container component
│       │   └── ui/              # 53 Shadcn/Radix UI primitive components
│       ├── contexts/            # ThemeContext & React context providers
│       ├── hooks/               # Custom React hooks (e.g. use-toast.ts)
│       ├── lib/                 # Utility functions (utils.ts)
│       └── pages/               # Page views
│           ├── Home.tsx         # Single-page main landing page (~46KB, 991 lines)
│           └── NotFound.tsx     # 404 page
├── server/                      # Node.js / Express Server
│   └── index.ts                 # Express static asset & SPA fallback server
├── shared/                      # Shared code between client & server
│   └── const.ts                 # Shared constants (cookie name, duration)
├── assets/                      # Root image repository (raw uploads)
├── dist/                        # Build output directory
│   ├── index.js                 # Bundled Node server
│   └── public/                  # Bundled static client assets (Cloudflare target)
├── package.json                 # Project manifest & npm scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite bundler configuration & custom plugins
├── wrangler.json                # Cloudflare Pages deployment configuration
├── vercel.json                  # Vercel deployment configuration
└── components.json              # Shadcn UI configuration
```

---

## 2. Tech Stack & Dependencies Summary

| Layer / Aspect | Technology / Library | Version | Details & Purpose |
| --- | --- | --- | --- |
| **Framework** | React | `^19.2.1` | Modern React with hooks & concurrent features |
| **Build Tool & Server** | Vite | `^7.1.7` | Fast HMR dev server & client bundler |
| **Type Checker** | TypeScript | `5.6.3` | Strict type safety enabled (`"strict": true`) |
| **Routing** | Wouter | `^3.3.5` | Lightweight client-side router (`Switch`, `Route`) |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/vite ^4.1.3` | Next-gen CSS engine using `@theme inline` |
| **Animations** | Framer Motion | `^12.23.22` | Smooth 60fps animations & scroll transforms |
| **UI Components** | Radix UI + Shadcn UI | `@radix-ui/*` | Accessible headless primitives in `src/components/ui/` |
| **Notifications** | Sonner | `^2.0.7` | Toast notification manager |
| **Icons** | Lucide React | `^0.453.0` | SVG icons (`MapPin`, `Mail`, `Phone`, `ArrowRight`, etc.) |
| **Modal / Drawer Primitive**| Vaul & Radix Dialog | `vaul ^1.1.2`, `@radix-ui/react-dialog ^1.1.15` | Ready for product detail modal/drawer views |
| **Backend Server** | Express | `^4.21.2` | Static file server compiled with `esbuild` |
| **Deployment** | Cloudflare Pages / Wrangler | `compatibility_date: 2024-01-01` | Deploy script: `npm run deploy:cloudflare` |

---

## 3. Path Aliases & Configurations

- `@/*` -> `./client/src/*`
- `@shared/*` -> `./shared/*`
- `@assets/*` -> `./attached_assets/*` (defined in `vite.config.ts`)

---

## 4. Current Codebase State vs Requirement Deficits (Gap Analysis)

### Requirement R1: Product Lineup & Detail Integration
- **Current State**: `Home.tsx` contains a static 6-juice list (`Mangue`, `Bouye Fraise`, `Hibiscus Bissap`, `Gingembre Ananas`, `Diabolo Menthe`, `Bouye Passion`) without prices, sizes, detailed ingredients, health benefits, or modal views.
- **Deficit**: Must update to the exact 5 products specified in R1:
  1. **Gingembre** (Naturel, Pur, Bienfaisant - Anti-nausée, maux de gorge, digestion, 1L)
  2. **Bouye Fraise** ($12, 1L - Baobab & Fraise, style smoothie)
  3. **Maad** ($15, 1L - Trésor sauvage d'Afrique de l'Ouest, riche en Vit C, B6, B3, Ca, Mg)
  4. **Diabolo Menthe** ($12, 1L - Onctueux menthe fraîche & lait, saveur crème glacée)
  5. **Bouye (Plain Baobab)** ($12, 1L - Pain de singe 100% naturel, riche en fibres)
- **Modal View**: Need to add an interactive product drawer/modal (using Radix Dialog or Vaul Drawer) triggered when clicking a product card or benefit pill.

### Requirement R2: Webryk Studio Branding & Contact Details
- **Current State**:
  - Footer does NOT contain Webryk Studio link.
  - Location says "Québec, QC, Canada".
  - Phone says "Sur réservation".
- **Deficit**:
  - Add footer attribution: "Conçu avec passion par Webryk Studio" linking to `https://webryk.ca` (`target="_blank"` `rel="noopener noreferrer"`).
  - Update physical address: `3037 Rue de la Forêt App 26`, Québec, QC.
  - Update phone: `819-448-3630`.
  - Update social links: Instagram `@waycha88`, Facebook `l'epicurienne by Waycha`, Email `lepicuriennebywaycha@gmail.com`.

### Requirement R3: International Standard SEO & Mobile-First Excellence
- **Current State**: `index.html` has basic title and meta description. `Home.tsx` dynamically sets title and description on language change.
- **Deficit**:
  - Need OpenGraph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `og:locale`).
  - Need Twitter Cards (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
  - Need JSON-LD Structured Data (`Restaurant` / `LocalBusiness` schema and `Product` schemas for all 5 products).
  - Ensure zero horizontal scroll, perfect touch targets (>= 44px), and proper `aria-labels`.

### Requirement R4: Verification & Git Production Push
- **Compilation Check**: `npm run check` (`tsc --noEmit`) passes cleanly with exit code 0.
- **Build Script Check**: `npm run build` bundles client assets into `dist/public` and server into `dist/index.js`.
- **Note on Analytics Script**: `client/index.html` contains `<script src="%VITE_ANALYTICS_ENDPOINT%/umami">` which produces build warnings if env variables are not present. Removing or commenting out unconfigured script tags will ensure clean build logs.

---

## 5. Asset Map for Product Renders

| Product | Image Path | Status |
| --- | --- | --- |
| Gingembre | `/assets/juice_gingembre_ananas.png` | Available in `client/public/assets/` |
| Bouye Fraise | `/assets/juice_bouye_fraise.png` | Available in `client/public/assets/` |
| Maad | `/assets/juice_cinematic.png` or custom raw upload in `assets/` | Ready to map |
| Diabolo Menthe | `/assets/juice_diabolo_menthe.png` | Available in `client/public/assets/` |
| Bouye (Plain Baobab) | `/assets/juice_bouye_passion.png` or dedicated asset | Available in `client/public/assets/` |
| Webryk Logo | `/assets/webryk-logo-white.png` | Available in `client/public/assets/` |
