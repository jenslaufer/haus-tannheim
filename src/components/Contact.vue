<script setup>
// Verkäufer-Kontakt (Privatverkauf). E-Mail/Telefon von Jens noch zu bestätigen.
const contact = {
  name: 'Jens Laufer',
  email: '',
  phone: '',
}
</script>

<template>
  <section id="kontakt" class="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
    <div class="grid gap-x-16 gap-y-10 border-t border-stone-200 pt-16 lg:grid-cols-12">
      <div class="lg:col-span-5" v-reveal>
        <p class="kicker text-clay-600">Kontakt</p>
        <h2 class="font-display mt-6 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900">
          Sprechen Sie uns an.
        </h2>
        <p class="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
          Für weitere Informationen oder die Vereinbarung eines Besichtigungstermins erreichen Sie
          uns direkt.
        </p>
      </div>

      <div class="lg:col-span-6 lg:col-start-7" v-reveal="100">
        <div class="rounded-2xl border border-stone-200 bg-stone-100 p-8 sm:p-10">
          <p class="kicker text-stone-500">Privatverkauf</p>
          <p class="font-display mt-2 text-2xl font-semibold tracking-tight text-forest-900">
            {{ contact.name }}
          </p>

          <dl class="mt-6 space-y-4">
            <div v-if="contact.email" class="flex items-baseline justify-between gap-4 border-t border-stone-200 pt-4">
              <dt class="kicker text-stone-500">E-Mail</dt>
              <dd>
                <a :href="`mailto:${contact.email}`" class="font-medium text-forest-700 underline-offset-4 transition-colors hover:text-forest-900 hover:underline">
                  {{ contact.email }}
                </a>
              </dd>
            </div>
            <div v-if="contact.phone" class="flex items-baseline justify-between gap-4 border-t border-stone-200 pt-4">
              <dt class="kicker text-stone-500">Telefon</dt>
              <dd>
                <a :href="`tel:${contact.phone.replace(/\s/g, '')}`" class="font-medium text-forest-700 underline-offset-4 transition-colors hover:text-forest-900 hover:underline">
                  {{ contact.phone }}
                </a>
              </dd>
            </div>
            <p v-if="!contact.email && !contact.phone" class="border-t border-stone-200 pt-4 italic text-stone-500">
              Kontaktdaten werden ergänzt — bitte fordern Sie zunächst die Unterlagen an.
            </p>
          </dl>

          <a
            href="#unterlagen"
            class="group mt-8 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-stone-50 transition-colors duration-200 hover:bg-forest-800"
          >
            Unterlagen anfordern
            <span class="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
