import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Checkbox, FormControlLabel, CircularProgress, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./LocationForm.css";
import { sendNotification } from "../utils/sendSMS";
import config from "../config";




// Define a custom Leaflet icon
const defaultIcon = new L.Icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const LocationForm: React.FC = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
    radius: 100,
    silence: false,
    sendMsg: false,
    message: "",
    recipients: "",
    messageSent: false,
    carrier: "tmobile", // Default carrier
  });

  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Load saved locations on component mount
  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    const locationWatcher = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          checkUserLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    },  600000); // Check every 10 mins
  
    return () => clearInterval(locationWatcher); // Cleanup on unmount
  }, [locations]); // Run when locations change
  
  // Load saved locations from localStorage
  const loadLocations = () => {
    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  };

  // Fetch address from coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;
      
      if (!OPENCAGE_API_KEY) {
        throw new Error('OpenCage API key is not configured');
      }

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("❌ Invalid OpenCage API key. Please check your environment variables.");
          setError("Invalid API key. Please check configuration.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      if (data.results.length > 0) {
        setLocation((prev) => ({ ...prev, address: data.results[0].formatted }));
      } else {
        setError("Unable to fetch address. Please try again.");
      }
    } catch (err) {
      console.error("❌ Geocoding error:", err);
      setError("Error fetching address. Check API key or internet connection.");
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        if (accuracy <= 50) {
          setLocation((prev) => ({ ...prev, latitude, longitude }));
          fetchAddress(latitude, longitude);
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 16);
          }
        } else {
          setError("Location accuracy is too low. Try again.");
        }
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve location. Enable location services.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  // to calculate the distance in  meters
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  // comparing the earlier location with the current location in the saved locations
  const checkUserLocation = (currentLat, currentLng) => {
    let shouldBeSilent = false;
    
    locations.forEach((loc) => {
      const distance = getDistanceFromLatLonInMeters(
        currentLat,
        currentLng,
        loc.latitude,
        loc.longitude
      );
      
      // Check if user is within any silent zone and handle message sending
      if (distance <= loc.radius) {
        // Enable silent mode if configured
        if (loc.silence) {
          shouldBeSilent = true;
        }
        
        // Send notification if configured and not already sent
        if (loc.sendMsg && loc.message && !loc.messageSent) {
          sendNotification(loc.message, "Location Alert");
          // Mark message as sent to prevent repeated sending
          loc.messageSent = true;
          // Update localStorage with the new state
          localStorage.setItem("locations", JSON.stringify(locations));
        }
      } else {
        // Reset messageSent flag when user exits the zone
        if (loc.messageSent) {
          loc.messageSent = false;
          localStorage.setItem("locations", JSON.stringify(locations));
        }
      }
    });

    // Update device silent mode based on location
    updateDeviceSilentMode(shouldBeSilent);
  };

  // Function to update device silent mode
  const updateDeviceSilentMode = async (shouldBeSilent: boolean) => {
    try {
      const response = await fetch(`${config.apiUrl}/update-silent-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ silent: shouldBeSilent }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Failed to update silent mode');
      }
    } catch (error) {
      console.error('Error updating silent mode:', error);
    }
  };

  // Handle marker drag event
  const handleMarkerDragEnd = (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    fetchAddress(lat, lng);
  };

  // Save location
  const saveLocation = () => {
    if (!location.latitude || !location.longitude) {
      alert("Location coordinates are required.");
      return;
    }

    if (location.sendMsg && (!location.recipients || !location.message.trim())) {
      alert("Recipients and message are required when message sending is enabled.");
      return;
    }

    const newLocation = { 
      ...location,
      messageSent: false // Add flag to track if message has been sent
    };
    const updatedLocations = [...locations, newLocation];

    try {
      localStorage.setItem("locations", JSON.stringify(updatedLocations));
      setLocations(updatedLocations);
      alert("Location saved successfully!");
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Error saving location. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <div className="map-container">
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={15}
          style={{ width: "100%", height: "400px", borderRadius: "8px" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.latitude, location.longitude]} draggable eventHandlers={{ dragend: handleMarkerDragEnd }}>
            <Popup>Latitude: {location.latitude} <br /> Longitude: {location.longitude}</Popup>
          </Marker>
          <Circle center={[location.latitude, location.longitude]} radius={location.radius} color="blue" />
        </MapContainer>
      </div>
      <form className="location-form">
        <Button variant="contained" color="primary" onClick={getCurrentLocation} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Get Current Location"}
        </Button>
        {error && <p className="error-message">{error}</p>}
        <TextField label="Address" value={location.address} variant="outlined" fullWidth disabled margin="normal" />
        <TextField label="Radius (meters)" type="number" variant="outlined" fullWidth margin="normal"
          value={location.radius} onChange={(e) => setLocation((prev) => ({ ...prev, radius: parseInt(e.target.value, 10) }))} />
        <TextField label="Recipients (comma-separated numbers)" value={location.recipients}
          onChange={(e) => setLocation((prev) => ({ ...prev, recipients: e.target.value }))} variant="outlined" fullWidth margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Carrier</InputLabel>
          <Select
            value={location.carrier}
            label="Carrier"
            onChange={(e) => setLocation((prev) => ({ ...prev, carrier: e.target.value }))}
          >
            <MenuItem value="tmobile">T-Mobile</MenuItem>
            <MenuItem value="att">AT&T</MenuItem>
            <MenuItem value="verizon">Verizon</MenuItem>
            <MenuItem value="sprint">Sprint</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Message" value={location.message} 
          onChange={(e) => setLocation((prev) => ({ ...prev, message: e.target.value }))} 
          variant="outlined" fullWidth margin="normal" />
        <div className="checkbox-group">
          <FormControlLabel 
            control={<Checkbox 
              checked={location.sendMsg} 
              onChange={(e) => setLocation((prev) => ({ ...prev, sendMsg: e.target.checked }))} 
            />} 
            label="Send Notification on Entry" 
          />
          <FormControlLabel 
            control={<Checkbox 
              checked={location.silence} 
              onChange={(e) => setLocation((prev) => ({ ...prev, silence: e.target.checked }))} 
            />} 
            label="Enable Silent Mode in this zone" 
          />
        </div>
        <Button type="button" variant="contained" color="secondary" onClick={saveLocation}>
          Save Location
        </Button>
      </form>
    </div>
  );
};

export default LocationForm;
