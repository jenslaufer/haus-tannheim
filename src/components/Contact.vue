<script setup>
// Verkäufer-Kontakt (Privatverkauf). E-Mail/Telefon von Jens noch zu bestätigen.
const contact = {
  name: 'Jens Laufer',
  email: '',
  phone: '',
}
</script>

<template>
  <section id="kontakt" class="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
    <h2 class="mb-6 text-xl font-semibold sm:text-2xl">Kontakt</h2>
    <p class="mb-6 max-w-prose text-neutral-600">
      Für weitere Informationen oder die Vereinbarung eines Besichtigungstermins erreichen Sie
      uns direkt:
    </p>
    <div class="space-y-1 text-neutral-700">
      <p class="font-medium">{{ contact.name }}</p>
      <p v-if="contact.email">
        <span class="text-neutral-500">E-Mail:</span>
        <a :href="`mailto:${contact.email}`" class="underline">{{ contact.email }}</a>
      </p>
      <p v-if="contact.phone">
        <span class="text-neutral-500">Telefon:</span>
        <a :href="`tel:${contact.phone.replace(/\s/g, '')}`" class="underline">{{ contact.phone }}</a>
      </p>
      <p v-if="!contact.email && !contact.phone" class="italic text-neutral-400">
        Kontaktdaten werden ergänzt.
      </p>
    </div>
  </section>
</template>
