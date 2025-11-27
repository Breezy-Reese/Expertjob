import { Stack } from 'expo-router';

export default function JobsLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true,
      headerStyle: {
        backgroundColor: '#007AFF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Job Details',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Job Details',
        }} 
      />
    </Stack>
  );
}