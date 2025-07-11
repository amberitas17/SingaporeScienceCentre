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
  Telescope,
  ChevronRight,
  Play,
  Film
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const shows = [
  {
    id: 1,
    title: 'KITZ: Secrets of Space Station',
    description: 'Journey to the International Space Station and discover the secrets of life in space.',
    longDescription: 'Experience life aboard the International Space Station through stunning 360-degree visuals. Learn about scientific experiments, daily life in zero gravity, and the challenges of space exploration.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '30 minutes',
    participants: 'Up to 80 people',
    location: 'Omni Theatre',
    rating: 4.9,
    price: 'S$12',
    ageGroup: '6+ years',
    showTimes: ['10:00 AM', '1:00 PM', '3:30 PM', '6:00 PM'],
    highlights: [
      '360° Space Views',
      'Zero Gravity Experience',
      'Scientific Experiments',
      'Astronaut Interviews'
    ]
  },
  {
    id: 2,
    title: 'Star Dreaming',
    description: 'Explore ancient stories written in the stars and modern astronomical discoveries.',
    longDescription: 'Journey through the cosmos as we explore both ancient star myths and cutting-edge astronomical discoveries. Experience the beauty of stellar formations and learn about the latest space missions.',
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '35 minutes',
    participants: 'Up to 80 people',
    location: 'Omni Theatre',
    rating: 4.7,
    price: 'S$12',
    ageGroup: '8+ years',
    showTimes: ['11:00 AM', '2:00 PM', '4:30 PM', '7:00 PM'],
    highlights: [
      'Ancient Star Myths',
      'Modern Discoveries',
      'Stellar Formations',
      'Space Missions'
    ]
  },
  {
    id: 3,
    title: 'Animal Kingdom',
    description: 'Discover the incredible diversity of life on Earth through breathtaking wildlife footage.',
    longDescription: 'Immerse yourself in the natural world with stunning wildlife cinematography. From the deepest oceans to the highest mountains, witness the incredible diversity of animal life on our planet.',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '40 minutes',
    participants: 'Up to 80 people',
    location: 'Omni Theatre',
    rating: 4.8,
    price: 'S$12',
    ageGroup: '4+ years',
    showTimes: ['10:30 AM', '1:30 PM', '4:00 PM', '6:30 PM'],
    highlights: [
      'Wildlife Cinematography',
      'Ecosystem Diversity',
      'Conservation Stories',
      'Animal Behavior'
    ]
  },
  {
    id: 4,
    title: 'Cities of the Future',
    description: 'Explore how technology and innovation are shaping the urban landscapes of tomorrow.',
    longDescription: 'Discover how cities are evolving to meet the challenges of the 21st century. Explore sustainable architecture, smart transportation systems, and innovative urban planning solutions.',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '32 minutes',
    participants: 'Up to 80 people',
    location: 'Omni Theatre',
    rating: 4.6,
    price: 'S$12',
    ageGroup: '10+ years',
    showTimes: ['12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM'],
    highlights: [
      'Smart Cities',
      'Sustainable Architecture',
      'Urban Innovation',
      'Future Technologies'
    ]
  },
  {
    id: 5,
    title: 'Ocean Mysteries',
    description: 'Dive into the depths of our oceans and discover the mysteries that lie beneath.',
    longDescription: 'Explore the hidden world beneath the waves with cutting-edge underwater cinematography. Discover new species, underwater volcanic activity, and the importance of ocean conservation.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '38 minutes',
    participants: 'Up to 80 people',
    location: 'Omni Theatre',
    rating: 4.7,
    price: 'S$12',
    ageGroup: '6+ years',
    showTimes: ['11:30 AM', '3:00 PM', '5:30 PM', '8:00 PM'],
    highlights: [
      'Deep Sea Exploration',
      'Marine Life',
      'Ocean Conservation',
      'Underwater Volcanoes'
    ]
  }
];

export default function OmniTheatre() {
  const router = useRouter();

  const handleShowPress = (show: any) => {
    router.push('/(tabs)/tickets');
  };

  const renderShowCard = (show: any) => (
    <TouchableOpacity 
      key={show.id}
      style={styles.showCard}
      onPress={() => handleShowPress(show)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: show.image }} style={styles.showImage} />
      <View style={styles.playOverlay}>
        <Play color="white" size={40} fill="rgba(255,255,255,0.9)" />
      </View>
      <View style={styles.showContent}>
        <View style={styles.showHeader}>
          <Text style={styles.showTitle}>{show.title}</Text>
          <View style={styles.ratingContainer}>
            <Star color="#FFD700" size={14} fill="#FFD700" />
            <Text style={styles.rating}>{show.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.showDescription}>{show.description}</Text>
        
        <View style={styles.showDetails}>
          <View style={styles.detailItem}>
            <Clock color="#666" size={16} />
            <Text style={styles.detailText}>{show.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Users color="#666" size={16} />
            <Text style={styles.detailText}>{show.participants}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin color="#666" size={16} />
            <Text style={styles.detailText}>{show.location}</Text>
          </View>
        </View>
        
        <View style={styles.showTimesContainer}>
          <Text style={styles.showTimesTitle}>Show Times:</Text>
          <View style={styles.showTimesList}>
            {show.showTimes.slice(0, 3).map((time: string, index: number) => (
              <Text key={index} style={styles.showTime}>{time}</Text>
            ))}
            {show.showTimes.length > 3 && (
              <Text style={styles.moreShowTimes}>+{show.showTimes.length - 3} more</Text>
            )}
          </View>
        </View>
        
        <View style={styles.highlightsContainer}>
          <Text style={styles.highlightsTitle}>Features:</Text>
          <View style={styles.highlightsList}>
            {show.highlights.slice(0, 2).map((highlight: string, index: number) => (
              <Text key={index} style={styles.highlightItem}>• {highlight}</Text>
            ))}
            {show.highlights.length > 2 && (
              <Text style={styles.moreHighlights}>+{show.highlights.length - 2} more</Text>
            )}
          </View>
        </View>
        
        <View style={styles.showFooter}>
          <View style={styles.ageContainer}>
            <Text style={styles.ageGroup}>Suitable for {show.ageGroup}</Text>
          </View>
          <View style={styles.viewButton}>
            <Film color="#45B7D1" size={16} />
            <Text style={styles.viewButtonText}>View Details</Text>
            <ChevronRight color="#45B7D1" size={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#F0F9FF', '#FFFFFF']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#45B7D1" size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Omni-Theatre</Text>
              <Text style={styles.headerSubtitle}>360° digital movies & planetarium shows</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Now Showing</Text>
          <Text style={styles.sectionDescription}>
            Watch digital movies and live planetarium shows in our immersive 360° dome theatre.
          </Text>
          
          {shows.map(renderShowCard)}
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
  showCard: {
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
  showImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 80,
    left: '50%',
    marginLeft: -20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    padding: 10,
  },
  showContent: {
    padding: 16,
  },
  showHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  showTitle: {
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
  showDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  showDetails: {
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
  showTimesContainer: {
    marginBottom: 12,
  },
  showTimesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  showTimesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  showTime: {
    fontSize: 12,
    color: '#45B7D1',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  moreShowTimes: {
    fontSize: 12,
    color: '#45B7D1',
    fontWeight: '600',
    paddingVertical: 4,
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
    color: '#45B7D1',
    fontWeight: '600',
  },
  showFooter: {
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
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#45B7D1',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#45B7D1',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 4,
  },
}); 