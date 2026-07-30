<script setup>
const erdgeschoss = [
  'Großzügiger Wohn- und Essbereich mit fließenden Übergängen',
  'Bodentiefe Fensterflächen sorgen für außergewöhnlich helle Räume und eröffnen reizvolle Ausblicke ins Grüne',
  'Direkter stufenloser Zugang zur sonnigen Südwest-Terrasse',
  'Offener Kamin für behagliche Stunden und zusätzliche Wärme an kühleren Tagen',
]

const obergeschoss = [
  'Drei helle und vielseitig nutzbare Zimmer, ideal als Schlaf-, Kinder-, Gäste- oder Arbeitszimmer',
  'Balkon mit reizvollem Blick über das Wiesental, einen traditionellen Schwarzwaldhof und das idyllisch gelegene Freibad des Ortes',
  'Tageslichtbad sowie separates WC',
  'Integrierte Garage mit direktem Zugang ins Haus',
]

const energie = [
  'Gas-Brennwertheizung (Brötje, 15 kW) aus dem Jahr 2017',
  'Warmwasserbereitung ebenfalls aus 2017',
  'Offener Kamin im Wohnbereich',
  'Energieausweis (Bedarfsausweis) liegt vor — Pflichtangaben siehe unten',
]

const pflichtangaben = [
  { label: 'Art des Energieausweises', value: 'Bedarfsausweis' },
  { label: 'Endenergiebedarf', value: '631,2 kWh/(m²·a)' },
  { label: 'Wesentliche Energieträger', value: 'Erdgas, Brennholz' },
  { label: 'Baujahr (laut Ausweis)', value: '1965' },
  { label: 'Energieeffizienzklasse', value: 'H' },
  { label: 'Ausgestellt / gültig bis', value: '16.06.2026 – 15.06.2036' },
]

const einordnung = [
  {
    titel: 'Ein Rechenwert, kein gemessener Verbrauch',
    text: 'Der ausgewiesene Endenergiebedarf stammt aus einem Bedarfsausweis. Er wird nach genormten Annahmen zu Klima und Nutzerverhalten berechnet und nicht am tatsächlichen Verbrauch gemessen. Für die Einschätzung Ihrer künftigen Heizkosten ist er deshalb ein Anhaltspunkt und keine Abrechnung.',
  },
  {
    titel: 'Kein gesetzlicher Zwang zum Heizungstausch',
    text: 'Die Gas-Brennwertheizung stammt aus dem Jahr 2017. Seit dem 29. Juli 2026 gilt das Gebäudemodernisierungsgesetz. Die frühere Pflicht, neu eingebaute Heizungen zu 65 Prozent mit erneuerbaren Energien zu betreiben, ist entfallen, ebenso das Betriebsverbot für alte Heizkessel. Für künftig neu eingebaute fossile Heizungen steigt schrittweise eine Quote für erneuerbare Brennstoffe; das wirkt über den Brennstoffpreis und nicht als Austauschpflicht.',
  },
  {
    titel: 'Vorgeschrieben ist eine einzige Maßnahme',
    text: 'Bestehen bleibt die Nachrüstpflicht für die oberste Geschossdecke: Sie muss einen Wärmedurchgangskoeffizienten von 0,24 W/(m²·K) einhalten, erfüllbar auch durch eine entsprechende Dachdämmung. Überschlägig geschätzt liegt das je nach Ausführung bei etwa 1.400 bis 3.800 Euro. Ein Handwerkerangebot liegt dazu nicht vor, die Spanne ist eine Schätzung.',
  },
]

const potenzial = [
  'Erweiterung des Wohnbereichs durch einen Wintergarten',
  'Umnutzung der integrierten Garage zu zusätzlichem Wohn- oder Arbeitsraum',
  'Neubau von zwei separaten Garagen oder Carports auf dem Grundstück',
]
</script>

