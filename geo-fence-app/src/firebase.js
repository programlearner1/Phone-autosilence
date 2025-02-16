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
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
