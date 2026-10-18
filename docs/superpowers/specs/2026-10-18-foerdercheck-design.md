# Fördercheck für haus-tannheim.de – Design

**Stand:** 18.10.2026 · **Status:** Entwurf zur Freigabe durch Jens

Herkunft der Entscheidungen:
- **[Jens]**: von Jens im Gespräch entschieden.
- **[Claude]**: Entscheidung von Claude, von Jens noch nicht ausdrücklich bestätigt.

## 1. Absicht und Warum

Viele Kaufinteressenten scheuen die Sanierungskosten eines älteren Hauses. [Jens]

Der Fördercheck soll diese Angst in eine konkrete Rechnung verwandeln: Für *dieses* Haus und *Ihre* Situation gibt es diese Förderprogramme zu diesen Zinsen, und so sieht Ihre Monatsrate aus.

Die Energieklasse H wird dabei vom Warnsignal zum Argument:
- Sie erfüllt die Objektbedingung von KfW 308 „Jung kauft Alt“ (Kredit ab 1 %).
- Ab 2027 zählt das Haus als „Worst Performing Building“ und bekommt damit höhere Sanierungsboni.

**Zielgruppe:** alle Kaufinteressenten, nicht nur Familien. [Jens]
- **Familien mit Kindern unter 18** profitieren am stärksten (KfW 308).
- **Paare und Singles** bekommen die Sanierungsförderung und den Steuerabzug.
- **Kapitalanleger** bekommen fast nichts. Der Check sagt ihnen das ehrlich.

**Erfolg:** Mehr Anfragen nach Unterlagen und mehr Besichtigungstermine. Interessenten kommen mit einer realistischen Finanzierungsidee zur Besichtigung. [Jens bestätigt]

## 2. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**
1. Höchstens 8 kurze Fragen. Danach sofort ein Ergebnis mit passenden Programmen, Beträgen, Zinsen und Monatsrate. [Jens: Zins und Rate]
2. Das Ergebnis ist ohne E-Mail sichtbar. [Jens]
3. Unter dem Ergebnis stehen drei nächste Schritte:
   - Unterlagen anfordern (bestehendes Formular),
   - Besichtigung buchen,
   - Ergebnis drucken bzw. als PDF speichern.
4. Die Pflichten der Programme stehen deutlich da:
   - Antrag *vor* dem Notartermin,
   - Sanierungspflicht innerhalb von 54 Monaten bei KfW 308,
   - Auflassungsvormerkung vor dem Heizungsantrag.
5. Ein sichtbares Stand-Datum und ein klarer Hinweis „Orientierung, keine Förder- oder Finanzberatung“.

**Nicht-Ziele**
- Kein Backend und keine Speicherung. Eingaben verlassen den Browser nicht. [Jens: ohne Backend]
- Kein Versand des Ergebnisses per E-Mail. Der Lead-Dienst kann keine individuellen Inhalte senden. [Claude, von Jens bestätigt]
- Keine Kostenschätzung für die Sanierung. Der Besucher trägt seine eigene Schätzung ein. Das Feld startet leer, weil sich die Kosten bei diesem Zustand nicht seriös abschätzen lassen. [Jens]
- Kein allgemeiner Fördercheck für beliebige Immobilien. Die Objektdaten sind fest.
- Landesprogramme werden nicht berechnet, nur als Hinweis gezeigt (siehe 5.5).

**Anti-Ziele** (das Werkzeug wäre gescheitert, auch wenn es technisch funktioniert)
- **Es verspricht zu viel.** Ein Kredit klingt wie ein Zuschuss, oder eine Förderung erscheint, die der Besucher nicht bekommt.
- **Es beschönigt den Zustand.** Das Haus hat umfassenden Sanierungsbedarf, und das wird so gesagt. [Jens]
- **Es zeigt veraltete Zahlen ohne Datum.**
- **Es gibt private Daten preis.** Straße, Telefonnummer, Namen von Interessenten und die Preisverhandlung aus dem privaten Repo dürfen nicht auf die Seite.

## 3. Rahmenbedingungen

