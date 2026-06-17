import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Coffee, ArrowRight } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';
import { useSessionStore } from '@/stores/sessionStore';
import { toLocalDateStr } from '@/lib/dateUtils';

export default function SessieAfgerondScreen() {
  const { data, saveData } = useDataStore();
  const { taskId, clearSession } = useSessionStore();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    // Increment session logica
    if (!data || !taskId || processed) return;

    const taskIndex = data.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex < 0) return;

    const task = data.tasks[taskIndex];
    const newTasks = [...data.tasks];
    
    // Voeg log entry toe
    const newSessionsLog = [...(data.sessions_log || [])];
    const todayStr = toLocalDateStr(new Date());
    newSessionsLog.push({
      
      task_id: task.id,
      date: todayStr,
      
      
    });

    // Update taak status
    const newDone = task.sessions_done + 1;
    const isFinished = newDone >= task.sessions_total;
    newTasks[taskIndex] = {
      ...task,
      sessions_done: newDone,
      status: isFinished ? 'done' : 'in_progress'
    };

    // Voeg studiedag toe indien nodig
    const newStudyDays = [...(data.study_days || [])];
    if (!newStudyDays.includes(todayStr)) {
      newStudyDays.push(todayStr);
    }

    saveData({
      ...data,
      tasks: newTasks,
      sessions_log: newSessionsLog,
      study_days: newStudyDays
    }, 'mock-token');

    setProcessed(true);
  }, [data, taskId, processed]);

  const handleTakeBreak = () => {
    router.replace('/(app)/pauzetimer');
  };

  const handleBackToDashboard = () => {
    clearSession();
    router.replace('/(app)');
  };

  const task = data?.tasks.find((t) => t.id === taskId);
  const isFinished = task ? task.sessions_done >= task.sessions_total : false;

  return (
    <View className="flex-1 bg-green-50 items-center justify-center px-6">
      <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-8">
        <Text className="text-5xl">🎉</Text>
      </View>

      <Text className="text-3xl text-green-900 text-center mb-4" style={{ fontFamily: 'Karla_700Bold' }}>
        Klasse!
      </Text>

      <Text className="text-lg text-green-800 text-center mb-12" style={{ fontFamily: 'Karla_500Medium' }}>
        Je hebt een focussessie afgerond.
        {isFinished && '\n\nEn daarmee is deze hele taak voltooid!'}
      </Text>

      <View className="w-full gap-4">
        <Pressable 
          onPress={handleTakeBreak}
          className="bg-green-600 flex-row items-center justify-center py-4 rounded-xl shadow-sm active:bg-green-700"
        >
          <Coffee color="white" size={20} className="mr-2" />
          <Text className="text-white text-lg" style={{ fontFamily: 'Karla_700Bold' }}>
            Take a break
          </Text>
        </Pressable>

        <Pressable 
          onPress={handleBackToDashboard}
          className="bg-white border border-green-200 flex-row items-center justify-center py-4 rounded-xl active:bg-gray-50"
        >
          <Text className="text-green-800 text-lg mr-2" style={{ fontFamily: 'Karla_700Bold' }}>
            Back to today
          </Text>
          <ArrowRight color="#166534" size={20} />
        </Pressable>
      </View>
    </View>
  );
}
