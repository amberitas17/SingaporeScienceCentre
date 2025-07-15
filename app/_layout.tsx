import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="activities" />
        <Stack.Screen name="exhibitions" />
        <Stack.Screen name="omni-theatre" />
        <Stack.Screen name="science-shows" />
        <Stack.Screen name="ai-vision" />
        <Stack.Screen name="loading" />
        <Stack.Screen name="face-verification" />
        <Stack.Screen name="calendar" />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}