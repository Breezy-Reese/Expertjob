import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

export default function JobsIndex() {
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});