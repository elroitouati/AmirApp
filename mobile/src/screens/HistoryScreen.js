import { useEffect, useState } from 'react'
import { BackHandler, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Card, Label, T, row } from '../components/ui'
import ConfirmDialog from '../components/ConfirmDialog'
import DurationChart from '../components/DurationChart'
import { dayName, formatClock, formatDate, formatTime } from '../lib/time'
import { nums, shadow, useTheme } from '../theme'

export default function HistoryScreen({ history, onDelete }) {
  const c = useTheme()
  const insets = useSafeAreaInsets()
  const [openId, setOpenId] = useState(null)
  const open = history.find((w) => w.id === openId)

  // כפתור "חזרה" של אנדרואיד סוגר את הפירוט
  useEffect(() => {
    if (!open) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setOpenId(null)
      return true
    })
    return () => sub.remove()
  }, [open])

  const pad = { paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 20, gap: 16 }

  if (open) {
    return (
      <ScrollView contentContainerStyle={pad}>
        <Detail
          workout={open}
          onBack={() => setOpenId(null)}
          onDelete={() => {
            onDelete(open.id)
            setOpenId(null)
          }}
        />
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={pad}>
      <T weight="black" style={{ fontSize: 32 }}>
        היסטוריה
      </T>
      {history.length === 0 ? (
        <Card style={{ padding: 24, alignItems: 'center' }}>
          <T weight="bold" style={{ fontSize: 20 }}>
            עוד אין אימונים
          </T>
          <T muted style={{ textAlign: 'center', marginTop: 4 }}>
            אחרי שתסיים ותשמור אימון, הוא יופיע כאן.
          </T>
        </Card>
      ) : (
        <>
          <DurationChart history={history} />
          {history.map((w) => (
            <Pressable
              key={w.id}
              onPress={() => setOpenId(w.id)}
              style={({ pressed }) => [
                row,
                { justifyContent: 'space-between', backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: 24, padding: 16, transform: [{ scale: pressed ? 0.99 : 1 }] },
                shadow,
              ]}
            >
              <View>
                <T weight="bold" style={{ fontSize: 18 }}>
                  יום {dayName(w.startedAt)}
                </T>
                <T muted style={[{ fontSize: 14 }, nums]}>
                  {formatDate(w.startedAt)}
                  {w.endedEarly ? ' · הסתיים מוקדם' : ''}
                </T>
              </View>
              <T weight="black" style={[{ fontSize: 24 }, nums]}>
                {formatClock(w.durationMs)}
              </T>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  )
}

function Detail({ workout, onBack, onDelete }) {
  const c = useTheme()
  const [confirm, setConfirm] = useState(false)
  const rowStyle = (first) => [row, { justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: first ? 0 : 1, borderColor: c.line }]
  return (
    <>
      <Pressable onPress={onBack} hitSlop={8} style={{ alignSelf: 'flex-start', paddingVertical: 8 }}>
        <T weight="bold" muted style={{ fontSize: 18 }}>
          → חזרה
        </T>
      </Pressable>
      <View>
        <T weight="black" style={{ fontSize: 32 }}>
          יום {dayName(workout.startedAt)}
        </T>
        <T muted style={nums}>
          {formatDate(workout.startedAt)} · התחיל ב-{formatTime(workout.startedAt)}
        </T>
      </View>

      <Card style={{ padding: 20 }}>
        <Label>משך כולל</Label>
        <T weight="black" style={[{ fontSize: 52, lineHeight: 60 }, nums]}>
          {formatClock(workout.durationMs)}
        </T>
        <T muted style={nums}>
          {workout.exercises.length} מתוך {workout.totalExercises} תרגילים
          {workout.endedEarly ? ' · הסתיים מוקדם' : ''}
        </T>
      </Card>

      <Card>
        <View style={rowStyle(true)}>
          <T weight="bold" style={{ fontSize: 18 }}>
            חימום
          </T>
          <T weight="black" style={[{ fontSize: 20 }, nums]}>
            {formatClock(workout.warmupMs)}
          </T>
        </View>
        {workout.exercises.map((e) => (
          <View key={e.id} style={rowStyle(false)}>
            <T weight="bold" style={{ fontSize: 18, flexShrink: 1 }}>
              {e.name}
            </T>
            <T weight="black" style={[{ fontSize: 20 }, nums]}>
              {formatClock(e.durationMs)}
            </T>
          </View>
        ))}
      </Card>

      <Button title="מחק אימון" size="md" variant="danger" onPress={() => setConfirm(true)} haptic={false} />

      <ConfirmDialog
        open={confirm}
        title="למחוק את האימון?"
        message="לא ניתן לשחזר אחרי המחיקה."
        confirmLabel="מחק"
        danger
        onConfirm={() => {
          setConfirm(false)
          onDelete()
        }}
        onCancel={() => setConfirm(false)}
      />
    </>
  )
}
