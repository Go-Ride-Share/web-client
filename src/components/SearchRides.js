import React, { useState } from 'react';
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

	const mapUses = {
		DEPARTURE: 'Departure',
		DESTINATION: 'Destination',
		INACTIVE: '',
	};

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
				} else if (mapSelection === mapUses.DESTINATION) {
					setDestinationLocation(address);
					setDestinationLat(lat);
					setDestinationLng(lng);
				}
			}
		});
	};

	const handleSearch = async () => {
		setLoading(true);
		setError('');
		try {
			const searchParams = {
				departureLat,
				departureLng,
				destinationLat,
				destinationLng,
				departureDate: departureDate ? departureDate.toISOString() : null,
				numSeats: numSeats || null,
				price: price || null,
			};

			const response = await searchPosts(searchParams);
			if (response.error) {
				setError(response.error);
			} else {
				setPosts(response.data);
			}
		} catch (err) {
			setError('Failed to search posts. Please try again.');
		}
		setLoading(false);
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
				<InputGroup>
					<Input
						placeholder="Start Location"
						readOnly
						value={departureLocation}
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

				<InputGroup>
					<Input
						placeholder="End Location"
						readOnly
						value={destinationLocation}
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

				{/* Price */}
				<HStack>
					<Text>Price($):</Text>
					<Input
						onChange={(e) => setPrice(e.target.value)}
						placeholder="50.00"
						bg={theme.colors.background}
						_placeholder={{ color: theme.colors.textLight }}
					/>
				</HStack>

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
						isDisabled={loading || !(departureLocation && destinationLocation)}
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
