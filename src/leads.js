// Shared config for lead capture (Launch Kit, auth.solytics.de) and the
// self-hosted Cal.com booking calendar (cal.solytics.de).

export const BOOKING_URL = 'https://cal.solytics.de/haus-tannheim/besichtigung'

// The way in that always works. The booking calendar only offers hand-set
// viewing days, so it is empty between them — every dead end must fall back
// to a human.
export const CONTACT_EMAIL = 'jens@haus-tannheim.de'

export const LEAD_CAPTURE_URL =
  'https://auth.solytics.de/t/haus-tannheim/marketing/public/lead-capture'
export const LEAD_SEGMENT = 'interessenten'

// Posts a lead into the "interessenten" segment. Never throws — lead capture
// must not break the surrounding flow.
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
