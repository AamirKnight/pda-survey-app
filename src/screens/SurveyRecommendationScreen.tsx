import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import FormCard from '../components/ui/FomrCard';
import InputField from '../components/ui/InputFeild';
import { colors, radius, spacing, typography } from '../theme/theme';
import { getStatusStyle } from '../utils/status';

const RECOMMENDATIONS = [
  {
    id: 'No Action Required',
    icon: 'checkmark-circle',
    desc: 'Property is compliant. No further action needed.',
  },
  {
    id: 'Warning Recommended',
    icon: 'warning',
    desc: 'Minor irregularities noted. PDA officer to review and issue advisory.',
  },
  {
    id: 'Challan Recommended',
    icon: 'close-circle',
    desc: 'Significant unauthorized activity detected. Formal action warranted.',
  },
];

export default function SurveyRecommendationScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [recommendation, setRecommendation] = useState('No Action Required');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedStyle = getStatusStyle(recommendation);

  const handleSubmit = () => {
    Alert.alert('Submit Survey Report', 'Are you sure you want to submit this survey?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: () => {
          setSubmitting(true);
          setTimeout(() => {
            setSubmitting(false);
            navigation.navigate('SurveySuccess', {
              surveyData: { ...surveyData, recommendation, remarks },
            });
          }, 1400);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Recommendation"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step indicator — after step 5, this is the final action screen */}
        <View style={styles.finalBadge}>
          <Ionicons name="flag" size={14} color={colors.primary} />
          <Text style={styles.finalBadgeText}>Final Step · Survey Recommendation</Text>
        </View>

        <FormCard title="Recommendation">
          {RECOMMENDATIONS.map((rec) => {
            const s = getStatusStyle(rec.id);
            const selected = recommendation === rec.id;
            return (
              <Pressable
                key={rec.id}
                onPress={() => setRecommendation(rec.id)}
                style={[styles.option, selected && { borderColor: s.color, backgroundColor: s.tint }]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View style={[styles.optionIconWrap, { backgroundColor: selected ? s.color : colors.surface }]}>
                  <Ionicons name={rec.icon as any} size={22} color={selected ? colors.white : s.color} />
                </View>
                <View style={styles.optionBody}>
                  <Text style={[styles.optionTitle, selected && { color: s.color }]}>{rec.id}</Text>
                  <Text style={styles.optionDesc}>{rec.desc}</Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={22} color={s.color} />}
              </Pressable>
            );
          })}
        </FormCard>

        {/* Legal disclaimer — prominent dark card */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="lock-closed" size={16} color={colors.primaryLight} style={{ marginRight: spacing.sm }} />
          <Text style={styles.disclaimerText}>
            Surveyors are not authorized to issue notices or challans directly. This recommendation will be reviewed and actioned by PDA officials through the portal workflow.
          </Text>
        </View>

        <FormCard>
          <InputField
            label="Final Remarks"
            optional
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Any additional observations for the reviewer…"
            multiline
          />
        </FormCard>

        <Button
          label={submitting ? 'Submitting…' : 'Submit Survey Report'}
          onPress={handleSubmit}
          loading={submitting}
          icon="cloud-upload-outline"
          iconPosition="right"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },

  finalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryTint,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  finalBadgeText: { ...typography.caption, color: colors.primaryDark, fontWeight: '700' },

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

  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  disclaimerText: { ...typography.bodySmall, color: colors.white, flex: 1, lineHeight: 20 },
});