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
	Spinner,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import CustomButton from './Button';
import GoogleMapComponent from './Map';
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';
import { savePost, getPost } from '../api-client/ApiClient';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import { DayPicker } from 'react-day-picker';
import { isLoggedIn } from './Utils.js';
import 'react-day-picker/style.css';
import 'reactjs-popup/dist/index.css';

const CreatePost = ({ edit }) => {
	const { postId } = useParams();
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
	const [loading, setLoading] = useState(false);
	const [postLoading, setPostLoading] = useState(false);

	const departureInputRef = useRef(null);
	const destinationInputRef = useRef(null);

	useEffect(() => {
		if (edit && postId) {
			const fetchPostDetails = async () => {
				setPostLoading(true);
				const response = await getPost(postId);
				if (response.error) {
					setPostError(response.error);
				} else {
					const currentUserId = localStorage.getItem('user_id');
					if (response.user?.userId !== currentUserId) {
						navigate(`/post/${postId}`);
						return;
					}
					setName(response.name);
					setStartLng(response.originLng);
					setStartLat(response.originLat);
					setEndLng(response.destinationLng);
					setEndLat(response.destinationLat);
					setStart(response.originName);
					setEnd(response.destinationName);
					setDesc(response.description);
					setDate(new Date(response.departureDate));
					setPrice(response.price);
					setSeats(response.seatsAvailable);
				}
				setPostLoading(false);
			};
			fetchPostDetails();
		}
	}, [edit, postId, navigate]);

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
					setDestinationLocationError('');
				}
				if (mapSelection === mapUses.START) {
					setStart(address);
					setStartLat(lat);
					setStartLng(lng);
					setDepartureLocationError('');
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
		setLoading(true);
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

		if (postId) {
			userRequest['postId'] = postId
		}

		const result = await savePost(userRequest);
		if (result.error) {
			setPostError(result.error);
		} else {
			setPostError('');
			navigate('/userPosts');
		}
		setLoading(false);
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
				{postLoading ? (
					<Box textAlign="center" minWidth={'45rem'} minHeight={'25rem'}>
						<Spinner color={theme.colors.secondary} size="xl" />
					</Box>
				) : (
					<>
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
									{edit ? 'Edit Post' : 'Create Post'}
								</Heading>

								<Stack direction="row" spacing={4}>
									<Stack spacing={4} width="xs">
										<Input
											placeholder="Post Name"
											value={postName}
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
													color={
														mapSelection === mapUses.START ? 'red' : 'gray'
													}
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
												value={seatsAvailable}
												placeholder="4"
												type="number"
												width="55%"
												bg={theme.colors.background}
												_placeholder={{ color: theme.colors.textLight }}
											/>
										</Flex>

										<Textarea
											placeholder="Descripton"
											value={description}
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
													value={price}
													placeholder="50.00"
													bg={theme.colors.background}
													_placeholder={{ color: theme.colors.textLight }}
												/>
											</Flex>

											<CustomButton
												size="md"
												isDisabled={!isFormValid || loading}
												onClick={handlePost}
											>
												{edit ? 'Update Post' : 'Create Post'}
											</CustomButton>
										</Stack>
										{postError && <Text color="red.500">{postError}</Text>}
									</Stack>
								</Stack>
							</>
						)}
					</>
				)}
			</Card>
		</Stack>
	);
};

export default CreatePost;
