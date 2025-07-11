import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, Settings, CircleHelp as HelpCircle, Phone, Mail, MapPin, Clock, Star, ChevronRight, Shield, Bell, CreditCard, LogOut } from 'lucide-react-native';

const profileOptions = [
  {
    id: 1,
    title: 'Account Settings',
    description: 'Manage your account preferences',
    icon: Settings,
    color: '#FF6B35',
  },
  {
    id: 2,
    title: 'Notifications',
    description: 'Configure your notification preferences',
    icon: Bell,
    color: '#4ECDC4',
  },
  {
    id: 3,
    title: 'Payment Methods',
    description: 'Manage your payment information',
    icon: CreditCard,
    color: '#45B7D1',
  },
  {
    id: 4,
    title: 'Privacy & Security',
    description: 'Control your privacy settings',
    icon: Shield,
    color: '#96CEB4',
  },
  {
    id: 5,
    title: 'Help & Support',
    description: 'Get help and contact support',
    icon: HelpCircle,
    color: '#FFB84D',
  },
];

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '+65 6425 2500',
    color: '#FF6B35',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'enquiry@science.edu.sg',
    color: '#4ECDC4',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: '15 Science Centre Road, Singapore 609081',
    color: '#45B7D1',
  },
  {
    icon: Clock,
    title: 'Operating Hours',
    value: 'Daily 10:00 AM - 6:00 PM',
    color: '#96CEB4',
  },
];

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    // Navigate back to user selection/login screen
    router.replace('/user-selection');
  };

  return (
    <LinearGradient
      colors={['#FFF5F2', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#FF6B35', '#FF8C42']}
            style={styles.profileIcon}
          >
            <User color="white" size={40} />
          </LinearGradient>
          <Text style={styles.headerTitle}>Profile & Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>G</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Guest User</Text>
              <Text style={styles.userEmail}>guest@science.edu.sg</Text>
              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Star color="#FFD700" size={16} />
                  <Text style={styles.statText}>Premium Member</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {profileOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity key={option.id} style={styles.optionCard}>
                <View style={styles.optionIcon}>
                  <IconComponent color={option.color} size={24} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <ChevronRight color="#CCC" size={20} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Section */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['#FF6B35', '#FF8C42']}
              style={styles.logoutGradient}
            >
              <LogOut color="white" size={24} />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <View key={index} style={styles.contactCard}>
                <View style={[styles.contactIcon, { backgroundColor: `${info.color}20` }]}>
                  <IconComponent color={info.color} size={20} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>{info.title}</Text>
                  <Text style={styles.contactValue}>{info.value}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <HelpCircle color="#FF6B35" size={24} />
              </View>
              <Text style={styles.quickActionText}>FAQ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <Phone color="#4ECDC4" size={24} />
              </View>
              <Text style={styles.quickActionText}>Call Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <Mail color="#45B7D1" size={24} />
              </View>
              <Text style={styles.quickActionText}>Email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <MapPin color="#96CEB4" size={24} />
              </View>
              <Text style={styles.quickActionText}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Singapore Science Centre Kiosk</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Your gateway to scientific discovery and learning
          </Text>
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
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  userCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  optionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  contactContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  contactCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    backgroundColor: 'white',
    width: '48%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 30,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});