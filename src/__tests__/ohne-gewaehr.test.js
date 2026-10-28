// Why this file exists (2026-10-28): Jens asked how to keep a wrong figure or a
// calculator slip from becoming a claim against him. The notarial contract is the
// real protection; the site's part is to say where each figure comes from, that it
// is given without warranty, and that only the contract binds.
import { it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Facts from '../components/Facts.vue'
import FoerderResult from '../components/FoerderResult.vue'

it('the key facts name their sources, carry no warranty and defer to the contract', () => {
  const text = mount(Facts, { global: { directives: { reveal: {} } } }).text()
  expect(text).toMatch(/Bauplänen von 1963/)
  expect(text).toMatch(/Energieausweis/)
  expect(text).toMatch(/ohne Gewähr/)
  expect(text).toMatch(/Verbindlich ist allein der notarielle Kaufvertrag/)
})

it('the Fördercheck asks to confirm the result with whoever grants it', () => {
  // review of #44: KfW 458 can only be applied for after the purchase, and the
  // envelope grant comes from the BAFA, so no "before the purchase, bank or KfW"
  const result = { investor: true, scenarios: [], auchPruefen: [] } // the footer shows in every branch
  const text = mount(FoerderResult, { props: { result } }).text().replace(/\s+/g, ' ')
  expect(text).toMatch(/keine Förder-, Finanz- oder Steuerberatung/)
  expect(text).toMatch(/von Ihrer Bank, der KfW oder dem BAFA bestätigen/)
  expect(text).not.toMatch(/vor dem Kauf/)
})
