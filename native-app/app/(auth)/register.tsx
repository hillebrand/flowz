import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function RegisterScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
        Registreren
      </Text>
      <Text className="mt-2 text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
        Registratiescherm stub.
      </Text>
      <Link href="/(auth)/login" className="mt-6 text-primary">
        Terug naar login
      </Link>
    </View>
  );
}
