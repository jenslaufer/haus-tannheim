// The "Unterlagen anfordern" buttons wrapped to two lines on a 360 px phone
// (2026-10-27): a two-line pill in the sticky header and in the form. jsdom
// cannot measure, so these pin the classes that keep them on one line.
import { it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import LeadForm from '../components/LeadForm.vue'

const global = { directives: { reveal: {} } }
const stub = { template: '<div></div>' }
const mountApp = () =>
  mount(App, { global: { ...global, stubs: { Hero: stub, Facts: stub, Description: stub, Grundrisse: stub, Gallery: stub, FoerderCheck: stub, LeadForm: stub, Footer: stub } } })

it('header CTA stays one line: short label below sm, never wraps', () => {
  const cta = mountApp().find('header > div > a[href="#unterlagen"]') // not the nav entry
  expect(cta.classes()).toContain('whitespace-nowrap')
  expect(cta.text()).toBe('Unterlagen anfordern')
  expect(cta.find('span.hidden.sm\\:inline').text()).toBe('anfordern')
})

it('form submit stays one line', () => {
  const button = mount(LeadForm, { global }).find('button[type="submit"]')
  expect(button.classes()).toContain('whitespace-nowrap')
})

it('every responsive grid lets its column shrink below its longest word', () => {
  // A grid with only `lg:grid-cols-*` sizes its implicit column to min-content:
  // "Villingen-Schwenningen" made the page 351 px wide on a 320 px phone.
  // grid-cols-1 is minmax(0, 1fr).
  const bare = Object.entries(import.meta.glob('../**/*.vue', { query: '?raw', import: 'default', eager: true }))
    .flatMap(([file, src]) => [...src.matchAll(/class="([^"]*)"/g)]
      .map((m) => m[1].split(/\s+/))
      .filter((c) => c.includes('grid') && c.some((x) => /^\w+:grid-cols-/.test(x)) && !c.some((x) => x.startsWith('grid-cols-')))
      .map((c) => `${file}: ${c.join(' ')}`))
  expect(bare).toEqual([])
})

it('header nav appears only where it fits next to the CTA', () => {
  // Six entries take ~730 px; shown from md (768 px) they pushed the CTA off
  // screen on tablets and small laptops (measured 2026-10-27, fits from ~1110 px).
  const nav = mountApp().find('header nav').classes()
  expect(nav).toContain('xl:flex')
  expect(nav).not.toContain('md:flex')
})
