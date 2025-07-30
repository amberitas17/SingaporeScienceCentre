// Import polyfills first - MUST be at the very top
import 'react-native-url-polyfill/auto';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { FaceVerificationProvider } from './contexts/FaceVerificationContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <FaceVerificationProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="user-selection" options={{ headerShown: false }} />
          <Stack.Screen name="face-verification" options={{ headerShown: false }} />
          <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="exhibition-management" options={{ headerShown: false }} />
          <Stack.Screen name="visitor-analytics" options={{ headerShown: false }} />
          <Stack.Screen name="ai-vision" options={{ headerShown: false }} />
          <Stack.Screen name="calendar" options={{ headerShown: false }} />
          <Stack.Screen name="exhibitions" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </FaceVerificationProvider>
  );
}