import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

export default function FacilityMap({ userLocation, facilities, googleMapsApiKey }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
  });

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded || !userLocation) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={userLocation}
      zoom={13}
    >
      {/* User location marker */}
      <Marker position={userLocation} label="You" />

      {/* Facility markers */}
      {facilities?.map((facility, index) => {
        const lat = facility.lat ?? userLocation.lat;
        const lng = facility.lng ?? userLocation.lng;

        return (
          <Marker
            key={index}
            position={{ lat, lng }}
            label={facility.name[0]} // First letter as marker label
            title={facility.name}   // Tooltip on hover
          />
        );
      })}
    </GoogleMap>
  );
}
