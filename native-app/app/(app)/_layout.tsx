import { ActivityIndicator, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/sessionStore';
import { toLocalDateStr } from '@/lib/dateUtils';

export default function AppLayout() {
  const { token, isLoading } = useAuthStore();
  const checkinDate = useSessionStore((state) => state.checkinDate);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  const today = toLocalDateStr(); // UTC is fine for layout gate — local date set in setCheckinChoice
  if (checkinDate !== today) {
    return <Redirect href={'/(app)/checkin' as never} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