- **Technik:** bestehende Seite mit Vue 3 (`<script setup>`), Tailwind v4 und Design-Tokens aus `src/style.css` (forest/stone/clay/ink, `kicker`, `font-display`). Keine neuen Laufzeit-Abhängigkeiten. Veröffentlichung über den vorhandenen GitHub-Pages-Workflow. [Claude]
- **Sprache:** Deutsch mit „Sie“-Anrede, wie im Rest der Seite.
- **Regeln aus dem README/CLAUDE.md:**
  - Die Arrays in `Facts.vue` und `Description.vue` nicht umbauen; `expose-pdf.py` im privaten Repo parst sie.
  - Keine Adresse und keine Telefonnummer auf der Seite.
- **Bestehende Testregel:** Jede Sackgasse muss zu einem Menschen führen. Neben dem Buchungslink wird immer auch `CONTACT_EMAIL` angeboten. Das gilt auch hier.
- **Entwicklung:** Tests zuerst (Vitest + @vue/test-utils, wie vorhanden).
- **Fachgrundlage:**
  - `~/repos/foerderprogramme-hauskauf/` (geprüft am 18.10.2026)
  - die Förderanalysen im privaten Verkaufsordner

  Beide sind private Quellen, ihr Inhalt wird nur auszugsweise in Regeln übersetzt.

## 4. Platzierung und Ablauf

- **Platzierung:** neuer Abschnitt `#foerdercheck` zwischen Galerie und Unterlagen-Formular. In `App.vue` ist das zwischen `<Gallery>` und `<LeadForm>`. Dazu ein Menüeintrag „Fördercheck“ vor „Kontakt“. [Claude, von Jens bestätigt]
- **Einstieg:** Überschrift im Ton der Seite, etwa „Was kostet Sie das Haus wirklich?“. Darunter ein Satz, der die Klasse H als Fördervorteil erklärt, und ein Startknopf.
- **Ablauf:** Quiz mit einer Frage pro Schritt, Fortschrittsanzeige und Zurück-Knopf, mobil zuerst gedacht. [Claude] Die genaue Gestaltung entscheidet der Builder.
- **Ergebnis:** Es erscheint im selben Abschnitt. „Neu starten“ setzt alles zurück.

## 5. Inhalt

### 5.1 Fragen

| # | Frage | Eingabe | Wofür |
|---|---|---|---|
| 1 | Wollen Sie selbst einziehen? | Ja / Nein, vermieten oder anlegen | Fast alle Programme verlangen Selbstnutzung. Bei „Nein“ wird verkürzt (siehe 5.4). |
| 2 | Wie viele Kinder unter 18 leben in Ihrem Haushalt? | 0 / 1 / 2 / 3 / 4 / 5+ | KfW 308 (Berechtigung, Betrag, Einkommensgrenze); Familienzuschlag bei KfW 458 |
| 3 | Besitzen Sie Wohneigentum in Deutschland, auch einen Anteil oder ein Erbteil? | Ja / Nein | Schließt KfW 308 aus |
| 4 | Ihr zu versteuerndes Haushaltseinkommen (Schnitt der Steuerbescheide 2023 und 2024) | Zahl in €, mit Erklärung „steht im Steuerbescheid, nicht Brutto“; Option „weiß ich nicht“ | Einkommensgrenzen |
| 5 | Kaufpreis, mit dem Sie rechnen | Zahl in €, vorbelegt mit dem Angebotspreis | Finanzierungsbedarf |
| 6 | Ihr Eigenkapital | Zahl in € | Finanzierungsbedarf |
| 7 | Geschätzte Sanierungskosten | zwei optionale Felder, **leer vorbelegt**: (a) Heizung, z. B. Wärmepumpe; (b) Gebäudehülle: Fenster, Fassade, Dach bzw. oberste Geschossdecke. Daneben „weiß ich noch nicht“. [Jens: Schätzung des Besuchers; Claude: Aufteilung in zwei Felder, weil die Förderung je Bereich anders rechnet] | Zuschüsse und Sanierungsfinanzierung |

**Antwort „weiß ich nicht“ beim Einkommen** [Claude]:
- **Zwei Finanzierungsszenarien nebeneinander:**
  - „Falls Ihr zvE ≤ X“: mit KfW 308, Sanierung über KfW 358, falls X ≤ 90.000 €.
  - „Falls darüber“: ohne KfW 308, Sanierung über das Bankdarlehen.
