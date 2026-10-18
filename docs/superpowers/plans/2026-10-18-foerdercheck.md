# Fördercheck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a quiz section `#foerdercheck` to haus-tannheim.de. Visitors answer up to 7 questions. They then see which subsidy programmes fit this specific house, with amounts, interest rates and a monthly payment. Everything runs in the browser.

**Architecture:**
- **Data and logic:** All programme figures live in one data file. A pure function `evaluate(input, today)` turns the answers into a result object. Small finance helpers compute the payments. Unit tests pin all of this.
- **UI:** One Vue component runs the quiz steps. A second component renders the result.
- **Wiring:** The section sits in `App.vue` between `<Gallery>` and `<LeadForm>`, with a nav entry.

**Tech Stack:** Vue 3.5 `<script setup>`, Tailwind v4 (tokens in `src/style.css`), Vitest 4 + jsdom + @vue/test-utils. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-18-foerdercheck-design.md`

## Global Constraints

- **Runtime:** no backend, no `fetch`, no `localStorage`/`sessionStorage`. Inputs never leave the browser.
- **Dependencies:** none new (`package.json` dependencies unchanged).
- **Copy:** German, formal „Sie“. Amounts formatted `de-DE` (e.g. `180.000 €`, `1,00 %`).
- **Private data:** never show street, house number, phone number, interested parties' names or price negotiation details.
- **Do not touch** the shape of the arrays in `src/components/Facts.vue` and `src/components/Description.vue`. `expose-pdf.py` in the private repo parses them.
- **Human fallback:** every result offers `CONTACT_EMAIL` next to the booking link (existing rule from `LeadForm.test.js`).
- **Visible on every result:** the data date `stand` and the disclaimer „Orientierung, keine Förder-, Finanz- oder Steuerberatung. Konditionen gelten am Tag der Zusage.“
- **Grants are not loans.** Grants (Zuschüsse) are always listed separately from loans and never counted as savings („Ersparnis“).
- **Rate shown without renovation:** whenever the rate excludes renovation costs, label it „Rate ohne Sanierung“ and show the line „Sanierung: umfassend nötig, Kosten offen“.
- **Tests:** run with `npm test`. Write tests first.

## Review Focus

1. **Empty or zero inputs.** Kaufpreis 0 or empty, Eigenkapital empty, renovation fields empty or 0. Expected: no `NaN`/`Infinity` anywhere, and amounts never negative. Test in Task 2: `evaluate handles empty and zero inputs without NaN`.
2. **Eigenkapital larger than the total need.** Expected: bank loan 0 and rate 0, not negative. Test in Task 2: `bank loan never negative`.
3. **Kaufpreis below the KfW 308 amount** (visitor enters, say, 120.000 €). Expected: the 308 loan is capped at the Kaufpreis. Test in Task 2: `kfw308 capped at kaufpreis`.
4. **Renovation net cost above 120.000 €.** Expected: 358 is capped at 120.000 € and the rest goes to the bank loan. Test in Task 2: `kfw358 capped at 120000, rest to bank`.
5. **Going back in the quiz and changing an answer.** Expected: the result reflects the new answer, e.g. switching to „nicht selbst nutzen“ yields the investor result. Test in Task 3: `changing an answer after going back updates the result`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/foerdercheck/data.js` (create) | Every figure with `STAND`, sources and the house's fixed data. Nothing else. |
| `src/foerdercheck/finance.js` (create) | `annuity`, `initialRepaymentRate`. Pure maths. |
| `src/foerdercheck/evaluate.js` (create) | `evaluate(input, today)`: eligibility, amounts, scenarios. |
| `src/foerdercheck/__tests__/finance.test.js` (create) | Finance helper tests. |
| `src/foerdercheck/__tests__/evaluate.test.js` (create) | Rule tests. |
| `src/components/FoerderCheck.vue` (create) | Section shell, quiz steps, back/next, progress, restart. |
| `src/components/FoerderResult.vue` (create) | Renders one result object: scenarios, grants, obligations, „Auch prüfen“, footer CTAs. |
| `src/components/__tests__/FoerderCheck.test.js` (create) | Flow, CTAs, privacy, no network. |
| `src/App.vue` (modify) | Import, nav entry, place section. |
| `src/style.css` (modify) | `@media print` rules that print only the result. |

