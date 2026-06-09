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
  'Gas-Zentralheizung aus dem Jahr 2017',
  'Warmwasserbereitung ebenfalls aus 2017',
  'Offener Kamin im Wohnbereich',
  'Ein aktueller Energieausweis befindet sich in Erstellung und liegt spätestens zur Besichtigung vor',
]

const potenzial = [
  'Erweiterung des Wohnbereichs durch einen Wintergarten',
  'Umnutzung der integrierten Garage zu zusätzlichem Wohn- oder Arbeitsraum',
  'Neubau von zwei separaten Garagen oder Carports auf dem Grundstück',
]
</script>

<template>
  <section id="beschreibung" class="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
    <h2 class="mb-6 text-xl font-semibold sm:text-2xl">Objektbeschreibung</h2>

    <div class="max-w-prose space-y-4 text-neutral-600">
      <p>
        Zeitlose Architektur, großzügige Fensterflächen und die unmittelbare Nähe zur Natur
        verleihen diesem außergewöhnlichen Architektenhaus aus den 1960er-Jahren seinen
        unverwechselbaren Charakter. In ruhiger Waldrandlage und mit herrlichem Blick über die
        umliegende Landschaft bietet die Immobilie ein Wohngefühl, das heute gefragter ist denn
        je: lichtdurchflutet, offen und naturnah.
      </p>
      <p>
        Die klare Formensprache des Mid-Century-Stils, fließende Raumübergänge und die
        harmonische Einbindung in das großzügige Grundstück schaffen eine besondere Atmosphäre.
        Das Haus präsentiert sich als idealer Rückzugsort für Paare, kleine Familien oder
        Menschen, die Wohnen und Arbeiten unter einem Dach verbinden möchten.
      </p>
    </div>

    <h3 class="mt-12 mb-2 text-lg font-semibold">Erdgeschoss – Wohnen im Einklang mit der Natur</h3>
    <p class="max-w-prose text-neutral-600">
      Durch die Einbettung in den sanften Hang öffnet sich die Wohnebene unmittelbar zum Garten.
      Das Herzstück des Hauses bildet der offen gestaltete Wohn- und Essbereich, der die
      Architektur der 1960er-Jahre in ihrer schönsten Form widerspiegelt.
    </p>
    <ul class="mt-4 max-w-prose list-disc space-y-2 pl-5 text-neutral-600">
      <li v-for="point in erdgeschoss" :key="point">{{ point }}</li>
    </ul>
    <p class="mt-4 max-w-prose text-neutral-600">
      Die Verbindung von Innen- und Außenraum schafft ein Wohngefühl, das jede Jahreszeit
      erlebbar macht.
    </p>

    <h3 class="mt-12 mb-2 text-lg font-semibold">Obergeschoss – Rückzug mit Aussicht</h3>
    <p class="max-w-prose text-neutral-600">
      Auf der straßenseitigen Ebene befindet sich der private Bereich des Hauses.
    </p>
    <ul class="mt-4 max-w-prose list-disc space-y-2 pl-5 text-neutral-600">
      <li v-for="point in obergeschoss" :key="point">{{ point }}</li>
    </ul>

    <h3 class="mt-12 mb-2 text-lg font-semibold">Grundstück &amp; Außenbereich</h3>
    <div class="max-w-prose space-y-4 text-neutral-600">
      <p>
        Das großzügige Grundstück ist von gewachsenem Baumbestand geprägt und vermittelt eine
        seltene Atmosphäre von Ruhe und Privatsphäre. Die blickgeschützte Südwest-Terrasse lädt
        dazu ein, sonnige Nachmittage und lange Sommerabende in entspannter Umgebung zu genießen.
      </p>
      <p>
        Hier finden Gartenliebhaber, Naturliebhaber und Familien gleichermaßen Raum zur
        Entfaltung.
      </p>
    </div>

    <h3 class="mt-12 mb-2 text-lg font-semibold">Lage</h3>
    <div class="max-w-prose space-y-4 text-neutral-600">
      <p>
        Die Immobilie befindet sich in begehrter Aussichtslage am Rande der Schwarzwaldmetropole
        Villingen-Schwenningen. Die Kombination aus naturnahem Wohnen und guter Erreichbarkeit
        macht diesen Standort besonders attraktiv.
      </p>
      <p>
        Sie genießen die Ruhe einer gewachsenen Wohnlage mit unmittelbarer Nähe zu Wald und
        Wiesen und profitieren zugleich von den Vorzügen einer leistungsfähigen Infrastruktur.
        Einkaufsmöglichkeiten, medizinische Versorgung, Schulen, kulturelle Angebote sowie
        zahlreiche Freizeitmöglichkeiten sind mit Bus und eigenem Fahrzeug in zehn bis zwanzig
        Minuten bequem erreichbar.
      </p>
    </div>

    <h3 class="mt-12 mb-2 text-lg font-semibold">Energie &amp; Technik</h3>
    <ul class="mt-2 max-w-prose list-disc space-y-2 pl-5 text-neutral-600">
      <li v-for="point in energie" :key="point">{{ point }}</li>
    </ul>

    <h3 class="mt-12 mb-2 text-lg font-semibold">Zustand &amp; Entwicklungspotenzial</h3>
    <p class="max-w-prose text-neutral-600">
      Die Immobilie befindet sich in geräumtem und gereinigtem Zustand. Gleichzeitig bietet sie
      die Gelegenheit, eigene Wohnideen zu verwirklichen und den besonderen Charakter des Hauses
      behutsam weiterzuentwickeln. Denkbar sind beispielsweise:
    </p>
    <ul class="mt-4 max-w-prose list-disc space-y-2 pl-5 text-neutral-600">
      <li v-for="point in potenzial" :key="point">{{ point }}</li>
    </ul>
    <p class="mt-4 max-w-prose text-neutral-600">
      Auch für Investoren eröffnet sich eine interessante Perspektive: In der direkten Umgebung
      prägen überwiegend größere Zwei- und Dreifamilienhäuser das Ortsbild. Vorbehaltlich der
      Genehmigung durch die zuständigen Behörden erscheint daher auch eine Neubebauung des
      Grundstücks im Rahmen der geltenden Bauvorschriften grundsätzlich denkbar.
    </p>

    <div class="mt-12 max-w-prose space-y-4 text-neutral-600">
      <h3 class="text-lg font-semibold text-neutral-900">Haben wir Ihr Interesse geweckt?</h3>
      <p>
        Architektenhäuser dieser Epoche mit authentischem Mid-Century-Charakter, großzügigen
        Fensterflächen und einer derart reizvollen Aussichtslage sind heute nur selten am Markt
        verfügbar. Überzeugen Sie sich selbst von der besonderen Atmosphäre, den vielfältigen
        Gestaltungsmöglichkeiten und der außergewöhnlichen Lage dieser Immobilie.
      </p>
      <p>
        Gerne stehen wir Ihnen für weitere Informationen oder die Vereinbarung eines
        persönlichen Besichtigungstermins zur Verfügung. Wir freuen uns auf Ihre Anfrage.
      </p>
    </div>
  </section>
</template>
