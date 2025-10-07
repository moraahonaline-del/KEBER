
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Button } from '@/components/button';
import { IconSymbol } from '@/components/IconSymbol';
import BackendNotice from '@/components/BackendNotice';

interface ScanResult {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  confidence: number;
  photo: string;
  status: 'missing' | 'found';
}

// Mock data for demonstration - in a real app, this would come from Supabase
const mockMissingChildren: ScanResult[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 8,
    lastSeen: '2024-01-15',
    location: 'Nairobi Central',
    confidence: 0.92,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    status: 'missing',
  },
  {
    id: '2',
    name: 'Michael Ochieng',
    age: 12,
    lastSeen: '2024-01-10',
    location: 'Mombasa',
    confidence: 0.87,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    status: 'missing',
  },
];

export default function ScanScreen() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    console.log('ScanScreen mounted');
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to scan photos of children. Please enable camera permissions in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error requesting camera permission:', error);
      Alert.alert('Error', 'Failed to request camera permission');
      return false;
    }
  };

  const takePhoto = async () => {
    console.log('Taking photo...');
    
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
        console.log('Image captured:', imageUri);
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const selectFromGallery = async () => {
    console.log('Selecting from gallery...');
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
        console.log('Image selected:', imageUri);
      }
    } catch (error) {
      console.log('Error selecting from gallery:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const scanImage = async () => {
    if (!capturedImage) {
      Alert.alert('No Image', 'Please take a photo or select an image first.');
      return;
    }

    console.log('Starting scan...');
    setIsScanning(true);
    setScanResults([]);
    setHasScanned(false);

    try {
      // Simulate scanning process with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock scanning results - in a real app, this would call Supabase/AI service
      const mockResults = mockMissingChildren.filter(() => Math.random() > 0.5);
      
      console.log('Scan completed, results:', mockResults);
      setScanResults(mockResults);
      setHasScanned(true);
    } catch (error) {
      console.log('Error during scan:', error);
      Alert.alert('Scan Error', 'Failed to scan the image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const retakePhoto = () => {
    console.log('Retaking photo...');
    setCapturedImage(null);
    setScanResults([]);
    setHasScanned(false);
  };

  const reportMatch = (result: ScanResult) => {
    console.log('Reporting match for:', result.name);
    Alert.alert(
      'Report Match',
      `Are you sure you want to report a potential match for ${result.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          onPress: () => {
            Alert.alert(
              'Match Reported',
              'Thank you for reporting this potential match. Authorities have been notified and will investigate.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      style={styles.headerButton}
      onPress={() => {
        Alert.alert(
          'How Scanning Works',
          'Take a photo of a child you believe might be missing. The app will compare the photo against our database of missing children reports. If there are potential matches, you can report them to authorities.\n\nNote: This feature requires an active internet connection and backend services to function properly.',
          [{ text: 'Got it' }]
        );
      }}
    >
      <IconSymbol name="questionmark.circle" size={24} color={colors.primary} />
    </Pressable>
  );

  const renderScanResults = () => {
    if (!hasScanned) return null;

    if (scanResults.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <IconSymbol name="checkmark.circle.fill" size={48} color={colors.secondary} />
          <Text style={styles.noResultsTitle}>No Matches Found</Text>
          <Text style={styles.noResultsText}>
            The scanned image did not match any missing children in our database. This is good news!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Potential Matches Found</Text>
        <Text style={styles.resultsSubtitle}>
          {scanResults.length} potential match{scanResults.length > 1 ? 'es' : ''} found
        </Text>
        
        {scanResults.map((result) => (
          <View key={result.id} style={styles.resultCard}>
            <Image source={{ uri: result.photo }} style={styles.resultPhoto} />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{result.name}</Text>
              <Text style={styles.resultDetails}>Age: {result.age}</Text>
              <Text style={styles.resultDetails}>Last seen: {result.lastSeen}</Text>
              <Text style={styles.resultDetails}>Location: {result.location}</Text>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(result.confidence * 100)}%
                </Text>
              </View>
            </View>
            <Button
              variant="secondary"
              size="small"
              onPress={() => reportMatch(result)}
              style={styles.reportButton}
            >
              Report Match
            </Button>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Scan Photo',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: renderHeaderRight,
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={commonStyles.title}>Photo Scanner</Text>
          <Text style={commonStyles.textSecondary}>
            Take or select a photo to scan against missing children records
          </Text>
        </View>

        <BackendNotice
          feature="photo scanning"
          description="Full scanning functionality requires Supabase integration for image storage and comparison services."
        />

        {!capturedImage ? (
          <View style={styles.cameraSection}>
            <View style={styles.cameraPlaceholder}>
              <IconSymbol name="camera.fill" size={64} color={colors.textSecondary} />
              <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
            
            <View style={styles.buttonGroup}>
              <Button
                variant="primary"
                onPress={takePhoto}
                style={styles.actionButton}
              >
                <IconSymbol name="camera" size={20} color={colors.card} style={styles.buttonIcon} />
                Take Photo
              </Button>
              
              <Button
                variant="secondary"
                onPress={selectFromGallery}
                style={styles.actionButton}
              >
                <IconSymbol name="photo" size={20} color={colors.card} style={styles.buttonIcon} />
                Select from Gallery
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            </View>
            
            <View style={styles.buttonGroup}>
              {!isScanning && !hasScanned && (
                <Button
                  variant="primary"
                  onPress={scanImage}
                  style={styles.actionButton}
                >
                  <IconSymbol name="magnifyingglass" size={20} color={colors.card} style={styles.buttonIcon} />
                  Scan Image
                </Button>
              )}
              
              <Button
                variant="secondary"
                onPress={retakePhoto}
                style={styles.actionButton}
                disabled={isScanning}
              >
                <IconSymbol name="arrow.clockwise" size={20} color={colors.card} style={styles.buttonIcon} />
                {hasScanned ? 'Scan Another' : 'Retake Photo'}
              </Button>
            </View>
          </View>
        )}

        {isScanning && (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.scanningText}>Scanning image...</Text>
            <Text style={styles.scanningSubtext}>
              Comparing against missing children database
            </Text>
          </View>
        )}

        {renderScanResults()}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • This scanner compares photos against reported missing children
          </Text>
          <Text style={styles.infoText}>
            • Results are estimates and should be verified by authorities
          </Text>
          <Text style={styles.infoText}>
            • Report any potential matches immediately
          </Text>
          <Text style={styles.infoText}>
            • Contact emergency services if you believe a child is in immediate danger
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for floating tab bar
  },
  section: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  cameraSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cameraPlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  capturedImage: {
    width: 280,
    height: 280,
    borderRadius: 16,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  scanningContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  scanningText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scanningSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  noResultsTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  noResultsText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  resultsContainer: {
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  resultPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    alignSelf: 'center',
  },
  resultInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  resultDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  confidenceContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reportButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});
