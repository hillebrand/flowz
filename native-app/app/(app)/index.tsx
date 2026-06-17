import { router } from "expo-router";
import { ScrollView, Text, View, Pressable } from 'react-native';

import { useDataStore } from '@/stores/dataStore';
import { useSessionStore } from '@/stores/sessionStore';
import { buildDailyList, isUrgent } from '@/lib/planning';
import { toLocalDateStr } from '@/lib/dateUtils';
import type { Task } from '@/types';

const WEEKDAY_NL = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const MONTH_NL = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

function isTomorrowDeadline(task: Task): boolean {
  if (!task.deadline) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = toLocalDateStr(tomorrow);
  return task.deadline === tomorrowStr;
}

function borderColor(task: Task): string {
  if (task.status === 'done') return '#BEBEBE';
  if (isUrgent(task)) return '#FFB1B1';
  return '#B1DAFF';
}

export default function ShortlistScreen() {
  const data = useDataStore((state) => state.data);
  const selectedMinutes = useSessionStore((state) => state.selectedMinutes);
  const selectedZone = useSessionStore((state) => state.selectedZone);

  const tasks = data?.tasks ?? [];
  const sessionsLog = data?.sessions_log ?? [];
  const sessionLength = data?.settings?.session_length_min ?? 45;

  const dailyList = buildDailyList(tasks, selectedMinutes, selectedZone, sessionsLog, sessionLength);

  const today = new Date();
  const dayLabel = `${WEEKDAY_NL[today.getDay()].toUpperCase()} ${today.getDate()} ${MONTH_NL[today.getMonth()].toUpperCase()}`;
  const todayStr = toLocalDateStr(today);

  const totalSessions = dailyList.reduce((sum, t) => sum + Math.max(0, t.sessions_total - t.sessions_done), 0);
  const doneSessions = sessionsLog.filter(
    (s) => s.date === todayStr && dailyList.some((t) => t.id === s.task_id),
  ).length;

  const allDone = dailyList.length > 0 && dailyList.every((t) => t.status === 'done');
  const isEmpty = dailyList.length === 0;
  const almostDone = !allDone && totalSessions - doneSessions === 1;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-100 bg-white px-4 py-4">
        <View className="flex-1" />
        <Text
          className="flex-1 text-center text-base text-gray-900"
          style={{ fontFamily: 'Karla_700Bold' }}
        >
          Flowz
        </Text>
        <View className="flex-1" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-3 pb-20"
      >
        {/* Deficit banner */}
        {selectedZone === 'red' && (
          <View className="mb-3 flex-row items-start rounded-xl bg-red-50 px-4 py-3">
            <Text className="mr-2 text-base">⚠️</Text>
            <Text
              className="flex-1 text-xs text-red-700"
              style={{ fontFamily: 'Karla_500Medium' }}
            >
              Je loopt achter op je deadlines. Alle kritieke taken zijn hieronder gemarkeerd.
            </Text>
          </View>
        )}

        {/* Almost done banner */}
        {almostDone && (
          <View className="mb-3 rounded-xl bg-indigo-50 px-4 py-3">
            <Text
              className="text-xs text-indigo-700"
              style={{ fontFamily: 'Karla_500Medium' }}
            >
              💪 Nog maar 1 taak te gaan!
            </Text>
          </View>
        )}

        {/* All done banner */}
        {allDone && (
          <View className="mb-3 rounded-xl bg-green-50 px-4 py-3">
            <Text
              className="text-center text-xs text-green-700"
              style={{ fontFamily: 'Karla_700Bold' }}
            >
              🎉 Hoera! Je bent klaar voor vandaag!
            </Text>
          </View>
        )}

        {/* Section header */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text
            className="text-xs text-gray-500"
            style={{ fontFamily: 'Karla_700Bold' }}
          >
            {dayLabel}
          </Text>
          {!isEmpty && (
            <Text
              className="text-xs text-gray-400"
              style={{ fontFamily: 'Karla_700Bold' }}
            >
              {doneSessions}/{totalSessions} SESSIES
            </Text>
          )}
        </View>

        {/* Empty state */}
        {isEmpty && (
          <View className="mt-12 items-center">
            <Text className="mb-2 text-4xl">🌿</Text>
            <Text
              className="text-center text-sm text-gray-500"
              style={{ fontFamily: 'Karla_400Regular' }}
            >
              Niets te doen — geniet van je vrije tijd!
            </Text>
          </View>
        )}

        {/* Task cards */}
        <View className="gap-3">
          {dailyList.map((task) => {
            const urgent = isUrgent(task);
            const tomorrowDl = isTomorrowDeadline(task);
            const border = borderColor(task);
            return (
              <Pressable
                key={task.id} onPress={() => router.push(`/(app)/taak-detail/${task.id}`)}
                className="rounded-xl bg-white px-4 py-3"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Text
                  className={`text-sm ${urgent ? 'text-red-700' : 'text-gray-900'}`}
                  style={{ fontFamily: urgent ? 'Karla_700Bold' : 'Karla_500Medium' }}
                >
                  {task.title}
                </Text>
                <View className="mt-1 flex-row items-center gap-2">
                  {task.subject && (
                    <Text
                      className="text-xs text-gray-400"
                      style={{ fontFamily: 'Karla_400Regular' }}
                    >
                      {task.subject}
                    </Text>
                  )}
                  {tomorrowDl && (
                    <View className="rounded-full bg-red-100 px-2 py-0.5">
                      <Text
                        className="text-xs text-red-600"
                        style={{ fontFamily: 'Karla_400Regular' }}
                      >
                        deadline morgen!
                      </Text>
                    </View>
                  )}
                  {task.sessions_total > 0 && (
                    <Text
                      className="ml-auto text-xs text-gray-300"
                      style={{ fontFamily: 'Karla_400Regular' }}
                    >
                      {task.sessions_done}/{task.sessions_total} sessies
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Add task ghost button */}
        <View className="mt-6 items-center">
          <Text
            className="text-sm text-gray-300"
            style={{ fontFamily: 'Karla_400Regular' }}
          >
            + Taak toevoegen
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

