import config from '../config';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';

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
      return true;
    } else {
      console.error("❌ Notification sending failed:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return false;
  }
};

// Test notification function
export const sendTestNotification = async () => {
  return sendNotification(
    "This is a test notification to verify Firebase Cloud Messaging setup.",
    "Test Notification"
  );
};