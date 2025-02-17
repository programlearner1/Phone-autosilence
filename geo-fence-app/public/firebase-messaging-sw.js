importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCRhcD6DjPKUwmgEM42YTwQj-dJusatXlQ",
  authDomain: "phone-silencer-33c2f.firebaseapp.com",
  projectId: "phone-silencer-33c2f",
  storageBucket: "phone-silencer-33c2f.firebasestorage.app",
  messagingSenderId: "238705445203",
  appId: "1:238705445203:web:d91bda613a6fa1ccc979a6",
  measurementId: "G-9NGTZ446ES"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[Firebase Messaging] Background Message Received", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
