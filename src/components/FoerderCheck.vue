<script setup>
// Fördercheck: a short quiz that shows which subsidies fit this house and
// what the monthly payment looks like. Everything stays in the browser.
// Spec: docs/superpowers/specs/2026-10-18-foerdercheck-design.md
import { ref, reactive, computed } from 'vue'
import { evaluate } from '../foerdercheck/evaluate.js'
import { KFW308 } from '../foerdercheck/data.js'
import { parseEuro as parse } from '../foerdercheck/parse.js'
import FoerderResult from './FoerderResult.vue'

const freshAnswers = () => ({
  selbstnutzung: null,
  kinder: null,
  eigentum: null,
  zve: '',
  kaufpreis: '',
  eigenkapital: '',
  kostenHeizung: '',
  kostenHuelle: '',
})
const answers = reactive(freshAnswers())
const phase = ref('intro') // intro | quiz | result
const step = ref(0)

const yesNo = [
  { value: true, label: 'Ja', test: 'ja' },
  { value: false, label: 'Nein', test: 'nein' },
]
const steps = [
  {
    key: 'selbstnutzung',
    type: 'choice',
    frage: 'Wollen Sie selbst einziehen?',
    hilfe: 'Fast alle Förderprogramme für Wohneigentum setzen voraus, dass Sie selbst im Haus wohnen.',
    options: [
      { value: true, label: 'Ja, selbst einziehen', test: 'ja' },
      { value: false, label: 'Nein, vermieten oder anlegen', test: 'nein' },
    ],
  },
  {
    key: 'kinder',
    type: 'choice',
    frage: 'Wie viele Kinder unter 18 leben in Ihrem Haushalt?',
    hilfe: 'Maßgeblich ist der Tag des Förderantrags.',
    options: [0, 1, 2, 3, 4, 5].map((n) => ({ value: n, label: n === 5 ? '5+' : String(n), test: String(n) })),
  },
  {
    key: 'eigentum',
    type: 'choice',
    frage: 'Besitzen Sie bereits Wohneigentum in Deutschland?',
    hilfe: 'Auch ein Anteil zählt, zum Beispiel ein Erbteil an einer Wohnung.',
    options: yesNo,
  },
  {
    key: 'zve',
    type: 'number',
    frage: 'Wie hoch ist Ihr zu versteuerndes Haushaltseinkommen?',
    hilfe: 'Steht im Steuerbescheid – nicht das Bruttoeinkommen. Maßgeblich ist der Schnitt der Jahre 2023 und 2024.',
    unknown: 'Weiß ich nicht',
  },
  {
    key: 'kaufpreis',
    type: 'number',
    frage: 'Mit welchem Kaufpreis rechnen Sie?',
  },
  {
    key: 'eigenkapital',
    type: 'number',
    frage: 'Wie viel Eigenkapital bringen Sie mit?',
    hilfe: 'Erspartes, das Sie in den Kauf stecken können.',
  },
  {
    key: 'sanierung',
    type: 'sanierung',
    frage: 'Was wird die Sanierung kosten – nach Ihrer Schätzung?',
    hilfe:
      'Das Haus braucht eine umfassende Sanierung. Wir können die Kosten nicht seriös schätzen – tragen Sie Ihre eigene Schätzung ein, etwa von Handwerkern oder einem Architekten.',
    unknown: 'Weiß ich noch nicht',
  },
]

// Investors stop after the first question.
const lastStep = computed(() => (answers.selbstnutzung === false ? 0 : steps.length - 1))
const current = computed(() => steps[step.value])

const result = computed(() =>
  evaluate(
    {
      selbstnutzung: answers.selbstnutzung === true,
      kinder: answers.kinder ?? 0,
      eigentum: answers.eigentum === true,
      zve: parse(answers.zve),
      kaufpreis: parse(answers.kaufpreis) ?? 0,
      eigenkapital: parse(answers.eigenkapital) ?? 0,
      kostenHeizung: parse(answers.kostenHeizung),
      kostenHuelle: parse(answers.kostenHuelle),
    },
    new Date(),
  ),
)

const error = ref('')
const BEISPIEL = 'Bitte einen Betrag in Euro eingeben, z. B. 50.000'

// Returns an error text for the current step's input, or ''.
function validate() {
  const key = current.value.key
  if (current.value.type === 'sanierung') {
    const kosten = [answers.kostenHeizung, answers.kostenHuelle].map(parse)
    return kosten.some((v) => Number.isNaN(v) || (v > 0 && v < 100)) ? BEISPIEL : ''
  }
  if (current.value.type !== 'number') return ''
  const v = parse(answers[key])
  if (Number.isNaN(v)) return BEISPIEL
  // Plausibility floors catch "120" meant as 120.000 before it turns into a
  // subsidy the visitor would not get.
  if (key === 'kaufpreis' && !(v >= 10000)) return 'Bitte geben Sie den Kaufpreis in Euro ein.'
  if (key === 'zve' && v > 0 && v < 1000) return 'Bitte das Jahreseinkommen in Euro eingeben, z. B. 80.000'
  return ''
}

