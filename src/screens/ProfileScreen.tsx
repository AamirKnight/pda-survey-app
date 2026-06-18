import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import { colors, elevation, radius, spacing, tabBarClearance, typography } from '../theme/theme';

// ─── Types ──────────────────────────────────────────────────────────────────

interface UserData {
  name?: string;
  designation?: string;
  id?: string;
  zone?: string;
  ward?: string;
  mobile?: string;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, last && styles.rowLast]}>
      <Ionicons name={icon} size={18} color={colors.primary} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingToggle({
  label,
  value,
  onChange,
  last = false,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.settingRow, last && styles.rowLast]}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary + '40' }}
        thumbColor={value ? colors.primary : colors.textSecondary}
      />
    </View>
  );
}

function SettingLink({
  label,
  onPress,
  last = false,
}: {
  label: string;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, last && styles.rowLast]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [gpsAutoCapture, setGpsAutoCapture] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('pda_user').then((raw) => {
      if (raw) setUser(JSON.parse(raw));
    });
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'SR';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('pda_user');
          navigation.navigate('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" onMenuPress={() => navigation.openDrawer()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Surveyor'}</Text>
          <Text style={styles.profileDesignation}>
            {user?.designation || 'Field Surveyor'}
          </Text>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>{user?.id || 'SRV-PDA-001'}</Text>
          </View>
        </View>

        {/* ── Info card ── */}
        <View style={styles.card}>
          <InfoRow icon="location-outline" label="Zone" value={user?.zone || 'Zone 3 — Civil Lines'} />
          <InfoRow icon="business-outline" label="Ward" value={user?.ward || 'Ward 42 — Colonelganj'} />
          <InfoRow icon="call-outline" label="Mobile" value={user?.mobile || '9415112233'} />
          <InfoRow icon="calendar-outline" label="Joined" value="January 2022" last />
        </View>

        {/* ── App settings ── */}
        <SectionHeader title="APP SETTINGS" />
        <View style={styles.card}>
          <SettingToggle
            label="GPS Auto-Capture"
            value={gpsAutoCapture}
            onChange={setGpsAutoCapture}
          />
          <SettingToggle
            label="Notifications"
            value={notifications}
            onChange={setNotifications}
            last
          />
        </View>

        {/* ── Support ── */}
        <SectionHeader title="SUPPORT" />
        <View style={styles.card}>
          <SettingLink label="Help & Documentation" />
          <SettingLink label="Report Issue" />
          <SettingLink label="About PDA" last />
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: tabBarClearance + spacing.lg,
  },

  // Profile hero card
  profileCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...elevation.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h2,
    color: colors.primary,
  },
  profileName: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  profileDesignation: {
    ...typography.body,
    color: colors.white,
    opacity: 0.85,
    marginBottom: spacing.md,
  },
  idBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  idBadgeText: {
    ...typography.caption,
    color: colors.accent ?? '#E8A020',
    letterSpacing: 0.5,
  },

  // Generic card
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...elevation.sm,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    marginRight: spacing.md,
    width: 20,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  rowValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },

  // Section headers
  sectionHeader: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },

  // Setting rows (toggle + link)
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
    ...elevation.sm,
  },
  logoutIcon: {
    marginRight: spacing.sm,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: colors.error,
  },
});