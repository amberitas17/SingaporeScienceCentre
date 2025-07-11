import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { 
  Zap, 
  Eye, 
  Telescope, 
  Beaker,
  Globe,
  Atom,
  ChevronRight,
  Users,
  Clock,
  Star,
  Calendar,
  MapPin,
  Award
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const categories = [
  {
    id: 1,
    title: 'Activities & Workshops',
    description: 'Embark on an exciting exploration through activities suitable for all.',
    icon: Zap,
    color: '#FF6B35',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      'STEM Fiesta Celebrate SG60',
      'Stargazing Experience',
      'Science Cafe Nightlife'
    ]
  },
  {
    id: 2,
    title: 'Exhibitions',
    description: 'From mesmerising mirrors to tornadoes - we have it all!',
    icon: Eye,
    color: '#4ECDC4',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      'Climate Changed',
      'Dialogue with Time',
      'E3 Virtual Reality',
      'Earth Alive'
    ]
  },
  {
    id: 3,
    title: 'Omni-Theatre',
    description: 'Watch digital movies and live planetarium shows.',
    icon: Telescope,
    color: '#45B7D1',
    image: 'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      'KITZ: Secrets of Space Station',
      'Star Dreaming',
      'Animal Kingdom',
      'Cities of the Future'
    ]
  },
  {
    id: 4,
    title: 'Science Shows',
    description: 'Come and see us demonstrate fire tornadoes and more.',
    icon: Beaker,
    color: '#96CEB4',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    items: [
      'Fire Tornado Demonstration',
      'Chemistry Magic Show',
      'Physics Spectacular'
    ]
  }
];

