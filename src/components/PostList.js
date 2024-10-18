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
} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { getPosts, getAllPosts } from '../api-client/ApiClient';
import { Link } from 'react-router-dom';
import { isLoggedIn } from './Utils.js';
import CustomButton from './Button';
import NewConversationDrawer from './NewConversationDrawer';

const PostList = ({ usersRides }) => {
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
		if (loggedIn || !usersRides) {
			const userId = localStorage.getItem('user_id');
			const fetchPosts = async () => {
				setLoading(true);
				let response = null;

				try {
					if (usersRides) {
						response = await getPosts(userId);
					} else {
						response = await getAllPosts();
					}

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
					setError('An error occurred while fetching posts');
				} finally {
					setLoading(false);
				}
			};

			fetchPosts();
		} else {
			setLoading(false);
		}
	}, [loggedIn, usersRides]);

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
			//alert('Please log in to contact the post owner.');
			return;
		}
		setSelectedPost(post);
		onOpen();
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
				h="38rem"
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
					<Flex direction="column" height="100%">
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
									>
										<HStack justify="space-between" w="100%">
											<Box flex="1" mr={4}>
												<Heading as="h3" size="md" mb="2">
													{post.name}
												</Heading>
												<Text>
													<strong>Origin:</strong>{' '}
													{`Lat: ${post.originLat}, Lng: ${post.originLng}`}
												</Text>
												<Text>
													<strong>Destination:</strong>{' '}
													{`Lat: ${post.destinationLat}, Lng: ${post.destinationLng}`}
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
											<Box
												display="flex"
												flexDirection="column"
												justifyContent="flex-end"
												height="100%"
											>
												{!usersRides && (
													<Tooltip
														label={!loggedIn ? 'Login to contact' : ''}
														shouldWrapChildren
														isDisabled={loggedIn}
													>
														<CustomButton
															disabled={!loggedIn}
															onClick={() => handleContactClick(post)}
														>
															Contact
														</CustomButton>
													</Tooltip>
												)}
											</Box>
										</HStack>
									</Card>
								))
							)}
						</Stack>
						{posts.length > 0 && !loading && (
							<HStack justify="center" spacing={2} mt={4}>
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
