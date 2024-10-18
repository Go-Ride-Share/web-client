import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewConversationDrawer from './NewConversationDrawer';
import {
	getAllConversations,
	createConversation,
} from '../api-client/ApiClient';
import { ChakraProvider } from '@chakra-ui/react';

jest.mock('../api-client/ApiClient', () => ({
	getAllConversations: jest.fn(),
	createConversation: jest.fn(),
}));

const mockPost = {
	posterId: '123',
	userName: 'Test User',
	userPhoto: 'test-photo-url',
};

const renderComponent = (props = {}) => {
	return render(
		<ChakraProvider>
			<NewConversationDrawer
				isOpen={true}
				onClose={jest.fn()}
				post={mockPost}
				{...props}
			/>
		</ChakraProvider>
	);
};

describe('NewConversationDrawer', () => {
	it('renders the drawer', async () => {
		getAllConversations.mockResolvedValueOnce([]);

		renderComponent();

		expect(screen.getByText(/new conversation/i)).toBeInTheDocument();
	});

	it('displays an error message when fetching conversations fails', async () => {
		getAllConversations.mockRejectedValueOnce(new Error('Failed to fetch'));

		renderComponent();

		await waitFor(() => {
			expect(
				screen.getByText(/failed to fetch conversations/i)
			).toBeInTheDocument();
		});
	});

	it('displays chat if an existing conversation is found', async () => {
		getAllConversations.mockResolvedValueOnce([
			{ conversationId: '456', user: { userId: '123' } },
		]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText(/chat/i)).toBeInTheDocument();
		});
	});

	it('allows sending a new message in a new conversation', async () => {
		getAllConversations.mockResolvedValueOnce([]);
		createConversation.mockResolvedValueOnce({ id: '789' });

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText(/no existing conversation/i)).toBeInTheDocument();
		});

		const input = screen.getByPlaceholderText(/type your message/i);
		fireEvent.change(input, { target: { value: 'Hello' } });

		const sendButton = screen.getByRole('button', { name: /send message/i });
		fireEvent.click(sendButton);

		await waitFor(() => {
			expect(createConversation).toHaveBeenCalledWith({
				userId: mockPost.posterId,
				contents: 'Hello',
			});
		});
	});

	it('displays an error when sending a message fails', async () => {
		getAllConversations.mockResolvedValueOnce([]);
		createConversation.mockRejectedValueOnce(
			new Error('Failed to send message')
		);

		renderComponent();

		const input = screen.getByPlaceholderText(/type your message/i);
		fireEvent.change(input, { target: { value: 'Hello' } });

		const sendButton = screen.getByRole('button', { name: /send message/i });
		fireEvent.click(sendButton);

		await waitFor(() => {
			expect(
				screen.getByText(/failed to send the message/i)
			).toBeInTheDocument();
		});
	});
});
