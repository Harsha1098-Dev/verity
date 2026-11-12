import '../../global.css';
import React, { useEffect, useState } from 'react';
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
import { UserPortalProfile } from '@/types/portal';
import {
  loadPortalProfile,
  savePortalProfile,
  subscribeToProfile,
} from '@/utils/portalStore';
import { WelcomeAuthModal } from '@/components/WelcomeAuthModal';
import { PortalOnboardingModal } from '@/components/PortalOnboardingModal';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [portalProfile, setPortalProfile] = useState<UserPortalProfile | null>(null);

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

  useEffect(() => {
    (async () => {
      const p = await loadPortalProfile();
      setPortalProfile(p);
    })();

    const unsubscribe = subscribeToProfile((updated) => {
      setPortalProfile(updated);
    });
    return unsubscribe;
  }, []);

  if ((!fontsLoaded && !fontError) || portalProfile === null) {
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

          {/* ========================================================
              GATE 1: AUTHENTICATION GATE (Sign In via OTP/Password or Sign Up)
             ======================================================== */}
          {portalProfile && !portalProfile.isAuthenticated && (
            <WelcomeAuthModal
              visible={true}
              dismissible={false}
              onSuccess={async (cred) => {
                const updated = await savePortalProfile({
                  isAuthenticated: true,
                  phoneNumber: cred.phoneNumber,
                  authMethod: cred.authMethod,
                  name: cred.name || portalProfile.name || 'Harsha',
                  ...(cred.isNewUser ? { onboardingCompleted: false } : {}),
                });
                setPortalProfile(updated);
              }}
            />
          )}

          {/* ========================================================
              GATE 2: 15-QUESTION CUSTOMIZATION QUESTIONNAIRE (First-Time User)
             ======================================================== */}
          {portalProfile &&
            portalProfile.isAuthenticated &&
            !portalProfile.onboardingCompleted && (
              <PortalOnboardingModal
                visible={true}
                dismissible={false}
                currentProfile={portalProfile}
                onComplete={async (updatedProfile) => {
                  const updated = await savePortalProfile({
                    ...updatedProfile,
                    onboardingCompleted: true,
                  });
                  setPortalProfile(updated);
                }}
              />
            )}
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
