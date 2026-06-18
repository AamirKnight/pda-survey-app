import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import FormCard from '../components/ui/FomrCard';
import InfoBanner from '../components/ui/InfoBanner';
import InputField from '../components/ui/InputFeild';
import NavButtons from '../components/ui/NavButtons';
import SegmentedControl from '../components/ui/SegmentedControl';
import StepProgress from '../components/ui/StepProgress';
import { colors, radius, spacing, typography } from '../theme/theme';

const DEVIATION_OPTIONS = [
  { id: 'Additional Floor', icon: 'layers-outline' },
  { id: 'Additional Construction Area', icon: 'expand-outline' },
  { id: 'Structural Modification', icon: 'construct-outline' },
  { id: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

export default function MapVerificationScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [approvedMapAvailable, setApprovedMapAvailable] = useState(true);
  const [constructionMatchesMap, setConstructionMatchesMap] = useState(true);
  const [deviations, setDeviations] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');

  const toggleDeviation = (id: string) => {
    setDeviations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    navigation.navigate('ConstructionDetails', {
      surveyData: {
        ...surveyData,
        mapVerification: { approvedMapAvailable, constructionMatchesMap, deviations, remarks },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Map Verification"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepProgress current={2} total={5} />

        <FormCard title="Approved Map">
          <Text style={styles.question}>Is an approved map available for this property?</Text>
          <SegmentedControl
            options={[{ value: 'yes', label: 'Yes — Available' }, { value: 'no', label: 'No — Unavailable' }]}
            value={approvedMapAvailable ? 'yes' : 'no'}
            onChange={(v) => {
              const val = v === 'yes';
              setApprovedMapAvailable(val);
              if (!val) setConstructionMatchesMap(false);
            }}
          />

          {!approvedMapAvailable && (
            <View style={styles.bannerWrap}>
              <InfoBanner
                variant="warning"
                message="No approved map on record. This property may be classified as unauthorized. Proceed with documentation."
              />
            </View>
          )}
        </FormCard>

        {approvedMapAvailable && (
          <FormCard title="Construction Compliance">
            <Text style={styles.question}>Does the actual construction match the approved map?</Text>
            <SegmentedControl
              options={[
                { value: 'yes', label: 'Yes — Matches' },
                { value: 'no', label: 'No — Deviation Found' },
              ]}
              value={constructionMatchesMap ? 'yes' : 'no'}
              onChange={(v) => {
                const val = v === 'yes';
                setConstructionMatchesMap(val);
                if (val) setDeviations([]);
              }}
            />

            {!constructionMatchesMap && (
              <View style={styles.deviationsWrap}>
                <Text style={styles.deviationsTitle}>Deviation Types Observed</Text>
                {DEVIATION_OPTIONS.map((opt) => {
                  const selected = deviations.includes(opt.id);
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => toggleDeviation(opt.id)}
                      style={[styles.deviationRow, selected && styles.deviationRowSelected]}
                    >
                      <Ionicons
                        name={opt.icon as any}
                        size={18}
                        color={selected ? colors.primary : colors.textTertiary}
                        style={styles.deviationIcon}
                      />
                      <Text style={[styles.deviationText, selected && styles.deviationTextSelected]}>
                        {opt.id}
                      </Text>
                      <Ionicons
                        name={selected ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={selected ? colors.primary : colors.textTertiary}
                      />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </FormCard>
        )}

        <FormCard>
          <InputField
            label="Additional Observations"
            optional
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Note any additional observations here…"
            multiline
          />
        </FormCard>

        <NavButtons
          onBack={() => navigation.goBack()}
          onNext={handleNext}
          nextLabel="Construction Details"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },

  question: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600', marginBottom: spacing.md },
  bannerWrap: { marginTop: spacing.lg },

  deviationsWrap: { marginTop: spacing.lg },
  deviationsTitle: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },
  deviationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  deviationRowSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  deviationIcon: { marginRight: spacing.md },
  deviationText: { ...typography.bodyMedium, color: colors.textSecondary, flex: 1 },
  deviationTextSelected: { color: colors.primaryDark, fontWeight: '600' },
});