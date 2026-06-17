<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { photos, photosLegacy } from '../images.js'
import Lightbox from './Lightbox.vue'

const props = defineProps({ variant: { type: String, default: 'new' } })
const pics = computed(() => (props.variant === 'legacy' ? photosLegacy : photos))
const justified = computed(() => props.variant === 'v3')

const current = ref(-1) // -1 = closed
const open = (i) => (current.value = i)
const close = () => (current.value = -1)
const prev = () => (current.value = (current.value - 1 + pics.value.length) % pics.value.length)
const next = () => (current.value = (current.value + 1) % pics.value.length)

const INITIAL = 12
const expanded = ref(false)
const visible = computed(() => (expanded.value ? pics.value : pics.value.slice(0, INITIAL)))

// — Grid layout (variant 'new' / 'legacy') —
// Editorial rhythm: a repeating pattern of spans breaks the uniform grid.
// Pattern cycles every 6 tiles across a 6-column desktop grid.
const spanFor = (i) => {
  const p = i % 6
  if (p === 0) return 'sm:col-span-4 sm:row-span-2'
  if (p === 3) return 'sm:col-span-2 sm:row-span-2'
  return 'sm:col-span-2'
}

// Rendered tile width hint for the browser's srcset pick: the wide tile
// (every 6th) spans 4 of 6 columns, all others 2 of 6; mobile is 2-col.
const sizesFor = (i) =>
  i % 6 === 0
    ? '(min-width: 1330px) 880px, (min-width: 640px) 66vw, 50vw'
    : '(min-width: 1330px) 440px, (min-width: 640px) 33vw, 50vw'

// — Justified layout (variant 'v3') —
// Google-Photos-style flush rows: every photo keeps its true aspect ratio, so
// no shot is ever cropped. We pack photos greedily into a row, then scale the
// row's height so its widths add up to exactly the container width.
const GAP = 16
const railEl = ref(null)
const railW = ref(1240)
let ro
onMounted(() => {
  if (!justified.value) return
  ro = new ResizeObserver(([e]) => (railW.value = e.contentRect.width))
  if (railEl.value) ro.observe(railEl.value)
})
onUnmounted(() => ro && ro.disconnect())

// Taller rows on wider screens; fewer, larger photos per row on phones.
const targetRowH = computed(() => (railW.value < 640 ? 210 : railW.value < 1024 ? 250 : 300))

const rows = computed(() => {
  const out = []
  let row = []
  let sumAR = 0
  visible.value.forEach((photo, idx) => {
    row.push({ photo, idx })
    sumAR += photo.ar
    // Height at which this row's photos fill the full width.
    const h = (railW.value - GAP * (row.length - 1)) / sumAR
    if (h <= targetRowH.value) {
      out.push({ items: row, h })
      row = []
      sumAR = 0
    }
  })
  // Trailing partial row: keep at target height, left-aligned (don't blow it up).
  if (row.length) {
    const h = Math.min(targetRowH.value, (railW.value - GAP * (row.length - 1)) / sumAR)
    out.push({ items: row, h, last: true })
  }
  return out
})
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
          {{ pics.length }} Aufnahmen vom Haus, dem Grundstück und der Umgebung. Zum Vergrößern
          ein Bild auswählen.
        </p>
      </div>

      <!-- Justified rows (variant 'v3'): no crop, every photo at its true ratio. -->
      <div v-if="justified" ref="railEl" class="mt-12 flex flex-col gap-4">
        <div v-for="(r, ri) in rows" :key="ri" class="flex gap-4" :class="r.last ? 'justify-start' : ''">
          <button
            v-for="it in r.items"
            :key="it.idx"
            type="button"
            class="group relative block shrink-0 overflow-hidden rounded-lg bg-forest-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-400 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950"
            :style="{ width: it.photo.ar * r.h + 'px', height: r.h + 'px' }"
            :aria-label="`Foto ${it.idx + 1} von ${pics.length} vergrößern`"
            @click="open(it.idx)"
          >
            <img
              :src="it.photo.thumb"
              :srcset="it.photo.thumbset"
              :sizes="Math.round(it.photo.ar * r.h) + 'px'"
              :alt="`Aufnahme ${it.idx + 1}`"
              loading="lazy"
              decoding="async"
              class="block h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <span class="pointer-events-none absolute inset-0 bg-forest-950/0 transition-colors duration-300 group-hover:bg-forest-950/15" />
          </button>
        </div>
      </div>

      <!-- Span grid (variant 'new' / 'legacy') -->
      <ul
        v-else
        class="mt-12 grid auto-rows-[176px] grid-cols-2 gap-3 sm:auto-rows-[208px] sm:grid-cols-6 sm:gap-4 lg:auto-rows-[232px]"
      >
        <li v-for="(photo, i) in visible" :key="i" :class="spanFor(i)" class="col-span-1">
          <button
            type="button"
            class="group relative block h-full w-full overflow-hidden rounded-lg bg-forest-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-400 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950"
            :aria-label="`Foto ${i + 1} von ${pics.length} vergrößern`"
            @click="open(i)"
          >
            <img
              :src="photo.thumb"
              :srcset="photo.thumbset"
              :sizes="sizesFor(i)"
              :alt="`Aufnahme ${i + 1}`"
              loading="lazy"
              decoding="async"
              class="block h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <span class="pointer-events-none absolute inset-0 bg-forest-950/0 transition-colors duration-300 group-hover:bg-forest-950/15" />
          </button>
        </li>
      </ul>

      <div v-if="!expanded && pics.length > INITIAL" class="mt-10 text-center" v-reveal>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-stone-400/40 px-7 py-3 text-sm font-semibold text-stone-100 transition-colors duration-200 hover:border-clay-400 hover:text-clay-400"
          @click="expanded = true"
        >
          Alle {{ pics.length }} Fotos ansehen
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </div>

    <Lightbox
      v-if="current >= 0"
      :src="pics[current].full"
      :index="current"
      :total="pics.length"
      @close="close"
      @prev="prev"
      @next="next"
    />
  </section>
</template>
