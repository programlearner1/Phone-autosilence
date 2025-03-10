import { messaging, requestNotificationPermission } from '../firebase';

export const testFirebaseSetup = async () => {
  try {
    // Test 1: Check environment variables
    const requiredEnvVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
      'REACT_APP_FIREBASE_APP_ID',
      'REACT_APP_FIREBASE_VAPID_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars);
      return false;
    }
    console.log('✅ Environment variables check passed');

    // Test 2: Check messaging initialization
    if (!messaging) {
      console.error('❌ Firebase messaging not initialized');
      return false;
    }
    console.log('✅ Firebase messaging initialized');

    // Test 3: Request notification permission
    const token = await requestNotificationPermission();
    if (!token) {
      console.error('❌ Could not get FCM token');
      return false;
    }
    console.log('✅ FCM token obtained:', token);

    // Test 4: Check service worker registration
    const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
    if (!registration) {
      console.error('❌ Service worker not registered');
      return false;
    }
    console.log('✅ Service worker registered');

    // All tests passed
    console.log('✅ All Firebase tests passed');
    return true;
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return false;
  }
}; 