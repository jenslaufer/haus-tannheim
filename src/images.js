// Eager glob imports: Vite hashes each photo and includes it in the build.
// vite-imagetools renders three WebP variants per source JPG:
//   - thumbs 480 + 960 px (q75) as srcset for the gallery grid
//   - full   1920 px (q80) for the hero and the Lightbox
// Two photo sets live side by side:
//   - "_KWF####-HDR.jpg"  professional HDR shoot (shown first)
//   - "VS-Tannheim-#.jpg"  preliminary drone/preview set (shown after;
//     privacy-pixelated versions, source: Drive "Tannheim/VS-Tannheim-blurred")
// Each group is natural-sorted (so -2 comes before -10).
const thumbs = import.meta.glob('./assets/images/*.jpg', {
  eager: true,
  import: 'default',
  query: { w: 960, format: 'webp', quality: 75 },
})
const thumbsets = import.meta.glob('./assets/images/*.jpg', {
  eager: true,
  import: 'default',
  query: { w: '480;960', format: 'webp', quality: 75, as: 'srcset' },
})
const fulls = import.meta.glob('./assets/images/*.jpg', {
  eager: true,
  import: 'default',
  query: { w: 1920, format: 'webp', quality: 80 },
})

const collator = new Intl.Collator('de', { numeric: true, sensitivity: 'base' })

const entries = Object.keys(thumbs).map((path) => ({
  thumb: thumbs[path],
  thumbset: thumbsets[path],
  full: fulls[path],
  name: path.split('/').pop(),
}))

const group = (predicate) =>
  entries
    .filter((e) => predicate(e.name))
    .sort((a, b) => collator.compare(a.name, b.name))

// Array of { thumb, thumbset, full } objects, pro shots first.
export const photos = [
  ...group((n) => n.startsWith('_KWF')),
  ...group((n) => n.startsWith('VS-Tannheim')),
].map(({ thumb, thumbset, full }) => ({ thumb, thumbset, full }))
