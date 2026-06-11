import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
        Wachtwoord resetten
      </Text>
      <Text className="mt-2 text-center text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
        Deeplink token: {token ?? 'geen token ontvangen'}
      </Text>
    </View>
  );
}
