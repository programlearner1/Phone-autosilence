import config from '../config';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token
export const getFCMToken = async () => {
  try {
    const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      throw new Error('VAPID key is not configured');
    }

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey
    });
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token:', err);
    return null;
  }
};

export const sendNotification = async (message: string, title?: string) => {
  try {
    const token = await getFCMToken();
    if (!token) {
      throw new Error('No FCM token available');
    }

    const response = await fetch(`${config.apiUrl}/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        token,
        message,
        title
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("📩 Notification sent successfully!");
    } else {
      console.error("❌ Notification sending failed:", data.error);
    }
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};