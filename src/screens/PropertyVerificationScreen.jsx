import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';

const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
  inputBg: '#EEF1F8',
};

const REGISTERED_PROPERTIES = [
  {
    propertyId: 'PDA-PRY-2021-00441',
    ownerName: 'Ramesh Chandra Gupta',
    address: '14/3, Stanley Road, Civil Lines, Prayagraj - 211001',
    landmark: 'Near Alfred Park Gate No. 2',
    ward: 'Ward 42 — Colonelganj',
    zone: 'Zone 3 — Civil Lines',
    natureOfConstruction: 'Residential',
    approvedFloors: 2,
    approvedMapAvailable: true,
    lat: 25.4536,
    lng: 81.8439,
    status: 'Active',
  },
  {
    propertyId: 'PDA-PRY-2019-00887',
    ownerName: 'Meena Tiwari',
    address: '7A, Lowther Road, George Town, Prayagraj - 211002',
    landmark: 'Opposite High Court Gate 3',
    ward: 'Ward 38 — George Town',
    zone: 'Zone 2 — Sadar',
    natureOfConstruction: 'Commercial',
    approvedFloors: 3,
    approvedMapAvailable: true,
    lat: 25.4482,
    lng: 81.8312,
    status: 'Active',
  },
];

export default function PropertyVerificationScreen({ navigation, route }) {
  const { propertyId, isNew = false, surveyId: initialSurveyId } = route.params || {};
  const [surveyData, setSurveyData] = useState({
    surveyId: initialSurveyId || `SVY-2025-${Date.now().toString().slice(-5)}`,
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    surveyor: 'Ravi Kumar Sharma',
    lat: null,
    lng: null,
    timestamp: new Date().toLocaleTimeString(),
  });
  const [property, setProperty] = useState(null);
  const [newProperty, setNewProperty] = useState({
    ownerName: '',
    address: '',
    landmark: '',
  });
  const [verifications, setVerifications] = useState({
    ownerNameMatches: false,
    addressMatches: false,
    landmarkMatches: false,
  });
  const [propertyFound, setPropertyFound] = useState(!isNew);

  useEffect(() => {
    if (propertyId) {
      const found = REGISTERED_PROPERTIES.find(p => p.propertyId === propertyId);
      setProperty(found);
    }

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setSurveyData(prev => ({
          ...prev,
          lat: 25.4358,
          lng: 81.8463,
        }));
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setSurveyData(prev => ({
        ...prev,
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      }));
    };
    getLocation();
  }, [propertyId]);

  const handleContinue = () => {
    if (!propertyFound && !isNew) {
      Alert.alert('Property Not Found', 'Survey will be flagged. Do you want to continue?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () =>
            navigation.navigate('MapVerification', {
              surveyData: {
                ...surveyData,
                property,
                isNew,
                verifications,
                propertyFound,
              },
            }),
        },
      ]);
      return;
    }
    navigation.navigate('MapVerification', {
      surveyData: {
        ...surveyData,
        property,
        newProperty,
        isNew,
        verifications,
        propertyFound,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Property Verification"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Survey Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Survey ID:</Text>
            <Text style={styles.infoValue}>{surveyData.surveyId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{surveyData.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Surveyor:</Text>
            <Text style={styles.infoValue}>{surveyData.surveyor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GPS:</Text>
            <Text style={styles.infoValue}>
              {surveyData.lat
                ? `${surveyData.lat.toFixed(4)}° N, ${surveyData.lng.toFixed(4)}° E`
                : 'Fetching...'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time:</Text>
            <Text style={styles.infoValue}>{surveyData.timestamp}</Text>
          </View>
        </View>

        {isNew ? (
          <>
            <View style={styles.noteCard}>
              <Ionicons name="push" size={20} color={COLORS.primary} style={styles.noteIcon} />
              <Text style={styles.noteText}>
                This property is not in the PDA registry. Please complete all details carefully.
              </Text>
            </View>
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Property Details</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Owner Name (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={newProperty.ownerName}
                  onChangeText={(text) =>
                    setNewProperty((prev) => ({ ...prev, ownerName: text }))
                  }
                  placeholder="Enter owner name"
                  placeholderTextColor={COLORS.textSecond}
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newProperty.address}
                  onChangeText={(text) =>
                    setNewProperty((prev) => ({ ...prev, address: text }))
                  }
                  placeholder="Enter full address"
                  placeholderTextColor={COLORS.textSecond}
                  multiline
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Landmark</Text>
                <TextInput
                  style={styles.input}
                  value={newProperty.landmark}
                  onChangeText={(text) =>
                    setNewProperty((prev) => ({ ...prev, landmark: text }))
                  }
                  placeholder="Enter nearby landmark"
                  placeholderTextColor={COLORS.textSecond}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Property Identification</Text>
            {property && (
              <>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Property ID</Text>
                  <Text style={styles.fieldValue}>{property.propertyId}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Owner Name</Text>
                  <Text style={styles.fieldValue}>{property.ownerName}</Text>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      verifications.ownerNameMatches && styles.checkboxChecked,
                    ]}
                    onPress={() =>
                      setVerifications((prev) => ({
                        ...prev,
                        ownerNameMatches: !prev.ownerNameMatches,
                      }))
                    }
                  >
                    <Text style={styles.checkboxLabel}>Owner Name Matches</Text>
                    {verifications.ownerNameMatches && <Ionicons name="checkmark" size={20} color={COLORS.success} />}
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Address</Text>
                  <Text style={styles.fieldValue}>{property.address}</Text>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      verifications.addressMatches && styles.checkboxChecked,
                    ]}
                    onPress={() =>
                      setVerifications((prev) => ({
                        ...prev,
                        addressMatches: !prev.addressMatches,
                      }))
                    }
                  >
                    <Text style={styles.checkboxLabel}>Address Matches</Text>
                    {verifications.addressMatches && <Ionicons name="checkmark" size={20} color={COLORS.success} />}
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Landmark</Text>
                  <Text style={styles.fieldValue}>{property.landmark}</Text>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      verifications.landmarkMatches && styles.checkboxChecked,
                    ]}
                    onPress={() =>
                      setVerifications((prev) => ({
                        ...prev,
                        landmarkMatches: !prev.landmarkMatches,
                      }))
                    }
                  >
                    <Text style={styles.checkboxLabel}>Landmark Matches</Text>
                    {verifications.landmarkMatches && <Ionicons name="checkmark" size={20} color={COLORS.success} />}
                  </TouchableOpacity>
                </View>
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Property Found on Site?</Text>
                  <View style={styles.toggleButtons}>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        propertyFound && styles.toggleButtonActive,
                      ]}
                      onPress={() => setPropertyFound(true)}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          propertyFound && styles.toggleButtonTextActive,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        !propertyFound && styles.toggleButtonActive,
                      ]}
                      onPress={() => setPropertyFound(false)}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          !propertyFound && styles.toggleButtonTextActive,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Proceed to Map Verification</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecond,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  noteCard: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 20,
    flex: 1,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecond,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success + '10',
    borderColor: COLORS.success,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  toggleContainer: {
    marginTop: 8,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecond,
    marginBottom: 12,
  },
  toggleButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  toggleButtonTextActive: {
    color: COLORS.white,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
