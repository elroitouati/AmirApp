import { View } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { useTheme } from '../theme'

// טבעת התקדמות כסופה עם "ראש" בקצה – בהשראת העיגול עם החץ בלוגו
export default function ProgressRing({ progress, size = 270, stroke = 14, children }) {
  const c = useTheme()
  const r = (size - stroke) / 2 - 8
  const circ = 2 * Math.PI * r
  const p = Math.min(1, Math.max(0, progress))
  const angle = -Math.PI / 2 + p * 2 * Math.PI
  const cx = size / 2
  // ה-SVG לא מושפע מ-RTL, אז ההתקדמות תמיד עם כיוון השעון
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={c.accent[0]} />
            <Stop offset="1" stopColor={c.accent[1]} />
          </LinearGradient>
        </Defs>
        <Circle cx={cx} cy={cx} r={r} stroke={c.surface} strokeWidth={stroke} fill="none" />
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="url(#silver)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - p)}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
        {p > 0.01 && (
          <Circle cx={cx + r * Math.cos(angle)} cy={cx + r * Math.sin(angle)} r={stroke * 0.85} fill={c.accent[0]} stroke={c.bg} strokeWidth={3} />
        )}
      </Svg>
      {children}
    </View>
  )
}
