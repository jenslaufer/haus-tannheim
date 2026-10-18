<script setup>
import { computed } from 'vue'
import { STAND, KFW308, KFW358, KFW458, BAFA_HUELLE, BANK, AUCH_PRUEFEN } from '../foerdercheck/data.js'
import { BOOKING_URL, CONTACT_EMAIL } from '../leads.js'

const props = defineProps({ result: { type: Object, required: true } })
defineEmits(['restart'])

const nf0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })
const nf2 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const eur = (n) => `${nf0.format(Math.round(n))} €`
const pct = (n) => `${nf2.format(n)} %`
const stand = STAND.split('-').reverse().join('.')

const bookingHref = `${BOOKING_URL}?utm_source=foerdercheck`

const reasonText = (k) =>
  ({
    'keine-kinder': 'KfW 308 „Jung kauft Alt“ setzt mindestens ein Kind unter 18 in Ihrem Haushalt voraus.',
    eigentum:
      'KfW 308 „Jung kauft Alt“ ist ausgeschlossen, wenn Sie bereits Wohneigentum in Deutschland besitzen – auch einen Anteil oder ein Erbteil.',
    einkommen: `Ihr zu versteuerndes Einkommen liegt über der Grenze für KfW 308 „Jung kauft Alt“ (${eur(k.einkommensgrenze)}).`,
  })[k.reason]

const auchPruefen = computed(() =>
  props.result.auchPruefen.map((key) => AUCH_PRUEFEN.find((a) => a.key === key)).filter(Boolean),
)
const eligible308 = computed(() => props.result.scenarios.some((s) => s.kfw308.betrag > 0))
const anyHeizung = computed(() => props.result.scenarios.some((s) => s.zuschuesse.heizung > 0))
const anyHuelle = computed(() => props.result.scenarios.some((s) => s.zuschuesse.huelle > 0))
const bonusOffen = computed(() =>
  props.result.scenarios.some((s) => s.zuschuesse.heizung > 0 && !s.zuschuesse.einkommensbonusEingerechnet),
)
const vorteil = (s) => s.kfw308.vorteil + s.sanierungskredit.vorteil
const printResult = () => window.print()
const bonusPcts = KFW458.einkommensbonus.map((b) => b.pct)
const bonusMin = Math.min(...bonusPcts)
const bonusMax = Math.max(...bonusPcts)
</script>

