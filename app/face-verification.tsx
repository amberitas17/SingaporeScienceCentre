import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Camera, User, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Smile, Meh, Frown, Baby, UserCheck } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Mock AI detection results
const mockDetectionResults = [
  {
    id: 1,
    age: 'Adult',
    emotion: 'Happy',
    confidence: 0.95,
    boundingBox: { x: 0.3, y: 0.2, width: 0.4, height: 0.5 }
  },
  {
    id: 2,
    age: 'Child',
    emotion: 'Excited',
    confidence: 0.88,
    boundingBox: { x: 0.1, y: 0.3, width: 0.3, height: 0.4 }
  }
];

const emotionIcons = {
  Happy: Smile,
  Excited: Smile,
  Confused: Meh,
  Bored: Frown,
  Neutral: Meh,
};

const emotionColors = {
  Happy: '#4CAF50',
  Excited: '#FF9800',
  Confused: '#2196F3',
  Bored: '#9E9E9E',
  Neutral: '#607D8B',
};

export default function FaceVerification() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<any[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [guestProfile, setGuestProfile] = useState<any>(null);
  
  const scanProgress = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    pulseScale.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    setDetectedFaces([]);
    setScanComplete(false);
    
    // Animate scan progress
    scanProgress.value = withTiming(1, { duration: 3000 });
    overlayOpacity.value = withTiming(0.3, { duration: 500 });
    
    // Simulate AI detection after 3 seconds
    setTimeout(() => {
      setDetectedFaces(mockDetectionResults);
      setScanComplete(true);
      setIsScanning(false);
      
      // Create guest profile
      const profile = {
        totalGuests: mockDetectionResults.length,
        adults: mockDetectionResults.filter(f => f.age === 'Adult').length,
        children: mockDetectionResults.filter(f => f.age === 'Child').length,
        dominantEmotion: 'Happy',
        recommendations: generateRecommendations(mockDetectionResults)
      };
      setGuestProfile(profile);
      
      overlayOpacity.value = withTiming(0, { duration: 500 });
    }, 3000);
  };

  const generateRecommendations = (faces: any[]) => {
    const hasChildren = faces.some(f => f.age === 'Child');
    const hasHappyGuests = faces.some(f => f.emotion === 'Happy' || f.emotion === 'Excited');
    
    if (hasChildren && hasHappyGuests) {
      return "Perfect for family experiences! KidsSTOP™ and interactive exhibitions recommended.";
    } else if (hasChildren) {
      return "Family-friendly activities available! Consider our educational workshops.";
    } else if (hasHappyGuests) {
      return "Great energy! Explore our exciting exhibitions and science shows.";
    }
    return "Welcome! Discover amazing science experiences tailored for you.";
  };

  const proceedToTickets = () => {
    // Navigate to AI Vision for detailed analysis
    router.push('/ai-vision');
  };

  const scanProgressStyle = useAnimatedStyle(() => ({
    width: `${scanProgress.value * 100}%`,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera color="white" size={64} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access for facial recognition and age verification
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front">
        {/* Header */}
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Basic Face Verification</Text>
          <Text style={styles.headerSubtitle}>Initial detection for advanced AI Vision analysis</Text>
        </LinearGradient>

        {/* Scanning Overlay */}
        {isScanning && (
          <Animated.View style={[styles.scanOverlay, overlayStyle]}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Analyzing faces...</Text>
          </Animated.View>
        )}

        {/* Face Detection Boxes */}
        {detectedFaces.map((face) => {
          const EmotionIcon = emotionIcons[face.emotion as keyof typeof emotionIcons] || Meh;
          const AgeIcon = face.age === 'Child' ? Baby : UserCheck;
          
          return (
            <View
              key={face.id}
              style={[
                styles.faceBox,
                {
                  left: face.boundingBox.x * width,
                  top: face.boundingBox.y * height,
                  width: face.boundingBox.width * width,
                  height: face.boundingBox.height * height,
                }
              ]}
            >
              <View style={styles.faceInfo}>
                <View style={styles.ageTag}>
                  <AgeIcon color="white" size={12} />
                  <Text style={styles.tagText}>{face.age}</Text>
                </View>
                <View style={[styles.emotionTag, { backgroundColor: emotionColors[face.emotion as keyof typeof emotionColors] }]}>
                  <EmotionIcon color="white" size={12} />
                  <Text style={styles.tagText}>{face.emotion}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Bottom Controls */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.bottomContainer}
        >
          {!scanComplete ? (
            <View style={styles.scanSection}>
              {isScanning ? (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View style={[styles.progressFill, scanProgressStyle]} />
                  </View>
                  <Text style={styles.progressText}>Detecting faces and emotions...</Text>
                </View>
              ) : (
                <Animated.View style={[styles.scanButtonContainer, pulseStyle]}>
                  <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
                    <Camera color="white" size={32} />
                    <Text style={styles.scanButtonText}>Start Face Scan</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          ) : (
            <View style={styles.resultsSection}>
              <View style={styles.resultsHeader}>
                <CheckCircle color="#4CAF50" size={32} />
                <Text style={styles.resultsTitle}>Detection Complete!</Text>
              </View>
              
              {guestProfile && (
                <View style={styles.profileSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Guests Detected:</Text>
                    <Text style={styles.summaryValue}>
                      {guestProfile.totalGuests} ({guestProfile.adults} Adults, {guestProfile.children} Children)
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Mood:</Text>
                    <Text style={styles.summaryValue}>{guestProfile.dominantEmotion}</Text>
                  </View>
                  <Text style={styles.recommendation}>{guestProfile.recommendations}</Text>
                </View>
              )}
              
              <TouchableOpacity style={styles.proceedButton} onPress={proceedToTickets}>
                <UserCheck color="white" size={20} />
                <Text style={styles.proceedButtonText}>Proceed to AI Vision Analysis</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,107,53,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  faceInfo: {
    position: 'absolute',
    top: -40,
    left: 0,
    flexDirection: 'row',
    gap: 5,
  },
  ageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  emotionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 40,
  },
  scanSection: {
    alignItems: 'center',
  },
  scanButtonContainer: {
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  resultsSection: {
    alignItems: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  resultsTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSummary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  summaryValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendation: {
    color: '#4CAF50',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});