import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, elevation, minTouchTarget, spacing, typography } from '../theme/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  showBack?: boolean;
  /** Optional right-side action, e.g. a notification bell or save icon */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

/**
 * Light surface header per the "Bhagwa as accent, not a wash" direction:
 * white background, a slim saffron underline, and saffron-tinted icon
 * buttons. Respects the safe area so it never collides with the status
 * bar, notch, or Dynamic Island.
 */
export default function Header({
  title,
  subtitle,
  onMenuPress,
  onBackPress,
  showBack = false,
  rightIcon,
  onRightPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }, elevation.xs]}>
      <View style={styles.row}>
        <Pressable
          onPress={showBack ? onBackPress : onMenuPress}
          style={styles.iconButton}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={showBack ? 'Go back' : 'Open menu'}
        >
          <Ionicons name={showBack ? 'arrow-back' : 'menu'} size={22} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        {rightIcon && onRightPress ? (
          <Pressable
            onPress={onRightPress}
            style={styles.iconButton}
            hitSlop={4}
            accessibilityRole="button"
          >
            <Ionicons name={rightIcon} size={22} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>PDA</Text>
          </View>
        )}
      </View>
      <View style={styles.accentLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: colors.white },
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  iconButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { flex: 1, alignItems: 'center' },
  title: { ...typography.titleLarge, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  logoBadge: {
    minWidth: minTouchTarget,
    height: 28,
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  logoText: { ...typography.caption, color: colors.primaryDark, fontWeight: '800' },
  accentLine: { height: 3, backgroundColor: colors.primary, opacity: 0.9 },
});