function next() {
  error.value = phase.value === 'quiz' ? validate() : ''
  if (error.value) return
  if (step.value >= lastStep.value) phase.value = 'result'
  else step.value++
}
function choose(value) {
  answers[current.value.key] = value
  next()
}
function unknown() {
  error.value = ''
  if (current.value.key === 'zve') answers.zve = ''
  else {
    answers.kostenHeizung = ''
    answers.kostenHuelle = ''
  }
  next()
}
function back() {
  error.value = ''
  if (phase.value === 'result') {
    phase.value = 'quiz'
    step.value = lastStep.value
  } else if (step.value > 0) step.value--
  else phase.value = 'intro'
}
function start() {
  phase.value = 'quiz'
  step.value = 0
}
function restart() {
  Object.assign(answers, freshAnswers())
  error.value = ''
  phase.value = 'intro'
  step.value = 0
}

const introBetrag = `${new Intl.NumberFormat('de-DE').format(KFW308.betragNachKindern[3])} €`
const introZins = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(KFW308.effZinsPct)} %`

const inputClass =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-lg text-ink outline-none transition focus:border-forest-700 focus:ring-2 focus:ring-forest-700/20'
const primaryBtn =
  'inline-flex items-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-stone-50 transition-colors duration-200 hover:bg-forest-800'
const secondaryBtn =
  'inline-flex items-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-forest-700'
</script>

<template>
  <section id="foerdercheck" class="border-t border-stone-200 bg-stone-50">
    <div class="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <div class="fc-print-hide max-w-2xl" v-reveal>
        <p class="kicker text-clay-600">Fördercheck</p>
        <h2 class="font-display mt-6 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900">
          Was kostet Sie das Haus wirklich?
        </h2>
        <p class="mt-6 text-lg leading-relaxed text-ink-soft">
          Die Energieklasse H klingt nach Nachteil – sie öffnet aber die Förderung „Jung kauft Alt“:
          bis {{ introBetrag }} Kredit ab {{ introZins }} Zins für Familien. Sieben kurze Fragen, dann sehen Sie, welche
          Programme für Sie passen und wie hoch Ihre Monatsrate ist. Ihre Angaben bleiben in Ihrem
          Browser.
        </p>
      </div>

      <div class="mt-10">
        <button v-if="phase === 'intro'" type="button" data-test="start" :class="primaryBtn" @click="start">
          Fördercheck starten
        </button>

        <div v-else-if="phase === 'quiz'" class="max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <p class="kicker text-stone-500">Frage {{ step + 1 }} von {{ steps.length }}</p>
          <h3 class="font-display mt-3 text-2xl font-semibold text-forest-900">{{ current.frage }}</h3>
          <p class="mt-2 leading-relaxed text-ink-soft">{{ current.hilfe }}</p>

          <div v-if="current.type === 'choice'" class="mt-6 flex flex-wrap gap-3">
            <button
              v-for="o in current.options"
              :key="o.test"
              type="button"
              :data-test="`choice-${o.test}`"
              :class="[secondaryBtn, answers[current.key] === o.value ? 'border-forest-700 bg-forest-700/10' : '']"
              @click="choose(o.value)"
            >
              {{ o.label }}
            </button>
          </div>

          <form v-else-if="current.type === 'number'" class="mt-6" @submit.prevent="next">
            <label class="flex items-center gap-3">
              <input
                :key="current.key"
                v-model="answers[current.key]"
                data-test="input"
                type="text"
                inputmode="numeric"
                :aria-label="current.frage"
                :class="inputClass"
              />
              <span class="text-lg text-ink-soft">€</span>
            </label>
          </form>

          <form v-else class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="next">
            <label class="block">
              <span class="text-sm text-ink-soft">Heizung (z. B. Wärmepumpe)</span>
              <input v-model="answers.kostenHeizung" data-test="input-heizung" type="text" inputmode="numeric" :class="[inputClass, 'mt-1']" />
            </label>
            <label class="block">
              <span class="text-sm text-ink-soft">Fenster, Fassade, Dach</span>
              <input v-model="answers.kostenHuelle" data-test="input-huelle" type="text" inputmode="numeric" :class="[inputClass, 'mt-1']" />
            </label>
          </form>

          <p v-if="error" data-test="error" role="alert" class="mt-4 text-sm font-semibold text-clay-600">{{ error }}</p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" data-test="back" class="px-3 py-3 text-sm text-ink-soft underline hover:text-forest-700" @click="back">
              Zurück
            </button>
            <button v-if="current.type !== 'choice'" type="button" data-test="next" :class="primaryBtn" @click="next">
              Weiter
            </button>
            <button v-if="current.unknown" type="button" data-test="unknown" :class="secondaryBtn" @click="unknown">
              {{ current.unknown }}
            </button>
          </div>
        </div>

        <div v-else>
          <button type="button" data-test="back" class="mb-4 px-0 py-2 text-sm text-ink-soft underline hover:text-forest-700 print:hidden" @click="back">
            Angaben ändern
          </button>
          <FoerderResult :result="result" @restart="restart" />
        </div>
      </div>
    </div>
  </section>
</template>
