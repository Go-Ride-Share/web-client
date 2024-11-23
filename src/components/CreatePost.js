import React, { useState, useEffect, useRef } from 'react';
import {
	Stack,
	Input,
	Heading,
	Textarea,
	Text,
	Card,
	useTheme,
	InputGroup,
	InputRightElement,
	IconButton,
	Flex,
	Box,
	Link,
} from '@chakra-ui/react';
import CustomButton from './Button';
import GoogleMapComponent from './Map';
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';
import { savePost } from '../api-client/ApiClient';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import { DayPicker } from 'react-day-picker';
import { isLoggedIn } from './Utils.js';
import 'react-day-picker/style.css';
import 'reactjs-popup/dist/index.css';

const CreatePost = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [loggedIn] = useState(isLoggedIn());
	const [postName, setName] = useState('');
	const [originLng, setStartLng] = useState(0);
	const [originLat, setStartLat] = useState(0);
	const [destinationLng, setEndLng] = useState(0);
	const [destinationLat, setEndLat] = useState(0);
	const [startLocation, setStart] = useState('');
	const [endLocation, setEnd] = useState('');
	const [description, setDesc] = useState('');
	const [postError, setPostError] = useState('');
	const [mapSelection, setMapSelection] = useState('');
	const [price, setPrice] = useState(0);
	const [seatsAvailable, setSeats] = useState(0);
	const [mapDisabled, setMapDisabled] = useState(true);
	const [departureDate, setDate] = useState(null);
	const [open, setOpen] = useState(false);
	const [departureLocationError, setDepartureLocationError] = useState('');
	const [destinationLocationError, setDestinationLocationError] = useState('');

	const departureInputRef = useRef(null);
	const destinationInputRef = useRef(null);

	const handleNameChange = (e) => setName(e.target.value);
	const handleDescChange = (e) => setDesc(e.target.value);
	const handleDepartureChange = (e) => setDate(e.target.value);

	let formattedDate = 'Departure Date';
	if (departureDate) {
		formattedDate = departureDate.toDateString();
	}

	const mapUses = {
		END: 'EndLocation',
		START: 'StartLocation',
		INACTIVE: '',
	};

	const handleSelectStartLocation = () => {
		if (mapSelection !== mapUses.START) {
			setMapDisabled(false);
			setMapSelection(mapUses.START);
		} else {
			setMapDisabled(true);
			setMapSelection(mapUses.INACTIVE);
		}
	};

	const handleSelectEndLocation = () => {
		if (mapSelection !== mapUses.END) {
			setMapDisabled(false);
			setMapSelection(mapUses.END);
		} else {
			setMapDisabled(true);
			setMapSelection(mapUses.INACTIVE);
		}
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
					setStartLat(place.geometry.location.lat());
					setStartLng(place.geometry.location.lng());
					const truncatedAddress = truncateAddress(place.formatted_address);
					setStart(truncatedAddress);
					setDepartureLocationError('');
				} else {
					setStart('');
					setStartLat(0);
					setStartLng(0);
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
					setEndLat(place.geometry.location.lat());
					setEndLng(place.geometry.location.lng());
					const truncatedAddress = truncateAddress(place.formatted_address);
					setEnd(truncatedAddress);
					setDestinationLocationError('');
				} else {
					setEnd('');
					setEndLat(0);
					setEndLng(0);
				}
			});
		}
	}, []);

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

				if (mapSelection === mapUses.END) {
					setEnd(address);
					setEndLat(lat);
					setEndLng(lng);
					setDepartureLocationError('');
				}
				if (mapSelection === mapUses.START) {
					setStart(address);
					setStartLat(lat);
					setStartLng(lng);
					setDestinationLocationError('');
				}
			}
		});
	};

	const handlePriceChange = (e) => {
		setPrice(e.target.value);
	};

	const handleSeatsChange = (e) => {
		setSeats(e.target.value);
	};

	const handlePost = async () => {
		const userRequest = {
			name: String(postName),
			originLng: Number(originLng),
			originLat: Number(originLat),
			destinationLng: Number(destinationLng),
			destinationLat: Number(destinationLat),
			originName: String(startLocation),
			destinationName: String(endLocation),
			description: String(description),
			departureDate: String(departureDate.toISOString()),
			price: Number(price),
			seatsAvailable: Number(seatsAvailable),
		};

		const result = await savePost(userRequest);
		if (result.error) {
			setPostError(result.error);
		} else {
			setPostError('');
			navigate('/userPosts');
		}
	};

	const handleDepartureBlur = () => {
		if (originLat === 0 && originLng === 0) {
			setDepartureLocationError('Please select valid location');
		}
	};

	const handleDestinationBlur = () => {
		if (destinationLng === 0 && destinationLat === 0) {
			setDestinationLocationError('Please select valid location');
		}
	};

	const isFormValid =
		postName &&
		originLng &&
		originLat &&
		destinationLng &&
		destinationLat &&
		departureDate &&
		description &&
		price &&
		seatsAvailable;

	return (
		<Stack spacing={6} mt="8" mx="auto" fontFamily="CaviarDreams">
			<Card
				p="8"
				boxShadow="xl"
				w="fit-content"
				mx="auto"
				align="center"
				bg={theme.colors.accent}
				color={theme.colors.text}
			>
				{!loggedIn ? (
					<Box textAlign="center">
						<Text size="md">You are not logged in.</Text>
						<Text>
							Please{' '}
							<Link to="/login" color={'blue.500'}>
								Log In
							</Link>{' '}
							to create a post.
						</Text>
					</Box>
				) : (
					<>
						<Heading
							as="h2"
							size="lg"
							textAlign="center"
							fontFamily="CaviarDreams"
							marginBottom="15px"
						>
							Create a Post
						</Heading>

						<Stack direction="row" spacing={4}>
							<Stack spacing={4} width="xs">
								<Input
									placeholder="Post Name"
									type="text"
									bg={theme.colors.background}
									onChange={handleNameChange}
									_placeholder={{ color: theme.colors.textLight }}
								/>

								<InputGroup>
									<Input
										ref={departureInputRef}
										placeholder="Start Location"
										value={startLocation}
										onChange={(e) => {
											setStart(e.target.value);
											setStartLat(0);
											setStartLng(0);
										}}
										onBlur={handleDepartureBlur}
										bg={theme.colors.background}
										_placeholder={{ color: theme.colors.textLight }}
									/>
									<InputRightElement width="3rem">
										<IconButton
											size="sm"
											icon={<FaMapMarkerAlt />}
											variant="link"
											color={mapSelection === mapUses.START ? 'red' : 'gray'}
											onClick={handleSelectStartLocation}
										/>
									</InputRightElement>
								</InputGroup>
								{departureLocationError && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{departureLocationError}
									</Text>
								)}

								<InputGroup>
									<Input
										ref={destinationInputRef}
										placeholder="End Location"
										value={endLocation}
										onChange={(e) => {
											setEnd(e.target.value);
											setEndLat(0);
											setEndLng(0);
										}}
										onBlur={handleDestinationBlur}
										bg={theme.colors.background}
										_placeholder={{ color: theme.colors.textLight }}
									/>
									<InputRightElement width="3rem">
										<IconButton
											size="sm"
											icon={<FaMapMarkerAlt />}
											variant="link"
											color={mapSelection === mapUses.END ? 'red' : 'gray'}
											onClick={handleSelectEndLocation}
										/>
									</InputRightElement>
								</InputGroup>
								{destinationLocationError && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{destinationLocationError}
									</Text>
								)}

								<InputGroup>
									<Input
										onChange={handleDepartureChange}
										value={formattedDate}
										readOnly={true}
										bg={theme.colors.background}
										_placeholder={{ color: theme.colors.textLight }}
									/>
									<InputRightElement width="3rem">
										<CiCalendarDate
											onClick={() => setOpen(true)}
											style={{ cursor: 'pointer' }}
											data-testid="calandar-button"
										/>
										<Popup
											modal
											closeOnDocumentClick
											onClose={() => setOpen(false)}
											open={open}
											contentStyle={{
												display: 'flex',
												justifyContent: 'center',
												width: '400px',
												height: '400px',
											}}
										>
											<Stack spacing={4} width="lg" align="center">
												<DayPicker
													mode="single"
													selected={departureDate}
													onSelect={setDate}
												/>
												<CustomButton
													size="md"
													onClick={() => {
														setOpen(false);
													}}
												>
													Select
												</CustomButton>
											</Stack>
										</Popup>
									</InputRightElement>
								</InputGroup>

								<Flex align="center">
									<h4 style={{ marginRight: '18px' }}>Number of Seats:</h4>
									<Input
										onChange={handleSeatsChange}
										placeholder="4"
										type="number"
										width="55%"
										bg={theme.colors.background}
										_placeholder={{ color: theme.colors.textLight }}
									/>
								</Flex>

								<Textarea
									placeholder="Descripton"
									bg={theme.colors.background}
									onChange={handleDescChange}
									_placeholder={{ color: theme.colors.textLight }}
								/>
							</Stack>
							<Stack spacing={4} width="lg" align="center">
								{
									<GoogleMapComponent
										clicked={useMap}
										originLat={originLat}
										originLng={originLng}
										destinationLat={destinationLat}
										destinationLng={destinationLng}
										mapDisabled={mapDisabled}
									/>
								}

								<Stack direction="row" spacing={14}>
									<Flex align="center">
										<h4 style={{ marginRight: '18px' }}>Price($):</h4>
										<Input
											onChange={handlePriceChange}
											placeholder="50.00"
											bg={theme.colors.background}
											_placeholder={{ color: theme.colors.textLight }}
										/>
									</Flex>

									<CustomButton
										size="md"
										isDisabled={!isFormValid}
										onClick={handlePost}
									>
										Create Post
									</CustomButton>
								</Stack>
								{postError && <Text color="red.500">{postError}</Text>}
							</Stack>
						</Stack>
					</>
				)}
			</Card>
		</Stack>
	);
};

export default CreatePost;
