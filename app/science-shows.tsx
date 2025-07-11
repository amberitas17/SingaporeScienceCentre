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
  Beaker,
  ChevronRight,
  Zap,
  Flame
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const scienceShows = [
  {
    id: 1,
    title: 'Fire Tornado Demonstration',
    description: 'Witness the incredible power of fire tornadoes in a safe, controlled environment.',
    longDescription: 'Experience the mesmerizing sight of fire tornadoes created through scientific principles. Learn about combustion, air pressure, and fluid dynamics while watching spectacular demonstrations.',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '25 minutes',
    participants: 'Up to 40 people',
    location: 'Main Theatre',
    rating: 4.9,
    price: 'S$8',
    ageGroup: '8+ years',
    showTimes: ['11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'],
    highlights: [
      'Fire Tornado Creation',
      'Combustion Science',
      'Safety Demonstrations',
      'Interactive Q&A'
    ]
  },
  {
    id: 2,
    title: 'Chemistry Magic Show',
    description: 'Amazing chemical reactions that look like magic but are pure science.',
    longDescription: 'Discover the wonder of chemistry through spectacular reactions and color-changing experiments. Learn about acids, bases, polymers, and catalysts through engaging demonstrations.',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '30 minutes',
    participants: 'Up to 40 people',
    location: 'Main Theatre',
    rating: 4.8,
    price: 'S$8',
    ageGroup: '6+ years',
    showTimes: ['10:30 AM', '1:30 PM', '3:30 PM', '5:30 PM'],
    highlights: [
      'Color-Changing Reactions',
      'Polymer Science',
      'Acid-Base Indicators',
      'Catalyst Demonstrations'
    ]
  },
  {
    id: 3,
    title: 'Physics Spectacular',
    description: 'Mind-bending physics demonstrations that defy expectations and amaze audiences.',
    longDescription: 'Explore the fundamental laws of physics through spectacular demonstrations. From electromagnetic forces to wave mechanics, experience physics like never before.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '35 minutes',
    participants: 'Up to 40 people',
    location: 'Main Theatre',
    rating: 4.7,
    price: 'S$8',
    ageGroup: '10+ years',
    showTimes: ['12:00 PM', '2:30 PM', '4:30 PM', '6:30 PM'],
    highlights: [
      'Electromagnetic Forces',
      'Wave Mechanics',
      'Gravity Demonstrations',
      'Energy Transformations'
    ]
  },
  {
    id: 4,
    title: 'Liquid Nitrogen Wonders',
    description: 'Explore the fascinating properties of matter at extremely low temperatures.',
    longDescription: 'Discover what happens when materials are cooled to -196°C using liquid nitrogen. Watch flowers shatter, balloons shrink, and metals become superconductors.',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '25 minutes',
    participants: 'Up to 40 people',
    location: 'Main Theatre',
    rating: 4.8,
    price: 'S$8',
    ageGroup: '8+ years',
    showTimes: ['11:30 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
    highlights: [
      'Extreme Cold Effects',
      'State Changes',
      'Superconductivity',
      'Material Properties'
    ]
  },
  {
    id: 5,
    title: 'Electricity & Magnetism',
    description: 'Spectacular demonstrations of electrical and magnetic phenomena.',
    longDescription: 'Experience the power of electricity and magnetism through Tesla coils, Van de Graaff generators, and magnetic levitation. Learn about electromagnetic induction and electrical safety.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '30 minutes',
    participants: 'Up to 40 people',
    location: 'Main Theatre',
    rating: 4.6,
    price: 'S$8',
    ageGroup: '7+ years',
    showTimes: ['10:00 AM', '12:30 PM', '2:30 PM', '4:30 PM'],
    highlights: [
      'Tesla Coil Demonstrations',
      'Magnetic Levitation',
      'Static Electricity',
      'Electromagnetic Induction'
    ]
  }
];

export default function ScienceShows() {
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
      <View style={styles.liveOverlay}>
        <Zap color="white" size={16} />
        <Text style={styles.liveText}>LIVE</Text>
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
          <Text style={styles.highlightsTitle}>Demonstrations:</Text>
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
          <View style={styles.detailsButton}>
            <Flame color="#96CEB4" size={16} />
            <Text style={styles.detailsButtonText}>Details</Text>
            <ChevronRight color="#96CEB4" size={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#F0FDF4', '#FFFFFF']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#96CEB4" size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Science Shows</Text>
              <Text style={styles.headerSubtitle}>Live demonstrations & experiments</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Live Science Shows</Text>
          <Text style={styles.sectionDescription}>
            Come and see us demonstrate fire tornadoes and more amazing scientific phenomena.
          </Text>
          
          {scienceShows.map(renderShowCard)}
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
  liveOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
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
    color: '#96CEB4',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  moreShowTimes: {
    fontSize: 12,
    color: '#96CEB4',
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
    color: '#96CEB4',
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
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#96CEB4',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#96CEB4',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 4,
  },
}); 