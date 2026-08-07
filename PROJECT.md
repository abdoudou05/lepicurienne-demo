# Project: L'Épicurienne By Waycha Website Polish

## Architecture
- **Framework**: React 19 (`react` 19.2.1), Vite 7 (`vite` 7.1.7), TypeScript 5.6.3, Wouter router (`wouter` 3.3.5)
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion 12, Radix UI primitives (`@radix-ui/react-dialog`), Vaul Drawer (`vaul`), Lucide icons
- **Server & Deployment**: Express server (`server/index.ts`), Vite static build output (`dist/public`), Cloudflare Pages (`wrangler.json`)
- **Main View File**: `client/src/pages/Home.tsx` (contains page sections, language dictionary `copy.fr` / `copy.en`, product cards, contact footer)
- **HTML Entry**: `client/index.html` (mount point, head meta, fonts, JSON-LD structured data scripts)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Gingembre Product Data & Copy | Naturel, Pur, Bienfaisant - Anti-nausée, maux de gorge, digestion, 1L, $12 | M1 | R1 |
| 2 | Bouye Fraise Product Data & Copy | Baobab & Fraise, style smoothie, 1L, $12 | M1 | R1 |
| 3 | Maad Product Data & Copy | Trésor sauvage d'Afrique de l'Ouest, rich in Vit C, B6, B3, Ca, Mg, 1L, $15 | M1 | R1 |
| 4 | Diabolo Menthe Product Data & Copy | Onctueux menthe fraîche & lait, saveur crème glacée, 1L, $12 | M1 | R1 |
| 5 | Bouye (Plain Baobab) Product Data & Copy | Pain de singe 100% naturel, rich in fibers, 1L, $12 (replaces bouye-passion) | M1 | R1 |
| 6 | Product Cards Price & Size Tags | Floating $12/$15 badges, 1L volume indicators, interactive health benefit pills | M1 | R1 |
| 7 | Product Detail Modal / Drawer | Responsive modal (Dialog for desktop / Drawer for mobile) with full details & CTA | M1 | R1 |
| 8 | Webryk Studio Footer Attribution | "Conçu avec passion par Webryk Studio" linking to https://webryk.ca (target="_blank") | M2 | R2 |
| 9 | Contact & Pickup Details Update | Address: 3037 Rue de la Forêt App 26, Phone: 819-448-3630, IG: @waycha88, FB, Email | M2 | R2 |
| 10 | JSON-LD Structured Data | LocalBusiness/Restaurant schema + 5 Product schemas injected into index.html | M3 | R3 |
| 11 | OpenGraph & Twitter Cards Meta | Complete og:title, og:description, og:image, twitter:card, canonical tags | M3 | R3 |
| 12 | Semantic HTML5 & Accessibility | Section headings, aria-labels, touch target sizing (min 44x44px), mobile-first polish | M3 | R3 |
| 13 | Build Verification | `npm run check` and `npm run build` verification with 0 errors | M4 | R4 |
| 14 | Git Stage, Commit & Push | Commit all changes and push to GitHub master branch (abdoudou05/lepicurienne-demo) | M4 | R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Product Lineup & Detail Modal Integration | Features 1-7 (5 authentic products, $12/$15 pricing, 1L volume, health pills, detail modals/drawers) | none | DONE |
| M2 | Webryk Branding & Contact Details Update | Features 8-9 (Webryk Studio footer attribution with link, updated contact/pickup info) | M1 | DONE |
| M3 | International SEO & Mobile-First Polish | Features 10-12 (JSON-LD LocalBusiness & Product schemas, OG/Twitter meta, HTML5 semantics, mobile polish) | M2 | DONE |
| M4 | Verification, Git Commit & Push | Features 13-14 (npm run check, npm run build, git commit & push to GitHub master) | M3 | PLANNED |

## Interface Contracts
### Data ↔ UI Component Contract
- `JuiceItem` interface extended to support:
  - `id`: string
  - `name`: string
  - `tagline`: string
  - `description`: string
  - `longDescription`: string
  - `price`: number (12 or 15)
  - `volume`: string ("1L")
  - `ingredients`: string[]
  - `healthBenefits`: string[]
  - `tasteProfile`: string
  - `image`: string
  - `color`: string
- `ProductModal` component accepts `selectedProduct: JuiceItem | null` and `onClose: () => void`.

## Code Layout
- `client/index.html` — Head meta tags, JSON-LD scripts, font imports
- `client/src/pages/Home.tsx` — Main landing page, copy dictionary (FR/EN), product section grid, footer, contact section
- `client/src/components/ui/dialog.tsx` — Radix UI desktop dialog modal primitive
- `client/src/components/ui/drawer.tsx` — Vaul mobile drawer modal primitive
- `client/src/components/ui/badge.tsx` — Shadcn badge primitive for health pills and pricing
