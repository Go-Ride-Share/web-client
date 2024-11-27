import React, { useEffect, useState } from 'react';
import {
	Stack,
	Card,
	Box,
	Heading,
	Text,
	Image,
	Flex,
	useTheme,
	Spinner,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import GoogleMapComponent from './Map';
import { getPost } from '../api-client/ApiClient';
import CustomButton from './Button';
import { MdOutlineMessage } from 'react-icons/md';
import NewConversationDrawer from './NewConversationDrawer';
import DefaultPhoto from '../assets/images/DefaultUserImage.png';
import { isLoggedIn } from './Utils.js';

const Post = () => {
	const { postId } = useParams();
	const theme = useTheme();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const fetchPost = async () => {
			setLoading(true);
			const response = await getPost(postId);
			if (response.error) {
				setError(response.error);
			} else {
				setPost(response);
			}
			setLoading(false);
		};
		fetchPost();
	}, [postId]);

	const handleContactClick = () => {
		setIsOpen(true);
	};

	const localUserId = localStorage.getItem('user_id');
	const isContactButtonDisabled = post?.posterId === localUserId || !isLoggedIn();

	return (
		<Stack
			spacing={6}
			mt="8"
			mx="auto"
			fontFamily="CaviarDreams"
			width="100%"
			maxW="1000px"
		>
			<Card
				p="6"
				boxShadow="xl"
				bg={theme.colors.accent}
				color={theme.colors.text}
			>
				{loading && (
					<Box textAlign="center">
						<Spinner size="xl" color={theme.colors.secondary} />
					</Box>
				)}

				{error && <Text color="red.500">{error}</Text>}

				{!loading && !error && !post && <Text>No post found</Text>}

				{post && !loading && !error && (
					<Stack direction="row" spacing={6} align="flex-start">
						<Box width="45%" pr={6}>
							<Heading as="h2" size="lg" textAlign="left" mb={4}>
								{post.name}
							</Heading>

							<Flex align="center" mb={6}>
								<Image
									src={post.user?.photo || DefaultPhoto}
									alt={post.user?.name}
									boxSize="50px"
									borderRadius="full"
									mr="4"
								/>
								<Text fontSize="sm" fontWeight="bold" textAlign="left">
									{post.user?.name}
								</Text>
							</Flex>

							<Text mb={2}>
								<strong>Description:</strong> {post.description}
							</Text>
							<Text mb={2}>
								<strong>Departure Date:</strong>{' '}
								{new Date(post.departureDate).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</Text>
							<Text mb={2}>
								<strong>Price:</strong> ${post.price}
							</Text>
							<Text mb={2}>
								<strong>Seats Available:</strong> {post.seatsAvailable}
							</Text>
							<Text mb={2}>
								<strong>Origin:</strong> {post.originName}
							</Text>
							<Text mb={4}>
								<strong>Destination:</strong> {post.destinationName}
							</Text>

							{/* Contact Button */}
							{!isContactButtonDisabled && (
								<Flex justify="flex-start">
									<CustomButton
										onClick={handleContactClick}
										size="md"
										isDisabled={isContactButtonDisabled}
									>
										<MdOutlineMessage style={{ marginRight: '8px' }} />
										Contact
									</CustomButton>
								</Flex>
							)}
						</Box>

						<Box width="80%" height="400px">
							<GoogleMapComponent
								mapDisabled={true}
								originLat={post.originLat}
								originLng={post.originLng}
								destinationLat={post.destinationLat}
								destinationLng={post.destinationLng}
							/>
						</Box>
					</Stack>
				)}
			</Card>

			<NewConversationDrawer
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				post={post}
			/>
		</Stack>
	);
};

export default Post;
