import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import { Camera, Shield, CheckCircle, User, Settings, Smile } from 'lucide-react-native';
import { localFaceAnalysisService, FaceAnalysisResult } from '../services/localFaceAnalysisService';
import { runAllTests } from '../services/modelTestUtils';

const { width, height } = Dimensions.get('window');

export default function FaceVerification() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [detectedProfile, setDetectedProfile] = useState<FaceAnalysisResult | null>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);
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
    const isHealthy = await localFaceAnalysisService.checkHealth();
    setBackendStatus(isHealthy);
    
    if (!isHealthy) {
      console.warn('Local TensorFlow.js models not available. Loading models...');
    } else {
      console.log('✅ Local TensorFlow.js models loaded and ready!');
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
          
          // Always use local TensorFlow.js models
          console.log('🧠 Using local TensorFlow.js models for analysis');
          analysisResult = await localFaceAnalysisService.analyzeFaceFromBase64(photo.base64);
          
          setIsVerified(true);
          setIsVerifying(false);
          setDetectedProfile(analysisResult);
          
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
      
      Alert.alert('Verification Failed', 'Unable to analyze face with local models. Please try again.');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleTestModels = async () => {
    console.log('🧪 Starting model tests...');
    try {
      const testResults = await runAllTests();
      Alert.alert(
        'Model Test Results',
        `Overall: ${testResults.overall ? 'PASSED' : 'FAILED'}\n\n` +
        `TensorFlow.js: ${testResults.tests.tensorFlow.success ? '✅' : '❌'}\n` +
        `Model Loading: ${testResults.tests.modelLoading.success ? '✅' : '❌'}\n` +
        `Face Analysis: ${testResults.tests.faceAnalysis.success ? '✅' : '❌'}\n\n` +
        `Memory: ${testResults.memoryInfo || 'N/A'}`
      );
    } catch (error) {
      Alert.alert('Test Error', error instanceof Error ? error.message : 'Unknown error');
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
                {('age' in detectedProfile && detectedProfile.age !== undefined && detectedProfile.age !== null) && (
                  <Text style={styles.profileSubText}> ({detectedProfile.age} years)</Text>
                )}
              </View>
              {('gender' in detectedProfile && detectedProfile.gender) && (
                <View style={styles.profileRow}>
                  <User color="#4CAF50" size={18} />
                  <Text style={styles.profileText}>Gender: {detectedProfile.gender}</Text>
                  {('genderConfidence' in detectedProfile && detectedProfile.genderConfidence !== undefined && detectedProfile.genderConfidence !== null) && (
                    <Text style={styles.profileSubText}> ({detectedProfile.genderConfidence}%)</Text>
                  )}
                </View>
              )}
              <View style={styles.profileRow}>
                <Smile color="#4CAF50" size={18} />
                <Text style={styles.profileText}>Emotion: {detectedProfile.emotion}</Text>
                {('emotionConfidence' in detectedProfile && detectedProfile.emotionConfidence !== undefined && detectedProfile.emotionConfidence !== null) && (
                  <Text style={styles.profileSubText}> ({detectedProfile.emotionConfidence}%)</Text>
                )}
              </View>
              <View style={styles.profileRow}>
                <Shield color="#4CAF50" size={18} />
                <Text style={styles.profileText}>Overall Confidence: {detectedProfile.confidence}%</Text>
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
            <Text style={styles.startButtonText}>
              {isVerifying ? 'Verifying...' : 'Start Verification'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.testButton} onPress={handleTestModels}>
            <Text style={styles.testButtonText}>Test Models</Text>
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
                ? 'Local TensorFlow.js Models Ready' 
                : 'Loading Local AI Models...'}
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
  },
  startButtonText: {
    color: '#FF6B35',
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