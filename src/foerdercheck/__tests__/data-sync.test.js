// @vitest-environment node
// ANGEBOTSPREIS is kept in sync with Facts.vue and Hero.vue by hand (Facts.vue's shape is
// parsed by the private exposé script and must not import from data.js).
// This test catches a price change that touched only one of the two files.
import { test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { ANGEBOTSPREIS } from '../data.js'

for (const file of ['Facts.vue', 'Hero.vue']) {
  test(`ANGEBOTSPREIS matches the price shown in ${file}`, () => {
    const vue = readFileSync(new URL(`../../components/${file}`, import.meta.url), 'utf8')
    const shown = new Intl.NumberFormat('de-DE').format(ANGEBOTSPREIS)
    expect(vue).toContain(`${shown}&nbsp;€`)
  })
}
