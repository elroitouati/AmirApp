import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Card, T, row } from './ui'
import { formatClock, formatDate } from '../lib/time'
import { nums, useTheme } from '../theme'

const MAX_BARS = 12
const CHART_H = 140

// גרף עמודות של משך האימונים. לחיצה על עמודה מציגה את הערך שלה.
export default function DurationChart({ history }) {
  const c = useTheme()
  const items = history.slice(0, MAX_BARS).reverse() // מהישן לחדש, משמאל לימין
  const [selectedId, setSelectedId] = useState(null)
  if (items.length < 2) return null

  const selected = items.find((w) => w.id === selectedId) ?? items[items.length - 1]
  const maxMin = Math.max(...items.map((w) => w.durationMs / 60000))
  const top = Math.max(5, Math.ceil(maxMin / 5) * 5)
  const ticks = [top, top / 2, 0]

  return (
    <Card style={{ padding: 16 }}>
      <View style={[row, { justifyContent: 'space-between' }]}>
        <T weight="bold" style={{ fontSize: 18 }}>
          משך אימונים
        </T>
        <T muted style={[{ fontSize: 14 }, nums]}>
          {formatDate(selected.startedAt)} ·{' '}
          <T weight="bold" style={[{ fontSize: 14 }, nums]}>
            {formatClock(selected.durationMs)}
          </T>
        </T>
      </View>

      {/* הגרף עצמו משמאל לימין, כמקובל בצירי זמן */}
      <View style={{ direction: 'ltr', flexDirection: 'row', gap: 8, marginTop: 16 }}>
        <View style={{ height: CHART_H, justifyContent: 'space-between' }}>
          {ticks.map((t) => (
            <T key={t} muted style={[{ fontSize: 11, lineHeight: 12, marginVertical: -6 }, nums]}>
              {t}′
            </T>
          ))}
        </View>
        <View style={{ flex: 1, height: CHART_H }}>
          {ticks.map((t) => (
            <View key={t} style={{ position: 'absolute', left: 0, right: 0, bottom: (t / top) * CHART_H, borderTopWidth: 1, borderColor: c.line }} />
          ))}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
            {items.map((w) => {
              const isSel = w.id === selected.id
              return (
                <Pressable
                  key={w.id}
                  onPress={() => setSelectedId(w.id)}
                  accessibilityLabel={`${formatDate(w.startedAt)}: ${formatClock(w.durationMs)}`}
                  style={{ flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}
                >
                  <LinearGradient
                    colors={c.accent}
                    style={{
                      width: '100%',
                      maxWidth: 28,
                      height: Math.max(2, (w.durationMs / 60000 / top) * CHART_H),
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      opacity: isSel ? 1 : 0.45,
                    }}
                  />
                </Pressable>
              )
            })}
          </View>
        </View>
      </View>
      <View style={{ direction: 'ltr', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 28, marginTop: 6 }}>
        <T muted style={[{ fontSize: 11 }, nums]}>
          {formatDate(items[0].startedAt)}
        </T>
        <T muted style={[{ fontSize: 11 }, nums]}>
          {formatDate(items[items.length - 1].startedAt)}
        </T>
      </View>
    </Card>
  )
}
