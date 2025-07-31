import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Image, ScrollView, DeviceEventEmitter, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
const halls = [
  { label: 'Hall A', value: 'hall_a' },
  { label: 'Hall B', value: 'hall_b' },
  { label: 'Hall C', value: 'hall_c' },
];
const exhibitsByHall = {
  hall_a: [
    { label: 'The Giant Zoetrope', value: 'zoetrope' },
    { label: 'Professor Crackitt\'s Light Fantastic Mirror Maze', value: 'mirror' },
    { label: 'Laser Maze Challenge', value: 'laser' },
    { label: 'Scientist for a Day', value: 'scientist' },
  ],
  hall_b: [
    { label: 'Earth Alive', value: 'earth_alive' },
    { label: 'The Science of Fear', value: 'science_fear' },
    { label: 'Energy Story', value: 'energy_story' },
  ],
  hall_c: [
    { label: 'Going Viral', value: 'going_viral' },
    { label: 'E-mmersive Experiential Environment', value: 'emmersive' },
  ],
};
const practicalLocations = [
  { label: 'Restroom', value: 'restroom' },
  { label: 'Elevator', value: 'elevator' },
  { label: 'Food Stall', value: 'food' },
  { label: 'First Aid Room', value: 'first_aid' },
];
// Enhanced image mapping function with error handling
const getRouteImagePath = (hall: string, currentLocation: string, destination: string): string | null => {
  if (!hall || !currentLocation || !destination) return null;
  
  const hallFormatted = hall.replace('_', '-');
  const locationFormatted = currentLocation.replace('_', '-');
  const destinationFormatted = destination.replace('_', '-');
  
  const filename = `${hallFormatted}-${locationFormatted}-to-${destinationFormatted}.png`;
  return filename;
};
const imageMap: { [key: string]: string } = {
  // Hall A images
  'hall-a-zoetrope-to-restroom.png': 'https://i.imgur.com/M62VRuu.png',
  'hall-a-zoetrope-to-elevator.png': 'https://i.imgur.com/CdiNqCm.png',
  'hall-a-zoetrope-to-food.png': 'https://i.imgur.com/MVUN5mQ.png',
  'hall-a-mirror-to-restroom.png': 'https://i.imgur.com/8kW2SMx.png',
  'hall-a-mirror-to-elevator.png': 'https://i.imgur.com/m1ogE2f.png',
  'hall-a-mirror-to-food.png': 'https://i.imgur.com/BlJEgY3.png',
  'hall-a-laser-to-restroom.png': 'https://i.imgur.com/FwMShkU.png',
  'hall-a-laser-to-elevator.png': 'https://i.imgur.com/EYDZ2HN.png',
  'hall-a-laser-to-food.png': 'https://i.imgur.com/LQ4umik.png',
  'hall-a-scientist-to-restroom.png': 'https://i.imgur.com/PNvgeId.png',
  'hall-a-scientist-to-elevator.png': 'https://i.imgur.com/RGet2V3.png',
  'hall-a-scientist-to-food.png': 'https://i.imgur.com/B40NqQE.png',
  
  // Hall B images
  'hall-b-earth-alive-to-elevator.png': 'https://i.imgur.com/WSnATeY.png',
  'hall-b-earth-alive-to-restroom.png': 'https://i.imgur.com/Z70BnlJ.png',
  'hall-b-earth-alive-to-first-aid.png': 'https://i.imgur.com/XoiNVLL.png',
  'hall-b-science-fear-to-elevator.png': 'https://i.imgur.com/8rOPg8O.png',
  'hall-b-science-fear-to-restroom.png': 'https://i.imgur.com/JzWf0Pq.png',
  'hall-b-science-fear-to-first-aid.png': 'https://i.imgur.com/4pRrcEm.png',
  'hall-b-energy-story-to-elevator.png': 'https://i.imgur.com/tsFzbfB.png',
  'hall-b-energy-story-to-restroom.png': 'https://i.imgur.com/AfmBCZU.png',
  'hall-b-energy-story-to-first-aid.png': 'https://i.imgur.com/AfmBCZU.png',
  
  // Hall C images
  'hall-c-going-viral-to-restroom.png': 'https://i.imgur.com/irHM0tI.png',
  'hall-c-going-viral-to-elevator.png': 'https://i.imgur.com/pmOsyg7.png',
  'hall-c-emmersive-to-restroom.png': 'https://i.imgur.com/fUH5ll1.png',
  'hall-c-emmersive-to-elevator.png': 'https://i.imgur.com/2eAgFq8.png',
};

