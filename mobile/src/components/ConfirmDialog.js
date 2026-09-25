import { Modal, Pressable, View } from 'react-native'
import { Button, T } from './ui'
import { shadow, useTheme } from '../theme'

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel = 'ביטול', danger, onConfirm, onCancel }) {
  const c = useTheme()
  return (
    <Modal visible={open} transparent statusBarTranslucent navigationBarTranslucent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, direction: 'rtl', justifyContent: 'center', padding: 20 }}>
        <Pressable style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: c.scrim }} onPress={onCancel} />
        <View style={[{ backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: 32, padding: 24, gap: 8 }, shadow]}>
          <T weight="heavy" style={{ fontSize: 24 }}>
            {title}
          </T>
          {!!message && (
            <T muted style={{ fontSize: 16, lineHeight: 24 }}>
              {message}
            </T>
          )}
          <View style={{ gap: 12, marginTop: 16 }}>
            <Button title={confirmLabel} size="md" variant={danger ? 'danger' : 'primary'} onPress={onConfirm} />
            <Button title={cancelLabel} size="md" variant="secondary" onPress={onCancel} haptic={false} />
          </View>
        </View>
      </View>
    </Modal>
  )
}
