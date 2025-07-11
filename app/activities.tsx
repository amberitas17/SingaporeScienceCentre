import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  MapPin, 
  Star,
  Zap,
  ChevronRight,
  Calendar,
  Award
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const activities = [
  {
    id: 1,
    title: 'STEM Fiesta Celebrate SG60',
    description: 'Join us for an exciting celebration of Singapore\'s 60th anniversary through hands-on STEM activities and interactive workshops.',
    longDescription: 'Experience the magic of Science, Technology, Engineering, and Mathematics through specially curated activities commemorating Singapore\'s remarkable 60-year journey. Engage in robotics workshops, coding challenges, and engineering marvels.',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '2 hours',
    participants: '4-8 people',
    location: 'Workshop Hall A',
    rating: 4.8,
    price: 'S$25',
    ageGroup: '8+ years',
    highlights: [
      'Robotics Programming',
      'Interactive Coding Games',
      'Engineering Challenges',
      'Science Demonstrations'
    ]
  },
  {
    id: 2,
    title: 'Stargazing Experience',
    description: 'Explore the wonders of the night sky with our guided stargazing sessions using professional telescopes.',
    longDescription: 'Embark on a celestial journey through the cosmos. Our expert astronomers will guide you through constellations, planets, and distant galaxies using state-of-the-art telescopes and interactive star maps.',
    image: 'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '1.5 hours',
    participants: '2-12 people',
    location: 'Observatory Deck',
    rating: 4.9,
    price: 'S$18',
    ageGroup: '6+ years',
    highlights: [
      'Professional Telescopes',
      'Expert Astronomers',
      'Interactive Star Maps',
      'Constellation Stories'
    ]
  },
  {
    id: 3,
    title: 'Science Cafe Nightlife',
    description: 'Adult-friendly science discussions over coffee and light refreshments in our evening sessions.',
    longDescription: 'Unwind with fellow science enthusiasts in our relaxed evening sessions. Discuss the latest scientific discoveries, participate in thought-provoking debates, and enjoy curated science documentaries.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '2.5 hours',
    participants: '6-15 people',
    location: 'Science Cafe',
    rating: 4.7,
    price: 'S$32',
    ageGroup: '18+ years',
    highlights: [
      'Expert Panel Discussions',
      'Science Documentaries',
      'Networking Sessions',
      'Complimentary Refreshments'
    ]
  },
  {
    id: 4,
    title: 'Young Scientist Workshop',
    description: 'Hands-on laboratory experiences designed specifically for young aspiring scientists.',
    longDescription: 'Foster the next generation of scientists through age-appropriate laboratory experiments and scientific method training. Children will conduct real experiments under expert supervision.',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '1.5 hours',
    participants: '3-6 people',
    location: 'Kids Lab',
    rating: 4.6,
    price: 'S$22',
    ageGroup: '5-12 years',
    highlights: [
      'Real Lab Equipment',
      'Safe Experiments',
      'Science Certificates',
      'Take-home Materials'
    ]
  },
  {
    id: 5,
    title: 'Maker Space Innovation',
    description: 'Create, build, and innovate using our fully equipped maker space with 3D printers and tools.',
    longDescription: 'Transform your ideas into reality using cutting-edge technology. Learn 3D modeling, electronics, and rapid prototyping while working on your own creative projects.',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '3 hours',
    participants: '2-8 people',
    location: 'Maker Space',
    rating: 4.8,
    price: 'S$45',
    ageGroup: '12+ years',
    highlights: [
      '3D Printing',
      'Electronics Workshop',
      'Design Thinking',
      'Project Completion'
    ]
  }
];

export default function Activities() {
  const router = useRouter();

  const handleActivityPress = (activity: any) => {
    // Navigate to tickets page with the selected activity
    router.push('/(tabs)/tickets');
  };

  const renderActivityCard = (activity: any) => (
    <TouchableOpacity 
      key={activity.id}
      style={styles.activityCard}
      onPress={() => handleActivityPress(activity)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: activity.image }} style={styles.activityImage} />
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <View style={styles.ratingContainer}>
            <Star color="#FFD700" size={14} fill="#FFD700" />
            <Text style={styles.rating}>{activity.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.activityDetails}>
          <View style={styles.detailItem}>
            <Clock color="#666" size={16} />
            <Text style={styles.detailText}>{activity.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Users color="#666" size={16} />
            <Text style={styles.detailText}>{activity.participants}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin color="#666" size={16} />
            <Text style={styles.detailText}>{activity.location}</Text>
          </View>
        </View>
        
        <View style={styles.highlightsContainer}>
          <Text style={styles.highlightsTitle}>Highlights:</Text>
          <View style={styles.highlightsList}>
            {activity.highlights.slice(0, 2).map((highlight: string, index: number) => (
              <Text key={index} style={styles.highlightItem}>• {highlight}</Text>
            ))}
            {activity.highlights.length > 2 && (
              <Text style={styles.moreHighlights}>+{activity.highlights.length - 2} more</Text>
            )}
          </View>
        </View>
        
        <View style={styles.activityFooter}>
          <View style={styles.ageContainer}>
            <Text style={styles.ageGroup}>Suitable for {activity.ageGroup}</Text>
          </View>
          <View style={styles.learnMoreButton}>
            <Text style={styles.learnMoreButtonText}>Learn More</Text>
            <ChevronRight color="#FF6B35" size={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FFF5F2', '#FFFFFF']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#FF6B35" size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Activities & Workshops</Text>
              <Text style={styles.headerSubtitle}>Hands-on learning experiences</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Available Activities</Text>
          <Text style={styles.sectionDescription}>
            Embark on exciting educational journeys with our carefully curated activities and workshops
          </Text>
          
          {activities.map(renderActivityCard)}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  activityContent: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  activityDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  highlightsContainer: {
    marginBottom: 16,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  highlightsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  highlightItem: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
    marginBottom: 2,
  },
  moreHighlights: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageGroup: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  learnMoreButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 4,
  },
}); 