<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fotoNach } from '../images.js'
import { stationen, RAUM_NAMEN } from '../rundgang/stationen.js'
import { gruppen, titel, geschoss, schritt } from '../rundgang/tour.js'
import RaumGalerie from './RaumGalerie.vue'

// 3D tour: the model with a marker for every photo. A click flies to where the
// photo was taken and lays the photo over that view. Phones and browsers without
// WebGL get the same tour as a room gallery with small plans (RaumGalerie).
// Like the old embedded model, the stage takes no input until started, so it
// cannot trap a phone's scroll; "Bedienung beenden" gives the scroll back.

const schmal = typeof matchMedia === 'function' && matchMedia('(max-width: 767px)').matches
const fehler = ref(false)
const galerie = computed(() => schmal || fehler.value)

const buehne = ref(null)
const geladen = ref(false)
const aktiv = ref(false)
const aktuell = ref(-1) // -1 = overview
const angekommen = ref(false)
const fotoAn = ref(true)
const hover = ref(null) // { i, x, y }
let szene = null
let warteAuf = null // station asked for before the scene was ready

const ORTE = { Außen: [], Obergeschoss: [], Erdgeschoss: [] }
for (const g of gruppen(stationen)) {
  const liste = ORTE[geschoss(g.stationen[0]) ?? 'Außen']
  if (!liste.some((o) => o.schluessel === g.schluessel)) liste.push({ ...g, name: RAUM_NAMEN[g.schluessel] ?? g.schluessel })
}
const EBENEN = [
  { gruppe: 'Dach', name: 'Dach' },
  { gruppe: 'EG', name: 'Obergeschoss' },
  { gruppe: 'GG', name: 'Erdgeschoss' },
  { gruppe: 'Gelaende', name: 'Gelände' },
]
const ebeneAn = ref(Object.fromEntries(EBENEN.map((e) => [e.gruppe, true])))

const station = computed(() => stationen[aktuell.value])
const foto = computed(() => station.value && fotoNach[station.value.foto].full)

async function zeige(i) {
  aktiv.value = true
  aktuell.value = i
  angekommen.value = false
  fotoAn.value = true
  if (!szene) return (warteAuf = i)
  if (await szene.zeige(i)) angekommen.value = true
}
function zurueck() {
  warteAuf = null // a station asked for while loading must not reopen after cancelling
  aktuell.value = -1
  angekommen.value = false
  szene?.uebersicht()
}
const blaettern = (d) => zeige(schritt(aktuell.value, d, stationen.length))
function umschalten(e) {
  ebeneAn.value[e.gruppe] = !ebeneAn.value[e.gruppe]
  szene?.setzeGruppe(e.gruppe, ebeneAn.value[e.gruppe])
}
function beenden() {
  if (aktuell.value >= 0) zurueck()
  aktiv.value = false
}

const onKey = (e) => {
  if (!aktiv.value || aktuell.value < 0 || e.defaultPrevented) return
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return // keep the caret keys
  if (e.key === 'Escape') zurueck()
  else if (e.key === 'ArrowLeft') blaettern(-1)
  else if (e.key === 'ArrowRight') blaettern(1)
}

let io
let weg = false // unmounted while the scene was still loading
async function laden() {
  try {
    const { erstelleSzene } = await import('../rundgang/szene.js')
    const s = await erstelleSzene(buehne.value, stationen, {
      onHover: (i, x, y) => {
        const r = buehne.value.getBoundingClientRect()
        hover.value = i >= 0 ? { i, x: x - r.left, y: y - r.top } : null
      },
    })
    if (weg) return s.dispose()
    szene = s
    szene.beiAuswahl(zeige)
    geladen.value = true
    if (warteAuf !== null) zeige(warteAuf)
  } catch (e) {
    console.error(e)
    fehler.value = true // no WebGL, or the model failed to load: show the room gallery
  }
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (galerie.value) return
  if (typeof IntersectionObserver === 'undefined') return laden()
  // load three.js and the model only when the section comes near the viewport
  io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      laden()
    },
    { rootMargin: '400px' },
  )
  io.observe(buehne.value)
})
onUnmounted(() => {
  weg = true
  window.removeEventListener('keydown', onKey)
  io?.disconnect()
  szene?.dispose()
})

const button = 'inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200'
const chip = 'rounded-full border border-stone-300 px-2.5 py-1 text-xs text-ink-soft transition-colors hover:border-forest-700 hover:text-forest-800'
const rund =
  'flex h-11 w-11 items-center justify-center rounded-full border border-stone-100/20 bg-forest-950/50 text-xl leading-none text-stone-100 backdrop-blur transition-colors hover:bg-forest-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-400'
</script>

