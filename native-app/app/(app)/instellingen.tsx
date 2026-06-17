import { View, Text, Switch, Pressable, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Clock, LogOut, ChevronRight, CalendarDays, RefreshCw } from 'lucide-react-native';
import { useState } from 'react';

import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

export default function InstellingenScreen() {
  const { data, saveData } = useDataStore();
  const { logout } = useAuthStore();
  const settings = data?.settings;

  const [reminderEnabled, setReminderEnabled] = useState(settings?.reminder_enabled ?? true);
  const [sessionLength, setSessionLength] = useState(String(settings?.session_length_min ?? 45));
  const [breakLength, setBreakLength] = useState(String(settings?.break_length_min ?? 10));

  const handleSave = () => {
    if (!data || !settings) return;
    
    saveData({
      ...data,
      settings: {
        ...settings,
        reminder_enabled: reminderEnabled,
        session_length_min: parseInt(sessionLength) || 45,
        break_length_min: parseInt(breakLength) || 10
      }
    }, 'mock-token');
    router.back();
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  if (!settings) return null;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-4 pt-12">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
          <ArrowLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>
          Instellingen
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4 pb-12">
        {/* Tijd instellingen */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <Text className="text-sm text-gray-500 uppercase tracking-wider mb-4" style={{ fontFamily: 'Karla_700Bold' }}>
            Sessies & Pauzes
          </Text>
          
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <Clock color="#4B5563" size={20} className="mr-3" />
              <Text className="text-base text-gray-900" style={{ fontFamily: 'Karla_500Medium' }}>Sessieduur (min)</Text>
            </View>
            <TextInput 
              className="bg-gray-50 rounded-lg px-4 py-2 text-base w-20 text-center"
              keyboardType="number-pad"
              value={sessionLength}
              onChangeText={setSessionLength}
              style={{ fontFamily: 'Karla_600SemiBold' }}
            />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Clock color="#4B5563" size={20} className="mr-3" />
              <Text className="text-base text-gray-900" style={{ fontFamily: 'Karla_500Medium' }}>Pauzeduur (min)</Text>
            </View>
            <TextInput 
              className="bg-gray-50 rounded-lg px-4 py-2 text-base w-20 text-center"
              keyboardType="number-pad"
              value={breakLength}
              onChangeText={setBreakLength}
              style={{ fontFamily: 'Karla_600SemiBold' }}
            />
          </View>
        </View>

        {/* Notificaties */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <Text className="text-sm text-gray-500 uppercase tracking-wider mb-4" style={{ fontFamily: 'Karla_700Bold' }}>
            Notificaties
          </Text>
          
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Bell color="#4B5563" size={20} className="mr-3" />
              <Text className="text-base text-gray-900" style={{ fontFamily: 'Karla_500Medium' }}>Dagelijkse reminder</Text>
            </View>
            <Switch 
              value={reminderEnabled} 
              onValueChange={setReminderEnabled}
              trackColor={{ false: "#D1D5DB", true: "#6366F1" }}
              thumbColor={"#FFFFFF"}
            />
          </View>
        </View>

        {/* Links */}
        <View className="bg-white rounded-2xl p-2 shadow-sm mb-6">
          <Pressable 
            onPress={() => router.push('/(app)/beschikbaarheid')}
            className="flex-row items-center justify-between p-3 active:bg-gray-50 rounded-xl"
          >
            <View className="flex-row items-center">
              <CalendarDays color="#4B5563" size={20} className="mr-3" />
              <Text className="text-base text-gray-900" style={{ fontFamily: 'Karla_500Medium' }}>Beheer beschikbaarheid</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </Pressable>
          
          <View className="h-px bg-gray-100 mx-3" />

          <Pressable 
            className="flex-row items-center justify-between p-3 active:bg-gray-50 rounded-xl opacity-50"
          >
            <View className="flex-row items-center">
              <RefreshCw color="#4B5563" size={20} className="mr-3" />
              <Text className="text-base text-gray-900" style={{ fontFamily: 'Karla_500Medium' }}>Magister Sync (Mock)</Text>
            </View>
            <ChevronRight color="#9CA3AF" size={20} />
          </Pressable>
        </View>

        {/* Opslaan & Log out */}
        <Pressable 
          onPress={handleSave}
          className="bg-primary py-4 rounded-xl items-center shadow-sm active:bg-indigo-600 mb-6"
        >
          <Text className="text-white text-base" style={{ fontFamily: 'Karla_700Bold' }}>Opslaan</Text>
        </Pressable>

        <Pressable 
          onPress={handleLogout}
          className="bg-white border border-red-200 py-4 rounded-xl items-center active:bg-red-50 mb-12 flex-row justify-center"
        >
          <LogOut color="#EF4444" size={20} className="mr-2" />
          <Text className="text-red-600 text-base" style={{ fontFamily: 'Karla_700Bold' }}>Uitloggen</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
