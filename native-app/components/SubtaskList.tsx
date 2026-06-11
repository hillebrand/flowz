import { Text, View } from 'react-native';

import type { Subtask } from '@/types';

interface Props {
  subtasks: Subtask[];
}

export function SubtaskList({ subtasks }: Props) {
  return (
    <View className="gap-2">
      {subtasks.map((subtask) => (
        <View key={subtask.id} className="flex-row items-center gap-2">
          <View
            className={`h-4 w-4 rounded border-2 ${subtask.done ? 'border-primary bg-primary' : 'border-gray-300'}`}
          />
          <Text className={`text-sm ${subtask.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
            {subtask.title}
          </Text>
        </View>
      ))}
    </View>
  );
}
