import { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, ScrollView, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Card, Label, PlanButton, T, row } from '../components/ui'
import ProgressRing from '../components/ProgressRing'
import ConfirmDialog from '../components/ConfirmDialog'
import { PROGRAM } from '../config/program'
import { useKeepScreenOn, useNow } from '../lib/hooks'
import { signalDone } from '../lib/feedback'
import { formatClock, formatCountdown, formatDate } from '../lib/time'
import { endEarly, endWarmup, finishExercise, warmupEndsAt } from '../lib/workout'
import { nums, useTheme } from '../theme'

const exerciseInfo = (id) => PROGRAM.exercises.find((e) => e.id === id)

export default function WorkoutScreen({ workout, update, previous, onSave, onOpenPlan }) {
  const c = useTheme()
  const insets = useSafeAreaInsets()
  const inSummary = workout.phase === 'summary'
  const now = useNow(!inSummary)
  const [confirmEnd, setConfirmEnd] = useState(false)
  useKeepScreenOn(!inSummary)

  // סוף החימום – מחושב מול timestamp, כך שגם אחרי שהאפליקציה הייתה ברקע המעבר מדויק
  useEffect(() => {
    if (workout.phase !== 'warmup') return
    const end = warmupEndsAt(workout)
    if (now >= end) {
      update((w) => endWarmup(w, warmupEndsAt(w)))
      if (now - end < 15000) signalDone() // לא מצפצף אם חזרנו לאפליקציה הרבה אחרי
    }
  }, [now, workout, update])

  const totalMs = (workout.endedAt ?? now) - workout.startedAt

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 12, gap: 12, backgroundColor: c.bg }}>
        <View style={[row, { justifyContent: 'space-between', minHeight: 56 }]}>
          {inSummary ? (
            <T weight="bold" muted style={{ fontSize: 18 }}>
              סיכום אימון
            </T>
          ) : (
            <View>
              <Label>זמן כולל</Label>
              <T weight="black" style={[{ fontSize: 40, lineHeight: 46 }, nums]}>
                {formatClock(totalMs)}
              </T>
            </View>
          )}
          <PlanButton onPress={onOpenPlan} />
        </View>
        {!inSummary && <StepBar workout={workout} />}
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 12 }}>
        {workout.phase === 'warmup' && <Warmup workout={workout} now={now} onSkip={() => update((w) => endWarmup(w, Date.now()))} />}
        {workout.phase === 'exercise' && <Exercise workout={workout} now={now} onDone={() => update((w) => finishExercise(w, Date.now()))} />}
        {inSummary && <Summary workout={workout} previous={previous} onSave={onSave} />}

        {!inSummary && (
          <Pressable onPress={() => setConfirmEnd(true)} hitSlop={8} style={{ alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 16 }}>
            <T muted style={{ fontSize: 14, textDecorationLine: 'underline' }}>
              סיים אימון מוקדם
            </T>
          </Pressable>
        )}
      </ScrollView>

      <ConfirmDialog
        open={confirmEnd}
        title="לסיים את האימון עכשיו?"
        message="התרגילים שכבר סיימת יישמרו. התרגיל הנוכחי לא ייספר."
        confirmLabel="כן, סיים"
        cancelLabel="המשך להתאמן"
        onConfirm={() => {
          setConfirmEnd(false)
          update((w) => endEarly(w, Date.now()))
        }}
        onCancel={() => setConfirmEnd(false)}
      />
    </View>
  )
}

// כניסה עדינה של כל שלב/תרגיל
function Enter({ id, children }) {
  const a = useRef(new Animated.Value(0)).current
  useEffect(() => {
    a.setValue(0)
    Animated.timing(a, { toValue: 1, duration: 260, useNativeDriver: true }).start()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
  const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [10, 0] })
  return <Animated.View style={{ flex: 1, opacity: a, transform: [{ translateY }] }}>{children}</Animated.View>
}

function StepBar({ workout }) {
  const c = useTheme()
  return (
    <View style={[row, { gap: 6 }]}>
      {workout.exercises.map((ex, i) => {
        const done = i < workout.completed.length
        const current = workout.phase === 'exercise' && i === workout.currentIndex
        return done ? (
          <LinearGradient key={ex.id} colors={c.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: 6, borderRadius: 3 }} />
        ) : (
          <View key={ex.id} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: current ? c.muted : c.line }} />
        )
      })}
    </View>
  )
}

function Warmup({ workout, now, onSkip }) {
  const remaining = warmupEndsAt(workout) - now
  const first = exerciseInfo(workout.exercises[0]?.id)
  return (
    <Enter id="warmup">
      <T weight="black" style={{ fontSize: 36, textAlign: 'center' }}>
        חימום
      </T>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
        <ProgressRing progress={remaining / workout.warmupDurationMs}>
          <T weight="black" style={[{ fontSize: 60 }, nums]}>
            {formatCountdown(remaining)}
          </T>
          <T muted>נשאר</T>
        </ProgressRing>
      </View>
      <View style={{ gap: 12 }}>
        {first && <NextUp label="התרגיל הראשון" name={first.name} />}
        <Button title="דלג" variant="secondary" onPress={onSkip} />
      </View>
    </Enter>
  )
}

