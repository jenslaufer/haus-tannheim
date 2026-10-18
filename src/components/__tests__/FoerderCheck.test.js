// Why this file exists (2026-10-18):
//
// The Fördercheck shows money figures on a public sales page. These tests pin
// the promises the spec makes to the visitor: the flow reaches a result, the
// result never hides the renovation, it always offers a human next to the
// calendar, and the answers never leave the browser.
// Spec: docs/superpowers/specs/2026-10-18-foerdercheck-design.md

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FoerderCheck from '../FoerderCheck.vue'
import { BOOKING_URL, CONTACT_EMAIL } from '../../leads.js'

const global = { directives: { reveal: {} } }

const click = (w, sel) => w.find(`[data-test="${sel}"]`).trigger('click')
async function fill(w, sel, value) {
  await w.find(`[data-test="${sel}"]`).setValue(String(value))
}

// Family: self-use, 2 children, no property, zvE 80.000, asking price,
// 50.000 equity, renovation costs unknown.
async function walkFamily(w) {
  await click(w, 'start')
  await click(w, 'choice-ja') // selbst einziehen
  await click(w, 'choice-2') // Kinder
  await click(w, 'choice-nein') // Eigentum
  await fill(w, 'input', 80000)
  await click(w, 'next')
  await click(w, 'next') // Kaufpreis vorbelegt
  await fill(w, 'input', 50000)
  await click(w, 'next')
  await click(w, 'unknown') // Sanierungskosten noch unbekannt
}

describe('FoerderCheck', () => {
  let fetchSpy, setItemSpy
  beforeEach(() => {
    fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('walks a family through to the result', async () => {
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    const t = w.text()
    expect(t).toContain('160.000 €')
    expect(t).toContain('1,00 %')
    expect(t).toContain('Rate ohne Sanierung')
    expect(t).toContain('Sanierung: umfassend nötig')
    expect(t).toContain('Notartermin')
    expect(t).toContain('54 Monate')
  })

  it('investor gets the short honest result', async () => {
    const w = mount(FoerderCheck, { global })
    await click(w, 'start')
    await click(w, 'choice-nein')
    expect(w.text()).toContain('Selbstnutzung')
    expect(w.find('[data-test="loan-308"]').exists()).toBe(false)
  })

  it('changing an answer after going back updates the result', async () => {
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    for (let i = 0; i < 7; i++) {
      if (!w.find('[data-test="back"]').exists()) break
      await click(w, 'back')
    }
    await click(w, 'choice-nein')
    expect(w.text()).toContain('Selbstnutzung')
    expect(w.find('[data-test="loan-308"]').exists()).toBe(false)
  })

  it('result always offers booking and a human', async () => {
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    const hrefs = w.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain(`${BOOKING_URL}?utm_source=foerdercheck`)
    expect(hrefs).toContain(`mailto:${CONTACT_EMAIL}`)
    expect(hrefs).toContain('#unterlagen')
  })

  it('shows stand and disclaimer', async () => {
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    expect(w.text()).toContain('18.10.2026')
    expect(w.text()).toContain('keine Förder-, Finanz- oder Steuerberatung')
  })

  it('print button calls window.print', async () => {
    const print = vi.fn()
    vi.stubGlobal('print', print)
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    await click(w, 'print')
    expect(print).toHaveBeenCalled()
  })

  it('restart returns to the intro', async () => {
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    await click(w, 'restart')
    expect(w.find('[data-test="start"]').exists()).toBe(true)
  })

  it('never touches network or storage', async () => {
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(setItemSpy).not.toHaveBeenCalled()
  })

  it('contains no private data', async () => {
    const w = mount(FoerderCheck, { global })
    await walkFamily(w)
    const html = w.html()
    expect(html).not.toMatch(/\d{3,}\s?\/?\s?\d{4,}/)
    // Generic street-address shape — never the real street name in this public repo.
    expect(html).not.toMatch(/\b\w+(str(\.|aße)|weg|ring|gasse|allee|platz)\s+\d+/i)
  })
})
