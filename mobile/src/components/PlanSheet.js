import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import BottomSheet from './BottomSheet'
import { Check, T, row } from './ui'
import { PROGRAM } from '../config/program'
import { DAY_NAMES } from '../lib/time'
import { nums, useTheme } from '../theme'

// workout (אופציונלי) – באמצע אימון: מדגיש את התרגיל הנוכחי ומסמן את מה שהושלם
export default function PlanSheet({ open, onClose, workout }) {
  const c = useTheme()
  const doneIds = new Set(workout?.completed.map((x) => x.id) ?? [])
  const currentId = workout?.phase === 'exercise' ? workout.exercises[workout.currentIndex]?.id : null
  const warmupDone = !!workout && workout.phase !== 'warmup'
  const warmupCurrent = workout?.phase === 'warmup'

  const box = (current) => ({
    borderRadius: 24,
    borderWidth: current ? 1.5 : 1,
    borderColor: current ? c.accent[1] : c.line,
    backgroundColor: current ? c.surface2 : c.surface,
    padding: 16,
  })

  return (
    <BottomSheet open={open} onClose={onClose}>
      <View style={{ gap: 12, paddingTop: 4 }}>
        <View style={{ marginBottom: 8 }}>
          <T weight="black" style={{ fontSize: 30 }}>
            {PROGRAM.title}
          </T>
          <T muted style={{ fontSize: 18 }}>
            {PROGRAM.trainingDays.map((d) => DAY_NAMES[d]).join(' / ')}
          </T>
        </View>

        <View style={[box(warmupCurrent), row, { justifyContent: 'space-between' }]}>
          <View style={[row, { gap: 12 }]}>
            <Badge done={warmupDone} active={warmupCurrent} />
            <T weight="bold" style={{ fontSize: 20 }}>
              חימום
            </T>
          </View>
          <T weight="bold" muted style={[{ fontSize: 17 }, nums]}>
            {Math.round(PROGRAM.warmup.durationSec / 60)} דקות
          </T>
        </View>

        {PROGRAM.exercises.map((ex, i) => {
          const done = doneIds.has(ex.id)
          const current = ex.id === currentId
          return (
            <View key={ex.id} style={[box(current), { opacity: done ? 0.7 : 1 }]}>
              <View style={[row, { alignItems: 'flex-start', gap: 12 }]}>
                <Badge done={done} active={current} number={i + 1} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={[row, { gap: 8, flexWrap: 'wrap' }]}>
                    <T weight="heavy" style={{ fontSize: 20 }}>
                      {ex.name}
                    </T>
                    {current && (
                      <LinearGradient colors={c.accent} style={{ borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1 }}>
                        <T weight="bold" style={{ fontSize: 12, color: c.onAccent }}>
                          עכשיו
                        </T>
                      </LinearGradient>
                    )}
                  </View>
                  {!!ex.note && (
                    <T muted style={{ fontSize: 16 }}>
                      {ex.note}
                    </T>
                  )}
                  <View style={[row, { gap: 8, flexWrap: 'wrap', marginTop: 8 }]}>
                    <Chip>
                      <T weight="bold" style={nums}>
                        {ex.sets} סטים × {ex.reps} חזרות
                      </T>
                    </Chip>
                    <Chip>
                      <T muted style={nums}>
                        מנוחה {ex.restSec} שנ׳
                      </T>
                    </Chip>
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </BottomSheet>
  )
}

function Chip({ children }) {
  const c = useTheme()
  return <View style={{ backgroundColor: c.bg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 }}>{children}</View>
}

function Badge({ done, active, number }) {
  const c = useTheme()
  const size = number ? 36 : 28
  const style = { width: size, height: size, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
  if (done || active)
    return (
      <LinearGradient colors={c.accent} style={style}>
        {done ? (
          <Check size={18} color={c.onAccent} />
        ) : number ? (
          <T weight="black" style={[{ fontSize: 17, color: c.onAccent }, nums]}>
            {number}
          </T>
        ) : null}
      </LinearGradient>
    )
  if (!number) return <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c.line, marginHorizontal: 8 }} />
  return (
    <View style={[style, { backgroundColor: c.surface2 }]}>
      <T weight="black" muted style={[{ fontSize: 17 }, nums]}>
        {number}
      </T>
    </View>
  )
}
