import { Text, View } from 'react-native';

import type { Task } from '@/types';

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  return (
    <View className="rounded-2xl bg-white px-4 py-3 shadow-sm">
      <Text className="text-sm text-gray-900" style={{ fontFamily: 'Karla_500Medium' }}>
        {task.title}
      </Text>
    </View>
  );
}
