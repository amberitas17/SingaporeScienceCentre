
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, Send, Volume2, VolumeX, MessageCircle, Camera, Sparkles, RotateCcw, Keyboard, Settings } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { faceAnalysisService } from '../../services/faceAnalysisService';
import { useFaceVerification } from '../contexts/FaceVerificationContext';

const { width, height } = Dimensions.get('window');

// Predefined questions for different visitor types - keep for quick access
const predefinedQuestions = {
  general: [
    "What are the opening hours?",
    "Where can I park?",
    "How much are the tickets?",
    "Where is the information desk?"
  ],
  families: [
    "What activities are suitable for young children?",
    "Where is KidsSTOP?",
    "Are there baby changing facilities?",
    "Is there a family rest area?"
  ],
  students: [
    "Are there educational workshops today?",
    "Where can I find interactive science experiments?",
    "Are there guided tours available?",
    "What exhibitions help with science learning?"
  ],
  seniors: [
    "Are there comfortable seating areas?",
    "Which exhibitions are less physically demanding?",
    "Is there assistance available for mobility?",
    "What are the quieter exhibition areas?"
  ]
};

// Emotion-based suggestions - keep for contextual responses
const emotionBasedSuggestions = {
  Happy: [
    "I love your positive energy! The Science Centre has so many exciting discoveries waiting for you.",
    "Your enthusiasm is contagious! Let me help you find the most amazing experiences here.",
    "Great to see you so excited! You're going to have an incredible time exploring our exhibitions."
  ],
  Neutral: [
    "Welcome to Singapore Science Centre! I'm here to help you discover fascinating experiences.",
    "Let me guide you to the perfect exhibitions that match your interests.",
    "There's so much to explore here! I'll help you find what excites you most."
  ],
  Surprised: [
    "I can see you're amazed! Wait until you see what else we have in store for you.",
    "Your wonder is exactly what science is about! Let me show you more incredible discoveries.",
    "That surprise on your face tells me you're ready for more mind-blowing experiences!"
  ]
};

