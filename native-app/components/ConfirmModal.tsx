import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ visible, title, message, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-3xl bg-white p-6">
          <Text className="mb-2 text-lg text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
            {title}
          </Text>
          <Text className="mb-6 text-sm text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
            {message}
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 items-center rounded-2xl border-2 border-gray-200 py-3"
            >
              <Text className="text-gray-600" style={{ fontFamily: 'Karla_500Medium' }}>
                Annuleren
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="flex-1 items-center rounded-2xl bg-primary py-3">
              <Text className="text-white" style={{ fontFamily: 'Karla_600SemiBold' }}>
                Bevestigen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
