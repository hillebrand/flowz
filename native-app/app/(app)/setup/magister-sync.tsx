import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import { useState, useEffect } from 'react';

export default function MagisterSyncScreen() {
  const [syncing, setSyncing] = useState(false);

  const startSync = () => {
    setSyncing(true);
    // Mock delay for syncing
    setTimeout(() => {
      router.push('/(app)/setup/import-review');
    }, 2000);
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="items-center mb-12">
        <View className={`w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-6 ${syncing ? 'opacity-50' : ''}`}>
          <RefreshCw color="#6366F1" size={32} />
        </View>
        <Text className="text-2xl text-gray-900 text-center mb-2" style={{ fontFamily: 'Karla_700Bold' }}>
          Magister Koppeling
        </Text>
        <Text className="text-base text-gray-500 text-center px-4" style={{ fontFamily: 'Karla_400Regular' }}>
          Laad automatisch je huiswerk in zodat je niet hoeft over te typen.
        </Text>
      </View>

      {syncing ? (
        <View className="items-center">
          <Text className="text-primary text-lg" style={{ fontFamily: 'Karla_600SemiBold' }}>
            Taken ophalen...
          </Text>
        </View>
      ) : (
        <View className="w-full gap-4">
          <Pressable 
            onPress={startSync}
            className="bg-primary py-4 rounded-xl items-center shadow-sm active:opacity-90"
          >
            <Text className="text-white text-base" style={{ fontFamily: 'Karla_700Bold' }}>Koppel met Magister (Mock)</Text>
          </Pressable>
          <Pressable 
            onPress={() => router.push('/(app)/setup/taak-aanmaken')}
            className="py-4 items-center active:opacity-70"
          >
            <Text className="text-gray-500 text-base" style={{ fontFamily: 'Karla_600SemiBold' }}>Overslaan en handmatig invoeren</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
