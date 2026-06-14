import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { useDataStore } from '@/stores/dataStore';

type Energy = 'low' | 'normal' | 'high';

const OPTIONS: { value: Energy; label: string; sub: string }[] = [
  { value: 'low', label: 'Laag', sub: 'Moe of afgeleid' },
  { value: 'normal', label: 'Normaal', sub: 'Gaat wel' },
  { value: 'high', label: 'Hoog', sub: 'Lekker scherp' },
];

export default function CheckinScreen() {
  const [selected, setSelected] = useState<Energy | null>(null);
  const setCheckin = useDataStore((state) => state.setCheckin);

  function confirm() {
    if (!selected) return;
    setCheckin({
      energy: selected,
      selectedMinutes: null,
      date: new Date().toISOString().slice(0, 10),
    });
    router.replace('/(app)/tijdkeuze' as never);
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-6 pt-16 pb-10"
      keyboardShouldPersistTaps="handled"
    >
      <Text
        className="mb-10 text-3xl text-gray-900"
        style={{ fontFamily: 'Karla_700Bold' }}
      >
        Hoe voel je je vandaag?
      </Text>

      <View className="gap-3">
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setSelected(opt.value)}
              className={`rounded-2xl border-2 px-5 py-4 ${
                isActive ? 'border-primary bg-indigo-50' : 'border-gray-200 bg-white'
              }`}
            >
              <Text
                className={`text-base ${isActive ? 'text-primary' : 'text-gray-800'}`}
                style={{ fontFamily: 'Karla_600SemiBold' }}
              >
                {opt.label}
              </Text>
              <Text
                className="mt-0.5 text-sm text-gray-400"
                style={{ fontFamily: 'Karla_400Regular' }}
              >
                {opt.sub}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selected && (
        <Pressable
          onPress={confirm}
          className="mt-8 rounded-2xl bg-primary px-6 py-4"
        >
          <Text
            className="text-center text-base text-white"
            style={{ fontFamily: 'Karla_600SemiBold' }}
          >
            verder →
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
