# Handoff Report — Explorer 2 (Product Data & UI Modal Specialist)

## 1. Observation
- **Target Repository & Files**:
  - `client/src/pages/Home.tsx` (lines 93-136 & 246-289): Contains hardcoded `copy.fr.flavors.juices` and `copy.en.flavors.juices`.
  - Current fields per juice: `id`, `name`, `description`, `image`, `color`.
  - Absence of fields: No `price` ($12 / $15), no `volume` (1L), no `ingredients`, no `healthBenefits` / `healthPills`, no `tasteProfile`, no modal content.
- **Product Inventory Gaps**:
  - `Gingembre`: Currently `gingembre-ananas` without explicit purity/health copy (Anti-nausée, maux de gorge, digestion).
  - `Bouye Fraise`: Exists, but lacks price ($12), volume (1L), smoothie style note, and health benefit tags.
  - `Maad`: Completely missing from dataset.
  - `Diabolo Menthe`: Exists, but lacks creamy milk/ice cream flavor notes ("Onctueux menthe fraîche & lait, saveur crème glacée"), price ($12), size (1L), and benefit tags.
  - `Bouye (Plain Baobab)`: Existing dataset features `bouye-passion` instead of 100% natural plain baobab.
- **UI & Component Architecture**:
  - UI primitives available: `Dialog` (`client/src/components/ui/dialog.tsx`), `Drawer` (`client/src/components/ui/drawer.tsx`), `Badge` (`client/src/components/ui/badge.tsx`).
  - Cards in `Home.tsx` (lines 774-805): Static cards with `<a href="#contact">` links. Zero modal/drawer trigger state currently exists.

## 2. Logic Chain
1. *Observation*: `Home.tsx` stores juice items with only `id`, `name`, `description`, `image`, `color`.
2. *Deduction*: Adding authentic pricing ($12/$15), volume (1L), health tags, ingredients, and modal details requires expanding the data schema or extracting it to `client/src/data/products.ts`.
3. *Observation*: `Maad` is missing, `Bouye Plain` is missing (replaced by `bouye-passion`), and `Gingembre`, `Bouye Fraise`, `Diabolo Menthe` lack required authentic attributes.
4. *Deduction*: Data entries must be updated/added across both French and English dictionaries to fulfill Requirement R1 and Acceptance Criteria.
5. *Observation*: `Dialog` (Radix) and `Drawer` (Vaul) components already exist in `client/src/components/ui/`.
6. *Deduction*: The UI can seamlessly display interactive health benefit pills on cards and trigger a responsive detail modal/drawer without installing new dependencies.

## 3. Caveats
- No caveats. The codebase structure and UI component availability have been fully verified.

## 4. Conclusion
The existing product data and card UI require targeted refactoring to support the 5 authentic products, $12/$15 pricing, 1L volume tags, interactive benefit pills, and responsive detail modal/drawer popups. All necessary UI primitives (`Dialog`, `Drawer`, `Badge`) are present and ready for integration.

Detailed design recommendations and data models have been documented in `.agents/explorer_survey_2/analysis.md`.

## 5. Verification Method
To independently verify this survey:
1. Inspect `client/src/pages/Home.tsx` lines 93-136 to confirm the existing juice object structure.
2. Check `client/src/components/ui/dialog.tsx` and `client/src/components/ui/drawer.tsx` to confirm component availability.
3. Review `.agents/explorer_survey_2/analysis.md` for the complete comparison matrix and data schema.
4. Execute `npm run check` to verify current TypeScript compilation baseline.
