// Eager glob import: Vite hashes each photo and includes it in the build.
// Two photo sets live side by side:
//   - "_KWF####-HDR.jpg"  professional HDR shoot (shown first)
//   - "VS-Tannheim-#.jpg"  preliminary set (shown after)
// Each group is natural-sorted (so -2 comes before -10).
const modules = import.meta.glob('./assets/images/*.jpg', {
  eager: true,
  import: 'default',
})

const collator = new Intl.Collator('de', { numeric: true, sensitivity: 'base' })

const entries = Object.entries(modules).map(([path, src]) => ({
  src,
  name: path.split('/').pop(),
}))

const group = (predicate) =>
  entries
    .filter((e) => predicate(e.name))
    .sort((a, b) => collator.compare(a.name, b.name))

export const photos = [
  ...group((n) => n.startsWith('_KWF')),
  ...group((n) => n.startsWith('VS-Tannheim')),
].map((e) => e.src)
