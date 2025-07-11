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
  Eye,
  ChevronRight,
  Info,
  Zap
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const exhibitions = [
  {
    id: 1,
    title: 'Climate Changed',
    description: 'Discover how climate change affects our planet and explore sustainable solutions for the future.',
    longDescription: 'An immersive exhibition exploring the science behind climate change, its global impacts, and innovative solutions. Interactive displays show real-time climate data and future projections.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45 minutes',
    participants: 'Up to 30 people',
    location: 'Gallery 1',
    rating: 4.8,
    price: 'S$15',
    ageGroup: '8+ years',
    highlights: [
      'Real-time Climate Data',
      'Interactive Simulations',
      'Sustainable Technology',
      'Future Projections'
    ]
  },
  {
    id: 2,
    title: 'Dialogue with Time',
    description: 'Journey through the evolution of timekeeping and explore the concept of time across cultures.',
    longDescription: 'Experience the fascinating history of how humans have measured and understood time. From ancient sundials to atomic clocks, discover the science and cultural significance of time.',
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '40 minutes',
    participants: 'Up to 25 people',
    location: 'Gallery 2',
    rating: 4.7,
    price: 'S$12',
    ageGroup: '6+ years',
    highlights: [
      'Ancient Timepieces',
      'Cultural Perspectives',
      'Scientific Precision',
      'Interactive Timeline'
    ]
  },
  {
    id: 3,
    title: 'E3 Virtual Reality',
    description: 'Step into virtual worlds and experience cutting-edge VR technology across various scientific fields.',
    longDescription: 'Immerse yourself in virtual reality experiences that take you inside the human body, to distant planets, and through molecular structures. State-of-the-art VR equipment provides unprecedented educational experiences.',
    image: 'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '30 minutes',
    participants: '4-8 people',
    location: 'VR Lab',
    rating: 4.9,
    price: 'S$20',
    ageGroup: '10+ years',
    highlights: [
      'Space Exploration',
      'Human Anatomy',
      'Molecular Structures',
      'Deep Ocean Dive'
    ]
  },
  {
    id: 4,
    title: 'Earth Alive',
    description: 'Explore our living planet through interactive displays showcasing biodiversity and ecosystems.',
    longDescription: 'Discover the incredible diversity of life on Earth through interactive exhibits featuring live specimens, ecosystem dioramas, and conservation success stories.',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '50 minutes',
    participants: 'Up to 35 people',
    location: 'Gallery 3',
    rating: 4.6,
    price: 'S$18',
    ageGroup: '5+ years',
    highlights: [
      'Live Specimens',
      'Ecosystem Dioramas',
      'Conservation Stories',
      'Biodiversity Focus'
    ]
  },
  {
    id: 5,
    title: 'Future Tech',
    description: 'Experience tomorrow\'s technology today with AI, robotics, and emerging innovations.',
    longDescription: 'Get hands-on with artificial intelligence, robotics, and emerging technologies shaping our future. Interactive demonstrations show how these technologies work and their potential applications.',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '55 minutes',
    participants: 'Up to 20 people',
    location: 'Tech Gallery',
    rating: 4.8,
    price: 'S$25',
    ageGroup: '12+ years',
    highlights: [
      'AI Demonstrations',
      'Robotics Workshop',
      'Emerging Tech',
      'Future Applications'
    ]
  }
];

export default function Exhibitions() {
  const router = useRouter();

  const handleExhibitionPress = (exhibition: any) => {
    router.push('/(tabs)/tickets');
  };

  const renderExhibitionCard = (exhibition: any) => (
    <TouchableOpacity 
      key={exhibition.id}
      style={styles.exhibitionCard}
      onPress={() => handleExhibitionPress(exhibition)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: exhibition.image }} style={styles.exhibitionImage} />
      <View style={styles.exhibitionContent}>
        <View style={styles.exhibitionHeader}>
          <Text style={styles.exhibitionTitle}>{exhibition.title}</Text>
          <View style={styles.ratingContainer}>
            <Star color="#FFD700" size={14} fill="#FFD700" />
            <Text style={styles.rating}>{exhibition.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.exhibitionDescription}>{exhibition.description}</Text>
        
        <View style={styles.exhibitionDetails}>
          <View style={styles.detailItem}>
            <Clock color="#666" size={16} />
            <Text style={styles.detailText}>{exhibition.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Users color="#666" size={16} />
            <Text style={styles.detailText}>{exhibition.participants}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin color="#666" size={16} />
            <Text style={styles.detailText}>{exhibition.location}</Text>
          </View>
        </View>
        
        <View style={styles.highlightsContainer}>
          <Text style={styles.highlightsTitle}>Featured:</Text>
          <View style={styles.highlightsList}>
            {exhibition.highlights.slice(0, 2).map((highlight: string, index: number) => (
              <Text key={index} style={styles.highlightItem}>• {highlight}</Text>
            ))}
            {exhibition.highlights.length > 2 && (
              <Text style={styles.moreHighlights}>+{exhibition.highlights.length - 2} more</Text>
            )}
          </View>
        </View>
        
        <View style={styles.exhibitionFooter}>
          <View style={styles.ageContainer}>
            <Text style={styles.ageGroup}>Suitable for {exhibition.ageGroup}</Text>
          </View>
          <View style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore</Text>
            <ChevronRight color="#4ECDC4" size={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#F0FDFC', '#FFFFFF']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#4ECDC4" size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Exhibitions</Text>
              <Text style={styles.headerSubtitle}>Immersive learning experiences</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Current Exhibitions</Text>
          <Text style={styles.sectionDescription}>
            From mesmerising mirrors to tornadoes - we have it all! Explore our interactive exhibitions.
          </Text>
          
          {exhibitions.map(renderExhibitionCard)}
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
  exhibitionCard: {
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
  exhibitionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  exhibitionContent: {
    padding: 16,
  },
  exhibitionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exhibitionTitle: {
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
  exhibitionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  exhibitionDetails: {
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
    color: '#4ECDC4',
    fontWeight: '600',
  },
  exhibitionFooter: {
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
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  exploreButtonText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
    marginRight: 4,
  },
}); 