import { createApp } from 'vue'

// Self-hosted fonts (no external font CDN — see Datenschutzerklärung).
// Fraunces: display serif with optical-size axis. Hanken Grotesk: humanist text face.
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/hanken-grotesk/wght.css'

import './style.css'
import App from './App.vue'
import { reveal } from './reveal.js'

createApp(App).directive('reveal', reveal).mount('#app')
