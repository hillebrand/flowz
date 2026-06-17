import { ScrollView, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, ChevronRight, Play } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';
import { useSessionStore } from '@/stores/sessionStore';

export default function SessieVoorbereidingScreen() {
  const data = useDataStore((state) => state.data);
  const taskId = useSessionStore((state) => state.taskId);
  const startSession = useSessionStore((state) => state.startSession);

  const task = data?.tasks.find((t) => t.id === taskId);
  const settings = data?.settings;

  if (!task || !settings) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontFamily: 'Karla_500Medium' }}>Sessie niet gevonden.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 p-4 bg-gray-100 rounded-lg">
          <Text style={{ fontFamily: 'Karla_600SemiBold' }}>Terug</Text>
        </Pressable>
      </View>
    );
  }

  const sessionNumber = task.sessions_done + 1;

  const handleStart = () => {
    // Reset timer net voor de start
    const length = settings.session_length_min * 60;
    startSession(task.id, length);
    router.replace('/(app)/actieve-sessie');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Navbar */}
      <View className="flex-row items-center border-b border-gray-100 bg-white px-4 py-4 pt-12">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
          <ArrowLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>
          Voorbereiding
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Taak info */}
        <View className="mb-8 items-center">
          <Text className="mb-2 text-sm text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Karla_700Bold' }}>
            Sessie {sessionNumber} van {task.sessions_total}
          </Text>
          <Text className="text-center text-2xl text-gray-900 leading-tight" style={{ fontFamily: 'Karla_700Bold' }}>
            {task.title}
          </Text>
        </View>

        {/* Subtaken als checklist voor deze sessie */}
        {task.subtasks && task.subtasks.filter(st => !st.done).length > 0 && (
          <View className="mb-8">
            <Text className="mb-4 text-base text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
              Doel voor deze sessie:
            </Text>
            {task.subtasks.filter(st => !st.done).slice(0, 2).map((st, i) => (
              <View key={i} className="mb-3 flex-row items-start rounded-xl bg-gray-50 p-4 border border-gray-100">
                <View className="mt-0.5 mr-3 h-5 w-5 rounded-full border-2 border-gray-300" />
                <Text className="flex-1 text-base text-gray-700 leading-snug" style={{ fontFamily: 'Karla_500Medium' }}>
                  {st.title}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Materialen (mockup) */}
        {task.materials && task.materials.length > 0 && (
          <View className="mb-8">
            <Text className="mb-4 text-base text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
              Zet klaar:
            </Text>
            {task.materials.map((mat, i) => (
              <View key={i} className="mb-2 flex-row items-center">
                <Text className="mr-3 text-lg">👉</Text>
                <Text className="text-base text-gray-700" style={{ fontFamily: 'Karla_400Regular' }}>
                  {mat}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick tips */}
        <View className="rounded-2xl bg-indigo-50 p-5 mb-8">
          <Text className="mb-2 text-indigo-900 text-base" style={{ fontFamily: 'Karla_700Bold' }}>
            Klaar om te focussen?
          </Text>
          <Text className="text-indigo-800 text-sm leading-relaxed" style={{ fontFamily: 'Karla_400Regular' }}>
            • Leg je telefoon weg (of gebruik Focus mode){'\n'}
            • Pak een glas water{'\n'}
            • Sluit onnodige tabbladen af
          </Text>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View className="px-6 pb-10 pt-4 border-t border-gray-100">
        <Pressable 
          onPress={handleStart}
          className="bg-primary flex-row items-center justify-center py-4 rounded-xl shadow-sm active:opacity-90"
        >
          <Text className="text-white text-lg mr-2" style={{ fontFamily: 'Karla_700Bold' }}>
            Let's go
          </Text>
          <ChevronRight color="white" size={20} />
        </Pressable>
      </View>
    </View>
  );
}
