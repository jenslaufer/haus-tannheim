// @vitest-environment node
// The site names no price (Jens, 2026-10-27): the price is given to each
// buyer personally. Leads got a different figure than the site showed.
// Figures: every price ever named (280k listed, 265k and 220k offered).
import { it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')
const ALL = { ...import.meta.glob('../**/*.{vue,js}', { query: '?raw', import: 'default', eager: true }) }

it('no page text or preview names an asking price', () => {
  const sources = { 'index.html': read('index.html'), ...ALL }
  const hits = Object.entries(sources)
    .filter(([file]) => !file.includes('__tests__'))
    .filter(([, src]) => /\b(280|265|220)[.\s]?000\b|\bVHB\b|\bVB\b|Angebotspreis|ANGEBOTSPREIS/.test(src))
    .map(([file]) => file)
  expect(hits).toEqual([])
})
