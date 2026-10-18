// Payment maths for the Fördercheck. Monthly amounts, unrounded.

// Monthly annuity that repays `principal` in `years` at an effective
// annual rate of `effRatePct` percent.
export function annuity(principal, effRatePct, years) {
  if (!(principal > 0)) return 0
  const n = years * 12
  const r = effRatePct / 100 / 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - (1 + r) ** -n)
}

// German bank-loan convention: rate + initial repayment, both p.a.
export function initialRepaymentRate(principal, ratePct, tilgungPct) {
  if (!(principal > 0)) return 0
  return (principal * (ratePct + tilgungPct)) / 100 / 12
}
