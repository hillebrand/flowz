import { View, Text, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Lock, Mail, User } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Mock registration logic
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-white pt-12 px-6">
      <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-gray-100 self-start mb-6">
        <ArrowLeft color="#374151" size={24} />
      </Pressable>

      <View className="w-full max-w-sm self-center flex-1">
        <View className="mb-10">
          <Text className="text-3xl text-gray-900 mb-2" style={{ fontFamily: 'Karla_700Bold' }}>Account aanmaken</Text>
          <Text className="text-base text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
            Begin vandaag nog met een rustiger hoofd.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2 ml-1" style={{ fontFamily: 'Karla_600SemiBold' }}>Voornaam</Text>
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus:border-primary focus:bg-white">
            <User color="#9CA3AF" size={20} className="mr-3" />
            <TextInput 
              className="flex-1 text-base text-gray-900"
              style={{ fontFamily: 'Karla_400Regular' }}
              value={name}
              onChangeText={setName}
              placeholder="Bijv. Evelien"
            />
          </View>
        </View>

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
              placeholder="Minimaal 8 tekens"
              secureTextEntry
            />
          </View>
        </View>

        <Pressable 
          onPress={handleRegister}
          className="bg-primary py-4 rounded-xl items-center shadow-sm active:bg-indigo-600 flex-row justify-center mb-6"
        >
          <Text className="text-white text-lg mr-2" style={{ fontFamily: 'Karla_700Bold' }}>Aanmelden</Text>
          <ArrowRight color="white" size={20} />
        </Pressable>
      </View>
    </View>
  );
}
