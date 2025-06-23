import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10B981', // Emerald green for finance theme
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -3 },
            shadowRadius: 10,
            height: 85, // Extra height for safe area
            paddingBottom: 25, // Safe area padding
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "chart.bar.fill" : "chart.bar"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "chart.line.uptrend.xyaxis" : "chart.line.uptrend.xyaxis"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "creditcard.fill" : "creditcard"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={24} 
              name={focused ? "person.crop.circle.fill" : "person.crop.circle"} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
