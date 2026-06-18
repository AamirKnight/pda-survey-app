import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/theme';

interface StepProgressProps {
  current: number;
  total: number;
  label?: string;
}

export default function StepProgress({ current, total, label }: StepProgressProps) {
  const pct = (current / total) * 100;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label ?? `Step ${current} of ${total}`}</Text>
        <Text style={styles.pct}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.dotsRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < current ? styles.dotDone : i === current - 1 ? styles.dotActive : styles.dotFuture,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  label: { ...typography.label, color: colors.textSecondary },
  pct: { ...typography.label, color: colors.primary, fontWeight: '700' },
  track: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.pill },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotDone: { backgroundColor: colors.primary },
  dotActive: { backgroundColor: colors.primary },
  dotFuture: { backgroundColor: colors.border },
});