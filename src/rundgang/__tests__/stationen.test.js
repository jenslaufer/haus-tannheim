// @vitest-environment node
// Why this file exists (2026-10-28):
//
// Jens asked to tie the photos to the 3D model: every photo sits in the model
// where it was taken and looks where the camera looked. The standpoints were
// read off the photos against the plan (windows, doors, stairs), so these tests
// pin what can be checked without a site visit: each photo exists, every
// professional shot on the live site has a standpoint, and each indoor
// standpoint lies inside the room it names.
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { stationen, RAUM_NAMEN } from '../stationen.js'
import { raumVon, innen } from '../tour.js'
import raeume from '../../assets/rundgang/raeume.json'

const image = (name) => new URL(`../../assets/images/${name}`, import.meta.url)
const live = Object.keys(import.meta.glob('../../assets/images/_KWF*.jpg')).map((p) => p.split('/').pop())

describe('Rundgang stations', () => {
  it('every photo exists, once', () => {
    const names = stationen.map((s) => s.foto)
    expect(names.filter((n) => !existsSync(image(n)))).toEqual([])
    expect(new Set(names).size).toBe(names.length)
  })

  it('every professional photo on the live site has a standpoint', () => {
    // Anke dropped the basement shot from the site (images.js); the tour follows.
    const inTour = new Set(stationen.map((s) => s.foto))
    expect(inTour.has('_KWF2044-HDR.jpg')).toBe(false)
    expect(live.filter((n) => n !== '_KWF2044-HDR.jpg' && !inTour.has(n))).toEqual([])
  })

  it('each indoor standpoint lies inside its room', () => {
    const outside = stationen
      .filter((s) => s.raum)
      .filter((s) => !innen(s.pos, raumVon(s).umriss))
      .map((s) => `${s.foto} (${s.raum})`)
    expect(outside).toEqual([])
  })

  it('each outdoor standpoint lies outside the house', () => {
    // aerial shots may hover right above the roof
    const inside = stationen
      .filter((s) => !s.raum && s.bereich !== 'Luftbild' && innen(s.pos, raeume.umriss))
      .map((s) => s.foto)
    expect(inside).toEqual([])
  })

  it('names a known room or an outdoor area, and a direction', () => {
    const ids = new Set(raeume.raeume.map((r) => r.id))
    for (const s of stationen) {
      expect(s.raum ? ids.has(s.raum) : typeof s.bereich === 'string').toBe(true)
      expect(Math.hypot(...s.blick)).toBeGreaterThan(0)
    }
    expect(Object.keys(RAUM_NAMEN).sort()).toEqual([...ids].sort())
  })

  it('no tour file names the street', () => {
    // same rule as the plans in haus-tannheim-private: buyer files never name the street
    const files = ['../stationen.js', '../tour.js', '../szene.js', '../../assets/rundgang/raeume.json']
    const hits = files.filter((f) => /mühlstein/i.test(readFileSync(new URL(f, import.meta.url), 'utf8')))
    expect(hits).toEqual([])
  })

  it('loads nothing from another server', () => {
    // The privacy notice (Footer.vue) promises no external scripts: three.js is bundled.
    const pkg = JSON.parse(readFileSync(new URL('../../../package.json', import.meta.url), 'utf8'))
    expect(pkg.dependencies.three).toBe('0.160.0') // the version public/3d/ serves
    for (const f of ['../szene.js', '../../components/Rundgang.vue', '../../components/RaumGalerie.vue']) {
      expect(readFileSync(new URL(f, import.meta.url), 'utf8')).not.toMatch(/https?:\/\//)
    }
  })
})
