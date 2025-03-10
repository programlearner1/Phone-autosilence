import React, { useEffect, useState } from "react";
import { LocationProvider } from "./contexts/LocationContext";
import LocationForm from "./components/LocationForm";
import LocationList from "./components/LocationList";
import { requestNotificationPermission } from "./firebase";
import { Alert, Snackbar } from "@mui/material";
import FCMService from "./services/fcmService";

const App: React.FC = () => {
  const [notificationStatus, setNotificationStatus] = useState<{
    show: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Request notification permission and initialize FCM
        await requestNotificationPermission();
        
        // Set up message handler
        FCMService.addMessageHandler((payload) => {
          console.log("New notification:", payload);
          setNotificationStatus({
            show: true,
            message: payload.notification?.body || 'New notification received',
            severity: 'success'
          });
        });

        setNotificationStatus({
          show: true,
          message: 'Notifications enabled successfully!',
          severity: 'success'
        });
      } catch (err) {
        console.error("Error in Firebase setup:", err);
        setNotificationStatus({
          show: true,
          message: 'Error setting up notifications. Check console for details.',
          severity: 'error'
        });
      }
    };

    initializeApp();
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
        <Snackbar 
          open={notificationStatus.show} 
          autoHideDuration={6000} 
          onClose={() => setNotificationStatus(prev => ({ ...prev, show: false }))}
        >
          <Alert 
            severity={notificationStatus.severity} 
            onClose={() => setNotificationStatus(prev => ({ ...prev, show: false }))}
          >
            {notificationStatus.message}
          </Alert>
        </Snackbar>
      </div>
    </LocationProvider>
  );
};

export default App;
