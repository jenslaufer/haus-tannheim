// @vitest-environment node
// ANGEBOTSPREIS is kept in sync with Facts.vue by hand (Facts.vue's shape is
// parsed by the private exposé script and must not import from data.js).
// This test catches a price change that touched only one of the two files.
import { test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { ANGEBOTSPREIS } from '../data.js'

test('ANGEBOTSPREIS matches the price shown in Facts.vue', () => {
  const facts = readFileSync(new URL('../../components/Facts.vue', import.meta.url), 'utf8')
  const shown = new Intl.NumberFormat('de-DE').format(ANGEBOTSPREIS)
  expect(facts).toContain(`${shown}&nbsp;€`)
})
