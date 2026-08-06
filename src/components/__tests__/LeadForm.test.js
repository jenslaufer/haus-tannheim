// Why this file exists (2026-08-02):
//
// The form is the end of the funnel — a visitor has just handed over their
// e-mail address, which is the moment of highest intent. Until now the only
// next step offered there was the Cal.com booking link. That link is a dead
// end whenever no viewing day is set: on 2026-07-20 nine of eleven interested
// buyers received the documents mail, found a booking page with (almost) no
// clickable day, and were never heard from again. On 2026-08-02 the calendar
// was empty again — 0 bookable days in the next 45.
//
// Reading the calendar from the browser is not an option: cal.solytics.de
// answers the getSchedule endpoint without any Access-Control-Allow-Origin
// header (checked 2026-08-02), so a fetch from haus-tannheim.de is blocked.
// The robust fix is therefore not conditional rendering but a second path that
// never depends on calendar state: a direct way to reach us.
//
// These tests pin exactly that: the success card must always offer a way
// forward that does not run through the calendar.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LeadForm from '../LeadForm.vue'
import { BOOKING_URL } from '../../leads.js'

const CONTACT_EMAIL = 'jens@haus-tannheim.de'

// The reveal directive is registered globally in main.js; stub it here.
const global = { directives: { reveal: {} } }

async function submitForm(wrapper) {
  await wrapper.find('input[type="email"]').setValue('interessent@example.com')
  await wrapper.find('form').trigger('submit')
  await vi.waitFor(() => {
    if (!wrapper.text().includes('Vielen Dank')) throw new Error('not done yet')
  })
}

describe('LeadForm success card', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  it('offers the booking calendar', async () => {
    const wrapper = mount(LeadForm, { global })
    await submitForm(wrapper)

    const links = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(links).toContain(BOOKING_URL)
  })

  it('also offers a path that does not depend on the calendar', async () => {
    const wrapper = mount(LeadForm, { global })
    await submitForm(wrapper)

    // The regression this guards: the calendar link as the ONLY next step.
    // When no viewing day is set, that leaves the visitor with nothing.
    const mailto = wrapper
      .findAll('a')
      .map((a) => a.attributes('href'))
      .filter((href) => href && href.startsWith('mailto:'))

    expect(mailto).toContain(`mailto:${CONTACT_EMAIL}`)
  })

  it('does not promise that a date can be picked right away', async () => {
    // "Pick a date afterwards" is a promise the page cannot keep on its own —
    // availability is hand-curated and runs dry silently. This holds for the
    // benefit list (read before the form) and for the success card (read
    // after), so check both states.
    const wrapper = mount(LeadForm, { global })
    expect(wrapper.text()).not.toMatch(/direkt einen Besichtigungstermin/)

    await submitForm(wrapper)
    expect(wrapper.text()).not.toMatch(/direkt einen Besichtigungstermin/)
  })
})

// Why this block exists (2026-08-06):
//
// Measured on the live page this morning with a mobile client: the rendered
// page carries no link to the calendar at all — the only hrefs are the page's
// own anchors and one mailto. The booking link exists, but it lives in the
// success card, i.e. behind the form. So the calendar is reachable only after
// a visitor has handed over an e-mail address.
//
// That gate is right for someone who wants to READ (the expose is the thing
// being traded for the address). It is a detour for someone who wants to
// VIEW: they must submit a form to find out whether a viewing day exists.
// Two days before the last viewing day before a four-week gap, that detour is
// the expensive one, and the gate costs nothing to keep open in parallel —
// Cal.com asks for name and e-mail before it confirms a slot, so a booked
// viewer hands over the same contact and is worth more than an address.
//
// These tests pin the second entrance, not a replacement: the form stays the
// primary call to action in the idle state.
describe('LeadForm idle state', () => {
  it('reaches the calendar without submitting the form first', () => {
    const wrapper = mount(LeadForm, { global })

    expect(wrapper.text()).not.toContain('Vielen Dank') // still the idle card
    const links = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(links).toContain(BOOKING_URL)
  })

  it('keeps the expose form as the primary call to action', () => {
    const wrapper = mount(LeadForm, { global })

    // The gate is not replaced by the shortcut: both entrances stay open.
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('opens the calendar in a new tab so the form is not lost', () => {
    const wrapper = mount(LeadForm, { global })

    const booking = wrapper
      .findAll('a')
      .find((a) => a.attributes('href') === BOOKING_URL)
    expect(booking.attributes('target')).toBe('_blank')
    expect(booking.attributes('rel')).toContain('noopener')
  })

  it('names no date, because the page cannot know one', () => {
    // The calendar cannot be read from the browser: cal.solytics.de answers
    // getSchedule with no Access-Control-Allow-Origin header (re-measured
    // 2026-08-06, still true). A date baked in at build time would be a lie
    // the morning after the viewing day, so the link promises a list, not a
    // slot — the booking page itself states what is actually free.
    const wrapper = mount(LeadForm, { global })

    expect(wrapper.text()).not.toMatch(/\d{1,2}\.\s*(August|September|\d{1,2}\.)/)
    expect(wrapper.text()).not.toMatch(/Samstag|Sonntag|Montag/)
  })
})
