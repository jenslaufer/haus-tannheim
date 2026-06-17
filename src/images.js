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

// Curated display order. Per feedback, the three blocks (exterior / interior /
// aerial) are interleaved and the strongest, most varied shots lead — visitors
// browse the first ~15 and lose interest if it isn't varied. Files NOT listed
// here append at the end in natural order, so dropping a new photo into the
// folder still works automatically (it just lands last until placed).
const order = [
  // — Opening 15: strongest shots, rotating exterior / interior / aerial —
  '_KWF1978-HDR.jpg', // balcony view to the forest edge
  '_KWF2023-HDR.jpg', // sunroom with wood-burning stove
  'VS-Tannheim-21.jpg', // clean aerial: house front + garage
  '_KWF1966-HDR.jpg', // balcony into greenery
  '_KWF2050-HDR.jpg', // mid-century wood stair landing
  'VS-Tannheim-20.jpg', // clean aerial: house front
  '_KWF1972-HDR.jpg', // elevated view over the green garden
  '_KWF2014-HDR.jpg', // living room, wood ceiling + stove
  '_KWF1954-HDR.jpg', // brick terrace + garden
  'VS-Tannheim-7.jpg', // aerial: garden side
  '_KWF2011-HDR.jpg', // hallway with open staircase
  '_KWF1957-HDR.jpg', // lush green garden
  'VS-Tannheim-14.jpg', // aerial: overview + pool
  '_KWF2029-HDR.jpg', // bright open room, garden view
  '_KWF1969-HDR.jpg', // balcony over the garden
  // — Strong remainder, still rotating —
  'VS-Tannheim-3.jpg',
  '_KWF2017-HDR.jpg',
  '_KWF2002-HDR.jpg', // (also the hero cover)
  '_KWF2020-HDR.jpg',
  'VS-Tannheim-23.jpg',
  '_KWF1975-HDR.jpg',
  '_KWF2026-HDR.jpg',
  '_KWF1960-HDR.jpg',
  '_KWF2056-HDR.jpg',
  '_KWF1942-HDR.jpg',
  '_KWF2059-HDR.jpg',
  'VS-Tannheim-1.jpg',
  '_KWF2110-HDR.jpg',
  '_KWF1948-HDR.jpg',
  '_KWF2065-HDR.jpg',
  // — Mid tier —
  'VS-Tannheim-13.jpg',
  '_KWF1963-HDR.jpg',
  '_KWF2068-HDR.jpg',
  'VS-Tannheim-12.jpg',
  '_KWF1981-HDR.jpg',
  '_KWF2089-HDR.jpg',
  'VS-Tannheim-5.jpg',
  '_KWF1993-HDR.jpg',
  '_KWF2083-HDR.jpg',
  'VS-Tannheim-24.jpg',
  '_KWF1996-HDR.jpg',
  '_KWF1945-HDR.jpg',
  'VS-Tannheim-2.jpg',
  '_KWF1999-HDR.jpg',
  '_KWF2005-HDR.jpg',
  'VS-Tannheim-26.jpg', // pending clean re-pixelation
  '_KWF2008-HDR.jpg',
  '_KWF2116-HDR.jpg',
  'VS-Tannheim-18.jpg', // pending clean re-pixelation
  'VS-Tannheim-4.jpg',
  'VS-Tannheim-15.jpg',
  // — Weaker shots —
  '_KWF2053-HDR.jpg',
  'VS-Tannheim-22.jpg',
  '_KWF2062-HDR.jpg',
  '_KWF2071-HDR.jpg',
  'VS-Tannheim-6.jpg',
  '_KWF2074-HDR.jpg',
  '_KWF1951-HDR.jpg',
  'VS-Tannheim-9.jpg',
  '_KWF2080-HDR.jpg',
  '_KWF1984-HDR.jpg',
  'VS-Tannheim-8.jpg',
  '_KWF2086-HDR.jpg',
  '_KWF1987-HDR.jpg',
  'VS-Tannheim-10.jpg',
  '_KWF2098.jpg',
  '_KWF1990-HDR.jpg',
  'VS-Tannheim-11.jpg',
  '_KWF2107-HDR.jpg',
  'VS-Tannheim-16.jpg',
  'VS-Tannheim-17.jpg', // pending clean re-pixelation
  'VS-Tannheim-19.jpg',
  'VS-Tannheim-25.jpg', // pending clean re-pixelation
  // — Utility / technical rooms, least attractive: kept last —
  '_KWF2032-HDR.jpg',
  '_KWF2035-HDR.jpg',
  '_KWF2038-HDR.jpg',
  '_KWF2041-HDR.jpg',
  '_KWF2047-HDR.jpg',
  '_KWF2104-HDR.jpg',
]
const rank = new Map(order.map((name, i) => [name, i]))
const rankOf = (name) => (rank.has(name) ? rank.get(name) : Number.POSITIVE_INFINITY)

// Aspect ratio (width / height) per source shot, derived from the filename.
// The whole set is landscape in exactly two ratios: the professional HDR shots
// (_KWF…) are 3:2, the drone/aerial set (VS-Tannheim…) is 16:9. The justified
// gallery (index3.html) uses this to size each tile to its photo so nothing is
// cropped. Verified against every source file (`identify`) on 2026-06-17.
const arFor = (name) => (name.startsWith('VS-Tannheim') ? 16 / 9 : 3 / 2)

const strip = ({ thumb, thumbset, full, name }) => ({ thumb, thumbset, full, ar: arFor(name) })

// Anke asked to drop the unattractive basement shot from the live site. The
// file stays in the folder (the legacy page below still shows it), so the new
// gallery filters it out explicitly rather than by removing the source.
const DROPPED_FROM_NEW = new Set(['_KWF2044-HDR.jpg'])

// — New site (index.html): curated order, weakest shots dropped. —
export const photos = entries
  .filter((e) => !DROPPED_FROM_NEW.has(e.name))
  .sort((a, b) => {
    const diff = rankOf(a.name) - rankOf(b.name)
    return diff !== 0 ? diff : collator.compare(a.name, b.name)
  })
  .map(strip)

// — Legacy site (index2.html): the original order — pro HDR shots first, then
// the drone set, each natural-sorted; nothing dropped. Same source images, so
// the build shares every WebP variant with the new page (no duplication). —
const group = (predicate) =>
  entries.filter((e) => predicate(e.name)).sort((a, b) => collator.compare(a.name, b.name))

const legacyEntries = [
  ...group((n) => n.startsWith('_KWF')),
  ...group((n) => n.startsWith('VS-Tannheim')),
]
export const photosLegacy = legacyEntries.map(strip)
// Legacy hero used the first gallery photo as its cover.
export const coverLegacy = legacyEntries[0].full
