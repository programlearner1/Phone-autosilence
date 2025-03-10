importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Firebase configuration will be injected during build time
self.firebaseConfig = {
  apiKey: "%REACT_APP_FIREBASE_API_KEY%",
  authDomain: "%REACT_APP_FIREBASE_AUTH_DOMAIN%",
  projectId: "%REACT_APP_FIREBASE_PROJECT_ID%",
  storageBucket: "%REACT_APP_FIREBASE_STORAGE_BUCKET%",
  messagingSenderId: "%REACT_APP_FIREBASE_MESSAGING_SENDER_ID%",
  appId: "%REACT_APP_FIREBASE_APP_ID%",
  measurementId: "%REACT_APP_FIREBASE_MEASUREMENT_ID%"
};

firebase.initializeApp(self.firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[Firebase Messaging] Background Message Received", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
