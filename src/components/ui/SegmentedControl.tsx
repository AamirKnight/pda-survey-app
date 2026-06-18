import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../../theme/theme';

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.track}>
      {options.map((opt, i) => {
        const isSelected = opt.value === value;
        const isFirst = i === 0;
        const isLast = i === options.length - 1;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.segment,
              isFirst && styles.first,
              isLast && styles.last,
              isSelected ? styles.selected : styles.idle,
              pressed && !isSelected && styles.pressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelIdle]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  segment: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  first: {},
  last: {},
  selected: { backgroundColor: colors.primary },
  idle: { backgroundColor: colors.surface },
  pressed: { backgroundColor: colors.primaryTint },
  label: { ...typography.label, fontWeight: '700' },
  labelSelected: { color: colors.white },
  labelIdle: { color: colors.textSecondary },
});