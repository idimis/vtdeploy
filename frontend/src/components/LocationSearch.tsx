import React from "react";

interface LocationSearchProps {
  location: string;
  filteredCities: string[];
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ location, filteredCities, onLocationChange }) => {
  return (
    <div>
      <input
        type="text"
        value={location}
        onChange={onLocationChange}
        placeholder="Search location..."
        className="border p-2 rounded"
      />
      {filteredCities.length > 0 && (
        <ul className="bg-white border mt-2 rounded shadow-lg">
          {filteredCities.map((city, index) => (
            <li key={index} className="p-2 hover:bg-gray-100">
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
