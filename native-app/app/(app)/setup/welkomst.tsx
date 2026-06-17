import { View, Text, Pressable, Image } from 'react-native';
import { router } from 'expo-router';

export default function WelkomstScreen() {
  return (
    <View className="flex-1 bg-white items-center px-6 pt-24 pb-12">
      <View className="flex-1 items-center justify-center">
        <View className="w-24 h-24 bg-indigo-100 rounded-3xl mb-8 items-center justify-center">
          <Text className="text-4xl">🌊</Text>
        </View>
        
        <Text className="text-3xl text-gray-900 text-center mb-4 leading-tight" style={{ fontFamily: 'Karla_700Bold' }}>
          Krijg weer grip op je huiswerk.
        </Text>
        
        <Text className="text-lg text-gray-500 text-center leading-relaxed" style={{ fontFamily: 'Karla_400Regular' }}>
          Flowz helpt je om zonder nadenken de juiste taken te kiezen, gebaseerd op je energie en deadlines.
        </Text>
      </View>

      <View className="w-full gap-4">
        <Pressable 
          onPress={() => router.push('/(app)/setup/magister-sync')}
          className="bg-primary py-4 rounded-xl items-center shadow-sm active:opacity-90"
        >
          <Text className="text-white text-base" style={{ fontFamily: 'Karla_700Bold' }}>Start setup</Text>
        </Pressable>
      </View>
    </View>
  );
}
