import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { DEFAULT_SETTINGS, useDataStore } from '@/stores/dataStore';
import type { AppData } from '@/types';

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

const MONTH_NL = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
];

// Calendar weeks start on Monday (ISO)
const CAL_HEADERS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Convert to Monday-based: Mon=0, Tue=1, ..., Sun=6
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function displayMinutes(minutes: number): string {
  if (minutes === 0) return 'Vrij';
  return `${minutes} min`;
}

export default function BeschikbaarheidScreen() {
  const data = useDataStore((state) => state.data);
  const saveData = useDataStore((state) => state.saveData);
  const token = useAuthStore((state) => state.token);

  const settings = data?.settings ?? DEFAULT_SETTINGS;
  const capacityWeek = settings.capacity_week;
  const capacityOverrides = settings.capacity_overrides;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [bottomSheetDate, setBottomSheetDate] = useState<string | null>(null);
  const [bottomSheetMinutes, setBottomSheetMinutes] = useState(60);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function triggerToast() {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 1500);
  }

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const persistSettings = useCallback(
    (partialSettings: Partial<typeof settings>) => {
      if (!data || !token) return;
      const updated: AppData = {
        ...data,
        settings: { ...settings, ...partialSettings },
      };
      saveData(updated, token);
      triggerToast();
    },
    [data, settings, token, saveData],
  );

  function updateWeekDay(dayKey: string, delta: number) {
    const current = capacityWeek[dayKey] ?? 60;
    const next = Math.max(0, Math.min(300, current + delta));
    persistSettings({ capacity_week: { ...capacityWeek, [dayKey]: next } });
  }

  function openDayPicker(dateStr: string) {
    const existing = capacityOverrides[dateStr];
    const fallback = (() => {
      const d = new Date(dateStr + 'T00:00:00');
      const dayKey = DAY_KEYS[(d.getDay() + 6) % 7];
      return capacityWeek[dayKey] ?? 60;
    })();
    setBottomSheetMinutes(existing ?? fallback);
    setBottomSheetDate(dateStr);
  }

  function saveOverride() {
    if (!bottomSheetDate) return;
    persistSettings({
      capacity_overrides: { ...capacityOverrides, [bottomSheetDate]: bottomSheetMinutes },
    });
    setBottomSheetDate(null);
  }

  function clearAllOverrides() {
    persistSettings({ capacity_overrides: {} });
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  }

  function nextMonth() {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  }

  const calDays = buildCalendarDays(calYear, calMonth);
  const overrideCount = Object.keys(capacityOverrides).length;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-100 bg-white px-4 py-4">
        <Pressable onPress={() => router.back()} className="w-10">
          <Text className="text-base text-gray-900" style={{ fontFamily: 'Karla_400Regular' }}>
            ←
          </Text>
        </Pressable>
        <Text
          className="flex-1 text-center text-base text-gray-900"
          style={{ fontFamily: 'Karla_700Bold' }}
        >
          Beschikbaarheid
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-20 gap-4">
        {/* Weekcapaciteit card */}
        <View className="rounded-2xl bg-white px-4 py-4">
          <Text
            className="mb-1 text-xs text-gray-500"
            style={{ fontFamily: 'Karla_700Bold' }}
          >
            WEEKCAPACITEIT
          </Text>
          <Text
            className="mb-4 text-xs text-gray-400"
            style={{ fontFamily: 'Karla_400Regular' }}
          >
            Hoeveel minuten studeer je standaard op deze dag?
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {DAY_KEYS.map((dayKey, i) => {
              const value = capacityWeek[dayKey] ?? 60;
              return (
                <View key={dayKey} className="items-center" style={{ width: '12%', minWidth: 42 }}>
                  <Text
                    className="mb-1 text-xs text-gray-400"
                    style={{ fontFamily: 'Karla_400Regular' }}
                  >
                    {DAY_LABELS_SHORT[i]}
                  </Text>
                  <Pressable
                    onPress={() => updateWeekDay(dayKey, -15)}
                    className="h-7 w-7 items-center justify-center rounded-full bg-gray-100"
                  >
                    <Text className="text-sm text-gray-500">−</Text>
                  </Pressable>
                  <Text
                    className={`my-1 text-sm ${value === 0 ? 'text-gray-400' : 'text-gray-900'}`}
                    style={{ fontFamily: 'Karla_600SemiBold' }}
                  >
                    {displayMinutes(value)}
                  </Text>
                  <Pressable
                    onPress={() => updateWeekDay(dayKey, 15)}
                    className="h-7 w-7 items-center justify-center rounded-full bg-gray-100"
                  >
                    <Text className="text-sm text-gray-500">+</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        {/* Datum-overrides card */}
        <View className="rounded-2xl bg-white px-4 py-4">
          <Text
            className="mb-1 text-xs text-gray-500"
            style={{ fontFamily: 'Karla_700Bold' }}
          >
            DATUM-OVERRIDES
          </Text>
          <Text
            className="mb-4 text-xs text-gray-400"
            style={{ fontFamily: 'Karla_400Regular' }}
          >
            Tik een datum aan om hem te blokkeren of een afwijkend aantal minuten in te stellen.
          </Text>

          {/* Month navigation */}
          <View className="mb-3 flex-row items-center justify-between">
            <Pressable onPress={prevMonth} className="px-2">
              <Text className="text-lg text-gray-500">‹</Text>
            </Pressable>
            <Text
              className="text-sm text-gray-900"
              style={{ fontFamily: 'Karla_600SemiBold' }}
            >
              {MONTH_NL[calMonth]} {calYear}
            </Text>
            <Pressable onPress={nextMonth} className="px-2">
              <Text className="text-lg text-gray-500">›</Text>
            </Pressable>
          </View>

          {/* Day header */}
          <View className="mb-1 flex-row">
            {CAL_HEADERS.map((h) => (
              <Text
                key={h}
                className="flex-1 text-center text-xs text-gray-400"
                style={{ fontFamily: 'Karla_400Regular' }}
              >
                {h}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex-row flex-wrap">
            {calDays.map((day, idx) => {
              if (!day) return <View key={`empty-${idx}`} style={{ width: `${100 / 7}%` }} />;

              const dateStr = toDateStr(calYear, calMonth, day);
              const isPast = dateStr < todayStr;
              const isToday = dateStr === todayStr;
              const hasOverride = dateStr in capacityOverrides;
              const overrideVal = capacityOverrides[dateStr];
              const isBlocked = hasOverride && overrideVal === 0;

              let bgColor = 'transparent';
              let textColor = isPast ? '#d1d5db' : '#111827';
              if (isBlocked) { bgColor = '#e5e7eb'; textColor = '#9ca3af'; }
              else if (hasOverride) { bgColor = '#ede9fe'; textColor = '#7c3aed'; }

              return (
                <View
                  key={dateStr}
                  style={{ width: `${100 / 7}%`, padding: 2 }}
                >
                  <Pressable
                    onPress={() => !isPast && openDayPicker(dateStr)}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: bgColor,
                      borderWidth: isToday ? 2 : 0,
                      borderColor: '#6366f1',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Karla_500Medium',
                        fontSize: 12,
                        color: textColor,
                      }}
                    >
                      {day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          {/* Clear overrides */}
          {overrideCount > 0 && (
            <Pressable onPress={clearAllOverrides} className="mt-4 items-center">
              <Text
                className="text-xs text-gray-400"
                style={{ fontFamily: 'Karla_400Regular' }}
              >
                Alle datum-overrides wissen ({overrideCount})
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Save toast */}
      {showToast && (
        <View
          style={{
            position: 'absolute',
            top: 80,
            alignSelf: 'center',
            backgroundColor: '#1f2937',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text
            className="text-xs text-white"
            style={{ fontFamily: 'Karla_400Regular' }}
          >
            ✓ Opgeslagen
          </Text>
        </View>
      )}

      {/* Date override bottom sheet */}
      <Modal
        visible={bottomSheetDate !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setBottomSheetDate(null)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setBottomSheetDate(null)}
        />
        <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6">
          <Text
            className="mb-4 text-base text-gray-900"
            style={{ fontFamily: 'Karla_700Bold' }}
          >
            Hoeveel minuten op {bottomSheetDate ?? ''}?
          </Text>

          {/* Stepper */}
          <View className="mb-6 flex-row items-center justify-center gap-6">
            <Pressable
              onPress={() => setBottomSheetMinutes((m) => Math.max(0, m - 15))}
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-lg text-gray-500">−</Text>
            </Pressable>
            <Text
              className={`w-24 text-center text-xl ${bottomSheetMinutes === 0 ? 'text-gray-400' : 'text-gray-900'}`}
              style={{ fontFamily: 'Karla_600SemiBold' }}
            >
              {displayMinutes(bottomSheetMinutes)}
            </Text>
            <Pressable
              onPress={() => setBottomSheetMinutes((m) => Math.min(300, m + 15))}
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-lg text-gray-500">+</Text>
            </Pressable>
          </View>

          {/* Block shortcut */}
          <Pressable
            onPress={() => setBottomSheetMinutes(0)}
            className="mb-3 items-center rounded-xl bg-gray-100 py-3"
          >
            <Text
              className="text-sm text-gray-500"
              style={{ fontFamily: 'Karla_400Regular' }}
            >
              Blokkeren (0 min)
            </Text>
          </Pressable>

          {/* Save */}
          <Pressable
            onPress={saveOverride}
            className="items-center rounded-xl py-4"
            style={{ backgroundColor: '#7DD3FC' }}
          >
            <Text
              className="text-base text-white"
              style={{ fontFamily: 'Karla_600SemiBold' }}
            >
              Opslaan
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