---

### Task 1: Data file and finance helpers

**Files:**
- Create: `src/foerdercheck/data.js`, `src/foerdercheck/finance.js`
- Test: `src/foerdercheck/__tests__/finance.test.js`

**Interfaces:**
- **Produces from `finance.js`:**
  - `annuity(principal: number, effRatePct: number, years: number) => number`: monthly annuity, not rounded. Returns `principal / (years*12)` when the rate is 0, and `0` when principal ≤ 0.
  - `initialRepaymentRate(principal: number, ratePct: number, tilgungPct: number) => number`: `principal * (ratePct + tilgungPct) / 100 / 12`. Returns `0` when principal ≤ 0.
- **Produces from `data.js`:** the named exports below, with these exact values.

| Export | Value |
|---|---|
| `STAND` | `'2026-10-18'` |
| `ANGEBOTSPREIS` | `280000` (sync by hand with `Facts.vue`) |
| `GRUNDERWERBSTEUER_PCT` | `5.0` |
| `NOTAR_GRUNDBUCH_PCT` | `2.0` |
| `KFW308` | `{ betragNachKindern: { 1: 140000, 2: 160000, 3: 180000 }, einkommenBasis: 90000, einkommenJeWeiteresKind: 10000, effZinsPct: 1.00, laufzeitJahre: 35, zinsbindungJahre: 10, sanierungsfristMonate: 54, url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Wohneigentum-f%C3%BCr-Familien-Bestandserwerb-(308)/' }`. For 3+ children use 180000. |
| `KFW358` | `{ einkommenGrenze: 90000, maxBetrag: 120000, effZinsPct: 2.56, laufzeitJahre: 25, zinsbindungJahre: 10, url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Einzelma%C3%9Fnahmen-Erg%C3%A4nzungskredit-Wohngeb%C3%A4ude-(358-359)/' }` |
| `KFW458` | `{ grundPct: 30, maxPct: 70, einkommensbonus: [{ bis: 30000, pct: 40 }, { bis: 40000, pct: 30 }, { bis: 50000, pct: 10 }], kindAbzug: 10000, foerderfaehigStart: 28000, foerderfaehigMin: 22000, degressionSchritt: 750, degressionAb: '2027-02-01', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Heizungsf%C3%B6rderung-f%C3%BCr-Privatpersonen-Wohngeb%C3%A4ude-(458)/' }` |
| `BAFA_HUELLE` | `{ pct: 15, maxFoerderfaehig: 30000, url: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Foerderprogramm_im_Ueberblick/foerderprogramm_im_ueberblick_node.html' }` |
| `BANK` | `{ zinsPct: 4.45, tilgungPct: 2, quelle: 'Ø 10 Jahre Zinsbindung, Oktober 2026 (Sparkasse, Statista, Interhyp)' }` |
| `AUCH_PRUEFEN` | Array of `{ key, titel, text }` for `z15`, `wohnenMitKind`, `kombi`, `elr`, `kfw261`, `paragraph35c`, `energieberatung`, using the facts in spec §5.5 and §5.3.4. The ELR text must say „frühestens 2028, unsicher“. |

- [ ] **Step 1: Write the failing tests** `finance.test.js`

```js
import { annuity, initialRepaymentRate } from '../finance.js'
test('annuity matches reference values', () => {
  expect(annuity(180000, 1.0, 35)).toBeCloseTo(508.11, 1)
  expect(annuity(180000, 4.45, 35)).toBeCloseTo(846.30, 1)
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
```

- [ ] **Step 2: Run** `npx vitest run src/foerdercheck/__tests__/finance.test.js`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `finance.js` (standard annuity formula) and `data.js` with the table values above.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/foerdercheck && git commit -m "Add Fördercheck data and finance helpers"`

---

### Task 2: `evaluate()` rules

**Files:**
- Create: `src/foerdercheck/evaluate.js`
- Test: `src/foerdercheck/__tests__/evaluate.test.js`

**Interfaces:**
- **Consumes:** Task 1 exports.
- **Produces:**
  - `heizungFoerderfaehig(today: Date) => number`
  - `evaluate(input: Input, today: Date) => Result`

**`Input`:**
```
{ selbstnutzung: boolean, kinder: number /*0–5, 5 = 5+*/, eigentum: boolean,
  zve: number | null /*null = „weiß ich nicht“*/, kaufpreis: number, eigenkapital: number,
  kostenHeizung: number | null, kostenHuelle: number | null }
