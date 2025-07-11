import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
} from 'react-native-reanimated';
import { 
  ArrowLeft,
  Calendar,
  Users, 
  Star,
  TrendingUp,
  Clock,
  Eye,
  Smile,
  Meh,
  Frown,
  Brain,
  Camera,
  Heart,
  Activity,
  BarChart3,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock exhibition data with facial recognition insights
const exhibitionsData = [
  {
    id: 1,
    name: 'KidsSTOP',
    description: 'Interactive playground for children under 8',
    todayVisitors: 445,
    avgTime: '45 min',
    mlSatisfaction: 4.6,
    emotionBreakdown: {
      happy: 78,
      excited: 16,
      curious: 4,
      neutral: 2,
      confused: 0
    },
    ageDistribution: {
      children: 89,
      adults: 11
    },
    peakHours: ['10:00-12:00', '14:00-16:00'],
    mlPredictions: {
      engagement: 'High',
      recommendation: 'Excellent for families with young children',
      improvements: 'Consider adding more seating areas for parents'
    },
    reviews: [
      { emotion: 'Happy', confidence: 0.94, age: 'Child', timestamp: '14:32', feedback: 'Highly engaged with hands-on activities' },
      { emotion: 'Excited', confidence: 0.88, age: 'Child', timestamp: '14:28', feedback: 'Showed prolonged interest in building blocks' },
      { emotion: 'Happy', confidence: 0.76, age: 'Adult', timestamp: '14:25', feedback: 'Parent appeared satisfied watching child play' }
    ]
  },
  {
    id: 2,
    name: 'Future Tech',
    description: 'Advanced technology and AI demonstrations',
    todayVisitors: 392,
    avgTime: '38 min',
    mlSatisfaction: 4.3,
    emotionBreakdown: {
      happy: 58,
      excited: 12,
      curious: 22,
      neutral: 6,
      confused: 2
    },
    ageDistribution: {
      children: 35,
      adults: 65
    },
    peakHours: ['11:00-13:00', '15:00-17:00'],
    mlPredictions: {
      engagement: 'High',
      recommendation: 'Appeals strongly to tech enthusiasts and adults',
      improvements: 'Add more interactive elements for younger visitors'
    },
    reviews: [
      { emotion: 'Curious', confidence: 0.91, age: 'Adult', timestamp: '15:45', feedback: 'Deep focus on AI demonstrations' },
      { emotion: 'Happy', confidence: 0.83, age: 'Adult', timestamp: '15:42', feedback: 'Positive reaction to robotics display' },
      { emotion: 'Confused', confidence: 0.67, age: 'Child', timestamp: '15:38', feedback: 'Difficulty understanding complex concepts' }
    ]
  },
  {
    id: 3,
    name: 'Climate Changed',
    description: 'Interactive climate science exhibition',
    todayVisitors: 318,
    avgTime: '32 min',
    mlSatisfaction: 4.1,
    emotionBreakdown: {
      happy: 45,
      excited: 8,
      curious: 35,
      neutral: 10,
      confused: 2
    },
    ageDistribution: {
      children: 42,
      adults: 58
    },
    peakHours: ['09:00-11:00', '13:00-15:00'],
    mlPredictions: {
      engagement: 'Medium-High',
      recommendation: 'Educational value is high, emotional response could be improved',
      improvements: 'Add more interactive climate solutions demonstrations'
    },
    reviews: [
      { emotion: 'Curious', confidence: 0.89, age: 'Adult', timestamp: '13:20', feedback: 'Strong interest in climate data visualizations' },
      { emotion: 'Happy', confidence: 0.72, age: 'Child', timestamp: '13:15', feedback: 'Enjoyed interactive weather station' },
      { emotion: 'Neutral', confidence: 0.65, age: 'Adult', timestamp: '13:10', feedback: 'Moderate engagement with content' }
    ]
  },
  {
    id: 4,
    name: 'Earth Alive',
    description: 'Live specimens and ecosystem displays',
    todayVisitors: 287,
    avgTime: '28 min',
    mlSatisfaction: 4.4,
    emotionBreakdown: {
      happy: 65,
      excited: 20,
      curious: 12,
      neutral: 3,
      confused: 0
    },
    ageDistribution: {
      children: 68,
      adults: 32
    },
    peakHours: ['10:00-12:00', '14:00-16:00'],
    mlPredictions: {
      engagement: 'Very High',
      recommendation: 'Extremely popular with children, high satisfaction',
      improvements: 'Consider expanding live animal demonstrations'
    },
    reviews: [
      { emotion: 'Excited', confidence: 0.95, age: 'Child', timestamp: '11:30', feedback: 'Extremely excited about live animal feeding' },
      { emotion: 'Happy', confidence: 0.87, age: 'Child', timestamp: '11:25', feedback: 'Positive reaction to butterfly garden' },
      { emotion: 'Happy', confidence: 0.79, age: 'Adult', timestamp: '11:20', feedback: 'Parent enjoying child\'s enthusiasm' }
    ]
  }
];

export default function ExhibitionManagement() {
  const router = useRouter();
  const [selectedExhibition, setSelectedExhibition] = useState(exhibitionsData[0]);
  
  const fadeValue = useSharedValue(0);

  useEffect(() => {
    fadeValue.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy': return <Smile color="#4CAF50" size={16} />;
      case 'excited': return <Heart color="#FF9800" size={16} />;
      case 'curious': return <Eye color="#2196F3" size={16} />;
      case 'neutral': return <Meh color="#9E9E9E" size={16} />;
      case 'confused': return <Frown color="#F44336" size={16} />;
      default: return <Meh color="#9E9E9E" size={16} />;
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'Very High': return '#4CAF50';
      case 'High': return '#8BC34A';
      case 'Medium-High': return '#FFC107';
      case 'Medium': return '#FF9800';
      case 'Low': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9C27B0', '#BA68C8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Exhibition Management</Text>
            <Text style={styles.headerSubtitle}>AI-Powered Reviews & Satisfaction Analysis</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          
          {/* Exhibition Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Exhibition</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exhibitionTabs}>
              {exhibitionsData.map((exhibition) => (
                <TouchableOpacity
                  key={exhibition.id}
                  style={[
                    styles.exhibitionTab,
                    selectedExhibition.id === exhibition.id && styles.selectedTab
                  ]}
                  onPress={() => setSelectedExhibition(exhibition)}
                >
                  <Text style={[
                    styles.tabText,
                    selectedExhibition.id === exhibition.id && styles.selectedTabText
                  ]}>
                    {exhibition.name}
                  </Text>
                  <Text style={[
                    styles.tabSatisfaction,
                    selectedExhibition.id === exhibition.id && styles.selectedTabSatisfaction
                  ]}>
                    ★ {exhibition.mlSatisfaction}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Exhibition Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{selectedExhibition.name} Overview</Text>
            <View style={styles.overviewCard}>
              <Text style={styles.exhibitionDescription}>{selectedExhibition.description}</Text>
              
              <View style={styles.quickStats}>
                <View style={styles.quickStat}>
                  <Users color="#666" size={20} />
                  <Text style={styles.quickStatValue}>{selectedExhibition.todayVisitors}</Text>
                  <Text style={styles.quickStatLabel}>Today's Visitors</Text>
                </View>
                <View style={styles.quickStat}>
                  <Clock color="#666" size={20} />
                  <Text style={styles.quickStatValue}>{selectedExhibition.avgTime}</Text>
                  <Text style={styles.quickStatLabel}>Avg. Time</Text>
                </View>
                <View style={styles.quickStat}>
                  <Star color="#666" size={20} />
                  <Text style={styles.quickStatValue}>{selectedExhibition.mlSatisfaction}</Text>
                  <Text style={styles.quickStatLabel}>ML Rating</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ML Predictions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Insights & Predictions</Text>
            <View style={styles.mlCard}>
              <View style={styles.mlHeader}>
                <Brain color="#9C27B0" size={24} />
                <Text style={styles.mlTitle}>Machine Learning Analysis</Text>
              </View>
              
              <View style={styles.mlInsight}>
                <Text style={styles.mlLabel}>Engagement Level:</Text>
                <View style={[
                  styles.engagementBadge, 
                  { backgroundColor: getEngagementColor(selectedExhibition.mlPredictions.engagement) }
                ]}>
                  <Text style={styles.engagementText}>{selectedExhibition.mlPredictions.engagement}</Text>
                </View>
              </View>
              
              <View style={styles.mlInsight}>
                <Text style={styles.mlLabel}>AI Recommendation:</Text>
                <Text style={styles.mlValue}>{selectedExhibition.mlPredictions.recommendation}</Text>
              </View>
              
              <View style={styles.mlInsight}>
                <Text style={styles.mlLabel}>Suggested Improvements:</Text>
                <Text style={styles.mlValue}>{selectedExhibition.mlPredictions.improvements}</Text>
              </View>
            </View>
          </View>

          {/* Emotion Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visitor Emotions (Facial Recognition)</Text>
            <View style={styles.emotionCard}>
              {Object.entries(selectedExhibition.emotionBreakdown).map(([emotion, percentage]) => (
                <View key={emotion} style={styles.emotionRow}>
                  <View style={styles.emotionHeader}>
                    {getEmotionIcon(emotion)}
                    <Text style={styles.emotionLabel}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.emotionBar}>
                    <View 
                      style={[
                        styles.emotionProgress, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: 
                            emotion === 'happy' ? '#4CAF50' :
                            emotion === 'excited' ? '#FF9800' :
                            emotion === 'curious' ? '#2196F3' :
                            emotion === 'neutral' ? '#9E9E9E' : '#F44336'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.emotionValue}>{percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Age Distribution */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age Distribution</Text>
            <View style={styles.ageCard}>
              <View style={styles.ageRow}>
                <View style={styles.ageItem}>
                  <Text style={styles.ageLabel}>Children</Text>
                  <Text style={styles.agePercentage}>{selectedExhibition.ageDistribution.children}%</Text>
                </View>
                <View style={styles.ageItem}>
                  <Text style={styles.ageLabel}>Adults</Text>
                  <Text style={styles.agePercentage}>{selectedExhibition.ageDistribution.adults}%</Text>
                </View>
              </View>
              
              <View style={styles.ageBarContainer}>
                <View 
                  style={[
                    styles.ageSegment, 
                    { 
                      width: `${selectedExhibition.ageDistribution.children}%`,
                      backgroundColor: '#FF9800'
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.ageSegment, 
                    { 
                      width: `${selectedExhibition.ageDistribution.adults}%`,
                      backgroundColor: '#2196F3'
                    }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Real-time Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Facial Recognition Reviews</Text>
            <Text style={styles.sectionSubtitle}>AI-generated insights from visitor expressions</Text>
            
            {selectedExhibition.reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewEmotion}>
                    {getEmotionIcon(review.emotion)}
                    <Text style={styles.reviewEmotionText}>{review.emotion}</Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewAge}>{review.age}</Text>
                    <Text style={styles.reviewTime}>{review.timestamp}</Text>
                  </View>
                </View>
                
                <Text style={styles.reviewFeedback}>{review.feedback}</Text>
                
                <View style={styles.reviewFooter}>
                  <View style={styles.confidenceBar}>
                    <Text style={styles.confidenceLabel}>Confidence:</Text>
                    <View style={styles.confidenceMeter}>
                      <View 
                        style={[
                          styles.confidenceProgress, 
                          { width: `${review.confidence * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.confidenceValue}>{Math.round(review.confidence * 100)}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Peak Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Peak Hours</Text>
            <View style={styles.peakHoursCard}>
              {selectedExhibition.peakHours.map((hour, index) => (
                <View key={index} style={styles.peakHourItem}>
                  <Clock color="#666" size={16} />
                  <Text style={styles.peakHourText}>{hour}</Text>
                </View>
              ))}
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  exhibitionTabs: {
    flexDirection: 'row',
  },
  exhibitionTab: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTab: {
    backgroundColor: '#9C27B0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedTabText: {
    color: 'white',
  },
  tabSatisfaction: {
    fontSize: 12,
    color: '#666',
  },
  selectedTabSatisfaction: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exhibitionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
    gap: 8,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  mlCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mlTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mlInsight: {
    marginBottom: 12,
  },
  mlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mlValue: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  engagementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  engagementText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emotionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emotionRow: {
    marginBottom: 12,
  },
  emotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  emotionBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  emotionProgress: {
    height: '100%',
    borderRadius: 4,
  },
  emotionValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontWeight: '600',
  },
  ageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  ageItem: {
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  agePercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ageBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  ageSegment: {
    height: '100%',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewEmotion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewEmotionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  reviewAge: {
    fontSize: 12,
    color: '#666',
  },
  reviewTime: {
    fontSize: 12,
    color: '#666',
  },
  reviewFeedback: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 18,
  },
  reviewFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  confidenceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#666',
  },
  confidenceMeter: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  confidenceProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  confidenceValue: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  peakHoursCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  peakHourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  peakHourText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
}); 