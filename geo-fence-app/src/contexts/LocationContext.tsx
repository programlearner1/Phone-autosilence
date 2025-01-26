import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the types for Location data
interface Location {
  latitude: number;
  longitude: number;
  radius: number;
  silence: boolean;
  sendMsg: boolean;
  recipients: string[];
}

// Define the context type
interface LocationContextType {
  locations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (index: number) => void;
}

// Create the LocationContext with a default value of undefined
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Define the LocationProvider props (children of type ReactNode)
interface LocationProviderProps {
  children: ReactNode;
}

// LocationProvider component which holds the state and methods for location
export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  const addLocation = (location: Location) => setLocations([...locations, location]);
  const removeLocation = (index: number) => setLocations(locations.filter((_, i) => i !== index));

  return (
    <LocationContext.Provider value={{ locations, addLocation, removeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to access the LocationContext
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within LocationProvider");
  }
  return context;
};
