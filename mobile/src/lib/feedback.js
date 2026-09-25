import { Vibration } from 'react-native'
import * as Haptics from 'expo-haptics'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'

let player = null

// נקרא פעם אחת בעלייה: הצליל יישמע גם כשהטלפון במצב שקט
export function initFeedback() {
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers' }).catch(() => {})
  try {
    player = createAudioPlayer(require('../../assets/beep.wav'))
  } catch {
    player = null
  }
}

// סוף החימום: צליל + רטט
export function signalDone() {
  try {
    if (player) {
      player.seekTo(0)
      player.play()
    }
  } catch {
    // ignore
  }
  Vibration.vibrate([0, 250, 120, 250, 120, 450])
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
}

// רטט קטן בלחיצה על כפתור ראשי
export function tap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
}
