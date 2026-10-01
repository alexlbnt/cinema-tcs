import { Stack } from 'expo-router';
import { Colors } from '../../src/utils/theme';

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="sessao-picker" />
      <Stack.Screen name="assentos" />
      <Stack.Screen name="snacks" />
      <Stack.Screen name="pagamento" />
      <Stack.Screen name="comprovante" />
    </Stack>
  );
}
