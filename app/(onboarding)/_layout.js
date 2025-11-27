import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash1" />
      <Stack.Screen name="splash2" />
      <Stack.Screen name="splash3" />
    </Stack>
  );
}