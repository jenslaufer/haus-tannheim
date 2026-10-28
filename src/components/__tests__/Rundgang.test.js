// The 3D tour (2026-10-28): WebGL does not run in jsdom, so these pin the shell
// around the scene: the stage stays inert until started (no scroll trap on a
// phone), there is a way back, and phones get the tour as a room gallery.
import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Rundgang from '../Rundgang.vue'
import { erstelleSzene } from '../../rundgang/szene.js'
import Lightbox from '../Lightbox.vue'
import { stationen } from '../../rundgang/stationen.js'

// the scene never finishes loading unless a test resolves it
vi.mock('../../rundgang/szene.js', () => ({ erstelleSzene: vi.fn(() => new Promise(() => {})) }))
const szene = () => ({ zeige: vi.fn(async () => true), uebersicht: vi.fn(), setzeGruppe: vi.fn(), beiAuswahl: vi.fn(), dispose: vi.fn() })

const mountIt = () => mount(Rundgang, { global: { directives: { reveal: {} } } })
const breite = (schmal) => vi.stubGlobal('matchMedia', () => ({ matches: schmal }))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Rundgang on a wide screen', () => {
  it('takes no input until started, then gives it back', async () => {
    breite(false)
    const w = mountIt()
    const stage = () => w.find('[data-test="buehne"]')
    expect(stage().classes()).toContain('pointer-events-none')
    await w.find('button').trigger('click') // "Rundgang starten"
    expect(stage().classes()).not.toContain('pointer-events-none')
    const stop = w.findAll('button').find((b) => /beenden/.test(b.text()))
    // outside the stage's box: over the model it would hide controls on phones
    expect(stage().element.parentElement.contains(stop.element)).toBe(false)
    await stop.trigger('click')
    expect(stage().classes()).toContain('pointer-events-none')
  })

  it('starts at the first station and steps through all of them', async () => {
    breite(false)
    const w = mountIt()
    await w.find('button').trigger('click')
    const caption = () => w.find('[role="dialog"]').text()
    expect(caption()).toContain(`1/${stationen.length}`)
    await w.find('button[aria-label="Vorheriges Foto"]').trigger('click')
    expect(caption()).toContain(`${stationen.length}/${stationen.length}`)
    await w.find('button[aria-label="Zurück zum Modell"]').trigger('click')
    expect(w.find('[role="dialog"]').exists()).toBe(false)
  })

  it('a station asked for while loading does not reopen after ending', async () => {
    // review of #37: start, end, then the model arrives; the stage took input again
    breite(false)
    let fertig
    erstelleSzene.mockImplementationOnce(() => new Promise((r) => (fertig = r)))
    const w = mountIt()
    await w.find('button').trigger('click') // "Rundgang starten" while loading
    await w.findAll('button').find((b) => /beenden/.test(b.text())).trigger('click')
    await flushPromises() // the scene module loads asynchronously
    const s = szene()
    fertig(s)
    await flushPromises()
    expect(s.zeige).not.toHaveBeenCalled()
    expect(w.find('[data-test="buehne"]').classes()).toContain('pointer-events-none')
  })

  it('falls back to the room gallery when the scene cannot load', async () => {
    breite(false)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    erstelleSzene.mockImplementationOnce(() => Promise.reject(new Error('no WebGL')))
    const w = mountIt()
    await flushPromises()
    expect(w.find('[data-test="buehne"]').exists()).toBe(false)
    expect(w.findAll('img')).toHaveLength(stationen.length)
  })

  it('disposes a scene that arrives after unmount', async () => {
    breite(false)
    let fertig
    erstelleSzene.mockImplementationOnce(() => new Promise((r) => (fertig = r)))
    const w = mountIt()
    w.unmount()
    await flushPromises() // the scene module loads asynchronously
    const s = szene()
    fertig(s)
    await flushPromises()
    expect(s.dispose).toHaveBeenCalled()
  })

  it('leaves arrow keys in text fields alone', async () => {
    breite(false)
    const w = mountIt()
    await w.find('button').trigger('click')
    const input = document.createElement('input')
    document.body.append(input)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await w.vm.$nextTick()
    expect(w.find('[role="dialog"]').text()).toContain(`1/${stationen.length}`)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await w.vm.$nextTick()
    expect(w.find('[role="dialog"]').text()).toContain(`2/${stationen.length}`)
    input.remove()
  })

  it('keeps the link to the plain model', () => {
    breite(false)
    expect(mountIt().find('a[href="./3d/"]').text()).toMatch(/3D-Modell.*Vollbild/)
  })
})

describe('Rundgang on a phone', () => {
  it('shows every photo by room, each room with a plan', () => {
    breite(true)
    const w = mountIt()
    expect(w.find('[data-test="buehne"]').exists()).toBe(false)
    expect(w.findAll('img')).toHaveLength(stationen.length)
    expect(w.findAll('h3').map((h) => h.text())).toContain('Wohnen/Essen · Erdgeschoss · 39,53 m²')
    // one plan per place, but none for the aerial shots far off the plan
    expect(w.findAll('svg').length).toBe(w.findAll('h3').length - 1)
  })

  it('never hides the gallery behind the scroll reveal', () => {
    // reveal.js waits until 12 % of an element is in view: the gallery is too
    // tall for that, and stayed invisible on a phone (2026-10-28)
    breite(true)
    const revealed = []
    const w = mount(Rundgang, { global: { directives: { reveal: { mounted: (el) => revealed.push(el) } } } })
    const gallery = w.find('section').element
    expect(revealed.some((el) => el.contains(gallery))).toBe(false)
  })

  it('opens a photo large', async () => {
    breite(true)
    const w = mountIt()
    await w.find('section button').trigger('click')
    expect(w.findComponent(Lightbox).exists()).toBe(true)
  })
})
