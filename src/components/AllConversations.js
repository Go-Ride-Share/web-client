import React, { useState, useEffect } from 'react';
import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Button,
	Box,
	Image,
	Text,
	VStack,
	Spinner,
	useDisclosure,
	useTheme,
} from '@chakra-ui/react';
import { getAllConversations } from '../api-client/ApiClient';
import { ChatIcon } from '@chakra-ui/icons';
import { isLoggedIn } from './Utils.js';
import ChatBox from './ChatBox';

const AllConversationsDrawer = () => {
	const theme = useTheme();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [conversations, setConversations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState();
	const [selectedConversationId, setSelectedConversationId] = useState(null);
	const [selectedUserName, setSelectedUserName] = useState('');
	const [selectedUserPhoto, setSelectedUserPhoto] = useState('');

	useEffect(() => {
		const fetchConversations = async () => {
			setLoading(true);
			let response = null;

			try {
				response = await getAllConversations();

				if (response?.error) {
					setErrorMessage(response.error);
				} else if (Array.isArray(response)) {
					setConversations(response);
				} else {
					setErrorMessage('Unexpected response format');
				}
			} catch (error) {
				setErrorMessage('An error occurred while fetching conversations');
			} finally {
				setLoading(false);
			}
		};

		if (isOpen) {
			fetchConversations();
		} else {
			setLoading(false);
		}
	}, [isOpen, selectedConversationId]);

	if (!isLoggedIn()) {
		return null;
	}

	const handleConversationClick = (conversation) => {
		setSelectedConversationId(conversation.conversationId);
		setSelectedUserName(conversation.user.name);
		setSelectedUserPhoto(conversation.user.photo);
	};

	return (
		<>
			<Button
				onClick={isOpen ? onClose : onOpen}
				position="fixed"
				right="1rem"
				bottom="1rem"
				borderRadius="full"
				padding="1rem"
				aria-label="Open Conversations"
				bg={theme.colors.secondary}
				color={theme.colors.text}
				_hover={{
					bg: theme.colors.tertiary,
					boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
				}}
				boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
			>
				<ChatIcon boxSize={6} />
			</Button>

			<Drawer isOpen={isOpen} placement="right" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent bg={theme.colors.accent}>
					<DrawerCloseButton />
					<DrawerHeader>
						{selectedConversationId ? 'Chat' : 'All Conversations'}
					</DrawerHeader>

					<DrawerBody>
						{loading ? (
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
								height="100%"
							>
								<Spinner color={theme.colors.secondary} size="xl" />
							</Box>
						) : errorMessage ? (
							<Text color="red.500">{errorMessage}</Text>
						) : selectedConversationId ? (
							<ChatBox
								conversationId={selectedConversationId}
								onBack={() => setSelectedConversationId(null)}
								userName={selectedUserName}
								userPhoto={selectedUserPhoto}
							/>
						) : (
							<Box maxHeight="70vh" overflowY="auto">
								<VStack spacing={3}>
									{conversations.map((conversation) => (
										<Box
											key={conversation.conversationId}
											borderWidth="1px"
											borderRadius="md"
											padding="2"
											display="flex"
											alignItems="center"
											width="full"
											bg={theme.colors.background}
											color={theme.colors.text}
											cursor="pointer"
											onClick={() => handleConversationClick(conversation)}
										>
											<Image
												src={conversation.user.photo}
												alt={conversation.user.name}
												borderRadius="full"
												boxSize="40px"
												mr={3}
											/>
											<Box>
												<Text fontWeight="bold">{conversation.user.name}</Text>
												<Text>
													{conversation.messages[
														conversation.messages.length - 1
													].contents.length > 50
														? `${conversation.messages[conversation.messages.length - 1].contents.slice(0, 50)}...`
														: conversation.messages[
																conversation.messages.length - 1
															].contents}
												</Text>
											</Box>
										</Box>
									))}
								</VStack>
							</Box>
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default AllConversationsDrawer;
