import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, elevation, radius, spacing, typography } from '../theme/theme';

const DUMMY_USERS = [
  {
    id: 'SRV-PDA-001',
    name: 'Ravi Kumar Sharma',
    designation: 'Field Surveyor',
    zone: 'Zone 3 — Civil Lines',
    ward: 'Ward 42 — Colonelganj',
    mobile: '9415112233',
    password: 'pda@1234',
  },
  {
    id: 'SRV-PDA-002',
    name: 'Sunita Devi Mishra',
    designation: 'Senior Surveyor',
    zone: 'Zone 5 — Allahpur',
    ward: 'Ward 61 — Allahpur',
    mobile: '9415445566',
    password: 'pda@5678',
  },
];

export default function LoginScreen({ navigation, onLogin }) {
  const insets = useSafeAreaInsets();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    setError('');
    if (!mobile || !password) {
      setError('Please enter both mobile number and password.');
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      const user = DUMMY_USERS.find((u) => u.mobile === mobile && u.password === password);
      if (user) {
        await AsyncStorage.setItem('pda_user', JSON.stringify(user));
        setLoading(false);
        if (onLogin) onLogin(user);
        else navigation.replace('MainDrawer');
      } else {
        setError('Invalid mobile number or password.');
        setLoading(false);
      }
    }, 1400);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Deep-navy header band */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.xxl }]}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="business" size={26} color={colors.white} />
          </View>
          <Text style={styles.logoText}>PDA</Text>
        </View>
        <Text style={styles.appName}>Field Survey Application</Text>
        <Text style={styles.org}>Prayagraj Development Authority</Text>
      </View>

      {/* White card rising from bottom */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in to your account</Text>

          {/* Mobile */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'mobile' && styles.inputRowFocused,
                !!error && styles.inputRowError,
              ]}
            >
              <Ionicons name="call-outline" size={18} color={colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="numeric"
                placeholder="Enter your mobile number"
                placeholderTextColor={colors.textTertiary}
                onFocus={() => setFocusedField('mobile')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
                maxLength={10}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'password' && styles.inputRowFocused,
                !!error && styles.inputRowError,
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color={colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textTertiary}
                />
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </Pressable>

          <Pressable style={styles.forgotWrap} onPress={() => {}}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {/* Demo credentials */}
          <View style={styles.demoBox}>
            <View style={styles.demoHeader}>
              <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
              <Text style={styles.demoTitle}>Demo Credentials</Text>
            </View>
            <Text style={styles.demoLine}>Mobile: 9415112233</Text>
            <Text style={styles.demoLine}>Password: pda@1234</Text>
          </View>
        </View>

        <Text style={styles.footer}>v1.0.0 · Uttar Pradesh Government</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },

  header: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  logoText: { fontSize: 36, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  appName: { ...typography.h3, color: colors.white, opacity: 0.9, marginBottom: spacing.xs },
  org: { ...typography.caption, color: colors.primaryLight, letterSpacing: 0.3 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    ...elevation.lg,
    marginBottom: spacing.xl,
  },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xl },

  fieldWrap: { marginBottom: spacing.lg },
  fieldLabel: { ...typography.label, color: colors.textPrimary, marginBottom: spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  inputRowFocused: { borderColor: colors.primary, backgroundColor: colors.white },
  inputRowError: { borderColor: colors.error },
  inputIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    height: '100%',
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  errorText: { ...typography.caption, color: colors.error },

  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...elevation.sm,
  },
  loginBtnPressed: { backgroundColor: colors.primaryDark },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { ...typography.titleMedium, color: colors.white, fontWeight: '700' },

  forgotWrap: { alignItems: 'center', paddingVertical: spacing.sm },
  forgotText: { ...typography.label, color: colors.primary },

  demoBox: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  demoTitle: { ...typography.label, color: colors.primaryDark, fontWeight: '700' },
  demoLine: { ...typography.bodySmall, color: colors.primaryDark, marginBottom: 2 },

  footer: { ...typography.caption, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
});