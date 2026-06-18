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
import { colors, elevation, radius, spacing, typography } from '../theme/theme';

export default function ConstructionDetailsScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [natureOfConstruction, setNatureOfConstruction] = useState('Residential');
  const [numberOfFloors, setNumberOfFloors] = useState(1);
  const [approximateArea, setApproximateArea] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleNext = () => {
    navigation.navigate('EvidenceUpload', {
      surveyData: {
        ...surveyData,
        constructionData: { natureOfConstruction, numberOfFloors, approximateArea, remarks },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Construction Details"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepProgress current={3} total={5} />

        <FormCard title="Nature of Construction">
          <SegmentedControl
            options={[
              { value: 'Residential', label: 'Residential' },
              { value: 'Commercial', label: 'Commercial' },
              { value: 'Mixed', label: 'Mixed Use' },
            ]}
            value={natureOfConstruction}
            onChange={setNatureOfConstruction}
          />
        </FormCard>

        <FormCard title="Number of Floors">
          <View style={styles.stepperRow}>
            <Pressable
              onPress={() => setNumberOfFloors((n) => Math.max(1, n - 1))}
              style={[styles.stepperBtn, numberOfFloors <= 1 && styles.stepperBtnDisabled]}
              disabled={numberOfFloors <= 1}
            >
              <Ionicons name="remove" size={22} color={numberOfFloors <= 1 ? colors.textTertiary : colors.white} />
            </Pressable>

            <View style={styles.stepperValue}>
              <Text style={styles.stepperNumber}>{numberOfFloors}</Text>
              <Text style={styles.stepperUnit}>{numberOfFloors === 1 ? 'floor' : 'floors'}</Text>
            </View>

            <Pressable
              onPress={() => setNumberOfFloors((n) => Math.min(15, n + 1))}
              style={[styles.stepperBtn, numberOfFloors >= 15 && styles.stepperBtnDisabled]}
              disabled={numberOfFloors >= 15}
            >
              <Ionicons name="add" size={22} color={numberOfFloors >= 15 ? colors.textTertiary : colors.white} />
            </Pressable>
          </View>

          {/* Floor dots indicator */}
          <View style={styles.floorDots}>
            {Array.from({ length: Math.min(numberOfFloors, 10) }).map((_, i) => (
              <View key={i} style={[styles.floorDot, i < numberOfFloors && styles.floorDotFilled]} />
            ))}
            {numberOfFloors > 10 && (
              <Text style={styles.floorMore}>+{numberOfFloors - 10} more</Text>
            )}
          </View>
        </FormCard>

        <FormCard title="Additional Details">
          <InputField
            label="Approximate Plot Area (sq. ft.)"
            optional
            value={approximateArea}
            onChangeText={setApproximateArea}
            placeholder="e.g. 1200"
            keyboardType="numeric"
          />
          <InputField
            label="Remarks"
            optional
            value={remarks}
            onChangeText={setRemarks}
            placeholder="e.g. Third floor under construction, no slab visible yet."
            multiline
          />
        </FormCard>

        <InfoBanner
          variant="info"
          message="Observations are for documentation only. No legal action is taken at this stage."
        />

        <NavButtons
          onBack={() => navigation.goBack()}
          onNext={handleNext}
          nextLabel="Upload Evidence"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },

  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  stepperBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  stepperBtnDisabled: { backgroundColor: colors.border },
  stepperValue: {
    flex: 1,
    alignItems: 'center',
  },
  stepperNumber: { fontSize: 36, fontWeight: '800', color: colors.textPrimary, lineHeight: 40 },
  stepperUnit: { ...typography.caption, color: colors.textSecondary },
  floorDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.lg,
    justifyContent: 'center',
  },
  floorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  floorDotFilled: { backgroundColor: colors.primary },
  floorMore: { ...typography.caption, color: colors.textTertiary, alignSelf: 'center' },
});