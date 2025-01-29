import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./LocationForm.css";

// Define a custom Leaflet icon to use for the marker
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
    radius: 100, // Default radius in meters
    silence: false,
    sendMsg: false,
    recipients: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Function to fetch address from latitude and longitude using OpenCage API
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setLocation((prev) => ({ ...prev, address: data.results[0].formatted }));
      } else {
        setError("Unable to fetch address. Please try again.");
      }
    } catch (err) {
      setError("Error fetching address. Please check your internet connection.");
    }
  };

  // Function to get the user's current location
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
            mapRef.current.setView([latitude, longitude], 16); // Move map to new location and zoom in
          }
        } else {
          setError("Location accuracy is too low. Please try again.");
        }
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve location. Please enable location services.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Function to handle marker drag event and update the location state
  const handleMarkerDragEnd = (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    fetchAddress(lat, lng);
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
          {/* Visual representation of the location radius */}
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
        <FormControlLabel control={<Checkbox checked={location.silence} onChange={(e) => setLocation((prev) => ({ ...prev, silence: e.target.checked }))} />} label="Silence Notifications" />
        <FormControlLabel control={<Checkbox checked={location.sendMsg} onChange={(e) => setLocation((prev) => ({ ...prev, sendMsg: e.target.checked }))} />} label="Send Message" />
        <Button type="submit" variant="contained" color="secondary">Save Location</Button>
      </form>
    </div>
  );
};

export default LocationForm;
