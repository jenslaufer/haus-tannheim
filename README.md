# haus-tannheim

Static one-page sales site for a single-family house in **Tannheim**, a district of
**Villingen-Schwenningen (VS)**. Vue 3 + Vite + Tailwind CSS, deployed to GitHub Pages.

> Status: **scaffold**. Structure, photo gallery, and wiring are in place. The final
> visual design and the property content (price, area, rooms, energy value, contact,
> Impressum) are still to be added.

## Stack

- Vue 3 (Composition API, single page — no router)
- Vite 6, `base: './'` so the build works on the Pages project subpath
  (`jenslaufer.github.io/haus-tannheim/`) and on a custom domain root without changes
- Tailwind CSS v4 (`@tailwindcss/vite`)

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
```

## Photos

80 photos live in `src/assets/images/`, in two sets:

- `_KWF####-HDR.jpg` — 54 professional HDR shots (shown first)
- `VS-Tannheim-#.jpg` — 26 drone/preview shots (shown after). These are the
  **privacy-pixelated** versions (source: Google Drive `Tannheim/VS-Tannheim-blurred`) —
  never commit the unpixelated originals.

`src/images.js` glob-imports them, natural-sorts each set, and concatenates pro-first, so
Vite hashes and bundles each one — no manual list to maintain. Drop in or remove files
there and they appear/disappear in the gallery automatically.

Source JPGs are max 2000 px / q82 / metadata stripped (originals stay in `~/Downloads`).
At build time `vite-imagetools` renders two WebP variants per photo: 960 px q75 thumbs
for the gallery grid and 1920 px q80 fulls for hero + Lightbox. `photos` exports
`{ thumb, full }` objects.

### Gallery overview (for feedback rounds)

`scripts/galerie-uebersicht.py` builds a reference sheet so photos can be discussed by
position without ambiguity. It parses the order straight from `src/images.js` (no
hand-kept list) and writes two files into `public/`:

- `galerie-mapping.csv` — `position; aktuelle_position_neu; dateiname; status`
- `galerie-uebersicht.pdf` — A4 contact sheet: thumbnail + original pos + current pos + filename

The **primary** number (`position`) is the original/legacy order (`index2.html`: `_KWF*`
then `VS-Tannheim*`, natural sort, all 80) — the order Anke's feedback refers to. The
curated live position (`index.html`, `_KWF2044` dropped) is shown only as a secondary
`(neu N)` annotation; `(entfernt)` marks the dropped photo. Regenerate after reordering in
`src/images.js`:

```bash
python3 scripts/galerie-uebersicht.py   # needs Pillow
```

Both outputs land in `public/`, so they ship with the build and are reachable at
`haus-tannheim.de/galerie-uebersicht.pdf`. Move them out of `public/` if they should not
be public.

## Structure

```
src/
  App.vue                 # section composition + sticky nav
  images.js               # glob import of gallery photos
  style.css               # design tokens (@theme): fonts + forest/stone/clay/ink palette
  reveal.js               # scroll-reveal directive (motion-safe, no-JS safe)
  components/
    Hero.vue              # cover image + title
    Facts.vue             # key figures (placeholders)
    Gallery.vue           # photo grid + Lightbox
    Lightbox.vue          # fullscreen viewer (← → Esc)
    Description.vue       # location / highlights (placeholder)
    LeadForm.vue          # opt-in to request documents → booking link
    Contact.vue           # contact details (placeholder)
    Footer.vue            # Impressum (legally required in DE)
  leads.js                # lead-capture config + booking URL
```

## Lead flow

Opt-in first: visitors request the documents (exposé) via `LeadForm.vue`, which POSTs to
`auth.solytics.de/t/haus-tannheim/marketing/public/lead-capture` (Launch Kit tenant
`haus-tannheim`, segment `interessenten`, honeypot field `hp`; CORS open, failures never
throw). The success state then links to the booking page
`cal.solytics.de/haus-tannheim/besichtigung` (self-hosted Cal.com, opens in a new tab).

Both services run on the solytics droplet (167.172.176.129). Its Caddy allow-lists
`haus-tannheim.de` in the `frame-ancestors` CSP for `cal.solytics.de` — only relevant if
the calendar is ever embedded again.

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to
Pages. Set the Pages source to **GitHub Actions** once (repo Settings → Pages).

Live: https://jenslaufer.github.io/haus-tannheim/

### Custom domain

`public/CNAME` contains `haus-tannheim.de`; DNS points to GitHub Pages.
