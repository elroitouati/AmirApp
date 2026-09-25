import { Pressable, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle, Path } from 'react-native-svg'
import { font, shadow, useTheme } from '../theme'
import { tap } from '../lib/feedback'

// טקסט עם ברירות מחדל של האפליקציה
export function T({ style, weight = 'regular', muted, ...props }) {
  const c = useTheme()
  return <Text style={[font[weight], { color: muted ? c.muted : c.ink, fontSize: 16, writingDirection: 'rtl' }, style]} {...props} />
}

export function Label({ children, style }) {
  return (
    <T weight="medium" muted style={[{ fontSize: 14 }, style]}>
      {children}
    </T>
  )
}

const SIZES = {
  xl: { minHeight: 104, radius: 32, fontSize: 32 },
  lg: { minHeight: 64, radius: 24, fontSize: 20 },
  md: { minHeight: 52, radius: 18, fontSize: 17 },
}

export function Button({ title, onPress, variant = 'primary', size = 'lg', height, style, textStyle, haptic = true }) {
  const c = useTheme()
  const s = SIZES[size]
  const color = variant === 'primary' ? c.onAccent : variant === 'danger' ? c.bad : c.ink
  const label = (
    <T weight="heavy" style={[{ fontSize: s.fontSize, color, textAlign: 'center' }, textStyle]}>
      {title}
    </T>
  )
  const inner = { minHeight: height ?? s.minHeight, borderRadius: s.radius, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (haptic) tap()
        onPress?.()
      }}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }], alignSelf: 'stretch' }, style]}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={c.accent} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={[inner, shadow]}>
          {label}
        </LinearGradient>
      ) : (
        <View style={[inner, { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line }, shadow]}>{label}</View>
      )}
    </Pressable>
  )
}

export function Card({ style, children }) {
  const c = useTheme()
  return (
    <View style={[{ backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: 24 }, shadow, style]}>
      {children}
    </View>
  )
}

export function PlanButton({ onPress }) {
  const c = useTheme()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="התוכנית המלאה"
      hitSlop={8}
      style={({ pressed }) => [
        { width: 46, height: 46, borderRadius: 16, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M9 6h11M9 12h11M9 18h11" stroke={c.muted} strokeWidth={2.2} strokeLinecap="round" />
        <Circle cx={4.5} cy={6} r={1.3} fill={c.muted} />
        <Circle cx={4.5} cy={12} r={1.3} fill={c.muted} />
        <Circle cx={4.5} cy={18} r={1.3} fill={c.muted} />
      </Svg>
    </Pressable>
  )
}

export function Check({ size = 16, color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// שורה מימין לשמאל (השורש של האפליקציה מוגדר direction: rtl)
export const row = { flexDirection: 'row', alignItems: 'center' }
