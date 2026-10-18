// Pins where the Fördercheck sits on the page: after the gallery, right
// before the lead form, and reachable from the sticky nav before "Kontakt".
import { it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

const stub = (name) => ({ name, template: `<div data-stub="${name}"></div>` })

it('places the Fördercheck between gallery and lead form, with a nav entry', () => {
  const w = mount(App, {
    global: {
      directives: { reveal: {} },
      stubs: {
        Hero: stub('Hero'),
        Facts: stub('Facts'),
        Description: stub('Description'),
        Gallery: stub('Gallery'),
        LeadForm: stub('LeadForm'),
        Footer: stub('Footer'),
      },
    },
  })
  const html = w.html()
  const gallery = html.indexOf('data-stub="Gallery"')
  const check = html.indexOf('id="foerdercheck"')
  const lead = html.indexOf('data-stub="LeadForm"')
  expect(check).toBeGreaterThan(gallery)
  expect(lead).toBeGreaterThan(check)

  const navLinks = w.findAll('nav a').map((a) => [a.attributes('href'), a.text()])
  const i = navLinks.findIndex(([href]) => href === '#foerdercheck')
  expect(i).toBeGreaterThan(-1)
  expect(navLinks[i][1]).toBe('Fördercheck')
  expect(navLinks.findIndex(([, t]) => t === 'Kontakt')).toBeGreaterThan(i)
})
