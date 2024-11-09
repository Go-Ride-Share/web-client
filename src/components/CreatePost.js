import React, { useState } from 'react';
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
	const [directions, setDirections] = useState(null);

	const handleNameChange = (e) => setName(e.target.value);
	const handleDescChange = (e) => setDesc(e.target.value);
	const handleDepartureChange = (e) => setDate(e.target.value);

	let formattedDate = 'Select a date';
	if (departureDate) {
		formattedDate = departureDate;
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

	const useMap = async (event) => {
		const lat = event.latLng.lat();
		const lng = event.latLng.lng();

		const geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (status === 'OK' && results[0]) {
				const address = results[0].formatted_address;
				if (mapSelection === mapUses.END) {
					setEnd(address);
					setEndLat(lat);
					setEndLng(lng);
				}
				if (mapSelection === mapUses.START) {
					setStart(address);
					setStartLat(lat);
					setStartLng(lng);
				}
			}
		});
	};

	React.useEffect(() => {
		if (startLocation && endLocation) {
			const directionsService = new window.google.maps.DirectionsService();
			directionsService.route(
				{
					origin: new window.google.maps.LatLng(originLat, originLng),
					destination: new window.google.maps.LatLng(
						destinationLat,
						destinationLng
					),
					travelMode: window.google.maps.TravelMode.DRIVING,
				},
				(result, status) => {
					if (status === 'OK') {
						setDirections(result);
					} else {
						console.error('Directions request failed due to ' + status);
					}
				}
			);
		}
	}, [
		startLocation,
		endLocation,
		originLat,
		originLng,
		destinationLat,
		destinationLng,
	]);

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
			navigate('/posts');
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
										placeholder="Start Location"
										readOnly={true}
										value={startLocation}
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

								<InputGroup>
									<Input
										placeholder="End Location"
										value={endLocation}
										readOnly={true}
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
								<GoogleMapComponent
									mapDisabled={mapDisabled}
									clicked={useMap}
									directions={directions}
								/>

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
										Save Post
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
