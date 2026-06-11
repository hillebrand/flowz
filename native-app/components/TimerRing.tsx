import { Text, View } from 'react-native';

interface Props {
  remaining: number;
  total: number;
}

export function TimerRing({ remaining, total }: Props) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progressLabel = total > 0 ? `${Math.round((remaining / total) * 100)}% resterend` : 'Geen timer actief';

  return (
    <View className="h-52 w-52 items-center justify-center rounded-full border-8 border-primary">
      <Text className="text-4xl text-gray-900" style={{ fontFamily: 'Karla_700Bold' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      <Text className="mt-2 text-xs text-gray-500" style={{ fontFamily: 'Karla_400Regular' }}>
        {progressLabel}
      </Text>
    </View>
  );
}
