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
- `VS-Tannheim-#.jpg` — 26 preliminary photos (shown after)

`src/images.js` glob-imports them, natural-sorts each set, and concatenates pro-first, so
Vite hashes and bundles each one — no manual list to maintain. Drop in or remove files
there and they appear/disappear in the gallery automatically.

All photos are resized to max 2000 px / JPEG q82 / metadata stripped for the web
(originals stay in `~/Downloads`). Optional further step: WebP + thumbnails (e.g.
`vite-imagetools`) to cut load time more.

## Structure

```
src/
  App.vue                 # section composition
  images.js               # glob import of gallery photos
  components/
    Hero.vue              # cover image + title
    Facts.vue             # key figures (placeholders)
    Gallery.vue           # photo grid + Lightbox
    Lightbox.vue          # fullscreen viewer (← → Esc)
    Description.vue       # location / highlights (placeholder)
    Contact.vue           # contact details (placeholder)
    Footer.vue            # Impressum (legally required in DE)
```

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to
Pages. Set the Pages source to **GitHub Actions** once (repo Settings → Pages).

Live: https://jenslaufer.github.io/haus-tannheim/

### Custom domain (later)

1. Add `public/CNAME` containing the domain (e.g. `haus-tannheim.de`).
2. Set the DNS record at the registrar (CNAME → `jenslaufer.github.io`, or A records to
   GitHub Pages IPs).
3. Confirm the domain in repo Settings → Pages.

No CNAME is committed yet — the domain is not chosen.
