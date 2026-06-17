import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { PlayCircle } from 'lucide-react-native';

import { useDataStore } from '@/stores/dataStore';
import { useSessionStore } from '@/stores/sessionStore';
import TimerRing from '@/components/TimerRing';

export default function PauzetimerScreen() {
  const settings = useDataStore((state) => state.data?.settings);
  const clearSession = useSessionStore((state) => state.clearSession);

  // We gebruiken local state voor de timer omdat dit een losse sessie is
  const breakLengthSec = (settings?.break_length_min ?? 5) * 60;
  const [timeLeft, setTimeLeft] = useState(breakLengthSec);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleDone();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleDone = () => {
    clearSession();
    router.replace('/(app)');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progress = 1 - (timeLeft / breakLengthSec);

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-gray-400 text-sm tracking-wider uppercase mb-8" style={{ fontFamily: 'Karla_700Bold' }}>
        Pauze
      </Text>
      
      <Text className="text-gray-900 text-2xl text-center mb-16 leading-tight px-4" style={{ fontFamily: 'Karla_700Bold' }}>
        Even de benen strekken
      </Text>

      {/* Grote Timer Ring (Blauw voor pauze) */}
      <View className="items-center justify-center mb-16">
        <TimerRing progress={progress} size={280} strokeWidth={12} color="#3b82f6" />
        <View className="absolute items-center justify-center">
          <Text className="text-gray-900 text-6xl tabular-nums tracking-tighter" style={{ fontFamily: 'Karla_700Bold' }}>
            {timeString}
          </Text>
        </View>
      </View>

      <Pressable 
        onPress={handleDone}
        className="flex-row items-center justify-center bg-gray-100 px-6 py-3 rounded-full active:bg-gray-200"
      >
        <PlayCircle color="#4b5563" size={20} className="mr-2" />
        <Text className="text-gray-700 text-base" style={{ fontFamily: 'Karla_600SemiBold' }}>
          Skip break
        </Text>
      </Pressable>
    </View>
  );
}
