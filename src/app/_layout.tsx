import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import * as SplashScreen from 'expo-splash-screen';
import { initDatabase } from '../db/database';
import { useThemeStore } from '../store/useThemeStore';
import { Colors } from '../constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { init: initTheme } = useThemeStore();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    async function bootstrap() {
      try {
        await initDatabase();
        await initTheme();
      } catch (e) {
        console.error('[Bootstrap] failed:', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    if (fontsLoaded || fontError) {
      bootstrap();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle:            { backgroundColor: Colors.dark.background },
          headerTintColor:        Colors.dark.textPrimary,
          headerTitleStyle:       { fontFamily: 'Inter_600SemiBold' },
          contentStyle:           { backgroundColor: Colors.dark.background },
          headerShadowVisible:    false,
          headerBackButtonMenuEnabled: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="snippet/create"
          options={{
            title:        'New Snippet',
            presentation: 'modal',
            headerStyle:  { backgroundColor: Colors.dark.surface },
          }}
        />
        <Stack.Screen
          name="snippet/[id]"
          options={{
            title:       'Snippet',
            headerStyle: { backgroundColor: Colors.dark.background },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}