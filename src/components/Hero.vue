<script setup>
import { photos } from '../images.js'
const cover = photos[0]
</script>

<template>
  <!-- SCAFFOLD: neutral baseline styling via Tailwind; final design follows. -->
  <header class="relative">
    <img
      :src="cover"
      alt="Einfamilienhaus in Tannheim"
      class="block w-full min-h-80 max-h-[720px] h-[70vh] object-cover"
    />
    <h1
      class="absolute inset-x-0 bottom-0 px-4 py-6 sm:px-8 lg:px-16 bg-gradient-to-t from-black/60 to-transparent text-white text-2xl font-semibold sm:text-4xl"
    >
      Einfamilienhaus in Tannheim, Villingen-Schwenningen
    </h1>
  </header>
  <p class="mx-auto mt-6 max-w-prose px-4 text-neutral-600 sm:px-8 lg:px-16">
    Kurzbeschreibung — folgt
  </p>
</template>
