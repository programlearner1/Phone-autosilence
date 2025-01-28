import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./LocationForm.css";

// Fix for missing default Leaflet marker icons
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
    radius: 0,
    silence: false,
    sendMsg: false,
    recipients: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Fetch address using reverse geocoding (requires API key for services like Google Maps or OpenCage)
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

  // Get current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy <= 50) {
          setLocation((prev) => ({ ...prev, latitude, longitude }));
          fetchAddress(latitude, longitude);
        } else {
          setError("Location accuracy is too low. Please try again.");
        }

        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve location. Please enable location services.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle marker drag
  const handleMarkerDragEnd = (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    fetchAddress(lat, lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Location saved:", location);
    setLocation({
      latitude: 0,
      longitude: 0,
      address: "",
      radius: 0,
      silence: false,
      sendMsg: false,
      recipients: [],
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize(); // Ensure map renders correctly
    }
  }, [location]);

  return (
    <div className="form-container">
      <div className="map-container">
      <MapContainer
  center={[location.latitude, location.longitude]}
  zoom={15}
  style={{ width: "100%", height: "400px", borderRadius: "8px" }}
  ref={(mapInstance) => {
    if (mapInstance && !mapRef.current) {
      mapRef.current = mapInstance; // Assign the map instance to the ref
    }
  }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  <Marker
    position={[location.latitude, location.longitude]}
    draggable={true}
    eventHandlers={{
      dragend: (event) => {
        const latLng = event.target.getLatLng();
        setLocation((prev) => ({
          ...prev,
          latitude: latLng.lat,
          longitude: latLng.lng,
        }));
      },
    }}
  >
    <Popup>
      Latitude: {location.latitude} <br />
      Longitude: {location.longitude}
    </Popup>
  </Marker>
</MapContainer>

      </div>

      <form onSubmit={handleSubmit} className="location-form">
        <Button
          variant="contained"
          color="primary"
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Get Current Location"}
        </Button>

        {error && <p className="error-message">{error}</p>}

        <TextField
          label="Address"
          value={location.address}
          variant="outlined"
          fullWidth
          disabled
          margin="normal"
        />

        <TextField
          label="Latitude"
          value={location.latitude || ""}
          variant="outlined"
          fullWidth
          disabled
          margin="normal"
        />
        <TextField
          label="Longitude"
          value={location.longitude || ""}
          variant="outlined"
          fullWidth
          disabled
          margin="normal"
        />

        <TextField
          label="Radius (meters)"
          value={location.radius || ""}
          type="number"
          variant="outlined"
          fullWidth
          onChange={(e) =>
            setLocation((prev) => ({
              ...prev,
              radius: parseInt(e.target.value, 10),
            }))
          }
          margin="normal"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={location.silence}
              onChange={(e) =>
                setLocation((prev) => ({
                  ...prev,
                  silence: e.target.checked,
                }))
              }
            />
          }
          label="Silence Notifications"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={location.sendMsg}
              onChange={(e) =>
                setLocation((prev) => ({
                  ...prev,
                  sendMsg: e.target.checked,
                }))
              }
            />
          }
          label="Send Message"
        />

        <TextField
          label="Recipients (comma separated)"
          value={location.recipients.join(", ")}
          variant="outlined"
          fullWidth
          onChange={(e) =>
            setLocation((prev) => ({
              ...prev,
              recipients: e.target.value.split(","),
            }))
          }
          margin="normal"
        />

        <Button type="submit" variant="contained" color="secondary">
          Save Location
        </Button>
      </form>
    </div>
  );
};

export default LocationForm;
