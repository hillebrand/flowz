import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useState } from 'react';

import { useDataStore } from '@/stores/dataStore';
import type { Task } from '@/types';
import { toLocalDateStr } from '@/lib/dateUtils';

export default function TaakAanmakenScreen() {
  const { data, saveData } = useDataStore();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [sessionsTotal, setSessionsTotal] = useState('2');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!data || !title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      deadline: toLocalDateStr(new Date(Date.now() + 86400000 * 3)), // Mock 3 days
      sessions_total: parseInt(sessionsTotal) || 1,
      sessions_done: 0,
      complexity: 'medium',
      subtasks: [],
      materials: [],
      status: 'pending',
      source: 'manual',
      magister_id: null,
      created_at: new Date().toISOString()
    };

    saveData({
      ...data,
      tasks: [...data.tasks, newTask]
    }, 'mock-token');

    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-4 pt-12">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
          <ArrowLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg text-gray-900" style={{ fontFamily: 'Karla_600SemiBold' }}>
          Nieuwe Taak
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Karla_600SemiBold' }}>Taaknaam *</Text>
          <TextInput 
            className="bg-gray-50 rounded-xl p-3 text-base mb-4"
            style={{ fontFamily: 'Karla_400Regular' }}
            value={title}
            onChangeText={setTitle}
            placeholder="Bijv. Wiskunde opdrachten"
          />

          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Karla_600SemiBold' }}>Vak</Text>
          <TextInput 
            className="bg-gray-50 rounded-xl p-3 text-base mb-4"
            style={{ fontFamily: 'Karla_400Regular' }}
            value={subject}
            onChangeText={setSubject}
            placeholder="Bijv. Wiskunde B"
          />

          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Karla_600SemiBold' }}>Aantal verwachte sessies</Text>
          <TextInput 
            className="bg-gray-50 rounded-xl p-3 text-base mb-4"
            style={{ fontFamily: 'Karla_400Regular' }}
            keyboardType="numeric"
            value={sessionsTotal}
            onChangeText={setSessionsTotal}
          />
          
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Karla_600SemiBold' }}>Notities / Omschrijving</Text>
          <TextInput 
            className="bg-gray-50 rounded-xl p-3 text-base min-h-[100px]"
            style={{ fontFamily: 'Karla_400Regular' }}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
            placeholder="Extra details..."
          />
        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-100">
        <Pressable 
          onPress={handleSave}
          className={`${!title.trim() ? 'bg-gray-300' : 'bg-primary'} py-4 rounded-xl items-center shadow-sm active:opacity-90 flex-row justify-center`}
          disabled={!title.trim()}
        >
          <Save color="white" size={20} className="mr-2" />
          <Text className="text-white text-lg" style={{ fontFamily: 'Karla_700Bold' }}>Aanmaken</Text>
        </Pressable>
      </View>
    </View>
  );
}
