import { Text, View } from 'react-native';

import { useAuthStore } from '@/stores/authStore';

export default function HomeScreen() {
  const email = useAuthStore((state) => state.email);

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <Text className="text-lg text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>
        Shortlist — komt eraan
      </Text>
      <Text className="mt-2 text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
        Ingelogd als: {email ?? 'demo gebruiker'}
      </Text>
    </View>
  );
}
