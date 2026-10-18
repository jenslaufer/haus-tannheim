import { test, expect } from 'vitest'
import { parseEuro } from '../parse.js'

test('parseEuro reads German amounts', () => {
  expect(parseEuro('280.000')).toBe(280000)
  expect(parseEuro('50 000')).toBe(50000)
  expect(parseEuro('250.000,00')).toBe(250000)
  expect(parseEuro('45.000,50')).toBe(45000)
  expect(parseEuro('1,5')).toBe(1)
  expect(parseEuro('80000 €')).toBe(80000)
})

test('parseEuro returns null for empty input', () => {
  expect(parseEuro('')).toBeNull()
  expect(parseEuro('  ')).toBeNull()
  expect(parseEuro(undefined)).toBeNull()
  expect(parseEuro(',50')).toBeNull()
})
