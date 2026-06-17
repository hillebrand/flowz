import { ScrollView, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';

export default function AfgerondeTakenScreen() {
  const data = useDataStore((state) => state.data);
  const tasks = data?.tasks ?? [];
  
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar */}
      <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-4 pt-12">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
          <ArrowLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>
          Afgeronde Taken
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {doneTasks.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 text-center" style={{ fontFamily: 'Karla_400Regular' }}>
              Nog geen taken afgerond.
            </Text>
          </View>
        ) : (
          <View className="gap-3 pb-8">
            {doneTasks.map(task => (
              <View key={task.id} className="bg-white rounded-xl p-4 shadow-sm flex-row items-center">
                <CheckCircle color="#10B981" size={24} className="mr-3" />
                <View className="flex-1">
                  <Text className="text-gray-900 text-base line-through opacity-60" style={{ fontFamily: 'Karla_600SemiBold' }}>
                    {task.title}
                  </Text>
                  {task.subject && (
                    <Text className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Karla_400Regular' }}>
                      {task.subject}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
