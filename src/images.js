// Eager glob import: Vite hashes each photo and includes it in the build.
// Sorted numerically by the trailing index in "VS-Tannheim-N.jpg".
const modules = import.meta.glob('./assets/images/*.jpg', {
  eager: true,
  import: 'default',
})

export const photos = Object.entries(modules)
  .map(([path, src]) => ({ src, name: path.split('/').pop() }))
  .sort((a, b) => {
    const n = (s) => parseInt(s.match(/-(\d+)\.jpg$/)?.[1] ?? '0', 10)
    return n(a.name) - n(b.name)
  })
  .map((p) => p.src)
