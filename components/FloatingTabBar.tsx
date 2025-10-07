
import { useRouter, usePathname } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const animatedValue = useSharedValue(0);

  // Find active tab index
  const activeIndex = tabs.findIndex(tab => pathname.includes(tab.name));
  
  React.useEffect(() => {
    animatedValue.value = withSpring(activeIndex >= 0 ? activeIndex : 0);
  }, [activeIndex, animatedValue]);

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedValue.value,
      tabs.map((_, index) => index),
      tabs.map((_, index) => (containerWidth / tabs.length) * index)
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <SafeAreaView style={[styles.container, { bottom: bottomMargin }]}>
      <BlurView
        intensity={80}
        tint="light"
        style={[
          styles.tabBar,
          {
            width: containerWidth,
            borderRadius,
          },
        ]}
      >
        {/* Animated background indicator */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: containerWidth / tabs.length,
              borderRadius: borderRadius - 4,
              backgroundColor: colors.primary,
            },
            animatedStyle,
          ]}
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={tab.icon as any}
                size={24}
                color={isActive ? colors.card : colors.text}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.card : colors.text,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  activeIndicator: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    left: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
