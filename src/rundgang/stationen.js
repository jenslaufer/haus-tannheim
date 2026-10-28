// Where each photo was taken, in plan metres (haus-tannheim-private, scripts/plaene.py):
// x from the left outer face (NW, entrance side) to 10.49 at the garage side,
// y from the garden face (SW) to 9.74 at the street. `blick` is the camera's
// heading as a plan vector, `neigung` its pitch in degrees (negative = down).
//
// Read off the photos against the plan on 2026-10-28 (which window, door or stair
// is in frame), so about ±0.5 m and ±15°; the model is schematic anyway.
// Indoor stations name a room id from raeume.json and get an eye height of 1.5 m
// over its floor; `hoehe` overrides that (absolute metres, ±0 = street-level floor).
// Order = tour order: street, entrance, street level, garden level, outside, air.

export const RAUM_NAMEN = {
  kind: 'Zimmer 1',
  'kind-2': 'Zimmer 2',
  eltern: 'Zimmer 3',
  flur: 'Flur',
  wc: 'WC',
  windfang: 'Windfang',
  diele: 'Diele und Treppe',
  bad: 'Bad',
  garage: 'Garage',
  wohnen: 'Wohnen/Essen',
  nutzraum: 'Nutzraum',
  vorplatz: 'Vorplatz und Treppe',
  kueche: 'Küche',
  vorratsraum: 'Vorratsraum',
}

const STRASSE = 1.15 // street -0.45 + 1.6
const EINGANG = 0.9 // path at the front door, about the Windfang floor (-0.59)
const GARTEN = -1.15 // garden -2.75 + 1.6
const OBEN = 1.5 // balcony and stair landing at ±0

