import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { 
  Camera, 
  User, 
  Baby, 
  UserCheck, 
  Smile, 
  Meh, 
  Frown, 
  Heart,
  Brain,
  Eye,
  Zap,
  ArrowLeft,
  Play,
  Pause,
  RotateCw,
  Users,
  Target,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Upload,
  X,
  MapPin
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Mock AI Detection Data - Science Centre Singapore Visitors
const mockFaceDetections = [
  {
    id: 1,
    boundingBox: { x: 0.25, y: 0.15, width: 0.2, height: 0.35 },
    age: 'Child',
    ageConfidence: 0.92,
    emotion: 'Happy',
    emotionConfidence: 0.88,
    engagement: 'High',
    attentionLevel: 0.85,
    demographics: { estimatedAge: 8, gender: 'Unknown' },
    visitContext: 'Excited about hands-on STEM activities',
    recommendedArea: 'KidsSTOP'
  },
  {
    id: 2,
    boundingBox: { x: 0.55, y: 0.12, width: 0.22, height: 0.38 },
    age: 'Adult',
    ageConfidence: 0.96,
    emotion: 'Interested',
    emotionConfidence: 0.82,
    engagement: 'Medium',
    attentionLevel: 0.73,
    demographics: { estimatedAge: 35, gender: 'Unknown' },
    visitContext: 'Parent accompanying child, interested in science',
    recommendedArea: 'Future Tech Exhibition'
  },
  {
    id: 3,
    boundingBox: { x: 0.1, y: 0.45, width: 0.18, height: 0.32 },
    age: 'Child',
    ageConfidence: 0.89,
    emotion: 'Confused',
    emotionConfidence: 0.75,
    engagement: 'Low',
    attentionLevel: 0.45,
    demographics: { estimatedAge: 6, gender: 'Unknown' },
    visitContext: 'First-time visitor needing guidance',
    recommendedArea: 'Climate Changed Interactive Displays'
  },
  {
    id: 4,
    boundingBox: { x: 0.72, y: 0.28, width: 0.19, height: 0.33 },
    age: 'Adult',
    ageConfidence: 0.94,
    emotion: 'Focused',
    emotionConfidence: 0.91,
    engagement: 'High',
    attentionLevel: 0.89,
    demographics: { estimatedAge: 42, gender: 'Unknown' },
    visitContext: 'Science educator or researcher',
    recommendedArea: 'Advanced Research Displays'
  }
];

const emotionColors = {
  Happy: '#4CAF50',
  Interested: '#2196F3',
  Confused: '#FF9800',
  Bored: '#9E9E9E',
  Excited: '#FF5722',
  Neutral: '#607D8B',
  Surprised: '#E91E63',
  Focused: '#3F51B5'
};

const emotionIcons = {
  Happy: Smile,
  Interested: Eye,
  Confused: AlertCircle,
  Bored: Meh,
  Excited: Zap,
  Neutral: Meh,
  Surprised: Heart,
  Focused: Target
};

export default function AIVision() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState<any[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showCameraChoice, setShowCameraChoice] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'camera' | 'upload' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('kidsstop');
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);

  // Exhibition locations with their monitoring data
  const exhibitLocations = {
    kidsstop: {
      name: 'KidsSTOP',
      description: 'Interactive playground monitoring',
      currentVisitors: 28,
      avgEmotion: 'Happy',
      occupancy: 85,
      peakTime: '2:30 PM'
    },
    futuretech: {
      name: 'Future Tech',
      description: 'Technology exhibition monitoring', 
      currentVisitors: 15,
      avgEmotion: 'Curious',
      occupancy: 60,
      peakTime: '3:15 PM'
    },
    climatechanged: {
      name: 'Climate Changed',
      description: 'Climate science area monitoring',
      currentVisitors: 12,
      avgEmotion: 'Interested',
      occupancy: 45,
      peakTime: '1:45 PM'
    },
    earthalive: {
      name: 'Earth Alive',
      description: 'Live specimens area monitoring',
      currentVisitors: 22,
      avgEmotion: 'Excited',
      occupancy: 75,
      peakTime: '11:30 AM'
    },
    omnitheatre: {
      name: 'Omni-Theatre',
      description: 'Planetarium entrance monitoring',
      currentVisitors: 35,
      avgEmotion: 'Anticipation',
      occupancy: 90,
      peakTime: '4:00 PM'
    },
    entrance: {
      name: 'Main Entrance',
      description: 'Visitor entry monitoring',
      currentVisitors: 45,
      avgEmotion: 'Happy',
      occupancy: 95,
      peakTime: '10:00 AM'
    }
  };

  // Animation values
  const scanProgress = useSharedValue(0);
  const pulseValue = useSharedValue(1);
  const fadeValue = useSharedValue(0);

  useEffect(() => {
    // Start analysis animation
    pulseValue.value = withRepeat(withTiming(1.2, { duration: 1000 }), -1, true);
    
    // Only start simulation if mode is not camera or if camera mode and camera is ready
    if (selectedMode === 'upload' || (selectedMode === 'camera' && cameraReady)) {
    // Simulate AI analysis process
    setTimeout(() => {
      setDetectedFaces(mockFaceDetections);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      fadeValue.value = withTiming(1, { duration: 500 });
    }, 3000);
    }

    // Simulate real-time updates
    if (realTimeMode && selectedMode) {
      const interval = setInterval(() => {
        setDetectedFaces(prev => prev.map(face => ({
          ...face,
          attentionLevel: Math.max(0.3, Math.min(1, face.attentionLevel + (Math.random() - 0.5) * 0.2)),
          emotionConfidence: Math.max(0.6, Math.min(1, face.emotionConfidence + (Math.random() - 0.5) * 0.1))
        })));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [realTimeMode, selectedMode, cameraReady]);

  // generateInteractiveResponse function is removed

  const handleCameraChoice = async (mode: 'camera' | 'upload') => {
    if (mode === 'camera') {
      // Check camera permissions for live camera
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          // If permission denied, show permission denied modal
          setShowPermissionDenied(true);
          return;
        }
      }
    }
    
    setSelectedMode(mode);
    setShowCameraChoice(false);
    // Reset analysis state when changing mode
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setDetectedFaces([]);
    setCameraReady(false);
  };

  const restartAnalysis = () => {
    setShowCameraChoice(true);
    setSelectedMode(null);
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setDetectedFaces([]);
    // setCurrentResponse(null); // This state is removed
    setShowDetails(false);
  };

  const renderPermissionDeniedModal = () => (
    <Modal
      visible={showPermissionDenied}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Camera color="#FF6B35" size={32} />
            <Text style={styles.modalTitle}>Camera Access Required</Text>
            <Text style={styles.modalSubtitle}>Camera permission is needed for live facial recognition monitoring</Text>
          </View>

          <Text style={styles.permissionMessage}>
            To use live camera monitoring, please enable camera access in your device settings or choose the upload option instead.
          </Text>

          <View style={styles.permissionButtons}>
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={() => {
                setShowPermissionDenied(false);
                setShowCameraChoice(true);
              }}
            >
              <Text style={styles.permissionButtonText}>Choose Upload Instead</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.permissionButton, styles.permissionButtonPrimary]}
              onPress={async () => {
                setShowPermissionDenied(false);
                const { granted } = await requestPermission();
                if (granted) {
                  handleCameraChoice('camera');
                } else {
                  setShowCameraChoice(true);
                }
              }}
            >
              <Text style={[styles.permissionButtonText, styles.permissionButtonTextPrimary]}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderCameraChoiceModal = () => (
    <Modal
      visible={showCameraChoice}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Analysis Method</Text>
            <Text style={styles.modalSubtitle}>Select how you want to analyze visitor data</Text>
          </View>

          <View style={styles.choiceContainer}>
            <TouchableOpacity 
              style={styles.choiceButton}
              onPress={() => handleCameraChoice('camera')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00BCD4', '#0097A7']}
                style={styles.choiceGradient}
              >
                <Camera color="white" size={32} />
                <Text style={styles.choiceTitle}>Live Camera</Text>
                <Text style={styles.choiceDescription}>Real-time facial recognition and emotion analysis</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.choiceButton}
              onPress={() => handleCameraChoice('upload')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8C42']}
                style={styles.choiceGradient}
              >
                <Upload color="white" size={32} />
                <Text style={styles.choiceTitle}>Upload File</Text>
                <Text style={styles.choiceDescription}>Analyze pre-recorded images or videos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => router.back()}
          >
            <X color="#666" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  const renderFaceDetection = (face: any, index: number) => {
    const EmotionIcon = emotionIcons[face.emotion as keyof typeof emotionIcons] || Meh;
    const AgeIcon = face.age === 'Child' ? Baby : UserCheck;
    
    return (
      <Animated.View
        key={face.id}
        style={[
          styles.faceBox,
          {
            left: face.boundingBox.x * width,
            top: face.boundingBox.y * (height * 0.6),
            width: face.boundingBox.width * width,
            height: face.boundingBox.height * (height * 0.6),
            borderColor: emotionColors[face.emotion as keyof typeof emotionColors],
          },
          fadeStyle
        ]}
      >
        {/* Face ID */}
        <View style={styles.faceIdBadge}>
          <Text style={styles.faceIdText}>#{face.id}</Text>
        </View>

        {/* Age Badge */}
        <View style={[styles.ageBadge, { backgroundColor: face.age === 'Child' ? '#FF6B35' : '#2196F3' }]}>
          <AgeIcon color="white" size={12} />
          <Text style={styles.badgeText}>{face.age}</Text>
          <Text style={styles.confidenceText}>{(face.ageConfidence * 100).toFixed(0)}%</Text>
        </View>

        {/* Emotion Badge */}
        <View style={[styles.emotionBadge, { backgroundColor: emotionColors[face.emotion as keyof typeof emotionColors] }]}>
          <EmotionIcon color="white" size={12} />
          <Text style={styles.badgeText}>{face.emotion}</Text>
          <Text style={styles.confidenceText}>{(face.emotionConfidence * 100).toFixed(0)}%</Text>
        </View>

        {/* Attention Level Indicator */}
        <View style={styles.attentionIndicator}>
          <View style={styles.attentionBar}>
            <View 
              style={[
                styles.attentionFill, 
                { 
                  width: `${face.attentionLevel * 100}%`,
                  backgroundColor: face.attentionLevel > 0.7 ? '#4CAF50' : face.attentionLevel > 0.4 ? '#FF9800' : '#F44336'
                }
              ]} 
            />
          </View>
          <Text style={styles.attentionText}>
            {face.attentionLevel > 0.7 ? 'Engaged' : face.attentionLevel > 0.4 ? 'Moderate' : 'Low'}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderAnalysisResults = () => {
    const totalFaces = detectedFaces.length;
    const children = detectedFaces.filter(f => f.age === 'Child').length;
    const adults = detectedFaces.filter(f => f.age === 'Adult').length;
    const avgAttention = detectedFaces.reduce((sum, f) => sum + f.attentionLevel, 0) / totalFaces;
    const emotionDistribution = detectedFaces.reduce((acc, face) => {
      acc[face.emotion] = (acc[face.emotion] || 0) + 1;
      return acc;
    }, {} as any);

    return (
      <View style={styles.analysisResults}>
        <Text style={styles.resultsTitle}>AI Analysis Results</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users color="#FF6B35" size={24} />
            <Text style={styles.statNumber}>{totalFaces}</Text>
            <Text style={styles.statLabel}>Guests Detected</Text>
          </View>
          
          <View style={styles.statCard}>
            <Baby color="#4CAF50" size={24} />
            <Text style={styles.statNumber}>{children}</Text>
            <Text style={styles.statLabel}>Children</Text>
          </View>
          
          <View style={styles.statCard}>
            <UserCheck color="#2196F3" size={24} />
            <Text style={styles.statNumber}>{adults}</Text>
            <Text style={styles.statLabel}>Adults</Text>
          </View>
          
          <View style={styles.statCard}>
            <Activity color="#9C27B0" size={24} />
            <Text style={styles.statNumber}>{(avgAttention * 100).toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Avg Attention</Text>
          </View>
        </View>

        <View style={styles.scienceCentreInsights}>
          <Text style={styles.insightsTitle}>Science Centre Singapore Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Visitor Engagement:</Text>
            <Text style={styles.insightValue}>
              {avgAttention > 0.7 ? 'Highly Engaged with Exhibits' : 
               avgAttention > 0.4 ? 'Moderately Interested' : 'Need More Interactive Content'}
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Recommended Experience:</Text>
            <Text style={styles.insightValue}>
              {children > adults ? 'Family-Friendly Activities' : 
               adults > children ? 'Advanced Scientific Content' : 'Mixed-Age Programming'}
            </Text>
          </View>
        </View>

        <View style={styles.emotionDistribution}>
          <Text style={styles.distributionTitle}>Emotional Response to Exhibits</Text>
          {Object.entries(emotionDistribution).map(([emotion, count]) => {
            const EmotionIcon = emotionIcons[emotion as keyof typeof emotionIcons];
            const color = emotionColors[emotion as keyof typeof emotionColors];
            return (
              <View key={emotion} style={styles.emotionItem}>
                <EmotionIcon color={color} size={16} />
                <Text style={styles.emotionLabel}>{emotion}</Text>
                <View style={styles.emotionBar}>
                  <View 
                    style={[
                      styles.emotionBarFill, 
                      { 
                        width: `${((count as number) / totalFaces) * 100}%`,
                        backgroundColor: color 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.emotionCount}>{count as number}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#334155']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Vision Monitoring</Text>
          <Text style={styles.headerSubtitle}>Real-time facial recognition monitoring</Text>
          </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Camera View Simulation */}
        <View style={styles.cameraContainer}>
          {selectedMode === 'camera' ? (
            // Live Camera View
            <CameraView 
              style={styles.cameraView}
              facing="back"
              onCameraReady={() => {
                setCameraReady(true);
                // Start analysis after camera is ready
                if (!isAnalyzing && !analysisComplete) {
                  setTimeout(() => {
                    setDetectedFaces(mockFaceDetections);
                    setIsAnalyzing(false);
                    setAnalysisComplete(true);
                    fadeValue.value = withTiming(1, { duration: 500 });
                  }, 1500);
                }
              }}
            />
          ) : (
            // Static Image Simulation
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.cameraView}
          />
          )}
          
          {/* Scanning Overlay */}
          {isAnalyzing && (
            <View style={styles.scanningOverlay}>
              <Animated.View style={[styles.scanningIndicator, pulseStyle]}>
                <Brain color="#00BCD4" size={48} />
                <Text style={styles.scanningText}>
                  {selectedMode === 'camera' ? 'Analyzing Live Camera Feed...' : 'Analyzing Science Centre Visitors...'}
                </Text>
                <View style={styles.scanningProgress}>
                  <Text style={styles.progressText}>
                    {selectedMode === 'camera' 
                      ? 'Processing real-time facial recognition and emotion analysis'
                      : 'Processing age groups, emotions, and generating personalized exhibit recommendations'
                    }
                  </Text>
                </View>
              </Animated.View>
            </View>
          )}

          {/* Face Detection Overlays */}
          {!isAnalyzing && detectedFaces.map(renderFaceDetection)}

          {/* Real-time Indicators */}
          {realTimeMode && !isAnalyzing && selectedMode === 'camera' && (
            <View style={styles.realtimeIndicator}>
              <View style={styles.liveBadge}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveText}>LIVE CAMERA</Text>
              </View>
            </View>
          )}

          {/* Upload Mode Indicator */}
          {!isAnalyzing && selectedMode === 'upload' && (
            <View style={styles.uploadIndicator}>
              <View style={styles.uploadBadge}>
                <Upload color="white" size={12} />
                <Text style={styles.uploadText}>SIMULATION</Text>
              </View>
            </View>
          )}
        </View>

        {/* AI Analysis Results */}
        {analysisComplete && renderAnalysisResults()}

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => {
              setIsAnalyzing(true);
              setAnalysisComplete(false);
              setTimeout(() => {
                setIsAnalyzing(false);
                setAnalysisComplete(true);
                // generateInteractiveResponse(detectedFaces); // This function is removed
              }, 2000);
            }}
          >
            <RefreshCw color="#FF9800" size={20} />
            <Text style={styles.controlButtonText}>Re-analyze</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Eye color="#00BCD4" size={20} />
            <Text style={styles.controlButtonText}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => router.push('/visitor-analytics')}
          >
            <CheckCircle color="#4CAF50" size={20} />
            <Text style={styles.controlButtonText}>View Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Location Control */}
        <View style={styles.locationControl}>
          <View style={styles.currentLocationInfo}>
            <Text style={styles.currentLocationLabel}>Monitoring:</Text>
            <Text style={styles.currentLocationName}>
              {exhibitLocations[selectedLocation as keyof typeof exhibitLocations]?.name}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.changeLocationButton}
            onPress={() => {
              setShowLocationSelector(!showLocationSelector);
            }}
            activeOpacity={0.7}
          >
            <MapPin color="#00BCD4" size={16} />
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Location Selector Popup - positioned near change button */}
        {showLocationSelector && (
          <View style={styles.locationPopupOverlay}>
            <View style={styles.locationPopupCard}>
              <Text style={styles.locationSelectorTitle}>Select Location</Text>
              
              {Object.entries(exhibitLocations).map(([key, location]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.locationChoice,
                    selectedLocation === key && styles.locationChoiceSelected
                  ]}
                  onPress={() => {
                    setSelectedLocation(key);
                    setShowLocationSelector(false);
                    // Restart analysis
              setIsAnalyzing(true);
              setAnalysisComplete(false);
                    setDetectedFaces([]);
              setTimeout(() => {
                setIsAnalyzing(false);
                setAnalysisComplete(true);
                      setDetectedFaces(mockFaceDetections);
                      fadeValue.value = withTiming(1, { duration: 500 });
              }, 2000);
            }}
          >
                  <Text style={styles.locationChoiceText}>{location.name}</Text>
                  {selectedLocation === key && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
              ))}

          <TouchableOpacity 
                style={styles.closeSelectorButton}
                onPress={() => setShowLocationSelector(false)}
              >
                <Text style={styles.closeSelectorText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Additional Control Options */}
        <View style={styles.additionalControls}>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={restartAnalysis}
          >
            <Camera color="#666" size={16} />
            <Text style={styles.restartButtonText}>Change Input Method</Text>
          </TouchableOpacity>
        </View>

        {/* Detailed Analysis (Toggle) */}
        {showDetails && (
          <View style={styles.detailedAnalysis}>
            <Text style={styles.detailsTitle}>AI Summary Analysis</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>
                The AI analysis detected a diverse group of visitors at the Science Centre Singapore. 
                The current visitor demographics show a healthy mix of children and adults, indicating 
                family-oriented engagement. Most visitors display positive emotions ranging from happy 
                to curious, suggesting the exhibits are successfully capturing attention and interest.
              </Text>
              
              <Text style={styles.summaryText}>
                Engagement levels are generally high, with visitors showing focused attention to 
                interactive displays. The emotional responses indicate successful learning experiences, 
                with children particularly excited about hands-on activities while adults show 
                sustained interest in scientific content.
              </Text>
              
              <Text style={styles.summaryText}>
                Recommended optimizations include maintaining current interactive elements for 
                children while providing more advanced content pathways for adult learners to 
                sustain engagement throughout their visit.
              </Text>
                  </View>
          </View>
        )}
      </ScrollView>
      {renderCameraChoiceModal()}
      {renderPermissionDeniedModal()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  realtimeToggle: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  cameraContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cameraView: {
    width: '100%',
    height: height * 0.6,
    resizeMode: 'cover',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    alignItems: 'center',
  },
  scanningText: {
    color: '#00BCD4',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  scanningProgress: {
    marginTop: 12,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
  },
  faceIdBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  faceIdText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ageBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  emotionBadge: {
    position: 'absolute',
    bottom: -6,
    left: -6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  confidenceText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 8,
  },
  attentionIndicator: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    alignItems: 'center',
  },
  attentionBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  attentionFill: {
    height: '100%',
    borderRadius: 2,
  },
  attentionText: {
    color: 'white',
    fontSize: 8,
    marginTop: 2,
    textAlign: 'center',
  },
  realtimeIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analysisResults: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  resultsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  emotionDistribution: {
    marginTop: 12,
  },
  distributionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  emotionLabel: {
    color: 'white',
    fontSize: 14,
    width: 80,
  },
  emotionBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  emotionBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emotionCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  controlPanel: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailedAnalysis: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  detailsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  summaryText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  faceDetail: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  faceDetailTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scienceCentreInsights: {
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.3)',
  },
  insightsTitle: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    marginBottom: 2,
  },
  insightValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    width: '85%',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    gap: 12,
  },
  choiceButton: {
    flex: 1,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  choiceGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  choiceTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  choiceDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  additionalControls: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  locationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationPopupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 150,
    paddingHorizontal: 20,
  },
  locationSelectorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '85%',
    maxWidth: 350,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  locationPopupCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
  },
  locationSelectorTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  locationChoice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationChoiceSelected: {
    backgroundColor: 'rgba(0, 188, 212, 0.2)',
    borderColor: 'rgba(0, 188, 212, 0.5)',
  },
  locationChoiceText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  checkmark: {
    color: '#00BCD4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeSelectorButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  closeSelectorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  locationControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentLocationInfo: {
    flex: 1,
  },
  currentLocationLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginBottom: 2,
  },
  currentLocationName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  changeLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 212, 0.3)',
    gap: 6,
    minWidth: 80,
  },
  changeLocationText: {
    color: '#00BCD4',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  uploadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  uploadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  permissionMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 10,
  },
  permissionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  permissionButtonPrimary: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionButtonTextPrimary: {
    color: 'white',
  },
}); 