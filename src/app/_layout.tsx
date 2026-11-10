import '../../global.css';
import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { PALETTE } from '@/constants/theme';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={PALETTE.bronze.base} />
      </View>
    );
  }

  // Mobile container wrapper for desktop web preview
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={isWeb ? styles.webOuterCanvas : styles.nativeContainer}>
        <View style={isWeb ? styles.mobileFrame : styles.nativeContainer}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: PALETTE.paper.linen },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeContainer: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  webOuterCanvas: {
    flex: 1,
    minHeight: '100vh' as any,
    backgroundColor: '#EFE9E1', // Luxury editorial desk backdrop
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    width: '100%',
    maxWidth: 430, // iPhone 15/16 Pro Max viewport width
    height: '100vh' as any,
    maxHeight: 932,
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#5C3E1E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
  },
});
