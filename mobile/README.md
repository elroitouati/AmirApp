# BODYWEIGHT 20M – גרסת Expo (אנדרואיד / אייפון)

אותה אפליקציה כמו גרסת ה-PWA שבשורש הריפו, ב-React Native + Expo SDK 57, כך שאפשר להריץ אותה ב-Expo Go.
יתרונות על פני ה-PWA: רטט אמיתי (גם באייפון), צליל שנשמע גם במצב שקט, והמסך נשאר דלוק בזמן אימון.

## הרצה ב-Expo Go

```bash
cd mobile
npm install
npx expo start          # סורקים את ה-QR עם Expo Go (אותה רשת Wi-Fi)
npx expo start --tunnel # אם הטלפון לא באותה רשת
```

## עריכת התוכנית

`src/config/program.js` (עותק של הקובץ בגרסת ה-PWA – אם משנים תרגיל, לשנות בשניהם).

## מבנה

```
App.js                 טעינה, ניווט בין מסכים, שמירה
src/config/program.js  התוכנית
src/lib/workout.js     לוגיקת אימון (timestamps)
src/lib/storage.js     AsyncStorage
src/lib/feedback.js    צליל + רטט
src/lib/hooks.js       useNow, מסך דלוק
src/components/        כפתורים, טבעת, bottom sheet, גרף…
src/screens/           בית, אימון פעיל, היסטוריה
```
