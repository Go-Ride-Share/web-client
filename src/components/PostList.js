import React, { useEffect, useState } from 'react';
import {
	Stack,
	Box,
	Card,
	Text,
	Heading,
	useTheme,
	Spinner,
} from '@chakra-ui/react';
import { getPosts } from '../api-client/ApiClient';
import { Link } from 'react-router-dom';

const isLoggedIn = () => {
	return (
		localStorage.getItem('logic_token') &&
		localStorage.getItem('db_token') &&
		localStorage.getItem('user_id')
	);
};

const PostList = () => {
	const theme = useTheme();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [loggedIn] = useState(isLoggedIn());

	useEffect(() => {
		if (loggedIn) {
			const userId = localStorage.getItem('user_id');
			const fetchPosts = async () => {
				const response = await getPosts(userId);
				if (response.error) {
					setError(response.error);
				} else {
					setPosts(response);
				}
				setLoading(false);
			};

			fetchPosts();
		} else {
			setLoading(false);
		}
	}, [loggedIn]);

	return (
		<Stack spacing={6} maxW="md" mx="auto" mt="8" fontFamily="CaviarDreams">
			<Heading as="h2" size="lg" textAlign="center" fontFamily="CaviarDreams">
				Your Posts
			</Heading>
			<Card
				p="6"
				boxShadow="md"
				w="100%"
				maxW="3xl"
				mx="auto"
				bg={theme.colors.accent}
				color={theme.colors.text}
				mt={4}
			>
				{!loggedIn ? (
					<Box textAlign="center">
						<Heading as="h2" size="lg" color={theme.colors.text}>
							You are not logged in.
						</Heading>
						<Text color={theme.colors.textLight} mt={4}>
							Please{' '}
							<Link to="/login" style={{ color: theme.colors.secondary }}>
								Log In
							</Link>{' '}
							to view your posts.
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
					<Stack spacing={4}>
						{posts.length === 0 ? (
							<Text textAlign="center" color={theme.colors.text}>
								No posts available
							</Text>
						) : (
							posts.map((post, index) => (
								<Card
									key={index}
									p="6"
									boxShadow="md"
									w="100%"
									bg={theme.colors.accent}
									color={theme.colors.text}
								>
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
										<strong>Departure Date:</strong> {post.departureDate}
									</Text>
									<Text>
										<strong>Price:</strong> ${post.price}
									</Text>
									<Text>
										<strong>Seats Available:</strong> {post.seatsAvailable}
									</Text>
								</Card>
							))
						)}
					</Stack>
				)}
			</Card>
		</Stack>
	);
};

export default PostList;
