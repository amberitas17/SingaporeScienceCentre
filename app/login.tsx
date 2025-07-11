import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { User, Shield, ArrowLeft, Lock, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'user' | 'admin' }>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeValue = useSharedValue(0);
  const slideValue = useSharedValue(20);
  const loadingRotation = useSharedValue(0);

  useEffect(() => {
    fadeValue.value = withTiming(1, { duration: 600 });
    slideValue.value = withTiming(0, { duration: 600 });

    // Pre-fill demo credentials
    setEmail(type === 'admin' ? 'admin@science.sg' : 'guest@science.sg');
    setPassword('demo123');
  }, [type]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
    transform: [{ translateY: slideValue.value }],
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${loadingRotation.value}deg` }],
  }));

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Start loading animation
    loadingRotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );

    // Simulate login process (2.5 seconds)
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate based on user type
      if (type === 'admin') {
        router.replace('/admin-dashboard');
      } else {
        router.replace('/(tabs)');
      }
    }, 2500);
  };

  const isAdmin = type === 'admin';

  return (
    <LinearGradient
      colors={isAdmin ? ['#0F172A', '#1E293B', '#334155'] : ['#FF6B35', '#FF8C42', '#FFA756']}
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
          <View style={[styles.logoCircle, isAdmin && styles.adminLogoCircle]}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Singapore Science Centre</Text>
          <View style={styles.userTypeContainer}>
            {isAdmin ? (
              <Shield color="#00BCD4" size={20} />
            ) : (
              <User color="white" size={20} />
            )}
            <Text style={[styles.userType, isAdmin && styles.adminUserType]}>
              {isAdmin ? 'Administrator Access' : 'Guest Access'}
            </Text>
          </View>
        </View>

        {/* Login Form */}
        <Animated.View style={[styles.formContainer, animatedStyle]}>
          <View style={styles.loginCard}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>
              {isAdmin ? 'Access admin dashboard' : 'Continue your journey'}
            </Text>

            {/* Demo Notice */}
            <View style={styles.demoNotice}>
              <CheckCircle color="#4CAF50" size={16} />
              <Text style={styles.demoText}>Demo credentials pre-filled</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Mail color="#666" size={18} />
              <TextInput
                style={styles.textInput}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Lock color="#666" size={18} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff color="#666" size={18} />
                ) : (
                  <Eye color="#666" size={18} />
                )}
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonLoading]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isAdmin ? ['#00BCD4', '#0097A7'] : ['#FF6B35', '#FF8C42']}
                style={styles.loginGradient}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View style={loadingStyle}>
                      <View style={styles.loadingSpinner} />
                    </Animated.View>
                    <Text style={styles.loginButtonText}>Authenticating...</Text>
                  </View>
                ) : (
                  <>
                    {isAdmin ? (
                      <Shield color="white" size={20} />
                    ) : (
                      <User color="white" size={20} />
                    )}
                    <Text style={styles.loginButtonText}>
                      Continue as {isAdmin ? 'Admin' : 'Guest'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Loading Status */}
            {isLoading && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  Initializing {isAdmin ? 'admin dashboard' : 'user experience'}...
                </Text>
              </View>
            )}
          </View>
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
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginBottom: 12,
  },
  adminLogoCircle: {
    backgroundColor: 'rgba(0, 188, 212, 0.2)',
    borderColor: '#00BCD4',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  adminUserType: {
    color: '#00BCD4',
  },
  formContainer: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 6,
  },
  demoText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 2,
  },
  passwordToggle: {
    padding: 4,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
  },
  loginButtonLoading: {
    opacity: 0.8,
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loadingSpinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 