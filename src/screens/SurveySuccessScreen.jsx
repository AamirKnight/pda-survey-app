import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  success: '#2E7D32',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
};

export default function SurveySuccessScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const getResultColor = (result) => {
    switch (result) {
      case 'Verified':
        return COLORS.success;
      case 'Data Mismatch':
        return COLORS.accent;
      case 'Unauthorized Construction':
      case 'Unauthorized Property':
        return COLORS.danger;
      case 'New Property Identified':
        return '#2196F3';
      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Survey Success" onMenuPress={() => navigation.openDrawer()} />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.checkmarkContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Ionicons name="checkmark" size={64} color={COLORS.white} style={styles.checkmark} />
        </Animated.View>

        <Text style={styles.surveyId}>{surveyData?.surveyId || 'SVY-2025-00000'}</Text>
        <Text style={styles.title}>Survey Submitted Successfully</Text>
        <Text style={styles.subtitle}>
          Your report has been submitted to the Prayagraj Development Authority portal for administrative review.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Property</Text>
            <Text style={styles.summaryValue}>
              {surveyData?.isNew
                ? 'Non-Registered Property'
                : surveyData?.property?.address || 'Registered Property'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Result</Text>
            <View
              style={[
                styles.resultBadge,
                { backgroundColor: getResultColor(surveyData?.result) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.resultBadgeText,
                  { color: getResultColor(surveyData?.result) },
                ]}
              >
                {surveyData?.result}
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recommendation</Text>
            <Text style={styles.summaryValue}>{surveyData?.recommendation}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Submitted</Text>
            <Text style={styles.summaryValue}>{new Date().toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.secondaryButtonText}>View Survey History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 4,
  },
  checkmark: {
    fontWeight: '700',
  },
  surveyId: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecond,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecond,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  buttonRow: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
