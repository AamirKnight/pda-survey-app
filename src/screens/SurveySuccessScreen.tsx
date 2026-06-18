import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import { colors, elevation, radius, spacing, typography } from '../theme/theme';
import { getStatusStyle } from '../utils/status';

export default function SurveySuccessScreen({ navigation, route }: any) {
  const { surveyData } = route.params || {};

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const resultStyle = getStatusStyle(surveyData?.result);
  const recStyle = getStatusStyle(surveyData?.recommendation);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const SUMMARY_ROWS = [
    {
      label: 'Property',
      value: surveyData?.isNew
        ? 'Non-Registered Property'
        : surveyData?.property?.address ?? 'Registered Property',
    },
    {
      label: 'Result',
      value: surveyData?.result ?? 'N/A',
      badge: resultStyle,
    },
    {
      label: 'Recommendation',
      value: surveyData?.recommendation ?? 'N/A',
      badge: recStyle,
    },
    {
      label: 'Submitted At',
      value: new Date().toLocaleString(),
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Submitted"
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.checkWrap,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.checkCircle}>
            <Ionicons
              name="checkmark"
              size={56}
              color={colors.white}
            />
          </View>

          <View style={styles.checkRing1} />
          <View style={styles.checkRing2} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: opacityAnim,
            width: '100%',
          }}
        >
          <Text style={styles.surveyId}>
            {surveyData?.surveyId ?? 'SVY-2025-00000'}
          </Text>

          <Text style={styles.title}>
            Survey Submitted Successfully
          </Text>

          <Text style={styles.subtitle}>
            Your field report has been submitted to the Prayagraj
            Development Authority portal for administrative review.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.summaryTitle}>
                Survey Summary
              </Text>
            </View>

            {SUMMARY_ROWS.map((row) => (
              <View
                key={row.label}
                style={styles.summaryRow}
              >
                <Text style={styles.summaryLabel}>
                  {row.label}
                </Text>

                {row.badge ? (
                  <View
                    style={[
                      styles.badgePill,
                      {
                        backgroundColor: row.badge.tint,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: row.badge.color,
                        },
                      ]}
                    >
                      {row.value}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={styles.summaryValue}
                    numberOfLines={2}
                  >
                    {row.value}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <Button
              label="View Survey History"
              variant="secondary"
              icon="time-outline"
              onPress={() => navigation.navigate('History')}
            />

            <View style={styles.spacer} />

            <Button
              label="Back to Dashboard"
              variant="primary"
              icon="home-outline"
              onPress={() => navigation.navigate('Dashboard')}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: spacing.xl,
    paddingBottom: 40,
    alignItems: 'center',
  },

  checkWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xxxl,
  },

  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.md,
    zIndex: 3,
  },

  checkRing1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: `${colors.success}40`,
    zIndex: 2,
  },

  checkRing2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: `${colors.success}20`,
    zIndex: 1,
  },

  surveyId: {
    ...typography.overline,
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },

  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxxl,
  },

  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '100%',
    marginBottom: spacing.xl,
    ...elevation.sm,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  summaryTitle: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  summaryValue: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  badgePill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },

  badgeText: {
    ...typography.caption,
    fontWeight: '700',
  },

  actions: {
    width: '100%',
  },

  spacer: {
    height: spacing.md,
  },
});