import React from "react";
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width:  '100%',
  height: '100%',
};

// Winnipeg
const center = {
  lat: 49.8954,
  lng: -97.1385,
};

const GoogleMapComponent = ({mapDisabled, clicked}) => {  
  const setUserLocation = (position) => {
    center.lat = position.coords.latitude
    center.lng = position.coords.longitude
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setUserLocation, (error) => {
      console.error("Error getting location: ", error);
    });
  }

  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={clicked}
        options={{
          draggable: !mapDisabled,    
          scrollwheel: !mapDisabled, 
          disableDefaultUI: mapDisabled,
          clickableIcons: !mapDisabled  
        }}
      >
        <Marker position={center} />
      </GoogleMap>
  );
};

export default GoogleMapComponent;