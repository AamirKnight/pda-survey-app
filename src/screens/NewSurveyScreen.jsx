import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';

const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
};

export default function NewSurveyScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const surveyId = `SVY-2025-${Date.now().toString().slice(-5)}`;

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('pda_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({ lat: 25.4358, lng: 81.8463 });
        setLoadingLocation(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setLoadingLocation(false);
    };
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Start New Survey"
        onMenuPress={() => navigation.openDrawer()}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Survey ID:</Text>
            <Text style={styles.infoValue}>{surveyId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Surveyor:</Text>
            <Text style={styles.infoValue}>
              {user?.name || 'Ravi Kumar Sharma'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GPS Status:</Text>
            {loadingLocation ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.infoValue}>
                {location?.lat.toFixed(4)}° N, {location?.lng.toFixed(4)}° E
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.dividerText}>SELECT SURVEY TYPE</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('SurveyListMain')}
        >
          <Ionicons name="home" size={48} color={COLORS.primary} style={styles.optionIcon} />
          <Text style={styles.optionTitle}>Registered Property Verification</Text>
          <Text style={styles.optionDesc}>
            Verify an existing property in PDA registry.
          </Text>
          <View style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select & Continue</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() =>
            navigation.navigate('PropertyVerification', {
              isNew: true,
              surveyId,
            })
          }
        >
          <Ionicons name="location" size={48} color={COLORS.primary} style={styles.optionIcon} />
          <Text style={styles.optionTitle}>Non-Registered Property</Text>
          <Text style={styles.optionDesc}>
            Log a new or unauthorized property found during field inspection.
          </Text>
          <View style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select & Continue</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecond,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecond,
    letterSpacing: 2,
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  optionIcon: {
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 14,
    color: COLORS.textSecond,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
