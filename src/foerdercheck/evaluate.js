// Turns the visitor's answers into the Fördercheck result. Pure: no I/O,
// every figure comes from data.js. Rules: docs/superpowers/specs/
// 2026-10-18-foerdercheck-design.md §5.3–5.4.
import {
  STAND,
  GRUNDERWERBSTEUER_PCT,
  NOTAR_GRUNDBUCH_PCT,
  KFW308,
  KFW358,
  KFW458,
  BAFA_HUELLE,
  BANK,
} from './data.js'
import { annuity, initialRepaymentRate } from './finance.js'

const num = (v) => (Number.isFinite(v) && v > 0 ? v : 0)
const fmt = (n) => new Intl.NumberFormat('de-DE').format(n)

// Eligible heating costs fall by KFW458.degressionSchritt every half year
// (1 Feb / 1 Aug) from KFW458.degressionAb down to KFW458.foerderfaehigMin.
export function heizungFoerderfaehig(today) {
  const iso = today.toISOString().slice(0, 10)
  let wert = KFW458.foerderfaehigStart
  let [y, m] = KFW458.degressionAb.split('-').map(Number)
  while (wert > KFW458.foerderfaehigMin) {
    const stichtag = `${y}-${String(m).padStart(2, '0')}-01`
    if (stichtag > iso) break
    wert -= KFW458.degressionSchritt
    if (m === 2) m = 8
    else (m = 2), y++
  }
  return Math.max(wert, KFW458.foerderfaehigMin)
}

function einkommensgrenze308(kinder) {
  return kinder >= 1 ? KFW308.einkommenBasis + KFW308.einkommenJeWeiteresKind * (kinder - 1) : 0
}

// zve: number, or null when unknown (then no income bonus).
function heizungsZuschuss(input, zve, today) {
  const kosten = num(input.kostenHeizung)
  if (!input.selbstnutzung || kosten === 0) {
    return { betrag: 0, satz: 0, bonusEingerechnet: false }
  }
  let bonus = 0
  if (zve !== null) {
    const zveEff = zve - (input.kinder >= 1 ? KFW458.kindAbzug : 0)
    bonus = KFW458.einkommensbonus.find((b) => zveEff <= b.bis)?.pct ?? 0
  }
  const satz = Math.min(KFW458.grundPct + bonus, KFW458.maxPct)
  const betrag = (satz / 100) * Math.min(kosten, heizungFoerderfaehig(today))
  return { betrag, satz, bonusEingerechnet: zve !== null }
}

