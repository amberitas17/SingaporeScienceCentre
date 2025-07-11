import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { 
  Shield, 
  Eye, 
  Users, 
  Activity, 
  TrendingUp, 
  Camera, 
  Brain,
  Settings,
  BarChart3,
  Calendar,
  Bell,
  MapPin,
  Menu,
  LogOut
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');

  // Animation values
  const fadeValue = useSharedValue(0);
  const slideValue = useSharedValue(30);

  useEffect(() => {
    fadeValue.value = withTiming(1, { duration: 800 });
    slideValue.value = withTiming(0, { duration: 800 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ translateY: slideValue.value }],
  }));

  const handleLogout = () => {
    router.replace('/');
  };

  const navigateToAIVision = () => {
    router.push('/ai-vision');
  };

  const navigateToAnalytics = () => {
    router.push('/visitor-analytics');
  };

  const navigateToExhibitions = () => {
    router.push('/exhibition-management');
  };

  const stats = [
    { title: 'Active Visitors', value: '1,247', change: '+12%', icon: Users, color: '#4CAF50' },
    { title: 'AI Detections', value: '3,892', change: '+8%', icon: Camera, color: '#FF9800' },
    { title: 'Engagement Rate', value: '92%', change: '+5%', icon: TrendingUp, color: '#2196F3' },
    { title: 'System Health', value: '99.8%', change: '+0.2%', icon: Activity, color: '#9C27B0' },
  ];

  const quickActions = [
    { title: 'AI Vision System', subtitle: 'Real-time analytics', icon: Brain, action: navigateToAIVision, color: '#00BCD4' },
    { title: 'Visitor Analytics', subtitle: 'Demographics & behavior', icon: BarChart3, action: navigateToAnalytics, color: '#4CAF50' },
    { title: 'System Settings', subtitle: 'Configure parameters', icon: Settings, action: () => {}, color: '#FF9800' },
    { title: 'Exhibition Management', subtitle: 'Reviews & satisfaction', icon: Calendar, action: navigateToExhibitions, color: '#9C27B0' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>Admin Dashboard</Text>
              <Text style={styles.headerSubtitle}>Singapore Science Centre</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell color="#00BCD4" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <LogOut color="#FF5252" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Badge */}
        <View style={styles.adminBadge}>
          <Shield color="#00BCD4" size={16} />
          <Text style={styles.adminBadgeText}>ADMINISTRATOR ACCESS</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Overview</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <stat.icon color={stat.color} size={24} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* AI Vision Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Vision System</Text>
            <TouchableOpacity style={styles.aiVisionCard} onPress={navigateToAIVision}>
              <LinearGradient
                colors={['#00BCD4', '#0097A7']}
                style={styles.aiVisionGradient}
              >
                <View style={styles.aiVisionHeader}>
                  <View style={styles.aiVisionIcon}>
                    <Eye color="white" size={32} />
                  </View>
                  <View style={styles.aiVisionInfo}>
                    <Text style={styles.aiVisionTitle}>AI Vision Active</Text>
                    <Text style={styles.aiVisionSubtitle}>Real-time face detection & analytics</Text>
                  </View>
                  <View style={styles.statusIndicator}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>LIVE</Text>
                  </View>
                </View>
                
                <View style={styles.aiVisionStats}>
                  <View style={styles.aiVisionStat}>
                    <Text style={styles.aiVisionStatValue}>28</Text>
                    <Text style={styles.aiVisionStatLabel}>Faces Detected</Text>
                  </View>
                  <View style={styles.aiVisionStat}>
                    <Text style={styles.aiVisionStatValue}>73%</Text>
                    <Text style={styles.aiVisionStatLabel}>Happy Visitors</Text>
                  </View>
                  <View style={styles.aiVisionStat}>
                    <Text style={styles.aiVisionStatValue}>12</Text>
                    <Text style={styles.aiVisionStatLabel}>Children</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.actionCard}
                  onPress={action.action}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                    <action.icon color={action.color} size={28} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              {[
                { time: '2 mins ago', action: 'New visitor group detected at KidsSTOP', type: 'detection' },
                { time: '5 mins ago', action: 'High engagement at Future Tech exhibition', type: 'engagement' },
                { time: '8 mins ago', action: 'System maintenance completed', type: 'system' },
                { time: '12 mins ago', action: 'Peak hour analysis completed', type: 'analytics' },
              ].map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityDot, 
                    { backgroundColor: 
                      activity.type === 'detection' ? '#4CAF50' :
                      activity.type === 'engagement' ? '#FF9800' :
                      activity.type === 'system' ? '#2196F3' : '#9C27B0'
                    }
                  ]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{activity.action}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 188, 212, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#00BCD4',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 188, 212, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  adminBadgeText: {
    color: '#00BCD4',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 46) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  aiVisionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  aiVisionGradient: {
    padding: 16,
  },
  aiVisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiVisionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiVisionInfo: {
    flex: 1,
  },
  aiVisionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  aiVisionSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusIndicator: {
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  aiVisionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  aiVisionStat: {
    alignItems: 'center',
  },
  aiVisionStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  aiVisionStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: (width - 46) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 1,
  },
  activityTime: {
    fontSize: 11,
    color: '#666',
  },
}); 