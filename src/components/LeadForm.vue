<script setup>
import { ref } from 'vue'
import { captureLead, BOOKING_URL } from '../leads.js'

const name = ref('')
const email = ref('')
const hp = ref('') // honeypot — stays empty for humans
const state = ref('idle') // idle | sending | done | error

async function submit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  const res = await captureLead({ email: email.value, name: name.value, hp: hp.value })
  state.value = res && res.ok ? 'done' : 'error'
}

const benefits = [
  'Vollständiges Exposé mit allen Detailangaben',
  'Grundrisse und weitere Aufnahmen',
  'Im Anschluss direkt einen Besichtigungstermin wählen',
]
</script>

<template>
  <section id="unterlagen" class="border-t border-stone-200 bg-stone-100">
    <div class="mx-auto grid max-w-[1320px] items-center gap-x-16 gap-y-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-32">
      <!-- Persuasion column -->
      <div v-reveal>
        <p class="kicker text-clay-600">Ihr nächster Schritt</p>
        <h2 class="font-display mt-6 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-forest-900">
          Unterlagen anfordern.
        </h2>
        <p class="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
          Hinterlassen Sie Ihre E-Mail-Adresse — Sie erhalten das vollständige Exposé mit allen
          Unterlagen zur Immobilie.
        </p>
        <ul class="mt-8 space-y-3">
          <li v-for="b in benefits" :key="b" class="flex items-start gap-3 text-ink">
            <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-clay-500 text-xs text-white" aria-hidden="true">✓</span>
            <span class="leading-relaxed">{{ b }}</span>
          </li>
        </ul>
      </div>

      <!-- Form card -->
      <div class="rounded-3xl border border-stone-200 bg-white p-7 shadow-2xl shadow-forest-900/10 sm:p-10" v-reveal="120">
        <template v-if="state === 'done'">
          <div class="flex h-full flex-col justify-center text-center sm:py-6">
            <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl text-forest-700" aria-hidden="true">✓</span>
            <p class="font-display mt-5 text-2xl font-semibold tracking-tight text-forest-900">
              Vielen Dank für Ihr Interesse.
            </p>
            <p class="mt-3 leading-relaxed text-ink-soft">
              Sie erhalten die Unterlagen in Kürze per E-Mail. Sie möchten das Haus persönlich
              kennenlernen? Wählen Sie direkt einen Besichtigungstermin:
            </p>
            <a
              :href="BOOKING_URL"
              target="_blank"
              rel="noopener"
              class="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-7 py-3.5 font-semibold text-stone-50 transition-colors duration-200 hover:bg-forest-800"
            >
              Besichtigungstermin vereinbaren
              <span class="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </div>
        </template>

        <template v-else>
          <h3 class="font-display text-xl font-semibold tracking-tight text-forest-900">
            Exposé kostenfrei anfordern
          </h3>
          <form class="mt-6 space-y-4" @submit.prevent="submit">
            <div>
              <label for="lf-name" class="kicker text-stone-500">Name (optional)</label>
              <input
                id="lf-name"
                v-model="name"
                type="text"
                autocomplete="name"
                placeholder="Ihr Name"
                class="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-ink placeholder:text-stone-400 transition-colors duration-150 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/25"
              />
            </div>
            <div>
              <label for="lf-email" class="kicker text-stone-500">E-Mail-Adresse</label>
              <input
                id="lf-email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="name@beispiel.de"
                class="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-ink placeholder:text-stone-400 transition-colors duration-150 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/25"
              />
            </div>

            <!-- honeypot — hidden from humans, must stay empty -->
            <input
              v-model="hp"
              type="text"
              name="hp"
              tabindex="-1"
              autocomplete="off"
              class="hidden"
              aria-hidden="true"
            />

            <button
              type="submit"
              :disabled="state === 'sending'"
              class="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-7 py-3.5 font-semibold text-stone-50 transition-colors duration-200 hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ state === 'sending' ? 'Wird gesendet …' : 'Unterlagen anfordern' }}
              <span v-if="state !== 'sending'" class="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>

            <p v-if="state === 'error'" class="text-sm leading-relaxed text-clay-700">
              Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie uns
              direkt an
              <a href="mailto:jens@haus-tannheim.de" class="font-medium underline underline-offset-4">jens@haus-tannheim.de</a>.
            </p>
            <p class="text-xs leading-relaxed text-stone-500">
              Ihre Daten verwenden wir ausschließlich zur Bearbeitung Ihrer Anfrage. Kein Tracking,
              keine Weitergabe.
            </p>
          </form>
        </template>
      </div>
    </div>
  </section>
</template>