```

**`Result`:**
```
{ investor: boolean, stand: string, scenarios: Scenario[], auchPruefen: string[] /*keys of AUCH_PRUEFEN*/ }
Scenario = {
  label: string | null,                 // null when only one scenario
  nebenkosten: number,
  eigenkapitalUnterNebenkosten: boolean,
  kfw308: { eligible: boolean, reason: null|'keine-selbstnutzung'|'keine-kinder'|'eigentum'|'einkommen', betrag: number, zinsPct: number, rate: number, vorteil: number, einkommensgrenze: number },
  zuschuesse: { heizung: number, heizungSatzPct: number, einkommensbonusEingerechnet: boolean, huelle: number, summe: number },
  sanierungskredit: { programm: '358'|'bank'|null, betrag: number, zinsPct: number, rate: number, vorteil: number },
  bank: { betrag: number, zinsPct: number, rate: number },
  rateGesamt: number,
  sanierungOffen: boolean              // true when both cost fields are null/0 → UI shows „Rate ohne Sanierung“
}
```

**Rules** (spec §5.3–5.4). Implement exactly these:

1. **Nebenkosten** = `kaufpreis * (5.0 + 2.0) / 100`. `eigenkapitalUnterNebenkosten = eigenkapital < nebenkosten`.
2. **KfW 308 eligibility:**
   - **Conditions:** `selbstnutzung && kinder ≥ 1 && !eigentum && zve ≤ 90000 + 10000*(kinder-1)`.
   - **Reason:** the first failing condition in the order selbstnutzung, kinder, eigentum, einkommen.
   - **Betrag:** `min(betragNachKindern[min(kinder,3)], kaufpreis)`.
   - **Rate:** `annuity(betrag, 1.00, 35)`.
   - **Vorteil:** `annuity(betrag, 4.45, 35) - rate`.
   - **`einkommensgrenze`:** always filled when kinder ≥ 1.
3. **Unknown income** (`zve === null`) where all other 308 conditions hold → two scenarios:
   - **A:** `label: 'Falls Ihr zu versteuerndes Einkommen ≤ {grenze}'`. 308 eligible. Renovation via 358 only if `grenze ≤ 90000`, else bank.
   - **B:** `label: 'Falls darüber'`. 308 not eligible, reason `'einkommen'`. Renovation via bank.
   - **Both:** KfW 458 Einkommensbonus not included (`einkommensbonusEingerechnet: false`).
   - **Otherwise** exactly one scenario, `label: null`. With unknown income, renovation goes via bank and the bonus is not included.
4. **KfW 458** (only if `selbstnutzung` and `kostenHeizung > 0`):
   - Bonus applies only when zve is known: zve minus 10000 if kinder ≥ 1, then the first bracket with `zveEff ≤ bis`.
   - `satz = min(30 + bonus, 70)`.
   - `heizung = satz% * min(kostenHeizung, heizungFoerderfaehig(today))`.
5. **`heizungFoerderfaehig(today)`:**
   - Returns 28000 before 2027-02-01.
   - From then on, subtract 750 for each Feb 1/Aug 1 reached, floor 22000.
   - Reference dates: 2026-10-18 → 28000, 2027-02-01 → 27250, 2027-08-01 → 26500, 2030-08-01 → 22000, 2035-01-01 → 22000.
6. **BAFA Hülle** (only if `selbstnutzung` and `kostenHuelle > 0`): `15% * min(kostenHuelle, 30000)`.
7. **Sanierungskredit:**
   - **`netto`:** `kostenHeizung + kostenHuelle - zuschuesse.summe` (nulls count as 0).
   - **If `netto > 0`:**
     - Use 358 when zve is known and `zve ≤ 90000` (or scenario A with `grenze ≤ 90000`).
     - 358 amount: `min(netto, 120000)`, rate `annuity(betrag, 2.56, 25)`, `vorteil = annuity(betrag, 4.45, 25) - rate`.
     - The rest of `netto` goes to the bank.
     - If 358 does not apply: `programm: 'bank'`, `betrag 0`, and all of `netto` goes to the bank.
   - **If `netto ≤ 0`:** `programm: null`.
8. **Bank:**
   - `betrag = max(0, kaufpreis + nebenkosten + netto - eigenkapital - kfw308.betrag - sanierungskredit.betrag)`.
   - `rate = initialRepaymentRate(betrag, 4.45, 2)`.
9. **Totals:**
   - `rateGesamt = kfw308.rate + sanierungskredit.rate + bank.rate`.
   - `sanierungOffen = !(kostenHeizung > 0) && !(kostenHuelle > 0)`.
10. **Investor** (`!selbstnutzung`):
    - `investor: true`.
    - One scenario with only bank financing: grants 0, 308 reason `'keine-selbstnutzung'`.
    - `auchPruefen: []`.
11. **`auchPruefen` for owner-occupiers:**
    - Always: `['kfw261', 'paragraph35c', 'energieberatung', 'elr']`.
    - Prepend `'z15', 'wohnenMitKind'` when kinder ≥ 1.
    - Append `'kombi'`.
12. **Sanitising inputs:** non-finite or negative numbers become 0. `zve` stays `null` only when explicitly `null`.

- [ ] **Step 1: Write the failing tests** in `evaluate.test.js`. Use `const D = new Date('2026-10-18')` and a `base` input: `{ selbstnutzung: true, kinder: 2, eigentum: false, zve: 80000, kaufpreis: 280000, eigenkapital: 50000, kostenHeizung: null, kostenHuelle: null }`.

| Test | Assertions |
|---|---|
| `kfw308 eligible for family below limit` | 1 scenario; `kfw308.eligible` true; `betrag` 160000; `rate` ≈ `annuity(160000,1,35)`. |
| `kfw308 income limit per child at the boundary` | kinder 1: zve 90000 eligible, 90001 `reason 'einkommen'`. kinder 3: zve 110000 eligible, 110001 not. kinder 5: 130000 eligible. |
| `kfw308 amount by children` | kinder 1/2/3/5 → 140000/160000/180000/180000. |
| `kfw308 exclusions` | kinder 0 → `'keine-kinder'`; eigentum true → `'eigentum'`; selbstnutzung false → `investor` true and `'keine-selbstnutzung'`. |
| `kfw308 capped at kaufpreis` | kaufpreis 120000, kinder 3 → `betrag` 120000. |
| `nebenkosten 7 percent` | `nebenkosten` 19600 for 280000. eigenkapital 10000 → `eigenkapitalUnterNebenkosten` true. |
| `heizungFoerderfaehig degression` | the five reference dates from rule 5. |
| `kfw458 income bonus with child deduction` | kinder 1, zve 45000, kostenHeizung 30000 → zveEff 35000 → 30 % bonus → `heizungSatzPct` 60, `heizung` 16800. kinder 0, zve 45000 → 10 % bonus → 40 %, 11200. zve 20000 → 70 %, 19600. |
| `kfw458 not for investors and zero without heating cost` | `heizung` 0 in both cases. |
| `bafa huelle capped` | kostenHuelle 50000 → `huelle` 4500. |
| `unknown income yields two scenarios without income bonus` | zve null, kinder 2, kostenHeizung 30000 → 2 scenarios. A: 308 eligible, label contains `100.000`. B: reason `'einkommen'`. Both: `einkommensbonusEingerechnet` false, `heizungSatzPct` 30. |
| `unknown income without 308 path yields one scenario via bank` | zve null, kinder 0, kostenHuelle 20000 → 1 scenario; `sanierungskredit.programm` `'bank'`. |
| `kfw358 used up to 90000 income` | zve 90000, kinder 0, kostenHuelle 40000 → `programm` `'358'`, `betrag` 40000 − 4500 = 35500. zve 90001 → `'bank'`. |
| `kfw358 capped at 120000, rest to bank` | zve 50000, kinder 0, kostenHuelle 200000 → 358 `betrag` 120000; bank `betrag` includes the remaining 75500. |
| `vorteil uses same term` | 308 `vorteil` ≈ `annuity(160000,4.45,35) - annuity(160000,1,35)`. |
| `bank loan never negative` | eigenkapital 1e7 → bank `betrag` 0, `rate` 0. |
| `sanierungOffen when no renovation costs` | true with null/null, false with kostenHuelle 1. |
| `evaluate handles empty and zero inputs without NaN` | kaufpreis 0, eigenkapital NaN, costs undefined → every number in `JSON.stringify(result)` is finite; no `NaN` substring. |
| `auchPruefen lists` | kinder 2 → starts with `z15`, includes `elr` and `kombi`; investor → `[]`. |

- [ ] **Step 2: Run** `npx vitest run src/foerdercheck/__tests__/evaluate.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** `evaluate.js` per rules 1–12. Read all figures from `data.js`; no literals in the logic.
- [ ] **Step 4: Run** the same command. Expected: PASS. Then run `npm test`; expected: all suites pass.
- [ ] **Step 5: Commit** `git commit -am "Add Fördercheck evaluation rules"` (add the new files first).