<template>
  <div class="fc-print">
    <!-- Investor: honest short answer -->
    <div v-if="result.investor" class="rounded-2xl bg-white p-8 shadow-sm">
      <p class="kicker text-clay-600">Ihr Ergebnis</p>
      <p class="mt-4 text-lg leading-relaxed text-ink">
        Die Förderprogramme für Wohneigentum setzen Selbstnutzung voraus. Wer vermietet oder anlegt,
        bekommt weder KfW 308 noch die Zuschüsse für Selbstnutzer. Es bleiben die Sanierungsförderung
        für Vermieter und die steuerliche Abschreibung – beides hängt von Ihrer Steuersituation ab
        und wird hier nicht berechnet.
      </p>
    </div>

    <template v-else>
      <div class="grid gap-6" :class="result.scenarios.length > 1 ? 'lg:grid-cols-2' : ''">
        <article
          v-for="(s, i) in result.scenarios"
          :key="i"
          class="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8"
        >
          <p class="kicker text-clay-600">{{ s.label ?? 'Ihr Ergebnis' }}</p>

          <p v-if="!s.kfw308.eligible && s.kfw308.reason" class="mt-4 leading-relaxed text-ink-soft">
            {{ reasonText(s.kfw308) }}
          </p>

          <table class="mt-6 w-full text-left text-xs sm:text-sm">
            <thead class="kicker text-stone-500">
              <tr>
                <th class="pb-2 font-normal">Kredit</th>
                <th class="whitespace-nowrap pb-2 pl-2 text-right font-normal">Betrag</th>
                <th class="whitespace-nowrap pb-2 pl-2 text-right font-normal">Zins</th>
                <th class="whitespace-nowrap pb-2 pl-2 text-right font-normal">Rate</th>
              </tr>
            </thead>
            <tbody class="text-ink">
              <tr v-if="s.kfw308.betrag > 0" data-test="loan-308" class="border-t border-stone-200">
                <td class="py-3">KfW 308 „Jung kauft Alt“<br /><span class="text-ink-soft">{{ KFW308.laufzeitJahre }} Jahre, {{ KFW308.zinsbindungJahre }} Jahre Zinsbindung</span></td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ eur(s.kfw308.betrag) }}</td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ pct(s.kfw308.zinsPct) }}</td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ eur(s.kfw308.rate) }}</td>
              </tr>
              <tr v-if="s.sanierungskredit.programm === '358'" data-test="loan-358" class="border-t border-stone-200">
                <td class="py-3">KfW 358 Ergänzungskredit Sanierung<br /><span class="text-ink-soft">{{ KFW358.laufzeitJahre }} Jahre, {{ KFW358.zinsbindungJahre }} Jahre Zinsbindung</span></td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ eur(s.sanierungskredit.betrag) }}</td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ pct(s.sanierungskredit.zinsPct) }}</td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ eur(s.sanierungskredit.rate) }}</td>
              </tr>
              <tr data-test="loan-bank" class="border-t border-stone-200">
                <td class="py-3">Bankdarlehen<br /><span class="text-ink-soft">Annahme, {{ BANK.tilgungPct }} % Anfangstilgung</span></td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ eur(s.bank.betrag) }}</td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ pct(s.bank.zinsPct) }}</td>
                <td class="whitespace-nowrap py-3 pl-2 text-right">{{ eur(s.bank.rate) }}</td>
              </tr>
            </tbody>
          </table>
          <p class="mt-2 text-xs text-ink-soft">Zins effektiv pro Jahr, Rate pro Monat.</p>

          <div class="mt-6 rounded-xl bg-forest-800 p-5 text-stone-50">
            <p class="kicker text-forest-200">{{ s.sanierungOffen ? 'Rate ohne Sanierung' : s.sanierungTeilweiseOffen.length ? 'Rate ohne vollständige Sanierung' : 'Rate gesamt' }}</p>
            <p class="font-display mt-1 text-4xl font-semibold">{{ eur(s.rateGesamt) }} <span class="text-lg font-normal">/ Monat</span></p>
            <p v-if="vorteil(s) > 0" class="mt-2 text-sm text-forest-100/90">
              Förderkredite: {{ eur(vorteil(s)) }} / Monat günstiger als ein Bankkredit gleicher Laufzeit.
            </p>
          </div>

          <p v-if="s.sanierungOffen" class="mt-4 rounded-xl border border-clay-500/40 bg-clay-500/10 p-4 text-sm leading-relaxed text-ink">
            <strong>Sanierung: umfassend nötig, Kosten offen.</strong> Das Haus (Baujahr 1965, Klasse H)
            braucht eine umfassende Sanierung. Möglich sind Zuschüsse von {{ KFW458.grundPct }}–{{ KFW458.maxPct }} % für die Heizung
            (förderfähig bis {{ eur(KFW458.foerderfaehigStart) }}) und {{ BAFA_HUELLE.pct }} % für Fenster,
            Fassade und Dach (förderfähig bis {{ eur(BAFA_HUELLE.maxFoerderfaehig) }}).
          </p>

          <p v-if="s.sanierungTeilweiseOffen.length" class="mt-4 rounded-xl border border-clay-500/40 bg-clay-500/10 p-4 text-sm leading-relaxed text-ink">
            <strong v-for="teil in s.sanierungTeilweiseOffen" :key="teil" class="block">
              {{ teil === 'heizung' ? 'Heizung' : 'Fenster, Fassade, Dach' }}: notwendig, Kosten offen.
            </strong>
            <template v-if="s.kfw308.betrag > 0">Für „Jung kauft Alt“ gehören Heizung, Fenster, Fassade und Dach zur Pflichtsanierung.</template>
          </p>

          <div v-if="s.zuschuesse.summe > 0" class="mt-4 rounded-xl border border-stone-300 p-4 text-sm">
            <p class="kicker text-stone-500">Zuschüsse (fließen nach der Maßnahme)</p>
            <ul class="mt-2 space-y-1 text-ink">
              <li v-if="s.zuschuesse.heizung > 0">Heizung, KfW 458 ({{ s.zuschuesse.heizungSatzPct }} %): {{ eur(s.zuschuesse.heizung) }}</li>
              <li v-if="s.zuschuesse.huelle > 0">Gebäudehülle, BAFA ({{ BAFA_HUELLE.pct }} %): {{ eur(s.zuschuesse.huelle) }}</li>
            </ul>
            <p class="mt-2 text-ink-soft">Die Zuschüsse sind bereits vom Finanzierungsbedarf abgezogen. Bis zur Auszahlung müssen Sie sie vorfinanzieren.</p>
          </div>

          <p v-if="s.hinweis358" class="mt-4 text-sm leading-relaxed text-ink-soft">
            Liegt Ihr zu versteuerndes Einkommen bei höchstens {{ eur(KFW358.einkommenGrenze) }}, kommt für die
            Sanierung statt des Bankdarlehens der KfW 358 Ergänzungskredit zu {{ pct(KFW358.effZinsPct) }} in Frage.
          </p>

          <p v-if="s.eigenkapitalUnterNebenkosten" class="mt-4 text-sm text-ink-soft">
            Ihr Eigenkapital deckt die Kaufnebenkosten ({{ eur(s.nebenkosten) }}) nicht. Banken verlangen das meist.
          </p>
        </article>
      </div>

      <!-- Obligations -->
      <div v-if="eligible308" class="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <p class="kicker text-clay-600">Pflichten bei KfW 308</p>
        <ul class="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink">
          <li>Antrag über Ihre Bank <strong>vor dem Notartermin</strong> – sonst ist die Förderung verloren.</li>
          <li>Sanierung innerhalb von {{ KFW308.sanierungsfristMonate }} Monaten nach Zusage: auf Effizienzhaus 85 EE oder alle vier Maßnahmen (Heizung mit mindestens 65 % erneuerbarer Energie, Fenster, Fassade, Dach bzw. oberste Geschossdecke).</li>
          <li>Wird das Ziel verfehlt, steigt der Zins um 1 Prozentpunkt.</li>
          <li>Tilgungsfreie Anlaufjahre sind möglich; die Rate oben rechnet ohne.</li>
        </ul>
      </div>

      <div v-if="anyHeizung || anyHuelle" class="mt-6 space-y-2 text-sm leading-relaxed text-ink-soft">
        <p v-if="anyHeizung">Heizungszuschuss: Antrag erst, wenn die Auflassungsvormerkung im Grundbuch steht, und nach Ihrem Einzug.</p>
        <p v-if="bonusOffen">Bei niedrigem Einkommen kommen zur Heizungsförderung +{{ bonusMin }} bis +{{ bonusMax }} Prozentpunkte hinzu – hier nicht eingerechnet.</p>
        <p v-if="anyHuelle">Gebäudehülle: Mit Sanierungsfahrplan (iSFP) gibt es +5 Prozentpunkte auf Kosten über 30.000 €; ab 2027 kommt ein Bonus für Häuser der schlechtesten Klassen hinzu. Alternativ: Steuerabzug nach § 35c EStG.</p>
      </div>

    </template>

    <!-- Auch prüfen -->
    <div v-if="auchPruefen.length" class="mt-8">
      <p class="kicker text-clay-600">Auch prüfen</p>
      <ul class="mt-4 grid gap-4 sm:grid-cols-2">
        <li v-for="a in auchPruefen" :key="a.key" class="rounded-xl border border-stone-300 p-4 text-sm">
          <p class="font-semibold text-forest-900">{{ a.titel }}</p>
          <p class="mt-1 leading-relaxed text-ink-soft">{{ a.text }}</p>
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="mt-10 border-t border-stone-300 pt-6 text-sm leading-relaxed text-ink-soft">
      <p>
        Stand {{ stand }}. Orientierung, keine Förder-, Finanz- oder Steuerberatung. Konditionen gelten
        am Tag der Zusage. Bankzins: {{ BANK.quelle }}, als Annahme.
      </p>
      <p class="mt-2">
        Programme:
        <a :href="KFW308.url" class="underline hover:text-forest-700" target="_blank" rel="noopener">KfW 308</a>,
        <a :href="KFW358.url" class="underline hover:text-forest-700" target="_blank" rel="noopener">KfW 358</a>,
        <a :href="KFW458.url" class="underline hover:text-forest-700" target="_blank" rel="noopener">KfW 458</a>,
        <a :href="BAFA_HUELLE.url" class="underline hover:text-forest-700" target="_blank" rel="noopener">BAFA</a>
      </p>
    </div>

    <div class="mt-8 flex flex-wrap items-center gap-3 print:hidden">
      <a href="#unterlagen" class="inline-flex items-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-stone-50 transition-colors duration-200 hover:bg-forest-800">
        Unterlagen anfordern
      </a>
      <a :href="bookingHref" class="inline-flex items-center rounded-full border border-forest-700 px-6 py-3 text-sm font-semibold text-forest-800 transition-colors duration-200 hover:bg-forest-700 hover:text-stone-50">
        Besichtigung buchen
      </a>
      <button type="button" data-test="print" class="inline-flex items-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-forest-700" @click="printResult">
        Ergebnis drucken
      </button>
      <button type="button" data-test="restart" class="px-3 py-3 text-sm text-ink-soft underline hover:text-forest-700" @click="$emit('restart')">
        Neu starten
      </button>
    </div>
    <p class="mt-4 text-sm text-ink-soft print:hidden">
      Fragen zur Finanzierung oder zum Haus? Schreiben Sie uns:
      <a :href="`mailto:${CONTACT_EMAIL}`" class="underline hover:text-forest-700">{{ CONTACT_EMAIL }}</a>
    </p>
  </div>
</template>
