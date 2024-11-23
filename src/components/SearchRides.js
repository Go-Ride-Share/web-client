import React, { useState, useEffect, useRef } from 'react';
import {
	InputGroup,
	Input,
	InputRightElement,
	IconButton,
	Text,
	useTheme,
	Box,
	SimpleGrid,
	HStack,
	VStack,
	Button,
} from '@chakra-ui/react';
import GoogleMapComponent from './Map';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { searchPosts } from '../api-client/ApiClient';

const SearchRides = ({ setPosts }) => {
	const theme = useTheme();
	const [departureLat, setDepartureLat] = useState(0);
	const [departureLng, setDepartureLng] = useState(0);
	const [destinationLat, setDestinationLat] = useState(0);
	const [destinationLng, setDestinationLng] = useState(0);
	const [departureDate, setDepartureDate] = useState(null);
	const [departureLocation, setDepartureLocation] = useState('');
	const [destinationLocation, setDestinationLocation] = useState('');
	const [numSeats, setNumSeats] = useState('');
	const [price, setPrice] = useState('');
	const [mapSelection, setMapSelection] = useState('');
	const [mapDisabled, setMapDisabled] = useState(true);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [departureLocationError, setDepartureLocationError] = useState('');
	const [destinationLocationError, setDestinationLocationError] = useState('');

	const departureInputRef = useRef(null);
	const destinationInputRef = useRef(null);

	const mapUses = {
		DEPARTURE: 'Departure',
		DESTINATION: 'Destination',
		INACTIVE: '',
	};

	const truncateAddress = (address) => {
		const addressParts = address.split(',');
		if (addressParts.length > 1) {
			return `${addressParts[0]}, ${addressParts[1]}`;
		}
		return address;
	};

	useEffect(() => {
		if (window.google && window.google.maps && window.google.maps.places) {
			const departureAutocomplete = new window.google.maps.places.Autocomplete(
				departureInputRef.current,
				{ fields: ['geometry', 'formatted_address'] }
			);
			departureAutocomplete.addListener('place_changed', () => {
				const place = departureAutocomplete.getPlace();
				if (place.geometry) {
					setDepartureLat(place.geometry.location.lat());
					setDepartureLng(place.geometry.location.lng());
					const truncatedAddress = truncateAddress(place.formatted_address);
					setDepartureLocation(truncatedAddress);
					setDepartureLocationError('');
				} else {
					setDepartureLocation('');
					setDepartureLat(0);
					setDepartureLng(0);
				}
			});

			const destinationAutocomplete =
				new window.google.maps.places.Autocomplete(
					destinationInputRef.current,
					{ fields: ['geometry', 'formatted_address'] }
				);

			destinationAutocomplete.addListener('place_changed', () => {
				const place = destinationAutocomplete.getPlace();
				if (place.geometry) {
					setDestinationLat(place.geometry.location.lat());
					setDestinationLng(place.geometry.location.lng());
					const truncatedAddress = truncateAddress(place.formatted_address);
					setDestinationLocation(truncatedAddress);
					setDestinationLocationError('');
				} else {
					setDestinationLocation('');
					setDestinationLat(0);
					setDestinationLng(0);
				}
			});
		}
	}, []);

	const handleMapSelect = (type) => {
		if (mapSelection !== type) {
			setMapDisabled(false);
			setMapSelection(type);
		} else {
			setMapDisabled(true);
			setMapSelection(mapUses.INACTIVE);
		}
	};

	const useMap = async (event) => {
		const lat = event.latLng.lat();
		const lng = event.latLng.lng();

		const geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (status === 'OK' && results[0]) {
				let address = results[0].formatted_address;

				const addressParts = address.split(',');
				if (addressParts.length > 1) {
					address = `${addressParts[0]}, ${addressParts[1]}`;
				}

				if (mapSelection === mapUses.DEPARTURE) {
					setDepartureLocation(address);
					setDepartureLat(lat);
					setDepartureLng(lng);
					setDepartureLocationError('');
				} else if (mapSelection === mapUses.DESTINATION) {
					setDestinationLocation(address);
					setDestinationLat(lat);
					setDestinationLng(lng);
					setDestinationLocationError('');
				}
			}
		});
	};

	const handleSearch = async () => {
		setLoading(true);
		setError('');
		let response = null;

		try {
			const searchParams = {
				originLat: Number(departureLat),
				originLng: Number(departureLng),
				destinationLat: Number(destinationLat),
				destinationLng: Number(destinationLng),
				departureDate: departureDate ? departureDate.toISOString() : null,
				numSeats: String(numSeats) || null,
				price: Number(price) || null,
			};

			response = await searchPosts(searchParams);

			if (response?.error) {
				setError(response.error);
			} else if (Array.isArray(response)) {
				const sortedPosts = response.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);
				setPosts(sortedPosts);
			} else {
				setError('Unexpected response format');
			}
		} catch (error) {
			setError('An error occurred while searching posts. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleDepartureBlur = () => {
		if (departureLat === 0 && departureLng === 0) {
			setDepartureLocationError('Please select valid location');
		}
	};

	const handleDestinationBlur = () => {
		if (destinationLat === 0 && destinationLng === 0) {
			setDestinationLocationError('Please select valid location');
		}
	};

	return (
		<Box
			bg={theme.colors.accent}
			color={theme.colors.text}
			borderRadius="md"
			boxShadow="lg"
			p={6}
			mx="auto"
			fontFamily="CaviarDreams"
		>
			<Box width="100%" height="300px" mb={4}>
				<GoogleMapComponent
					clicked={useMap}
					originLat={departureLat}
					originLng={departureLng}
					destinationLat={destinationLat}
					destinationLng={destinationLng}
					mapDisabled={mapDisabled}
				/>
			</Box>

			<SimpleGrid columns={2} spacing={4}>
				<VStack align="stretch">
					<InputGroup>
						<Input
							ref={departureInputRef}
							placeholder="Start Location"
							value={departureLocation}
							onChange={(e) => {
								setDepartureLocation(e.target.value);
								setDepartureLat(0); 
								setDepartureLng(0); 
							}}
							onBlur={handleDepartureBlur}
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
						/>
						<InputRightElement>
							<IconButton
								size="sm"
								icon={<FaMapMarkerAlt />}
								variant="link"
								color={
									mapSelection === mapUses.DEPARTURE ? 'red.500' : 'gray.500'
								}
								onClick={() => handleMapSelect(mapUses.DEPARTURE)}
							/>
						</InputRightElement>
					</InputGroup>
					{departureLocationError && (
						<Text color="red.500" fontSize="sm" mt={1}>
							{departureLocationError}
						</Text>
					)}
				</VStack>

				<VStack align="stretch">
					<InputGroup>
						<Input
							ref={destinationInputRef}
							placeholder="End Location"
							value={destinationLocation}
							onChange={(e) => {
								setDestinationLocation(e.target.value);
								setDestinationLat(0);
								setDestinationLng(0);
							}}
							onBlur={handleDestinationBlur}
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
						/>
						<InputRightElement>
							<IconButton
								size="sm"
								icon={<FaMapMarkerAlt />}
								variant="link"
								color={
									mapSelection === mapUses.DESTINATION ? 'red.500' : 'gray.500'
								}
								onClick={() => handleMapSelect(mapUses.DESTINATION)}
							/>
						</InputRightElement>
					</InputGroup>
					{destinationLocationError && (
						<Text color="red.500" fontSize="sm" mt={1}>
							{destinationLocationError}
						</Text>
					)}
				</VStack>

				<VStack align="stretch">
					<InputGroup>
						<Input
							placeholder="Select Departure Date"
							readOnly
							value={departureDate ? departureDate.toDateString() : ''}
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
							onClick={() => setIsDatePickerOpen(true)}
						/>
						<InputRightElement>
							<IconButton
								icon={<CiCalendarDate />}
								variant="link"
								size="sm"
								onClick={() => setIsDatePickerOpen(true)}
							/>
						</InputRightElement>
					</InputGroup>
				</VStack>

				<VStack align="stretch">
					<HStack>
						<Text>Price($):</Text>
						<Input
							onChange={(e) => setPrice(e.target.value)}
							placeholder="50.00"
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
						/>
					</HStack>
				</VStack>
				<VStack align="stretch">
					<HStack>
						<Text>Number of Seats:</Text>
						<Input
							onChange={(e) => setNumSeats(e.target.value)}
							placeholder="4"
							type="number"
							maxW="40"
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
						/>
					</HStack>
				</VStack>
			</SimpleGrid>

			<Box display="flex" justifyContent="center" mt={4} width="100%">
				<VStack width="100%">
					<Button
						bg={theme.colors.secondary}
						color={theme.colors.text}
						_hover={{
							bg: theme.colors.tertiary,
							boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
						}}
						boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
						size="md"
						width="100%"
						isDisabled={
							loading ||
							!(departureLocation && destinationLocation) ||
							departureLat === 0 ||
							destinationLat === 0
						}
						isLoading={loading}
						onClick={handleSearch}
					>
						Search
					</Button>
					{error && <Text color="red.500">{error}</Text>}
				</VStack>
			</Box>

			<Popup
				modal
				closeOnDocumentClick
				onClose={() => setIsDatePickerOpen(false)}
				open={isDatePickerOpen}
				contentStyle={{
					display: 'flex',
					justifyContent: 'center',
					width: '400px',
					height: '400px',
				}}
			>
				<DayPicker
					mode="single"
					selected={departureDate}
					onSelect={(date) => {
						setDepartureDate(date);
						setIsDatePickerOpen(false);
					}}
				/>
			</Popup>
		</Box>
	);
};

export default SearchRides;