---

### Task 3: Quiz and result components

**Files:**
- Create: `src/components/FoerderCheck.vue`, `src/components/FoerderResult.vue`
- Test: `src/components/__tests__/FoerderCheck.test.js`

**Interfaces:**
- **Consumes:**
  - `evaluate`, `STAND`, `ANGEBOTSPREIS`, `AUCH_PRUEFEN` (Tasks 1–2)
  - `BOOKING_URL`, `CONTACT_EMAIL` from `src/leads.js`
- **Produces:**
  - `<FoerderCheck />` renders `<section id="foerdercheck">`.
  - `<FoerderResult :result="Result" @restart />`.

**Behaviour** (spec §4, §5.1, §5.6):

- **Section shell:**
  - Intro with a kicker „Fördercheck“, a heading and one sentence explaining that class H unlocks KfW 308.
  - Start button: `data-test="start"`.
- **Steps** in spec order. The selbstnutzung step comes first. Answering „Nein“ skips straight to the result, because investors see no further questions.
  - Navigation buttons: `data-test="next"`, `data-test="back"`.
  - Progress: „Frage n von N“.
  - Choice inputs are buttons/radios. Number inputs use `inputmode="numeric"`.
  - Income has a „Weiß ich nicht“ toggle that sets `zve: null`.
  - Kaufpreis is prefilled with `ANGEBOTSPREIS`.
  - Both renovation fields start empty and offer a „Weiß ich noch nicht“ button that leaves them null.
