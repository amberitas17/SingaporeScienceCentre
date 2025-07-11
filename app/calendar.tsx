import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users, CircleCheck as CheckCircle, MapPin, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const timeSlots = [
  { id: 1, time: '10:00 AM', available: true },
  { id: 2, time: '11:00 AM', available: true },
  { id: 3, time: '12:00 PM', available: false },
  { id: 4, time: '1:00 PM', available: true },
  { id: 5, time: '2:00 PM', available: true },
  { id: 6, time: '3:00 PM', available: true },
  { id: 7, time: '4:00 PM', available: false },
  { id: 8, time: '5:00 PM', available: true },
];

export default function Calendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
  };

  const selectDate = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
  };

  const confirmBooking = () => {
    setShowConfirmation(true);
  };

  const goBack = () => {
    router.back();
  };

  const goBackToTickets = () => {
    router.push('/(tabs)/tickets');
  };

  const renderCalendarDay = (date: Date | null, index: number) => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const isAvailable = isDateAvailable(date);
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.calendarDay,
          isSelected && styles.selectedDay,
          !isAvailable && styles.unavailableDay,
          isToday && styles.todayDay,
        ]}
        onPress={() => selectDate(date)}
        disabled={!isAvailable}
      >
        <Text style={[
          styles.calendarDayText,
          isSelected && styles.selectedDayText,
          !isAvailable && styles.unavailableDayText,
          isToday && styles.todayDayText,
        ]}>
          {date.getDate()}
        </Text>
        {isAvailable && (
          <View style={styles.availableDot} />
        )}
      </TouchableOpacity>
    );
  };

  if (showConfirmation) {
    return (
      <LinearGradient
        colors={['#FFF5F2', '#FFFFFF']}
        style={styles.container}
      >
        <View style={styles.confirmationContainer}>
          <View style={styles.successIcon}>
            <CheckCircle color="#4CAF50" size={80} />
          </View>
          
          <Text style={styles.confirmationTitle}>Booking Confirmed!</Text>
          <Text style={styles.confirmationSubtitle}>
            Your tickets have been successfully booked
          </Text>
          
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <CalendarIcon color="#FF6B35" size={20} />
              <Text style={styles.detailText}>
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock color="#FF6B35" size={20} />
              <Text style={styles.detailText}>{selectedTime}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin color="#FF6B35" size={20} />
              <Text style={styles.detailText}>Singapore Science Centre</Text>
            </View>
          </View>
          
          <View style={styles.confirmationNote}>
            <Text style={styles.noteText}>
              📱 A confirmation email has been sent to your registered email address
            </Text>
            <Text style={styles.noteText}>
              🎫 Please present this confirmation at the entrance
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.doneButton}
            onPress={goBackToTickets}
          >
            <Text style={styles.doneButtonText}>Back to Tickets</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFF5F2', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft color="#FF6B35" size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <CalendarIcon color="#FF6B35" size={32} />
            <Text style={styles.headerTitle}>Select Date & Time</Text>
            <Text style={styles.headerSubtitle}>Choose your preferred visit date</Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => navigateMonth(-1)}
            >
              <ChevronLeft color="#FF6B35" size={24} />
            </TouchableOpacity>
            
            <Text style={styles.monthYear}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => navigateMonth(1)}
            >
              <ChevronRight color="#FF6B35" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.daysOfWeekContainer}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.dayOfWeek}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {getDaysInMonth(currentDate).map((date, index) => 
              renderCalendarDay(date, index)
            )}
          </View>
        </View>

        {/* Time Slots */}
        {selectedDate && (
          <View style={styles.timeSlotsContainer}>
            <Text style={styles.sectionTitle}>Available Time Slots</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    selectedTime === slot.time && styles.selectedTimeSlot,
                    !slot.available && styles.unavailableTimeSlot,
                  ]}
                  onPress={() => slot.available && selectTime(slot.time)}
                  disabled={!slot.available}
                >
                  <Clock 
                    color={
                      selectedTime === slot.time ? 'white' : 
                      !slot.available ? '#CCC' : '#FF6B35'
                    } 
                    size={16} 
                  />
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === slot.time && styles.selectedTimeSlotText,
                    !slot.available && styles.unavailableTimeSlotText,
                  ]}>
                    {slot.time}
                  </Text>
                  {!slot.available && (
                    <Text style={styles.unavailableLabel}>Full</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Booking Info */}
        <View style={styles.bookingInfo}>
          <View style={styles.infoCard}>
            <Users color="#FF6B35" size={20} />
            <Text style={styles.infoText}>Maximum 6 people per booking</Text>
          </View>
          <View style={styles.infoCard}>
            <Clock color="#FF6B35" size={20} />
            <Text style={styles.infoText}>Please arrive 15 minutes early</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Confirm Button */}
      {selectedDate && selectedTime && (
        <View style={styles.confirmBar}>
          <View style={styles.confirmInfo}>
            <Text style={styles.confirmDate}>
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
            <Text style={styles.confirmTime}>{selectedTime}</Text>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmBooking}
          >
            <CheckCircle color="white" size={20} />
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  header: {
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 70,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  calendarContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emptyDay: {
    width: 40,
    height: 40,
    margin: 2,
  },
  calendarDay: {
    width: 40,
    height: 40,
    margin: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#FF6B35',
  },
  unavailableDay: {
    backgroundColor: '#F5F5F5',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  unavailableDayText: {
    color: '#CCC',
  },
  todayDayText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  availableDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
  timeSlotsContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
    gap: 8,
    minWidth: 100,
  },
  selectedTimeSlot: {
    backgroundColor: '#FF6B35',
  },
  unavailableTimeSlot: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCC',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  unavailableTimeSlotText: {
    color: '#CCC',
  },
  unavailableLabel: {
    fontSize: 10,
    color: '#CCC',
    fontStyle: 'italic',
  },
  bookingInfo: {
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
  confirmBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmInfo: {
    alignItems: 'flex-start',
  },
  confirmDate: {
    fontSize: 14,
    color: '#666',
  },
  confirmTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIcon: {
    marginBottom: 30,
  },
  confirmationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  bookingDetails: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  confirmationNote: {
    backgroundColor: '#FFF5F2',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 