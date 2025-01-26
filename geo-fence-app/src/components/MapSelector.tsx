import React, { useState } from "react";

interface MapSelectorProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelect }) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const handleSelect = () => {
    onLocationSelect(lat, lng);
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(parseFloat(e.target.value))}
        className="border p-2"
      />
      <input
        type="number"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => setLng(parseFloat(e.target.value))}
        className="border p-2"
      />
      <button onClick={handleSelect} className="bg-blue-500 text-white p-2">
        Select Location
      </button>
    </div>
  );
};

export default MapSelector;
