/**
 * Simple script to test Flask backend connection
 * Run this with: node test-flask-connection.js
 */

const { CONFIG } = require('./services/config.ts');

// Change this to your computer's IP address
const FLASK_URL = 'http://YOUR_COMPUTER_IP:5000'; // 🔧 UPDATE THIS!

async function testFlaskConnection() {
  console.log('🧪 Testing Flask Backend Connection...\n');
  
  try {
    console.log(`🔗 Testing connection to: ${FLASK_URL}/health`);
    
    const response = await fetch(`${FLASK_URL}/health`);
    
    if (!response.ok) {
      console.error(`❌ Connection failed with status: ${response.status}`);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Connection successful!');
    console.log('📋 Response:', JSON.stringify(result, null, 2));
    
    if (result.status === 'healthy') {
      console.log('✅ Flask backend is healthy');
      
      if (result.models_loaded?.age_gender && result.models_loaded?.emotion) {
        console.log('✅ All AI models are loaded and ready');
        console.log('\n🎉 Everything looks good! Your React Native app should work.');
      } else {
        console.log('⚠️  Some AI models are not loaded');
        console.log('🔧 Check that age_gender_model.h5 and emotion_model.h5 are in backend/asset/');
      }
    } else {
      console.log('❌ Flask backend is not healthy');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Flask backend is running: cd backend && python app.py');
    console.log('2. Check your computer\'s IP address:');
    console.log('   - Windows: ipconfig');
    console.log('   - Mac/Linux: ifconfig');
    console.log(`3. Update the FLASK_URL in this file: ${FLASK_URL}`);
    console.log('4. Make sure your computer and phone are on the same WiFi network');
  }
}

// Run the test
testFlaskConnection(); 