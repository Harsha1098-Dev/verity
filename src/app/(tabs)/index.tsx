import React from 'react';
import { TodayReflectionView } from '@/components/TodayReflectionView';
import { router } from 'expo-router';

export default function TodayScreen() {
  return (
    <TodayReflectionView
      showBottomNav={false}
      onNavigateTab={(tab) => {
        if (tab === 'today') router.push('/');
        else if (tab === 'history') router.push('/(tabs)/history');
        else if (tab === 'insights') router.push('/(tabs)/insights');
        else if (tab === 'profile') router.push('/(tabs)/profile');
      }}
      onSave={(reflection) => {
        // Handle persistence or sync to cloud store
        console.log('Reflection saved:', reflection);
      }}
    />
  );
}