- **Result** (`FoerderResult`), in this order:
  1. **Scenarios side by side** (one column on mobile). Per scenario:
     - label;
     - table of loans (KfW 308 / 358 / Bankdarlehen) with Betrag, Zins, Monatsrate;
     - `rateGesamt`, labelled „Rate ohne Sanierung“ when `sanierungOffen`;
     - Zinsvorteil line „günstiger als ein Bankkredit gleicher Laufzeit: x € / Monat“;
     - grants in a separate box „Zuschüsse (fließen nach der Maßnahme)“.
  2. **Reason text** when 308 is not eligible, mapped from `reason`.
  3. **Obligations** when 308 is eligible:
     - Antrag vor dem Notartermin;
     - Sanierung in 54 Monaten (EH 85 EE or the 4 measures);
     - +1 Prozentpunkt if missed;
     - „tilgungsfreie Anlaufjahre möglich“.
  4. **Renovation notes:**
     - The line „Sanierung: umfassend nötig, Kosten offen“ appears when `sanierungOffen`.
     - The heating note appears whenever heating grant > 0: Auflassungsvormerkung, nach Einzug.
  5. **Investor:** short honest text instead of the tables.
  6. **„Auch prüfen“** list from `auchPruefen` keys.
  7. **Footer:**
     - `Stand {STAND als 18.10.2026}` and the disclaimer (verbatim from Global Constraints);
     - Bank-rate assumption text from `BANK.quelle`;
     - KfW links;
     - buttons „Unterlagen anfordern“ (`href="#unterlagen"`), „Besichtigung buchen“ (`href=BOOKING_URL + '?utm_source=foerdercheck'`), „Ergebnis drucken“ (`window.print()`, `data-test="print"`);
     - `mailto:` link to `CONTACT_EMAIL`;
     - „Neu starten“ (`data-test="restart"`).
- **Print:** the result wrapper carries the class `fc-print`.
- **Registration:** stub the `reveal` directive in tests, as `LeadForm.test.js` does.

Steps:

