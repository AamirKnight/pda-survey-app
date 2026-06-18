import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, elevation, radius, spacing, typography } from '../../theme/theme';
import { getStatusStyle } from '../../utils/status';
import Badge from './Badge';

export interface SurveyCardProps {
  /** e.g. Survey ID or Property ID — shown bold, top-left */
  id: string;
  /** e.g. owner name — shown under the id, optional */
  subtitle?: string;
  address: string;
  status: string;
  /** small meta text on the top-right, e.g. a date */
  meta?: string;
  /** 0–1, renders a thin progress bar under the address if provided */
  progress?: number;
  secondaryStatus?: string; // e.g. recommendation badge alongside the result badge
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onPress?: () => void;
}

export default function SurveyCard({
  id,
  subtitle,
  address,
  status,
  meta,
  progress,
  secondaryStatus,
  primaryActionLabel,
  onPrimaryAction,
  onPress,
}: SurveyCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const statusStyle = getStatusStyle(status);

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.985, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPress ? pressIn : undefined}
        onPressOut={onPress ? pressOut : undefined}
        style={styles.card}
        accessibilityRole={onPress ? 'button' : undefined}
      >
        {/* Left accent bar communicates status at a glance, even before reading text */}
        <View style={[styles.accent, { backgroundColor: statusStyle.color }]} />

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={styles.id} numberOfLines={1}>{id}</Text>
            {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          </View>

          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          <Text style={styles.address} numberOfLines={2}>{address}</Text>

          {typeof progress === 'number' && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
          )}

          <View style={styles.footerRow}>
            <View style={styles.badgeGroup}>
              <Badge label={status} status={status} showIcon />
              {secondaryStatus ? <Badge label={secondaryStatus} status={secondaryStatus} /> : null}
            </View>
            {primaryActionLabel && onPrimaryAction ? (
              <Pressable onPress={onPrimaryAction} style={styles.actionButton} hitSlop={6}>
                <Text style={styles.actionText}>{primaryActionLabel}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </Pressable>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...elevation.sm,
  },
  accent: { width: 4 },
  body: { flex: 1, padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { ...typography.titleMedium, color: colors.primaryDark, flexShrink: 1 },
  meta: { ...typography.caption, color: colors.textTertiary },
  subtitle: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2, fontWeight: '600' },
  address: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  progressTrack: {
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  badgeGroup: { flexDirection: 'row', gap: spacing.sm, flexShrink: 1, flexWrap: 'wrap' },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.sm },
  actionText: { ...typography.label, color: colors.primary, marginRight: 2 },
});