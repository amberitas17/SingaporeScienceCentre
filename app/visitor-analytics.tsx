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
  Users, 
  TrendingUp, 
  Clock,
  Eye,
  Smile,
  Baby,
  UserCheck,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Calendar,
  Camera
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock visitor analytics data from facial recognition
const visitorData = {
  totalToday: 1247,
  demographics: {
    adults: 892,
    children: 355,
    ageGroups: {
      '0-12': 255,
      '13-17': 100,
      '18-35': 445,
      '36-50': 302,
      '51+': 145
    }
  },
  emotions: {
    happy: 73,
    excited: 15,
    curious: 8,
    neutral: 3,
    confused: 1
  },
  peakHours: [
    { hour: '10:00', visitors: 180 },
    { hour: '11:00', visitors: 220 },
    { hour: '14:00', visitors: 195 },
    { hour: '15:00', visitors: 240 },
    { hour: '16:00', visitors: 168 }
  ],
  satisfactionPrediction: 4.2, // ML predicted rating out of 5
  engagementRate: 92,
  returnVisitors: 23
};

const exhibitionPopularity = [
  { name: 'KidsSTOP', visitors: 445, satisfaction: 4.6, avgTime: '45 min' },
  { name: 'Future Tech', visitors: 392, satisfaction: 4.3, avgTime: '38 min' },
  { name: 'Climate Changed', visitors: 318, satisfaction: 4.1, avgTime: '32 min' },
  { name: 'Earth Alive', visitors: 287, satisfaction: 4.4, avgTime: '28 min' },
  { name: 'Omni-Theatre', visitors: 256, satisfaction: 4.5, avgTime: '25 min' }
];

export default function VisitorAnalytics() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const fadeValue = useSharedValue(0);

  useEffect(() => {
    fadeValue.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#66BB6A']}
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
            <Text style={styles.headerTitle}>Visitor Analytics</Text>
            <Text style={styles.headerSubtitle}>AI-Powered Insights & Demographics</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          
          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Users color="#4CAF50" size={24} />
                <Text style={styles.statValue}>{visitorData.totalToday}</Text>
                <Text style={styles.statLabel}>Total Visitors</Text>
              </View>
              <View style={styles.statCard}>
                <TrendingUp color="#FF9800" size={24} />
                <Text style={styles.statValue}>{visitorData.engagementRate}%</Text>
                <Text style={styles.statLabel}>Engagement Rate</Text>
              </View>
              <View style={styles.statCard}>
                <Smile color="#2196F3" size={24} />
                <Text style={styles.statValue}>{visitorData.satisfactionPrediction}</Text>
                <Text style={styles.statLabel}>AI Satisfaction</Text>
              </View>
              <View style={styles.statCard}>
                <Clock color="#9C27B0" size={24} />
                <Text style={styles.statValue}>{visitorData.returnVisitors}%</Text>
                <Text style={styles.statLabel}>Return Visitors</Text>
              </View>
            </View>
          </View>

          {/* Demographics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demographics (Facial Recognition)</Text>
            <View style={styles.demographicsCard}>
              <View style={styles.demographicsRow}>
                <View style={styles.demographicItem}>
                  <UserCheck color="#2196F3" size={20} />
                  <Text style={styles.demographicValue}>{visitorData.demographics.adults}</Text>
                  <Text style={styles.demographicLabel}>Adults</Text>
                </View>
                <View style={styles.demographicItem}>
                  <Baby color="#FF9800" size={20} />
                  <Text style={styles.demographicValue}>{visitorData.demographics.children}</Text>
                  <Text style={styles.demographicLabel}>Children</Text>
                </View>
              </View>
              
              <Text style={styles.subSectionTitle}>Age Distribution</Text>
              {Object.entries(visitorData.demographics.ageGroups).map(([age, count]) => (
                <View key={age} style={styles.ageRow}>
                  <Text style={styles.ageLabel}>{age} years</Text>
                  <View style={styles.ageBar}>
                    <View 
                      style={[
                        styles.ageProgress, 
                        { width: `${(count / visitorData.totalToday) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.ageValue}>{count}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Emotion Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emotion Analysis (AI Vision)</Text>
            <View style={styles.emotionCard}>
              {Object.entries(visitorData.emotions).map(([emotion, percentage]) => (
                <View key={emotion} style={styles.emotionItem}>
                  <Text style={styles.emotionLabel}>
                    {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  </Text>
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

          {/* Exhibition Popularity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exhibition Performance</Text>
            {exhibitionPopularity.map((exhibition, index) => (
              <View key={index} style={styles.exhibitionCard}>
                <View style={styles.exhibitionHeader}>
                  <Text style={styles.exhibitionName}>{exhibition.name}</Text>
                  <View style={styles.exhibitionStats}>
                    <Text style={styles.exhibitionStat}>{exhibition.visitors} visitors</Text>
                    <Text style={styles.exhibitionStat}>★ {exhibition.satisfaction}</Text>
                  </View>
                </View>
                <View style={styles.exhibitionDetails}>
                  <View style={styles.exhibitionDetail}>
                    <Clock color="#666" size={16} />
                    <Text style={styles.exhibitionDetailText}>Avg. Time: {exhibition.avgTime}</Text>
                  </View>
                  <View style={styles.satisfactionBar}>
                    <View 
                      style={[
                        styles.satisfactionProgress, 
                        { width: `${(exhibition.satisfaction / 5) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Peak Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Peak Hours Today</Text>
            <View style={styles.peakHoursCard}>
              {visitorData.peakHours.map((hour, index) => (
                <View key={index} style={styles.hourItem}>
                  <Text style={styles.hourTime}>{hour.hour}</Text>
                  <View style={styles.hourBar}>
                    <View 
                      style={[
                        styles.hourProgress, 
                        { width: `${(hour.visitors / 240) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.hourVisitors}>{hour.visitors}</Text>
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
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  demographicsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  demographicsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  demographicItem: {
    alignItems: 'center',
    gap: 8,
  },
  demographicValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  demographicLabel: {
    fontSize: 12,
    color: '#666',
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  ageLabel: {
    width: 60,
    fontSize: 12,
    color: '#666',
  },
  ageBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  ageProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  ageValue: {
    width: 40,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
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
  emotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  emotionLabel: {
    width: 70,
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  emotionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  emotionProgress: {
    height: '100%',
    borderRadius: 4,
  },
  emotionValue: {
    width: 35,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
    fontWeight: '600',
  },
  exhibitionCard: {
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
  exhibitionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exhibitionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exhibitionStats: {
    alignItems: 'flex-end',
  },
  exhibitionStat: {
    fontSize: 12,
    color: '#666',
  },
  exhibitionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exhibitionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exhibitionDetailText: {
    fontSize: 12,
    color: '#666',
  },
  satisfactionBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  satisfactionProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
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
  hourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  hourTime: {
    width: 50,
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  hourBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  hourProgress: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  hourVisitors: {
    width: 40,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
    fontWeight: '600',
  },
}); 