import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';

interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/** A single shimmering rectangle. Compose several to build skeleton screens. */
export function SkeletonBlock({ width = '100%', height = 14, borderRadius = 6, style }: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 650, easing: Easing.ease, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.skeleton, opacity },
        style,
      ]}
    />
  );
}

/** Skeleton placeholder shaped like a SurveyCard — use while lists load. */
export function SurveyCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SkeletonBlock width={120} height={16} />
        <SkeletonBlock width={70} height={12} />
      </View>
      <SkeletonBlock width="85%" height={13} style={{ marginTop: spacing.md }} />
      <SkeletonBlock width="60%" height={13} style={{ marginTop: spacing.sm }} />
      <View style={[styles.row, { marginTop: spacing.lg }]}>
        <SkeletonBlock width={90} height={24} borderRadius={radius.sm} />
        <SkeletonBlock width={90} height={24} borderRadius={radius.sm} />
      </View>
    </View>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <SurveyCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});