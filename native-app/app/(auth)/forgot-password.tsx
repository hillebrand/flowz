import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
        Wachtwoord vergeten
      </Text>
      <Text className="mt-2 text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
        Resetflow stub.
      </Text>
      <Link href="/(auth)/reset-password?token=demo-token" className="mt-6 text-primary">
        Test reset-deeplink
      </Link>
    </View>
  );
}
