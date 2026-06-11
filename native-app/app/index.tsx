import { Redirect } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';

export default function IndexScreen() {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (token) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
