import { test, expect } from 'vitest'
import { parseEuro } from '../parse.js'

test('parseEuro reads German amounts', () => {
  expect(parseEuro('280.000')).toBe(280000)
  expect(parseEuro('50 000')).toBe(50000)
  expect(parseEuro('250.000,00')).toBe(250000)
  expect(parseEuro('45.000,50')).toBe(45000)
  expect(parseEuro('1,5')).toBe(1)
  expect(parseEuro('80000 €')).toBe(80000)
  expect(parseEuro('280000')).toBe(280000)
})

test('parseEuro reads English-style thousands and decimals', () => {
  expect(parseEuro('80,000')).toBe(80000)
  expect(parseEuro('1,250,000')).toBe(1250000)
  expect(parseEuro('250000.50')).toBe(250000)
})

test('parseEuro returns null for empty input', () => {
  expect(parseEuro('')).toBeNull()
  expect(parseEuro('  ')).toBeNull()
  expect(parseEuro(undefined)).toBeNull()
})

test('parseEuro rejects ambiguous input as NaN instead of guessing', () => {
  for (const v of ['280k', '40-60.000', '-5000', '1,5 Mio', 'ca. 50.000', ',50', 'abc', '28.00.0']) {
    expect(parseEuro(v), v).toBeNaN()
  }
})