export const stationen = [
  // — Street and entrance —
  { foto: '_KWF1981-HDR.jpg', bereich: 'Straßenseite', pos: [4.5, 17], hoehe: STRASSE, blick: [0.1, -1] },
  { foto: '_KWF1984-HDR.jpg', bereich: 'Straßenseite', pos: [-7, 15.5], hoehe: STRASSE, blick: [0.85, -0.55] },
  { foto: '_KWF1987-HDR.jpg', bereich: 'Straßenseite', pos: [8.9, 15], hoehe: STRASSE, blick: [0, -1] },
  { foto: '_KWF1993-HDR.jpg', bereich: 'Eingang', pos: [-3, 15], hoehe: 1.0, blick: [0.35, -1] },
  { foto: '_KWF1996-HDR.jpg', bereich: 'Eingang', pos: [-4, 11.5], hoehe: EINGANG, blick: [0.65, -0.75] },
  { foto: '_KWF1999-HDR.jpg', bereich: 'Eingang', pos: [-5, 8.8], hoehe: EINGANG, blick: [1, -0.25] },
  { foto: '_KWF2116-HDR.jpg', bereich: 'Eingang', pos: [-0.9, 7.3], hoehe: EINGANG, blick: [1, 0.05] },

  // — Street level (Obergeschoss) —
  { foto: '_KWF2110-HDR.jpg', raum: 'windfang', pos: [0.7, 7.4], blick: [1, 0] },
  { foto: '_KWF2050-HDR.jpg', raum: 'diele', pos: [2.4, 7.5], blick: [1, -0.35] },
  { foto: '_KWF2056-HDR.jpg', raum: 'diele', pos: [4.9, 6.1], hoehe: OBEN, blick: [-1, 0.25] },
  { foto: '_KWF2059-HDR.jpg', raum: 'diele', pos: [5.1, 6.2], hoehe: OBEN, blick: [-1, 0.3] },
  { foto: '_KWF2053-HDR.jpg', raum: 'wc', pos: [1.6, 6.05], blick: [-1, 0] },
  { foto: '_KWF2107-HDR.jpg', raum: 'flur', pos: [7.0, 5.1], blick: [-1, -0.35] },
  { foto: '_KWF2062-HDR.jpg', raum: 'flur', pos: [5.8, 5.0], blick: [-1, -0.3] },
  { foto: '_KWF2068-HDR.jpg', raum: 'kind', pos: [1.5, 5.1], blick: [0.1, -1] },
  { foto: '_KWF2065-HDR.jpg', raum: 'kind', pos: [2.4, 5.2], blick: [-0.3, -1] },
  { foto: '_KWF2071-HDR.jpg', raum: 'kind-2', pos: [5.6, 4.0], blick: [-0.3, -1] },
  { foto: '_KWF2074-HDR.jpg', raum: 'kind-2', pos: [5.8, 3.7], blick: [-1, -0.45] },
  { foto: '_KWF2080-HDR.jpg', raum: 'eltern', pos: [7.6, 3.8], blick: [0.25, -1] },
  { foto: '_KWF2083-HDR.jpg', raum: 'eltern', pos: [9.2, 3.8], blick: [-0.45, -1] },
  { foto: '_KWF2086-HDR.jpg', raum: 'eltern', pos: [9.8, 2.2], blick: [-1, 0.15] },
  { foto: '_KWF1978-HDR.jpg', bereich: 'Balkon', pos: [1.9, 0.6], hoehe: OBEN, blick: [0, -1] },
  { foto: '_KWF1966-HDR.jpg', bereich: 'Balkon', pos: [3.0, 0.5], hoehe: OBEN, blick: [-0.35, -1] },
  { foto: '_KWF1972-HDR.jpg', bereich: 'Balkon', pos: [2.2, 0.4], hoehe: OBEN, blick: [-0.15, -1], neigung: -15 },
  { foto: '_KWF1969-HDR.jpg', bereich: 'Balkon', pos: [0.5, 0.6], hoehe: OBEN, blick: [1, -0.4] },
  { foto: '_KWF1975-HDR.jpg', bereich: 'Balkon', pos: [4.8, 0.6], hoehe: OBEN, blick: [0.45, -1] },
  { foto: '_KWF2089-HDR.jpg', raum: 'bad', pos: [6.1, 5.85], blick: [0.15, 1] },
  { foto: '_KWF2098.jpg', raum: 'bad', pos: [6.7, 6.5], blick: [0.5, -1] }, // direction: Jens, 2026-10-28
  { foto: '_KWF2104-HDR.jpg', raum: 'garage', pos: [8.2, 5.2], blick: [0.45, 1] },

  // — Garden level (Erdgeschoss) —
  { foto: '_KWF2011-HDR.jpg', raum: 'vorplatz', pos: [7.0, 6.9], blick: [-1, -0.7] },
  { foto: '_KWF2014-HDR.jpg', raum: 'vorplatz', pos: [4.6, 6.8], blick: [0.15, -1] },
  { foto: '_KWF2023-HDR.jpg', raum: 'wohnen', pos: [7.0, 3.4], blick: [-1, 0.12] },
  { foto: '_KWF2020-HDR.jpg', raum: 'wohnen', pos: [9.6, 2.4], blick: [-1, 0.1] },
  { foto: '_KWF2029-HDR.jpg', raum: 'wohnen', pos: [5.5, 4.9], blick: [0.1, -1] },
  { foto: '_KWF2017-HDR.jpg', raum: 'wohnen', pos: [1.6, 3.4], blick: [1, -0.35] },
  { foto: '_KWF2026-HDR.jpg', raum: 'wohnen', pos: [1.0, 4.9], blick: [0.35, -1] },
  { foto: '_KWF2032-HDR.jpg', raum: 'kueche', pos: [7.9, 6.9], blick: [1, -0.4] },
  { foto: '_KWF2035-HDR.jpg', raum: 'kueche', pos: [8.5, 7.0], blick: [0.2, -1] },
  // room and direction: Jens, 2026-10-28 (the open door shows the Vorplatz stair)
  { foto: '_KWF2047-HDR.jpg', raum: 'vorratsraum', pos: [9.7, 8.9], blick: [-1, -0.5] },
  { foto: '_KWF2041-HDR.jpg', raum: 'nutzraum', pos: [1.0, 7.6], blick: [1, 0.2] },
  { foto: '_KWF2038-HDR.jpg', raum: 'nutzraum', pos: [3.0, 7.0], blick: [-1, -0.35] },

  // — Terrace and garden —
  { foto: '_KWF2002-HDR.jpg', bereich: 'Terrasse', pos: [-1.2, 0.2], hoehe: GARTEN, blick: [1, 0.12] },
  { foto: '_KWF1963-HDR.jpg', bereich: 'Terrasse', pos: [0.4, 0.4], hoehe: GARTEN, blick: [1, -0.5] },
  { foto: '_KWF1954-HDR.jpg', bereich: 'Terrasse', pos: [5.5, 0.6], hoehe: GARTEN, blick: [-1, -0.45] },
  { foto: '_KWF1957-HDR.jpg', bereich: 'Terrasse', pos: [2.0, -0.6], hoehe: GARTEN, blick: [-0.45, -1] },
  { foto: '_KWF1960-HDR.jpg', bereich: 'Terrasse', pos: [3.2, -1.0], hoehe: GARTEN, blick: [0, -1] },
  { foto: '_KWF2008-HDR.jpg', bereich: 'Garten', pos: [12, -2.5], hoehe: GARTEN, blick: [-1, 0.3] },
  { foto: '_KWF1948-HDR.jpg', bereich: 'Garten', pos: [11, -6], hoehe: GARTEN, blick: [-0.6, 0.8] },
  { foto: '_KWF1951-HDR.jpg', bereich: 'Garten', pos: [12, -5], hoehe: GARTEN, blick: [1, 0.5] },
  { foto: '_KWF1942-HDR.jpg', bereich: 'Garten', pos: [2.5, -13], hoehe: GARTEN, blick: [0.25, 1], neigung: 5 },
  { foto: '_KWF1945-HDR.jpg', bereich: 'Garten', pos: [6, -12], hoehe: GARTEN, blick: [-0.05, 1], neigung: 5 },
  { foto: '_KWF2005-HDR.jpg', bereich: 'Garten', pos: [-6, -11], hoehe: GARTEN, blick: [-0.5, -1] },
  { foto: '_KWF1990-HDR.jpg', bereich: 'Garten', pos: [12.5, 10.5], hoehe: 1.0, blick: [-0.6, -0.8] },

  // — From the air —
  { foto: 'VS-Tannheim-7.jpg', bereich: 'Luftbild', pos: [5, -22], hoehe: 10, blick: [0, 1], neigung: -25 },
  { foto: 'VS-Tannheim-20.jpg', bereich: 'Luftbild', pos: [5, 22], hoehe: 4, blick: [0, -1], neigung: -10 },
  { foto: 'VS-Tannheim-14.jpg', bereich: 'Luftbild', pos: [5, 32], hoehe: 22, blick: [0, -1], neigung: -35 },
  { foto: 'VS-Tannheim-4.jpg', bereich: 'Luftbild', pos: [5, 5], hoehe: 35, blick: [0, 1], neigung: -89 },
]
