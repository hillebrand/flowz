import { ScrollView, Text, View, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Play, Clock, CalendarDays, CheckCircle2, ChevronRight } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';
import { useSessionStore } from '@/stores/sessionStore';
import { isUrgent } from '@/lib/planning';
import type { Task } from '@/types';

export default function TaakDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useDataStore((state) => state.data);
  const saveData = useDataStore((state) => state.saveData);
  const startSession = useSessionStore((state) => state.startSession);

  // Zoek taak
  const taskIndex = data?.tasks.findIndex((t) => t.id === id) ?? -1;
  const task = taskIndex >= 0 ? data!.tasks[taskIndex] : null;

  const [description, setDescription] = useState(task?.description ?? '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  if (!task || !data) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontFamily: 'Karla_500Medium' }}>Taak niet gevonden.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 p-4 bg-gray-100 rounded-lg">
          <Text style={{ fontFamily: 'Karla_600SemiBold' }}>Terug</Text>
        </Pressable>
      </View>
    );
  }

  const urgent = isUrgent(task);

  const saveDescription = async () => {
    const newTasks = [...data.tasks];
    newTasks[taskIndex] = { ...task, description };
    await saveData({ ...data, tasks: newTasks }, 'mock-token'); // Todo: token from auth store
    setIsEditingDesc(false);
  };

  const handleStartSession = () => {
    const length = data.settings.session_length_min * 60;
    startSession(task.id, length);
    router.push('/(app)/sessie-voorbereiding');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar */}
      <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-4 pt-12">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
          <ArrowLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>
          Taak Details
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-24">
        {/* Taak Header Card */}
        <View className="rounded-2xl bg-white p-5 shadow-sm mb-4">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-sm text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Karla_700Bold' }}>
              {task.subject}
            </Text>
            {urgent && (
              <View className="bg-red-100 px-2 py-1 rounded-md">
                <Text className="text-xs text-red-700 uppercase" style={{ fontFamily: 'Karla_700Bold' }}>Urgent</Text>
              </View>
            )}
          </View>
          
          <Text className="text-xl text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Karla_700Bold' }}>
            {task.title}
          </Text>

          {/* Metadata rij */}
          <View className="flex-row flex-wrap gap-y-3">
            <View className="w-1/2 flex-row items-center">
              <CalendarDays color="#6B7280" size={16} className="mr-2" />
              <View>
                <Text className="text-xs text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>Deadline</Text>
                <Text className="text-sm text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>{task.deadline || 'Geen'}</Text>
              </View>
            </View>
            
            <View className="w-1/2 flex-row items-center">
              <Clock color="#6B7280" size={16} className="mr-2" />
              <View>
                <Text className="text-xs text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>Sessies</Text>
                <Text className="text-sm text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>
                  {task.sessions_done} / {task.sessions_total} voltooid
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notities / Omschrijving */}
        <View className="rounded-2xl bg-white p-5 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>Notities & Omschrijving</Text>
            {!isEditingDesc && (
              <Pressable onPress={() => setIsEditingDesc(true)}>
                <Text className="text-primary text-sm" style={{ fontFamily: 'Karla_600SemiBold' }}>Bewerk</Text>
              </Pressable>
            )}
          </View>

          {isEditingDesc ? (
            <View>
              <TextInput
                className="bg-gray-50 rounded-xl p-3 text-gray-900 min-h-[100px] text-base"
                style={{ fontFamily: 'Karla_400Regular' }}
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                placeholder="Voeg aantekeningen toe..."
              />
              <View className="flex-row justify-end mt-3 gap-2">
                <Pressable onPress={() => { setDescription(task.description || ''); setIsEditingDesc(false); }} className="px-4 py-2 rounded-lg bg-gray-100">
                  <Text className="text-gray-700" style={{ fontFamily: 'Karla_600SemiBold' }}>Annuleer</Text>
                </Pressable>
                <Pressable onPress={saveDescription} className="px-4 py-2 rounded-lg bg-primary">
                  <Text className="text-white" style={{ fontFamily: 'Karla_600SemiBold' }}>Opslaan</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text className="text-gray-600 leading-relaxed text-base" style={{ fontFamily: 'Karla_400Regular' }}>
              {task.description || 'Geen notities toegevoegd.'}
            </Text>
          )}
        </View>

        {/* Subtaken */}
        {task.subtasks && task.subtasks.length > 0 && (
          <View className="rounded-2xl bg-white p-5 shadow-sm mb-4">
            <Text className="text-base text-gray-900 mb-4" style={{ fontFamily: 'Karla_700Bold' }}>Subtaken</Text>
            {task.subtasks.map((st, i) => (
              <View key={i} className="flex-row items-center mb-3 last:mb-0">
                <CheckCircle2 color={st.done ? '#10B981' : '#D1D5DB'} size={20} className="mr-3" />
                <Text 
                  className={`text-base ${st.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                  style={{ fontFamily: 'Karla_500Medium' }}
                >
                  {st.title}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-8">
        <Pressable 
          onPress={handleStartSession}
          className="bg-primary flex-row items-center justify-center py-4 rounded-xl shadow-sm active:opacity-90"
        >
          <Play color="white" size={20} fill="white" className="mr-2" />
          <Text className="text-white text-lg" style={{ fontFamily: 'Karla_700Bold' }}>
            Start sessie
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
