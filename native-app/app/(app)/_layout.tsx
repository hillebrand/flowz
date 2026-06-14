import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/sessionStore';

export default function AppLayout() {
  const { token, isLoading } = useAuthStore();
  const checkinDate = useSessionStore((state) => state.checkinDate);

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  const today = new Date().toISOString().slice(0, 10);
  if (checkinDate !== today) {
    return <Redirect href={'/(app)/checkin' as never} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
