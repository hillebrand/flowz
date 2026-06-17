import { View, Text, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';

import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const { setToken } = useAuthStore();
  const [email, setEmail] = useState('evelien@flowz.app');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vul je email en wachtwoord in.');
      return;
    }
    setError('');

    // Mock backend login
    if (email.includes('@') && password.length >= 6) {
      // Mock een token met username in the store
      await setToken('mock-jwt-token-12345', email);
      // layout.tsx will redirect automatically to /(app)
    } else {
      setError('Ongeldige inloggegevens.');
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="w-full max-w-sm">
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-indigo-100 rounded-3xl mb-6 items-center justify-center">
            <Text className="text-4xl">🌊</Text>
          </View>
          <Text className="text-3xl text-gray-900 mb-2" style={{ fontFamily: 'Karla_700Bold' }}>Welkom bij Flowz</Text>
          <Text className="text-base text-gray-500 text-center" style={{ fontFamily: 'Karla_400Regular' }}>
            Log in om je taken en planning te beheren.
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
            <Text className="text-red-600 text-sm text-center" style={{ fontFamily: 'Karla_500Medium' }}>{error}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2 ml-1" style={{ fontFamily: 'Karla_600SemiBold' }}>E-mailadres</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus:border-primary focus:bg-white">
            <Mail color="#9CA3AF" size={20} className="mr-3" />
            <TextInput 
              className="flex-1 text-base text-gray-900"
              style={{ fontFamily: 'Karla_400Regular' }}
              value={email}
              onChangeText={setEmail}
              placeholder="naam@school.nl"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-sm text-gray-700 mb-2 ml-1" style={{ fontFamily: 'Karla_600SemiBold' }}>Wachtwoord</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus:border-primary focus:bg-white">
            <Lock color="#9CA3AF" size={20} className="mr-3" />
            <TextInput 
              className="flex-1 text-base text-gray-900"
              style={{ fontFamily: 'Karla_400Regular' }}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>
          <Pressable onPress={() => router.push('/(auth)/forgot-password')} className="mt-3 self-end">
            <Text className="text-primary text-sm" style={{ fontFamily: 'Karla_600SemiBold' }}>Wachtwoord vergeten?</Text>
          </Pressable>
        </View>

        <Pressable 
          onPress={handleLogin}
          className="bg-primary py-4 rounded-xl items-center shadow-sm active:bg-indigo-600 flex-row justify-center mb-6"
        >
          <Text className="text-white text-lg mr-2" style={{ fontFamily: 'Karla_700Bold' }}>Inloggen</Text>
          <ArrowRight color="white" size={20} />
        </Pressable>

        <View className="flex-row justify-center">
          <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Karla_400Regular' }}>Nog geen account? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text className="text-primary text-sm" style={{ fontFamily: 'Karla_700Bold' }}>Meld je aan</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
