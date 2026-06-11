import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-4xl text-flowz-purple" style={{ fontFamily: 'Karla_700Bold' }}>
        Flowz
      </Text>
      <Text className="mt-3 text-center text-base text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
        Login — komt eraan
      </Text>
      <View className="mt-10 w-full max-w-sm rounded-3xl border border-flowz-nav bg-indigo-50 px-5 py-6">
        <Text className="text-sm text-gray-600" style={{ fontFamily: 'Karla_500Medium' }}>
          Navigatie staat klaar. Volgende stap: echte authenticatie koppelen.
        </Text>
        <View className="mt-6 flex-row justify-between">
          <Link href="/(auth)/register" className="text-primary">
            Registreren
          </Link>
          <Link href="/(auth)/forgot-password" className="text-primary">
            Wachtwoord vergeten?
          </Link>
        </View>
      </View>
    </View>
  );
}
