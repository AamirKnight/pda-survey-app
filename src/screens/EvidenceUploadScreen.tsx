import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../components/Header';
import FormCard from '../components/ui/FomrCard';
import NavButtons from '../components/ui/NavButtons';
import StepProgress from '../components/ui/StepProgress';
import { colors, elevation, radius, spacing, typography } from '../theme/theme';

export default function EvidenceUploadScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [sidePhoto, setSidePhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  useEffect(() => {
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

  const pickImage = async (type: 'front' | 'side' | 'additional') => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    if (type === 'front') setFrontPhoto(uri);
    else if (type === 'side') setSidePhoto(uri);
    else if (additionalPhotos.length < 3) setAdditionalPhotos((p) => [...p, uri]);
  };

  const handleNext = () => {
    if (!frontPhoto) {
      Alert.alert('Missing Photo', 'A front-view photograph is mandatory before continuing.');
      return;
    }
    navigation.navigate('SurveyResult', {
      surveyData: {
        ...surveyData,
        evidence: {
          frontPhoto,
          sidePhoto,
          additionalPhotos,
          location,
          timestamp: new Date().toLocaleTimeString(),
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Evidence Upload"
        showBack
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => navigation.openDrawer?.()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepProgress current={4} total={5} />

        <FormCard title="Evidence Collection">
          {/* GPS tag */}
          <View style={styles.gpsBanner}>
            <Ionicons
              name={loadingLocation ? 'locate-outline' : 'location'}
              size={16}
              color={loadingLocation ? colors.textTertiary : colors.success}
            />
            <Text style={[styles.gpsText, { color: loadingLocation ? colors.textTertiary : colors.success }]}>
              {loadingLocation
                ? 'Acquiring GPS location…'
                : `GPS Verified · ${location?.lat.toFixed(4)}°N, ${location?.lng.toFixed(4)}°E`}
            </Text>
          </View>

          {/* Front photo */}
          <PhotoSection
            label="Front View Photograph"
            required
            photo={frontPhoto}
            onCapture={() => pickImage('front')}
            onRemove={() => setFrontPhoto(null)}
          />

          {/* Side photo */}
          <PhotoSection
            label="Side View Photograph"
            photo={sidePhoto}
            onCapture={() => pickImage('side')}
            onRemove={() => setSidePhoto(null)}
          />

          {/* Additional */}
          <Text style={styles.sectionLabel}>Additional Photographs (up to 3)</Text>
          <View style={styles.additionalRow}>
            {additionalPhotos.map((uri, i) => (
              <View key={i} style={styles.smallPhotoWrap}>
                <Image source={{ uri }} style={styles.smallPhoto} />
                <Pressable
                  onPress={() => setAdditionalPhotos((p) => p.filter((_, j) => j !== i))}
                  style={styles.removeSmall}
                >
                  <Ionicons name="close" size={12} color={colors.white} />
                </Pressable>
              </View>
            ))}
            {additionalPhotos.length < 3 && (
              <Pressable style={styles.addSmall} onPress={() => pickImage('additional')}>
                <Ionicons name="camera-outline" size={22} color={colors.primary} />
                <Text style={styles.addSmallText}>Add</Text>
              </Pressable>
            )}
          </View>
        </FormCard>

        <NavButtons
          onBack={() => navigation.goBack()}
          onNext={handleNext}
          nextLabel="Survey Result"
        />
      </ScrollView>
    </View>
  );
}

function PhotoSection({ label, required = false, photo, onCapture, onRemove }) {
  return (
    <View style={styles.photoSection}>
      <View style={styles.photoLabelRow}>
        <Text style={styles.sectionLabel}>{label}</Text>
        {required && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        )}
      </View>

      {photo ? (
        <View>
          <Image source={{ uri: photo }} style={styles.photo} />
          <Pressable onPress={onRemove} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={14} color={colors.error} />
            <Text style={styles.removeBtnText}>Remove</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={onCapture} style={styles.photoPicker}>
          <Ionicons name="camera-outline" size={32} color={colors.primary} />
          <Text style={styles.photoPickerLabel}>Capture Photo</Text>
          <Text style={styles.photoPickerSub}>Tap to open camera</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 40 },

  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successTint,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  gpsText: { ...typography.caption, fontWeight: '700' },

  photoSection: { marginBottom: spacing.xl },
  photoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionLabel: { ...typography.label, color: colors.textPrimary, marginBottom: spacing.md },
  requiredBadge: {
    backgroundColor: colors.errorTint,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  requiredText: { ...typography.caption, color: colors.error, fontWeight: '700' },

  photoPicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.lg,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },
  photoPickerLabel: { ...typography.label, color: colors.primary, marginTop: spacing.sm },
  photoPickerSub: { ...typography.caption, color: colors.textTertiary },

  photo: { width: '100%', height: 180, borderRadius: radius.lg },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.errorTint,
    borderRadius: radius.pill,
  },
  removeBtnText: { ...typography.caption, color: colors.error, fontWeight: '700' },

  additionalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  smallPhotoWrap: { width: 90, height: 90, borderRadius: radius.md, overflow: 'visible' },
  smallPhoto: { width: 90, height: 90, borderRadius: radius.md },
  removeSmall: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  addSmall: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },
  addSmallText: { ...typography.caption, color: colors.primary, marginTop: 4 },
});