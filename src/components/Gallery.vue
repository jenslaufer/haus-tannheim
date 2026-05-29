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
  <section id="galerie">
    <h2>Galerie</h2>
    <ul>
      <li v-for="(src, i) in photos" :key="i">
        <button type="button" @click="open(i)">
          <img :src="src" :alt="`Foto ${i + 1}`" loading="lazy" />
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