- **Einkommensbonus KfW 458:** wird in keinem der beiden Szenarien eingerechnet. Er erscheint nur als Hinweis: „+10 bis +40 Prozentpunkte bei niedrigem Einkommen“.
- **Grundsatz:** Bei unbekanntem Einkommen wird kein einkommensabhängiger Zuschuss in eine Summe gerechnet.

**Angebotspreis:** Er liegt als Konstante in der Datendatei des Fördercheck und wird von Hand mit `Facts.vue` abgeglichen. Er wird *nicht* aus `Facts.vue` importiert, damit dessen Struktur unangetastet bleibt. [Claude]

### 5.2 Feste Objektdaten (in der Datendatei)

| Merkmal | Wert |
|---|---|
| Gebäudeart | Einfamilienhaus, 1 Wohneinheit |
| Baujahr | 1965 |
| Bundesland | Baden-Württemberg; Grunderwerbsteuer 5,0 % |
| Energieausweis | Klasse H (Bedarfsausweis, gültig bis 15.06.2036) |
| Heizung | Gas-Brennwert, Baujahr 2017. Der Klimageschwindigkeitsbonus entfällt, weil der Gaskessel jünger als 20 Jahre ist. |
| Kaufnebenkosten | Notar und Grundbuch pauschal 2 %, keine Maklerprovision |

### 5.3 Rechenregeln

Alle Zinsen, Beträge und Grenzen stehen mit `stand` und Quellen-URL in **einer** Datendatei. Die Logik ist eine reine Funktion `evaluate(eingaben, heute)`, getrennt von der Oberfläche und vollständig testbar.

1. **Kaufnebenkosten:** 5,0 % Grunderwerbsteuer + 2 % Notar und Grundbuch auf den Kaufpreis.
2. **KfW 308 „Jung kauft Alt“**
   - **Berechtigt, wenn alle Bedingungen erfüllt sind:**
     - Selbstnutzung,
     - mindestens 1 Kind unter 18,
     - kein Wohneigentum,
     - zvE ≤ 90.000 € + 10.000 € je weiteres Kind.
   - **Betrag:** 140.000 € (1 Kind), 160.000 € (2 Kinder), 180.000 € (ab 3 Kindern), höchstens der Kaufpreis. Nebenkosten finanziert das Programm nicht.
   - **Zins:** 1,00 % effektiv bei 35 Jahren Laufzeit und 10 Jahren Zinsbindung (Stand 18.10.2026).
   - **Rate:** Annuität über 35 Jahre, ohne tilgungsfreie Jahre. [Claude: Vereinfachung. Der Hinweis „tilgungsfreie Anlaufjahre möglich“ steht im Ergebnis.]
   - **Pflichten im Ergebnis:**
     - Antrag über die Bank *vor* dem Notartermin.
     - Sanierung innerhalb von 54 Monaten: auf Effizienzhaus 85 EE oder alle vier Einzelmaßnahmen (Heizung mit mindestens 65 % erneuerbaren Energien, Fenster, Fassade, Dach bzw. oberste Geschossdecke).
     - Bei Verfehlen steigt der Zins um 1 Prozentpunkt.
     - Fehlende Sanierungskosten werden dann als „notwendig, Höhe unbekannt“ markiert.
3. **Zuschuss Heizung (KfW 458)**, nur bei Selbstnutzung und Angabe (7a):
   - Grundförderung 30 %.
   - Einkommensbonus 40 % / 30 % / 10 % bei zvE bis 30.000 € / 40.000 € / 50.000 €. Ist mindestens ein Kind unter 18 im Haushalt, wird das zvE vorher um 10.000 € gemindert.
   - Insgesamt höchstens 70 %.
   - Förderfähige Kosten höchstens 28.000 €. Ab 01.02.2027 sinkt die Grenze jedes Halbjahr um 750 €, bis 22.000 € ab 01.08.2030. Sie wird nach dem Datum `heute` berechnet.
   - Hinweis im Ergebnis: Antrag erst mit eingetragener Auflassungsvormerkung und nach Einzug. Der Zuschuss wird erst nach der Maßnahme ausgezahlt.
