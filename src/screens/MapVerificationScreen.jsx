import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  success: '#2E7D32',
  danger: '#C62828',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
  inputBg: '#EEF1F8',
};

export default function MapVerificationScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [mapVerification, setMapVerification] = useState({
    approvedMapAvailable: true,
    constructionMatchesMap: true,
    deviations: [],
    remarks: '',
  });

  const DEVIATION_OPTIONS = [
    'Additional Floor',
    'Additional Construction Area',
    'Structural Modification',
    'Other',
  ];

  const toggleDeviation = (option) => {
    setMapVerification((prev) => {
      if (prev.deviations.includes(option)) {
        return { ...prev, deviations: prev.deviations.filter(d => d !== option) };
      }
      return { ...prev, deviations: [...prev.deviations, option] };
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Map Verification"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 2 of 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Map Verification</Text>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Is Approved Map Available?</Text>
            <View style={styles.radioButtons}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  mapVerification.approvedMapAvailable && styles.radioButtonActive,
                ]}
                onPress={() =>
                  setMapVerification((prev) => ({ ...prev, approvedMapAvailable: true }))
                }
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    mapVerification.approvedMapAvailable && styles.radioButtonTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  !mapVerification.approvedMapAvailable && styles.radioButtonActive,
                ]}
                onPress={() =>
                  setMapVerification((prev) => ({
                    ...prev,
                    approvedMapAvailable: false,
                    constructionMatchesMap: false,
                  }))
                }
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    !mapVerification.approvedMapAvailable && styles.radioButtonTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {!mapVerification.approvedMapAvailable && (
            <View style={styles.warningCard}>
              <Ionicons name="warning" size={20} color={COLORS.accent} style={styles.warningIcon} />
              <Text style={styles.warningText}>
                This property may be classified as unauthorized. Proceed with documentation.
              </Text>
            </View>
          )}

          {mapVerification.approvedMapAvailable && (
            <>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  Does Actual Construction Match Approved Map?
                </Text>
                <View style={styles.radioButtons}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      mapVerification.constructionMatchesMap && styles.radioButtonActive,
                    ]}
                    onPress={() =>
                      setMapVerification((prev) => ({
                        ...prev,
                        constructionMatchesMap: true,
                        deviations: [],
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        mapVerification.constructionMatchesMap && styles.radioButtonTextActive,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      !mapVerification.constructionMatchesMap && styles.radioButtonActive,
                    ]}
                    onPress={() =>
                      setMapVerification((prev) => ({
                        ...prev,
                        constructionMatchesMap: false,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.radioButtonText,
                        !mapVerification.constructionMatchesMap && styles.radioButtonTextActive,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!mapVerification.constructionMatchesMap && (
                <View style={styles.deviationsContainer}>
                  <Text style={styles.deviationsTitle}>Deviation Type:</Text>
                  {DEVIATION_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.deviationOption,
                        mapVerification.deviations.includes(option) && styles.deviationOptionSelected,
                      ]}
                      onPress={() => toggleDeviation(option)}
                    >
                      <View style={styles.deviationIconContainer}>
                        {mapVerification.deviations.includes(option) ? (
                          <Ionicons name="checkbox" size={20} color={COLORS.primary} />
                        ) : (
                          <Ionicons name="square-outline" size={20} color={COLORS.textSecond} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.deviationOptionText,
                          mapVerification.deviations.includes(option) && styles.deviationOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Additional Observations (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={mapVerification.remarks}
              onChangeText={(text) =>
                setMapVerification((prev) => ({ ...prev, remarks: text }))
              }
              placeholder="Enter any additional observations"
              placeholderTextColor={COLORS.textSecond}
              multiline
            />
          </View>
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
              navigation.navigate('ConstructionDetails', {
                surveyData: { ...surveyData, mapVerification },
              })
            }
          >
            <Text style={styles.nextButtonText}>Next: Construction Details →</Text>
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
  warningCard: {
    backgroundColor: COLORS.accent + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.accent,
    lineHeight: 20,
    flex: 1,
  },
  deviationsContainer: {
    marginBottom: 20,
  },
  deviationsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecond,
    marginBottom: 12,
  },
  deviationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deviationOptionSelected: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  deviationIconContainer: {
    marginRight: 8,
  },
  deviationOptionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  deviationOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: 0,
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
