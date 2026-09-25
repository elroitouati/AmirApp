import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { T, row } from './ui'
import { useTheme } from '../theme'

const TABS = [
  { id: 'home', label: 'בית' },
  { id: 'history', label: 'היסטוריה' },
]

export default function BottomNav({ tab, onChange }) {
  const c = useTheme()
  const insets = useSafeAreaInsets()
  return (
    <View style={[row, { gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 12), borderTopWidth: 1, borderColor: c.line, backgroundColor: c.bg }]}>
      {TABS.map((t) => {
        const active = t.id === tab
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={{ flex: 1, minHeight: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? c.surface : 'transparent' }}
          >
            <T weight="bold" muted={!active} style={{ fontSize: 18 }}>
              {t.label}
            </T>
          </Pressable>
        )
      })}
    </View>
  )
}
