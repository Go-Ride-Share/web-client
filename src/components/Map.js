import React from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
	width: '100%',
	height: '100%',
};

const GoogleMapComponent = ({ mapDisabled, clicked, directions }) => {
	const center = {
		lat: 49.8951,
		lng: -97.1385,
	};

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
				clickableIcons: !mapDisabled,
			}}
		>
			<Marker position={center} />
      
			{directions && <DirectionsRenderer directions={directions} />}
		</GoogleMap>
	);
};

export default GoogleMapComponent;
