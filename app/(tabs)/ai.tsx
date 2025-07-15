import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function AIAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Simple pulse animation only
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    // Gentle pulse animation
    pulseValue.value = withRepeat(withTiming(1.05, { duration: 2000 }), -1, true);
  }, []);

  const handleMicPress = () => {
    if (isProcessing) return;
    
    if (!isListening) {
      // Start listening
      setIsListening(true);
      Alert.alert('AI Assistant', 'Listening... Speak now!');
      
      // Simulate listening for 3 seconds
      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(true);
        
        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false);
          Alert.alert('AI Assistant', 'I heard you! How can I help you explore the Science Centre?');
        }, 2000);
      }, 3000);
    } else {
      // Stop listening
      setIsListening(false);
      Alert.alert('AI Assistant', 'Stopped listening.');
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B35', '#FF8C42', '#FFA726']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>Your Science Centre Guide</Text>
        </View>

        <View style={styles.centerContainer}>
          {/* Simple Microphone Button */}
          <Animated.View style={[styles.micContainer, animatedStyle]}>
            <TouchableOpacity 
              style={[styles.micButton, isListening && styles.micButtonActive]}
              onPress={handleMicPress}
              activeOpacity={0.8}
            >
              {isListening ? (
                <MicOff color="#FFFFFF" size={50} />
              ) : (
                <Mic color={isListening ? "#FFFFFF" : "#FF6B35"} size={50} />
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Status Text */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isProcessing ? 'Processing your request...' : 
               isListening ? 'Listening... Speak now!' : 'Tap the microphone to start'}
            </Text>
            <Text style={styles.statusSubtext}>
              {isProcessing ? 'Please wait while I analyze your question' :
               isListening ? 'I can hear you, please continue speaking' : 'Ask me anything about the Science Centre'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  micContainer: {
    marginBottom: 40,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  micButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
  },
  statusSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 