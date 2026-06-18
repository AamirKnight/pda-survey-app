import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import FormCard from '../components/ui/FomrCard';
import NavButtons from '../components/ui/NavButtons';
import StepProgress from '../components/ui/StepProgress';
import { colors, radius, spacing, typography } from '../theme/theme';
import { getStatusStyle } from '../utils/status';

const REGISTERED_OPTIONS = [
  { id: 'Verified', icon: 'checkmark-circle', desc: 'Property details match records. No issues found.' },
  { id: 'Data Mismatch', icon: 'warning', desc: 'One or more details differ from the registry.' },
  { id: 'Unauthorized Construction', icon: 'close-circle', desc: 'Construction exceeds approved map or no map found.' },
];

const NEW_OPTIONS = [
  { id: 'New Property Identified', icon: 'add-circle', desc: 'Property exists but is not in the PDA registry.' },
  { id: 'Unauthorized Property', icon: 'close-circle', desc: 'Property exists without any legal documentation.' },
];

export default function SurveyResultScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const isNewProperty = surveyData?.isNew;
  const options = isNewProperty ? NEW_OPTIONS : REGISTERED_OPTIONS;
  const [result, setResult] = useState(options[0].id);

  const selectedStyle = getStatusStyle(result);

  return (
    <View style={styles.container}>
      <Header
        title="Survey Result"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepProgress current={5} total={5} />

        <FormCard title="Select Survey Outcome">
          {options.map((opt) => {
            const s = getStatusStyle(opt.id);
            const selected = result === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setResult(opt.id)}
                style={[styles.option, selected && { borderColor: s.color, backgroundColor: s.tint }]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View style={[styles.optionIconWrap, { backgroundColor: selected ? s.color : colors.surface }]}>
                  <Ionicons name={opt.icon as any} size={22} color={selected ? colors.white : s.color} />
                </View>
                <View style={styles.optionBody}>
                  <Text style={[styles.optionTitle, selected && { color: s.color }]}>{opt.id}</Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
                {selected && (
                  <Ionicons name="checkmark-circle" size={22} color={s.color} />
                )}
              </Pressable>
            );
          })}
        </FormCard>

        {/* Preview of selection */}
        <View style={[styles.selectedPreview, { backgroundColor: selectedStyle.tint, borderColor: selectedStyle.color }]}>
          <Ionicons name={selectedStyle.icon as any} size={18} color={selectedStyle.color} />
          <Text style={[styles.selectedText, { color: selectedStyle.color }]}>
            Selected outcome: <Text style={{ fontWeight: '800' }}>{result}</Text>
          </Text>
        </View>

        <NavButtons
          onBack={() => navigation.goBack()}
          onNext={() =>
            navigation.navigate('SurveyRecommendation', { surveyData: { ...surveyData, result } })
          }
          nextLabel="Recommendation"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBody: { flex: 1 },
  optionTitle: { ...typography.label, color: colors.textPrimary, fontWeight: '700', marginBottom: 3 },
  optionDesc: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 17 },

  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  selectedText: { ...typography.bodySmall, flex: 1 },
});