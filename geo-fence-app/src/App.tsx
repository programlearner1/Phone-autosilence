import React from "react";
import { LocationProvider } from "./contexts/LocationContext";
import LocationForm from "./components/LocationForm";
import LocationList from "./components/LocationList";
import Map from "./components/Map";

const App: React.FC = () => {
  return (
    <LocationProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">GeoFence App</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Side: Form and List */}
          <div>
            <LocationForm />
            <LocationList />
          </div>
          {/* Right Side: Map */}
          <div className="map-container">
            <Map />
          </div>
        </div>
      </div>
    </LocationProvider>
  );
};

export default App;
