import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../src/store/authStore';
import { useTicketsStore } from '../src/store/ticketsStore';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loadSession } = useAuthStore();
  const { loadTickets } = useTicketsStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadSession();
    loadTickets();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/filmes');
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthGuard>
      <StatusBar style="light" backgroundColor="#0A0A0F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="checkout" />
      </Stack>
      <Toast />
    </AuthGuard>
  );
}
