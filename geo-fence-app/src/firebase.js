import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only once
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Request permission for notifications
export const requestNotificationPermission = async () => {
  try {
    const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      throw new Error('VAPID key is not configured');
    }

    // Ensure service worker is registered before getting token
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    // Get the token with proper error handling
    try {
      const currentToken = await getToken(messaging, { 
        vapidKey,
        serviceWorkerRegistration
      });
      
      if (currentToken) {
        console.log("✅ FCM Token obtained:", currentToken);
        return currentToken;
      } else {
        console.warn("⚠️ No registration token available");
        return null;
      }
    } catch (tokenError) {
      console.error("❌ Error getting token:", tokenError);
      // Check if the error is related to the VAPID key
      if (tokenError.message?.includes('atob')) {
        console.error("❌ Invalid VAPID key format. Please check your VAPID key in environment variables.");
      }
      return null;
    }
  } catch (error) {
    console.error("❌ Error in notification setup:", error);
    return null;
  }
};

// Export the required Firebase functions
export { getToken, onMessage };