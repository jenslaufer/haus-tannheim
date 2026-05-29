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
</script>

<template>
  <!-- SCAFFOLD: functional lightbox, neutral styling -->
  <div role="dialog" aria-modal="true" @click.self="emit('close')">
    <button type="button" aria-label="Schließen" @click="emit('close')">×</button>
    <button type="button" aria-label="Zurück" @click="emit('prev')">‹</button>
    <img :src="src" :alt="`Foto ${index + 1} von ${total}`" />
    <button type="button" aria-label="Weiter" @click="emit('next')">›</button>
    <span>{{ index + 1 }} / {{ total }}</span>
  </div>
</template>
