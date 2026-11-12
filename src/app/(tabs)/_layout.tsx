import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import {
  Sparkles,
  Layers,
  BookMarked,
  Eye,
  User,
  BookOpen,
  BarChart3,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';

export default function TabLayout() {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const isWeb = Platform.OS === 'web';
  const isIos = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: PALETTE.bronze.base,
        tabBarInactiveTintColor: '#8E8982',
        tabBarStyle: [
          styles.tabBar,
          {
            height: isIos ? 84 : isWeb ? 66 : 64,
            paddingBottom: isIos ? 24 : isWeb ? 8 : 6,
            paddingTop: 6,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
      screenListeners={{
        tabPress: () => triggerHaptic(),
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Sparkles
                size={18}
                color={color}
                strokeWidth={focused ? 2.3 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* 2. Affirmations (Flagship Reel / Vertical Swipe) */}
      <Tabs.Screen
        name="affirmations"
        options={{
          title: 'Affirmations',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Layers
                size={18}
                color={color}
                strokeWidth={focused ? 2.3 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* 3. Journal */}
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <BookMarked
                size={18}
                color={color}
                strokeWidth={focused ? 2.3 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* 4. Vision Board */}
      <Tabs.Screen
        name="vision-board"
        options={{
          title: 'Vision Board',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Eye
                size={18}
                color={color}
                strokeWidth={focused ? 2.3 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <User
                size={18}
                color={color}
                strokeWidth={focused ? 2.3 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* Hidden legacy routes preserved for backward-compatibility */}
      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FAF8F5',
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 82, 48, 0.12)',
    elevation: 8,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabBarItem: {
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapperActive: {
    backgroundColor: PALETTE.prosecco.light,
  },
  tabBarLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 9.5,
    letterSpacing: 0.2,
  },
});
