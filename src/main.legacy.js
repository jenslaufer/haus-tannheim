import { createApp } from 'vue'

// Entry for the legacy page (index2.html): same app, mounted in 'legacy'
// variant — original gallery order + cover, kept for old-vs-new comparison.
// Shares all image assets with the new page via the same source imports.
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/hanken-grotesk/wght.css'

import './style.css'
import App from './App.vue'
import { reveal } from './reveal.js'

createApp(App, { variant: 'legacy' }).directive('reveal', reveal).mount('#app')