// Enhanced navigation data with more precise measurements and contextual information
type NavigationRoute = {
  distance: string;
  estimatedTime: string;
  difficulty: string;
  accessibility: string;
  directions: string[];
  landmarks: string[];
  isCrossHall: boolean;
};

const navigationData: { [key: string]: NavigationRoute } = {
  // HALL A - Enhanced with more detailed measurements and context
  'zoetrope-restroom': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From The Giant Zoetrope exhibit, turn left',
      'Walk straight for 10 meters parallel to the main corridor',
      'The restroom entrance will be on your left side',
      'Look for the blue accessibility sign'
    ],
    landmarks: ['Main corridor', 'Information desk nearby'],
    isCrossHall: false
  },
  'zoetrope-elevator': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From The Giant Zoetrope exhibit, walk straight',
      'Walk straight for 10 meters along the main corridor',
      'The elevator bank will be on your left side',
      'Press the call button and wait for arrival'
    ],
    landmarks: ['Main corridor', 'Emergency exit sign', 'Fire extinguisher'],
    isCrossHall: false
  },
  'zoetrope-food': {
    distance: '50 meters',
    estimatedTime: '1-3 minutes',
    difficulty: 'Moderate',
    accessibility: 'Elevator required',
    directions: [
      'From The Giant Zoetrope exhibit, walk 10 meters left to the elevator',
      'Take the elevator to the upper floor (2nd floor)',
      'Exit elevator and turn right',
      'Walk 15 meters straight to reach the food court area',
      'Multiple food stalls will be available on your right'
    ],
    landmarks: ['Elevator bank', 'Upper floor directory', 'Food court entrance'],
    isCrossHall: false
  },
  'zoetrope-first_aid': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '4-5 minutes',
    difficulty: 'Moderate',
    accessibility: 'Multiple halls involved',
    directions: [
      'Exit Hall A through the main entrance',
      'Follow corridor signs to Hall B',
      'Enter Hall B and locate the First Aid station',
      'First Aid room is centrally located in Hall B'
    ],
    landmarks: ['Hall A exit', 'Corridor junction', 'Hall B entrance'],
    isCrossHall: true
  },
  'mirror-restroom': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Professor Crackitt\'s Mirror Maze, turn left',
      'Walk straight for 5 meters',
      'The restroom entrance will be on your left side',
      'Look for the illuminated restroom sign'
    ],
    landmarks: ['Mirror maze exit', 'Corridor lighting'],
    isCrossHall: false
  },
  'mirror-elevator': {
    distance: '40 meters',
    estimatedTime: '1 minute',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Professor Crackitt\'s Mirror Maze, walk straight ahead',
      'Continue for 10 meters along the corridor',
      'The elevator bank will be directly in front of you',
      'Multiple elevators available for convenience'
    ],
    landmarks: ['Corridor center', 'Elevator call buttons'],
    isCrossHall: false
  },
  'mirror-food': {
    distance: '50 meters',
    estimatedTime: '1-3 minutes',
    difficulty: 'Moderate',
    accessibility: 'Elevator required',
    directions: [
      'From Professor Crackitt\'s Mirror Maze, walk 10 meters forward to elevator',
      'Take the elevator to the 2nd floor',
      'Exit and turn left toward the food court',
      'Walk 13 meters to reach the nearest food stall',
      'Various dining options available'
    ],
    landmarks: ['Elevator bank', 'Food court directory', 'Seating area'],
    isCrossHall: false
  },
  'mirror-first_aid': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '5-7 minutes',
    difficulty: 'Moderate',
    accessibility: 'Multiple halls involved',
    directions: [
      'Exit Hall A through the main entrance',
      'Navigate to Hall B following directional signs',
      'Locate the First Aid station in Hall B central area'
    ],
    landmarks: ['Hall exit', 'Inter-hall corridor'],
    isCrossHall: true
  },
  'laser-restroom': {
    distance: '20 meters',
    estimatedTime: '30-45 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Laser Maze Challenge exit, turn left',
      'Walk 5 meters along the side corridor',
      'Restroom entrance on your left',
      'Family restroom also available'
    ],
    landmarks: ['Laser maze exit', 'Side corridor'],
    isCrossHall: false
  },
  'laser-elevator': {
    distance: '40 meters',
    estimatedTime: '1 minute',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Laser Maze Challenge, walk straight ahead',
      'Continue 10 meters to the main elevator bank',
      'Elevators serve all floors of the building',
      'Audio announcements available'
    ],
    landmarks: ['Main corridor junction', 'Elevator lobby'],
    isCrossHall: false
  },
  'laser-food': {
    distance: '50 meters',
    estimatedTime: '2-3 minutes',
    difficulty: 'Moderate',
    accessibility: 'Elevator required',
    directions: [
      'From Laser Maze Challenge, walk 10 meters to elevator',
      'Take elevator to 2nd floor food court',
      'Walk 10 meters from elevator to food stalls',
      'Quick service and sit-down options available'
    ],
    landmarks: ['Elevator access', 'Food court entrance', 'Menu displays'],
    isCrossHall: false
  },
  'laser-first_aid': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '5-7 minutes',
    difficulty: 'Moderate',
    accessibility: 'Multiple halls involved',
    directions: [
      'Exit Hall A and proceed to Hall B',
      'Follow emergency signage for First Aid location',
      'Trained medical staff available during operating hours'
    ],
    landmarks: ['Emergency exit routes', 'Medical facility signs'],
    isCrossHall: true
  },
  'scientist-restroom': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Scientist for a Day exhibit, turn left',
      'Walk 5 meters toward the facility entrance',
      'Restroom located on your left side',
      'Baby changing station available'
    ],
    landmarks: ['Exhibit exit', 'Facility entrance'],
    isCrossHall: false
  },
  'scientist-elevator': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Scientist for a Day exhibit, turn right',
      'Walk 7 meters to the nearby elevator',
      'Elevator provides access to all building levels',
      'Braille buttons available for visually impaired'
    ],
    landmarks: ['Exhibit area', 'Elevator alcove'],
    isCrossHall: false
  },
  'scientist-food': {
    distance: '50 meters',
    estimatedTime: '1-2 minutes',
    difficulty: 'Easy',
    accessibility: 'Elevator required',
    directions: [
      'From Scientist for a Day, walk 7 meters right to elevator',
      'Take elevator to 2nd floor',
      'Walk 8 meters to the food court',
      'Healthy and kid-friendly options available'
    ],
    landmarks: ['Nearby elevator', 'Food court signage'],
    isCrossHall: false
  },
  'scientist-first_aid': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '5-7 minutes',
    difficulty: 'Moderate',
    accessibility: 'Multiple halls involved',
    directions: [
      'Exit Hall A and navigate to Hall B',
      'First Aid station centrally located in Hall B',
      'Emergency medical supplies and trained staff available'
    ],
    landmarks: ['Hall transition area', 'Medical facility'],
    isCrossHall: true
  },
  'earth_alive-elevator': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Earth Alive exhibit, turn left toward main corridor',
      'Walk 5 meters to the elevator bank',
      'Multiple elevators available for efficient service',
      'Floor directory posted near elevator buttons'
    ],
    landmarks: ['Exhibit exit', 'Main corridor', 'Elevator bank'],
    isCrossHall: false
  },
  'earth_alive-restroom': {
    distance: '40 meters',
    estimatedTime: '1 minute',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Earth Alive exhibit, walk straight ahead',
      'Continue 10 meters along the main corridor',
      'Restroom facilities will be ahead on your right',
      'Gender-neutral options available'
    ],
    landmarks: ['Main corridor', 'Information kiosk', 'Seating area'],
    isCrossHall: false
  },
  'earth_alive-first_aid': {
    distance: '45 meters',
    estimatedTime: '1.5 minutes',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Earth Alive exhibit, walk straight ahead',
      'Continue 15 meters to the center of Hall B',
      'First Aid room will be on your right',
      'Look for the red cross medical symbol',
      'Emergency personnel on duty during all hours'
    ],
    landmarks: ['Hall B center', 'Medical station sign', 'Emergency equipment'],
    isCrossHall: false
  },
  'earth_alive-food': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '6-8 minutes',
    difficulty: 'Moderate',
    accessibility: 'Inter-hall travel required',
    directions: [
      'Exit Hall B through the main entrance',
      'Navigate to Hall A following directional signage',
      'Take elevator to 2nd floor food court in Hall A',
      'Multiple dining options available'
    ],
    landmarks: ['Hall B exit', 'Inter-hall corridor', 'Hall A food court'],
    isCrossHall: true
  },
  'science_fear-elevator': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From The Science of Fear exhibit, walk straight ahead',
      'Continue 5 meters to the elevator bank',
      'High-speed elevators with floor announcements',
      'Emergency call button available in each elevator'
    ],
    landmarks: ['Exhibit exit', 'Elevator lobby', 'Floor directory'],
    isCrossHall: false
  },
  'science_fear-restroom': {
    distance: '10 meters',
    estimatedTime: '20 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From The Science of Fear exhibit, turn around',
      'Walk 3 meters back toward the entrance area',
      'Restroom facilities on your immediate left',
      'Modern facilities with motion-sensor lighting'
    ],
    landmarks: ['Exhibit entrance', 'Information desk'],
    isCrossHall: false
  },
  'science_fear-first_aid': {
    distance: '10 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From The Science of Fear exhibit, turn around',
      'Walk 5 meters back toward the hall entrance',
      'First Aid room will be on your left',
      'Automated external defibrillator (AED) available',
      'First aid supplies and emergency contact information posted'
    ],
    landmarks: ['Hall entrance area', 'Emergency equipment station'],
    isCrossHall: false
  },
  'science_fear-food': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '6-8 minutes',
    difficulty: 'Moderate',
    accessibility: 'Inter-hall travel required',
    directions: [
      'Exit Hall B and navigate to Hall A',
      'Use elevator to access 2nd floor food court',
      'Variety of restaurants and quick-service options'
    ],
    landmarks: ['Hall exit', 'Inter-hall passage', 'Food court'],
    isCrossHall: true
  },
  'energy_story-elevator': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Energy Story exhibit, turn right',
      'Walk 5 meters to the elevator bank',
      'Elevator cars equipped with audio announcements',
      'Braille floor buttons available'
    ],
    landmarks: ['Exhibit exit', 'Elevator access'],
    isCrossHall: false
  },
  'energy_story-restroom': {
    distance: '20 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Energy Story exhibit, turn left',
      'Walk 5 meters toward the corridor center',
      'Restroom entrance on your left side',
      'Family restroom with baby changing facilities'
    ],
    landmarks: ['Corridor junction', 'Family facilities sign'],
    isCrossHall: false
  },
  'energy_story-first_aid': {
    distance: '35 meters',
    estimatedTime: '45 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Energy Story exhibit, turn left',
      'Walk 7 meters toward the hall center',
      'First Aid room on your left',
      'Medical professionals available during operating hours',
      'Emergency medical equipment clearly marked'
    ],
    landmarks: ['Hall center', 'Medical facility signage'],
    isCrossHall: false
  },
  'energy_story-food': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '6-8 minutes',
    difficulty: 'Moderate',
    accessibility: 'Inter-hall travel required',
    directions: [
      'Exit Hall B and proceed to Hall A',
      'Access 2nd floor food court via elevator',
      'Diverse dining options from casual to fine dining'
    ],
    landmarks: ['Hall exit', 'Food court access'],
    isCrossHall: true
  },
  'going_viral-restroom': {
    distance: '45 meters',
    estimatedTime: '1 minute',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Going Viral exhibit, walk straight ahead',
      'Continue 20 meters along the main corridor',
      'Restroom facilities ahead on your right',
      'Modern facilities with contactless fixtures',
      'Hand sanitizer stations available'
    ],
    landmarks: ['Main corridor', 'Digital directory display'],
    isCrossHall: false
  },
  'going_viral-elevator': {
    distance: '45 meters',
    estimatedTime: '1 minute',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From Going Viral exhibit, turn slightly left',
      'Walk 10 meters to the elevator bank',
      'State-of-the-art elevator system with touchless controls',
      'Voice-activated floor selection available'
    ],
    landmarks: ['Elevator lobby', 'Interactive floor map'],
    isCrossHall: false
  },
  'going_viral-food': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '7-9 minutes',
    difficulty: 'Moderate',
    accessibility: 'Inter-hall travel required',
    directions: [
      'Exit Hall C and navigate to Hall A',
      'Follow signs to the 2nd floor food court',
      'Take elevator to access dining facilities',
      'Wide selection of food vendors and seating areas'
    ],
    landmarks: ['Hall exit', 'Food court directional signs'],
    isCrossHall: true
  },
  'going_viral-first_aid': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '6-8 minutes',
    difficulty: 'Moderate',
    accessibility: 'Inter-hall travel required',
    directions: [
      'Exit Hall C and navigate to Hall B',
      'Follow emergency medical signs to First Aid',
      'Trained medical staff and emergency equipment available'
    ],
    landmarks: ['Hall exit', 'Medical facility signs'],
    isCrossHall: true
  },
  'emmersive-restroom': {
    distance: '15 meters',
    estimatedTime: '30 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From E-mmersive Environment exhibit, turn right',
      'Walk 5 meters along the side corridor',
      'Restroom entrance on your right',
      'Eco-friendly facilities with water-saving features'
    ],
    landmarks: ['Side corridor', 'Sustainability information board'],
    isCrossHall: false
  },
  'emmersive-elevator': {
    distance: '35 meters',
    estimatedTime: '45 seconds',
    difficulty: 'Easy',
    accessibility: 'Wheelchair accessible',
    directions: [
      'From E-mmersive Environment exhibit, turn right',
      'Walk 7 meters to the elevator access',
      'Energy-efficient elevators with regenerative drives',
      'Digital displays show environmental impact metrics'
    ],
    landmarks: ['Elevator access', 'Environmental display'],
    isCrossHall: false
  },
  'emmersive-food': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '7-9 minutes',
    difficulty: 'Moderate',
    accessibility: 'Inter-hall travel required',
    directions: [
      'Exit Hall C and proceed to Hall A',
      'Navigate to 2nd floor food court via elevator',
      'Sustainable dining options and locally sourced food available'
    ],
    landmarks: ['Hall exit', 'Sustainable dining signs'],
    isCrossHall: true
  },
  'emmersive-first_aid': {
    distance: 'Cross-hall navigation required',
    estimatedTime: '6-8 minutes',
    difficulty: 'Moderate',
    accessibility: 'Inter-hall travel required',
    directions: [
      'Exit Hall C and navigate to Hall B',
      'Follow medical emergency signs to First Aid station',
      'Comprehensive medical care and emergency response available'
    ],
    landmarks: ['Hall exit', 'Emergency response signs'],
    isCrossHall: true
  },
};
export default function NavigationSystem() {
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [destination, setDestination] = useState(null);
  const [routeSteps, setRouteSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalDistance, setTotalDistance] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [landmarks, setLandmarks] = useState<string[]>([]);
  const [isCrossHallNavigation, setIsCrossHallNavigation] = useState(false);
  const [imageError, setImageError] = useState({});
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [locationDetected, setLocationDetected] = useState(false);
  const [currentRouteImage, setCurrentRouteImage] = useState<string | null>(null);
  const cameraRef = React.useRef(null);

  const [openHall, setOpenHall] = useState(false);
  const [openCurrent, setOpenCurrent] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);

  // Animation values
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [imageAnim] = useState(new Animated.Value(0));
  const [detectAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  const currentExhibits = selectedHall ? exhibitsByHall[selectedHall as keyof typeof exhibitsByHall] : [];

  useEffect(() => {
    (async () => {
      const storedLocation = await AsyncStorage.getItem('ssc_current_location');
      if (storedLocation) {
        try {
          const { hall, exhibit } = JSON.parse(storedLocation);
          if (hall && exhibit) {
            setSelectedHall(hall);
            setCurrentLocation(exhibit);
          }
        } catch (e) {}
      }
    })();

    const subscription = DeviceEventEmitter.addListener('ssc_location_changed', (event) => {
      if (event && event.hall && event.exhibit) {
        setSelectedHall(event.hall);
        setCurrentLocation(event.exhibit);
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    if (routeSteps.length > 0) {
      // Fade in navigation instructions
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      // Slide in animation
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
      // Animate route image
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
      // Progress animation
      Animated.timing(progressAnim, {
        toValue: currentStep / Math.max(routeSteps.length - 1, 1),
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [routeSteps, currentStep]);

  // Update route image when selections change
  useEffect(() => {
    if (selectedHall && currentLocation && destination) {
      const imagePath = getRouteImagePath(selectedHall, currentLocation, destination);
      const imageSource = imagePath ? imageMap[imagePath] : null;
      setCurrentRouteImage(imageSource || null);
    } else {
      setCurrentRouteImage(null);
    }
  }, [selectedHall, currentLocation, destination]);

  // Fix handleHallChange and handleCurrentLocationChange parameter types
  const handleHallChange = React.useCallback((hall: string | null) => {
    setSelectedHall(hall);
    setCurrentLocation(null);
    setRouteSteps([]);
    setCurrentStep(0);
    setTotalDistance('');
    setEstimatedTime('');
    setDifficulty('');
    setAccessibility('');
    setLandmarks([]);
    setIsCrossHallNavigation(false);
    setImageError({});
    setDetectedLocation(null);
    setCurrentRouteImage(null);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
    imageAnim.setValue(0);
    progressAnim.setValue(0);
  }, [fadeAnim, slideAnim, imageAnim, progressAnim]);

  // Fix handleHallChange and handleCurrentLocationChange parameter types
  const handleCurrentLocationChange = React.useCallback((location: string | null) => {
    setCurrentLocation(location);
    setRouteSteps([]);
    setCurrentStep(0);
    setTotalDistance('');
    setEstimatedTime('');
    setDifficulty('');
    setAccessibility('');
    setLandmarks([]);
    setIsCrossHallNavigation(false);
    setDetectedLocation(null);
    
    // Reset navigation animations
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
    imageAnim.setValue(0);
    progressAnim.setValue(0);
  }, [fadeAnim, slideAnim, imageAnim, progressAnim]);
  // New location detection logic
  const handleDetectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      setLocationDetected(true);
      setSelectedHall('hall_a' as any);
      setCurrentLocation('zoetrope' as any);
    }, 2000);
  };

  const handleStartNavigation = () => {
    if (!currentLocation || !destination) return;
    const key = `${currentLocation}-${destination}`;
    const route = navigationData[key] || null;
    if (route) {
      setRouteSteps(route.directions);
      setTotalDistance(route.distance);
      setEstimatedTime(route.estimatedTime || '');
      setDifficulty(route.difficulty || '');
      setAccessibility(route.accessibility || '');
      setLandmarks(route.landmarks || []);
      setIsCrossHallNavigation(route.isCrossHall);
      setCurrentStep(0);
    } else {
      setRouteSteps(['No route available between selected locations.'] as any);
      setTotalDistance('');
      setEstimatedTime('');
      setDifficulty('');
      setAccessibility('');
      setLandmarks([]);
      setIsCrossHallNavigation(false);
      setCurrentStep(0);
    }
  };

  const handleNextStep = () => {
    if (currentStep < routeSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      
      // Animate step transition
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      // Update progress
      Animated.timing(progressAnim, {
        toValue: (currentStep + 1) / Math.max(routeSteps.length - 1, 1),
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      
      // Animate step transition
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      // Update progress
      Animated.timing(progressAnim, {
        toValue: (currentStep - 1) / Math.max(routeSteps.length - 1, 1),
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleReset = () => {
    setSelectedHall(null);
    setCurrentLocation(null);
    setDestination(null);
    setRouteSteps([]);
    setCurrentStep(0);
    setTotalDistance('');
    setEstimatedTime('');
    setDifficulty('');
    setAccessibility('');
    setLandmarks([]);
    setIsCrossHallNavigation(false);
    setImageError({});
    setDetectedLocation(null);
    setCurrentRouteImage(null);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
    imageAnim.setValue(0);
    progressAnim.setValue(0);
  };
  const handleImageError = (exhibitValue: string) => {
    setImageError(prev => ({
      ...prev,
      [exhibitValue]: true
    }));
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const slideTransform = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  const isNavigationComplete = currentStep >= routeSteps.length - 1 && !isCrossHallNavigation;
  // Add proper null checking and improve function structure
  const getCurrentExhibitLabel = React.useCallback(() => {
    if (!currentLocation || !currentExhibits || currentExhibits.length === 0) return '';
    
    const exhibit = currentExhibits.find((ex: any) => ex.value === currentLocation);
    if (exhibit && exhibit.label) {
      return (exhibit as any).label;
    }
    return '';
  }, [currentLocation, currentExhibits]);
  const getDestinationLabel = React.useCallback(() => {
    if (!destination) return '';
    
    const location = practicalLocations.find((loc: any) => loc.value === destination);
    return location ? location.label : '';
  }, [destination]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hall Navigation</Text>
          <Text style={styles.headerSubtitle}>Exhibit Guide for Practical Locations</Text>
        </View>
      </LinearGradient>
      <FlatList
        data={[{}]}
        keyExtractor={() => 'main'}
        contentContainerStyle={{ padding: 20 }}
        renderItem={() => (
          <>
            <View style={styles.currentLocationSection}>
              <Text style={styles.sectionTitle}>Select Your Location</Text>
              <DropDownPicker
                open={openHall}
                setOpen={setOpenHall}
                items={halls}
                value={selectedHall}
                setValue={callback => {
                  if (typeof callback === 'function') {
                    // DropDownPicker passes a function, so resolve it with current value
                    setSelectedHall(prev => {
                      const value = callback(prev);
                      handleHallChange(value);
                      return value;
                    });
                  } else {
                    handleHallChange(callback);
                    setSelectedHall(callback);
                  }
                }}
                placeholder="Choose a hall"
                style={styles.dropdown}
                containerStyle={{ marginBottom: 20 }}
                zIndex={4000}
                zIndexInverse={500}
              />
              <DropDownPicker
                open={openCurrent}
                setOpen={setOpenCurrent}
                items={currentExhibits}
                value={currentLocation}
                setValue={callback => {
                  if (typeof callback === 'function') {
                    setCurrentLocation(prev => {
                      const value = callback(prev);
                      handleCurrentLocationChange(value);
                      return value;
                    });
                  } else {
                    handleCurrentLocationChange(callback);
                    setCurrentLocation(callback);
                  }
                }}
                placeholder={selectedHall ? "Select your current exhibit" : "Please select a hall first"}
                style={[styles.dropdown, !selectedHall && styles.disabledDropdown]}
                disabled={!selectedHall}
                containerStyle={{ marginBottom: 20 }}
                zIndex={3000}
                zIndexInverse={1000}
              />
              <DropDownPicker
                open={openDestination}
                setOpen={setOpenDestination}
                items={practicalLocations}
                value={destination}
                setValue={setDestination}
                placeholder="Select what you need"
                style={styles.dropdown}
                containerStyle={{ marginBottom: 20 }}
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>

            {/* Enhanced Route Information */}
            {selectedHall && currentLocation && destination && (
              <View style={styles.routeInfoSection}>
                <Text style={styles.routeInfoTitle}>Route Information</Text>
                <View style={styles.routeInfoGrid}>
                  <View style={styles.routeInfoItem}>
                    <Text style={styles.routeInfoLabel}>From</Text>
                    <Text style={styles.routeInfoValue}>{getCurrentExhibitLabel()}</Text>
                  </View>
                  <View style={styles.routeInfoItem}>
                    <Text style={styles.routeInfoLabel}>To</Text>
                    <Text style={styles.routeInfoValue}>{getDestinationLabel()}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Route Image Preview */}
            {currentRouteImage && (
              <Animated.View 
                style={[
                  styles.routeImageContainer,
                  {
                    opacity: imageAnim,
                    transform: [{
                      translateY: imageAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.routeImageTitle}>Route Preview</Text>
                <Image 
                  source={currentRouteImage ? { uri: currentRouteImage } : undefined}
                  style={styles.routeImage}
                  resizeMode="contain"
                  onError={() => console.log('Failed to load route image')}
                />
              </Animated.View>
            )}

            <TouchableOpacity
              style={[
                styles.startButton,
                { marginTop: currentRouteImage ? 20 : 115 },
                (!selectedHall || !currentLocation || !destination) && styles.disabledButton
              ]}
              onPress={handleStartNavigation}
              disabled={!selectedHall || !currentLocation || !destination}
            >
              <Text style={styles.startButtonText}>Get Directions</Text>
            </TouchableOpacity>
            {routeSteps.length > 0 && (
              <Animated.View 
                style={[
                  styles.navigationInfo,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideTransform }]
                  }
                ]}
              >
                <Text style={styles.navigationTitle}>Navigation Details</Text>

                {/* Enhanced Metrics */}
                <View style={styles.metricsContainer}>
                  {totalDistance && (
                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>Distance</Text>
                      <Text style={styles.metricValue}>{totalDistance}</Text>
                    </View>
                  )}
                  {estimatedTime && (
                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>Time</Text>
                      <Text style={styles.metricValue}>{estimatedTime}</Text>
                    </View>
                  )}
                  {difficulty && (
                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>Difficulty</Text>
                      <Text style={[styles.metricValue, 
                        difficulty === 'Easy' && { color: '#4CAF50' },
                        difficulty === 'Moderate' && { color: '#FF8C42' }
                      ]}>{difficulty}</Text>
                    </View>
                  )}
                </View>

                {/* Accessibility Information */}
                {accessibility && (
                  <View style={styles.accessibilityCard}>
                    <Text style={styles.accessibilityTitle}>Accessibility</Text>
                    <Text style={styles.accessibilityText}>{accessibility}</Text>
                  </View>
                )}

                {/* Progress Indicator */}
                {routeSteps.length > 1 && (
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressTitle}>Progress: Step {currentStep + 1} of {routeSteps.length}</Text>
                    <View style={styles.progressBar}>
                      <Animated.View 
                        style={[
                          styles.progressFill,
                          {
                            width: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            })
                          }
                        ]}
                      />
                    </View>
                  </View>
                )}

                {/* Current Step */}
                <View style={styles.currentStepContainer}>
                  <Text style={styles.currentStepTitle}>Current Step:</Text>
                  <Text style={styles.currentStepText}>{routeSteps[currentStep]}</Text>
                </View>
                {/* Landmarks */}
                {landmarks.length > 0 && (
                  <View style={styles.landmarksContainer}>
                    <Text style={styles.landmarksTitle}>Landmarks to Look For:</Text>
                    {landmarks.map((landmark, index) => (
                      <View key={index} style={styles.landmarkItem}>
                        <Text style={styles.landmarkText}>• {landmark}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {/* Navigation Controls */}
                <View style={styles.navigationControls}>
                  {currentStep > 0 && (
                    <TouchableOpacity style={styles.prevButton} onPress={handlePreviousStep}>
                      <Text style={styles.prevButtonText}>Previous Step</Text>
                    </TouchableOpacity>
                  )}

                  {currentStep < routeSteps.length - 1 ? (
                    <TouchableOpacity style={styles.nextStepButton} onPress={handleNextStep}>
                      <Text style={styles.nextStepButtonText}>Next Step</Text>
                    </TouchableOpacity>
                  ) : !isCrossHallNavigation ? (
                    <View style={styles.arrivalContainer}>
                      <Text style={styles.arrivalText}>🎯 You've arrived at your destination!</Text>
                    </View>
                  ) : (
                    <View style={styles.crossHallContainer}>
                      <Text style={styles.crossHallText}>🔄 Continue to the specified hall</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Start New Navigation</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  currentLocationSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledDropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  routeInfoSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  routeInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  routeInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeInfoItem: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  routeInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  routeImageContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  routeImageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  routeImage: {
    width: width - 72,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  navigationInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  accessibilityCard: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  accessibilityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D2E',
    marginBottom: 4,
  },
  accessibilityText: {
    fontSize: 12,
    color: '#388E3C',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  currentStepContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  currentStepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  currentStepText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  landmarksContainer: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  landmarksTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  landmarkItem: {
    marginBottom: 4,
  },
  landmarkText: {
    fontSize: 12,
    color: '#FF8C42',
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  prevButton: {
    backgroundColor: '#757575',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  prevButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  nextStepButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#FF8C42',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  nextStepButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  arrivalContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  arrivalText: {
    color: '#388E3C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  crossHallContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  crossHallText: {
    color: '#FF8C42',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },

  resetButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
  },
});