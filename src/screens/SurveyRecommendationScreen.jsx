import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  inputBg: '#EEF1F8',
};

export default function SurveyRecommendationScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [recommendation, setRecommendation] = useState('No Action Required');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const options = [
    {
      id: 'No Action Required',
      icon: 'checkmark-circle',
      title: 'No Action Required',
      desc: 'Property is compliant. No further action needed.',
      color: COLORS.success,
    },
    {
      id: 'Warning Recommended',
      icon: 'warning',
      title: 'Warning Recommended',
      desc: 'Minor irregularities noted. PDA officer to review and issue advisory.',
      color: COLORS.warning,
    },
    {
      id: 'Challan Recommended',
      icon: 'close-circle',
      title: 'Challan Recommended',
      desc: 'Significant unauthorized activity detected. Formal action warranted.',
      color: COLORS.danger,
    },
  ];

  const handleSubmit = () => {
    Alert.alert(
      'Submit Survey',
      'Are you sure you want to submit this survey?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              navigation.navigate('SurveySuccess', {
                surveyData: { ...surveyData, recommendation, remarks },
              });
            }, 1500);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Survey Recommendation"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Survey Recommendation</Text>

          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                recommendation === option.id && { borderColor: option.color },
              ]}
              onPress={() => setRecommendation(option.id)}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon} size={32} color={option.color} style={styles.optionIcon} />
                <View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDesc}>{option.desc}</Text>
                </View>
              </View>
              {recommendation === option.id && (
                <Ionicons name="checkmark" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.disclaimerCard}>
          <Ionicons name="lock-closed" size={20} color={COLORS.white} style={styles.disclaimerIcon} />
          <Text style={styles.disclaimerText}>
            Surveyors are not authorized to issue notices or challans directly. This recommendation will be reviewed and actioned by PDA officials through the portal workflow.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Final Remarks (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter any additional remarks..."
            placeholderTextColor={COLORS.textSecond}
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Survey Report'}
          </Text>
        </TouchableOpacity>
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
  option: {
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
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.textSecond,
    lineHeight: 18,
  },
  disclaimerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  disclaimerText: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecond,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
