<script setup>
const facts = [
  { label: 'Kaufpreis', value: '280.000 € (VHB)' },
  { label: 'Objektart', value: 'Architektenhaus' },
  { label: 'Baujahr', value: '1966' },
  { label: 'Wohnfläche', value: 'auf Anfrage' },
  { label: 'Grundstück', value: 'auf Anfrage' },
  { label: 'Ausrichtung', value: 'Südwest' },
  { label: 'Heizung', value: 'Gas-Zentralheizung (2017)' },
  { label: 'Energieausweis', value: 'in Erstellung' },
]
</script>

<template>
  <section id="eckdaten" class="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
    <h2 class="mb-6 text-xl font-semibold sm:text-2xl">Eckdaten</h2>
    <dl class="grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-4">
      <div v-for="f in facts" :key="f.label" class="bg-white p-5">
        <dt class="text-xs uppercase tracking-wide text-neutral-400">{{ f.label }}</dt>
        <dd class="mt-1 text-lg font-semibold">{{ f.value }}</dd>
      </div>
    </dl>
  </section>
</template>
