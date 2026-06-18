import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, minTouchTarget, radius, spacing, typography } from '../../theme/theme';

export interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/**
 * Fixed-geometry filter chip. The bug being fixed: selection used to
 * change padding/border-width and therefore the chip's box size, making
 * the row visually "jump". Here, padding/border-width/font are CONSTANT —
 * only backgroundColor, borderColor and text color change on selection.
 * A 1.5px border is always reserved (transparent when unselected) so the
 * box never resizes by a pixel between states.
 */
export default function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.white,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[styles.label, { color: selected ? colors.textOnPrimary : colors.textSecondary }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const CHIP_HEIGHT = minTouchTarget - 8; // 36 — comfortable but compact in a scroll row

const styles = StyleSheet.create({
  chip: {
    height: CHIP_HEIGHT,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.label, fontWeight: '700' },
});