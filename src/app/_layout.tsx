import '../../global.css';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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
        <ActivityIndicator size="small" color={PALETTE.gold.base} />
      </View>
    );
  }

  const isWeb = Platform.OS === 'web';
  const isMobileScreen = windowWidth < 520;

  // On wide screens (desktop web), frame the mobile app proportionally to the viewport height so nothing overflows
  const frameHeight = isWeb && !isMobileScreen ? Math.min(880, Math.max(620, windowHeight - 32)) : '100%';

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={isWeb && !isMobileScreen ? styles.webOuterCanvas : styles.nativeContainer}>
        <View
          style={
            isWeb && !isMobileScreen
              ? [styles.mobileFrame, { height: frameHeight }]
              : styles.nativeContainer
          }
        >
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
    width: '100%',
    height: '100%',
    backgroundColor: PALETTE.paper.linen,
  },
  webOuterCanvas: {
    flex: 1,
    width: '100%',
    height: '100vh' as any,
    backgroundColor: '#EFEAE3', // Architectural warm linen desk backdrop
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  mobileFrame: {
    width: '100%',
    maxWidth: 420, // Ideal iPhone viewport width
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 34,
    overflow: 'hidden',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 36,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 82, 48, 0.18)',
  },
});
