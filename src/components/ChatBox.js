import React, { useState, useEffect, useRef } from 'react';
import {
	Box,
	VStack,
	Text,
	Input,
	InputGroup,
	InputRightElement,
	Button,
	useTheme,
	Spinner,
	IconButton,
	Image,
	Flex,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';
import { pollConversation, postMessage } from '../api-client/ApiClient';

const ChatBox = ({ conversationId, onBack, userName, userPhoto }) => {
	const theme = useTheme();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState();
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const userId = localStorage.getItem('user_id');
	const storageKey = `conversation_${conversationId}`;
	const [latestMessageTimestamp, setLatestMessageTimestamp] = useState(null);
	const messagesContainerRef = useRef(null);
	const maxMessageLength = 500;

	useEffect(() => {
		const fetchMessages = async () => {
			setLoading(true);
			try {
				// Retrieve stored messages from localStorage
				const storedMessages =
					JSON.parse(localStorage.getItem(storageKey)) || [];
				setMessages(storedMessages);

				// Get the timestamp of the last message
				const lastStoredMessage = storedMessages[0];
				const lastTimestamp =
					lastStoredMessage?.timeStamp || latestMessageTimestamp;

				// Poll new messages that are after the last known timestamp
				const conversation = await pollConversation(
					conversationId,
					lastTimestamp
				);

				if (conversation && Array.isArray(conversation.messages)) {
					// Filter out messages that are already present in the storedMessages
					const newMessages = conversation.messages.filter(
						(msg) =>
							!storedMessages.some(
								(storedMsg) => storedMsg.timeStamp === msg.timeStamp
							)
					);

					// Only update the state and localStorage if there are new messages
					if (newMessages.length > 0) {
						const updatedMessages = [...newMessages, ...storedMessages];

						setMessages(updatedMessages);
						localStorage.setItem(storageKey, JSON.stringify(updatedMessages));

						// Update the latest timestamp based on the new messages
						const latestMessage = updatedMessages[0];
						setLatestMessageTimestamp(latestMessage.timeStamp);

						if (!isInitialLoad) {
							scrollToBottom();
						}
					}
				} else if (storedMessages.length === 0) {
					setErrorMessage('No messages found for this conversation.');
				}
			} catch (error) {
				setErrorMessage('Failed to fetch conversation messages.');
			} finally {
				setLoading(false);
				setIsInitialLoad(false);
			}
		};

		fetchMessages();

		// Set up polling to fetch new messages periodically
		const pollMessages = setInterval(fetchMessages, 3000);
		return () => clearInterval(pollMessages);
	}, [conversationId, latestMessageTimestamp, storageKey, isInitialLoad]);

	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	};

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return;

		const postMessageRequest = {
			conversationId,
			contents: newMessage.trim(),
		};

		try {
			setLoading(true);
			const response = await postMessage(postMessageRequest);
			if (response?.error) {
				setErrorMessage(response.error);
			}
			setNewMessage('');
		} catch (error) {
			setErrorMessage('Failed to send the message.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Flex direction="column" height="100%">
			<Box display="flex" alignItems="center" mb={4}>
				<Button onClick={onBack} aria-label="back">
					<ChevronLeftIcon />
				</Button>
				{userPhoto && (
					<Image
						src={userPhoto}
						alt={userName}
						borderRadius="full"
						boxSize="40px"
						ml={2}
					/>
				)}
				{userName && (
					<Text ml={3} fontWeight="bold" color={theme.colors.text}>
						{userName}
					</Text>
				)}
			</Box>
			<Flex direction="column" flex="1" overflow="hidden">
				<VStack
					ref={messagesContainerRef}
					spacing={3}
					bg={theme.colors.background}
					padding="4"
					borderRadius="md"
					overflowY="auto"
					flex="1"
				>
					{loading && messages.length === 0 ? (
						<Spinner color={theme.colors.secondary} size="lg" />
					) : errorMessage ? (
						<Text color="red.500">{errorMessage}</Text>
					) : (
						messages
							.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp))
							.map((message, index) => (
								<Box
									key={index}
									alignSelf={
										message.senderId === userId ? 'flex-end' : 'flex-start'
									}
									bg={
										message.senderId === userId
											? theme.colors.secondary
											: theme.colors.primary
									}
									color={theme.colors.text}
									borderRadius="md"
									padding="2"
									maxWidth="75%"
								>
									<Text>{message.contents}</Text>
									<Text fontSize="xs" color="gray.500">
										{new Date(message.timeStamp).toLocaleString()}
									</Text>
								</Box>
							))
					)}
				</VStack>
			</Flex>
			<Box mt="3">
				<InputGroup>
					<Input
						placeholder="Type your message..."
						value={newMessage}
						onChange={(e) => {
							if (e.target.value.length <= maxMessageLength) {
								setNewMessage(e.target.value);
							}
						}}
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
				<Text fontSize="xs" color="gray.500" mt={1}>
					{newMessage.length}/{maxMessageLength} characters
				</Text>
			</Box>
		</Flex>
	);
};

export default ChatBox;
