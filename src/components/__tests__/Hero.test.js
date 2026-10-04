// Why this file exists (2026-10-04):
//
// Jens asked for the header photos to change every three seconds instead of
// showing one fixed cover. These tests pin the rotation: Anke's pinned cover
// leads, the next photo follows after 3 s, the loop wraps, the legacy page
// keeps its static cover, and only shown or next photos are in the DOM (so a
// phone does not fetch the whole set up front).

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('../../images.js', () => ({
  photos: [{ full: 'a.webp' }, { full: 'b.webp' }, { full: 'cover.webp' }],
  coverLegacy: 'legacy.webp',
}))
vi.mock('../../assets/images/_KWF2002-HDR.jpg?w=1920&format=webp&quality=80', () => ({
  default: 'cover.webp',
}))

const { default: Hero, HERO_INTERVAL_MS } = await import('../Hero.vue')

const visible = (w) => w.find('img[data-active="true"]').attributes('src')

describe('Hero slideshow', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('rotates every three seconds', () => {
    expect(HERO_INTERVAL_MS).toBe(3000)
  })

  it('starts on the pinned cover, then advances and wraps', async () => {
    const w = mount(Hero)
    expect(visible(w)).toBe('cover.webp')
    await vi.advanceTimersByTimeAsync(3000)
    expect(visible(w)).toBe('a.webp')
    await vi.advanceTimersByTimeAsync(3000)
    expect(visible(w)).toBe('b.webp')
    await vi.advanceTimersByTimeAsync(3000)
    expect(visible(w)).toBe('cover.webp')
  })

  it('does not list the cover twice', () => {
    const w = mount(Hero)
    vi.advanceTimersByTime(10 * 3000)
    const srcs = w.findAll('img').map((i) => i.attributes('src'))
    expect(srcs.filter((s) => s === 'cover.webp')).toHaveLength(1)
  })

  it('renders only the current and the next photo before they are due', () => {
    const w = mount(Hero)
    expect(w.findAll('img')).toHaveLength(2)
  })

  it('keeps the legacy page on its static cover', async () => {
    const w = mount(Hero, { props: { variant: 'legacy' } })
    await vi.advanceTimersByTimeAsync(9000)
    expect(w.findAll('img')).toHaveLength(1)
    expect(visible(w)).toBe('legacy.webp')
  })

  it('stops the timer on unmount', () => {
    const w = mount(Hero)
    w.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
