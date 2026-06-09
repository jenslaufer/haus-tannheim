<script setup>
// Impressum (§ 5 DDG) + Datenschutzerklärung (Art. 13 DSGVO).
// TMG wurde am 14.05.2024 durch das Digitale-Dienste-Gesetz (DDG) abgelöst.
const provider = {
  name: 'Jens Laufer',
  street: 'Hörsteiner Str. 20a',
  city: '63791 Karlstein a. Main',
  // E-Mail ist nach § 5 DDG Pflicht — von Jens noch zu bestätigen, welche Adresse öffentlich genannt wird.
  email: '',
}
</script>

<template>
  <footer class="border-t border-neutral-200 bg-neutral-50">
    <div class="mx-auto max-w-5xl px-4 py-12 text-sm text-neutral-600 sm:px-8">
      <!-- Impressum: leicht erkennbar, unmittelbar erreichbar, ständig verfügbar -->
      <section id="impressum">
        <h2 class="mb-3 font-semibold text-neutral-800">Impressum</h2>
        <p class="mb-2 text-neutral-500">Angaben gemäß § 5 DDG</p>
        <address class="space-y-0.5 not-italic">
          <p>{{ provider.name }}</p>
          <p>{{ provider.street }}</p>
          <p>{{ provider.city }}</p>
        </address>
        <div class="mt-3 space-y-0.5">
          <p>
            <span class="text-neutral-500">E-Mail:</span>
            <template v-if="provider.email">
              <a :href="`mailto:${provider.email}`" class="underline">{{ provider.email }}</a>
            </template>
            <span v-else class="italic text-amber-600"> (Kontakt-E-Mail wird ergänzt)</span>
          </p>
        </div>
        <p class="mt-4 text-neutral-500">
          Privater Verkauf. Es handelt sich nicht um ein gewerbliches Angebot; eine
          Maklerprovision fällt nicht an.
        </p>
      </section>

      <!-- Datenschutzerklärung: ein Klick entfernt, ständig verfügbar -->
      <section id="datenschutz" class="mt-10">
        <details class="group">
          <summary
            class="cursor-pointer list-none font-semibold text-neutral-800 marker:content-none"
          >
            <span class="underline decoration-neutral-300 underline-offset-4">Datenschutzerklärung</span>
            <span class="ml-1 text-neutral-400 group-open:hidden">▸</span>
            <span class="ml-1 hidden text-neutral-400 group-open:inline">▾</span>
          </summary>

          <div class="mt-4 max-w-prose space-y-5 leading-relaxed text-neutral-600">
            <div>
              <h3 class="mb-1 font-semibold text-neutral-700">1. Verantwortlicher</h3>
              <p>
                {{ provider.name }}, {{ provider.street }}, {{ provider.city }}<template v-if="provider.email">, E-Mail: {{ provider.email }}</template>.
              </p>
            </div>

            <div>
              <h3 class="mb-1 font-semibold text-neutral-700">2. Hosting und Server-Logfiles</h3>
              <p>
                Diese Website wird bei GitHub Pages gehostet (GitHub, Inc., 88 Colin P. Kelly Jr.
                Street, San Francisco, CA 94107, USA). Beim Aufruf der Seite werden durch den
                Hosting-Dienstleister automatisch Informationen in Server-Logfiles erfasst, die
                Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, die
                aufgerufene Datei, übertragene Datenmenge, der verwendete Browser nebst Version
                sowie das Betriebssystem. Diese Verarbeitung erfolgt zur sicheren, stabilen und
                technisch fehlerfreien Bereitstellung der Website auf Grundlage unseres
                berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO). Mit der Datenübermittlung
                in die USA ist eine Übermittlung in ein Drittland verbunden; GitHub ist unter dem
                EU-US Data Privacy Framework zertifiziert.
              </p>
            </div>

            <div>
              <h3 class="mb-1 font-semibold text-neutral-700">3. Keine Cookies, kein Tracking</h3>
              <p>
                Diese Website setzt keine Cookies, bindet keine externen Schriftarten oder
                Skripte ein und verwendet keine Analyse-, Tracking- oder Werbedienste. Es findet
                keine über die genannten Server-Logfiles hinausgehende Datenverarbeitung statt.
              </p>
            </div>

            <div>
              <h3 class="mb-1 font-semibold text-neutral-700">4. Kontaktaufnahme</h3>
              <p>
                Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen mitgeteilten
                Angaben ausschließlich zur Bearbeitung Ihrer Anfrage und für den Fall von
                Anschlussfragen (Art. 6 Abs. 1 lit. b und lit. f DSGVO). Diese Daten löschen wir,
                sobald sie für die Erreichung des Zwecks nicht mehr erforderlich sind, sofern
                keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
              </p>
            </div>

            <div>
              <h3 class="mb-1 font-semibold text-neutral-700">5. Ihre Rechte</h3>
              <p>
                Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO),
                Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
                Datenübertragbarkeit (Art. 20 DSGVO) sowie das Recht, der Verarbeitung zu
                widersprechen (Art. 21 DSGVO). Zudem haben Sie das Recht, sich bei einer
                Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).
              </p>
            </div>
          </div>
        </details>
      </section>

      <p class="mt-10 text-xs text-neutral-400">
        © {{ new Date().getFullYear() }} {{ provider.name }}
      </p>
    </div>
  </footer>
</template>
