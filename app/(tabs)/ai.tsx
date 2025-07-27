
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, Play, Pause, MessageCircle, Camera, Volume2, Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import { faceAnalysisService } from '../../services/faceAnalysisService';

const { width, height } = Dimensions.get('window');

// Predefined questions for different visitor types
const predefinedQuestions = {
  general: [
    "What are the opening hours?",
    "Where is the food court?",
    "What exhibitions are currently showing?",
    "How do I get to the Omni-Theatre?",
    "Are there any special programs today?"
  ],
  families: [
    "What activities are suitable for young children?",
    "Where can I find the KidsSTOP area?",
    "Are there baby changing facilities?",
    "What's the recommended age for different exhibits?",
    "Do you have stroller rental services?"
  ],
  students: [
    "Are there any educational workshops today?",
    "What's the best route for a science learning tour?",
    "Do you offer student discounts?",
    "Where can I find interactive science experiments?",
    "Are there any STEM career guidance sessions?"
  ],
  seniors: [
    "Are there wheelchair accessible routes?",
    "What are the quieter exhibition areas?",
    "Do you have seating areas throughout the centre?",
    "Are there guided tours available?",
    "What are the less crowded visiting times?"
  ]
};

// AI responses based on facial expressions
const emotionBasedSuggestions = {
  Happy: [
    "I can see you're excited! Let me recommend our most interactive exhibits.",
    "Your enthusiasm is wonderful! Would you like to know about our hands-on experiments?",
    "You look ready for adventure! How about exploring our Future Makers exhibit?"
  ],
  Excited: [
    "Your energy is amazing! Perfect for our high-energy exhibits like the Kinetic Garden.",
    "I love your excitement! Let's find you something that matches your enthusiasm.",
    "You're radiating positive energy! Our interactive science zones would be perfect for you."
  ],
  Curious: [
    "I can sense your curiosity! That's the perfect mindset for exploring science.",
    "Your inquisitive expression tells me you'll love our discovery zones.",
    "Curiosity is the key to great discoveries! Let me guide you to our research exhibits."
  ],
  Neutral: [
    "Welcome! Let me help you discover something that will spark your interest.",
    "I'm here to help you find the perfect experience for your visit today.",
    "Let's explore what the Science Centre has to offer that might catch your attention."
  ],
  Confused: [
    "No worries if you're feeling a bit overwhelmed! I'm here to help guide you.",
    "Let me help simplify your visit and find exactly what you're looking for.",
    "The Science Centre can be big! I'll help you navigate to the best spots for you."
  ]
};

