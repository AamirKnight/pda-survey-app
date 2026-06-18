import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';

const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
  inputBg: '#EEF1F8',
};

export default function ConstructionDetailsScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [constructionData, setConstructionData] = useState({
    natureOfConstruction: 'Residential',
    numberOfFloors: 1,
    approximateArea: '',
    remarks: '',
  });

  return (
    <View style={styles.container}>
      <Header
        title="Construction Details"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 3 of 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Construction Details</Text>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Nature of Construction</Text>
            <View style={styles.radioButtons}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  constructionData.natureOfConstruction === 'Residential' && styles.radioButtonActive,
                ]}
                onPress={() =>
                  setConstructionData((prev) => ({
                    ...prev,
                    natureOfConstruction: 'Residential',
                  }))
                }
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    constructionData.natureOfConstruction === 'Residential' && styles.radioButtonTextActive,
                  ]}
                >
                  Residential
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  constructionData.natureOfConstruction === 'Commercial' && styles.radioButtonActive,
                ]}
                onPress={() =>
                  setConstructionData((prev) => ({
                    ...prev,
                    natureOfConstruction: 'Commercial',
                  }))
                }
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    constructionData.natureOfConstruction === 'Commercial' && styles.radioButtonTextActive,
                  ]}
                >
                  Commercial
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Number of Floors</Text>
            <View style={styles.floorsStepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() =>
                  setConstructionData((prev) => ({
                    ...prev,
                    numberOfFloors: Math.max(1, prev.numberOfFloors - 1),
                  }))
                }
              >
                <Ionicons name="remove" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.floorsCount}>{constructionData.numberOfFloors}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() =>
                  setConstructionData((prev) => ({
                    ...prev,
                    numberOfFloors: Math.min(10, prev.numberOfFloors + 1),
                  }))
                }
              >
                <Ionicons name="add" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Approximate Plot Area (sq. ft.) (Optional)</Text>
            <TextInput
              style={styles.input}
              value={constructionData.approximateArea}
              onChangeText={(text) =>
                setConstructionData((prev) => ({ ...prev, approximateArea: text }))
              }
              placeholder="Enter approximate area"
              placeholderTextColor={COLORS.textSecond}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Remarks (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={constructionData.remarks}
              onChangeText={(text) =>
                setConstructionData((prev) => ({ ...prev, remarks: text }))
              }
              placeholder="e.g. Third floor under construction, no slab visible yet."
              placeholderTextColor={COLORS.textSecond}
              multiline
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="construct" size={20} color={COLORS.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Observations are for documentation only. No legal action is taken at this stage.
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
              navigation.navigate('EvidenceUpload', {
                surveyData: { ...surveyData, constructionData },
              })
            }
          >
            <Text style={styles.nextButtonText}>Next: Upload Evidence →</Text>
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
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  radioButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  radioButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
  },
  radioButtonActive: {
    backgroundColor: COLORS.primary,
  },
  radioButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  radioButtonTextActive: {
    color: COLORS.white,
  },
  fieldContainer: {
    marginBottom: 20,
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
  floorsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepperButton: {
    width: 56,
    height: 52,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorsCount: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    paddingVertical: 14,
  },
  infoCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 20,
    flex: 1,
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
