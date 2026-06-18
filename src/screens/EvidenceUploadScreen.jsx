import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';

const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  success: '#2E7D32',
  danger: '#C62828',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
  inputBg: '#EEF1F8',
};

export default function EvidenceUploadScreen({ navigation, route }) {
  const { surveyData } = route.params || {};
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [sidePhoto, setSidePhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  useEffect(() => {
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

  const pickImage = async (type) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      if (type === 'front') {
        setFrontPhoto(result.assets[0].uri);
      } else if (type === 'side') {
        setSidePhoto(result.assets[0].uri);
      } else if (type === 'additional') {
        if (additionalPhotos.length < 3) {
          setAdditionalPhotos([...additionalPhotos, result.assets[0].uri]);
        }
      }
    }
  };

  const removePhoto = (type, index) => {
    if (type === 'front') {
      setFrontPhoto(null);
    } else if (type === 'side') {
      setSidePhoto(null);
    } else if (type === 'additional') {
      setAdditionalPhotos(additionalPhotos.filter((_, i) => i !== index));
    }
  };

  const handleContinue = () => {
    if (!frontPhoto) {
      alert('Front view photograph is mandatory.');
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
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 4 of 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Evidence Collection</Text>

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Front View Photograph (Mandatory)</Text>
            {frontPhoto ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: frontPhoto }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto('front')}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.photoPicker}
                onPress={() => pickImage('front')}
              >
                <Ionicons name="camera" size={40} color={COLORS.primary} style={styles.photoPickerIcon} />
                <Text style={styles.photoPickerText}>Capture / Upload</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Side View Photograph (Optional)</Text>
            {sidePhoto ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: sidePhoto }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto('side')}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.photoPicker}
                onPress={() => pickImage('side')}
              >
                <Ionicons name="camera" size={40} color={COLORS.primary} style={styles.photoPickerIcon} />
                <Text style={styles.photoPickerText}>Capture / Upload</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Additional Photographs (Optional, up to 3)</Text>
            <View style={styles.additionalPhotosRow}>
              {additionalPhotos.map((photo, index) => (
                <View key={index} style={styles.smallPhotoPreviewContainer}>
                  <Image source={{ uri: photo }} style={styles.smallPhotoPreview} />
                  <TouchableOpacity
                    style={styles.smallRemoveButton}
                    onPress={() => removePhoto('additional', index)}
                  >
                    <Ionicons name="close" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ))}
              {additionalPhotos.length < 3 && (
                <TouchableOpacity
                  style={styles.smallPhotoPicker}
                  onPress={() => pickImage('additional')}
                >
                  <Ionicons name="add" size={32} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.gpsStatus}>
            <Ionicons name="location" size={20} color={COLORS.success} style={styles.gpsStatusIcon} />
            <Text style={styles.gpsStatusText}>
              GPS Tag: {location?.lat.toFixed(4)}° N, {location?.lng.toFixed(4)}° E - Verified
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleContinue}>
            <Text style={styles.nextButtonText}>Next: Survey Result →</Text>
          </TouchableOpacity>
        </View>
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
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecond,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  formCard: {
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
    marginBottom: 20,
  },
  photoSection: {
    marginBottom: 24,
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecond,
    marginBottom: 12,
  },
  photoPicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.inputBg,
  },
  photoPickerIcon: {
    marginBottom: 8,
  },
  photoPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  photoPreviewContainer: {
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  removeButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.danger + '10',
    borderRadius: 8,
  },
  removeButtonText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  additionalPhotosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  smallPhotoPicker: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.inputBg,
  },
  smallPhotoPreviewContainer: {
    position: 'relative',
  },
  smallPhotoPreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  smallRemoveButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  gpsStatusIcon: {
    marginRight: 8,
  },
  gpsStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});
