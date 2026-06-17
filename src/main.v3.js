import { createApp } from 'vue'

// Entry for the justified-gallery page (index3.html): same app, mounted in the
// 'v3' variant. The hero, facts and copy match the live page; only the gallery
// changes — flush Google-Photos-style rows where every photo keeps its true
// aspect ratio, so no shot is cropped. Kept for comparison against index.html.
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/hanken-grotesk/wght.css'

import './style.css'
import App from './App.vue'
import { reveal } from './reveal.js'

createApp(App, { variant: 'v3' }).directive('reveal', reveal).mount('#app')