4. **Zuschuss Gebäudehülle (BAFA BEG EM)**, bei Angabe (7b):
   - 15 % auf höchstens 30.000 € förderfähige Kosten.
   - Hinweis: Mit Sanierungsfahrplan (iSFP) gibt es +5 Prozentpunkte auf den Teil über 30.000 €, bis 60.000 €. Ab 2027 kommt für „Worst Performing Buildings“ ein weiterer Bonus hinzu. Dieser Hinweis wird nicht eingerechnet. [Claude]
   - Alternativ ist der Steuerabzug nach § 35c EStG möglich (20 % über 3 Jahre). Er wird als Hinweis genannt, weil er nicht mit dem Zuschuss kombinierbar ist.
5. **Finanzierung der Sanierung:**
   - Gefördert wird der Anteil nach Abzug der Zuschüsse. Die Vorfinanzierung bis zur Auszahlung wird erwähnt.
   - Ist das zvE ≤ 90.000 €, läuft er über KfW 358 zum Zins aus der Datendatei, sonst über das Bankdarlehen.
6. **Bankdarlehen** für den Rest: Kaufpreis + Nebenkosten + Sanierung − Eigenkapital − Förderkredite − Zuschüsse.
   - Zins als Annahme in der Datendatei, mit Datum und Quelle.
   - Rate als Annuität mit 2 % anfänglicher Tilgung. [Claude]
7. **Ergebniszahlen:**
   - je Baustein: Betrag, Zins, Monatsrate,
   - Gesamtrate,
   - Zinsvorteil der Förderkredite,
   - Zuschüsse gesamt, getrennt von den Krediten. Sie werden nicht als „Ersparnis“ gezählt.

   **Zinsvorteil der Förderkredite** [Claude, bewusst konservativ]: Jeder Förderkredit (KfW 308, KfW 358) wird mit einem Bankdarlehen in gleicher Höhe und **gleicher Laufzeit** zum Marktzins verglichen. Gezeigt wird die Differenz der Monatsraten, beschriftet mit „günstiger als ein Bankkredit gleicher Laufzeit“. Unterschiedliche Laufzeiten werden nie verglichen.
8. **Sanierungskosten unbekannt** (Felder leer), egal ob mit oder ohne KfW 308 [Claude]:
   - Die Gesamtrate heißt dann ausdrücklich „Rate ohne Sanierung“.
   - Darunter steht immer eine eigene Zeile: „Sanierung: umfassend nötig, Kosten offen“, mit den möglichen Zuschüssen in Prozent und den Höchstbeträgen.
   - Eine niedrige Rate darf nie ohne diesen Hinweis stehen (Anti-Ziel „beschönigt den Zustand“).

### 5.4 Sonderfälle

- **Kein Einzug geplant (Kapitalanleger):**
  - Ehrliche Kurzantwort: Die Förderprogramme für Wohneigentum setzen Selbstnutzung voraus.
  - Es bleiben nur die Sanierungsförderung für Vermieter und die steuerliche Abschreibung. Beides wird nicht berechnet.
  - Danach folgen die nächsten Schritte.
- **Wohneigentum vorhanden, keine Kinder oder Einkommen über der Grenze:** Statt KfW 308 rechnet der Check nur mit dem Bankdarlehen. Der Grund steht dabei, zum Beispiel „KfW 308 setzt ein Kind unter 18 voraus“.
- **Eigenkapital deckt nicht einmal die Nebenkosten:** Hinweis, dass Banken das meist verlangen. Es wird trotzdem gerechnet.

### 5.5 „Auch prüfen“ (nur Hinweise, keine Berechnung)

- **L-Bank Z15:** Landesdarlehen ab 1 % für Familien. Die Wartezeit beträgt mindestens 1 Jahr, und es gilt eine eigene Einkommensgrenze (Brutto).
- **L-Bank „Wohnen mit Kind“ und Kombi-Darlehen.**
- **ELR Wohnen:** 30 % Zuschuss, bis 50.000 €, frühestens 2028. Ob das Programm für dieses Haus greift, ist unsicher.
- **KfW 261:** Sanierung zum Effizienzhaus, als Alternative zu Einzelmaßnahmen.
- **Kostenlose Energieberatung:** Energie-Effizienz-Tour VS und KLEA.

