import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';

export default function AppLayout() {
  const { token, isLoading: isAuthLoading } = useAuthStore();
  const { data } = useDataStore();

  if (isAuthLoading) return null;

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  // Basic check for setup completed (e.g. settings are fetched or basic token is there).
  // In a real app we'd have a specific `hasCompletedSetup` boolean in settings.
  // For the prototype we'll assume setup is needed if tasks is empty and it's a fresh start.
  // To avoid infinite loops, we won't guard it completely here, but users can navigate manually.

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="checkin" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="tijdkeuze" options={{ animation: 'slide_from_right' }} />
      
      {/* Settings / Config */}
      <Stack.Screen name="instellingen" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="beschikbaarheid" options={{ animation: 'slide_from_right' }} />

      {/* Task Flow */}
      <Stack.Screen name="taak-detail/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="sessie-voorbereiding" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="actieve-sessie" options={{ animation: 'fade' }} />
      <Stack.Screen name="sessie-afgerond" options={{ animation: 'fade' }} />
      <Stack.Screen name="pauzetimer" options={{ animation: 'fade' }} />
      <Stack.Screen name="afgeronde-taken" options={{ animation: 'slide_from_bottom' }} />

      {/* Setup Flow */}
      <Stack.Screen name="setup/welkomst" options={{ animation: 'fade' }} />
      <Stack.Screen name="setup/magister-sync" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="setup/import-review" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="setup/takenoverzicht" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="setup/taak-aanmaken" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
