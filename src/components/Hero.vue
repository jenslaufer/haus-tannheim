<script setup>
import { photos } from '../images.js'
const cover = photos[0]
</script>

<template>
  <header class="relative">
    <img
      :src="cover"
      alt="Architektenhaus aus den 1960er-Jahren in Tannheim, Villingen-Schwenningen"
      class="block w-full min-h-80 max-h-[720px] h-[70vh] object-cover"
    />
    <div
      class="absolute inset-x-0 bottom-0 px-4 py-6 sm:px-8 lg:px-16 bg-gradient-to-t from-black/70 to-transparent text-white"
    >
      <h1 class="max-w-3xl text-2xl font-semibold sm:text-4xl">
        Mid-Century-Juwel am Waldrand
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-white/90 sm:text-lg">
        Lichtdurchflutetes Architektenhaus der 1960er-Jahre in traumhafter Natur- und
        Aussichtslage nahe Villingen-Schwenningen.
      </p>
    </div>
  </header>
  <p class="mx-auto mt-6 max-w-prose px-4 text-neutral-600 sm:px-8 lg:px-16">
    Zu verkaufen: lichtdurchflutetes Architektenhaus bei Villingen-Schwenningen in
    waldrandnaher Aussichtslage. Großes, baumbestandenes Grundstück, verkehrsberuhigte
    Lage — ideal für junge Familien und Erholungssuchende.
  </p>
</template>
