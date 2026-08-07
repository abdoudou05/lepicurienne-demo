# Changes Summary — Milestone 2 (Worker M2)

## Target File
`client/src/pages/Home.tsx`

## Detailed Changes

### 1. Dictionary Copy Updates (`copy.fr.footer` & `copy.en.footer`)
- **Location**: Set to `"3037 Rue de la Forêt App 26"` in both French and English dictionaries.
- **Phone**: Set to `"819-448-3630"` in both French and English dictionaries.
- **Attribution Prefix**: Added `attributionPrefix: "Conçu avec passion par"` to `copy.fr.footer` and `attributionPrefix: "Designed with passion by"` to `copy.en.footer`.

### 2. Contact & Social Links JSX Updates
- **Physical Pickup Address**: Wrapped `{t.footer.location}` in a clickable Google Maps anchor tag (`https://maps.google.com/?q=3037+Rue+de+la+For%C3%AAt+App+26+Qu%C3%A9bec+QC`, `target="_blank" rel="noopener noreferrer"`).
- **Email Link**: Wrapped `lepicuriennebywaycha@gmail.com` in `<a href="mailto:lepicuriennebywaycha@gmail.com">`.
- **Phone Link**: Wrapped `{t.footer.phone}` in `<a href="tel:8194483630">`.
- **Instagram Link**: Updated href to `https://www.instagram.com/waycha88`, added `target="_blank" rel="noopener noreferrer"`, `aria-label="Instagram @waycha88"`, and `title="Instagram - @waycha88"`.
- **Facebook Link**: Updated href to `https://www.facebook.com/profile.php?id=100067137965610`, added `target="_blank" rel="noopener noreferrer"`, `aria-label="Facebook l'epicurienne by Waycha"`, and `title="Facebook - l'epicurienne by Waycha"`.

### 3. Footer Attribution Link JSX Update
- Updated bottom copyright bar to dynamically render `{t.footer.attributionPrefix}` followed by an anchor tag pointing to `https://webryk.ca` with `target="_blank" rel="noopener noreferrer"`, styled cleanly with `text-primary hover:underline font-semibold`.

## Verification Results
- `npm run check` (`tsc --noEmit`): PASSED (0 errors).
- `npm run build` (`vite build && esbuild server/index.ts ...`): PASSED (Built successfully in 9.03s).
