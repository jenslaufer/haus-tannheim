<script setup>
// SCAFFOLD: placeholder facts, values to be filled in later.
const facts = [
  { label: 'Kaufpreis', value: '— folgt —' },
  { label: 'Wohnfläche', value: '— folgt —' },
  { label: 'Grundstück', value: '— folgt —' },
  { label: 'Zimmer', value: '— folgt —' },
  { label: 'Baujahr', value: '— folgt —' },
  { label: 'Energiewert', value: '— folgt —' },
]
</script>

<template>
  <section id="eckdaten" class="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
    <h2 class="mb-6 text-xl font-semibold sm:text-2xl">Eckdaten</h2>
    <dl class="grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
      <div v-for="f in facts" :key="f.label" class="bg-white p-5">
        <dt class="text-xs uppercase tracking-wide text-neutral-400">{{ f.label }}</dt>
        <dd class="mt-1 text-lg font-semibold">{{ f.value }}</dd>
      </div>
    </dl>
  </section>
</template>