<template>
  <section id="beschreibung" class="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-32">
    <!-- Intro: editorial lede -->
    <div class="grid gap-x-16 gap-y-10 lg:grid-cols-12">
      <div class="lg:col-span-4" v-reveal>
        <p class="kicker text-clay-600">Objektbeschreibung</p>
        <h2 class="font-display mt-6 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-forest-900">
          Wohnen im Einklang mit der Natur.
        </h2>
      </div>
      <div class="space-y-6 text-lg leading-relaxed text-ink-soft lg:col-span-7 lg:col-start-6" v-reveal="100">
        <p class="text-pretty">
          Zeitlose Architektur, großzügige Fensterflächen und die unmittelbare Nähe zur Natur
          verleihen diesem außergewöhnlichen Architektenhaus aus den 1960er-Jahren seinen
          unverwechselbaren Charakter. In ruhiger Waldrandlage und mit herrlichem Blick über die
          umliegende Landschaft bietet die Immobilie ein Wohngefühl, das heute gefragter ist denn
          je: lichtdurchflutet, offen und naturnah.
        </p>
        <p class="text-pretty">
          Die klare Formensprache des Mid-Century-Stils, fließende Raumübergänge und die
          harmonische Einbindung in das großzügige Grundstück schaffen eine besondere Atmosphäre.
          Das Haus präsentiert sich als idealer Rückzugsort für Paare, kleine Familien oder
          Menschen, die Wohnen und Arbeiten unter einem Dach verbinden möchten.
        </p>
      </div>
    </div>

    <!-- Detail blocks: label / content split -->
    <div class="mt-20 space-y-px lg:mt-28">
      <!-- Erdgeschoss -->
      <article class="grid gap-x-16 gap-y-6 border-t border-stone-200 py-12 lg:grid-cols-12" v-reveal>
        <header class="lg:col-span-4">
          <p class="kicker text-stone-500">01 — Erdgeschoss</p>
          <h3 class="font-display mt-3 text-2xl font-semibold tracking-tight text-forest-900 sm:text-3xl">
            Wohnen im Einklang mit der Natur
          </h3>
        </header>
        <div class="lg:col-span-7 lg:col-start-6">
          <p class="text-lg leading-relaxed text-ink-soft text-pretty">
            Durch die Einbettung in den sanften Hang öffnet sich die Wohnebene unmittelbar zum
            Garten. Das Herzstück des Hauses bildet der offen gestaltete Wohn- und Essbereich,
            der die Architektur der 1960er-Jahre in ihrer schönsten Form widerspiegelt.
          </p>
          <ul class="mt-6 space-y-3">
            <li v-for="point in erdgeschoss" :key="point" class="flex gap-3 text-ink-soft">
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
              <span class="leading-relaxed">{{ point }}</span>
            </li>
          </ul>
          <p class="mt-6 leading-relaxed text-ink-soft">
            Die Verbindung von Innen- und Außenraum schafft ein Wohngefühl, das jede Jahreszeit
            erlebbar macht.
          </p>
        </div>
      </article>

      <!-- Obergeschoss -->
      <article class="grid gap-x-16 gap-y-6 border-t border-stone-200 py-12 lg:grid-cols-12" v-reveal>
        <header class="lg:col-span-4">
          <p class="kicker text-stone-500">02 — Obergeschoss</p>
          <h3 class="font-display mt-3 text-2xl font-semibold tracking-tight text-forest-900 sm:text-3xl">
            Rückzug mit Aussicht
          </h3>
        </header>
        <div class="lg:col-span-7 lg:col-start-6">
          <p class="text-lg leading-relaxed text-ink-soft">
            Auf der straßenseitigen Ebene befindet sich der private Bereich des Hauses.
          </p>
          <ul class="mt-6 space-y-3">
            <li v-for="point in obergeschoss" :key="point" class="flex gap-3 text-ink-soft">
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
              <span class="leading-relaxed">{{ point }}</span>
            </li>
          </ul>
        </div>
      </article>

      <!-- Grundstück -->
      <article class="grid gap-x-16 gap-y-6 border-t border-stone-200 py-12 lg:grid-cols-12" v-reveal>
        <header class="lg:col-span-4">
          <p class="kicker text-stone-500">03 — Grundstück</p>
          <h3 class="font-display mt-3 text-2xl font-semibold tracking-tight text-forest-900 sm:text-3xl">
            Garten &amp; Außenbereich
          </h3>
        </header>
        <div class="space-y-6 text-lg leading-relaxed text-ink-soft lg:col-span-7 lg:col-start-6">
          <p class="text-pretty">
            Das großzügige Grundstück ist von gewachsenem Baumbestand geprägt und vermittelt eine
            seltene Atmosphäre von Ruhe und Privatsphäre. Die blickgeschützte Südwest-Terrasse
            lädt dazu ein, sonnige Nachmittage und lange Sommerabende in entspannter Umgebung zu
            genießen.
          </p>
          <p>Hier finden Gartenliebhaber, Naturliebhaber und Familien gleichermaßen Raum zur Entfaltung.</p>
          <p class="text-pretty">
            Das Grundstück umfasst 804 m² als ein zusammenhängendes Flurstück und ist frei von
            Rechten Dritter — Abteilung II des Grundbuchs weist keine Eintragungen auf (keine Wege-,
            Wohn- oder Nießbrauchrechte). Die Übergabe erfolgt lastenfrei.
          </p>
        </div>
      </article>

      <!-- Lage -->
      <article class="grid gap-x-16 gap-y-6 border-t border-stone-200 py-12 lg:grid-cols-12" v-reveal>
        <header class="lg:col-span-4">
          <p class="kicker text-stone-500">04 — Lage</p>
          <h3 class="font-display mt-3 text-2xl font-semibold tracking-tight text-forest-900 sm:text-3xl">
            Am Rand der Schwarzwaldmetropole
          </h3>
        </header>
        <div class="space-y-6 text-lg leading-relaxed text-ink-soft lg:col-span-7 lg:col-start-6">
          <p class="text-pretty">
            Die Immobilie befindet sich in begehrter Aussichtslage im Stadtbezirk Tannheim, am
            Rande der Schwarzwaldmetropole Villingen-Schwenningen. Die Kombination aus naturnahem
            Wohnen und guter Erreichbarkeit macht diesen Standort besonders attraktiv.
          </p>
          <p class="text-pretty">
            Die Lage zeichnet sich durch ihren hohen Erholungswert aus: Als ehemaliger
            Höhenluftkurort bietet der Ort ein besonders angenehmes und gesundheitsförderndes
            Klima. Aufgrund dieser außergewöhnlichen Lebens- und Aufenthaltsqualität ist der Ort
            auch Standort einer renommierten Nachsorgeklinik für Kinder mit lebensbedrohlichen
            Erkrankungen und ihre Familien.
          </p>
          <p class="text-pretty">
            Sie genießen die Ruhe einer gewachsenen Wohnlage mit unmittelbarer Nähe zu Wald und
            Wiesen und profitieren zugleich von den Vorzügen einer leistungsfähigen Infrastruktur.
            Einkaufsmöglichkeiten, medizinische Versorgung, Schulen, kulturelle Angebote sowie
            zahlreiche Freizeitmöglichkeiten sind mit Bus und eigenem Fahrzeug in zehn bis zwanzig
            Minuten bequem erreichbar.
          </p>
        </div>
      </article>

      <!-- Energie & Technik -->
      <article class="grid gap-x-16 gap-y-6 border-t border-stone-200 py-12 lg:grid-cols-12" v-reveal>
        <header class="lg:col-span-4">
          <p class="kicker text-stone-500">05 — Energie &amp; Technik</p>
          <h3 class="font-display mt-3 text-2xl font-semibold tracking-tight text-forest-900 sm:text-3xl">
            Verlässliche Basis
          </h3>
        </header>
        <div class="lg:col-span-7 lg:col-start-6">
          <ul class="space-y-3">
            <li v-for="point in energie" :key="point" class="flex gap-3 text-lg text-ink-soft">
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
              <span class="leading-relaxed">{{ point }}</span>
            </li>
          </ul>
          <div class="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <p class="kicker text-stone-500">Pflichtangaben aus dem Energieausweis</p>
            <dl class="mt-4 space-y-2 text-sm sm:text-base">
              <div
                v-for="p in pflichtangaben"
                :key="p.label"
                class="flex items-baseline justify-between gap-6 border-b border-stone-200/70 pb-2"
              >
                <dt class="text-ink-soft">{{ p.label }}</dt>
                <dd class="text-right font-medium text-forest-900">{{ p.value }}</dd>
              </div>
            </dl>
          </div>
          <div class="mt-6 border-l-2 border-clay-500 pl-6">
            <p class="kicker text-stone-500">Was diese Zahlen bedeuten</p>
            <div class="mt-4 space-y-5">
              <div v-for="punkt in einordnung" :key="punkt.titel">
                <p class="font-medium text-forest-900">{{ punkt.titel }}</p>
                <p class="mt-1.5 text-pretty leading-relaxed text-ink-soft">{{ punkt.text }}</p>
              </div>
            </div>
            <p class="mt-5 text-sm text-stone-500">
              Angaben zum Rechtsstand vom 30. Juli 2026. Keine Rechts- oder Energieberatung,
              maßgeblich sind der Energieausweis und die gesetzlichen Vorschriften.
            </p>
          </div>
        </div>
      </article>

      <!-- Potenzial -->
      <article class="grid gap-x-16 gap-y-6 border-t border-stone-200 py-12 lg:grid-cols-12" v-reveal>
        <header class="lg:col-span-4">
          <p class="kicker text-stone-500">06 — Potenzial</p>
          <h3 class="font-display mt-3 text-2xl font-semibold tracking-tight text-forest-900 sm:text-3xl">
            Zustand &amp; Entwicklung
          </h3>
        </header>
        <div class="space-y-6 text-lg leading-relaxed text-ink-soft lg:col-span-7 lg:col-start-6">
          <p class="text-pretty">
            Die Immobilie befindet sich in geräumtem und gereinigtem Zustand. Gleichzeitig bietet
            sie die Gelegenheit, eigene Wohnideen zu verwirklichen und den besonderen Charakter des
            Hauses behutsam weiterzuentwickeln. Denkbar sind beispielsweise:
          </p>
          <ul class="space-y-3">
            <li v-for="point in potenzial" :key="point" class="flex gap-3 text-ink-soft">
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
              <span class="leading-relaxed">{{ point }}</span>
            </li>
          </ul>
          <p class="text-pretty">
            Auch für Investoren eröffnet sich eine interessante Perspektive: In der direkten
            Umgebung prägen überwiegend größere Zwei- und Dreifamilienhäuser das Ortsbild.
            Vorbehaltlich der Genehmigung durch die zuständigen Behörden erscheint daher auch eine
            Neubebauung des Grundstücks im Rahmen der geltenden Bauvorschriften grundsätzlich
            denkbar.
          </p>
        </div>
      </article>
    </div>

    <!-- Closing pull-quote -->
    <figure class="mt-20 border-l-2 border-clay-500 pl-8 lg:mt-28 lg:pl-12" v-reveal>
      <blockquote class="font-display max-w-3xl text-2xl font-medium italic leading-snug tracking-tight text-forest-900 sm:text-3xl">
        „Architektenhäuser dieser Epoche mit authentischem Mid-Century-Charakter, großzügigen
        Fensterflächen und einer derart reizvollen Aussichtslage sind heute nur selten am Markt
        verfügbar.“
      </blockquote>
      <figcaption class="mt-6 max-w-xl leading-relaxed text-ink-soft">
        Überzeugen Sie sich selbst von der besonderen Atmosphäre, den vielfältigen
        Gestaltungsmöglichkeiten und der außergewöhnlichen Lage. Gerne stehen wir Ihnen für
        weitere Informationen oder die Vereinbarung eines persönlichen Besichtigungstermins zur
        Verfügung. Wir freuen uns auf Ihre Anfrage.
      </figcaption>
    </figure>
  </section>
</template>
