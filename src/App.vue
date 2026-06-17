<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Hero from './components/Hero.vue'

// 'new' (index.html, Anke's rework) or 'legacy' (index2.html, pre-rework
// gallery order + cover). Set by the page's entry file; defaults to 'new'.
defineProps({ variant: { type: String, default: 'new' } })
import Facts from './components/Facts.vue'
import Gallery from './components/Gallery.vue'
import Description from './components/Description.vue'
import LeadForm from './components/LeadForm.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'

// Sticky top bar appears once the hero has scrolled past.
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 560)
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const nav = [
  { href: '#eckdaten', label: 'Eckdaten' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#beschreibung', label: 'Beschreibung' },
  { href: '#kontakt', label: 'Kontakt' },
]
</script>

<template>
  <a
    href="#unterlagen"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest-700 focus:px-5 focus:py-2 focus:text-sm focus:text-stone-50"
  >
    Zu „Unterlagen anfordern“ springen
  </a>

  <!-- Sticky bar: revealed after the hero -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="-translate-y-full opacity-0"
  >
    <header
      v-show="scrolled"
      class="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur"
    >
      <div class="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3 lg:px-10">
        <a href="#top" class="font-display text-lg font-semibold leading-none text-forest-800">
          Haus&nbsp;Tannheim
        </a>
        <nav class="hidden items-center gap-8 md:flex">
          <a
            v-for="item in nav"
            :key="item.href"
            :href="item.href"
            class="kicker text-ink-soft transition-colors duration-150 hover:text-forest-700"
          >
            {{ item.label }}
          </a>
        </nav>
        <a
          href="#unterlagen"
          class="inline-flex items-center rounded-full bg-forest-700 px-5 py-2.5 text-sm font-semibold text-stone-50 transition-colors duration-200 hover:bg-forest-800"
        >
          Unterlagen anfordern
        </a>
      </div>
    </header>
  </Transition>

  <main id="top">
    <Hero :variant="variant" />
    <Facts />
    <Description />
    <Gallery :variant="variant" />
    <LeadForm />
    <Contact />
  </main>
  <Footer />
</template>
