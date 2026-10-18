// Reads a euro amount the way people type it. Cents are dropped.
// Returns a number, null for empty input, or NaN when the input is
// ambiguous ("280k", "40-60.000") — the caller asks again instead of guessing.
const FORMS = [
  [/^\d+$/, (s) => s], // 280000
  [/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/, (s) => s.split(',')[0].replaceAll('.', '')], // 280.000,00
  // Plain decimals only from 1.000 € up: "120,5" is more likely a typo for
  // 120.500 than 120 € and 50 cents.
  [/^\d{4,},\d{1,2}$/, (s) => s.split(',')[0]], // 2500,50
  [/^\d{1,3}(,\d{3})+$/, (s) => s.replaceAll(',', '')], // 80,000
  [/^\d{4,}\.\d{1,2}$/, (s) => s.split('.')[0]], // 250000.50
]

export function parseEuro(v) {
  const s = String(v ?? '')
    .replace(/[\s€]/g, '')
    .replace(/,-+$/, '') // 280.000,-
  if (s === '') return null
  const form = FORMS.find(([re]) => re.test(s))
  return form ? Number(form[1](s)) : NaN
}
