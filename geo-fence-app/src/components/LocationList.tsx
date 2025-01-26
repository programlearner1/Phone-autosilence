import React from "react";
import { useLocationContext } from "../contexts/LocationContext"; // Adjust path as needed

const LocationList: React.FC = () => {
  const { locations, removeLocation } = useLocationContext();

  return (
    <div>
      <ul>
        {locations.map((location, index) => (
          <li key={index}>
            {location.latitude}, {location.longitude}{" "}
            <button onClick={() => removeLocation(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationList;
