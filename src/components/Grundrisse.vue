<script setup>
// Plans redrawn from the 1963 Bauantrag; source of truth is haus-tannheim-private
// (scripts/plaene.py, scripts/modell3d.py). Floor names follow Description.vue:
// the garden level is the Erdgeschoss, the street level the Obergeschoss.
import erdgeschoss from '../assets/plaene/grundriss-gg.png'
import obergeschoss from '../assets/plaene/grundriss-eg.png'
import Rundgang from './Rundgang.vue'

const floors = [
  {
    src: erdgeschoss,
    name: 'Erdgeschoss',
    note: 'Gartenebene · Wohnen/Essen, Küche, Vorratsraum, Nutzraum',
  },
  {
    src: obergeschoss,
    name: 'Obergeschoss',
    note: 'Straßenebene · drei Zimmer, Bad, WC, Garage',
  },
]

const button = 'inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200'
</script>

<template>
  <section id="grundrisse" class="border-y border-stone-200 bg-stone-100">
    <div class="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <div class="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-12" v-reveal>
        <div class="lg:col-span-5">
          <p class="kicker text-clay-600">Grundrisse</p>
          <h2 class="font-display mt-6 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900">
            Zwei Ebenen am Hang.
          </h2>
        </div>
        <div class="space-y-4 text-lg leading-relaxed text-ink-soft lg:col-span-7">
          <p class="text-pretty">
            Neu gezeichnet nach den Bauplänen von 1963, mit allen Maßen in Metern. Wohnfläche
            ca. 108&nbsp;m² nach den Flächenangaben des Bauplans; die Garage mit 14,4&nbsp;m² ist
            Nutzfläche, keine Wohnfläche.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a href="#modell-3d" :class="[button, 'bg-forest-700 text-stone-50 hover:bg-forest-800']">
              Zum 3D-Rundgang
            </a>
            <a
              href="./grundrisse.pdf"
              target="_blank"
              rel="noopener"
              :class="[button, 'border border-forest-700 text-forest-800 hover:bg-forest-50']"
            >
              Grundrisse als PDF<span class="sr-only"> (öffnet in neuem Tab)</span>
            </a>
          </div>
        </div>
      </div>

      <!-- One plan per row: the Maßketten need the width to stay readable -->
      <div class="mx-auto mt-12 grid max-w-5xl gap-12">
        <figure v-for="(f, i) in floors" :key="f.name" class="min-w-0" v-reveal="i * 100">
          <figcaption class="mb-4 flex flex-wrap items-baseline gap-x-3">
            <span class="font-display text-2xl font-semibold text-forest-900">{{ f.name }}</span>
            <span class="text-sm text-ink-soft">{{ f.note }}</span>
          </figcaption>
          <a :href="f.src" target="_blank" rel="noopener" class="block overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <img
              :src="f.src"
              :alt="`Grundriss ${f.name} mit Maßen (${f.note})`"
              width="2364"
              height="2371"
              loading="lazy"
              class="h-auto w-full"
            />
            <span class="sr-only">Großansicht öffnet in neuem Tab</span>
          </a>
        </figure>

        <Rundgang />
      </div>

      <p class="mx-auto mt-8 max-w-5xl text-sm text-stone-600">
        Maße in Metern, Rohbaumaße, ohne Gewähr. Lage von Türen und Treppe aus der Zeichnung
        übernommen; das 3D-Modell ist schematisch, die Foto-Standorte sind aus den Bildern geschätzt.
      </p>
    </div>
  </section>
</template>
