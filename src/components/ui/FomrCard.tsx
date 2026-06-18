import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, elevation, radius, spacing, typography } from '../../theme/theme';

interface FormCardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function FormCard({ title, children, style }: FormCardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...elevation.sm,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});