import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
	width: '100%',
	height: '100%',
};

const GoogleMapComponent = ({
	mapDisabled,
	clicked,
	originLat,
	originLng,
	destinationLat,
	destinationLng,
}) => {
	const [directions, setDirections] = useState(null);
	const [map, setMap] = useState(null);

	const defaultCenter = {
		lat: originLat || 49.8951,
		lng: originLng || -97.1385,
	};

	useEffect(() => {
		if (originLat && originLng && destinationLat && destinationLng) {
			const directionsService = new window.google.maps.DirectionsService();

			directionsService.route(
				{
					origin: new window.google.maps.LatLng(originLat, originLng),
					destination: new window.google.maps.LatLng(destinationLat, destinationLng),
					travelMode: window.google.maps.TravelMode.DRIVING,
				},
				(result, status) => {
					if (status === 'OK') {
						setDirections(result);

						const bounds = new window.google.maps.LatLngBounds();
						bounds.extend(new window.google.maps.LatLng(originLat, originLng));
						bounds.extend(new window.google.maps.LatLng(destinationLat, destinationLng));

						if (map) {
							map.fitBounds(bounds);
						}
					} else {
						console.error('Directions request failed due to ' + status);
					}
				}
			);
		}
	}, [originLat, originLng, destinationLat, destinationLng, map]);

	const onLoad = (mapInstance) => {
		setMap(mapInstance);
	};

	useEffect(() => {
		if (map && !mapDisabled) {
			if (originLat && originLng && destinationLat && destinationLng) {
				const bounds = new window.google.maps.LatLngBounds();
				bounds.extend(new window.google.maps.LatLng(originLat, originLng));
				bounds.extend(new window.google.maps.LatLng(destinationLat, destinationLng));
				map.fitBounds(bounds);
			} else {
				map.setCenter(defaultCenter);
				map.setZoom(10);
			}
		} else if (map && mapDisabled) {
			map.setCenter(defaultCenter);
			map.setZoom(10);
		}
	}, [map, mapDisabled, originLat, originLng, destinationLat, destinationLng, defaultCenter]);

	return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={defaultCenter}
			onClick={clicked}
			onLoad={onLoad}
			options={{
				draggable: !mapDisabled,
				scrollwheel: !mapDisabled,
				disableDefaultUI: mapDisabled,
				clickableIcons: !mapDisabled,
				gestureHandling: 'auto',
			}}
		>

			{directions && <DirectionsRenderer directions={directions} />}
		</GoogleMap>
	);
};

export default GoogleMapComponent;
