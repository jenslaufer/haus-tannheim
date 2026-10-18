import { test, expect } from 'vitest'
import { evaluate, heizungFoerderfaehig } from '../evaluate.js'
import { annuity } from '../finance.js'

const D = new Date('2026-10-18')
const base = {
  selbstnutzung: true,
  kinder: 2,
  eigentum: false,
  zve: 80000,
  kaufpreis: 280000,
  eigenkapital: 50000,
  kostenHeizung: null,
  kostenHuelle: null,
}
const run = (over = {}, today = D) => evaluate({ ...base, ...over }, today)
const one = (over) => {
  const r = run(over)
  expect(r.scenarios).toHaveLength(1)
  return r.scenarios[0]
}

test('kfw308 eligible for family below limit', () => {
  const s = one()
  expect(s.label).toBeNull()
  expect(s.kfw308.eligible).toBe(true)
  expect(s.kfw308.betrag).toBe(160000)
  expect(s.kfw308.rate).toBeCloseTo(annuity(160000, 1, 35), 6)
})

test('kfw308 income limit per child at the boundary', () => {
  expect(one({ kinder: 1, zve: 90000 }).kfw308.eligible).toBe(true)
  expect(one({ kinder: 1, zve: 90001 }).kfw308.reason).toBe('einkommen')
  expect(one({ kinder: 3, zve: 110000 }).kfw308.eligible).toBe(true)
  expect(one({ kinder: 3, zve: 110001 }).kfw308.eligible).toBe(false)
  expect(one({ kinder: 5, zve: 130000 }).kfw308.eligible).toBe(true)
})

test('kfw308 amount by children', () => {
  expect(one({ kinder: 1 }).kfw308.betrag).toBe(140000)
  expect(one({ kinder: 2 }).kfw308.betrag).toBe(160000)
  expect(one({ kinder: 3 }).kfw308.betrag).toBe(180000)
  expect(one({ kinder: 5, zve: 50000 }).kfw308.betrag).toBe(180000)
})

test('kfw308 exclusions', () => {
  expect(one({ kinder: 0 }).kfw308.reason).toBe('keine-kinder')
  expect(one({ eigentum: true }).kfw308.reason).toBe('eigentum')
  const inv = run({ selbstnutzung: false })
  expect(inv.investor).toBe(true)
  expect(inv.scenarios[0].kfw308.reason).toBe('keine-selbstnutzung')
  expect(inv.scenarios[0].kfw308.betrag).toBe(0)
})

test('kfw308 capped at kaufpreis', () => {
  expect(one({ kinder: 3, kaufpreis: 120000, eigenkapital: 0 }).kfw308.betrag).toBe(120000)
})

test('nebenkosten 7 percent', () => {
  expect(one().nebenkosten).toBeCloseTo(19600, 6)
  expect(one().eigenkapitalUnterNebenkosten).toBe(false)
  expect(one({ eigenkapital: 10000 }).eigenkapitalUnterNebenkosten).toBe(true)
})

test('heizungFoerderfaehig degression', () => {
  expect(heizungFoerderfaehig(new Date('2026-10-18'))).toBe(28000)
  expect(heizungFoerderfaehig(new Date('2027-02-01'))).toBe(27250)
  expect(heizungFoerderfaehig(new Date('2027-08-01'))).toBe(26500)
  expect(heizungFoerderfaehig(new Date('2030-08-01'))).toBe(22000)
  expect(heizungFoerderfaehig(new Date('2035-01-01'))).toBe(22000)
})

test('kfw458 income bonus with child deduction', () => {
  const a = one({ kinder: 1, zve: 45000, kostenHeizung: 30000 })
  expect(a.zuschuesse.heizungSatzPct).toBe(60)
  expect(a.zuschuesse.heizung).toBeCloseTo(16800, 6)
  expect(a.zuschuesse.einkommensbonusEingerechnet).toBe(true)
  const b = one({ kinder: 0, zve: 45000, kostenHeizung: 30000 })
  expect(b.zuschuesse.heizungSatzPct).toBe(40)
  expect(b.zuschuesse.heizung).toBeCloseTo(11200, 6)
  const c = one({ zve: 20000, kostenHeizung: 30000 })
  expect(c.zuschuesse.heizungSatzPct).toBe(70)
  expect(c.zuschuesse.heizung).toBeCloseTo(19600, 6)
})

test('kfw458 not for investors and zero without heating cost', () => {
  expect(run({ selbstnutzung: false, kostenHeizung: 30000 }).scenarios[0].zuschuesse.heizung).toBe(0)
  expect(one({ kostenHeizung: null }).zuschuesse.heizung).toBe(0)
})

