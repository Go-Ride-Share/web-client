import React, { useEffect, useState } from 'react';
import {
	Stack,
	Box,
	Card,
	Text,
	Heading,
	useTheme,
	Spinner,
	Button,
	HStack,
	useDisclosure,
	Tooltip,
	Flex,
	Image,
} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { MdOutlineMessage } from 'react-icons/md';
import { getPosts, getAllPosts } from '../api-client/ApiClient';
import { Link } from 'react-router-dom';
import { isLoggedIn } from './Utils.js';
import CustomButton from './Button';
import NewConversationDrawer from './NewConversationDrawer';
import DefaultPhoto from '../assets/images/DefaultUserImage.png';

const PostList = ({ usersRides, postsProp }) => {
	const theme = useTheme();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [loggedIn] = useState(isLoggedIn());
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedPost, setSelectedPost] = useState(null);
	const postsPerPage = 3;

	useEffect(() => {
		const userId = localStorage.getItem('user_id');
	
		const sortPostsByDate = (posts) => 
			posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	
		if (postsProp) {
			let filteredPosts = postsProp;
	
			if (loggedIn) {
				filteredPosts = postsProp.filter((post) => post.posterId !== userId);
			}
	
			setPosts(filteredPosts);
			setLoading(false);
		} else if (loggedIn || !usersRides) {
			const fetchPosts = async () => {
				setLoading(true);
	
				try {
					let response = null;
	
					if (usersRides) {
						response = await getPosts(userId);
					} else {
						response = await getAllPosts();
	
						if (loggedIn && Array.isArray(response)) {
							response = response.filter((post) => post.posterId !== userId);
						}
					}
	
					if (response?.error) {
						setError(response.error);
					} else if (Array.isArray(response)) {
						setPosts(sortPostsByDate(response));
					} else {
						setError('Unexpected response format');
					}
				} catch (error) {
					setError('An error occurred while fetching posts');
				} finally {
					setLoading(false);
				}
			};
	
			fetchPosts();
		} else {
			setLoading(false);
		}
	}, [loggedIn, usersRides, postsProp]);
	

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
	const totalPages = Math.ceil(posts.length / postsPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleContactClick = (post) => {
		if (!loggedIn) {
			alert('Please log in to contact the post owner.');
			return;
		}
		setSelectedPost(post);
		onOpen();
	};

	const getLocationName = (name, lat, lng) => {
		return name && name.trim() !== '' ? name : `Lat: ${lat}, Lng: ${lng}`;
	};

	return (
		<Stack spacing={6} maxW="md" mx="auto" mt="4" fontFamily="CaviarDreams">
			<Heading as="h2" size="lg" textAlign="center" fontFamily="CaviarDreams">
				{usersRides ? 'Your Rides' : 'Available Rides'}
			</Heading>
			<Card
				p="3"
				boxShadow="xl"
				w="100%"
				h="auto"
				maxW="3xl"
				mx="auto"
				bg={theme.colors.accent}
				color={theme.colors.text}
			>
				{usersRides && !loggedIn ? (
					<Box textAlign="center">
						<Text size="md">You are not logged in.</Text>
						<Text>
							Please{' '}
							<Link to="/login" color={'blue.500'}>
								Log In
							</Link>{' '}
							to view rides.
						</Text>
					</Box>
				) : loading ? (
					<Box textAlign="center">
						<Spinner color={theme.colors.secondary} size="xl" />
					</Box>
				) : error ? (
					<Box textAlign="center">
						<Text color="red.500">{error}</Text>
					</Box>
				) : (
					<Flex direction="column" height="100%" minH="auto">
						<Stack spacing={4} flex="1">
							{currentPosts.length === 0 ? (
								<Text textAlign="center" color={theme.colors.text}>
									No rides available
								</Text>
							) : (
								currentPosts.map((post, index) => (
									<Card
										key={index}
										p="2"
										boxShadow="md"
										w="100%"
										bg={theme.colors.background}
										color={theme.colors.text}
										position="relative"
										minH="15vh"
									>
										<HStack justify="space-between" w="100%">
											<Box flex="1" mr={4}>
												<Heading as="h3" size="md" mb="2">
													<Link to={`/post/${post.postId}`}>{post.name}</Link>
												</Heading>
												<Text>
													<strong>Origin:</strong>{' '}
													{getLocationName(
														post.originName,
														post.originLat,
														post.originLng
													)}
												</Text>
												<Text>
													<strong>Destination:</strong>{' '}
													{getLocationName(
														post.destinationName,
														post.destinationLat,
														post.destinationLng
													)}
												</Text>
												<Text>
													<strong>Departure Date:</strong>{' '}
													{new Date(post.departureDate).toLocaleDateString(
														'en-US',
														{
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														}
													)}
												</Text>
												<Text>
													<strong>Price:</strong> ${post.price}
												</Text>
												<Text>
													<strong>Seats Available:</strong>{' '}
													{post.seatsAvailable}
												</Text>
											</Box>

											{!usersRides && (
												<Flex
													direction="column"
													justify="space-between"
													h="100%"
													minH="18vh"
												>
													{post.user && (
														<Box textAlign="right" ml="auto">
															<Image
																src={post.user.photo || DefaultPhoto}
																alt="User photo"
																boxSize="50px"
																borderRadius="full"
																mb="2"
																display="block"
																marginLeft="auto"
															/>
															<Text
																fontSize="sm"
																fontWeight="bold"
																textAlign="right"
															>
																{post.user.name.split(' ')[0]}
															</Text>
														</Box>
													)}
													<Box mt="auto" w="100%">
														<Tooltip
															label={!loggedIn ? 'Login to contact' : ''}
															shouldWrapChildren
															isDisabled={loggedIn}
														>
															<CustomButton
																isDisabled={!loggedIn}
																onClick={() => handleContactClick(post)}
																size="sm"
																w="100%"
															>
																<Box as={MdOutlineMessage} mr="1" /> Contact
															</CustomButton>
														</Tooltip>
													</Box>
												</Flex>
											)}
										</HStack>
									</Card>
								))
							)}
						</Stack>
						{posts.length > 0 && !loading && (
							<HStack justify="center" spacing={2} mt="2vh">
								<Button
									size="sm"
									onClick={handlePrevPage}
									aria-label="Previous Page"
									isDisabled={currentPage === 1}
									leftIcon={<ChevronLeftIcon />}
								>
									Prev
								</Button>
								<Button
									size="sm"
									onClick={handleNextPage}
									aria-label="Next Page"
									isDisabled={currentPage === totalPages}
									rightIcon={<ChevronRightIcon />}
								>
									Next
								</Button>
							</HStack>
						)}
					</Flex>
				)}
			</Card>
			<NewConversationDrawer
				isOpen={isOpen}
				onClose={onClose}
				post={selectedPost}
			/>
		</Stack>
	);
};

export default PostList;
