import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Request permission for notifications
export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: "BGHoeP63LEzhx1a66xfD2b2q2PtcjZDV8xVO1ZU2D-P2dvQK2MkBYSqbH2lyU8QSKgfB7o7ktnBCh2iP66UHPdU" });
    console.log("FCM Token:", token);
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
};

const messaging = getMessaging(app);

// Export the required Firebase functions
export { messaging, getToken, onMessage };