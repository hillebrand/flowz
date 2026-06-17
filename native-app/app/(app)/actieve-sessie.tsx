import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { StopCircle } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';
import { useSessionStore } from '@/stores/sessionStore';
import TimerRing from '@/components/TimerRing';

export default function ActieveSessieScreen() {
  const data = useDataStore((state) => state.data);
  const { taskId, endTimestamp } = useSessionStore();
  const task = data?.tasks.find((t) => t.id === taskId);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endTimestamp) {
      router.replace('/(app)');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTimestamp - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        router.replace('/(app)/sessie-afgerond');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTimestamp]);

  if (!task || !endTimestamp) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const sessionLengthSec = (data?.settings.session_length_min ?? 45) * 60;
  const progress = 1 - (timeLeft / sessionLengthSec);

  const handleFinishEarly = () => {
    router.replace('/(app)/sessie-afgerond');
  };

  return (
    <View className="flex-1 bg-primary items-center justify-center px-6">
      <Text className="text-white/80 text-sm tracking-wider uppercase mb-8" style={{ fontFamily: 'Karla_700Bold' }}>
        Focus op
      </Text>
      
      <Text className="text-white text-2xl text-center mb-16 leading-tight px-4" style={{ fontFamily: 'Karla_700Bold' }}>
        {task.title}
      </Text>

      {/* Grote Timer Ring */}
      <View className="items-center justify-center mb-16">
        <TimerRing progress={progress} size={280} strokeWidth={12} color="rgba(255,255,255,0.9)" />
        <View className="absolute items-center justify-center">
          <Text className="text-white text-6xl tabular-nums tracking-tighter" style={{ fontFamily: 'Karla_700Bold' }}>
            {timeString}
          </Text>
        </View>
      </View>

      <Pressable 
        onPress={handleFinishEarly}
        className="flex-row items-center justify-center bg-white/20 px-6 py-3 rounded-full active:bg-white/30"
      >
        <StopCircle color="white" size={20} className="mr-2" />
        <Text className="text-white text-base" style={{ fontFamily: 'Karla_600SemiBold' }}>
          Finish early
        </Text>
      </Pressable>
    </View>
  );
}
