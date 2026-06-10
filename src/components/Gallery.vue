<script setup>
import { ref, computed } from 'vue'
import { photos } from '../images.js'
import Lightbox from './Lightbox.vue'

const current = ref(-1) // -1 = closed
const open = (i) => (current.value = i)
const close = () => (current.value = -1)
const prev = () => (current.value = (current.value - 1 + photos.length) % photos.length)
const next = () => (current.value = (current.value + 1) % photos.length)

const INITIAL = 12
const expanded = ref(false)
const visible = computed(() => (expanded.value ? photos : photos.slice(0, INITIAL)))

// Editorial rhythm: a repeating pattern of spans breaks the uniform grid.
// Pattern cycles every 6 tiles across a 6-column desktop grid.
const spanFor = (i) => {
  const p = i % 6
  if (p === 0) return 'sm:col-span-4 sm:row-span-2'
  if (p === 3) return 'sm:col-span-2 sm:row-span-2'
  return 'sm:col-span-2'
}
</script>

<template>
  <section id="galerie" class="border-t border-stone-200 bg-forest-950 py-20 lg:py-32">
    <div class="mx-auto max-w-[1320px] px-5 lg:px-10">
      <div class="flex flex-wrap items-end justify-between gap-6" v-reveal>
        <div>
          <p class="kicker text-clay-400">Galerie</p>
          <h2 class="font-display mt-6 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-stone-50">
            Räume, Licht und Garten.
          </h2>
        </div>
        <p class="max-w-sm text-sm leading-relaxed text-stone-300">
          {{ photos.length }} Aufnahmen vom Haus, dem Grundstück und der Umgebung. Zum Vergrößern
          ein Bild auswählen.
        </p>
      </div>

      <ul
        class="mt-12 grid auto-rows-[176px] grid-cols-2 gap-3 sm:auto-rows-[208px] sm:grid-cols-6 sm:gap-4 lg:auto-rows-[232px]"
      >
        <li v-for="(photo, i) in visible" :key="i" :class="spanFor(i)" class="col-span-1">
          <button
            type="button"
            class="group relative block h-full w-full overflow-hidden rounded-lg bg-forest-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-400 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950"
            :aria-label="`Foto ${i + 1} von ${photos.length} vergrößern`"
            @click="open(i)"
          >
            <img
              :src="photo.thumb"
              :alt="`Aufnahme ${i + 1}`"
              loading="lazy"
              decoding="async"
              class="block h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <span class="pointer-events-none absolute inset-0 bg-forest-950/0 transition-colors duration-300 group-hover:bg-forest-950/15" />
          </button>
        </li>
      </ul>

      <div v-if="!expanded && photos.length > INITIAL" class="mt-10 text-center" v-reveal>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-stone-400/40 px-7 py-3 text-sm font-semibold text-stone-100 transition-colors duration-200 hover:border-clay-400 hover:text-clay-400"
          @click="expanded = true"
        >
          Alle {{ photos.length }} Fotos ansehen
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </div>

    <Lightbox
      v-if="current >= 0"
      :src="photos[current].full"
      :index="current"
      :total="photos.length"
      @close="close"
      @prev="prev"
      @next="next"
    />
  </section>
</template>
