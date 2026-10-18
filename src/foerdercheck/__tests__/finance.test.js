import { test, expect } from 'vitest'
import { annuity, initialRepaymentRate } from '../finance.js'

test('annuity matches reference values', () => {
  expect(annuity(180000, 1.0, 35)).toBeCloseTo(508.11, 1)
  expect(annuity(180000, 4.45, 35)).toBeCloseTo(846.3, 1)
  expect(annuity(100000, 2.56, 25)).toBeCloseTo(451.64, 1)
})

test('annuity edge cases', () => {
  expect(annuity(0, 1, 35)).toBe(0)
  expect(annuity(-5, 1, 35)).toBe(0)
  expect(annuity(42000, 0, 35)).toBeCloseTo(100, 6)
})

test('initial repayment rate', () => {
  expect(initialRepaymentRate(100000, 4.45, 2)).toBeCloseTo(537.5, 6)
  expect(initialRepaymentRate(0, 4.45, 2)).toBe(0)
})
