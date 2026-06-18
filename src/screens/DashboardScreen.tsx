import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import EmptyState from '../components/ui/EmptyState';
import { ListSkeleton } from '../components/ui/Skeleton';
import SurveyCard from '../components/ui/SurveyCard';
import { colors, elevation, radius, spacing, tabBarClearance, typography } from '../theme/theme';

interface User {
  name?: string;
  zone?: string;
}

interface PastSurvey {
  surveyId: string;
  surveyDate: string;
  propertyId: string | null;
  address: string;
  result: string;
  recommendation: string;
}

const PAST_SURVEYS: PastSurvey[] = [
  {
    surveyId: 'SVY-2024-00891',
    surveyDate: '12 Jun 2025',
    propertyId: 'PDA-PRY-2021-00441',
    address: '14/3, Stanley Road, Civil Lines',
    result: 'Verified',
    recommendation: 'No Action Required',
  },
  {
    surveyId: 'SVY-2024-00876',
    surveyDate: '10 Jun 2025',
    propertyId: 'PDA-PRY-2019-00887',
    address: '7A, Lowther Road, George Town',
    result: 'Unauthorized Construction',
    recommendation: 'Challan Recommended',
  },
  {
    surveyId: 'SVY-2024-00843',
    surveyDate: '05 Jun 2025',
    propertyId: null,
    address: 'Near Triveni Marg, Phaphamau, Prayagraj',
    result: 'New Property Identified',
    recommendation: 'Warning Recommended',
  },
];

interface QuickAction {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface Props {
  navigation: any;
}

export default function DashboardScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const stats = { surveysToday: 3, verified: 2, flagged: 1 };

  const loadUser = useCallback(async () => {
    const userData = await AsyncStorage.getItem('pda_user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    (async () => {
      await loadUser();
      setLoading(false);
    })();
  }, [loadUser]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  }, [loadUser]);

  const quickActions: QuickAction[] = [
    { label: 'Start New Survey', icon: 'document-text-outline', onPress: () => navigation.navigate('NewSurvey') },
    { label: 'Survey History', icon: 'time-outline', onPress: () => navigation.navigate('History') },
    { label: 'Properties', icon: 'home-outline', onPress: () => navigation.navigate('Surveys') },
    { label: 'My Profile', icon: 'person-outline', onPress: () => navigation.navigate('Profile') },
  ];

  const firstName = user?.name?.split(' ')[0] ?? 'Surveyor';
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <View style={styles.container}>
      <Header title="Dashboard" onMenuPress={() => navigation.openDrawer?.()} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeText}>{greeting}, {firstName}</Text>
            <Text style={styles.zoneText}>{user?.zone ?? 'Zone 3 — Civil Lines'}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.slice(0, 2).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard value={stats.surveysToday} label="Today" color={colors.primary} />
          <StatCard value={stats.verified} label="Verified" color={colors.success} />
          <StatCard value={stats.flagged} label="Flagged" color={colors.error} />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <Pressable key={action.label} style={styles.quickActionCard} onPress={action.onPress}>
              <View style={styles.quickActionIconWrap}>
                <Ionicons name={action.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.noticeCard}>
          <Ionicons name="megaphone-outline" size={18} color={colors.primaryDark} />
          <Text style={styles.noticeText}>
            All surveys must include GPS and photograph evidence. Submissions without evidence are rejected.
          </Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Pressable onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {loading ? (
          <ListSkeleton count={3} />
        ) : PAST_SURVEYS.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="No surveys yet"
            description="Surveys you complete will show up here."
            actionLabel="Start a Survey"
            onAction={() => navigation.navigate('NewSurvey')}
          />
        ) : (
          PAST_SURVEYS.map((survey) => (
            <SurveyCard
              key={survey.surveyId}
              id={survey.surveyId}
              address={survey.address}
              status={survey.result}
              meta={survey.surveyDate}
              secondaryStatus={survey.recommendation}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg, paddingBottom: tabBarClearance },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...elevation.sm,
  },
  welcomeText: { ...typography.h3, color: colors.textPrimary },
  zoneText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.titleMedium, color: colors.primaryDark, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...elevation.sm,
  },
  statValue: { ...typography.h2, fontWeight: '800' },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAll: { ...typography.label, color: colors.primary },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...elevation.sm,
  },
  quickActionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600' },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  noticeText: { ...typography.bodySmall, color: colors.primaryDark, flex: 1, lineHeight: 19 },
});