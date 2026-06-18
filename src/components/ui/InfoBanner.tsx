import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/theme';

type BannerVariant = 'info' | 'warning' | 'success' | 'error';

interface InfoBannerProps {
  message: string;
  variant?: BannerVariant;
  style?: ViewStyle;
}

const VARIANT_MAP: Record<BannerVariant, { bg: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  info: { bg: colors.infoTint, color: colors.info, icon: 'information-circle-outline' },
  warning: { bg: colors.warningTint, color: colors.warning, icon: 'warning-outline' },
  success: { bg: colors.successTint, color: colors.success, icon: 'checkmark-circle-outline' },
  error: { bg: colors.errorTint, color: colors.error, icon: 'alert-circle-outline' },
};

export default function InfoBanner({ message, variant = 'info', style }: InfoBannerProps) {
  const v = VARIANT_MAP[variant];
  return (
    <View style={[styles.container, { backgroundColor: v.bg }, style]}>
      <Ionicons name={v.icon} size={18} color={v.color} style={styles.icon} />
      <Text style={[styles.text, { color: v.color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  icon: { marginRight: spacing.sm, marginTop: 1 },
  text: { ...typography.bodySmall, flex: 1, lineHeight: 20 },
});