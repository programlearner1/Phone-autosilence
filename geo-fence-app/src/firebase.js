import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Validate Firebase configuration
const validateFirebaseConfig = (config) => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !config[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }

  if (!config.apiKey.startsWith('AIza')) {
    throw new Error('Invalid Firebase API key format. API key should start with "AIza"');
  }

  if (!/^[a-z0-9-]+$/.test(config.projectId)) {
    throw new Error('Invalid Firebase Project ID format');
  }
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let messaging;

try {
  validateFirebaseConfig(firebaseConfig);
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Convert VAPID key to the correct format if needed
const formatVapidKey = (key) => {
  if (!key) return null;
  key = key.trim();
  return /^B[A-Za-z0-9_-]+$/.test(key) ? key : null;
};

// Request permission for notifications
export const requestNotificationPermission = async () => {
  try {
    let vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('❌ VAPID key is not configured');
      throw new Error('VAPID key is not configured');
    }

    vapidKey = formatVapidKey(vapidKey);
    if (!vapidKey) {
      console.error('❌ Invalid VAPID key format');
      throw new Error('Invalid VAPID key format');
    }

    // Ensure service worker is registered before getting token
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered successfully');

    // Get the token with proper error handling
    try {
      const currentToken = await getToken(messaging, { 
        vapidKey,
        serviceWorkerRegistration
      });
      
      if (currentToken) {
        console.log("✅ FCM Token obtained");
        return currentToken;
      } else {
        console.warn("⚠️ No registration token available");
        return null;
      }
    } catch (tokenError) {
      console.error("❌ Error getting token:", tokenError);
      if (tokenError.code === 'messaging/failed-service-worker-registration') {
        console.error("❌ Service Worker registration failed");
      } else if (tokenError.message?.includes('INVALID_ARGUMENT')) {
        console.error("❌ Invalid Firebase configuration. Please check your API key and project settings.");
      }
      throw tokenError;
    }
  } catch (error) {
    console.error("❌ Error in notification setup:", error);
    throw error;
  }
};

export { messaging, getToken, onMessage };