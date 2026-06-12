import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ProgressProvider } from '../src/contexts/ProgressContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ProgressProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </ProgressProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