export default function AIAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [customQuestion, setCustomQuestion] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string>('Neutral');
  const [ageGroup, setAgeGroup] = useState<string>('Adult');
  
  // Animation values
  const pulseValue = useSharedValue(1);
  const micPulse = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    // Gentle pulse animation for main container
    pulseValue.value = withRepeat(withTiming(1.05, { duration: 2000 }), -1, true);
    
    // Sparkle rotation animation
    sparkleRotation.value = withRepeat(withTiming(360, { duration: 3000 }), -1, false);
  }, []);

  useEffect(() => {
    if (isListening) {
      // Mic pulse animation when listening
      micPulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 300 }),
          withTiming(0.8, { duration: 300 })
        ),
        -1,
        true
      );
    } else {
      micPulse.value = withTiming(1, { duration: 300 });
    }
  }, [isListening]);

  const handleMicPress = () => {
    if (isProcessing || isSpeaking) return;
    
    if (!isListening) {
      setIsListening(true);
      speakText("I'm listening! Please ask your question now.");
      
      // Simulate listening for 4 seconds
      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(true);
        processVoiceInput();
      }, 4000);
    } else {
      setIsListening(false);
      speakText("Stopped listening.");
    }
  };

  const processVoiceInput = async () => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get AI response based on detected emotion or random selection
    const suggestions = emotionBasedSuggestions[detectedEmotion as keyof typeof emotionBasedSuggestions] || emotionBasedSuggestions.Neutral;
    const response = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    setCurrentResponse(response);
    setIsProcessing(false);
    
    // Speak the response
    speakText(response);
  };

  const handleQuestionPress = (question: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
    
    setCurrentResponse(`Great question! "${question}" - Let me help you with that based on your current expression.`);
    
    // Analyze facial expression and provide contextual response
    setTimeout(() => {
      const suggestions = emotionBasedSuggestions[detectedEmotion as keyof typeof emotionBasedSuggestions] || emotionBasedSuggestions.Neutral;
      const contextualResponse = `${suggestions[0]} For "${question}", here's what I recommend: ${getAnswerForQuestion(question)}`;
      
      setCurrentResponse(contextualResponse);
      speakText(contextualResponse);
    }, 1000);
  };

  const getAnswerForQuestion = (question: string): string => {
    const answers: { [key: string]: string } = {
      "What are the opening hours?": "We're open daily from 10 AM to 6 PM, with extended hours on weekends until 8 PM.",
      "Where is the food court?": "The food court is located on Level 2, near the main atrium. You'll find a variety of dining options there.",
      "What exhibitions are currently showing?": "We have several exciting exhibitions including Future Makers, Climate Change, and our new Interactive AI Zone.",
      "How do I get to the Omni-Theatre?": "The Omni-Theatre is on Level 1. Take the escalator down from the main entrance and follow the signs.",
      "What activities are suitable for young children?": "KidsSTOP on Level 2 is perfect for children aged 18 months to 8 years, with safe, interactive play zones.",
      "Where can I find the KidsSTOP area?": "KidsSTOP is located on Level 2. It's our dedicated area for younger visitors with age-appropriate activities."
    };
    
    return answers[question] || "That's an excellent question! I'd recommend visiting our information desk for detailed assistance.";
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Mock data generation for visitor profile
  const generateMockVisitorProfile = () => {
    const emotions = ['Happy', 'Excited', 'Curious', 'Neutral', 'Confused'];
    const ageGroups = ['Adult', 'Child'];
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const randomAgeGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
    
    setDetectedEmotion(randomEmotion);
    setAgeGroup(randomAgeGroup);
  };

  // Initialize with mock data on component mount
  useEffect(() => {
    generateMockVisitorProfile();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micPulse.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF9800', '#FF6F00', '#E65100']}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Animated.View style={sparkleAnimatedStyle}>
              <Sparkles color="#FFD700" size={24} />
            </Animated.View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.subtitle}>Your Intelligent Science Centre Guide</Text>
            <Text style={styles.emotionText}>Visitor Profile: {ageGroup} • {detectedEmotion}</Text>
          </View>



          {/* Voice Interaction */}
          <View style={styles.centerContainer}>
            <Animated.View style={[styles.micContainer, animatedStyle]}>
              <Animated.View style={micAnimatedStyle}>
                <TouchableOpacity 
                  style={[styles.micButton, isListening && styles.micButtonActive]}
                  onPress={handleMicPress}
                  activeOpacity={0.8}
                  disabled={isProcessing}
                >
                  {isListening ? (
                    <MicOff color="#FFFFFF" size={40} />
                  ) : (
                    <Mic color={isListening ? "#FFFFFF" : "#FF9800"} size={40} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                {isProcessing ? 'Processing your question...' : 
                 isListening ? 'Listening... Speak now!' : 'Tap to ask me anything!'}
              </Text>
            </View>
          </View>

          {/* Question Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Quick Questions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {Object.keys(predefinedQuestions).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Predefined Questions */}
          <View style={styles.questionsContainer}>
            {predefinedQuestions[selectedCategory as keyof typeof predefinedQuestions].map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.questionButton}
                onPress={() => handleQuestionPress(question)}
              >
                <MessageCircle color="#FF9800" size={18} />
                <Text style={styles.questionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Question Input */}
          <View style={styles.customQuestionContainer}>
            <Text style={styles.sectionTitle}>Ask Something Else</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={customQuestion}
                onChangeText={setCustomQuestion}
                placeholder="Type your question here..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                multiline
              />
              <TouchableOpacity
                style={styles.askButton}
                onPress={() => handleQuestionPress(customQuestion)}
                disabled={!customQuestion.trim()}
              >
                <Text style={styles.askButtonText}>Ask</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Response */}
          {currentResponse ? (
            <View style={styles.responseContainer}>
              <View style={styles.responseHeader}>
                <Text style={styles.responseTitle}>AI Assistant Response</Text>
                <TouchableOpacity
                  style={styles.speakButton}
                  onPress={isSpeaking ? stopSpeaking : () => speakText(currentResponse)}
                >
                  {isSpeaking ? (
                    <Pause color="#FFFFFF" size={18} />
                  ) : (
                    <Volume2 color="#FFFFFF" size={18} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.responseText}>{currentResponse}</Text>
              {isSpeaking && (
                <View style={styles.speakingIndicator}>
                  <Text style={styles.speakingText}>Speaking...</Text>
                </View>
              )}
            </View>
          ) : null}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#FF9800',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
  },
  emotionText: {
    fontSize: 14,
    color: '#FFE0B3',
    marginTop: 8,
    fontWeight: '600',
  },

  centerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  micContainer: {
    marginBottom: 20,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  micButtonActive: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginBottom: 15,
  },
  categoryScroll: {
    paddingLeft: 20,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: 'white',
  },
  questionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  customQuestionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 14,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  askButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: 'center',
  },
  askButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  responseContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  speakButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
  },
  responseText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  speakingIndicator: {
    marginTop: 10,
    alignItems: 'center',
  },
  speakingText: {
    color: '#FFE0B3',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