<template>
  <!-- reveal on the caption, not the figure: the phone gallery is too tall to ever be 12 % in view -->
  <figure id="modell-3d" class="min-w-0 scroll-mt-24">
    <figcaption class="mb-4 flex flex-wrap items-baseline gap-x-3" v-reveal>
      <span class="font-display text-2xl font-semibold text-forest-900">3D-Rundgang</span>
      <span class="text-sm text-ink-soft">
        <template v-if="galerie">Jedes Foto mit seinem Standort im Grundriss</template>
        <template v-else>Jeder Punkt im Modell ist ein Foto: anklicken, und Sie stehen dort, wo es aufgenommen wurde</template>
      </span>
    </figcaption>

    <RaumGalerie v-if="galerie" />

    <template v-else>
      <div class="relative h-[72vh] max-h-[680px] min-h-[420px] overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div
          ref="buehne"
          data-test="buehne"
          class="absolute inset-0"
          :class="{ 'pointer-events-none': !aktiv }"
          role="img"
          aria-label="3D-Modell Haus Tannheim mit den Standorten der Fotos"
        ></div>

        <p v-if="!geladen" class="pointer-events-none absolute inset-0 grid place-items-center text-sm text-stone-600">
          3D-Modell wird geladen …
        </p>

        <!-- overview: floors and places -->
        <div
          v-if="aktiv && aktuell < 0"
          class="absolute left-4 top-4 max-h-[calc(100%-2rem)] w-[min(320px,calc(100%-2rem))] overflow-y-auto rounded-xl border border-stone-200 bg-stone-50/90 p-4 backdrop-blur"
        >
          <p class="kicker text-clay-600">Ebenen</p>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <button
              v-for="e in EBENEN"
              :key="e.gruppe"
              type="button"
              :aria-pressed="ebeneAn[e.gruppe]"
              :class="[chip, !ebeneAn[e.gruppe] && 'line-through opacity-60']"
              @click="umschalten(e)"
            >
              {{ e.name }}
            </button>
          </div>
          <template v-for="(orte, ebene) in ORTE" :key="ebene">
            <p class="kicker mt-4 text-clay-600">{{ ebene }}</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <button v-for="o in orte" :key="o.schluessel" type="button" :class="chip" @click="zeige(o.start)">
                {{ o.name }}
              </button>
            </div>
          </template>
        </div>

        <span
          v-if="hover && aktuell < 0"
          class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-full bg-forest-900 px-3 py-1 text-xs text-stone-50"
          :style="{ left: `${hover.x}px`, top: `${hover.y}px` }"
        >
          {{ titel(stationen[hover.i]) }}
        </span>

        <!-- photo over the model view from the same spot -->
        <div v-if="aktuell >= 0" class="absolute inset-0" role="dialog" aria-label="Foto am Standort">
          <Transition
            enter-active-class="transition-opacity duration-500"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-200"
            leave-to-class="opacity-0"
          >
            <div v-if="angekommen && fotoAn" class="absolute inset-0 bg-forest-950/85">
              <img :src="foto" :alt="titel(station)" class="h-full w-full object-contain" />
            </div>
          </Transition>
          <div class="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2">
            <span class="rounded-full bg-forest-950/70 px-4 py-2 text-sm text-stone-100 backdrop-blur">
              {{ titel(station) }} · {{ aktuell + 1 }}/{{ stationen.length }}
            </span>
            <span class="flex gap-2">
              <button type="button" :class="[rund, 'w-auto px-4 !text-sm']" :disabled="!angekommen" @click="fotoAn = !fotoAn">
                {{ fotoAn ? 'Modell zeigen' : 'Foto zeigen' }}
              </button>
              <button type="button" aria-label="Vorheriges Foto" :class="rund" @click="blaettern(-1)">‹</button>
              <button type="button" aria-label="Nächstes Foto" :class="rund" @click="blaettern(1)">›</button>
              <button type="button" aria-label="Zurück zum Modell" :class="rund" @click="zurueck">×</button>
            </span>
          </div>
        </div>

        <button
          v-if="!aktiv"
          type="button"
          class="absolute inset-0 flex items-end justify-center bg-forest-900/10 pb-8 transition-colors duration-200 hover:bg-forest-900/20"
          @click="zeige(0)"
        >
          <span :class="[button, 'bg-forest-700 text-stone-50 shadow-lg']">Rundgang starten</span>
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-3">
        <button v-if="aktiv" type="button" :class="[button, 'bg-forest-700 text-stone-50 hover:bg-forest-800']" @click="beenden">
          Bedienung beenden
        </button>
        <a
          href="./3d/"
          target="_blank"
          rel="noopener"
          :class="[button, 'border border-forest-700 text-forest-800 hover:bg-forest-50']"
        >
          3D-Modell im Vollbild öffnen<span class="sr-only"> (neuer Tab)</span>
        </a>
      </div>
    </template>
  </figure>
</template>
