import { Platform } from 'react-native';

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
 * Backend Node.js Server Base URL
 * - Web / Android Emulator / Local: http://localhost:5000 or http://10.0.2.2:5000
 * - Physical mobile device over Wi-Fi: http://192.168.50.178:5000
 */
export const AUTH_SERVER_BASE_URL =
  process.env.EXPO_PUBLIC_AUTH_SERVER_URL ||
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'
    : 'http://localhost:5000');
