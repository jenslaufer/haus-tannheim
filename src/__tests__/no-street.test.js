// Why this file exists (2026-10-26):
//
// The site names only "Tannheim"; the street stays in the private exposé. Three
// draft pages under public/varianten/ carried the street from 2026-05-29 and
// shipped live with every deploy. The whole repo is public, so this guard scans
// every text file in it, not only what the build ships. It compares SHA-256
// hashes of words, so the repo never contains the street itself.
//
// PDFs and images are not read here: their text is glyph-encoded. The private
// generators (haus-tannheim-private/scripts/plaene.py, modell3d.py) check the
// buyer files with a real text extraction before they are copied in.

import { it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join, extname } from 'node:path'

// The street's distinctive word, with and without umlaut.
const FORBIDDEN = new Set([
  '17f942cbcb262d67261e54c1e11aa36cbe9d04ac896fd13054bdb66eca3ac15e',
  'f4824f8e6cb5f09685e447a916edb448cba719341ff50f450b45c9838d8e8de0',
])
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'coverage'])
const BINARY = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.pdf', '.woff', '.woff2', '.ttf', '.glb'])

function* textFiles(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) yield* textFiles(p)
    } else if (e.isFile() && !BINARY.has(extname(e.name).toLowerCase())) {
      yield p
    }
  }
}

const sha = (w) => createHash('sha256').update(w).digest('hex')

it('names the street in no file of the public repo', () => {
  const hits = []
  for (const file of textFiles(process.cwd())) {
    const words = readFileSync(file, 'utf8').normalize('NFC').toLowerCase().match(/\p{L}+/gu) || []
    if (words.some((w) => FORBIDDEN.has(sha(w)))) hits.push(file.slice(process.cwd().length + 1))
  }
  expect(hits).toEqual([])
})
