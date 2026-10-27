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

  it('embeds the 3D model, inactive until clicked, with a full-screen link', async () => {
    // Jens missed the small link (2026-10-26): the model now sits in the section.
    // It loads lazily and takes no input until clicked, so it never traps a phone's scroll.
    const w = mountIt()
    const frame = w.find('iframe')
    expect(frame.attributes('src')).toBe('./3d/')
    expect(frame.attributes('loading')).toBe('lazy')
    expect(frame.classes()).toContain('pointer-events-none')
    await w.find('button').trigger('click')
    expect(w.find('iframe').classes()).not.toContain('pointer-events-none')
    expect(w.find('a[href="./3d/"]').text()).toMatch(/3D-Modell.*Vollbild/)
    // a way back, so a phone can scroll past the model again
    const stop = w.find('button')
    expect(stop.text()).toMatch(/beenden/)
    // outside the frame's box: over the model it hid the panel on phones
    expect(w.find('iframe').element.parentElement.contains(stop.element)).toBe(false)
    await stop.trigger('click')
    expect(w.find('iframe').classes()).toContain('pointer-events-none')
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
