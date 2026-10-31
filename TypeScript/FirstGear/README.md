# First Gear: unofficial demo site

An independent demonstration website for First Gear Car Polish and Cleaning (Al Jerf 2, Ajman), built by Bashar Abdallah. It's not the official business website, it isn't deployed, and the page carries `noindex`.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # vitest: content, language switch/RTL, swatch selection, booking form
npm run build
npm run demo     # production build + preview at localhost:4173 (use this to present)
```

- Stack: Vite, React 19, TypeScript, plain CSS tokens (`src/index.css`), self-hosted fonts (Archivo variable width, Noto Kufi Arabic).
- All copy and business facts live in `src/content.ts` (English and Arabic). Unverified items render with a "Placeholder" marker.
- Language: English by default; `?lang=ar` or the header toggle switches to Arabic RTL (remembered per browser).
- Contact: First Gear uses **+971 50 280 0719 for both calls and WhatsApp** (confirmed). WhatsApp buttons open `wa.me/971502800719` with a pre-written message, and Call buttons dial `tel:+971502800719`. The booking form never posts anywhere: it only opens WhatsApp with the request written out, and the visitor sends it themself.
- Photos: two free Unsplash images, labelled illustrative on the page. See `public/img/PROVENANCE.md`.
