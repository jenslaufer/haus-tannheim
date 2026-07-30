<script setup>
const facts = [
  { label: 'Ort', value: 'Tannheim', note: 'Villingen-Schwenningen' },
  { label: 'Objektart', value: 'Architektenhaus' },
  { label: 'Baujahr', value: '1965' },
  { label: 'Ausrichtung', value: 'Südwest' },
  { label: 'Wohnfläche', value: 'ca. 108 m²' },
  { label: 'Grundstück', value: '804 m²', note: 'ein Flurstück' },
  { label: 'Grundbuch', value: 'lastenfreie Übergabe' },
  { label: 'Heizung', value: 'Gas-Zentralheizung', note: 'erneuert 2017' },
  { label: 'Warmwasser', value: 'erneuert 2017' },
  { label: 'Energieausweis', value: 'Bedarfsausweis', note: 'Klasse H' },
]
</script>

<template>
  <section id="eckdaten" class="border-y border-stone-200 bg-stone-100">
    <div class="mx-auto grid max-w-[1320px] gap-x-16 gap-y-12 px-5 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
      <!-- Lead column -->
      <div class="lg:col-span-5" v-reveal>
        <p class="kicker text-clay-600">Eckdaten</p>
        <h2 class="font-display mt-6 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900">
          Auf einen Blick.
        </h2>
        <p class="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
          Ein freistehendes Haus über zwei Wohnebenen, eingebettet in den sanften Hang am
          Waldrand. Die wichtigsten Daten im Überblick — alle weiteren Unterlagen erhalten Sie
          auf Anfrage.
        </p>

        <div class="mt-10 rounded-2xl bg-forest-800 p-8 text-stone-50">
          <p class="kicker text-forest-200">Kaufpreis</p>
          <p class="font-display mt-2 text-5xl font-semibold tracking-tight">280.000&nbsp;€</p>
          <p class="mt-2 text-sm text-forest-100/90">
            VHB · Privatverkauf — provisionsfrei für Käufer.
          </p>
        </div>
      </div>

      <!-- Ledger column -->
      <dl class="grid grid-cols-1 self-center sm:grid-cols-2 sm:gap-x-12 lg:col-span-7 lg:gap-x-16" v-reveal="120">
        <div
          v-for="f in facts"
          :key="f.label"
          class="flex items-baseline justify-between gap-6 border-b border-stone-300/70 py-5"
        >
          <dt class="kicker text-stone-500">{{ f.label }}</dt>
          <dd class="flex min-w-0 flex-wrap items-baseline justify-end gap-x-2 text-right">
            <span class="text-lg font-semibold text-forest-900">{{ f.value }}</span>
            <span v-if="f.note" class="text-sm text-ink-soft">{{ f.note }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
