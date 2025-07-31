import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Accelerometer, Magnetometer } from 'expo-sensors';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Footprints,
  Ruler,
  ChevronRight,
  Eye,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get('window');

// Complete exhibit database with all Science Centre exhibits
const exhibitPath = [
  {
    id: 10,
    name: 'Kinetic Garden',
    key: 'kinetic_garden',
    description: 'Our Science Centre welcome begins at the Kinetic Garden, where you can discover the inter-relationship among forms of energy and more through interactive exhibits such as the Magic Swing, a Sundial and a Lithophone. The Kinetic Garden is a unique outdoor exhibition which demonstrates certain scientific principles and phenomena that would be difficult to create in an indoor setting.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/kinetic-garden/teasers/kineticgarden-teaser.jpg',
    hall: 'kinetic_garden',
    mapPosition: { x: 45, y: 65 },
    displays: [
      {
        image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/kinetic-garden/highlights/kineticgarden-highlight-01.jpg',
        name: 'Echo',
        description: 'Speak into the Echo Tube and listen to the echoes!'
      },
      {
        image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/kinetic-garden/highlights/kineticgarden-highlight-02.jpg',
        name: 'Giant Chair',
        description: 'Places everyone! Position your camera at the photo spot onsite (on the yellow sticker) and be tickled by the interesting illusion of how large or small your photo subjects look seated on the two chairs! It perfectly demonstrates how our visual system relies on shortcuts and sometimes glosses over details in favour of the big picture!'
      },
    ]
  },
  {
    id: 20,
    name: "The Mind's Eye",
    key: 'minds_eye',
    description: 'Do you believe what you see? Think again! Our exhibition is curated to inspire you with a fresh perspective.',
    image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/the-mind's-eye/teasers/themindseye-teaser.jpg",
    hall: 'entrance_hall',
    mapPosition: { x: 20, y: 35 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/the-mind's-eye/highlights/themindseye-highlight-01.jpg",
        name: 'The Unexpected Dinner',
        description: 'Crawl in from the back and stick your head through the hole above.Through the cleverly placed mirrors that reflect the background, an illusion of empty space is created that hides where the rest of your body should be! It’s headless fun!'
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/the-mind's-eye/highlights/highlight-giant-chair-(002).jpg",
        name: 'Giant Chair',
        description: 'Position your camera lens behind the ‘peephole’ and observe how two wrongs become right – as the separated pieces of a chair magically align. With photo subjects, the effect of this illusion gets only better! It’s a fun way to learn how our visual system relies on shortcuts and can gloss over details in favour of the big picture!'
      },
    ]
  },
  {
    id: 12,
    name: 'Laser Maze Challenge',
    key: 'laser_maze',
    description: "Harness your inner Ninja and test your reflexes in a field of laser beams in Singapore.",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/laser-maze-challenge/teasers/lasermaze-teaser.jpg',
    hall: 'hall_a',
    mapPosition: { x: 85, y: 75 },
    displays: [
      {
        image: "https://i.imgur.com/vJp3eyk.png",
        name: 'Entrapment',
        description: "Step into the future of laser maze challenges with Entrapment, an immersive experience that takes interactive gameplay to thrilling new heights. Unlike any maze before, Entrapment combines strategy, agility, and precision in a high-stakes environment. As you navigate through a maze of lasers, the difficulty increases with every move, testing your reflexes and decision-making skills. Whether you're a seasoned player or new to the world of laser mazes, Entrapment offers a fresh, exciting challenge for everyone. Are you ready to face the ultimate test and escape the maze?",
      },
      {
        image: "https://i.imgur.com/SEw4CW1.png",
        name: 'Beam Buster',
        description: "Get ready to let loose with Beam Buster, a fast-paced, high-energy game mode where players jump, run, and dive through a field of laser beams. The goal? Break as many beams as possible before time runs out! This exhilarating challenge will get your heart racing and is perfect for both kids and the young at heart. With every move, the excitement builds as you race against the clock, making Beam Buster an addictively fun experience that keeps you coming back for more. How many beams can you bust before the time’s up?",
      },
      {
        image: "https://i.imgur.com/2YNn0G1.png",
        name: 'Laser Maze Challenge',
        description: "Are you quick on your feet and up for a challenge? Harness your inner Ninja and test your reflexes as you race against time to maneuver through a dense field of laser beams. Step into a completely dark arena with more than 50 laser beams. Your mission is to navigate the maze and complete it without coming into contact with any laser beam. Jumping, hopping, crawling, moving with your back against the floor… The laser maze challenge puts your agility and reflexes to the test!",
      },
    ]
  },
  {
    id: 14,
    name: "Professor Crackitt's Light Fantastic Mirror Maze",
    key: 'mirror_maze',
    description: "Welcome to Professor Crackitt's laboratory – a life-size labyrinth of mirrors, filled with infinite reflections and endless hallways. Help Professor Crackitt to find his pet parrot – Wattnot – who has gotten lost in the vast laboratory. Will you be able to find your way through the identical corridors that seem to loop back confusingly on themselves? As you stop to re-orientate yourself on your journey, be sure to check out the Professor's numerous whimsical inventions. Just be careful not to run into yourself on your way out!",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/mirror-maze/teasers/mirrormaze-teaser.jpg',
    hall: 'hall_a',
    mapPosition: { x: 50, y: 85 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/mirror-maze/highlights/mirrormaze-highlight-01.jpg",
        name: 'Dynamic Chromatology Shadow Splitter',
        description: "Move around the room. As you block one or more of the three coloured lights, you will create various coloured shadows that are a reflection of, or a mixture of the remaining light colours. How many different coloured shadows can you create?",
      },
    ]
  },
  {
    id: 19,
    name: 'The Giant Zoetrope',
    key: 'giant_zoetrope',
    description: "Once the zoetrope starts to spin and the strobe lights flash, our brain is 'tricked' into interpreting the 3D individual static images as a single moving image and thus the zoetrope appears to come to life before our own eyes!",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/zoetrope/banners/zoetrope-banner.jpg',
    hall: 'hall_a',
    mapPosition: { x: 75, y: 30 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/zoetrope/highlights/zoetrope-highlight.jpg",
        name: 'Zoetrope',
        description: "Once the zoetrope starts to spin and the strobe lights flash, our brain is ‘tricked’ into interpreting the 3D individual static images as a single moving image and thus the zoetrope appears to come to life before our own eyes!",
      },
    ]
  },
  {
    id: 23,
    name: 'Waterworks',
    key: 'waterworks',
    description: 'A fun-filled attraction to learn about how important water is in our lives!',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/waterworks/teasers/waterworks-teaser.jpg',
    hall: 'entry_hall_a',
    mapPosition: { x: 80, y: 50 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/waterworks/highlights/waterworks-highlights-02.jpg",
        name: 'Water Clock Tower',
        description: "Not just a pretty face, this giant mechanical Water Clock Tower comes equipped with an anemometer to measure wind speed, a windsock to indicate wind direction and a rain gauge to measure the amount of Rainfall! Try to spot them all!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/waterworks/highlights/waterworks-highlights-01.jpg",
        name: 'Water Maze',
        description: "Navigate a maze of water jets and learn about the importance of water. Have fun and try not to get too wet unless that’s part of the plan!",
      },
    ]
  },
  {
    id: 22,
    name: 'Urban Mutations',
    key: 'urban_mutations',
    description: 'Explore the changing face of cities. What is your city like? What kind of cities do we want? Cities are growing at a meteoric rate in our increasingly globalized world. Examine urban changes from a functional, technological, and sociological angle. What is the state of knowledge and representation of cities today? What are some examples of current or planned innovations and initiatives in response to issues facing urban ecosystems? Through this exhibition, visitors are encouraged to reflect on the approach to cities at the beginning of the 21st century.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/urban-mutation/teasers/zone1_dsc_0454_b_teaser3650d13e7d3b493cb5c930d83c02496b.jpg',
    hall: 'hall_a',
    mapPosition: { x: 60, y: 45 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/urban-mutation/highlights/zone1_0467_a_highlight929d7d3916af43778bb57b22aa9cf33b.jpg",
        name: 'Cities Under Pressure',
        description: "In this zone, the complexity of the “city” system is dissected into basic components to reveal its hidden workings, and the tensions that can arise. Examine and reflect upon your experience and use of the city as a citizen. ",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/urban-mutation/highlights/zone3_dsc_0519_highlight3e49b43a37fe4c5cb2a457760d7f70da.jpg",
        name: 'Urban Futures',
        description: "Explore an array of urban solutions selected for their originality, specificity, or exemplary character. Be amazed by initiatives and innovations undertaken by various cities and their citizens to address the urban challenges that they face.",
      },
    ]
  },
  {
    id: 15,
    name: 'Savage Garden',
    key: 'savage_garden',
    description: 'Journey through a whimsical village inhabited by a group of extraordinary plants – Carnivorous Plants! Meet with the natives and explore their homes to unveil their lives, special abilities, and usual dining habits…!',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/savage-garden/1cp_stage2(1).jpg',
    hall: 'hall_a',
    mapPosition: { x: 70, y: 90 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/savage-garden/1cp_stage(1).jpg",
        name: 'Plant Theatre',
        description: "Watch three short show sequences starring our five larger-than-life carnivorous plant characters! Through a rousing song & dance routine and gossipy conversations, listen as they rave about their favorite foods, share concerns for their future, and explore what makes them truly carnivorous plants.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/savage-garden/2cp_tank(1).jpg",
        name: 'Paludarium Tank',
        description: "Curious about actual carnivorous plants after meeting and learning about our five fictitious counterparts? Check out our impressive tank of live plants! Can you try to spot the different types of carnivorous plants within?",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/savage-garden/3cp_vft(1).jpg",
        name: 'Snap Snap!',
        description: "Photo time! Take the chance to snap a unique photo, within this snap-er, while posing as a snap-ee!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/savage-garden/3cp_pitcherslide(1).jpg",
        name: 'Pitcher Slide',
        description: "Take a slide down the giant pitcher to explore its slippery insides!",
      },
    ]
  },
  {
    id: 18,
    name: 'Some Call It Science',
    key: 'some_call_it_science',
    description: 'Step into a space where curiosity is your superpower, asking questions is encouraged and experimentation is a must. Some Call It Science is more than just an exhibition—it\'s an invitation to explore, wonder, and play your way to new discoveries. Some Call It Science, we call it FUN.',
    image: 'https://www.science.edu.sg/images/default-source/branding-comms-/scis-web-teaser.jpg',
    hall: 'hall_a',
    mapPosition: { x: 55, y: 25 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/branding-comms-/scis-website-3.png",
        name: 'The "O"',
        description: "Right at the entrance, under the glowing “O” installation, lies the heart of science engagement. This is where the magic of hands-on activities and live demos happens. Get involved, ask away and walk out saying, “Oh... I just learned something amazing!”",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/some-call-it-science/library/scis-web-teaser.jpg",
        name: 'Science Kombat: Sci-KO',
        description: "Gear up for some friendly competition! In this arcade-style game, choose three superpowers from the 9 positive traits highlighted in “Unlock Your Powers” exhibit and battle against a friend or the computer. May the best player win!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/branding-comms-/scis-website-2.png",
        name: 'Unlock Your Powers: Becoming Extra-Ordinary',
        description: "Dive into the world of nine individuals who reshaped our world with their curiosity, keen observation skills and ability to connect ideas. Through vibrant comic strips, get to know their “superpowers” that led to groundbreaking innovations and discoveries.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/branding-comms-/some-call-it-science--dsc_6636.jpg",
        name: 'Interactive Islands',
        description: "Put the Scientific Method to practice at six different activity stations, designed to spark your curiosity and push your critical thinking skills. Observe, question, experiment and draw conclusions as you engage with hands-on challenges that’ll have you thinking like a scientist!",
      },
    ]
  },
  {
    id: 11,
    name: 'Know Your Poo',
    key: 'know_your_poo',
    description: 'Know Your Poo is a seriously fun exhibition that touches on the topics of human waste, toilets, and sanitation! As you wind your way through the exhibition, you will discover how and why we need to poo. You also learn about the history and evolution of sanitation and toilets. The exhibition also highlights the urgent issue of the global divide. It then shows how engineering solutions might answer some of these challenges. Know Your Poo serves as a reminder that we all need to pay attention to the importance of providing good sanitation and practising good habits in order to safeguard our health and be a better society.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/know-your-poo/teaser_highlights/know-your-poo_highlight-1.jpg',
    hall: 'hall_b',
    mapPosition: { x: 65, y: 70 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/know-your-poo/teaser_highlights/know-your-poo_highlight-4.jpg",
        name: 'To Flush or Not To Flush?',
        description: "Have you ever flushed your pet fish down the toilet bowl? You may not be the only one! However, there are things you just should not flush down the loo. Challenge yourself to identify things you should or should not flush down the toilet bowl.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/know-your-poo/teaser_highlights/know-your-poo_highlight-1.jpg",
        name: 'How Well Do You Poo?',
        description: "Uncover what makes you poo and what affects your poo? Did you know that a doctor developed a chart to help patients describe their bowel movement known as the Bristol Stool Chart? Come and compare your poo against it.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/know-your-poo/teaser_highlights/know-your-poo_highlight-5.jpg",
        name: 'Cheeky Fart Chamber',
        description: "Encounter a chamber of surprises where secret whispers narrate why we fart and what makes fart smelly.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/know-your-poo/teaser_highlights/know-your-poo_highlight-3.jpg",
        name: 'Singapore Story',
        description: "What was it like to go to the toilet 60 years ago in Singapore? Take a journey back in time to see how Singapore has progressed from open defecation to the night soil truck to modern-day toilets in this section.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/know-your-poo/teaser/know-your-poo_teaser.jpg",
        name: 'Royal Throne',
        description: "This may not be the only Instagram-able spot in our exhibition, but this one is all about you! Let your hair down and have fun with this scene! Come play the part of Queen or King as you pose on the porcelain Royal Throne with your friends or family.",
      },
    ]
  },
  {
    id: 13,
    name: 'Phobia2: The Science of Fear',
    key: 'phobia2',
    description: 'Face your fears in an exciting journey of self-discovery. Understanding and managing fear can be entertaining! What is there to fear? Embark on a journey of self-discovery and find out what phobia really is. Welcome to the award-winning exhibition that explores the topic of fear, from its historical and cultural significance to the psychology and physiology of fear and how it affects our daily lives. Be prepared for something different and perhaps learn to better manage your own fears!',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/phobia/teasers/phobia-teaser.jpg',
    hall: 'hall_b',
    mapPosition: { x: 30, y: 80 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/phobia/highlights/phobia-highlight-01.jpg",
        name: 'Buried Alive',
        description: "Before the age of modern medicine, when the diagnosis of death was less accurate, coffins were often fitted with a bell-rigged device above-ground. Should a person awake from the dead (for those mistakenly buried alive), they would alert mourners of their ghastly plight.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/phobia/highlights/phobia-highlight-02.jpg",
        name: 'Public Speaking',
        description: "Gain confidence through a simulated public speaking scenario in front of an audience! Difficulty concentrating, dry mouths, trembling hands and reduced field of vision are all inclusive!",
      },
    ]
  },
  {
    id: 4,
    name: 'Earth Alive',
    key: 'earth_alive',
    description: "The Earth is constantly changing. Some changes are incremental, some are split-second, but both can result in violent events that devastate human communities. Experience Earth Alive, where you can encounter forces and processes that underlie Earth's changes. Through active, engaging exhibits and compelling visual displays, get a feel for some of Earth's physical functionings! The exhibits are organised into spheres that reflect Earth sciences and systems – Geosphere, Hydrosphere and Atmosphere. Each of these spheres looks at how Earth changes can manifest in the environment, causing phenomena such as earthquakes, tsunamis, mountain-building and rock strata, and volcanic eruptions. A fourth section, the Human Sphere, places people into the picture to highlight how Earth changes impact our lives in critical ways and how we can affect the Earth and respond to such changes.",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/earth-alive/teaser-image/earth-alive-web-teaser.jpg',
    hall: 'hall_b',
    mapPosition: { x: 75, y: 35 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/earth-alive/highlights/gaia.jpg",
        name: 'GAIA',
        description: "Be mesmerised by the GAIA, a 5-metre inflatable globe installation by artist Luke Jerram, featuring detailed NASA imagery of the Earth surface.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/earth-alive/highlights/giant-slinky.jpg",
        name: 'Giant Slinky',
        description: "Send dramatic P and S waves of an earthquake down a giant slinky!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/earth-alive/highlights/ar-sandbox.jpg",
        name: 'AR Sandbox',
        description: "Shape a landscape with sand and watch real-time topographic projections to make the connection between elevation and contour lines. You can create with your hands and watch the rain form a watershed.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/earth-alive/highlights/earth-visualisation.jpg",
        name: 'Earth Visualisation',
        description: "View visualisations of various Earth datasets on a high-resolution, multi-screen display. You can cue and combine visualisations via an interactive kiosk and watch them play out across the video wall.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/earth-alive/highlights/disaster-teamwork.jpg",
        name: 'Disaster Teamwork',
        description: "To reduce the impact of natural hazards, people need to work together and coordinate their efforts. Work with others to get the little human blocks to high ground and save them from a flood!",
      },
    ]
  },
  {
    id: 2,
    name: 'Dialogue with Time',
    key: 'dialogue_with_time',
    description: "Dialogue with Time is an interactive exhibition that shows ageing from an original perspective. By 2030, one third of the world's population will be over the age of 65. As this is an important social issue, we aim for individuals to experience and understand more about the ageing process and reconsider their perception of ageing.",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/dialogue-with-time/teasers/dialoguewithtime-teaser.jpg',
    hall: 'hall_b',
    mapPosition: { x: 35, y: 25 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/dialogue-with-time/heartdrum---science-of-ageing.jpg",
        name: 'Science of Ageing',
        description: "Ageing is an ongoing process that eventually causes an irreversible decline in body functions. Through the interactive exhibitions in this zone, individuals will be able to distinguish between natural causes of ageing and causes from external factors. We highlight common misconceptions associated to ageing such as the skin, bones and dementia.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/dialogue-with-time/carousels/dialoguewithtime-carousel-08.jpg",
        name: 'Guided Experience by our Senior Guides',
        description: "This guided experience is led by passionate retirees aged 60 and above, who will take you through six thoughtfully curated stations. With their lived experiences and wisdom, our senior guides bring each station to life by sharing personal stories, explaining exhibits, and facilitating meaningful discussions that challenge stereotypes and spark inter-generational dialogue.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/dialogue-with-time/dr1-guided-experience.jpg",
        name: 'My Aging Journey',
        description: "Following their stories, you’ll take part in a short activity where you can express what happy ageing means to you. This space invites open sharing and thoughtful reflection, encouraging a deeper understanding of how ageing is shaped by personal experience rather than societal expectations. Discover how we can collectively challenge stereotypes and embrace ageing as a meaningful, individual journey.",
      },
    ]
  },
  {
    id: 6,
    name: 'Energy',
    key: 'energy',
    description: "Energy is all around us. While we might often find it difficult to visualise energy, humankind has learnt how to harness energy for work. Jointly presented by Science Centre Singapore, the Energy Market Authority and SP Group, the Energy Story exhibition captures the story of how humankind has progressed off the back of energy discovery, and must now work towards a cleaner, more sustainable future. The exhibition features six zones of multimedia displays and interactives where visitors can learn about the sources, transformation and uses of energy, from natural cycles to modern applications. There are also exhibits featuring Singapore's own energy sector, raising awareness of our four energy switches and how we are working towards a greener energy mix. The exhibition also addresses our responsibility as energy consumers, presenting a vision of a clean and energy-efficient future.",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/energy/web-teaser.jpg',
    hall: 'hall_b',
    mapPosition: { x: 40, y: 45 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/energy/energy-carousel-images/energy-exhibition---energy-cycle.jpg",
        name: 'Energy Cycle',
        description: "Learn about energy cycles in nature by watching this animated feature that uses a special projection effect know as pepper's ghost.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/energy/energy-carousel-images/energy-exhibition---conservation-of-linear-momentum.jpg",
        name: 'Galilean Cannon',
        description: "There are many rules governing energy. Some of these produce cool observable effects and even record-breaking feats. Try your hand at the Galilean Cannon to discover how momentum is conserved and see how high you can propel the yellow ball!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/energy/energy-carousel-images/energy-exhibition---solar-power.jpg",
        name: 'Solar Power',
        description: "Energy can be generated from natural sources, such as the Sun, which gives us solar power. Work with a partner to direct the lamp onto the solar-powered gliders and make them fly!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/energy/energy-carousel-images/energy-exhibition---liquefied-natural-gas.jpg",
        name: 'Liquefied Natural Gas',
        description: "Fuel sources can be rarely used in their raw form. This interactive follows the transformation of raw natural gas to liquefied natural gas that we use to generate electricity.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/energy/energy-carousel-images/energy-exhibition---wind-turbine.jpg",
        name: "Singapore's Energy Story",
        description: "Discover Singapore's energy strategy for the future through our four switches - natural gas, solar power, regional power grids and low-carbon alternatives.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/energy/energy-carousel-images/energy-exhibition---future-power.jpg",
        name: "Power the City of the Future",
        description: "How will we power cities of the future? Challenge yourself as a single player or compete with friends in a multiplayer mode to see who can emerge a better planner by selecting the right mix of energy sources in this game.",
      },
    ]
  },
  {
    id: 1,
    name: 'Climate Changed',
    key: 'climate_changed',
    description: 'We are living in a changed world due to the consequences of climate change. There is still hope if everyone plays their part to avert this crisis. What will you do? Presented by Science Centre Singapore and supported by the Ministry of Sustainability and the Environment, the Climate Changed exhibition features two key zones – the Climate Action Show and Guilt Trip. Through multimedia displays, interactives, and immersive gameplay, visitors can learn about climate change and hopefully be more motivated to take urgent action to stem climate change and its impacts.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/climate-change/banner-photo.jpg',
    hall: 'hall_b',
    mapPosition: { x: 15, y: 20 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/climate-change/climate-action-show_updated.jpg",
        name: 'Climate Action Show',
        description: "Become a Climate Change Agent! Join Sheepy and Felicity and uncover how you can start playing your part to address climate change in this interactive show.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/climate-change/guilt-trip_updated.jpg",
        name: 'Guilt Trip',
        description: "How do your daily habits contribute to climate change? Test your knowledge across 5 different categories – Water Consumption, Emissions, Technology and Electricity Consumption, Food Production and Waste, as well as Recyclability and Sustainability – and learn climate-friendly tips in this game.",
      },
    ]
  },
  {
    id: 5,
    name: 'Ecogarden',
    key: 'ecogarden',
    description: 'Learn about sustainable living and ecological balance. The Ecogarden, short for ecology garden, is a living outdoor laboratory.  The plants here receive no special care. No attempt is made to control pests except for occasional pruning, mowing and necessary replanting. This provides an excellent setting for ecological studies. From our local king of fruits, the durian, to the common vegetables that you get in the market, take a walk around nature and discover more about the plants that you commonly see.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/eco-garden/teasers/ecogarden-teaser.jpg',
    hall: 'hall_d',
    mapPosition: { x: 20, y: 40 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/eco-garden/eu-yan-sang/image-in-content/healing-plants-area.jpg",
        name: 'Healing Plants for Natural Wellness',
        description: "Supported by Eu Yan Sang, the Ecogarden features many plants for their healing properties from the traditional Chinese medicine perspective. Some of these plants are also used by Malays and Indians in their traditional herbal medicine practices.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/eco-garden/ecogarden-highlight-01.jpg",
        name: 'Tree House',
        description: "Offering many elements of play and discovery like refuge, height, and physical challenge, this Tree house provides a gateway back to nature. Admire the panoramic view from atop!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/eco-garden/ecogarden-highlight-02.jpg",
        name: 'Sweet Potato Plant',
        description: "A popular plant, the sweet potato is often eaten as a snack. Its leaves are used in vegetable dishes and its roots are used to make tonics. Don’t miss the chance to check it out and many other plants at the Ecogarden!",
      },
    ]
  },
  {
    id: 16,
    name: 'Singapore Innovations',
    key: 'singapore_innovations',
    description: 'What inspired the Singaporean innovations that have made their mark in the world? How did the innovators move from ideation to realisation? Find out about the science and engineering behind these innovations – and explore each journey from ideation to realisation.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/singapore-innovations/teasers/singaporeinnovations-teaser.jpg',
    hall: 'hall_g',
    mapPosition: { x: 15, y: 15 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/singapore-innovations/highlights/singaporeinnovations-highlight-02.jpg",
        name: 'Vertical Farming System',
        description: "See an actual working model of the Vertical Farming System – an innovative way to grow vegetables where farmland is limited. Observe its patented water pulley system and how its intricate mechanism ensures that the veggies get adequate nutrients.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/singapore-innovations/highlights/singaporeinnovations-highlight-01.jpg",
        name: 'Rig by Keppel-FELS',
        description: "Did you know that Singapore, a country without oil and gas resources, is the world’s largest jackup rig manufacturer, that promotes oil exploitation? Be amazed by the huge jackup rig mock-up model and find out how it works!",
      },
    ]
  },
  {
    id: 8,
    name: 'Future Makers',
    key: 'future_makers',
    description: 'Engineering, the academic subject and the vocation, is much more than what it used to be. Learn the scope modern engineering offers to individuals and to society – from being highly specialised to highly specialised with multi-disciplinary, inter-disciplinary, and cross-disciplinary collaborations, from the conventional divisions to new divisions such as biomedical and nanotech materials fields.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/engineering/highlights/future-makers---robot-show.jpg',
    hall: 'hall_g',
    mapPosition: { x: 80, y: 55 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/engineering/highlights/future-makers---robot-show.jpg",
        name: 'Robots at the Object Theatre',
        description: "Watch four industrial robotic arms carry large screens as they move to a video that tells the story of modern engineering and the issues they pose. ",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/engineering/highlights/future-makers---escape-rooms.jpg",
        name: 'Ginger Lily',
        description: "Experience Ginger Lily in a fun and safe way! Make your way to the spaceship with the five secret codes in hand. Apply your problem-solving wits to repair and reactivate the crashed spacecraft to save the world from an alien invasion.",
      },
    ]
  },
  {
    id: 7,
    name: 'Everyday Science',
    key: 'everyday_science',
    description: 'From the vast sky to the smallest microbe, there is science to be seen, felt, heard, and observed.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/everyday-science/dsc_6491.jpg',
    hall: 'hall_d',
    mapPosition: { x: 60, y: 50 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/everyday-science/dsc_6480.jpg",
        name: 'Daylight Wonders',
        description: "Why is the sky blue? How do rainbows form? Take a stroll down the corridor of light and marvel at the different colours.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/everyday-science/dsc_6459(resize).jpg",
        name: 'Everyday Encounters',
        description: "Levitating balls and invisibility shields – this is not a movie! Try them out in our gallery.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/everyday-science/dsc_6352.jpg",
        name: 'Periodic Playground',
        description: "Our world is made up of tiny building blocks called the elements. Explore their various properties in this colourful zone.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/everyday-science/dsc_6428.jpg",
        name: 'The Garden',
        description: "Test out various properties of water, the liquid so important to life. Observe the diversity of the bacteria kingdom and notice the curious ways plants grow.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/everyday-science/dsc_6394-3.jpg",
        name: 'A Walk in the Night',
        description: "Get your flashlights out and navigate the foggy streets!",
      },
    ]
  },
  {
    id: 3,
    name: 'E3 - E-mmersive Experiential Environments',
    key: 'e3',
    description: 'Immerse yourself in some of the latest visualisation technologies on this journey from the ends of the universe to the recesses of our brains. E-mmersive Experiential Environments is an immersive exhibition featuring virtual reality headsets and 3D 360-degree environments. Using this technology, you will be taken on a journey to the outer reaches of the known universe, and into the deep recesses of the human brain.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/e3-revamp/teaser/e3_teaser.jpg',
    hall: 'hall_c',
    mapPosition: { x: 55, y: 30 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/e3-revamp/highlights/hightlight_36027dbda87e49644a59406828fe8103952.jpg",
        name: '360 Wall Projection',
        description: "Step into a virtual forest built using the Unreal game engine and projection mapped onto the walls using real-time 3D rendering technology. In this environment, visitors will experience day and night transition, weather changes and interact with fishes along the central river.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/activities-workshops/visualisation-series/visualisation-table.jpg",
        name: 'Touch Table',
        description: "Learn and discover about live animals and human anatomy through powerful 3D visualizations, be curious as you digitally investigate the insides of objects like never before, all at the touch of your fingertips.",
      },
    ]
  },
  {
    id: 21,
    name: 'The Tinkering Studio',
    key: 'tinkering_studio',
    description: "Discover the magic of hands-on learning at Tinkering Studio Singapore! Dive into a world where creativity meets technology, fostering endless exploration and the joy of making. It's a space where imagination truly comes to life.",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/tinkering-studio/teasers/tinkeringstudio-teaser.jpg',
    hall: 'hall_e',
    mapPosition: { x: 40, y: 40 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/tinkering-studio/carousel/tinkeringstudio-carousel-04.jpg",
        name: 'Pinball Machine',
        description: "Launch the pinball and watch it clear the obstacle you have set or see how many bells you can ring before the ball stops.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/tinkering-studio/highlights/tinkeringstudio-highlight-02.jpg",
        name: 'Wind Table',
        description: "Make your own light-weight flying designs using various materials and watch how they swirl, lift and glide over the wind table! It’s the most fun way to learn how wind can create lift!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/tinkering-studio/carousel/tinkeringstudio-carousel-08.jpg",
        name: 'Marble Machine',
        description: "Come and build and explore the different materials and ways of building a path from top to bottom for your marble can travel!",
      },
    ]
  },
  {
    id: 9,
    name: 'Going Viral Travelling Exhibition',
    key: 'going_viral',
    description: 'Modern day pandemic interventions did not arise overnight. From antiquity to the present, countless individuals have contributed to the evolution of knowledge. Discover for yourself the arduous journey science has taken. But this is as much a story about viruses as about us humans and how we can all come together to build better futures.',
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/going-viral-travelling-exhibition/dsc_5729.jpg',
    hall: 'hall_c',
    mapPosition: { x: 25, y: 60 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/going-viral-travelling-exhibition/dsc_5545.jpg",
        name: 'Let’s Get Quizzical!',
        description: "Test your knowledge as well as learn about the dangers of the infodemic.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/going-viral-travelling-exhibition/dsc_5422.jpg",
        name: 'Reflections from the Pandemic',
        description: "Pandemics are social – crises can bring the best out of people. Together we can build a kinder and more gracious society. Marvel at paper dioramas created specially for the exhibition by artist Cheryl Teo.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/going-viral-travelling-exhibition/dsc_5492.jpg",
        name: 'The Plague Doctor',
        description: "Find out why plague doctors wore these masks hundreds of years ago.",
      },
    ]
  },
  {
    id: 17,
    name: 'Smart Nation PlayScape',
    key: 'smart_nation',
    description: "What makes up a Smart Nation? What are the technologies powering Singapore's Smart Nation initiatives? The exhibition consists of eight technology zones. Through a series of gamified exhibits and multimedia elements, each zone gives an in-depth yet easy to understand explanation on how the technology came about, how it works, and its importance to Singapore today. The exhibition also provides an opt-in personalised experience, whereby one could collect digital stamps and snapshots of his/her own PlayScape journey through the various exhibits and get a soft copy of the digital 'PlayScape Passport' via email.",
    image: 'https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/smart-nation-playscape/dsc_1674.jpg',
    hall: 'hall_f',
    mapPosition: { x: 35, y: 20 },
    displays: [
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/smart-nation-playscape/dsc_1674.jpg",
        name: 'Geospatial',
        description: "Geospatial technology helps us better understand where things are in relation to one another, and how it can help us plan and build thriving communities. Add blocks representing different elements such as schools, houses, parks to the city, and observe how the quality-of-life changes!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/smart-nation-playscape/dsc_1747.jpg",
        name: 'Make a Face!',
        description: "Do you appear ‘happier’ than your friends? Through biometric technology, computers can analyse your face and determine who makes the best expression!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/smart-nation-playscape/dsc_1721.jpg",
        name: 'Rubik’s Cube solving robot',
        description: "Take a look at the steps that this robot takes to solve the Rubik’s cube that you messed up!",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/smart-nation-playscape/dsc_1813.jpg",
        name: 'The Cabinet of Curiosity',
        description: "A display of seemingly random daily items that actually relate to the various technologies and plays a part in building up our Smart Nation.",
      },
      {
        image: "https://www.science.edu.sg/images/default-source/scs-images/whats-on/exhibitions/smart-nation-playscape/dsc_1824.jpg",
        name: 'PlayScape Passport – the personalised experience',
        description: "Choose to register yourself at the sign-up kiosks via biometric technology (facial recognition). Let the exhibits ‘recognise’ you and have your Playscape journey recorded in a digital Playscape Passport that you can email to yourself!",
      },
    ]
  },
];

