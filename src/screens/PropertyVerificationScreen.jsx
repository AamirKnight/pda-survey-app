import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
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
import InfoBanner from '../components/ui/InfoBanner';
import InputField from '../components/ui/InputFeild';
import StepProgress from '../components/ui/StepProgress';
import { colors, radius, spacing, typography } from '../theme/theme';

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
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    surveyor: 'Ravi Kumar Sharma',
    lat: null,
    lng: null,
    timestamp: new Date().toLocaleTimeString(),
  });
  const [property, setProperty] = useState(null);
  const [newProperty, setNewProperty] = useState({ ownerName: '', address: '', landmark: '' });
  const [verifications, setVerifications] = useState({
    ownerNameMatches: false,
    addressMatches: false,
    landmarkMatches: false,
  });
  const [propertyFound, setPropertyFound] = useState(!isNew);

  useEffect(() => {
    if (propertyId) {
      setProperty(REGISTERED_PROPERTIES.find((p) => p.propertyId === propertyId) ?? null);
    }
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setSurveyData((p) => ({ ...p, lat: 25.4358, lng: 81.8463 }));
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setSurveyData((p) => ({ ...p, lat: loc.coords.latitude, lng: loc.coords.longitude }));
    })();
  }, [propertyId]);

  const handleContinue = () => {
    if (!propertyFound && !isNew) {
      Alert.alert('Property Not Found', 'Survey will be flagged. Do you want to continue?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () =>
            navigation.navigate('MapVerification', {
              surveyData: { ...surveyData, property, isNew, verifications, propertyFound },
            }),
        },
      ]);
      return;
    }
    navigation.navigate('MapVerification', {
      surveyData: { ...surveyData, property, newProperty, isNew, verifications, propertyFound },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Property Verification"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepProgress current={1} total={5} />

        {/* Session info */}
        <FormCard title="Survey Session">
          {[
            ['Survey ID', surveyData.surveyId],
            ['Date', surveyData.date],
            ['Surveyor', surveyData.surveyor],
            ['Time', surveyData.timestamp],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GPS</Text>
            {surveyData.lat ? (
              <View style={styles.gpsPill}>
                <Ionicons name="location" size={12} color={colors.success} />
                <Text style={styles.gpsText}>
                  {surveyData.lat.toFixed(4)}°N · {surveyData.lng.toFixed(4)}°E
                </Text>
              </View>
            ) : (
              <Text style={styles.infoValue}>Fetching…</Text>
            )}
          </View>
        </FormCard>

        {isNew ? (
          <>
            <InfoBanner
              variant="info"
              message="This property is not in the PDA registry. Please complete all details carefully."
            />
            <FormCard title="Property Details">
              <InputField
                label="Owner Name"
                optional
                value={newProperty.ownerName}
                onChangeText={(t) => setNewProperty((p) => ({ ...p, ownerName: t }))}
                placeholder="Enter owner name"
              />
              <InputField
                label="Address"
                value={newProperty.address}
                onChangeText={(t) => setNewProperty((p) => ({ ...p, address: t }))}
                placeholder="Enter full address"
                multiline
              />
              <InputField
                label="Landmark"
                value={newProperty.landmark}
                onChangeText={(t) => setNewProperty((p) => ({ ...p, landmark: t }))}
                placeholder="Enter nearby landmark"
              />
            </FormCard>
          </>
        ) : (
          <FormCard title="Property Identification">
            {property && (
              <>
                {[
                  ['Property ID', property.propertyId, 'ownerNameMatches'],
                  ['Owner Name', property.ownerName, 'ownerNameMatches'],
                  ['Address', property.address, 'addressMatches'],
                  ['Landmark', property.landmark, 'landmarkMatches'],
                ].map(([label, value, key], i) =>
                  i === 0 ? (
                    <View key={label} style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{label}</Text>
                      <Text style={[styles.infoValue, { color: colors.primaryDark, fontWeight: '700' }]}>{value}</Text>
                    </View>
                  ) : (
                    <View key={label} style={styles.verifyBlock}>
                      <Text style={styles.infoLabel}>{label}</Text>
                      <Text style={styles.verifyValue}>{value}</Text>
                      <Pressable
                        onPress={() => setVerifications((p) => ({ ...p, [key]: !p[key] }))}
                        style={[styles.checkRow, verifications[key] && styles.checkRowDone]}
                      >
                        <Ionicons
                          name={verifications[key] ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={verifications[key] ? colors.success : colors.textTertiary}
                        />
                        <Text style={[styles.checkLabel, verifications[key] && { color: colors.success }]}>
                          {label} matches on site
                        </Text>
                      </Pressable>
                    </View>
                  )
                )}

                <View style={styles.foundBlock}>
                  <Text style={styles.foundLabel}>Property Found on Site?</Text>
                  <View style={styles.foundRow}>
                    {[true, false].map((v) => (
                      <Pressable
                        key={String(v)}
                        onPress={() => setPropertyFound(v)}
                        style={[styles.foundBtn, propertyFound === v && styles.foundBtnActive]}
                      >
                        <Text style={[styles.foundBtnText, propertyFound === v && styles.foundBtnTextActive]}>
                          {v ? 'Yes' : 'No'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}
          </FormCard>
        )}

        <Button
          label="Proceed to Map Verification"
          onPress={handleContinue}
          icon="arrow-forward"
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

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary },
  infoValue: { ...typography.label, color: colors.textPrimary, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },

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

  verifyBlock: { marginBottom: spacing.md },
  verifyValue: { ...typography.bodyMedium, color: colors.textPrimary, marginVertical: spacing.xs },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  checkRowDone: { backgroundColor: colors.successTint, borderColor: colors.success },
  checkLabel: { ...typography.label, color: colors.textSecondary },

  foundBlock: { marginTop: spacing.md },
  foundLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },
  foundRow: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  foundBtn: { flex: 1, paddingVertical: 13, alignItems: 'center', backgroundColor: colors.surface },
  foundBtnActive: { backgroundColor: colors.primary },
  foundBtnText: { ...typography.label, color: colors.textSecondary, fontWeight: '700' },
  foundBtnTextActive: { color: colors.white },
});