- [ ] **Step 1: Write the failing tests** `FoerderCheck.test.js`. Mount with `global: { directives: { reveal: {} } }` and spy on `globalThis.fetch` and on `Storage.prototype.setItem`.

| Test | Assertions |
|---|---|
| `walks a family through to the result` | Answer ja / 2 Kinder / nein / 80000 / keep Kaufpreis / 50000 / „weiß ich noch nicht“. Result text contains `160.000 €`, `1,00 %`, `Rate ohne Sanierung`, `Sanierung: umfassend nötig`, `Notartermin`, `54 Monate`. |
| `investor gets the short honest result` | Answer „Nein“ at step 1. Text contains `Selbstnutzung`; no `KfW 308` table. |
| `changing an answer after going back updates the result` | Go back from the result to step 1 and switch to „Nein“. The investor text is shown. |
| `result always offers booking and a human` | Contains `href` = `BOOKING_URL + '?utm_source=foerdercheck'`, `mailto:` + `CONTACT_EMAIL` and `href="#unterlagen"`. |
| `shows stand and disclaimer` | Contains `18.10.2026` and `keine Förder-, Finanz- oder Steuerberatung`. |
| `print button calls window.print` | Spy on `window.print`, click `[data-test=print]`, expect it called. |
| `restart returns to the intro` | After `[data-test=restart]`, `[data-test=start]` exists. |
| `never touches network or storage` | After a full run, `fetch` and `setItem` were not called. |
| `contains no private data` | `html()` matches neither `/\d{3,}\s?\/?\s?\d{4,}/` (phone-like) nor a generic street-address pattern (street suffix followed by a house number). |

- [ ] **Step 2: Run** `npx vitest run src/components/__tests__/FoerderCheck.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** both components in the site's style:
  - Section paddings like `Facts.vue`: `mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28`.
  - Buttons like `LeadForm.vue`.
  - Amounts with `Intl.NumberFormat('de-DE')`; currency with no decimals, rates with 2 decimals.
- [ ] **Step 4: Run** the same command. Expected: PASS. Then run `npm test`; expected: all pass.
- [ ] **Step 5: Commit** `git commit -m "Add Fördercheck quiz and result components"` (add the new files).

---

### Task 4: Wire into the page, print styles, build check

**Files:**
- Modify: `src/App.vue` (imports, `nav` array, `<main>` order), `src/style.css` (append print rules)
- Test: `src/__tests__/app-foerdercheck.test.js` (create)

**Interfaces:**
- **Consumes:** `<FoerderCheck />` (Task 3).

- [ ] **Step 1: Write the failing test.**
  - Mount `App.vue` with the stubs `Hero`, `Gallery`, `Description`, `Facts`, `LeadForm`, `Footer` and the `reveal` directive.
  - Assert that `#foerdercheck` exists and comes after the `Gallery` stub and before the `LeadForm` stub in DOM order.
  - Assert that the nav array renders a link `href="#foerdercheck"` with text `Fördercheck`, placed before `Kontakt`.
- [ ] **Step 2: Run** `npx vitest run src/__tests__/app-foerdercheck.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Import and place `<FoerderCheck />` between `<Gallery>` and `<LeadForm>`.
  - Add `{ href: '#foerdercheck', label: 'Fördercheck' }` before the Kontakt entry.
  - Append to `src/style.css`: `@media print { body * { visibility: hidden } .fc-print, .fc-print * { visibility: visible } .fc-print { position: absolute; inset: 0 } }`.
- [ ] **Step 4: Verify.**
  - Run `npm test`. Expected: all pass.
  - Run `npm run build`. Expected: build succeeds with no errors.
  - Run `npm run dev` and open http://localhost:5173/#foerdercheck in a browser (Playwright or by hand).
  - Click through the family case from Task 3. The numbers must match the test values. Also check mobile width 375 px and the print preview.
- [ ] **Step 5: Commit** `git commit -am "Add Fördercheck section to the page"` (include the new test file).

---

## Done when

- All four tasks are committed on `feat/foerdercheck`.
- `npm test` and `npm run build` are green.
- The family case checked by hand in the browser shows 160.000 € at 1,00 % and ≈ 451 €/Monat for KfW 308 (`annuity(160000,1,35)`).
- The branch is ready for review and a PR.
