// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { innen, inSzene, blickVektor, augenhoehe, gruppen, titel, schritt } from '../tour.js'
import raeume from '../../assets/rundgang/raeume.json'

const quadrat = [[0, 0], [2, 0], [2, 2], [0, 2]]

describe('tour helpers', () => {
  it('tests a point against a polygon', () => {
    expect(innen([1, 1], quadrat)).toBe(true)
    expect(innen([3, 1], quadrat)).toBe(false)
  })

  it('maps plan metres onto the centred glTF model', () => {
    // GLB: x = plan x, y = height, z = plan y - depth; the scene centres it on the footprint
    const [x, y, z] = inSzene([0, 0], 1.5)
    expect(x).toBeCloseTo(-raeume.breite / 2)
    expect(y).toBe(1.5)
    expect(z).toBeCloseTo(-raeume.tiefe / 2)
  })

  it('turns heading and pitch into a unit vector', () => {
    const [x, y, z] = blickVektor({ blick: [3, 4], neigung: 0 })
    expect([x, y, z].map((v) => +v.toFixed(3))).toEqual([0.6, 0, 0.8])
    expect(blickVektor({ blick: [0, 1], neigung: -90 })[1]).toBeCloseTo(-1)
  })

  it('puts indoor eyes 1.5 m over the room floor, unless a height is given', () => {
    expect(augenhoehe({ raum: 'wohnen', pos: [5, 3] })).toBeCloseTo(-1.25)
    expect(augenhoehe({ raum: 'diele', pos: [4.9, 6.1], hoehe: 1.5 })).toBe(1.5)
    expect(augenhoehe({ bereich: 'Garten', pos: [0, -9], hoehe: -1.15 })).toBe(-1.15)
  })

  it('groups consecutive stations of one place, in tour order', () => {
    const s = [{ raum: 'wc' }, { raum: 'wc' }, { bereich: 'Garten' }, { raum: 'wc' }]
    expect(gruppen(s).map((g) => [g.schluessel, g.stationen.length, g.start])).toEqual([
      ['wc', 2, 0],
      ['Garten', 1, 2],
      ['wc', 1, 3],
    ])
  })

  it('titles rooms with the site floor names and the plan area', () => {
    expect(titel({ raum: 'wohnen' })).toBe('Wohnen/Essen · Erdgeschoss · 39,53 m²')
    expect(titel({ raum: 'garage' })).toBe('Garage · Obergeschoss')
    expect(titel({ bereich: 'Balkon' })).toBe('Balkon')
  })

  it('steps through the tour and wraps around', () => {
    expect(schritt(0, -1, 5)).toBe(4)
    expect(schritt(4, 1, 5)).toBe(0)
  })
})
