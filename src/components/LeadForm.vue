<script setup>
import { ref } from 'vue'
import { captureLead } from '../leads.js'

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
</script>

<template>
  <section id="interesse" class="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
    <h2 class="mb-6 text-xl font-semibold sm:text-2xl">Auf dem Laufenden bleiben</h2>
    <p class="mb-6 max-w-prose text-neutral-600">
      Hinterlassen Sie Ihre E-Mail-Adresse und wir informieren Sie über das vollständige
      Exposé, den Energieausweis und neue Termine.
    </p>

    <p v-if="state === 'done'" class="max-w-prose font-medium text-green-700">
      Vielen Dank für Ihr Interesse — wir melden uns bei Ihnen.
    </p>

    <form v-else class="flex max-w-xl flex-col gap-3 sm:flex-row" @submit.prevent="submit">
      <input
        v-model="name"
        type="text"
        autocomplete="name"
        placeholder="Name (optional)"
        class="flex-1 rounded border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none"
      />
      <input
        v-model="email"
        type="email"
        required
        autocomplete="email"
        placeholder="E-Mail-Adresse"
        class="flex-1 rounded border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none"
      />
      <input v-model="hp" type="text" name="hp" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
      <button
        type="submit"
        :disabled="state === 'sending'"
        class="rounded bg-neutral-900 px-5 py-2 font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {{ state === 'sending' ? 'Sende …' : 'Interesse melden' }}
      </button>
    </form>

    <p v-if="state === 'error'" class="mt-3 max-w-prose text-sm text-red-700">
      Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie uns
      direkt — siehe Kontakt unten.
    </p>
  </section>
</template>
