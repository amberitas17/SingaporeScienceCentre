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
  Award,
  Lightbulb,
  Leaf,
  Flame,
  Microscope,
  Palette,
  Puzzle,
  Shield,
  Sparkles,
  TreePine,
  Waves,
  Wrench,
  Brain,
  Gamepad2,
  Snowflake,
  Zap as Lightning
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Exhibition data based on user's list
const exhibitions = [
  {
    id: 1,
    title: '3D: Printing The Future',
    description: 'Explore the revolutionary world of 3D printing technology and its impact on manufacturing, medicine, and creativity.',
    icon: Wrench,
    color: '#FF6B35',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45 min',
    category: 'Technology',
    rating: 4.7,
    badge: '🔧 Interactive'
  },
  {
    id: 2,
    title: 'Dialogue with Time - Embracing Ageing',
    description: 'Experience aging through interactive simulations and understand the challenges faced by elderly people.',
    icon: Users,
    color: '#4ECDC4',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '60 min',
    category: 'Social Science',
    rating: 4.8,
    badge: '👥 Empathy'
  },
  {
    id: 3,
    title: 'E3: E-mmersive Experiential Environments',
    description: 'Step into virtual worlds with cutting-edge VR technology and immersive digital experiences.',
    icon: Eye,
    color: '#45B7D1',
    image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '30 min',
    category: 'Technology',
    rating: 4.9,
    badge: '🥽 VR Experience'
  },
  {
    id: 4,
    title: 'Earth Alive',
    description: 'Discover our planet\'s incredible biodiversity and ecosystems through interactive displays.',
    icon: Globe,
    color: '#96CEB4',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '50 min',
    category: 'Environment',
    rating: 4.6,
    badge: '🌍 Eco-Friendly'
  },
  {
    id: 5,
    title: 'Ecogarden',
    description: 'Learn about sustainable gardening and environmental conservation in our interactive garden.',
    icon: Leaf,
    color: '#4CAF50',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '40 min',
    category: 'Environment',
    rating: 4.5,
    badge: '🌱 Green Living'
  },
  {
    id: 6,
    title: 'Energy Story',
    description: 'Explore different forms of energy and their impact on our daily lives and the environment.',
    icon: Lightning,
    color: '#FFD700',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '35 min',
    category: 'Physics',
    rating: 4.4,
    badge: '⚡ Energy'
  },
  {
    id: 7,
    title: 'Escape @ Science Centre',
    description: 'Solve scientific puzzles and challenges in this thrilling escape room experience.',
    icon: Puzzle,
    color: '#E74C3C',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '60 min',
    category: 'Interactive',
    rating: 4.7,
    badge: '🧩 Puzzle'
  },
  {
    id: 8,
    title: 'Fire',
    description: 'Witness spectacular fire demonstrations and learn about combustion and chemistry.',
    icon: Flame,
    color: '#FF5722',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '25 min',
    category: 'Chemistry',
    rating: 4.8,
    badge: '🔥 Hot'
  },
  {
    id: 9,
    title: 'Future Makers',
    description: 'Explore emerging technologies and innovations that will shape our future.',
    icon: Lightbulb,
    color: '#9C27B0',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45 min',
    category: 'Technology',
    rating: 4.6,
    badge: '💡 Future Tech'
  },
  {
    id: 10,
    title: 'Going Viral',
    description: 'Learn about viruses, bacteria, and the science behind infectious diseases.',
    icon: Microscope,
    color: '#607D8B',
    image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '40 min',
    category: 'Biology',
    rating: 4.3,
    badge: '🦠 Microbiology'
  },
  {
    id: 11,
    title: 'KidsSTOP™',
    description: 'Interactive learning playground designed specifically for children aged 18 months to 8 years.',
    icon: Sparkles,
    color: '#FF9800',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '90 min',
    category: 'Kids',
    rating: 4.9,
    badge: '🎈 Family Fun'
  },
  {
    id: 12,
    title: 'KidsSTOP™ Academy',
    description: 'Educational programs and workshops designed for young learners.',
    icon: Sparkles,
    color: '#FF9800',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '60 min',
    category: 'Kids',
    rating: 4.7,
    badge: '🎓 Educational'
  },
  {
    id: 13,
    title: 'KidsSTOP™ Activities',
    description: 'Hands-on activities and experiments for children to explore science.',
    icon: Sparkles,
    color: '#FF9800',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45 min',
    category: 'Kids',
    rating: 4.6,
    badge: '🎨 Creative'
  },
  {
    id: 14,
    title: 'KidsSTOP™ School Holiday Programme',
    description: 'Special holiday programs with exciting science activities for kids.',
    icon: Sparkles,
    color: '#FF9800',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '120 min',
    category: 'Kids',
    rating: 4.8,
    badge: '🏖️ Holiday Fun'
  },
  {
    id: 15,
    title: 'KidsSTOP™ TOTally Science (Gone Digital)',
    description: 'Digital science experiences designed for toddlers and young children.',
    icon: Sparkles,
    color: '#FF9800',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '30 min',
    category: 'Kids',
    rating: 4.5,
    badge: '📱 Digital'
  },
  {
    id: 16,
    title: 'Kinetic Garden',
    description: 'Experience the beauty of motion and physics through interactive kinetic sculptures.',
    icon: Waves,
    color: '#3F51B5',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '30 min',
    category: 'Physics',
    rating: 4.5,
    badge: '🌊 Motion'
  },
  {
    id: 17,
    title: 'Know Your Poo',
    description: 'Learn about digestive health and the science behind our bodily functions.',
    icon: Microscope,
    color: '#8BC34A',
    image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '25 min',
    category: 'Biology',
    rating: 4.2,
    badge: '💩 Educational'
  },
  {
    id: 18,
    title: 'Laser Maze Challenge',
    description: 'Navigate through an exciting laser maze using stealth and strategy.',
    icon: Gamepad2,
    color: '#E91E63',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '15 min',
    category: 'Interactive',
    rating: 4.6,
    badge: '🎯 Challenge'
  },
  {
    id: 19,
    title: 'Phobia²: The Science of Fear',
    description: 'Explore the psychology and neuroscience behind fear and phobias.',
    icon: Brain,
    color: '#795548',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '35 min',
    category: 'Psychology',
    rating: 4.4,
    badge: '😨 Thrilling'
  },
  {
    id: 20,
    title: 'Professor Crackitt\'s Light Fantastic Mirror Maze',
    description: 'Navigate through an amazing maze of mirrors and lights in this optical adventure.',
    icon: Palette,
    color: '#E91E63',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '20 min',
    category: 'Physics',
    rating: 4.7,
    badge: '✨ Optical'
  },
  {
    id: 21,
    title: 'Science Play for Preschools',
    description: 'Science activities and play designed specifically for preschool children.',
    icon: Sparkles,
    color: '#FF9800',
    image: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '40 min',
    category: 'Kids',
    rating: 4.4,
    badge: '🧒 Preschool'
  },
  {
    id: 22,
    title: 'Scientist for a Day',
    description: 'Experience life as a scientist through hands-on experiments and research.',
    icon: Beaker,
    color: '#00BCD4',
    image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '120 min',
    category: 'Interactive',
    rating: 4.8,
    badge: '🔬 Research'
  },
  {
    id: 23,
    title: 'Singapore Innovations - From Ideas to Creations',
    description: 'Discover Singapore\'s journey of innovation and technological advancement.',
    icon: Lightbulb,
    color: '#009688',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '50 min',
    category: 'Technology',
    rating: 4.5,
    badge: '🇸🇬 Local Pride'
  },
  {
    id: 24,
    title: 'Snow City Singapore',
    description: 'Experience sub-zero temperatures and snow activities in tropical Singapore.',
    icon: Snowflake,
    color: '#2196F3',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45 min',
    category: 'Interactive',
    rating: 4.6,
    badge: '❄️ Cool'
  },
  {
    id: 25,
    title: 'The Giant Zoetrope',
    description: 'Experience the magic of animation through this giant spinning optical illusion device.',
    icon: Palette,
    color: '#673AB7',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '15 min',
    category: 'Physics',
    rating: 4.3,
    badge: '🎬 Animation'
  },
  {
    id: 26,
    title: 'The Mind\'s Eye',
    description: 'Explore the fascinating world of perception, illusions, and how our brain processes information.',
    icon: Brain,
    color: '#673AB7',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '40 min',
    category: 'Psychology',
    rating: 4.8,
    badge: '🧠 Mind-Bending'
  },
  {
    id: 27,
    title: 'The Tinkering Studio',
    description: 'Hands-on maker space where creativity meets engineering and innovation.',
    icon: Wrench,
    color: '#FF5722',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '60 min',
    category: 'Technology',
    rating: 4.7,
    badge: '🔧 DIY'
  },
  {
    id: 28,
    title: 'Urban Mutations',
    description: 'Explore how cities evolve and adapt to changing environmental and social conditions.',
    icon: Globe,
    color: '#607D8B',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '45 min',
    category: 'Environment',
    rating: 4.4,
    badge: '🏙️ Urban'
  }
];

