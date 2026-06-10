<script setup>
import { photos } from '../images.js'
const cover = photos[0].full
</script>

<template>
  <header class="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden">
    <img
      :src="cover"
      alt="Architektenhaus aus dem Jahr 1966 am Waldrand in Tannheim, Villingen-Schwenningen"
      fetchpriority="high"
      class="absolute inset-0 -z-10 h-full w-full object-cover"
    />
    <!-- Forest-toned scrim: lifts contrast for the headline (≥ 4.5:1) -->
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/85 via-forest-950/35 to-forest-950/15"
    />

    <!-- Top eyebrow row -->
    <div
      class="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-6 text-stone-100 lg:px-10 lg:pt-8"
    >
      <span class="font-display text-lg font-semibold leading-none">Haus&nbsp;Tannheim</span>
      <span class="kicker hidden text-stone-200/90 sm:block">Villingen-Schwenningen · Privatverkauf</span>
    </div>

    <div class="mx-auto w-full max-w-[1320px] px-5 pb-12 lg:px-10 lg:pb-20">
      <p class="kicker mb-5 text-clay-400">Architektenhaus · Baujahr 1966 · Waldrandlage</p>
      <h1
        class="font-display max-w-4xl text-[clamp(2.6rem,7vw,5.75rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-stone-50"
      >
        Mid-Century<br class="hidden sm:block" />
        am Rand des Waldes.
      </h1>
      <p class="mt-7 max-w-xl text-lg leading-relaxed text-stone-100/95 sm:text-xl">
        Ein lichtdurchflutetes Architektenhaus der 1960er-Jahre in stiller Aussichtslage —
        großzügige Fensterflächen, fließende Räume, baumbestandenes Grundstück.
      </p>

      <div class="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
        <a
          href="#unterlagen"
          class="group inline-flex items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3.5 text-base font-semibold text-forest-900 shadow-lg shadow-forest-950/20 transition-all duration-200 hover:bg-white hover:shadow-xl"
        >
          Unterlagen anfordern
          <span class="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>
        <div class="flex items-baseline gap-3 text-stone-50">
          <span class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">280.000&nbsp;€</span>
          <span class="kicker text-stone-200/80">VHB</span>
        </div>
      </div>
    </div>
  </header>
</template>
