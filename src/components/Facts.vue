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
  <section id="eckdaten">
    <h2>Eckdaten</h2>
    <dl>
      <div v-for="f in facts" :key="f.label">
        <dt>{{ f.label }}</dt>
        <dd>{{ f.value }}</dd>
      </div>
    </dl>
  </section>
</template>