export default function CameraToNavigationScreen() {
  const cameraRef = useRef<any>(null); // CameraView ref
  const router = useRouter();

  const [isDetecting, setIsDetecting] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [currentExhibitIndex, setCurrentExhibitIndex] = useState(0);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [stepCount, setStepCount] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('North');

  // Initialize sensors
  React.useEffect(() => {
    let accelerometerSubscription: any;
    let magnetometerSubscription: any;
    let stepDetectionInterval: any;
    let lastAcceleration = 0;
    let stepThreshold = 1.2;
    let lastStepTime = 0;

    const startSensors = async () => {
      // Set update intervals
      Accelerometer.setUpdateInterval(100);
      Magnetometer.setUpdateInterval(200);

      // Subscribe to accelerometer for step detection
      accelerometerSubscription = Accelerometer.addListener(accelerometerData => {
        setAccelerometerData(accelerometerData);
        
        // Calculate magnitude of acceleration
        const { x, y, z } = accelerometerData;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        
        // Simple step detection algorithm
        const now = Date.now();
        if (magnitude > stepThreshold && 
            magnitude > lastAcceleration && 
            now - lastStepTime > 300) { // Minimum 300ms between steps
          setStepCount(prev => prev + 1);
          setTotalDistance(prev => prev + 0.7); // Average step length ~0.7m
          lastStepTime = now;
        }
        lastAcceleration = magnitude;
      });

      // Subscribe to magnetometer for direction
      magnetometerSubscription = Magnetometer.addListener(magnetometerData => {
        setMagnetometerData(magnetometerData);
        
        // Calculate heading from magnetometer data
        const { x, y } = magnetometerData;
        let heading = Math.atan2(y, x) * (180 / Math.PI);
        if (heading < 0) heading += 360;
        
        // Convert heading to cardinal direction
        let direction = 'North';
        if (heading >= 315 || heading < 45) direction = 'North';
        else if (heading >= 45 && heading < 135) direction = 'East';
        else if (heading >= 135 && heading < 225) direction = 'South';
        else if (heading >= 225 && heading < 315) direction = 'West';
        
        setCurrentDirection(direction);
      });
    };

    startSensors();

    return () => {
      accelerometerSubscription?.remove();
      magnetometerSubscription?.remove();
      if (stepDetectionInterval) clearInterval(stepDetectionInterval);
    };
  }, []);

  // Get current and next exhibit from the path
  const currentExhibit = exhibitPath[currentExhibitIndex] || exhibitPath[0];
  const nextExhibitIndex = (currentExhibitIndex + 1) % exhibitPath.length;
  const nextExhibit = exhibitPath[nextExhibitIndex] || exhibitPath[1];
  const currentHall = currentExhibit.hall;

  // Helper to map API result to exhibit index
  const getExhibitByKey = (exhibitKey: string): { exhibit: typeof exhibitPath[0]; hall: string; index: number } => {
    const index = exhibitPath.findIndex(ex => ex.key === exhibitKey);
    if (index === -1 || !exhibitKey) {
      return { exhibit: exhibitPath[0], hall: exhibitPath[0].hall, index: 0 };
    }
    const exhibit = exhibitPath[index];
    return { exhibit, hall: exhibit.hall, index };
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setError('');
    try {
      if (!cameraRef.current) throw new Error('Camera not ready');
      
      // Take photo with base64 enabled
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true,
        quality: 0.7 // Reduce quality to make base64 smaller
      });
      
      if (!photo || !photo.uri) throw new Error('Failed to capture photo');
      if (!photo.base64) throw new Error('Failed to get base64 data');
      console.log('Photo object:', photo);

      // Prepare JSON payload with base64 image
      const payload = {
        image: `data:image/jpeg;base64,${photo.base64}`
      };

      // Send to Flask API
      const response = await fetch('https://brightly-enormous-pigeon.ngrok-free.app/detect_base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      // Expecting { exhibit: 'zoetrope' } or similar
      const exhibitKey = result.exhibit;
      
      if (!exhibitKey || exhibitKey === 'unknown') {
        throw new Error('Could not identify exhibit from image');
      }
      
      const { exhibit, hall, index } = getExhibitByKey(exhibitKey);
      setCurrentExhibitIndex(index);
      setLocationDetected(true);
     setShowCamera(false); // Return to nav menu after successful detection
      
      await AsyncStorage.setItem(
        'ssc_current_location',
        JSON.stringify({ hall, exhibit: exhibitKey, index })
      );
      DeviceEventEmitter.emit('ssc_location_changed', { hall, exhibit: exhibitKey, index });
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Detection failed';
      console.error('Detection error:', err);
      setError(errorMsg);
      Alert.alert('Detection Error', errorMsg);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleDetectAgain = () => {
    setShowCamera(true);
    setLocationDetected(false);
    setError('');
  };

  const handleNextExhibit = async () => {
    setCurrentExhibitIndex(nextExhibitIndex);
    setStepCount(0); // Reset step count when moving to next exhibit
    setTotalDistance(0); // Reset total distance when moving to next exhibit
    const next = exhibitPath[nextExhibitIndex];
    await AsyncStorage.setItem('ssc_current_location', JSON.stringify({ hall: next.hall, exhibit: next.key, index: nextExhibitIndex }));
    DeviceEventEmitter.emit('ssc_location_changed', { hall: next.hall, exhibit: next.key, index: nextExhibitIndex });
  };

  const getNavigationInfo = () => {
    const current = currentExhibit.mapPosition;
    const next = nextExhibit.mapPosition;
    const deltaX = next.x - current.x;
    const deltaY = next.y - current.y;
    const baseDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Use sensor data to modify distance and steps
    const adjustedDistance = Math.max(1, baseDistance - (totalDistance * 0.1)); // Reduce distance as user moves
    const adjustedSteps = Math.max(0, Math.round(adjustedDistance * 2) - stepCount);

    // Use magnetometer direction, but fall back to calculated direction
    let fallbackDirection = '';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      fallbackDirection = deltaX > 0 ? 'East' : 'West';
    } else {
      fallbackDirection = deltaY > 0 ? 'South' : 'North';
    }

    return { 
      distance: Math.round(adjustedDistance), 
      steps: adjustedSteps, 
      direction: currentDirection || fallbackDirection 
    };
  };

  const navigationInfo = getNavigationInfo();

  // Get unique map image for current exhibit
  const getMapImageForExhibit = (exhibitKey: string) => {
    const mapImages: Record<string, string> = {
      'kinetic_garden': 'https://i.imgur.com/NF7WVY5.png',
      'minds_eye': 'https://i.imgur.com/4t0Xtcw.png',
      'laser_maze': 'https://i.imgur.com/7AKHjGj.png',
      'mirror_maze': 'https://i.imgur.com/uXbgGhm.png',
      'giant_zoetrope': 'https://i.imgur.com/M71vqcs.png',
      'waterworks': 'https://i.imgur.com/8udgEnu.png',
      'urban_mutations': 'https://i.imgur.com/DT4TZni.png',
      'savage_garden': 'https://i.imgur.com/sOvinHc.png',
      'some_call_it_science': 'https://i.imgur.com/dqGpqIc.png',
      'know_your_poo': 'https://i.imgur.com/6bnTsMP.png',
      'phobia2': 'https://i.imgur.com/tR0R65c.png',
      'earth_alive': 'https://i.imgur.com/cBiPZB1.png',
      'dialogue_with_time': 'https://i.imgur.com/h3h0OLG.png',
      'energy': 'https://i.imgur.com/QOyi2IG.png',
      'climate_changed': 'https://i.imgur.com/HvQ2Icg.png',
      'ecogarden': 'https://i.imgur.com/KCEu5jH.png',
      'singapore_innovations': 'https://i.imgur.com/wpJ23HJ.png',
      'future_makers': 'https://i.imgur.com/Z0UOv3k.png',
      'everyday_science': 'https://i.imgur.com/7qT2lGl.png',
      'e3': 'https://i.imgur.com/m1Qvmfa.png',
      'tinkering_studio': 'https://i.imgur.com/KkZhLHd.png',
      'going_viral': 'https://i.imgur.com/nxIDrTe.png',
      'smart_nation': 'https://i.imgur.com/dBip4jT.png',
    };
    return mapImages[exhibitKey] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg';
  };

  if (!locationDetected || showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
        {showCamera && (
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => {
              setShowCamera(false);
              setLocationDetected(true);
            }}
          >
            <View style={styles.cancelButtonContent}>
              <ArrowLeft color="white" size={20} />
              <Text style={styles.cancelButtonText}>Back</Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.cameraOverlay}>
          <View style={styles.detectionFrame} />
          <Text style={styles.cameraInstructions}>
            {showCamera ? 'Point camera at new exhibit to update exhibit display' : 'Point camera at your surroundings to detect exhibitdisplay'}
          </Text>
          {!!error && (
            <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.detectButton}
          onPress={handleDetectLocation}
          disabled={isDetecting}
        >
          <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.detectButtonGradient}>
            <Eye color="white" size={20} />
            <Text style={styles.detectButtonText}>
              {isDetecting ? 'Detecting Location...' : showCamera ? 'Update Exhibit Display' : 'Detect Exhibit Display'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <LinearGradient colors={['#FF6B35', '#FF8C42']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{currentHall.replace('_', ' ').toUpperCase()} Navigation</Text>
            <Text style={styles.headerSubtitle}>Interactive Exhibit Guide</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.detectAgainSection}>
        <TouchableOpacity style={styles.detectAgainButton} onPress={handleDetectAgain}>
          <Eye color="#FF6B35" size={18} />
          <Text style={styles.detectAgainText}>Detect Exhibit Display</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.currentLocationSection}>
          <View style={styles.locationHeader}>
            <MapPin color="#FF6B35" size={20} />
            <Text style={styles.currentLocationTitle}>You are currently in:</Text>
          </View>
          <Text style={styles.currentExhibitName}>
            "{currentExhibit.name}"
          </Text>
        </View>

        <View style={styles.exhibitDetailsSection}>
          <Image source={{ uri: currentExhibit.image }} style={styles.exhibitImage} />
          <Text style={styles.exhibitName}>{currentExhibit.name}</Text>
          <Text style={styles.exhibitDescription}>{currentExhibit.description}</Text>
          <Text style={styles.displayText}>Exhibit Displays </Text>
          {currentExhibit.displays?.map((item, index) => (
            <View key={index}>
              <Image source={{ uri: item.image }} style={styles.exhibitImage} />
              <Text style={styles.exhibitName}>{item.name}</Text>
              <Text style={styles.exhibitDescription}>{item.description}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.nextExhibitButton} onPress={handleNextExhibit}>
            <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.detectButtonGradient}>
              <Navigation color="white" size={20} />
              <Text style={styles.detectButtonText}>Go to Next Exhibit</Text>
              <ChevronRight color="white" size={20} />
            </LinearGradient>
          </TouchableOpacity></View>

          
        
        {/* Map to Next Exhibit Section */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Map to Next Exhibit</Text>
          
          {/* Map Image Placeholder */}
          <View style={styles.mapImagePlaceholder}>
            <Image
    source={{uri: getMapImageForExhibit(currentExhibit.key)}}
    style={{ width: '100%', height: '100%', borderRadius: 10 }}
    resizeMode="cover"
  />
          </View>
          
          <View style={styles.mapContainer}>
            <View style={styles.map}>
              {/* Map background */}
              <View style={styles.mapBackground} />
              
              {/* Hall label */}
              <Text style={styles.hallLabel}>Exhibit {currentExhibitIndex + 1} of {exhibitPath.length}</Text>
              
              {/* Show current and next few exhibits */}
              {exhibitPath.slice(Math.max(0, currentExhibitIndex - 2), currentExhibitIndex + 5).map((exhibit, relativeIndex) => {
                const actualIndex = Math.max(0, currentExhibitIndex - 2) + relativeIndex;
                return (
                <View
                  key={exhibit.id}
                  style={[
                    styles.mapMarker,
                    {
                      left: `${10 + relativeIndex * 15}%`,
                      top: `${40}%`,
                    },
                    actualIndex === currentExhibitIndex && styles.currentMapMarker
                  ]}
                >
                  <View style={[
                    styles.markerDot,
                    actualIndex === currentExhibitIndex && styles.currentMarkerDot
                  ]} />
                  <Text style={[
                    styles.markerLabel,
                    actualIndex === currentExhibitIndex && styles.currentMarkerLabel
                  ]}>
                    {actualIndex + 1}
                  </Text>
                </View>
              );
              })}
              
              
            </View>
            
            {/* Map Legend */}
            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <View style={styles.currentLegendDot} />
                <Text style={styles.legendText}>Current Location</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.otherLegendDot} />
                <Text style={styles.legendText}>Path Exhibits</Text>
              </View>
            </View>
          </View>
            <View style={styles.navigationDetails}>
              <View style={styles.navigationItem}>
                <Ruler color="#666" size={16} />
                <Text style={styles.navigationText}>Distance: {navigationInfo.distance}m (Live)</Text>
              </View>
              <View style={styles.navigationItem}>
                <Footprints color="#666" size={16} />
                <Text style={styles.navigationText}>Steps: ~{navigationInfo.steps} (Tracked: {stepCount})</Text>
              </View>
              <View style={styles.navigationItem}>
                <Navigation color="#666" size={16} />
                <Text style={styles.navigationText}>Direction: {navigationInfo.direction} (Live)</Text>
              </View>
            </View>
        </View>
        

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>

  );
}


const styles = StyleSheet.create({
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  detectionFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#FF6B35',
    borderRadius: 12,
    marginBottom: 20,
  },
  cameraInstructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  detectButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    zIndex: 1000,
  },
  detectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  detectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
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
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  currentLocationTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  currentExhibitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  exhibitDetailsSection: {
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
  exhibitImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  exhibitName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exhibitDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  nextExhibitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
  },
  navigationInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  navigationDetails: {
    gap: 8,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navigationText: {
    fontSize: 14,
    color: '#666',
  },
  mapSection: {
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
  mapImagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  mapContainer: {
    alignItems: 'center',
  },
  map: {
    width: width - 80,
    height: 200,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
  },
  hallLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  currentMapMarker: {
    zIndex: 10,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CCC',
    borderWidth: 2,
    borderColor: 'white',
  },
  currentMarkerDot: {
    backgroundColor: '#FF6B35',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  markerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 2,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  currentMarkerLabel: {
    color: '#FF6B35',
  },
  pathLine: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  progressLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 20,
  },
  currentLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
  },
  otherLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CCC',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  cancelButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  cancelButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  detectAgainSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detectAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detectAgainText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  displayText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
});