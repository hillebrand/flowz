import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';

export default function TakenoverzichtScreen() {
  const data = useDataStore((state) => state.data);
  const tasks = data?.tasks ?? [];
  const pendingTasks = tasks.filter(t => t.status !== 'done');

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
            Jouw Backlog
          </Text>
          <Text className="text-gray-500 mt-1" style={{ fontFamily: 'Karla_400Regular' }}>
            {pendingTasks.length} actieve taken
          </Text>
        </View>
        
        <Pressable onPress={() => router.push('/(app)/setup/taak-aanmaken')} className="bg-indigo-50 p-2 rounded-full">
          <Plus color="#6366F1" size={24} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {pendingTasks.map((t) => (
          <View key={t.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-gray-900 text-base mb-1" style={{ fontFamily: 'Karla_600SemiBold' }}>
              {t.title}
            </Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
                {t.subject || 'Algemeen'}
              </Text>
              <Text className="text-gray-400 text-xs" style={{ fontFamily: 'Karla_400Regular' }}>
                {t.sessions_done}/{t.sessions_total} voltooid
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-100">
        <Pressable 
          onPress={() => router.replace('/(app)')}
          className="bg-primary py-4 rounded-xl items-center shadow-sm active:opacity-90 flex-row justify-center"
        >
          <Check color="white" size={20} className="mr-2" />
          <Text className="text-white text-lg" style={{ fontFamily: 'Karla_700Bold' }}>Naar Dashboard</Text>
        </Pressable>
      </View>
    </View>
  );
}
