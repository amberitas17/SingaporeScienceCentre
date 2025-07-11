import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { 
  Ticket, 
  Users, 
  Star, 
  Clock,
  MapPin,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Baby,
  UserCheck,
  Zap,
  Eye,
  Telescope,
  Camera,
  Shield,
  CheckCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ticketCategories = {
  single: [
    {
      id: 1,
      name: 'Science Centre',
      price: 15,
      type: 'single',
      description: 'Access to all exhibitions and interactive displays',
      features: ['50+ Exhibitions', 'Interactive Displays', 'Educational Tours'],
      color: '#FF6B35',
      icon: Eye,
      popular: false
    },
    {
      id: 2,
      name: 'Omni-Theatre',
      price: 10,
      type: 'single',
      description: 'Digital movies and live planetarium shows',
      features: ['Digital Movies', 'Planetarium Shows', 'Immersive Experience'],
      color: '#45B7D1',
      icon: Telescope,
      popular: false
    },
    {
      id: 3,
      name: 'KidsSTOP™',
      price: 10,
      type: 'single',
      description: 'Interactive playground for children',
      features: ['Kids Activities', 'Safe Environment', 'Educational Play'],
      color: '#96CEB4',
      icon: Baby,
      popular: false
    }
  ],
  combo: [
    {
      id: 4,
      name: 'Science Centre + Omni-Theatre',
      price: 22,
      type: 'combo',
      description: 'Best value combo ticket',
      features: ['All Exhibitions', 'Theatre Shows', 'Save $3'],
      color: '#4ECDC4',
      icon: Zap,
      popular: true,
      savings: 3
    },
    {
      id: 5,
      name: 'Complete Experience',
      price: 30,
      type: 'combo',
      description: 'Full access to all attractions',
      features: ['Science Centre', 'Omni-Theatre', 'KidsSTOP™', 'Premium Access'],
      color: '#A8E6CF',
      icon: Star,
      popular: false
    }
  ],
  experience: [
    {
      id: 6,
      name: 'Workshop Package',
      price: 25,
      type: 'experience',
      description: 'Hands-on learning experiences',
      features: ['Science Workshops', 'Lab Activities', 'Expert Guidance'],
      color: '#FF8C42',
      icon: Zap,
      popular: false
    }
  ]
};

export default function Tickets() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'single' | 'combo' | 'experience'>('single');
  const [selectedTickets, setSelectedTickets] = useState<{[key: string]: number}>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [cameraVerified, setCameraVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [guestProfile] = useState({
    adults: 1,
    children: 0,
    totalGuests: 1,
    dominantEmotion: 'Happy',
    ageGroup: 'Adult' // Either 'Adult' or 'Child'
  });

  const handleCameraVerification = async () => {
    setIsVerifying(true);
    
    // Simulate camera verification process
    setTimeout(() => {
      setCameraVerified(true);
      setIsVerifying(false);
    }, 2000);
  };

  const updateTicketCount = (ticketId: number, change: number) => {
    const key = `${ticketId}`;
    const current = selectedTickets[key] || 0;
    const newCount = Math.max(0, current + change);
    
    const newSelectedTickets = { ...selectedTickets };
    
    if (newCount === 0) {
      delete newSelectedTickets[key];
    } else {
      newSelectedTickets[key] = newCount;
    }
    
    setSelectedTickets(newSelectedTickets);
    
    // Calculate total
    const total = Object.entries(newSelectedTickets).reduce((sum, [id, count]) => {
      const allTickets = [...ticketCategories.single, ...ticketCategories.combo, ...ticketCategories.experience];
      const ticket = allTickets.find(t => t.id === parseInt(id));
      return ticket ? sum + (ticket.price * count) : sum;
    }, 0);
    
    setTotalAmount(total);
  };

  const handleBookNow = () => {
    setShowSummary(true);
  };

  const proceedToCalendar = () => {
    router.push('/calendar');
  };

  const renderCameraVerification = () => (
    <View style={styles.cameraVerificationContainer}>
      <View style={styles.cameraVerificationCard}>
        <Camera color="#FF6B35" size={64} />
        <Text style={styles.cameraTitle}>Camera Verification Required</Text>
        <Text style={styles.cameraDescription}>
          Please enable your camera to verify age and group composition for appropriate ticket recommendations.
        </Text>
        
        <TouchableOpacity 
          style={styles.enableCameraButton}
          onPress={handleCameraVerification}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <Shield color="white" size={20} />
              <Text style={styles.enableCameraText}>Verifying...</Text>
            </>
          ) : (
            <>
              <Camera color="white" size={20} />
              <Text style={styles.enableCameraText}>Enable Camera</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.securityNote}>
          <Shield color="#666" size={16} />
          <Text style={styles.securityText}>
            Your privacy is protected. Camera data is processed locally and not stored.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSummary = () => {
    const selectedTicketsList = Object.entries(selectedTickets).map(([id, count]) => {
      const allTickets = [...ticketCategories.single, ...ticketCategories.combo, ...ticketCategories.experience];
      const ticket = allTickets.find(t => t.id === parseInt(id));
      return ticket ? { ...ticket, count } : null;
    }).filter(Boolean);

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          
          <View style={styles.guestInfo}>
            <Text style={styles.guestInfoTitle}>Guest Information</Text>
            <Text style={styles.guestInfoText}>
              1 {guestProfile.ageGroup}
            </Text>
            <Text style={styles.guestInfoText}>
              Total: 1 Guest
            </Text>
          </View>

          <View style={styles.ticketSummary}>
            <Text style={styles.ticketSummaryTitle}>Selected Tickets</Text>
            {selectedTicketsList.map((ticket: any) => (
              <View key={ticket.id} style={styles.summaryItem}>
                <View style={styles.summaryItemInfo}>
                  <Text style={styles.summaryItemName}>{ticket.name}</Text>
                  <Text style={styles.summaryItemCount}>Qty: {ticket.count}</Text>
                </View>
                <Text style={styles.summaryItemPrice}>
                  ${(ticket.price * ticket.count).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryButtons}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowSummary(false)}
            >
              <Text style={styles.backButtonText}>Back to Tickets</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.proceedButton}
              onPress={proceedToCalendar}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8C42']}
                style={styles.proceedButtonGradient}
              >
                <CheckCircle color="white" size={20} />
                <Text style={styles.proceedButtonText}>Proceed to Calendar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderTicketCard = (ticket: any) => {
    const IconComponent = ticket.icon;
    const count = selectedTickets[ticket.id] || 0;
    
    return (
      <View key={ticket.id} style={styles.ticketCard}>
        {ticket.popular && (
          <View style={styles.popularBadge}>
            <Star color="white" size={12} />
            <Text style={styles.popularText}>POPULAR</Text>
          </View>
        )}
        
        <LinearGradient
          colors={[ticket.color, `${ticket.color}DD`]}
          style={styles.ticketGradient}
        >
          <View style={styles.ticketHeader}>
            <View style={styles.ticketInfo}>
              <View style={styles.ticketTitleRow}>
                <IconComponent color="white" size={24} />
                <Text style={styles.ticketName}>{ticket.name}</Text>
              </View>
              <Text style={styles.ticketType}>{ticket.type.toUpperCase()}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${ticket.price}</Text>
              <Text style={styles.priceLabel}>per person</Text>
            </View>
          </View>
          
          <Text style={styles.ticketDescription}>{ticket.description}</Text>
          
          <View style={styles.featuresContainer}>
            {ticket.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <Check color="white" size={14} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {ticket.savings && (
            <View style={styles.savingsContainer}>
              <Text style={styles.savingsText}>
                💰 Save ${ticket.savings}
              </Text>
            </View>
          )}
        </LinearGradient>
        
        <View style={styles.ticketFooter}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, count === 0 && styles.quantityButtonDisabled]}
              onPress={() => updateTicketCount(ticket.id, -1)}
              disabled={count === 0}
            >
              <Minus color={count === 0 ? '#CCC' : '#FF6B35'} size={16} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{count}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateTicketCount(ticket.id, 1)}
            >
              <Plus color="#FF6B35" size={16} />
            </TouchableOpacity>
          </View>
          
          {count > 0 && (
            <Text style={styles.subtotal}>
              Subtotal: ${(ticket.price * count).toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (showSummary) {
    return renderSummary();
  }

  if (!cameraVerified) {
    return renderCameraVerification();
  }

  return (
    <LinearGradient
      colors={['#FAFAFA', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Clean Header */}
        <View style={styles.header}>
          <View style={styles.verificationBadge}>
            <CheckCircle color="#4CAF50" size={20} />
            <Text style={styles.verifiedText}>Camera Verified</Text>
          </View>
          
          <View style={styles.headerIcon}>
            <Ticket color="#FF6B35" size={28} />
          </View>
          
          <Text style={styles.headerTitle}>Select Your Tickets</Text>
          <Text style={styles.headerSubtitle}>
            Detected: 1 {guestProfile.ageGroup}
          </Text>
        </View>

        {/* Improved Category Selector */}
        <View style={styles.categorySelector}>
          {(['single', 'combo', 'experience'] as const).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tickets Grid */}
        <View style={styles.ticketsContainer}>
          {ticketCategories[selectedCategory].map(renderTicketCard)}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Clock color="#FF6B35" size={18} />
            <Text style={styles.infoText}>Operating Hours: 10:00 AM - 6:00 PM</Text>
          </View>
          <View style={styles.infoCard}>
            <MapPin color="#FF6B35" size={18} />
            <Text style={styles.infoText}>15 Science Centre Road, Singapore</Text>
          </View>
          <View style={styles.infoCard}>
            <Users color="#FF6B35" size={18} />
            <Text style={styles.infoText}>Age-appropriate recommendations</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Enhanced Book Now Bar */}
      {totalAmount > 0 && (
        <View style={styles.checkoutBar}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleBookNow}>
            <ShoppingCart color="white" size={18} />
            <Text style={styles.checkoutButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
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
  
  // Camera Verification Styles
  cameraVerificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF5F2',
  },
  cameraVerificationCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  cameraDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  enableCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  enableCameraText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },

  // Summary Styles
  summaryContainer: {
    flex: 1,
    backgroundColor: '#FFF5F2',
    padding: 20,
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  guestInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  guestInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  guestInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ticketSummary: {
    marginBottom: 20,
  },
  ticketSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryItemCount: {
    fontSize: 12,
    color: '#666',
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  totalSection: {
    marginVertical: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#FF6B35',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
  },
  summaryButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    paddingVertical: 18,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  proceedButton: {
    flex: 1,
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  proceedButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  proceedButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  // Header Styles
  header: {
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  verifiedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 6,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Category Selector Styles
  categorySelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryButtonActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B35',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7F8C8D',
  },
  categoryButtonTextActive: {
    color: 'white',
  },

  // Ticket Card Styles
  ticketsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  ticketCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ticketGradient: {
    padding: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  priceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ticketDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
    lineHeight: 20,
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  savingsContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Ticket Footer Styles
  ticketFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 10,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  quantityButtonDisabled: {
    borderColor: '#CCC',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
  },

  // Info Section Styles
  infoSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '500',
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },

  // Checkout Bar Styles
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkoutInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 20,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginTop: 2,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  checkoutButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
}); 