// One financing scenario. `zve` is known income or null; `kfw308Reason`
// (null = eligible) and `use358` fix what the scenario assumes.
function scenario(input, { label, zve, kfw308Reason, use358, hinweis358 = false }, today) {
  const kaufpreis = num(input.kaufpreis)
  const eigenkapital = num(input.eigenkapital)
  const nebenkosten = (kaufpreis * (GRUNDERWERBSTEUER_PCT + NOTAR_GRUNDBUCH_PCT)) / 100

  const eligible = kfw308Reason === null
  const heizung = heizungsZuschuss(input, zve, today)
  const huelleKosten = num(input.kostenHuelle)
  const huelle = input.selbstnutzung
    ? (BAFA_HUELLE.pct / 100) * Math.min(huelleKosten, BAFA_HUELLE.maxFoerderfaehig)
    : 0
  const zuschuesse = {
    heizung: heizung.betrag,
    heizungSatzPct: heizung.satz,
    einkommensbonusEingerechnet: heizung.bonusEingerechnet,
    huelle,
    summe: heizung.betrag + huelle,
  }

  const netto = num(input.kostenHeizung) + huelleKosten - zuschuesse.summe
  // Subsidised loans never exceed what is left to finance after equity.
  const bedarf = Math.max(0, kaufpreis + nebenkosten + Math.max(netto, 0) - eigenkapital)
  const betrag308 = eligible
    ? Math.min(KFW308.betragNachKindern[Math.min(input.kinder, 3)], kaufpreis, bedarf)
    : 0
  const rate308 = annuity(betrag308, KFW308.effZinsPct, KFW308.laufzeitJahre)
  const kfw308 = {
    eligible,
    reason: kfw308Reason,
    betrag: betrag308,
    zinsPct: KFW308.effZinsPct,
    rate: rate308,
    vorteil: annuity(betrag308, BANK.zinsPct, KFW308.laufzeitJahre) - rate308,
    einkommensgrenze: einkommensgrenze308(input.kinder),
  }

  let sanierungskredit = { programm: null, betrag: 0, zinsPct: 0, rate: 0, vorteil: 0 }
  if (netto > 0 && use358 && bedarf - betrag308 > 0) {
    const betrag = Math.min(netto, KFW358.maxBetrag, bedarf - betrag308)
    const rate = annuity(betrag, KFW358.effZinsPct, KFW358.laufzeitJahre)
    sanierungskredit = {
      programm: '358',
      betrag,
      zinsPct: KFW358.effZinsPct,
      rate,
      vorteil: annuity(betrag, BANK.zinsPct, KFW358.laufzeitJahre) - rate,
    }
  } else if (netto > 0) {
    sanierungskredit = { programm: 'bank', betrag: 0, zinsPct: 0, rate: 0, vorteil: 0 }
  }

  const bankBetrag = Math.max(0, bedarf - betrag308 - sanierungskredit.betrag)
  const bank = {
    betrag: bankBetrag,
    zinsPct: BANK.zinsPct,
    rate: initialRepaymentRate(bankBetrag, BANK.zinsPct, BANK.tilgungPct),
  }

  return {
    label,
    nebenkosten,
    eigenkapitalUnterNebenkosten: eigenkapital < nebenkosten,
    kfw308,
    zuschuesse,
    sanierungskredit,
    bank,
    rateGesamt: kfw308.rate + sanierungskredit.rate + bank.rate,
    // Income unknown, renovation on the bank loan: 358 may still apply.
    hinweis358: hinweis358 && netto > 0,
    sanierungOffen: !(num(input.kostenHeizung) > 0) && !(huelleKosten > 0),
    // One field filled, the other empty: the empty part is still needed.
    sanierungTeilweiseOffen:
      num(input.kostenHeizung) > 0 || huelleKosten > 0
        ? [
            ...(num(input.kostenHeizung) > 0 ? [] : ['heizung']),
            ...(huelleKosten > 0 ? [] : ['huelle']),
          ]
        : [],
  }
}

export function evaluate(raw, today) {
  const input = {
    ...raw,
    kinder: Math.min(Math.max(Math.floor(num(raw.kinder)), 0), 5),
    // Anything but a non-negative number means "unknown" — never zero income.
    zve: Number.isFinite(raw.zve) && raw.zve >= 0 ? raw.zve : null,
  }
  const { selbstnutzung, kinder, eigentum, zve } = input
  const grenze = einkommensgrenze308(kinder)

  if (!selbstnutzung) {
    return {
      investor: true,
      stand: STAND,
      scenarios: [scenario(input, { label: null, zve, kfw308Reason: 'keine-selbstnutzung', use358: false }, today)],
      auchPruefen: [],
    }
  }

  // First failing condition wins; income last.
  const reasonOhneEinkommen = kinder < 1 ? 'keine-kinder' : eigentum ? 'eigentum' : null

  let scenarios
  if (zve === null && reasonOhneEinkommen === null) {
    scenarios = [
      scenario(
        input,
        {
          label: `Falls Ihr zu versteuerndes Einkommen ≤ ${fmt(grenze)} €`,
          zve: null,
          kfw308Reason: null,
          use358: grenze <= KFW358.einkommenGrenze,
        },
        today,
      ),
      scenario(input, { label: 'Falls darüber', zve: null, kfw308Reason: 'einkommen', use358: false }, today),
    ]
  } else {
    const reason = reasonOhneEinkommen ?? (zve !== null && zve > grenze ? 'einkommen' : null)
    const use358 = zve !== null && zve <= KFW358.einkommenGrenze
    scenarios = [
      scenario(input, { label: null, zve, kfw308Reason: reason, use358, hinweis358: zve === null }, today),
    ]
  }

  const auchPruefen = [
    ...(kinder >= 1 ? ['z15', 'wohnenMitKind'] : []),
    'kfw261',
    'paragraph35c',
    'energieberatung',
    'elr',
    'kombi',
  ]
  return { investor: false, stand: STAND, scenarios, auchPruefen }
}
