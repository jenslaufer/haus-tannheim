// Why this file exists (2026-10-26):
//
// Jens asked to show the floor plans on the site and to publish the 3D model,
// so visitors see the layout before they request the documents. Plans and
// model are generated in haus-tannheim-private (scripts/plaene.py,
// scripts/modell3d.py), which also checks that no buyer file names the street.
// These tests pin what a visitor gets: both floors under the site's own floor
// names, the living area with the garage kept out of it, working links, and a
// 3D page that keeps the privacy notice true (no external scripts).
// The tour's own behaviour is pinned in Rundgang.test.js.

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

  it('shows the 3D tour in the section', () => {
    // Jens missed the small link (2026-10-26), so the model sits in the section;
    // since 2026-10-28 it carries the photo standpoints (Rundgang.vue).
    const w = mountIt()
    expect(w.find('#modell-3d').text()).toMatch(/3D-Rundgang/)
    expect(w.find('a[href="#modell-3d"]').exists()).toBe(true)
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
    // no address anywhere: catches script src, remote imports, fetch, CSS url() alike
    // (the embedded model is base64, which cannot contain "://")
    expect(html).not.toMatch(/https?:\/\//)
    expect(existsSync(pub('3d/three/addons/loaders/GLTFLoader.js'))).toBe(true)
    expect(existsSync(pub('3d/three/addons/controls/OrbitControls.js'))).toBe(true)
  })

  it('can hide the loading notice once the model is shown', () => {
    // #status is laid out with display: grid, which beats the hidden attribute
    // unless a [hidden] rule restores it; without it the notice covers the model.
    const html = readFileSync(pub('3d/index.html'), 'utf8')
    expect(html).toMatch(/#status\[hidden\]\s*\{\s*display:\s*none/)
  })
})
