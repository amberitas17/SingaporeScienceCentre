import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Atom, Microscope, Telescope, Beaker, Dna, Zap, Globe } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const router = useRouter();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const orbitRotation = useSharedValue(0);

  useEffect(() => {
    // Main logo animation
    logoOpacity.value = withTiming(1, { duration: 1000 });
    
    // Orbital animation
    orbitRotation.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1);
    
    // Atom rotation
    rotation.value = withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1);
    
    // Breathing scale animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ), 
      -1
    );
    
    // Text entrance animation
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 800 });
    }, 500);
    
    // Progress to face verification
    const timer = setTimeout(() => {
      router.replace('/face-verification');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: logoOpacity.value,
  }));

  const atomStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbitRotation.value}deg` }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#FF6B35', '#FF8C42', '#FFB84D']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Main Logo Container */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          {/* Orbital Elements */}
          <Animated.View style={[styles.orbitContainer, orbitStyle]}>
            <View style={styles.orbitElement1}>
              <Beaker color="rgba(255,255,255,0.7)" size={20} />
            </View>
            <View style={styles.orbitElement2}>
              <Dna color="rgba(255,255,255,0.7)" size={20} />
            </View>
            <View style={styles.orbitElement3}>
              <Globe color="rgba(255,255,255,0.7)" size={20} />
            </View>
          </Animated.View>
          
          {/* Central Logo */}
          <View style={styles.logoCircle}>
            <View style={styles.innerCircle}>
              <View style={styles.logoImageContainer}>
                <Image 
                  source={require('../assets/images/logo.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

            </View>
          </View>
          
          {/* Animated Atom Icon */}
          <Animated.View style={[styles.atomIcon, atomStyle]}>
            <Atom color="rgba(255,255,255,0.9)" size={45} />
          </Animated.View>
        </Animated.View>
        
        {/* Title and Description */}
        <Animated.View style={[styles.titleContainer, textStyle]}>
          <Text style={styles.title}>Singapore Science Centre</Text>
          <Text style={styles.subtitle}>Interactive Kiosk System</Text>
          <Text style={styles.tagline}>Where Science Comes Alive</Text>
        </Animated.View>
        
        {/* Science Icons */}
        <Animated.View style={[styles.iconsContainer, textStyle]}>
          <View style={styles.iconWrapper}>
            <Microscope color="rgba(255,255,255,0.8)" size={28} />
            <Text style={styles.iconLabel}>Explore</Text>
          </View>
          <View style={styles.iconWrapper}>
            <Telescope color="rgba(255,255,255,0.8)" size={28} />
            <Text style={styles.iconLabel}>Discover</Text>
          </View>
          <View style={styles.iconWrapper}>
            <Zap color="rgba(255,255,255,0.8)" size={28} />
            <Text style={styles.iconLabel}>Learn</Text>
          </View>
        </Animated.View>
        
        {/* Loading Text */}
        <Animated.View style={[styles.loadingContainer, textStyle]}>
          <Text style={styles.loadingText}>Initializing AI Vision System...</Text>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 50,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitContainer: {
    position: 'absolute',
    width: 180,
    height: 180,
  },
  orbitElement1: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -10,
  },
  orbitElement2: {
    position: 'absolute',
    right: -10,
    top: '50%',
    marginTop: -10,
  },
  orbitElement3: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoImageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoImage: {
    width: 70,
    height: 70,
  },

  atomIcon: {
    position: 'absolute',
    top: -22,
    right: -22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
  },
  iconWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  iconLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});