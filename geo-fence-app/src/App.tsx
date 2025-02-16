import React, { useEffect } from "react";
import { LocationProvider } from "./contexts/LocationContext";
import LocationForm from "./components/LocationForm";
import LocationList from "./components/LocationList";
import Map from "./components/Map";
import { messaging, getToken, onMessage } from "./firebase";

const App: React.FC = () => {
  useEffect(() => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
        return Notification.requestPermission();
      })
      .then((permission) => {
        if (permission !== "granted") {
          throw new Error("Notification permission denied.");
        }
        return navigator.serviceWorker.ready;
      })
      .then((registration) => {
        return getToken(messaging, {
          vapidKey: "BGHoeP63LEzhx1a66xfD2b2q2PtcjZDV8xVO1ZU2D-P2dvQK2MkBYSqbH2lyU8QSKgfB7o7ktnBCh2iP66UHPdU", // 🔴 REPLACE THIS
          serviceWorkerRegistration: registration,
        });
      })
      .then((token) => {
        if (token) {
          console.log("FCM Token:", token);
        } else {
          console.warn("No FCM token available.");
        }
      })
      .catch((err) => console.error("Error in Firebase setup:", err));

    onMessage(messaging, (payload) => {
      console.log("New notification:", payload);
      alert(payload.notification?.title || "New Notification");
    });
  }, []);

  return (
    <LocationProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">GeoFence App</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <LocationForm />
            <LocationList />
         
          </div>
        </div>
      </div>
    </LocationProvider>
  );
};

export default App;