### 5.6 Ergebnis-Fuß

- **Stand-Datum der Daten.**
- **Haftungshinweis:** „Orientierung, keine Förder-, Finanz- oder Steuerberatung. Konditionen gelten am Tag der Zusage.“
- **Links:** zu den Programmseiten der KfW.
- **Drei Knöpfe:**
  - „Unterlagen anfordern“ → `#unterlagen`
  - „Besichtigung buchen“ → `BOOKING_URL?utm_source=foerdercheck`
  - „Ergebnis drucken“ → `window.print()` mit Druck-CSS, das nur das Ergebnis zeigt
- **Kontakt:** dazu der Link auf `CONTACT_EMAIL`.

## 6. Tests (zuerst geschrieben)

**Unit-Tests für `evaluate`:**
- **Einkommensgrenzen** von KfW 308 genau an der Grenze, bei 1 bis 5 Kindern.
- **Ausschlüsse:** Eigentum vorhanden, keine Kinder, keine Selbstnutzung.
- **Betragsdeckel:** Der Kredit ist auf den Kaufpreis begrenzt.
- **Raten:** gegen eine Referenzrechnung. Bei 180.000 € zu 1,00 % über 35 Jahre ergibt sich ≈ 508 €/Monat.
- **KfW 458:**
  - Einkommensbonus mit und ohne Familienzuschlag.
  - Deckel von 70 %.
  - Förderfähige Kosten nach Datum: 28.000 € am 18.10.2026, 27.250 € am 01.02.2027, 22.000 € ab 01.08.2030.
- **BAFA:** Deckel von 30.000 €.
- **Fall „weiß ich nicht“** beim Einkommen: zwei Szenarien, kein Einkommensbonus eingerechnet.
- **Zinsvorteil:** gleiche Laufzeit. Referenz: 180.000 € über 35 Jahre, 1,00 % gegen Marktzins.
- **Sanierungskosten leer:** Das Ergebnis enthält „Rate ohne Sanierung“ und die Zeile zur Sanierung.

**Komponententest:**
- Ablauf durch alle Schritte bis zum Ergebnis.
- Zurück-Knopf funktioniert.
- Das Ergebnis enthält `CONTACT_EMAIL` und den Buchungslink.
- Kein `fetch` und kein Speicherzugriff (`localStorage`).

**Inhaltstest:** Der Abschnitt enthält keine Straße, keine Hausnummer und keine Telefonnummer.

## 7. Pflege

- **Eine Datendatei** mit `stand`. Bei einer Aktualisierung werden Zinsen, Beträge und Datum dort geändert, die Logik bleibt unverändert.
- **Kalenderabhängige Werte** wie die Degression von KfW 458 sind als Regel mit Datum hinterlegt, nicht als feste Zahl.
- **Anlässe zur Prüfung:** mindestens alle 3 Monate sowie zum 01.01.2027 (Umbau der Neubauförderung, mögliche Änderungen an KfW 308) und zum 01.02.2027 (Beginn der Degression).

## 8. Dem Builder überlassen

- Visuelle Gestaltung im Stil der Seite
- Komponentenstruktur und Dateinamen
- Formulierung der Texte im Ton der Seite
- Eingabeelemente (Slider oder Zahlenfeld)
- Druck-Layout
- Animationen (`v-reveal` ist vorhanden)

## 9. Offene Werte (vor dem Bau zu setzen)

- **Marktzins des Bankdarlehens** (Annahme, mit Datum und Quelle): vom Builder beim Bau aus einer öffentlichen Quelle setzen, zum Beispiel der MFI-Zinsstatistik der Bundesbank, und im Ergebnis als Annahme kennzeichnen. [Claude]
- **Zins von KfW 358:** Welche Variante gilt (Laufzeit, Zinsbindung)? Der Builder wählt die zur Laufzeit passende Variante aus dem Zins-Feed der KfW und dokumentiert sie. [Claude]
