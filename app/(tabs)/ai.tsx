import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Mic, MicOff } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Sample AI responses based on computer vision analysis
const aiResponses = [
  "You look curious! Want to learn more about this exhibit?",
  "Hi there! Would you like a quick tour?",
  "You seem a bit confused. Tap here for a quick guide."
];

export default function AIAvatar() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Animation values
  const pulseValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  const innerPulse = useSharedValue(0.8);

  useEffect(() => {
    // Start continuous animations
    pulseValue.value = withRepeat(withTiming(1.1, { duration: 2000 }), -1, true);
    rotateValue.value = withRepeat(withTiming(360, { duration: 8000 }), -1, false);
    innerPulse.value = withRepeat(withTiming(1.2, { duration: 1500 }), -1, true);
  }, []);

  // Animation styles
  const outerCircleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulseValue.value },
      { rotate: `${rotateValue.value}deg` }
    ],
  }));

  const innerCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerPulse.value }],
  }));

  const recordingPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isRecording ? 1.3 : 1 }],
  }));

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert('Permission required', 'Audio recording permission is needed for voice interaction.');
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);

      // Auto-stop after 3 seconds
      setTimeout(async () => {
        await stopRecording();
      }, 3000);

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      setRecording(null);
      
      // Simulate processing for 1 second
      setTimeout(() => {
        setIsProcessing(false);
        generateAIResponse();
      }, 1000);
      
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsProcessing(false);
    }
  };

  const generateAIResponse = async () => {
    // Select random response
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    setIsSpeaking(true);
    
    try {
      await Speech.speak(randomResponse, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          setIsSpeaking(false);
        },
        onError: () => {
          setIsSpeaking(false);
        }
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing && !isSpeaking) {
      startRecording();
    }
  };

  return (
    <LinearGradient
      colors={['#FFF5F2', '#FFFFFF']}
      style={styles.container}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
      </View>

      {/* AI Avatar Circle */}
      <View style={styles.avatarContainer}>
        <Animated.View style={[styles.outerCircle, outerCircleStyle]}>
          <LinearGradient
            colors={['#FF6B35', '#FF8C42', '#FFB84D']}
            style={styles.circleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        
        <Animated.View style={[styles.innerCircle, innerCircleStyle]}>
          <LinearGradient
            colors={['#FF8C42', '#FFB84D']}
            style={styles.innerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <View style={styles.centerDot} />
      </View>

      {/* Microphone Button */}
      <View style={styles.micContainer}>
        <Animated.View style={[styles.micButton, recordingPulseStyle]}>
          <TouchableOpacity 
            style={styles.micTouchable}
            onPress={handleMicPress}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={isRecording 
                ? ['#FF4444', '#FF6666'] 
                : ['#FF6B35', '#FF8C42']
              }
              style={styles.micGradient}
            >
              {isRecording ? (
                <MicOff color="white" size={32} />
              ) : (
                <Mic color="white" size={32} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Header Styles
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  // AI Avatar Styles
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'absolute',
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'absolute',
  },
  innerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B35',
    position: 'absolute',
  },
  
  // Microphone Styles
  micContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  micButton: {
    borderRadius: 35,
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  micTouchable: {
    borderRadius: 35,
  },
  micGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 