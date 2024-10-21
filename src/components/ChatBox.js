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
	const userId = localStorage.getItem('user_id');
	const storageKey = `conversation_${conversationId}`;
	const [latestMessageTimestamp, setLatestMessageTimestamp] = useState(null);

	const messagesEndRef = useRef(null);

	useEffect(() => {
		const fetchMessages = async () => {
			setLoading(true);
			try {
				const storedMessages = JSON.parse(localStorage.getItem(storageKey));

				if (storedMessages && storedMessages.length > 0) {
					setMessages(storedMessages);
					const latestMessage = storedMessages[storedMessages.length - 1];
					if (latestMessage?.timeStamp) {
						setLatestMessageTimestamp(latestMessage.timeStamp);
					}
				}

				const conversation = await pollConversation(
					conversationId,
					latestMessageTimestamp
				);

				if (
					conversation &&
					typeof conversation === 'object' &&
					Array.isArray(conversation.messages)
				) {
					const updatedMessages = storedMessages
						? [...storedMessages, ...conversation.messages]
						: conversation.messages;

					setMessages(updatedMessages);
					localStorage.setItem(storageKey, JSON.stringify(updatedMessages));

					const latestMessage = updatedMessages[updatedMessages.length - 1];
					if (latestMessage?.timeStamp) {
						setLatestMessageTimestamp(latestMessage.timeStamp);
					}
				} else if (!storedMessages) {
					setErrorMessage('No messages found for this conversation.');
				}
			} catch (error) {
				setErrorMessage('Failed to fetch conversation messages.');
			} finally {
				setLoading(false);
			}
		};

		fetchMessages();

		const pollMessages = setInterval(async () => {
			try {
				if (latestMessageTimestamp) {
					const newMessages = await pollConversation(
						conversationId,
						latestMessageTimestamp
					);
					if (
						newMessages &&
						Array.isArray(newMessages.messages) &&
						newMessages.messages.length > 0
					) {
						setMessages((prevMessages) => {
							const updatedMessages = [
								...prevMessages,
								...newMessages.messages,
							];
							localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
							return updatedMessages;
						});

						const latestMessage =
							newMessages.messages[newMessages.messages.length - 1];
						if (latestMessage?.timeStamp) {
							setLatestMessageTimestamp(latestMessage.timeStamp);
						}
					}
				}
			} catch (error) {
				console.error('Error polling for new messages:', error);
			}
		}, 1000);
		return () => clearInterval(pollMessages);
	}, [conversationId, latestMessageTimestamp, storageKey]);

	useEffect(() => {
		if (
			messagesEndRef.current &&
			typeof messagesEndRef.current.scrollIntoView === 'function'
		) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

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
			} else {
				const newMsg = {
					contents: newMessage,
					timeStamp: new Date().toISOString(),
					senderId: userId,
				};
				setMessages((prevMessages) => {
					const updatedMessages = [...prevMessages, newMsg];
					localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
					return updatedMessages;
				});
				setNewMessage('');
				setLatestMessageTimestamp(newMsg.timeStamp);
			}
		} catch (error) {
			setErrorMessage('Failed to send the message.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
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
			<VStack
				spacing={3}
				bg={theme.colors.background}
				padding="4"
				borderRadius="md"
				overflowY="auto"
				height="37rem"
			>
				{loading && messages.length === 0 ? (
					<Spinner color={theme.colors.secondary} size="lg" />
				) : errorMessage ? (
					<Text color="red.500">{errorMessage}</Text>
				) : (
					messages.map((message, index) => (
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
				<div ref={messagesEndRef} />
			</VStack>
			<InputGroup mt={4}>
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
		</Box>
	);
};

export default ChatBox;