test('bafa huelle capped', () => {
  expect(one({ kostenHuelle: 50000 }).zuschuesse.huelle).toBeCloseTo(4500, 6)
})

test('unknown income yields two scenarios without income bonus', () => {
  const r = run({ zve: null, kinder: 2, kostenHeizung: 30000 })
  expect(r.scenarios).toHaveLength(2)
  const [a, b] = r.scenarios
  expect(a.kfw308.eligible).toBe(true)
  expect(a.label).toContain('100.000')
  expect(b.kfw308.reason).toBe('einkommen')
  for (const s of r.scenarios) {
    expect(s.zuschuesse.einkommensbonusEingerechnet).toBe(false)
    expect(s.zuschuesse.heizungSatzPct).toBe(30)
  }
})

test('unknown income without 308 path yields one scenario via bank', () => {
  const s = one({ zve: null, kinder: 0, kostenHuelle: 20000 })
  expect(s.sanierungskredit.programm).toBe('bank')
})

test('kfw358 used up to 90000 income', () => {
  const s = one({ zve: 90000, kinder: 0, kostenHuelle: 40000 })
  expect(s.sanierungskredit.programm).toBe('358')
  expect(s.sanierungskredit.betrag).toBeCloseTo(35500, 6)
  expect(one({ zve: 90001, kinder: 0, kostenHuelle: 40000 }).sanierungskredit.programm).toBe('bank')
})

test('kfw358 capped at 120000, rest to bank', () => {
  const s = one({ zve: 50000, kinder: 0, kostenHuelle: 200000 })
  expect(s.sanierungskredit.betrag).toBe(120000)
  // bank = kaufpreis + nebenkosten + rest - eigenkapital
  expect(s.bank.betrag).toBeCloseTo(280000 + 19600 + 75500 - 50000, 6)
})

test('vorteil uses same term', () => {
  const s = one()
  expect(s.kfw308.vorteil).toBeCloseTo(annuity(160000, 4.45, 35) - annuity(160000, 1, 35), 6)
})

test('bank loan never negative', () => {
  const s = one({ eigenkapital: 1e7 })
  expect(s.bank.betrag).toBe(0)
  expect(s.bank.rate).toBe(0)
})

test('sanierungOffen when no renovation costs', () => {
  expect(one().sanierungOffen).toBe(true)
  expect(one({ kostenHuelle: 1 }).sanierungOffen).toBe(false)
})

test('evaluate handles empty and zero inputs without NaN', () => {
  const r = run({ kaufpreis: 0, eigenkapital: NaN, kostenHeizung: undefined, kostenHuelle: undefined })
  const json = JSON.stringify(r)
  expect(json).not.toContain('NaN')
  const walk = (v) => {
    if (typeof v === 'number') expect(Number.isFinite(v)).toBe(true)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(r)
})

test('auchPruefen lists', () => {
  const r = run()
  expect(r.auchPruefen[0]).toBe('z15')
  expect(r.auchPruefen).toContain('elr')
  expect(r.auchPruefen).toContain('kombi')
  expect(run({ kinder: 0 }).auchPruefen).not.toContain('z15')
  expect(run({ selbstnutzung: false }).auchPruefen).toEqual([])
})

test('stand is passed through', () => {
  expect(run().stand).toBe('2026-10-18')
})

test('subsidised loans capped at remaining need', () => {
  // Equity covers price + fees: nothing left to finance.
  const s = one({ eigenkapital: 400000 })
  expect(s.kfw308.betrag).toBe(0)
  expect(s.bank.betrag).toBe(0)
  expect(s.rateGesamt).toBe(0)
  // Need after equity: 280000 + 19600 + 130000 - 4500 - 380000 = 45100.
  const t = one({ kinder: 1, zve: 50000, eigenkapital: 380000, kostenHuelle: 130000 })
  expect(t.kfw308.betrag + t.sanierungskredit.betrag + t.bank.betrag).toBeCloseTo(45100, 6)
})

test('partial renovation costs flag the missing part', () => {
  const s = one({ kostenHeizung: 20000, kostenHuelle: null })
  expect(s.sanierungOffen).toBe(false)
  expect(s.sanierungTeilweiseOffen).toEqual(['huelle'])
  expect(one({ kostenHeizung: null, kostenHuelle: 5000 }).sanierungTeilweiseOffen).toEqual(['heizung'])
  expect(one({ kostenHeizung: 1, kostenHuelle: 1 }).sanierungTeilweiseOffen).toEqual([])
  expect(one().sanierungTeilweiseOffen).toEqual([])
})
