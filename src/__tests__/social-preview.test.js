// Why this file exists (2026-08-06):
//
// The closing line of the live Kleinanzeigen ad is the entrance to this whole
// funnel:
//
//     "Alle Fotos, das Exposé und Terminvereinbarung:
//      https://www.haus-tannheim.de"
//
// That is the channel which produced 17 viewings and the only written offer in
// four weeks. Buyers do not keep such a link to themselves — they forward it to
// a partner on WhatsApp, paste it into a mail, drop it into a chat. And exactly
// there the page had nothing to show: index.html carried og:title, og:type and
// og:url, but no og:image at all (verified 2026-08-06 against the live site).
//
// Link-preview crawlers do not execute JavaScript. They read the raw HTML, and
// this is a client-rendered Vue app — 1238 bytes of markup, one empty <div>.
// So whatever the gallery holds is invisible to them: every shared link
// rendered as a grey box with a line of text. For a house, the photo *is* the
// pitch.
//
// These tests pin the preview card: an absolute image URL, a file that really
// exists at that path with the declared dimensions, and a size that a chat app
// will actually fetch before it gives up.

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const html = readFileSync(resolve(root, 'index.html'), 'utf8')

/** Value of a <meta property="..."> or <meta name="..."> tag. */
function meta(key) {
  const re = new RegExp(
    `<meta\\s+(?:property|name)="${key}"\\s+content="([^"]*)"\\s*/?>`,
    'i',
  )
  return html.match(re)?.[1] ?? null
}

/** JPEG dimensions straight from the SOFn marker — no image library needed. */
function jpegSize(path) {
  const buf = readFileSync(path)
  let i = 2 // skip SOI
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = buf[i + 1]
    // SOF0..SOF15, minus the non-frame markers DHT (c4), JPG (c8), DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
    }
    i += 2 + buf.readUInt16BE(i + 2)
  }
  throw new Error(`no SOF marker in ${path}`)
}

describe('social link preview', () => {
  it('declares an image, because a shared link without one renders as a grey box', () => {
    expect(meta('og:image')).toBeTruthy()
  })

  it('uses an absolute URL — crawlers do not resolve relative paths', () => {
    expect(meta('og:image')).toMatch(/^https:\/\/haus-tannheim\.de\//)
  })

  it('serves the image from public/, so the URL survives every rebuild', () => {
    const url = meta('og:image')
    const file = resolve(root, 'public', url.replace('https://haus-tannheim.de/', ''))
    expect(existsSync(file)).toBe(true)
  })

  it('ships a JPEG — WhatsApp does not render WebP previews reliably', () => {
    expect(meta('og:image')).toMatch(/\.jpe?g$/i)
  })

  it('matches the declared dimensions at the 1.91:1 card ratio', () => {
    const url = meta('og:image')
    const file = resolve(root, 'public', url.replace('https://haus-tannheim.de/', ''))
    const { width, height } = jpegSize(file)

    expect(width).toBe(1200)
    expect(height).toBe(630)
    expect(meta('og:image:width')).toBe(String(width))
    expect(meta('og:image:height')).toBe(String(height))
  })

  it('stays small enough that a chat app fetches it before giving up', () => {
    const url = meta('og:image')
    const file = resolve(root, 'public', url.replace('https://haus-tannheim.de/', ''))
    expect(statSync(file).size).toBeLessThan(300 * 1024)
  })

  it('describes the image for readers who never see it', () => {
    expect(meta('og:image:alt')).toBeTruthy()
  })

  it('asks for the large card on X/Twitter instead of the thumbnail', () => {
    expect(meta('twitter:card')).toBe('summary_large_image')
    expect(meta('twitter:image')).toBe(meta('og:image'))
  })

  it('keeps the existing card copy intact', () => {
    expect(meta('og:title')).toBeTruthy()
    expect(meta('og:description')).toBeTruthy()
    expect(meta('og:url')).toBe('https://haus-tannheim.de/')
    expect(meta('og:locale')).toBe('de_DE')
  })
})
