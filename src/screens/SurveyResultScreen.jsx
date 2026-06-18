import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  success: '#2E7D32',
  warning: '#F57C00',
  danger: '#C62828',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
};

export default function SurveyResultScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const isNewProperty = surveyData?.isNew;
  const [result, setResult] = useState(
    isNewProperty ? 'New Property Identified' : 'Verified'
  );

  const registeredOptions = [
    {
      id: 'Verified',
      icon: 'checkmark-circle',
      title: 'Verified',
      desc: 'Property details match records. No issues found.',
      color: COLORS.success,
    },
    {
      id: 'Data Mismatch',
      icon: 'warning',
      title: 'Data Mismatch',
      desc: 'One or more details differ from registry.',
      color: COLORS.warning,
    },
    {
      id: 'Unauthorized Construction',
      icon: 'close-circle',
      title: 'Unauthorized Construction',
      desc: 'Construction exceeds approved map or no map found.',
      color: COLORS.danger,
    },
  ];

  const newOptions = [
    {
      id: 'New Property Identified',
      icon: 'add-circle',
      title: 'New Property Identified',
      desc: 'Property exists but is not in PDA registry.',
      color: '#2196F3',
    },
    {
      id: 'Unauthorized Property',
      icon: 'close-circle',
      title: 'Unauthorized Property',
      desc: 'Property exists without any legal documentation.',
      color: COLORS.danger,
    },
  ];

  const options = isNewProperty ? newOptions : registeredOptions;

  return (
    <View style={styles.container}>
      <Header
        title="Survey Result"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 5 of 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Survey Result</Text>

          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.resultOption,
                result === option.id && { borderColor: option.color },
              ]}
              onPress={() => setResult(option.id)}
            >
              <View style={styles.resultOptionLeft}>
                <Ionicons name={option.icon} size={32} color={option.color} style={styles.resultIcon} />
                <View>
                  <Text style={styles.resultTitle}>{option.title}</Text>
                  <Text style={styles.resultDesc}>{option.desc}</Text>
                </View>
              </View>
              {result === option.id && (
                <Ionicons name="checkmark" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.resultPreview,
            { backgroundColor: options.find(o => o.id === result)?.color + '20' },
          ]}
        >
          <Text style={styles.resultPreviewText}>
            Selected: <Text style={{ fontWeight: '700' }}>{result}</Text>
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              navigation.navigate('SurveyRecommendation', {
                surveyData: { ...surveyData, result },
              })
            }
          >
            <Text style={styles.nextButtonText}>Next: Recommendation →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecond,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  resultOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.inputBg,
  },
  resultOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultIcon: {
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  resultDesc: {
    fontSize: 13,
    color: COLORS.textSecond,
    lineHeight: 18,
  },
  resultPreview: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultPreviewText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});
