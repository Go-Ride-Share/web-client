import React, { useState, useEffect } from 'react';
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerCloseButton,
	DrawerBody,
	Input,
	InputGroup,
	InputRightElement,
	IconButton,
	Spinner,
	useTheme,
	VStack,
	Text,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import {
	createConversation,
	getAllConversations,
} from '../api-client/ApiClient';
import ChatBox from './ChatBox';

const NewConversationDrawer = ({ isOpen, onClose, post }) => {
	const theme = useTheme();
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [conversationId, setConversationId] = useState(null);
	const userId = localStorage.getItem('user_id');

	useEffect(() => {
		if (isOpen) {
			fetchConversations();
		}
	}, [isOpen]);

	const fetchConversations = async () => {
		try {
			const conversations = await getAllConversations(userId);
			const existingConversation = conversations.find(
				(convo) => convo.user.userId === post.posterId
			);
			if (existingConversation) {
				setConversationId(existingConversation.conversationId);
			} else {
				setConversationId(null);
			}
		} catch (error) {
			setErrorMessage('Failed to fetch conversations.');
		}
	};

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return;

		const createConversationRequest = {
			userId: post.posterId,
			contents: newMessage.trim(),
		};

		try {
			setLoading(true);
			const response = await createConversation(createConversationRequest);
			if (response?.error) {
				setErrorMessage(response.error);
			} else {
				setConversationId(response.id);
				setNewMessage('');
			}
		} catch (error) {
			setErrorMessage('Failed to send the message.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent bg={theme.colors.accent}>
				<DrawerCloseButton />
				<DrawerHeader>
					{conversationId ? 'Chat' : 'New Conversation'}
				</DrawerHeader>
				<DrawerBody>
					<>
						{loading ? (
							<Spinner color={theme.colors.secondary} size="lg" />
						) : errorMessage ? (
							<Text color="red.500">{errorMessage}</Text>
						) : conversationId ? (
							<ChatBox
								conversationId={conversationId}
								onBack={onClose}
								userName={post.userName}
								userPhoto={post.userPhoto}
							/>
						) : (
							<Text>No existing conversation. Start a new one!</Text>
						)}
					</>
					{!conversationId && (
						<>
							<VStack
								spacing={3}
								bg={theme.colors.background}
								padding="4"
								borderRadius="md"
								overflowY="auto"
								height="37rem"
							></VStack>
							<InputGroup mt={'4'}>
								<Input
									placeholder="Type your message..."
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									bg={theme.colors.background}
								/>
								<InputRightElement>
									<IconButton
										variant="ghost"
										onClick={handleSendMessage}
										aria-label="send message"
										isDisabled={!newMessage.trim()}
										_hover={{ backgroundColor: 'transparent' }}
										_focus={{ backgroundColor: 'transparent' }}
									>
										<FiSend />
									</IconButton>
								</InputRightElement>
							</InputGroup>
						</>
					)}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default NewConversationDrawer;