import React from 'react';
import '@testing-library/jest-dom';
import {
	render,
	screen,
	fireEvent,
	waitFor,
} from '@testing-library/react';
import ChatBox from './ChatBox';
import { pollConversation, postMessage } from '../api-client/ApiClient';
import { ChakraProvider } from '@chakra-ui/react';

jest.mock('../api-client/ApiClient', () => ({
	pollConversation: jest.fn(),
	postMessage: jest.fn(),
}));

describe('ChatBox Component', () => {
	const conversationId = 'test-conversation-id';
	const onBack = jest.fn();
	const userName = 'John Doe';
	const userPhoto = 'https://example.com/photo.jpg';

	const mockMessages = [
		{
			contents: 'Hello',
			timeStamp: '2023-10-10T10:00:00Z',
			senderId: 'user-1',
		},
		{
			contents: 'Hi there!',
			timeStamp: '2023-10-10T10:01:00Z',
			senderId: 'user-2',
		},
	];

	beforeEach(() => {
		localStorage.setItem('user_id', 'user-2');
		localStorage.setItem(
			`conversation_${conversationId}`,
			JSON.stringify(mockMessages)
		);
		postMessage.mockResolvedValue({});
	});

	afterEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
	});

	it('renders user photo and name', () => {
		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		expect(screen.getByAltText(userName)).toBeInTheDocument();
		expect(screen.getByText(userName)).toBeInTheDocument();
		expect(screen.getByAltText(userName)).toHaveAttribute('src', userPhoto);
	});

	it('calls onBack when back button is clicked', () => {
		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		fireEvent.click(screen.getByRole('button', { name: /back/i }));
		expect(onBack).toHaveBeenCalled();
	});

	it('displays messages', async () => {
		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		expect(screen.getByText('Hello')).toBeInTheDocument();
		expect(screen.getByText('Hi there!')).toBeInTheDocument();
	});

	it('sends a message', async () => {
		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		const input = screen.getByPlaceholderText('Type your message...');
		fireEvent.change(input, { target: { value: 'New message' } });

		expect(input.value).toBe('New message');
		expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();

		fireEvent.click(screen.getByRole('button', { name: /send message/i }));

		await waitFor(() => {
			expect(postMessage).toHaveBeenCalledWith({
				conversationId,
				contents: 'New message',
			});
		});

		await waitFor(() => {
			expect(input.value).toBe('');
		});
	});

	it('displays error message if fetching messages fails', async () => {
		pollConversation.mockRejectedValueOnce(new Error('Failed to fetch'));

		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		await waitFor(() => {
			expect(
				screen.getByText('Failed to fetch conversation messages.')
			).toBeInTheDocument();
		});
	});

	it('disables send button when input is empty', () => {
		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		const sendButton = screen.getByRole('button', { name: /send message/i });
		expect(sendButton).toBeDisabled();
	});

	it('shows error message when sending a message fails', async () => {
		postMessage.mockRejectedValueOnce(new Error('Failed to send'));

		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		const input = screen.getByPlaceholderText('Type your message...');
		fireEvent.change(input, { target: { value: 'Test message' } });

		fireEvent.click(screen.getByRole('button', { name: /send message/i }));

		await waitFor(() => {
			expect(
				screen.getByText('Failed to send the message.')
			).toBeInTheDocument();
		});
	});

	it('polls for new messages periodically', async () => {
		pollConversation.mockResolvedValueOnce({
			messages: [
				{
					contents: 'New incoming message',
					timeStamp: '2023-10-10T10:02:00Z',
					senderId: 'user-1',
				},
			],
		});

		render(
			<ChakraProvider>
				<ChatBox
					conversationId={conversationId}
					onBack={onBack}
					userName={userName}
					userPhoto={userPhoto}
				/>
			</ChakraProvider>
		);

		await waitFor(() => {
			expect(screen.getByText(/new incoming message/i)).toBeInTheDocument();
	});
	});
});
