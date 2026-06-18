import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Header from '../components/Header';
import { colors, elevation, radius, spacing, tabBarClearance, typography } from '../theme/theme';

export default function NewSurveyScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const surveyId = `SVY-2025-${Date.now().toString().slice(-5)}`;

  useEffect(() => {
    AsyncStorage.getItem('pda_user').then((raw) => {
      if (raw) setUser(JSON.parse(raw));
    });

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({ lat: 25.4358, lng: 81.8463 });
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
      setLoadingLocation(false);
    })();
  }, []);

  const META = [
    { label: 'Survey ID', value: surveyId },
    {
      label: 'Date',
      value: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    { label: 'Surveyor', value: user?.name ?? 'Loading…' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="New Survey"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Session meta card */}
        <View style={styles.metaCard}>
          {META.map((m) => (
            <View key={m.label} style={styles.metaRow}>
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={styles.metaValue}>{m.value}</Text>
            </View>
          ))}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>GPS Status</Text>
            {loadingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <View style={styles.gpsPill}>
                <Ionicons name="location" size={12} color={colors.success} />
                <Text style={styles.gpsText}>
                  {location?.lat.toFixed(4)}°N · {location?.lng.toFixed(4)}°E
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.sectionLabel}>SELECT SURVEY TYPE</Text>

        {/* Option 1 — Registered */}
        <SurveyTypeCard
          icon="home"
          iconBg={colors.primaryTint}
          iconColor={colors.primary}
          title="Registered Property"
          desc="Verify an existing property against the PDA registry records."
          tag="Most Common"
          tagColor={colors.primary}
          onPress={() => navigation.navigate('SurveyListMain')}
        />

        {/* Option 2 — Non-Registered */}
        <SurveyTypeCard
          icon="add-circle"
          iconBg={colors.infoTint}
          iconColor={colors.info}
          title="Non-Registered Property"
          desc="Log a new or unauthorized property found during field inspection."
          onPress={() =>
            navigation.navigate('PropertyVerification', {
              isNew: true,
              surveyId,
            })
          }
        />
      </ScrollView>
    </View>
  );
}

function SurveyTypeCard({ icon, iconBg, iconColor, title, desc, tag, tagColor, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.typeCard, pressed && styles.typeCardPressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={[styles.typeIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={28} color={iconColor} />
      </View>
      <View style={styles.typeBody}>
        <View style={styles.typeTitleRow}>
          <Text style={styles.typeTitle}>{title}</Text>
          {tag ? (
            <View style={[styles.tag, { backgroundColor: tagColor + '18' }]}>
              <Text style={[styles.tagText, { color: tagColor }]}>{tag}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.typeDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: tabBarClearance },

  metaCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...elevation.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  metaLabel: { ...typography.bodySmall, color: colors.textSecondary },
  metaValue: { ...typography.label, color: colors.textPrimary, fontWeight: '700' },
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successTint,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  gpsText: { ...typography.caption, color: colors.success, fontWeight: '700' },

  sectionLabel: {
    ...typography.overline,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },

  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    gap: spacing.lg,
    ...elevation.sm,
  },
  typeCardPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  typeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBody: { flex: 1 },
  typeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  typeTitle: { ...typography.titleMedium, color: colors.textPrimary, fontWeight: '700' },
  typeDesc: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 18 },
  tag: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: { ...typography.caption, fontWeight: '700' },
});