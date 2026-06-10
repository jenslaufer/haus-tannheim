// Shared config for lead capture (Launch Kit, auth.solytics.de) and the
// self-hosted Cal.com booking calendar (cal.solytics.de).

export const CAL_ORIGIN = 'https://cal.solytics.de'
export const CAL_LINK = 'haus-tannheim/besichtigung'

export const LEAD_CAPTURE_URL =
  'https://auth.solytics.de/t/haus-tannheim/marketing/public/lead-capture'
export const LEAD_SEGMENT = 'interessenten'

// Posts a lead into the "interessenten" segment. Never throws — lead capture
// must not break the surrounding flow (e.g. a successful booking).
export function captureLead({ email, name = '', hp = '' }) {
  return fetch(LEAD_CAPTURE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, segment: LEAD_SEGMENT, hp }),
  }).catch((err) => {
    console.warn('lead-capture failed:', err)
    return null
  })
}
