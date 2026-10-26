// Why this file exists (2026-10-26):
//
// Jens asked to show the floor plans on the site and to publish the 3D model,
// so visitors see the layout before they request the documents. The plans are
// redrawn from the 1963 Bauantrag in haus-tannheim-private (scripts/plaene.py,
// scripts/modell3d.py) and copied in here. These tests pin what a visitor
// gets: both floors under the site's own floor names, the living area with the
// garage kept out of it, and working links to the 3D model and the PDF.

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Grundrisse from '../Grundrisse.vue'

const pub = (p) => resolve(process.cwd(), 'public', p)
const mountIt = () => mount(Grundrisse, { global: { directives: { reveal: {} } } })

describe('Grundrisse', () => {
  it('shows both floors under the names the description uses', () => {
    const alts = mountIt().findAll('img').map((i) => i.attributes('alt'))
    expect(alts).toHaveLength(2)
    expect(alts[0]).toMatch(/^Grundriss Erdgeschoss/)
    expect(alts[1]).toMatch(/^Grundriss Obergeschoss/)
  })

  it('states the living area and keeps the garage out of it', () => {
    const text = mountIt().text().replace(/\u00a0/g, ' ')
    expect(text).toContain('108 m²')
    expect(text).toMatch(/Garage[^.]*keine Wohnfläche/)
  })

  it('links to the 3D model and the PDF, and both files ship', () => {
    const hrefs = mountIt().findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('./3d/')
    expect(hrefs).toContain('./grundrisse.pdf')
    expect(existsSync(pub('3d/index.html'))).toBe(true)
    expect(existsSync(pub('grundrisse.pdf'))).toBe(true)
  })

  it('never names the street in the published 3D page', () => {
    // The site names only "Tannheim"; the street stays in the private exposé.
    const html = readFileSync(pub('3d/index.html'), 'utf8')
    expect(html).not.toMatch(/Mühlstein|Muehlstein/i)
  })
})
