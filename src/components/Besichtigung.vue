<script setup>
import { onMounted, ref } from 'vue'
import { CAL_ORIGIN, CAL_LINK, captureLead } from '../leads.js'

const calEl = ref(null)

// Official Cal.com embed loader (vanilla snippet, queues calls until embed.js loads).
function loadCalSnippet() {
  ;(function (C, A, L) {
    let p = function (a, ar) {
      a.q.push(ar)
    }
    let d = C.document
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal
        let ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments)
          }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace], ar)
            p(cal, ['initNamespace', namespace])
          } else p(cal, ar)
          return
        }
        p(cal, ar)
      }
  })(window, `${CAL_ORIGIN}/embed/embed.js`, 'init')
}

onMounted(() => {
  loadCalSnippet()
  window.Cal('init', 'besichtigung', { origin: CAL_ORIGIN })
  window.Cal.ns.besichtigung('inline', {
    elementOrSelector: calEl.value,
    calLink: CAL_LINK,
    layout: 'month_view',
  })
  window.Cal.ns.besichtigung('ui', { hideEventTypeDetails: false, layout: 'month_view' })
  // Booked visitors are leads too — mirror them into the marketing segment.
  window.Cal.ns.besichtigung('on', {
    action: 'bookingSuccessful',
    callback: (e) => {
      const att = e?.detail?.data?.booking?.attendees?.[0]
      if (att?.email) captureLead({ email: att.email, name: att.name || '' })
    },
  })
})
</script>

<template>
  <section id="besichtigung" class="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
    <h2 class="mb-6 text-xl font-semibold sm:text-2xl">Besichtigungstermin vereinbaren</h2>
    <p class="mb-6 max-w-prose text-neutral-600">
      Wählen Sie direkt einen passenden Termin für Ihre Besichtigung — Sie erhalten sofort
      eine Bestätigung per E-Mail.
    </p>
    <div ref="calEl" class="min-h-[560px] w-full overflow-hidden rounded border border-neutral-200"></div>
  </section>
</template>
