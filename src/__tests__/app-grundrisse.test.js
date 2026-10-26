// Pins where the floor plans sit on the page: right after the description
// (which names the rooms per floor), before the gallery, and reachable from
// the sticky nav right after "Beschreibung".
import { it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

const stub = (name) => ({ name, template: `<div data-stub="${name}"></div>` })

it('places the Grundrisse between description and gallery, with a nav entry', () => {
  const w = mount(App, {
    global: {
      directives: { reveal: {} },
      stubs: {
        Hero: stub('Hero'),
        Facts: stub('Facts'),
        Description: stub('Description'),
        Grundrisse: { template: '<section id="grundrisse"></section>' },
        Gallery: stub('Gallery'),
        FoerderCheck: stub('FoerderCheck'),
        LeadForm: stub('LeadForm'),
        Footer: stub('Footer'),
      },
    },
  })
  const html = w.html()
  const description = html.indexOf('data-stub="Description"')
  const plans = html.indexOf('id="grundrisse"')
  const gallery = html.indexOf('data-stub="Gallery"')
  expect(plans).toBeGreaterThan(description)
  expect(gallery).toBeGreaterThan(plans)

  const labels = w.findAll('nav a').map((a) => a.text())
  const hrefs = w.findAll('nav a').map((a) => a.attributes('href'))
  expect(hrefs[labels.indexOf('Grundrisse')]).toBe('#grundrisse')
  expect(labels.indexOf('Grundrisse')).toBe(labels.indexOf('Beschreibung') + 1)
})
