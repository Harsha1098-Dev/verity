import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Sparkles, BookOpen, BarChart3, User } from 'lucide-react-native';
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
        tabBarInactiveTintColor: PALETTE.ink.subtle,
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
                size={19}
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
                size={19}
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
                size={19}
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
                size={19}
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
    elevation: 8,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabBarItem: {
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabBarLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
