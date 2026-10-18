// Payment maths for the Fördercheck. Monthly amounts, unrounded.

// Monthly annuity that repays `principal` in `years`. `ratePct` is used as a
// nominal annual rate (rate / 12 per month). Fed with an effective rate this
// overstates the payment slightly — at most about 2 € a month — which is on the safe side.
export function annuity(principal, ratePct, years) {
  if (!(principal > 0)) return 0
  const n = years * 12
  const r = ratePct / 100 / 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - (1 + r) ** -n)
}

// German bank-loan convention: rate + initial repayment, both p.a.
export function initialRepaymentRate(principal, ratePct, tilgungPct) {
  if (!(principal > 0)) return 0
  return (principal * (ratePct + tilgungPct)) / 100 / 12
}
