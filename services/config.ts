/**
 * Configuration for Flask Backend Connection
 * 
 * ⚠️  IMPORTANT: YOU MUST UPDATE THE IP ADDRESS BELOW! ⚠️
 * 
 * For mobile development:
 * 1. Find your computer's IP address:
 *    - Windows: Run 'ipconfig' in command prompt, look for IPv4 Address
 *    - Mac/Linux: Run 'ifconfig' or 'ip addr show', look for inet address
 * 2. Replace 'YOUR_COMPUTER_IP' below with your actual IP address
 * 3. Make sure your Flask backend is running on port 5000
 * 4. Ensure your mobile device and computer are on the same network
 * 
 * Common IP address examples:
 * - 192.168.1.XXX (home networks)
 * - 192.168.0.XXX (some home networks)  
 * - 10.0.0.XXX (some corporate networks)
 */

// ✅ Updated with your computer's IP address from Flask output
export const FLASK_BASE_URL = 'http://192.168.1.5:5002'; // Your actual IP address

// Alternative configuration for different environments
export const CONFIG = {
  // Use this for local web development
  WEB_DEV: 'http://192.168.1.5:5002',
  
  // ✅ Updated with your computer's IP address from Flask output  
  MOBILE_DEV: 'http://192.168.1.5:5002', // Your actual IP address
  
  // Use this for production
  PRODUCTION: 'https://backend-ugfp.onrender.com'
};

// Auto-detect environment (you can modify this logic as needed)
export const getApiUrl = (): string => {
  // For now, always use mobile dev URL
  // You can add logic here to detect web vs mobile environment
  return CONFIG.PRODUCTION;
};

export default {
  FLASK_BASE_URL,
  CONFIG,
  getApiUrl
}; 
