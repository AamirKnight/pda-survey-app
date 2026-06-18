import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  danger: '#C62828',
  border: '#DDE3EE',
  inputBg: '#EEF1F8',
};

const DUMMY_USERS = [
  {
    id: 'SRV-PDA-001',
    name: 'Ravi Kumar Sharma',
    designation: 'Field Surveyor',
    zone: 'Zone 3 — Civil Lines',
    ward: 'Ward 42 — Colonelganj',
    mobile: '9415112233',
    password: 'pda@1234',
    avatar: null,
  },
  {
    id: 'SRV-PDA-002',
    name: 'Sunita Devi Mishra',
    designation: 'Senior Surveyor',
    zone: 'Zone 5 — Allahpur',
    ward: 'Ward 61 — Allahpur',
    mobile: '9415445566',
    password: 'pda@5678',
    avatar: null,
  },
];

export default function LoginScreen({ navigation, onLogin }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!mobile || !password) {
      setError('Please enter both mobile number and password');
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      const user = DUMMY_USERS.find(u => u.mobile === mobile && u.password === password);
      if (user) {
        await AsyncStorage.setItem('pda_user', JSON.stringify(user));
        setLoading(false);
        if (onLogin) {
          onLogin(user);
        } else {
          navigation.replace('MainDrawer');
        }
      } else {
        setError('Invalid mobile number or password');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.gradientBackground}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={48} color={COLORS.primary} style={styles.logoIcon} />
            <Text style={styles.logo}>PDA</Text>
          </View>
          <Text style={styles.subtitle}>Field Survey Application</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textSecond}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={COLORS.textSecond}
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Please contact your supervisor')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <View style={styles.helperContainer}>
            <Text style={styles.helperText}>Dummy Credentials:</Text>
            <Text style={styles.helperCredentials}>Mobile: 9415112233 | Password: pda@1234</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Prayagraj Development Authority | Uttar Pradesh</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    marginRight: 8,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecond,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 24,
  },
  helperContainer: {
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecond,
    marginBottom: 4,
  },
  helperCredentials: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.white,
    fontSize: 12,
  },
});
