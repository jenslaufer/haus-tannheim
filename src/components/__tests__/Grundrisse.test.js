// Why this file exists (2026-10-26):
//
// Jens asked to show the floor plans on the site and to publish the 3D model,
// so visitors see the layout before they request the documents. Plans and
// model are generated in haus-tannheim-private (scripts/plaene.py,
// scripts/modell3d.py), which also checks that no buyer file names the street.
// These tests pin what a visitor gets: both floors under the site's own floor
// names, the living area with the garage kept out of it, working links, and a
// 3D page that keeps the privacy notice true (no external scripts).

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
    const text = mountIt().text().replace(/ /g, ' ')
    expect(text).toContain('108 m²')
    expect(text).toMatch(/Garage[^.]*keine Wohnfläche/)
  })

  it('links to the 3D model and the PDF, and both ship', () => {
    const hrefs = mountIt().findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('./3d/')
    expect(hrefs).toContain('./grundrisse.pdf')
    expect(existsSync(pub('3d/index.html'))).toBe(true)
    expect(existsSync(pub('grundrisse.pdf'))).toBe(true)
  })

  it('serves three.js itself: the 3D page loads no external script', () => {
    // The privacy notice (Footer.vue) promises no external scripts.
    const html = readFileSync(pub('3d/index.html'), 'utf8')
    const map = JSON.parse(html.match(/<script type="importmap">([\s\S]*?)<\/script>/)[1])
    for (const url of Object.values(map.imports)) {
      expect(url.startsWith('./')).toBe(true)
      expect(existsSync(pub(`3d/${url}`)) || url.endsWith('/')).toBe(true)
    }
    expect(html).not.toMatch(/<script[^>]+src=["']https?:/)
    expect(existsSync(pub('3d/three/addons/loaders/GLTFLoader.js'))).toBe(true)
    expect(existsSync(pub('3d/three/addons/controls/OrbitControls.js'))).toBe(true)
  })
})
