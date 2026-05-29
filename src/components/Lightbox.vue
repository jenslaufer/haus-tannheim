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
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

const btn =
  'absolute flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white cursor-pointer hover:bg-white/25'
</script>

<template>
  <!-- SCAFFOLD: functional lightbox, neutral Tailwind styling -->
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    @click.self="emit('close')"
  >
    <button type="button" aria-label="Schließen" :class="[btn, 'right-4 top-4']" @click="emit('close')">×</button>
    <button type="button" aria-label="Zurück" :class="[btn, 'left-4']" @click="emit('prev')">‹</button>
    <img :src="src" :alt="`Foto ${index + 1} von ${total}`" class="max-h-[88vh] max-w-[92vw] object-contain" />
    <button type="button" aria-label="Weiter" :class="[btn, 'right-4']" @click="emit('next')">›</button>
    <span class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
      {{ index + 1 }} / {{ total }}
    </span>
  </div>
</template>
