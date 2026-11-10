import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Sparkles, BookOpen, BarChart3, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SPACING } from '@/constants/theme';

export default function TabLayout() {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: PALETTE.bronze.base,
        tabBarInactiveTintColor: PALETTE.ink.subtle,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
      screenListeners={{
        tabPress: () => triggerHaptic(),
      }}
    >
      {/* 1. Today (Daily Reflection) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && { backgroundColor: PALETTE.prosecco.light },
              ]}
            >
              <Sparkles
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* 2. History (Past Entries) */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && { backgroundColor: PALETTE.foggyLove.light },
              ]}
            >
              <BookOpen
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* 3. Insights (Mood Trends) */}
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && { backgroundColor: PALETTE.deltaMint.light },
              ]}
            >
              <BarChart3
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.7}
              />
            </View>
          ),
        }}
      />

      {/* 4. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconWrapper,
                focused && { backgroundColor: PALETTE.polarOpposite.light },
              ]}
            >
              <User
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.7}
              />
            </View>
          ),
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
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 8,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  iconWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabBarLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
