import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import { Camera, Shield, CheckCircle, User, Settings, Smile, Upload } from 'lucide-react-native';
import { faceAnalysisService, FaceAnalysisResult } from '../services/faceAnalysisService';
import { useFaceVerification } from './contexts/FaceVerificationContext';

const { width, height } = Dimensions.get('window');

export default function FaceVerification() {
  const router = useRouter();
  const { setVerificationResult } = useFaceVerification();
  const [permission, requestPermission] = useCameraPermissions();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [detectedProfile, setDetectedProfile] = useState<FaceAnalysisResult | null>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);
  const [selectedMode, setSelectedMode] = useState<'camera' | 'upload' | null>(null);
  const cameraRef = useRef<CameraView>(null);
  
  const fadeValue = useSharedValue(0);
  const pulseValue = useSharedValue(1);
  const scanLineValue = useSharedValue(-1);

  useEffect(() => {
    fadeValue.value = withTiming(1, { duration: 800 });
    
    // Check backend status on mount
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
          const isHealthy = await faceAnalysisService.checkHealth();
    setBackendStatus(isHealthy);
    
          if (!isHealthy) {
        console.warn('Flask backend not available. Please check connection.');
      } else {
        console.log('✅ Flask backend models loaded and ready!');
      }
  };

  useEffect(() => {
    if (isVerifying) {
      pulseValue.value = withRepeat(withTiming(1.05, { duration: 1000 }), -1, true);
      scanLineValue.value = withRepeat(withTiming(1, { duration: 2000 }), -1, false);
    }
  }, [isVerifying]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ 
      translateY: interpolate(scanLineValue.value, [-1, 1], [-80, 80]) 
    }],
    opacity: interpolate(scanLineValue.value, [-1, 0, 1], [0, 1, 0]),
  }));

  const handleStartVerification = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed for face verification.');
        return;
      }
    }

    setIsVerifying(true);
    
    try {
      if (cameraRef.current) {
        // Take a picture for analysis
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.8,
        });
        
        if (photo.base64) {
          let analysisResult: FaceAnalysisResult;
          
          // Use Flask backend for analysis
          console.log('🧠 Using Flask backend for analysis');
          analysisResult = await faceAnalysisService.analyzeFaceFromBase64(photo.base64);
          
          // Check if analysis failed (e.g., no face detected)
          if (!analysisResult.success && analysisResult.message) {
            setIsVerifying(false);
            Alert.alert('Face Detection Failed', analysisResult.message);
            return;
          }
          
          setIsVerified(true);
          setIsVerifying(false);
          setDetectedProfile(analysisResult);
          
          // Save to context for sharing across tabs
          setVerificationResult({
            success: analysisResult.success,
            age: analysisResult.age || 25,
            ageGroup: analysisResult.ageGroup || 'Adult',
            gender: analysisResult.gender || 'Unknown',
            genderConfidence: analysisResult.genderConfidence || 0,
            emotion: analysisResult.emotion || 'Neutral',
            emotionConfidence: analysisResult.emotionConfidence || 0,
            allEmotions: analysisResult.allEmotions || {},
            confidence: analysisResult.confidence || 0,
            timestamp: analysisResult.timestamp || new Date().toISOString(),
            message: analysisResult.message
          });
          
          // Auto-proceed after showing results
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 2500);
        } else {
          throw new Error('Failed to capture image');
        }
      } else {
        throw new Error('Camera not available');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setIsVerifying(false);
      
      // Show fallback result
      setDetectedProfile({
        success: false,
        ageGroup: 'Unknown',
        emotion: 'Unknown',
        emotionConfidence: 0,
        confidence: 0,
        timestamp: new Date().toISOString(),
        message: 'Local analysis failed'
      });
      
              Alert.alert('Verification Failed', 'Unable to analyze face with Flask backend. Please check your connection and try again.');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleUploadPhoto = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Denied', 'You need to grant camera roll permissions to upload photos.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          setIsVerifying(true);
          
          console.log('🖼️ Processing uploaded image with Flask backend');
          const analysisResult = await faceAnalysisService.analyzeFaceFromBase64(asset.base64);
          
          // Check if analysis failed (e.g., no face detected)
          if (!analysisResult.success && analysisResult.message) {
            setIsVerifying(false);
            Alert.alert('Face Detection Failed', analysisResult.message);
            return;
          }
          
          setIsVerified(true);
          setIsVerifying(false);
          setDetectedProfile(analysisResult);
          
          // Save to context for sharing across tabs
          setVerificationResult({
            success: analysisResult.success,
            age: analysisResult.age || 25,
            ageGroup: analysisResult.ageGroup || 'Adult',
            gender: analysisResult.gender || 'Unknown',
            genderConfidence: analysisResult.genderConfidence || 0,
            emotion: analysisResult.emotion || 'Neutral',
            emotionConfidence: analysisResult.emotionConfidence || 0,
            allEmotions: analysisResult.allEmotions || {},
            confidence: analysisResult.confidence || 0,
            timestamp: analysisResult.timestamp || new Date().toISOString(),
            message: analysisResult.message
          });
          
          // Auto-proceed after showing results
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 2500);
        } else {
          throw new Error('Failed to get image data');
        }
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
      setIsVerifying(false);
      
      Alert.alert(
        'Upload Error',
        error instanceof Error ? error.message : 'Failed to process uploaded photo'
      );
    }
  };



  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera color="white" size={60} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to provide personalized recommendations based on your age group.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (isVerified && detectedProfile) {
    return (
      <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.container}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <View style={styles.successContainer}>
            <CheckCircle color="white" size={60} />
            <Text style={styles.successTitle}>Verification Complete!</Text>
            <Text style={styles.successSubtitle}>Welcome to Singapore Science Centre</Text>
            
            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>Detected Profile</Text>
              <View style={styles.profileRow}>
                <User color="#4CAF50" size={18} />
                <Text style={styles.profileText}>Age Group: {detectedProfile.ageGroup}</Text>
              </View>

              <View style={styles.profileRow}>
                <Smile color="#4CAF50" size={18} />
                <Text style={styles.profileText}>Emotion: {detectedProfile.emotion}</Text>
              </View>
              <View style={styles.profileRow}>
                <Shield color="#4CAF50" size={18} />
                <Text style={styles.profileText}>Analysis Complete</Text>
              </View>
              {detectedProfile.message && (
                <Text style={styles.profileMessage}>{detectedProfile.message}</Text>
              )}
            </View>
            
            <Text style={styles.redirectText}>Redirecting to main app...</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Face Verification</Text>
          <Text style={styles.subtitle}>Get personalized recommendations</Text>
        </View>

        <View style={styles.cameraContainer}>
          <View style={styles.cameraFrame}>
            {isVerifying ? (
              <Animated.View style={[styles.scanningOverlay, pulseStyle]}>
                <View style={styles.scanningBorder} />
                <Animated.View style={[styles.scanLine, scanLineStyle]} />
                <Text style={styles.scanningText}>Analyzing...</Text>
              </Animated.View>
            ) : null}
            
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              onCameraReady={() => console.log('Camera ready')}
            />
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartVerification}
            disabled={isVerifying}
          >
            <Camera color="white" size={20} />
            <Text style={styles.startButtonText}>
              {isVerifying ? 'Verifying...' : 'Take Photo'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUploadPhoto}
            disabled={isVerifying}
          >
            <Upload color="white" size={20} />
            <Text style={styles.uploadButtonText}>Upload Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Benefits:</Text>
          <View style={styles.infoRow}>
            <User color="white" size={16} />
            <Text style={styles.infoText}>Age-appropriate content</Text>
          </View>
          <View style={styles.infoRow}>
            <Smile color="white" size={16} />
            <Text style={styles.infoText}>Enhanced experience</Text>
          </View>
          <View style={styles.infoRow}>
            <Shield color={backendStatus ? '#4CAF50' : '#FFC107'} size={16} />
            <Text style={styles.infoText}>
              {backendStatus 
                ? 'Flask AI Models Ready' 
                : 'Loading AI Models...'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 30,
  },
  permissionButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFrame: {
    width: 250,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  scanningBorder: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 15,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 1,
  },
  scanningText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  controls: {
    alignItems: 'center',
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    width: '90%',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  redirectText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 20,
  },
  profileMessage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  profileSubText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});