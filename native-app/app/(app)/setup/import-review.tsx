import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Check, CheckCircle2 } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';
import type { Task } from '@/types';

// Mock data
const mockImportedTasks: Task[] = [
  {
    id: 'mock-1',
    title: 'Hoofdstuk 4 Wiskunde Opgaven 1 t/m 15',
    subject: 'Wiskunde B',
    deadline: '2026-06-25',
    sessions_total: 4,
    sessions_done: 0,
    complexity: 'high',
    priority: 'normal',
    subtasks: [],
    materials: ['Boek', 'Schrift', 'Rekenmachine'],
    status: 'pending',
    source: 'magister',
    magister_id: 'mag-1',
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-2',
    title: 'Engels Essay presentatie',
    subject: 'Engels',
    deadline: '2026-06-21',
    sessions_total: 2,
    sessions_done: 0,
    complexity: 'medium',
    priority: 'high',
    subtasks: [],
    materials: ['Laptop'],
    status: 'pending',
    source: 'magister',
    magister_id: 'mag-2',
    created_at: new Date().toISOString()
  }
];

export default function ImportReviewScreen() {
  const { data, saveData } = useDataStore();

  const handleConfirm = () => {
    if (!data) return;
    
    // Voeg mock data toe aan store
    saveData({
      ...data,
      tasks: [...data.tasks, ...mockImportedTasks]
    }, 'mock-token');

    router.push('/(app)/setup/takenoverzicht');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-16 pb-6 px-6 bg-white border-b border-gray-100">
        <Text className="text-2xl text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
          2 taken gevonden
        </Text>
        <Text className="text-gray-500 mt-2" style={{ fontFamily: 'Karla_400Regular' }}>
          Kijk even of dit klopt. Je kunt later altijd nog details aanpassen.
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {mockImportedTasks.map((t) => (
          <View key={t.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
            <CheckCircle2 color="#10B981" size={24} className="mr-3" />
            <View className="flex-1">
              <Text className="text-gray-900 text-base mb-1" style={{ fontFamily: 'Karla_600SemiBold' }}>
                {t.title}
              </Text>
              <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Karla_400Regular' }}>
                {t.subject} • {t.sessions_total} sessies
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-100">
        <Pressable 
          onPress={handleConfirm}
          className="bg-primary py-4 rounded-xl items-center shadow-sm active:opacity-90 flex-row justify-center"
        >
          <Check color="white" size={20} className="mr-2" />
          <Text className="text-white text-lg" style={{ fontFamily: 'Karla_700Bold' }}>Importeren</Text>
        </Pressable>
      </View>
    </View>
  );
}
