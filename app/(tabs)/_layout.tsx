
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'shield.fill',
      label: 'Alerts',
    },
    {
      name: 'scan',
      route: '/(tabs)/scan',
      icon: 'camera.fill',
      label: 'Scan',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'info.circle.fill',
      label: 'Info',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="shield.fill" drawable="ic_shield" />
          <Label>Alerts</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="scan">
          <Icon sf="camera.fill" drawable="ic_camera" />
          <Label>Scan</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="info.circle.fill" drawable="ic_info" />
          <Label>Info</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Remove fade animation to prevent black screen flash
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
