import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width:  '100%',
  height: '100%',
};

const center = {
  lat: 49.8954,
  lng: 97.1385,
};

/*
  This isn't finished yet, I haven't gotten the API key to work so far
*/
const GoogleMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder.geocode({ location: { lat, lng } });
    
    if (response.results[0]) {
      setSelectedLocation(response.results[0].formatted_address);
    } else {
      setSelectedLocation("Unknown location");
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;