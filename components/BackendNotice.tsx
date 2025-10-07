
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface BackendNoticeProps {
  feature: string;
  description: string;
}

export default function BackendNotice({ feature, description }: BackendNoticeProps) {
  const handleLearnMore = () => {
    Alert.alert(
      'Backend Integration',
      `To enable full ${feature} functionality, you'll need to:\n\n1. Press the Supabase button in your development environment\n2. Connect to a Supabase project (create one if needed)\n3. Set up the necessary database tables and storage\n4. Configure image comparison/AI services\n\nCurrently, the app uses mock data for demonstration purposes.`,
      [{ text: 'Got it' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSymbol name="info.circle.fill" size={24} color={colors.accent} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Backend Required</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Pressable style={styles.button} onPress={handleLearnMore}>
        <Text style={styles.buttonText}>Learn More</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
});
