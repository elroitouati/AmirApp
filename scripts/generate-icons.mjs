// יוצר את כל האייקונים של ה-PWA מתוך logo.png שבשורש הפרויקט.
// להחלפת לוגו: מחליפים את logo.png ומריצים npm run icons (או סתם build).
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'icons')
const BG = '#2B2D2F'
const PNG_OPTS = { palette: true, quality: 90, compressionLevel: 9 }

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('[icons] sharp לא מותקן – מדלג על יצירת אייקונים')
  process.exit(0)
}

const logoPng = path.join(root, 'logo.png')
if (!existsSync(logoPng)) {
  console.error('[icons] לא נמצא logo.png בשורש הפרויקט')
  process.exit(1)
}
const source = logoPng
mkdirSync(outDir, { recursive: true })

const base = () => sharp(source, { density: 300 })

// אייקון בגודל size, הלוגו תופס scale מהשטח, על רקע (או שקוף)
async function icon(file, size, { scale = 1, background = null } = {}) {
  const inner = Math.round(size * scale)
  const logo = await base()
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png(PNG_OPTS)
    .toFile(path.join(outDir, file))
}

// מסך פתיחה ל-iOS: לוגו במרכז על רקע פחם
async function splash(w, h) {
  const inner = Math.round(Math.min(w, h) * 0.32)
  const logo = await base().resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  await sharp({ create: { width: w, height: h, channels: 4, background: BG } })
    .composite([{ input: logo, gravity: 'center' }])
    .png(PNG_OPTS)
    .toFile(path.join(outDir, `splash-${w}x${h}.png`))
}

await Promise.all([
  icon('favicon-16.png', 16),
  icon('favicon-32.png', 32),
  icon('favicon-48.png', 48),
  icon('logo-header.png', 160),
  icon('apple-touch-icon.png', 180, { background: BG }),
  icon('pwa-192.png', 192),
  icon('pwa-512.png', 512),
  icon('maskable-512.png', 512, { scale: 0.8, background: BG }),
])

// גדלי מסך נפוצים של אייפון (פיקסלים פיזיים, לאורך)
const SPLASH_SIZES = [
  [1320, 2868], [1206, 2622], [1290, 2796], [1179, 2556],
  [1284, 2778], [1170, 2532], [1125, 2436], [1242, 2688],
  [828, 1792], [1242, 2208], [750, 1334], [640, 1136],
]
await Promise.all(SPLASH_SIZES.map(([w, h]) => splash(w, h)))
console.log('[icons] נוצרו בהצלחה ב-public/icons')
