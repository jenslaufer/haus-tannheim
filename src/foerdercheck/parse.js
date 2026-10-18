// Reads a euro amount as Germans type it: "280.000", "50 000", "250.000,00".
// Cents are dropped; everything after the decimal comma is ignored.
export function parseEuro(v) {
  const digits = String(v ?? '').split(',')[0].replace(/\D/g, '')
  return digits === '' ? null : Number(digits)
}