// Featured exhibitions for carousel
const featuredExhibitions = exhibitions.slice(0, 6);

// Exhibition categories - simplified for small buttons
const exhibitionCategories = [
  { id: 'all', title: 'All', icon: Eye, color: '#FF6B35' },
  { id: 'technology', title: 'Technology', icon: Lightbulb, color: '#4ECDC4' },
  { id: 'kids', title: 'Kids', icon: Sparkles, color: '#FF9800' },
  { id: 'physics', title: 'Physics', icon: Atom, color: '#45B7D1' },
  { id: 'biology', title: 'Biology', icon: Microscope, color: '#4CAF50' },
  { id: 'environment', title: 'Environment', icon: Globe, color: '#96CEB4' },
  { id: 'interactive', title: 'Interactive', icon: Gamepad2, color: '#E74C3C' },
  { id: 'psychology', title: 'Psychology', icon: Brain, color: '#9C27B0' },
  { id: 'chemistry', title: 'Chemistry', icon: Beaker, color: '#FF5722' }
];

export default function Dashboard() {
  const router = useRouter();
  const [currentExhibition, setCurrentExhibition] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
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
        // Change to next exhibition
        setCurrentExhibition((prev) => (prev + 1) % featuredExhibitions.length);
        
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
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim, scaleAnim]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleExhibitionPress = (exhibition: any) => {
    router.push('/(tabs)/tickets');
  };

  const getFilteredExhibitions = () => {
    if (selectedCategory === 'all') {
      return exhibitions;
    }
    return exhibitions.filter(ex => ex.category.toLowerCase() === selectedCategory);
  };

  const renderCategoryButton = (category: any) => {
    const isSelected = selectedCategory === category.id;
    const IconComponent = category.icon;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryButton,
          isSelected && styles.categoryButtonSelected,
          { borderColor: category.color }
        ]}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.7}
      >
        <IconComponent 
          color={isSelected ? 'white' : category.color} 
          size={16} 
        />
        <Text style={[
          styles.categoryButtonText,
          isSelected && styles.categoryButtonTextSelected,
          { color: isSelected ? 'white' : category.color }
        ]}>
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderExhibitionCard = (exhibition: any) => {
    const IconComponent = exhibition.icon;
    
    return (
      <TouchableOpacity
        key={exhibition.id}
        style={styles.exhibitionCard}
        onPress={() => handleExhibitionPress(exhibition)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: exhibition.image }} style={styles.exhibitionImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.exhibitionOverlay}
        >
          <View style={styles.exhibitionContent}>
            <View style={styles.exhibitionHeader}>
              <Text style={styles.exhibitionBadge}>{exhibition.badge}</Text>
              <View style={styles.exhibitionRating}>
                <Star color="#FFD700" size={12} fill="#FFD700" />
                <Text style={styles.exhibitionRatingText}>{exhibition.rating}</Text>
              </View>
            </View>
            <Text style={styles.exhibitionTitle} numberOfLines={2}>{exhibition.title}</Text>
            <View style={styles.exhibitionFooter}>
              <View style={styles.exhibitionInfo}>
                <Clock color="#4ECDC4" size={12} />
                <Text style={styles.exhibitionInfoText}>{exhibition.duration}</Text>
              </View>
              <IconComponent color={exhibition.color} size={16} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCarousel = () => {
    const exhibition = featuredExhibitions[currentExhibition];
    
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
            onPress={() => handleExhibitionPress(exhibition)}
            activeOpacity={0.9}
            style={styles.carouselTouchable}
          >
            <Image source={{ uri: exhibition.image }} style={styles.carouselImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
              style={styles.carouselOverlay}
            >
              <View style={styles.carouselContent}>
                <View style={styles.carouselHeader}>
                  <Text style={styles.carouselBadge}>{exhibition.badge}</Text>
                  <View style={styles.carouselRating}>
                    <Star color="#FFD700" size={16} fill="#FFD700" />
                    <Text style={styles.carouselRatingText}>{exhibition.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.carouselTitle}>{exhibition.title}</Text>
                <Text style={styles.carouselDescription}>{exhibition.description}</Text>
                
                <View style={styles.carouselFooter}>
                  <View style={styles.carouselInfo}>
                    <View style={styles.carouselInfoItem}>
                      <MapPin color="#FF6B35" size={14} />
                      <Text style={styles.carouselInfoText}>{exhibition.category}</Text>
                    </View>
                    <View style={styles.carouselInfoItem}>
                      <Clock color="#4ECDC4" size={14} />
                      <Text style={styles.carouselInfoText}>{exhibition.duration}</Text>
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
          {featuredExhibitions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.carouselIndicator,
                index === currentExhibition && styles.carouselIndicatorActive
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
              <Text style={styles.headerSubtitle}>Discover Amazing Exhibitions</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Featured Exhibitions Carousel */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Exhibitions</Text>
            <Text style={styles.sectionSubtitle}>Discover our most popular exhibitions</Text>
          </View>
          {renderFeaturedCarousel()}
        </View>

        {/* Exhibition Categories - Small Buttons */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScrollView}
            contentContainerStyle={styles.categoriesContainer}
          >
            {exhibitionCategories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* Exhibitions Grid */}
        <View style={styles.exhibitionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Exhibitions' : `${exhibitionCategories.find(c => c.id === selectedCategory)?.title} Exhibitions`}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {getFilteredExhibitions().length} exhibition{getFilteredExhibitions().length !== 1 ? 's' : ''} available
            </Text>
          </View>
          <View style={styles.exhibitionsGrid}>
            {getFilteredExhibitions().map(renderExhibitionCard)}
          </View>
        </View>

        {/* Exhibition Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Our Exhibitions</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#FF6B35', '#FF8C42']}
                style={styles.statIconContainer}
              >
                <Eye color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>{exhibitions.length}</Text>
              <Text style={styles.statLabel}>Exhibitions</Text>
            </View>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#4ECDC4', '#45B7D1']}
                style={styles.statIconContainer}
              >
                <Users color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>{exhibitionCategories.length - 1}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#96CEB4', '#4ECDC4']}
                style={styles.statIconContainer}
              >
                <Clock color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>15-120</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <LinearGradient
                colors={['#FFD700', '#FFA756']}
                style={styles.statIconContainer}
              >
                <Star color="white" size={18} />
              </LinearGradient>
              <Text style={styles.statNumber}>4.6</Text>
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
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  featuredSection: {
    paddingVertical: 25,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  carouselContainer: {
    alignItems: 'center',
  },
  carouselCard: {
    width: width - 48,
    height: 250,
    borderRadius: 20,
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
  categoriesSection: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  categoriesScrollView: {
    flexGrow: 0,
  },
  categoriesContainer: {
    gap: 10,
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'white',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryButtonSelected: {
    backgroundColor: '#FF6B35',
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryButtonTextSelected: {
    color: 'white',
  },
  exhibitionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  exhibitionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  exhibitionCard: {
    width: (width - 55) / 2,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 5,
  },
  exhibitionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  exhibitionOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  exhibitionContent: {
    padding: 12,
  },
  exhibitionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exhibitionBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FF6B35',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  exhibitionRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  exhibitionRatingText: {
    fontSize: 10,
    color: '#2C3E50',
    fontWeight: '700',
  },
  exhibitionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  exhibitionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exhibitionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exhibitionInfoText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
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