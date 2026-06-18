import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { radius, spacing, typography } from '../../theme/theme';
import { getStatusStyle } from '../../utils/status';

export interface BadgeProps {
  label: string;
  status?: string;
  /** Override the auto-derived color, e.g. for one-off cases */
  color?: string;
  tint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  showIcon?: boolean;
  style?: ViewStyle;
}

/**
 * A compact status pill. Pass `status` to auto-derive color from the
 * shared status map, or pass `color`/`tint` directly for custom cases.
 */
export default function Badge({ label, status, color, tint, icon, showIcon = false, style }: BadgeProps) {
  const derived = getStatusStyle(status ?? label);
  const finalColor = color ?? derived.color;
  const finalTint = tint ?? derived.tint;
  const finalIcon = icon ?? derived.icon;

  return (
    <View style={[styles.container, { backgroundColor: finalTint }, style]}>
      {showIcon && (
        <Ionicons name={finalIcon as any} size={12} color={finalColor} style={styles.icon} />
      )}
      <Text style={[styles.label, { color: finalColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  icon: { marginRight: 4 },
  label: { ...typography.caption, fontWeight: '700' },
});