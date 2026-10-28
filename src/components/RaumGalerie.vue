<script setup>
import { ref, computed } from 'vue'
import { fotoNach } from '../images.js'
import { stationen } from '../rundgang/stationen.js'
import { gruppen, titel, raumVon } from '../rundgang/tour.js'
import raeume from '../assets/rundgang/raeume.json'
import Lightbox from './Lightbox.vue'

// The tour without 3D, for phones and browsers without WebGL: photos by room,
// each with a small plan that marks where it was taken and which way it looks.
const liste = gruppen(stationen).map((g) => ({
  ...g,
  titel: titel(g.stationen[0]),
  raum: g.stationen[0].raum,
  plan: g.schluessel !== 'Luftbild', // drone spots are far off the plan
}))

const PAD = 1
function ausschnitt(g) {
  const pts = [...raeume.umriss, ...g.stationen.map((s) => s.pos)]
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const [x0, y0] = [Math.min(...xs) - PAD, Math.min(...ys) - PAD]
  return `${x0} ${y0} ${Math.max(...xs) + PAD - x0} ${Math.max(...ys) + PAD - y0}`
}
const geschossRaeume = (g) => (g.raum ? raeume.raeume.filter((r) => r.geschoss === raumVon(g.stationen[0]).geschoss) : [])
const punkte = (poly) => poly.map((p) => p.join(',')).join(' ')
const pfeil = (s, len = 1.2) => {
  const n = Math.hypot(...s.blick)
  return [s.pos[0] + (s.blick[0] / n) * len, s.pos[1] + (s.blick[1] / n) * len]
}

const offen = ref(null) // { gruppe, index }
const bilder = computed(() => offen.value?.gruppe.stationen.map((s) => fotoNach[s.foto].full) ?? [])
const n = computed(() => bilder.value.length)
const blaettern = (d) => (offen.value.index = (offen.value.index + d + n.value) % n.value)
</script>

<template>
  <div class="space-y-10">
    <section v-for="g in liste" :key="g.start" class="min-w-0">
      <h3 class="font-display text-xl font-semibold text-forest-900">{{ g.titel }}</h3>
      <div class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <svg
          v-if="g.plan"
          :viewBox="ausschnitt(g)"
          class="w-full rounded-xl border border-stone-200 bg-white"
          role="img"
          :aria-label="`Lageplan: ${g.stationen.length} Standorte, ${g.titel}`"
        >
          <polygon :points="punkte(raeume.umriss)" fill="#e7e0d2" stroke="#8f8163" stroke-width="0.08" />
          <polygon
            v-for="r in geschossRaeume(g)"
            :key="r.id"
            :points="punkte(r.umriss)"
            :fill="r.id === g.raum ? '#c98a6a' : '#faf8f3'"
            stroke="#8f8163"
            stroke-width="0.04"
          />
          <g v-for="(s, i) in g.stationen" :key="s.foto">
            <line :x1="s.pos[0]" :y1="s.pos[1]" :x2="pfeil(s)[0]" :y2="pfeil(s)[1]" stroke="#2e4729" stroke-width="0.12" />
            <circle :cx="s.pos[0]" :cy="s.pos[1]" r="0.32" fill="#2e4729" />
            <text :x="s.pos[0]" :y="s.pos[1] + 0.15" font-size="0.42" text-anchor="middle" fill="#faf8f3">{{ i + 1 }}</text>
          </g>
        </svg>
        <div class="grid grid-cols-2 gap-3" :class="g.plan ? 'sm:col-span-2' : 'sm:col-span-3'">
          <button
            v-for="(s, i) in g.stationen"
            :key="s.foto"
            type="button"
            class="relative block overflow-hidden rounded-xl bg-stone-200"
            @click="offen = { gruppe: g, index: i }"
          >
            <img
              :src="fotoNach[s.foto].thumb"
              :srcset="fotoNach[s.foto].thumbset"
              sizes="(min-width: 640px) 30vw, 50vw"
              :alt="`${g.titel}, Standort ${i + 1}`"
              loading="lazy"
              class="aspect-[3/2] h-auto w-full object-cover"
            />
            <span
              v-if="g.plan"
              class="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-forest-700 text-xs font-semibold text-stone-50"
            >
              {{ i + 1 }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <Lightbox
      v-if="offen"
      :src="bilder[offen.index]"
      :index="offen.index"
      :total="n"
      @close="offen = null"
      @prev="blaettern(-1)"
      @next="blaettern(1)"
    />
  </div>
</template>
