<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  src: { type: String, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
})
const emit = defineEmits(['close', 'prev', 'next'])

const onKey = (e) => {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') emit('prev')
  else if (e.key === 'ArrowRight') emit('next')
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

const btn =
  'group absolute flex h-12 w-12 items-center justify-center rounded-full border border-stone-100/20 bg-forest-950/40 text-2xl leading-none text-stone-100 backdrop-blur cursor-pointer transition-colors duration-200 hover:bg-forest-900/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-400'
</script>

<template>
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Foto-Großansicht"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-forest-950/95 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <button type="button" aria-label="Schließen" :class="[btn, 'right-4 top-4 sm:right-6 sm:top-6']" @click="emit('close')">
      ×
    </button>
    <button type="button" aria-label="Vorheriges Foto" :class="[btn, 'left-4 sm:left-6']" @click="emit('prev')">
      ‹
    </button>

    <img
      :src="src"
      :alt="`Foto ${index + 1} von ${total}`"
      class="max-h-[86vh] max-w-[92vw] rounded-lg object-contain shadow-2xl shadow-black/50"
    />

    <button type="button" aria-label="Nächstes Foto" :class="[btn, 'right-4 sm:right-6']" @click="emit('next')">
      ›
    </button>

    <span
      class="kicker absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-stone-100/15 bg-forest-950/50 px-4 py-2 text-stone-200 backdrop-blur"
    >
      {{ index + 1 }} / {{ total }}
    </span>
  </div>
</template>
