import { useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { DEFAULT_SETTINGS, useDataStore } from '@/stores/dataStore';
import { useSessionStore } from '@/stores/sessionStore';
import { calculateZones, getCapacityForDate, getSliderFeedback } from '@/lib/planning';

const MAX_MINUTES = 300;
const TRACK_HEIGHT = 280;


const ZONE_COLORS = { red: '#ef4444', orange: '#fb923c', green: '#22c55e' } as const;
type Zone = 'red' | 'orange' | 'green';

function minutesToDisplay(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} uur ${m} min` : `${h} uur`;
}

export default function TijdkeuzeScreen() {
  const data = useDataStore((state) => state.data);
  const { setCheckinChoice } = useSessionStore();

  const settings = data?.settings ?? DEFAULT_SETTINGS;
  const tasks = data?.tasks ?? [];

  const today = new Date();
  const macroMinutes = getCapacityForDate(settings, today);
  const zones = calculateZones(tasks, settings, today);

  const initialThumbY = (macroMinutes / MAX_MINUTES) * TRACK_HEIGHT;
  const startYRef = useRef(initialThumbY);
  const thumbYRef = useRef(initialThumbY);

  const [minutes, setMinutes] = useState(macroMinutes);

  function getZone(mins: number): Zone {
    if (mins < zones.thresholdRed) return 'red';
    if (mins < zones.thresholdGreen) return 'orange';
    return 'green';
  }

  const zone = getZone(minutes);
  const zoneColor = ZONE_COLORS[zone];

  const redH = (zones.thresholdRed / MAX_MINUTES) * TRACK_HEIGHT;
  const greenH = ((MAX_MINUTES - zones.thresholdGreen) / MAX_MINUTES) * TRACK_HEIGHT;
  const orangeH = TRACK_HEIGHT - redH - greenH;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startYRef.current = thumbYRef.current;
      },
      onPanResponderMove: (_, gs) => {
        const newY = Math.max(0, Math.min(TRACK_HEIGHT, startYRef.current + gs.dy));
        thumbYRef.current = newY;
        const snapped = Math.round(((newY / TRACK_HEIGHT) * MAX_MINUTES) / 5) * 5;
        setMinutes(snapped);
      },
    }),
  ).current;

  function handleVerder() {
    setCheckinChoice(minutes, zone);
    router.replace('/(app)');
  }

  const thumbTop = (minutes / MAX_MINUTES) * TRACK_HEIGHT;
  const feedbackText = getSliderFeedback(zone, zones.thresholdRed);

  return (
    <View className="flex-1 bg-white">
      {/* Standard white header */}
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

      {/* Main content */}
      <View className="flex-1 px-6">
        {/* Question heading */}
        <View className="mb-6 mt-8">
          <Text
            className="text-center text-2xl text-gray-900"
            style={{ fontFamily: 'Karla_700Bold' }}
          >
            hoeveel tijd wil je aan school werken vandaag?
          </Text>
        </View>

        {/* Slider zone — scale + track + time display */}
        <View style={{ flexDirection: 'row', height: TRACK_HEIGHT }}>
          {/* Scale labels (left column) */}
          <View
            style={{
              width: 48,
              height: TRACK_HEIGHT,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingRight: 8,
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <Text
                key={i}
                style={{ fontFamily: 'Karla_400Regular', fontSize: 12, color: '#9ca3af' }}
              >
                {i} uur
              </Text>
            ))}
          </View>

          {/* Vertical track + thumb */}
          <View style={{ width: 36, height: TRACK_HEIGHT, position: 'relative' }}>
            {/* Red segment (top) */}
            {redH > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 8,
                  right: 8,
                  height: redH,
                  backgroundColor: '#ef4444',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
            )}
            {/* Orange segment (middle) */}
            {orangeH > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: redH,
                  left: 8,
                  right: 8,
                  height: orangeH,
                  backgroundColor: '#fb923c',
                }}
              />
            )}
            {/* Green segment (bottom) */}
            {greenH > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: redH + orangeH,
                  left: 8,
                  right: 8,
                  height: greenH,
                  backgroundColor: '#22c55e',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              />
            )}
            {/* Thumb hit area */}
            <View
              {...panResponder.panHandlers}
              style={{
                position: 'absolute',
                top: thumbTop - 20,
                left: -6,
                right: -6,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              />
            </View>
          </View>

          {/* Time display + feedback text (right of thumb, floats with it) */}
          <View
            style={{
              flex: 1,
              paddingLeft: 16,
              position: 'absolute',
              left: 84,
              right: 0,
              top: Math.max(0, thumbTop - 28),
            }}
          >
            <Text
              style={{ fontFamily: 'Karla_700Bold', fontSize: 28, color: zoneColor }}
            >
              {minutesToDisplay(minutes)}
            </Text>
            <Text
              style={{
                fontFamily: 'Karla_400Regular',
                fontSize: 14,
                color: '#6b7280',
                marginTop: 4,
                flexShrink: 1,
              }}
            >
              {feedbackText}
            </Text>
          </View>
        </View>
      </View>

      {/* CTA */}
      <View className="px-6 pb-10 pt-6">
        <Pressable
          onPress={handleVerder}
          style={{ backgroundColor: '#7DD3FC', borderRadius: 16 }}
          className="py-4"
        >
          <Text
            className="text-center text-base text-white"
            style={{ fontFamily: 'Karla_600SemiBold' }}
          >
            verder →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
