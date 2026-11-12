import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Firebase Web Client Configuration
 * Replace these placeholder values with your Firebase Web App credentials
 * from Firebase Console -> Project Settings -> General -> Your apps -> Web app
 */
export const FIREBASE_CLIENT_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderKey1111',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'portal-1111.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'portal-1111',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'portal-1111.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '111111111111',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:111111111111:web:abcdef111111',
};

/**
 * Resolve Backend Node.js Server Base URL
 * - Web: http://localhost:5000
 * - Mobile / Expo Go: Auto-detects host machine IP from Expo hostUri or falls back to LAN IP
 */
function resolveBackendUrl(): string {
  if (process.env.EXPO_PUBLIC_AUTH_SERVER_URL) {
    return process.env.EXPO_PUBLIC_AUTH_SERVER_URL;
  }
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:5000`;
    }
  }
  return 'http://192.168.50.178:5000';
}

export const AUTH_SERVER_BASE_URL = resolveBackendUrl();
