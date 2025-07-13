# 🔬 Singapore Science Centre Interactive AI Vision App

<div align="center">

![Singapore Science Centre Logo](./assets/images/logo.png)

**Transform your science centre visit with intelligent AI-powered experiences!**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.19-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**👨‍💻 Developed by [Richmond C. Constante](https://github.com/richmondconstante)**

</div>

## 📱 **Overview**

The Singapore Science Centre Interactive AI Vision App is a revolutionary mobile application that combines cutting-edge artificial intelligence with immersive science education. Using real-time facial recognition, age detection, and emotion analysis, the app delivers personalized recommendations and interactive experiences tailored to each visitor's profile.

### 🎯 **Key Features**

- **🤖 AI Vision Technology**: Real-time face detection, age classification, and emotion recognition
- **🎨 Personalized Recommendations**: Smart exhibit suggestions based on visitor demographics and emotional state
- **🎫 Seamless Booking**: Easy ticket purchasing with AI-assisted selection
- **📊 Interactive Dashboard**: Explore 50+ exhibitions, 100+ activities, and immersive experiences
- **👨‍💼 Admin Analytics**: Comprehensive visitor insights and system management tools
- **🔒 Privacy-First Design**: No permanent storage of facial data, GDPR compliant

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator
- Physical device with camera for AI features

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/rcconstante/SingaporeScienceCentre.git
   cd 
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Run on device/simulator**
   ```bash
   # iOS Simulator (macOS only)
   npx expo run:ios
   
   # Android Emulator
   npx expo run:android
   
   # Physical device (scan QR code with Expo Go app)
   npx expo start
   ```

## 📖 **Usage**

### **For Visitors**

1. **Launch the app** and tap "Get Started"
2. **Select "USER LOGIN"** (orange button)
3. **Use demo credentials**:
   - Email: `guest@science.sg`
   - Password: `demo123`
4. **Explore features**:
   - Browse exhibitions and activities
   - Try AI Vision face analysis
   - Book tickets with smart recommendations
   - Access personalized content

### **For Administrators**

1. **Select "ADMINISTRATOR"** (blue button)
2. **Use admin credentials**:
   - Email: `admin@science.sg`
   - Password: `demo123`
3. **Access admin features**:
   - Monitor real-time visitor analytics
   - Control AI vision system
   - View demographic insights
   - Manage exhibition performance

## 🏗️ **Project Structure**

```
singapore-science-centre-app/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── index.tsx          # Main entry point
│   ├── ai-vision.tsx      # AI Vision feature
│   ├── admin-dashboard.tsx # Admin interface
│   └── ...
├── assets/                # Images and static assets
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
└── tsconfig.json         # TypeScript configuration
```

## 🤖 **AI Features**

### **Face Detection & Analysis**
- **Multi-face Detection**: Up to 10 faces simultaneously
- **Age Classification**: Child (0-17) vs Adult (18+)
- **Emotion Recognition**: 8 categories (Happy, Interested, Confused, Bored, Excited, Neutral, Surprised, Focused)
- **Attention Tracking**: Real-time engagement monitoring (0-100%)

### **Smart Recommendations**
- **Child + Happy**: "Try the Fire Tornado demo or KidsSTOP hands-on experiments!"
- **Adult + Interested**: "Explore Future Tech exhibition and climate science displays!"
- **Mixed Groups**: "Perfect family visit! Experience Earth Alive and KITZ shows!"

## 🔧 **Configuration**

### **Environment Setup**

1. **Camera Permissions**: Automatically requested on first AI Vision use
2. **Location Services**: Optional for enhanced recommendations
3. **Privacy Settings**: Configurable in user profile

### **Admin Configuration**

- AI model sensitivity settings
- Response customization
- Analytics parameters
- System monitoring thresholds

## 📊 **Technology Stack**

- **Frontend**: React Native 0.79.5
- **Framework**: Expo 53.0.19
- **Language**: TypeScript 5.8.3
- **Animations**: React Native Reanimated 3.17.4
- **Navigation**: Expo Router 5.1.3
- **Camera**: Expo Camera 16.1.10
- **Styling**: React Native StyleSheet with Linear Gradients

## 🧪 **Development**

### **Available Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build:web

# Run linting
npm run lint

# Clear cache and restart
npm start -- --clear
```

### **Testing AI Features**

1. **Face Detection**: Point camera at faces in good lighting
2. **Age Classification**: Test with various age groups
3. **Emotion Recognition**: Try different facial expressions
4. **Multi-face**: Test with multiple people in frame

## 📱 **Deployment**

### **Production Build**

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Build for Web
npm run build:web
```

### **App Store Deployment**

1. Configure `app.json` with production settings
2. Generate production builds
3. Submit to Apple App Store and Google Play Store
4. Configure deep linking and permissions

## 🔒 **Privacy & Security**

- **No Data Storage**: Facial data is not permanently stored
- **Local Processing**: AI analysis happens on-device
- **GDPR Compliant**: Full privacy controls for users
- **Encrypted Communication**: Secure data transmission
- **Consent Management**: Clear opt-in/opt-out mechanisms

## 🐛 **Troubleshooting**

### **Common Issues**

**Camera not working?**
- Check camera permissions in device settings
- Ensure good lighting conditions
- Try restarting the app

**AI detection poor performance?**
- Position face clearly in frame
- Remove sunglasses or face coverings
- Ensure adequate lighting

**App crashes?**
- Check available storage (need 200MB+)
- Update to latest version
- Clear app cache

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow TypeScript strict mode
- Use React Native best practices
- Maintain privacy-first approach
- Test AI features thoroughly
- Document new features

## 📞 **Support**

- **Email**: enquiry@science.edu.sg
- **Phone**: +65 6425 2500
- **Address**: 15 Science Centre Road, Singapore 609081
- **Hours**: Daily 10:00 AM - 6:00 PM

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Developer**

**Richmond C. Constante** - 

## 🙏 **Acknowledgments**

- **Richmond C. Constante** for developing this innovative AI-powered application
- Singapore Science Centre for vision and requirements
- React Native community for excellent framework
- Expo team for development tools
- AI/ML community for emotion recognition research

---

<div align="center">

**Developed by Richmond C. Constante with ❤️ for Singapore Science Centre**

[Download on App Store](#) | [Get it on Google Play](#) | [Visit Science Centre](https://www.science.edu.sg)

</div> 
