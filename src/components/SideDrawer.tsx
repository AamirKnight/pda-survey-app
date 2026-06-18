import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../theme/theme';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline', screen: 'MainTabs', params: { screen: 'Dashboard' } },
  { id: 'surveys', label: 'My Surveys', icon: 'clipboard-outline', screen: 'MainTabs', params: { screen: 'Surveys' } },
  { id: 'newSurvey', label: 'Start New Survey', icon: 'add-circle-outline', screen: 'NewSurvey' },
  { id: 'history', label: 'Survey History', icon: 'time-outline', screen: 'MainTabs', params: { screen: 'History' } },
  { id: 'profile', label: 'Profile', icon: 'person-outline', screen: 'MainTabs', params: { screen: 'Profile' } },
];

export default function SideDrawer({ navigation, currentUser }) {
  const insets = useSafeAreaInsets();

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SR';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('pda_user');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const handleNav = (item: typeof MENU_ITEMS[0]) => {
    if (item.params) navigation.navigate(item.screen, item.params);
    else navigation.navigate(item.screen);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Profile header */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name} numberOfLines={1}>{currentUser?.name ?? 'Surveyor'}</Text>
          <Text style={styles.id}>{currentUser?.id ?? 'SRV-PDA-001'}</Text>
        </View>
      </View>

      <View style={styles.zoneBadge}>
        <Ionicons name="location-outline" size={12} color={colors.primaryLight} />
        <Text style={styles.zoneText}>{currentUser?.zone ?? 'Zone 3 — Civil Lines'}</Text>
      </View>

      <View style={styles.divider} />

      {/* Nav items */}
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        <Text style={styles.menuSection}>NAVIGATION</Text>
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={() => handleNav(item)}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon as any} size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
          </Pressable>
        ))}

        <View style={styles.divider} />
        <Text style={styles.menuSection}>ACCOUNT</Text>

        <Pressable
          style={({ pressed }) => [styles.menuItem, styles.menuItemLogout, pressed && styles.menuItemPressed]}
          onPress={handleLogout}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: colors.errorTint }]}>
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
          </View>
          <Text style={[styles.menuLabel, { color: colors.error }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Text style={styles.footerText}>PDA Field App · v1.0.0</Text>
        <Text style={styles.footerSub}>Uttar Pradesh Government</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { ...typography.h3, color: colors.white, fontWeight: '800' },
  profileInfo: { flex: 1 },
  name: { ...typography.titleLarge, color: colors.white, marginBottom: 2 },
  id: { ...typography.caption, color: colors.primaryLight },

  zoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  zoneText: { ...typography.caption, color: colors.primaryLight },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },

  menu: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  menuSection: {
    ...typography.overline,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  menuItemPressed: { backgroundColor: colors.surface },
  menuItemLogout: { marginTop: spacing.xs },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1, fontWeight: '600' },

  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerText: { ...typography.caption, color: colors.textSecondary },
  footerSub: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});