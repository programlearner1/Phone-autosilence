import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location. Please allow location access.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  return currentPosition ? (
    <MapContainer
      center={currentPosition}
      zoom={15}
      style={{ height: "100%", width: "100%" }} // Ensures the map fills the container
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={currentPosition}>
        <Popup>Your current location</Popup>
      </Marker>
    </MapContainer>
  ) : (
    <p>Loading map...</p>
  );
};

export default Map;
