<script setup>
import { ref } from 'vue'
import { photos } from '../images.js'
import Lightbox from './Lightbox.vue'

const current = ref(-1) // -1 = closed
const open = (i) => (current.value = i)
const close = () => (current.value = -1)
const prev = () => (current.value = (current.value - 1 + photos.length) % photos.length)
const next = () => (current.value = (current.value + 1) % photos.length)
</script>

<template>
  <section id="galerie" class="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
    <h2 class="mb-6 text-xl font-semibold sm:text-2xl">Galerie</h2>
    <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <li v-for="(src, i) in photos" :key="i">
        <button
          type="button"
          class="group block w-full overflow-hidden rounded cursor-pointer"
          @click="open(i)"
        >
          <img
            :src="src"
            :alt="`Foto ${i + 1}`"
            loading="lazy"
            class="block aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </button>
      </li>
    </ul>

    <Lightbox
      v-if="current >= 0"
      :src="photos[current]"
      :index="current"
      :total="photos.length"
      @close="close"
      @prev="prev"
      @next="next"
    />
  </section>
</template>
