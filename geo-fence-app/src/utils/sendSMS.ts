import config from '../config';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCRhcD6DjPKUwmgEM42YTwQj-dJusatXlQ",
  authDomain: "phone-silencer-33c2f.firebaseapp.com",
  projectId: "phone-silencer-33c2f",
  storageBucket: "phone-silencer-33c2f.firebasestorage.app",
  messagingSenderId: "238705445203",
  appId: "1:238705445203:web:d91bda613a6fa1ccc979a6",
  measurementId: "G-9NGTZ446ES"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token
export const getFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BGHoeP63LEzhx1a66xfD2b2q2PtcjZDV8xVO1ZU2D-P2dvQK2MkBYSqbH2lyU8QSKgfB7o7ktnBCh2iP66UHPdU"
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