const featuredExperiences = [
  {
    id: 1,
    title: 'Climate Changed',
    description: 'Learn about climate impact and environmental action through interactive displays',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Exhibition',
    duration: '45 min',
    rating: 4.8,
    badge: '🌍 Trending'
  },
  {
    id: 2,
    title: 'KITZ Space Station',
    description: 'Immersive space exploration experience with cutting-edge technology',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Omni-Theatre',
    duration: '30 min',
    rating: 4.9,
    badge: '🚀 New'
  },
  {
    id: 3,
    title: 'Fire Tornado Lab',
    description: 'Witness the power of science with spectacular fire tornado demonstrations',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Science Show',
    duration: '25 min',
    rating: 4.7,
    badge: '🔥 Popular'
  },
  {
    id: 4,
    title: 'Earth Alive',
    description: 'Explore our planet\'s ecosystems and biodiversity in stunning detail',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Exhibition',
    duration: '60 min',
    rating: 4.8,
    badge: '🌱 Featured'
  },
  {
    id: 5,
    title: 'Virtual Reality Journey',
    description: 'Step into different worlds with our state-of-the-art VR experiences',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Technology',
    duration: '20 min',
    rating: 4.9,
    badge: '🥽 Immersive'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [currentExperience, setCurrentExperience] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change to next experience
        setCurrentExperience((prev) => (prev + 1) % featuredExperiences.length);
        
        // Fade in animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim, scaleAnim]);

  const handleCategoryPress = (category: any) => {
    // Navigate to specific category page
    switch (category.id) {
      case 1:
        router.push('/activities');
        break;
      case 2:
        router.push('/exhibitions');
        break;
      case 3:
        router.push('/omni-theatre');
        break;
      case 4:
        router.push('/science-shows');
        break;
      default:
        router.push('/(tabs)/tickets');
    }
  };

  const handleExperiencePress = (experience: any) => {
    // Navigate to tickets page when experience is selected
    router.push('/(tabs)/tickets');
  };

  const renderCategoryCard = (category: any) => {
    return (
      <TouchableOpacity 
        key={category.id} 
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(category)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: category.image }} style={styles.categoryImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.categoryOverlay}
        >
          <View style={styles.categoryContent}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            <View style={styles.categoryItems}>
              {category.items.slice(0, 2).map((item: string, index: number) => (
                <Text key={index} style={styles.categoryItem}>• {item}</Text>
              ))}
              {category.items.length > 2 && (
                <Text style={styles.categoryMore}>+{category.items.length - 2} more</Text>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCarousel = () => {
    const experience = featuredExperiences[currentExperience];
    
    return (
      <View style={styles.carouselContainer}>
        <Animated.View 
          style={[
            styles.carouselCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
    <TouchableOpacity 
      onPress={() => handleExperiencePress(experience)}
      activeOpacity={0.9}
            style={styles.carouselTouchable}
    >
            <Image source={{ uri: experience.image }} style={styles.carouselImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
              style={styles.carouselOverlay}
            >
              <View style={styles.carouselContent}>
                <View style={styles.carouselHeader}>
                  <Text style={styles.carouselBadge}>{experience.badge}</Text>
                  <View style={styles.carouselRating}>
                    <Star color="#FFD700" size={16} fill="#FFD700" />
                    <Text style={styles.carouselRatingText}>{experience.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.carouselTitle}>{experience.title}</Text>
                <Text style={styles.carouselDescription}>{experience.description}</Text>
                
                <View style={styles.carouselFooter}>
                  <View style={styles.carouselInfo}>
                    <View style={styles.carouselInfoItem}>
                      <MapPin color="#FF6B35" size={14} />
                      <Text style={styles.carouselInfoText}>{experience.category}</Text>
                    </View>
                    <View style={styles.carouselInfoItem}>
                      <Clock color="#4ECDC4" size={14} />
                      <Text style={styles.carouselInfoText}>{experience.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.carouselAction}>
                    <Text style={styles.carouselActionText}>Explore</Text>
                    <ChevronRight color="#FF6B35" size={18} />
          </View>
        </View>
          </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Carousel Indicators */}
        <View style={styles.carouselIndicators}>
          {featuredExperiences.map((_, index) => (
            <View
              key={index}
              style={[
                styles.carouselIndicator,
                index === currentExperience && styles.carouselIndicatorActive
              ]}
            />
          ))}
        </View>
      </View>
  );
  };

  return (
    <LinearGradient
      colors={['#FAFAFA', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Clean and Elegant Header */}
        <LinearGradient
          colors={['#FF6B35', '#FF8C42']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Singapore Science Centre</Text>
              <Text style={styles.headerSubtitle}>Explore • Discover • Learn • Experience</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Featured Experiences Carousel */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Experiences</Text>
            <Text style={styles.sectionSubtitle}>Discover our most popular attractions</Text>
          </View>
          {renderFeaturedCarousel()}
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Our Attractions</Text>
            <Text style={styles.sectionSubtitle}>Choose your adventure</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map(renderCategoryCard)}
          </View>
        </View>

        {/* Compact Mobile Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Why Visit Us?</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#FF6B35', '#FF8C42']}
                style={styles.statIconContainer}
              >
                <Atom color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Exhibitions</Text>
            </View>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#4ECDC4', '#45B7D1']}
                style={styles.statIconContainer}
              >
                <Beaker color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>100+</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#96CEB4', '#4ECDC4']}
                style={styles.statIconContainer}
              >
                <Globe color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>1M+</Text>
              <Text style={styles.statLabel}>Visitors</Text>
            </View>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#FFD700', '#FFA756']}
                style={styles.statIconContainer}
              >
                <Award color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  featuredSection: {
    paddingVertical: 35,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 25,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  carouselContainer: {
    alignItems: 'center',
  },
  carouselCard: {
    width: width - 48,
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 20,
  },
  carouselTouchable: {
    flex: 1,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  carouselOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  carouselContent: {
    padding: 24,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  carouselBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B35',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  carouselRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  carouselRatingText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '700',
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  carouselDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
    marginBottom: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  carouselFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carouselInfo: {
    flexDirection: 'row',
    gap: 18,
  },
  carouselInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  carouselInfoText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  carouselAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  carouselActionText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '700',
  },
  carouselIndicators: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  carouselIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
  },
  carouselIndicatorActive: {
    backgroundColor: '#FF6B35',
    width: 28,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    paddingBottom: 35,
  },
  categoriesGrid: {
    gap: 18,
  },
  categoryCard: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryContent: {
    padding: 24,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryItems: {
    gap: 4,
  },
  categoryItem: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  categoryMore: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    width: '47%',
    paddingVertical: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});