export default function AIAssistant() {
  const { verificationResult, getVisitorProfile } = useFaceVerification();
  const visitorProfile = getVisitorProfile();
  const detectedEmotion = visitorProfile.dominantEmotion;
  const ageGroup = visitorProfile.ageGroup;
  
  // Chat and Input States
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [textMessage, setTextMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    user: string, 
    ai: string, 
    timestamp: Date,
    isVoice?: boolean
  }>>([]);
  
  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  
  // Speech States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  
  // UI States
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  
  // Animation values
  const pulseValue = useSharedValue(1);
  const micPulse = useSharedValue(1);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isListening) {
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

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (conversationHistory.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversationHistory]);

  const handleMicPress = async () => {
    if (isProcessing) {
      return;
    }
    
    if (!isListening) {
      await startAudioRecording();
    } else {
      await stopAudioRecording();
    }
  };

  const startAudioRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting microphone permission...');
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('🎤 Starting audio recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsListening(true);

      // Auto-stop recording after 10 seconds
      setTimeout(async () => {
        if (recording && isListening) {
          await stopAudioRecording();
        }
      }, 10000);

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopAudioRecording = async () => {
    console.log('🛑 Stopping recording...');
    setIsListening(false);
    
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        console.log('📁 Audio recorded at:', uri);
        
        setRecording(null);
        setIsProcessing(true);
        
        // Send audio to Flask for AssemblyAI processing
        await processAudioWithAssemblyAI(uri);
        
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsProcessing(false);
      }
    }
  };

  const processAudioWithAssemblyAI = async (audioUri: string | null) => {
    try {
      console.log('🤖 Sending audio to Flask with AssemblyAI...');
      
      if (!audioUri) {
        throw new Error('No audio file to process');
      }

      // Send audio to Flask backend for AssemblyAI processing
      const transcriptionResult = await sendAudioToFlask(audioUri);
      
      console.log('✅ AssemblyAI transcription:', transcriptionResult.transcript);
      
      // Generate AI response based on keyword detection, but use original transcript for display
      await generateAIResponse(transcriptionResult.keyword_response, transcriptionResult.transcript, true);
      
    } catch (error) {
      console.error('❌ AssemblyAI processing failed:', error);
      setIsProcessing(false);
      
      // Generate random response if speech not detected
      const randomResponse = generateRandomResponse();
      await generateAIResponse(randomResponse, '(Speech not detected)', true);
    }
  };

  const sendAudioToFlask = async (audioUri: string): Promise<{transcript: string, keyword_response: string}> => {
    try {
      console.log('📡 Sending audio to Flask for AssemblyAI transcription...');
       
      // Create FormData for audio file
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      const response = await fetch('http://192.168.18.3:5000/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Flask server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.transcript) {
        return {
          transcript: data.transcript,
          keyword_response: data.keyword_response || data.transcript
        };
      } else {
        throw new Error(data.error || 'Transcription failed');
      }
      
    } catch (error) {
      console.error('Failed to send audio to Flask:', error);
      throw error;
    }
  };

  const generateRandomResponse = (): string => {
    const randomResponses = [
      "What are the opening hours?",
      "Where is the food court?", 
      "How do I get to KidsSTOP?",
      "What exhibitions are showing?",
      "Are there any special programs?",
      "Where can I park?",
      "What activities are for children?",
      "Tell me about the interactive exhibits"
    ];
    
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!textMessage.trim()) return;
    
    const message = textMessage.trim();
    setTextMessage('');
    setIsProcessing(true);
    
    // Hide quick questions when sending a message
    setShowQuickQuestions(false);
    
    await generateAIResponse(message, message, false);
  };

  const generateAIResponse = async (userInput: string, originalTranscript?: string, isVoice = false) => {
    try {
      console.log('🤖 Generating AI response for:', userInput);
      
      // Enhanced AI response generation with context awareness
      let aiResponse = '';
      
      // Check if it's a greeting or follow-up
      const isGreeting = /hello|hi|hey|good morning|good afternoon|good evening/i.test(userInput);
      
      if (isGreeting) {
        aiResponse = `Hello! Welcome to Singapore Science Centre! I'm your AI assistant, and I can see you're ${detectedEmotion.toLowerCase()} today. How can I help make your visit amazing?`;
      } else if (userInput.toLowerCase().includes('opening hours') || userInput.toLowerCase().includes('hours')) {
        aiResponse = `We're open daily from 10 AM to 6 PM, with extended hours on weekends until 8 PM. Since you seem ${detectedEmotion.toLowerCase()}, I'd recommend arriving early to make the most of your visit!`;
      } else if (userInput.toLowerCase().includes('kidsstop') || userInput.toLowerCase().includes('children')) {
        aiResponse = `KidsSTOP is on Level 2 - perfect for children aged 18 months to 8 years! ${ageGroup === 'Child' ? "It looks like this might be perfect for you!" : "Great choice for families!"}`;
      } else if (userInput.toLowerCase().includes('interactive') || userInput.toLowerCase().includes('exhibits')) {
        const suggestions = emotionBasedSuggestions[detectedEmotion as keyof typeof emotionBasedSuggestions] || emotionBasedSuggestions.Neutral;
        aiResponse = `${suggestions[0]} For interactive exhibits, I highly recommend the Future Makers gallery and our hands-on experiment stations!`;
      } else if (userInput.toLowerCase().includes('food') || userInput.toLowerCase().includes('eat')) {
        aiResponse = `The food court is on Level 2 near the main atrium. You'll find great dining options there! Perfect for recharging during your science adventure.`;
      } else {
        // Generic contextual response
        const suggestions = emotionBasedSuggestions[detectedEmotion as keyof typeof emotionBasedSuggestions] || emotionBasedSuggestions.Neutral;
        const contextualResponse = suggestions[Math.floor(Math.random() * suggestions.length)];
        aiResponse = `${contextualResponse} Regarding "${userInput}", let me help you with that! ${getAnswerForQuestion(userInput)}`;
      }
      
      // Add to conversation history - use original transcript for display, userInput for AI logic
      const displayText = originalTranscript || userInput;
      const newEntry = {
        user: displayText,
        ai: aiResponse,
        timestamp: new Date(),
        isVoice: isVoice
      };
      
      setConversationHistory(prev => [...prev, newEntry]);
      setIsProcessing(false);
      
      // Speak the response if auto-speak is enabled
      if (autoSpeak) {
        await speakText(aiResponse);
      }
      
      console.log('✅ AI response generated and spoken');
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsProcessing(false);
      const fallbackResponse = "I'm sorry, I'm having trouble processing that right now. Could you please try asking again?";
      
      const newEntry = {
        user: originalTranscript || userInput,
        ai: fallbackResponse,
        timestamp: new Date(),
        isVoice: isVoice
      };
      
      setConversationHistory(prev => [...prev, newEntry]);
      
      if (autoSpeak) {
        speakText(fallbackResponse);
      }
    }
  };

  const getAnswerForQuestion = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Comprehensive knowledge base for Science Centre queries
    if (lowerQuestion.includes('ticket') || lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
      return "Adult tickets are $15, children $10. Combo packages available for better value!";
    } else if (lowerQuestion.includes('hour') || lowerQuestion.includes('time') || lowerQuestion.includes('open')) {
      return "We're open daily 10 AM - 6 PM, weekends until 8 PM. Plan your visit for maximum exploration time!";
    } else if (lowerQuestion.includes('park') || lowerQuestion.includes('car')) {
      return "Parking is available at our main car park. Accessible parking spaces are near the entrance.";
    } else if (lowerQuestion.includes('food') || lowerQuestion.includes('eat') || lowerQuestion.includes('café')) {
      return "The food court on Level 2 offers various dining options. Perfect for a science-filled day!";
    } else if (lowerQuestion.includes('kidsstop') || lowerQuestion.includes('children') || lowerQuestion.includes('kid')) {
      return "KidsSTOP on Level 2 is perfect for ages 18 months to 8 years. A wonderful learning playground!";
    } else if (lowerQuestion.includes('exhibition') || lowerQuestion.includes('show') || lowerQuestion.includes('display')) {
      return "We have 14 permanent galleries plus rotating special exhibitions. Each one offers unique discoveries!";
    } else if (lowerQuestion.includes('workshop') || lowerQuestion.includes('program') || lowerQuestion.includes('activity')) {
      return "Daily workshops and educational programs are available. Check our schedule for today's offerings!";
    } else if (lowerQuestion.includes('interactive') || lowerQuestion.includes('hands-on')) {
      return "Future Makers, Live Science Lab, and our experiment stations offer amazing hands-on experiences!";
    } else {
      return "That's a great question! Our friendly staff at the information desk can provide detailed assistance.";
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setTextMessage(question);
    setShowQuickQuestions(false);
    handleSendMessage();
  };

  const resetChat = () => {
    setConversationHistory([]);
    setTextMessage('');
    setShowQuickQuestions(true);
    setIsProcessing(false);
    setIsListening(false);
    console.log('🔄 Chat reset');
  };

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micPulse.value }],
  }));

  const renderMessage = (entry: any, index: number) => (
    <View key={index} style={styles.messageContainer}>
      {/* User Message */}
      <View style={styles.userMessageContainer}>
        <View style={[styles.messageBubble, styles.userBubble]}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageLabel}>You</Text>
            {entry.isVoice && <Mic size={12} color="#fff" />}
          </View>
          <Text style={styles.userMessageText}>{entry.user}</Text>
        </View>
      </View>
      
      {/* AI Message */}
      <View style={styles.aiMessageContainer}>
        <View style={[styles.messageBubble, styles.aiBubble]}>
          <View style={styles.messageHeader}>
            <Sparkles size={14} color="#FF9800" />
            <Text style={styles.aiMessageLabel}>AI Assistant</Text>
            <TouchableOpacity
              onPress={() => speakText(entry.ai)}
              style={styles.speakButton}
            >
              <Volume2 size={12} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.aiMessageText}>{entry.ai}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#f8f9fa', '#ffffff']}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarContainer}>
                <Sparkles color="#FF9800" size={20} />
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Assistant</Text>
                <Text style={styles.headerSubtitle}>
                  {visitorProfile.detectedCount} • {detectedEmotion}
                </Text>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setAutoSpeak(!autoSpeak)}
              >
                {autoSpeak ? <Volume2 size={20} color="#666" /> : <VolumeX size={20} color="#666" />}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerButton}
                onPress={resetChat}
              >
                <RotateCcw size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
          >
            {conversationHistory.length === 0 && showQuickQuestions && (
              <View style={styles.welcomeContainer}>
                <View style={styles.welcomeHeader}>
                  <Sparkles color="#FF9800" size={24} />
                  <Text style={styles.welcomeTitle}>Welcome to Science Centre!</Text>
                  <Text style={styles.welcomeSubtitle}>
                    I'm here to help you explore and discover amazing things. What would you like to know?
                  </Text>
                </View>
                
                <View style={styles.quickQuestionsContainer}>
                  <Text style={styles.quickQuestionsTitle}>Quick Questions</Text>
                  <View style={styles.categoriesRow}>
                    {Object.keys(predefinedQuestions).map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          selectedCategory === category && styles.categoryChipActive
                        ]}
                        onPress={() => setSelectedCategory(category)}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          selectedCategory === category && styles.categoryChipTextActive
                        ]}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <View style={styles.questionsGrid}>
                    {predefinedQuestions[selectedCategory as keyof typeof predefinedQuestions]
                      .map((question, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.quickQuestionButton}
                        onPress={() => handleQuickQuestion(question)}
                      >
                        <MessageCircle color="#FF9800" size={14} />
                        <Text style={styles.quickQuestionText}>{question}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
            
            {conversationHistory.map((entry, index) => renderMessage(entry, index))}
            
            {isProcessing && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingText}>AI is thinking...</Text>
                  <View style={styles.typingDots}>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.dot}>•</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              {/* Mode Toggle */}
              <TouchableOpacity
                style={[styles.modeToggle, inputMode === 'voice' && styles.modeToggleActive]}
                onPress={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
              >
                {inputMode === 'text' ? (
                  <Keyboard size={18} color={inputMode === 'text' ? "#666" : "#999"} />
                ) : (
                  <Mic size={18} color={inputMode === 'voice' ? "#FF9800" : "#999"} />
                )}
              </TouchableOpacity>
              
              {inputMode === 'text' ? (
                <>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type your message..."
                    value={textMessage}
                    onChangeText={setTextMessage}
                    multiline
                    maxLength={500}
                    onSubmitEditing={handleSendMessage}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, !textMessage.trim() && styles.sendButtonDisabled]}
                    onPress={handleSendMessage}
                    disabled={!textMessage.trim() || isProcessing}
                  >
                    <Send size={18} color={textMessage.trim() ? "#FF9800" : "#ccc"} />
                  </TouchableOpacity>
                </>
              ) : (
                <Animated.View style={[styles.voiceInputContainer, micAnimatedStyle]}>
                  <TouchableOpacity
                    style={[
                      styles.voiceButton,
                      isListening && styles.voiceButtonActive,
                      isProcessing && styles.voiceButtonProcessing
                    ]}
                    onPress={handleMicPress}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Text style={styles.voiceButtonText}>Processing...</Text>
                    ) : isListening ? (
                      <>
                        <MicOff size={20} color="#fff" />
                        <Text style={styles.voiceButtonText}>Tap to stop</Text>
                      </>
                    ) : (
                      <>
                        <Mic size={20} color="#fff" />
                        <Text style={styles.voiceButtonText}>Hold to speak</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  chatContent: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  quickQuestionsContainer: {
    width: '100%',
  },
  quickQuestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    margin: 4,
  },
  categoryChipActive: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  questionsGrid: {
    gap: 10,
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  messageContainer: {
    marginBottom: 20,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#FF9800',
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.8,
    marginRight: 4,
  },
  aiMessageLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 4,
    flex: 1,
  },
  speakButton: {
    padding: 4,
  },
  userMessageText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  aiMessageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    fontSize: 16,
    color: '#FF9800',
    marginHorizontal: 1,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  modeToggle: {
    padding: 12,
    borderRadius: 20,
    marginRight: 5,
  },
  modeToggleActive: {
    backgroundColor: '#FFF3E0',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    marginLeft: 5,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  voiceInputContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  voiceButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  voiceButtonActive: {
    backgroundColor: '#f44336',
  },
  voiceButtonProcessing: {
    backgroundColor: '#9E9E9E',
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
