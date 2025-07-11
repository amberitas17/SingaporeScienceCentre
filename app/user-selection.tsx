import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
} from 'react-native-reanimated';
import { User, Shield, ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function UserSelection() {
  const router = useRouter();

  // Animation values
  const fadeValue = useSharedValue(0);
  const slideValue = useSharedValue(30);

  React.useEffect(() => {
    fadeValue.value = withTiming(1, { duration: 600 });
    slideValue.value = withTiming(0, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ translateY: slideValue.value }],
  }));

  const handleUserSelection = (userType: 'user' | 'admin') => {
    router.push(`/login?type=${userType}`);
  };

  return (
    <LinearGradient
      colors={['#FF6B35', '#FF8C42', '#FFA756']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Singapore Science Centre</Text>
          <Text style={styles.subtitle}>Choose Your Access Level</Text>
        </View>

        {/* Selection Buttons */}
        <Animated.View style={[styles.buttonsContainer, animatedStyle]}>
          {/* Guest User Button */}
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={() => handleUserSelection('user')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF8C42']}
              style={styles.buttonGradient}
            >
              <User color="white" size={32} />
              <Text style={styles.buttonText}>USER LOGIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Administrator Button */}
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => handleUserSelection('admin')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00BCD4', '#0097A7']}
              style={styles.buttonGradient}
            >
              <Shield color="white" size={32} />
              <Text style={styles.buttonText}>ADMINISTRATOR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 20,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 15,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 15,
  },
  buttonsContainer: {
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  guestButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  adminButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 35,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 