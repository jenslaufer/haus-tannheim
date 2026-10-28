// Why this file exists (2026-10-28): Jens asked how to keep a wrong figure or a
// calculator slip from becoming a claim against him. The notarial contract is the
// real protection; the site's part is to say where each figure comes from, that it
// is given without warranty, and that only the contract binds.
import { it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Facts from '../components/Facts.vue'

const FOERDER = Object.values(import.meta.glob('../components/FoerderResult.vue', { query: '?raw', import: 'default', eager: true }))[0]

it('the key facts name their sources, carry no warranty and defer to the contract', () => {
  const text = mount(Facts, { global: { directives: { reveal: {} } } }).text()
  expect(text).toMatch(/Bauplan 1963/)
  expect(text).toMatch(/Energieausweis/)
  expect(text).toMatch(/ohne Gewähr/)
  expect(text).toMatch(/Verbindlich ist allein der notarielle Kaufvertrag/)
})

it('the Fördercheck asks to confirm the result with the bank or the KfW', () => {
  expect(FOERDER).toMatch(/keine Förder-, Finanz- oder Steuerberatung/)
  expect(FOERDER).toMatch(/von Ihrer Bank oder der KfW bestätigen/)
})