function Exercise({ workout, now, onDone }) {
  const i = workout.currentIndex
  const total = workout.exercises.length
  const ex = exerciseInfo(workout.exercises[i].id) ?? workout.exercises[i]
  const next = workout.exercises[i + 1]
  const elapsed = now - workout.exerciseStartedAt

  return (
    <Enter id={ex.id}>
      <T weight="bold" muted style={[{ fontSize: 18 }, nums]}>
        תרגיל {i + 1} מתוך {total}
      </T>
      <T weight="black" style={{ fontSize: 44, lineHeight: 54, marginTop: 2 }}>
        {ex.name}
      </T>
      {!!ex.note && (
        <T muted style={{ fontSize: 20, marginTop: 4 }}>
          {ex.note}
        </T>
      )}

      <View style={[row, { gap: 12, marginTop: 20, alignItems: 'stretch' }]}>
        <Card style={{ flex: 1, padding: 16 }}>
          <Label>סטים × חזרות</Label>
          <T weight="black" style={[{ fontSize: 28, marginTop: 2 }, nums]}>
            {ex.sets} × {ex.reps}
          </T>
        </Card>
        <Card style={{ flex: 1, padding: 16 }}>
          <Label>מנוחה בין סטים</Label>
          <T weight="black" style={[{ fontSize: 28, marginTop: 2 }, nums]}>
            {ex.restSec}
            <T weight="bold" muted style={{ fontSize: 18 }}>
              {' '}
              שנ׳
            </T>
          </T>
        </Card>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
        <Label>זמן בתרגיל</Label>
        <T weight="black" muted style={[{ fontSize: 60 }, nums]}>
          {formatClock(elapsed)}
        </T>
      </View>

      <View style={{ gap: 12 }}>
        <NextUp label="הבא בתור" name={next ? next.name : 'סיכום האימון'} />
        <Button title="סיימתי תרגיל" size="xl" onPress={onDone} />
      </View>
    </Enter>
  )
}

function NextUp({ label, name }) {
  const c = useTheme()
  return (
    <View style={[row, { justifyContent: 'space-between', borderWidth: 1, borderColor: c.line, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12 }]}>
      <T muted>{label}</T>
      <T weight="bold" style={{ fontSize: 18 }}>
        {name}
      </T>
    </View>
  )
}

function Summary({ workout, previous, onSave }) {
  const c = useTheme()
  const total = workout.endedAt - workout.startedAt
  const prevById = new Map(previous?.exercises.map((e) => [e.id, e.durationMs]) ?? [])

  return (
    <Enter id="summary">
      <T weight="black" style={{ fontSize: 36 }}>
        {workout.endedEarly ? 'האימון הסתיים' : 'כל הכבוד!'}
      </T>
      <T muted style={{ fontSize: 18 }}>
        {workout.endedEarly ? `הושלמו ${workout.completed.length} מתוך ${workout.exercises.length} תרגילים` : 'סיימת את כל התרגילים'}
      </T>

      <Card style={{ padding: 20, marginTop: 20 }}>
        <Label>משך כולל</Label>
        <T weight="black" style={[{ fontSize: 52, lineHeight: 60 }, nums]}>
          {formatClock(total)}
        </T>
        {previous ? (
          <View style={[row, { justifyContent: 'space-between', borderTopWidth: 1, borderColor: c.line, marginTop: 12, paddingTop: 12 }]}>
            <View>
              <T muted style={[{ fontSize: 14 }, nums]}>
                אימון קודם · {formatDate(previous.startedAt)}
              </T>
              <T weight="bold" style={nums}>
                {formatClock(previous.durationMs)}
              </T>
            </View>
            <Diff ms={total - previous.durationMs} size={24} />
          </View>
        ) : (
          <T muted style={{ marginTop: 8 }}>
            זה האימון הראשון שלך – מכאן יתחילו ההשוואות.
          </T>
        )}
      </Card>

      <Card style={{ marginTop: 12 }}>
        {workout.warmupMs != null && <Row name="חימום" ms={workout.warmupMs} first />}
        {workout.completed.map((x, idx) => (
          <Row key={x.id} name={x.name} ms={x.durationMs} prev={prevById.get(x.id)} first={idx === 0 && workout.warmupMs == null} />
        ))}
        {workout.completed.length === 0 && (
          <T muted style={{ padding: 16 }}>
            לא הושלמו תרגילים
          </T>
        )}
      </Card>

      <View style={{ flex: 1, minHeight: 24 }} />
      <Button title="סיים ושמור" size="xl" onPress={onSave} />
    </Enter>
  )
}

function Row({ name, ms, prev, first }) {
  const c = useTheme()
  return (
    <View style={[row, { justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: first ? 0 : 1, borderColor: c.line }]}>
      <T weight="bold" style={{ fontSize: 18, flexShrink: 1 }}>
        {name}
      </T>
      <View style={[row, { gap: 8 }]}>
        {prev != null && <Diff ms={ms - prev} size={14} />}
        <T weight="black" style={[{ fontSize: 20 }, nums]}>
          {formatClock(ms)}
        </T>
      </View>
    </View>
  )
}

// מהיר יותר = ירוק, איטי יותר = אדום
function Diff({ ms, size }) {
  const c = useTheme()
  const same = Math.abs(ms) < 1000
  const color = same ? c.muted : ms < 0 ? c.good : c.bad
  const style = [{ fontSize: size, color }, nums]
  if (same)
    return (
      <T weight="bold" style={style}>
        אותו זמן
      </T>
    )
  // הסימן בשורה נפרדת משמאל למספר, כדי שלא יקפוץ לצד השני בטקסט מימין לשמאל
  return (
    <View style={{ direction: 'ltr', flexDirection: 'row', alignItems: 'baseline' }}>
      <T weight="bold" style={style}>
        {ms < 0 ? '−' : '+'}
      </T>
      <T weight="bold" style={style}>
        {formatClock(Math.abs(ms))}
      </T>
    </View>
  )
}
