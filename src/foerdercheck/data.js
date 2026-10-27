// Every figure the Fördercheck uses, in one place. Update STAND whenever a
// value changes. Sources: ~/repos/foerderprogramme-hauskauf (checked
// 18.10.2026) and the KfW rate feed (kfw.de/zinsen/alle.rates).

export const STAND = '2026-10-18'

export const GRUNDERWERBSTEUER_PCT = 5.0 // Baden-Württemberg
export const NOTAR_GRUNDBUCH_PCT = 2.0 // flat estimate; no broker fee

// KfW 308 "Jung kauft Alt". The house is class H, so the object condition holds.
export const KFW308 = {
  betragNachKindern: { 1: 140000, 2: 160000, 3: 180000 },
  einkommenBasis: 90000,
  einkommenJeWeiteresKind: 10000,
  effZinsPct: 1.0, // 35 years, 10 years fixed, feed 18.10.2026
  laufzeitJahre: 35,
  zinsbindungJahre: 10,
  sanierungsfristMonate: 54,
  url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Wohneigentum-f%C3%BCr-Familien-Bestandserwerb-(308)/',
}

// KfW 358 supplementary loan to BEG individual measures.
export const KFW358 = {
  einkommenGrenze: 90000,
  maxBetrag: 120000,
  effZinsPct: 2.56, // 25 years, 10 years fixed, feed 18.10.2026
  laufzeitJahre: 25,
  zinsbindungJahre: 10,
  url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Einzelma%C3%9Fnahmen-Erg%C3%A4nzungskredit-Wohngeb%C3%A4ude-(358-359)/',
}

// KfW 458 heating grant. No climate-speed bonus: the gas boiler is from 2017.
export const KFW458 = {
  grundPct: 30,
  maxPct: 70,
  einkommensbonus: [
    { bis: 30000, pct: 40 },
    { bis: 40000, pct: 30 },
    { bis: 50000, pct: 10 },
  ],
  kindAbzug: 10000,
  foerderfaehigStart: 28000,
  foerderfaehigMin: 22000,
  degressionSchritt: 750, // every 1 Feb and 1 Aug
  degressionAb: '2027-02-01',
  url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Heizungsf%C3%B6rderung-f%C3%BCr-Privatpersonen-Wohngeb%C3%A4ude-(458)/',
}

// BAFA BEG individual measures, building envelope, without iSFP.
export const BAFA_HUELLE = {
  pct: 15,
  maxFoerderfaehig: 30000,
  url: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Foerderprogramm_im_Ueberblick/foerderprogramm_im_ueberblick_node.html',
}

// Market-rate assumption for the bank loan.
export const BANK = {
  zinsPct: 4.45,
  tilgungPct: 2,
  quelle: 'Ø 10 Jahre Zinsbindung, Oktober 2026 (Sparkasse, Statista, Interhyp)',
}

// "Auch prüfen": shown as hints, never calculated.
export const AUCH_PRUEFEN = [
  {
    key: 'z15',
    titel: 'L-Bank Z15-Darlehen',
    text: 'Landesdarlehen für Familien ab 1 % Sollzins. Eigene Einkommensgrenze (brutto, nicht zvE). Derzeit mindestens ein Jahr Wartezeit bis zur Bewilligung.',
  },
  {
    key: 'wohnenMitKind',
    titel: 'L-Bank „Wohnen mit Kind“',
    text: 'Darlehen 15.000–100.000 € für Familien, finanziert auch Nebenkosten. Zins nahe am Marktniveau.',
  },
  {
    key: 'kombi',
    titel: 'L-Bank Kombi-Darlehen Wohnen',
    text: 'Ergänzungsdarlehen bis 200.000 €, kombinierbar mit KfW-Förderung. Zins nahe am Marktniveau.',
  },
  {
    key: 'elr',
    titel: 'ELR Wohnen (Land Baden-Württemberg)',
    text: '30 % Zuschuss, bis 50.000 € je Wohnung, für die Modernisierung im ländlichen Raum. Frühestens 2028, unsicher — die Stadt muss ein Projekt anmelden.',
  },
  {
    key: 'kfw261',
    titel: 'KfW 261 – Sanierung zum Effizienzhaus',
    text: 'Kredit bis 150.000 € mit Tilgungszuschuss, als Alternative zu Einzelmaßnahmen. Nicht mit BAFA-Einzelmaßnahmen kombinierbar.',
  },
  {
    key: 'paragraph35c',
    titel: 'Steuerabzug § 35c EStG',
    text: '20 % der Sanierungskosten über drei Jahre, höchstens 40.000 €. Alternative zum Zuschuss — nicht für dieselbe Maßnahme kombinierbar.',
  },
  {
    key: 'energieberatung',
    titel: 'Kostenlose Energieberatung',
    text: 'Energie-Effizienz-Tour der Stadt Villingen-Schwenningen und Erstberatung der Energieagentur KLEA. Ein Sanierungsfahrplan (iSFP) erhöht die BAFA-Förderung.',
  },
]
