import { useState } from 'react'
import { Image, ScrollView, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Card, Label, PlanButton, T, row } from '../components/ui'
import ConfirmDialog from '../components/ConfirmDialog'
import { PROGRAM } from '../config/program'
import { DAY_NAMES, formatClock, formatDate, startOfWeek } from '../lib/time'
import { nums, useTheme } from '../theme'

export default function HomeScreen({ history, active, onStart, onResume, onDiscard, onOpenPlan }) {
  const c = useTheme()
  const insets = useSafeAreaInsets()
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const now = Date.now()
  const today = new Date(now).getDay()
  const isTrainingDay = PROGRAM.trainingDays.includes(today)
  const last = history[0]
  const thisWeek = history.filter((w) => w.startedAt >= startOfWeek(now)).length

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 20, gap: 20 }}>
      <View style={[row, { justifyContent: 'space-between' }]}>
        <View style={[row, { gap: 12 }]}>
          <Image source={require('../../assets/logo-small.png')} style={{ width: 48, height: 48, borderRadius: 14 }} />
          <T weight="black" style={{ fontSize: 20, letterSpacing: 0.5 }}>
            BODYWEIGHT 20M
          </T>
        </View>
        <PlanButton onPress={onOpenPlan} />
      </View>

      <Card style={{ padding: 20 }}>
        <Label>היום</Label>
        <View style={[row, { justifyContent: 'space-between', marginTop: 2 }]}>
          <T weight="black" style={{ fontSize: 30 }}>
            יום {DAY_NAMES[today]}
          </T>
          {isTrainingDay ? (
            <LinearGradient colors={c.accent} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
              <T weight="bold" style={{ fontSize: 14, color: c.onAccent }}>
                יום אימון
              </T>
            </LinearGradient>
          ) : (
            <View style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: c.line }}>
              <T weight="bold" muted style={{ fontSize: 14 }}>
                יום מנוחה
              </T>
            </View>
          )}
        </View>
        <T muted style={{ marginTop: 6 }}>
          ימי אימון: {PROGRAM.trainingDays.map((d) => DAY_NAMES[d]).join(' / ')}
        </T>
      </Card>

      <View style={{ flex: 1, justifyContent: 'center', gap: 12, paddingVertical: 8 }}>
        {active ? (
          <>
            <Card style={{ padding: 16, alignItems: 'center' }}>
              <T weight="bold" style={{ fontSize: 18 }}>
                יש אימון שלא הסתיים
              </T>
              <T muted style={{ textAlign: 'center' }}>
                התחיל ב-{formatDate(active.startedAt)}, אפשר להמשיך מאיפה שהפסקת
              </T>
            </Card>
            <Button title="המשך אימון" size="xl" onPress={onResume} />
            <Button title="בטל את האימון הפתוח" size="md" variant="secondary" onPress={() => setConfirmDiscard(true)} haptic={false} textStyle={{ fontSize: 15, color: c.muted }} />
          </>
        ) : (
          <Button title="התחל אימון" size="xl" onPress={onStart} textStyle={{ fontSize: 38 }} height={140} />
        )}
      </View>

      <View style={[row, { gap: 12, alignItems: 'stretch' }]}>
        <Card style={{ flex: 1, padding: 16 }}>
          <Label>אימון אחרון</Label>
          {last ? (
            <>
              <T weight="black" style={[{ fontSize: 26, marginTop: 2 }, nums]}>
                {formatClock(last.durationMs)}
              </T>
              <T muted style={[{ fontSize: 14 }, nums]}>
                יום {DAY_NAMES[new Date(last.startedAt).getDay()]}, {formatDate(last.startedAt)}
              </T>
            </>
          ) : (
            <T weight="bold" muted style={{ fontSize: 18, marginTop: 4 }}>
              עוד אין
            </T>
          )}
        </Card>
        <Card style={{ flex: 1, padding: 16 }}>
          <Label>השבוע</Label>
          <T weight="black" style={[{ fontSize: 26, marginTop: 2 }, nums]}>
            {thisWeek}
            <T weight="bold" muted style={{ fontSize: 18 }}>
              {' '}
              מתוך {PROGRAM.weeklyGoal}
            </T>
          </T>
          <View style={[row, { gap: 6, marginTop: 8 }]}>
            {Array.from({ length: PROGRAM.weeklyGoal }, (_, i) =>
              i < thisWeek ? (
                <LinearGradient key={i} colors={c.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: 8, borderRadius: 4 }} />
              ) : (
                <View key={i} style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: c.line }} />
              ),
            )}
          </View>
        </Card>
      </View>

      <ConfirmDialog
        open={confirmDiscard}
        title="לבטל את האימון?"
        message="האימון הפתוח יימחק ולא יישמר בהיסטוריה."
        confirmLabel="כן, בטל"
        cancelLabel="לא"
        danger
        onConfirm={() => {
          setConfirmDiscard(false)
          onDiscard()
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </ScrollView>
  )
}
