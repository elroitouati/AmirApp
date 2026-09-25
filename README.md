# BODYWEIGHT 20M

אפליקציית מעקב אימוני משקל גוף – PWA בעברית, עובדת גם בלי אינטרנט. כל הנתונים נשמרים מקומית בטלפון (localStorage).

## הרצה מקומית

```bash
npm install
npm run dev      # פיתוח
npm run build    # בנייה ל-dist/
npm run preview  # הרצת הגרסה הבנויה (כולל service worker)
```

## עריכת התוכנית

כל התרגילים, הסטים, החזרות, המנוחה, ימי האימון וזמן החימום נמצאים בקובץ אחד:
`src/config/program.js`.

## החלפת לוגו

מחליפים את `logo.png` בשורש הפרויקט (רצוי ריבוע 1024×1024). כל האייקונים (favicon, apple-touch-icon,
אייקוני PWA ומסכי פתיחה לאייפון) נוצרים ממנו אוטומטית בכל `npm run dev` / `npm run build`
(או ידנית עם `npm run icons`).

## מבנה

```
src/
  config/program.js      התוכנית
  lib/workout.js         לוגיקת אימון (timestamps)
  lib/storage.js         localStorage
  lib/hooks.js           useNow, useWakeLock
  lib/sound.js           צליל + רטט
  components/            כפתורים, טבעת התקדמות, bottom sheet, גרף…
  screens/               בית, אימון פעיל, היסטוריה
scripts/generate-icons.mjs
```
