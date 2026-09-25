import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, Modal, PanResponder, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../theme'

const H = Dimensions.get('window').height

// חלון שעולה מלמטה. נסגר בהחלקה למטה, בלחיצה על הרקע או בכפתור "חזרה" של אנדרואיד.
export default function BottomSheet({ open, onClose, children }) {
  const c = useTheme()
  const insets = useSafeAreaInsets()
  const [visible, setVisible] = useState(open)
  const y = useRef(new Animated.Value(H)).current
  const scrollY = useRef(0)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (open) {
      setVisible(true)
      y.setValue(H)
      Animated.timing(y, { toValue: 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
    } else if (visible) {
      Animated.timing(y, { toValue: H, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => setVisible(false))
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx) && scrollY.current <= 0,
      onPanResponderMove: (_, g) => y.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 110 || (g.dy > 40 && g.vy > 0.6)) closeRef.current()
        else Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start()
      },
      onPanResponderTerminate: () => Animated.spring(y, { toValue: 0, useNativeDriver: true }).start(),
    }),
  ).current

  if (!visible) return null

  const backdrop = y.interpolate({ inputRange: [0, H], outputRange: [1, 0], extrapolate: 'clamp' })

  return (
    <Modal visible transparent statusBarTranslucent navigationBarTranslucent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, direction: 'rtl', justifyContent: 'flex-end' }}>
        <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: c.scrim, opacity: backdrop }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="סגור" />
        </Animated.View>
        <Animated.View
          {...pan.panHandlers}
          style={{
            maxHeight: '88%',
            backgroundColor: c.bg,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: c.line,
            transform: [{ translateY: y }],
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
            <View style={{ width: 48, height: 6, borderRadius: 3, backgroundColor: c.line }} />
          </View>
          <ScrollView
            onScroll={(e) => (scrollY.current = e.nativeEvent.contentOffset.y)}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}
