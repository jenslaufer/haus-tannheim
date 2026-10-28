// Pure helpers of the photo tour, shared by the 3D scene and the room gallery.
import raeume from '../assets/rundgang/raeume.json'
import { RAUM_NAMEN } from './stationen.js'

const AUGE = 1.5 // eye height over the floor, metres
const byId = Object.fromEntries(raeume.raeume.map((r) => [r.id, r]))

export const raumVon = (s) => byId[s.raum]

// even-odd ray cast; plan polygons are simple
export function innen([x, y], poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

// plan metres -> scene: the GLB has x = plan x, y = height, z = plan y - depth,
// and the scene centres it on the footprint
export const inSzene = ([x, y], z) => [x - raeume.breite / 2, z, y - raeume.tiefe / 2]

export function blickVektor({ blick: [dx, dy], neigung = 0 }) {
  const p = (neigung * Math.PI) / 180
  const len = Math.hypot(dx, dy)
  return [(dx / len) * Math.cos(p), Math.sin(p), (dy / len) * Math.cos(p)]
}

export const augenhoehe = (s) => s.hoehe ?? raumVon(s).boden + AUGE

export const geschoss = (s) => (s.raum ? raumVon(s).geschoss : null)

const flaeche = (m2) => `${m2.toFixed(2).replace('.', ',')} m²`

export function titel(s) {
  if (!s.raum) return s.bereich
  const r = raumVon(s)
  return [RAUM_NAMEN[s.raum], r.geschoss, r.flaeche && flaeche(r.flaeche)].filter(Boolean).join(' · ')
}

// consecutive stations of one room or area, in tour order
export function gruppen(stationen) {
  const out = []
  stationen.forEach((s, i) => {
    const schluessel = s.raum ?? s.bereich
    const last = out.at(-1)
    if (last?.schluessel === schluessel) last.stationen.push(s)
    else out.push({ schluessel, start: i, stationen: [s] })
  })
  return out
}

export const schritt = (i, d, n) => (i + d + n) % n
