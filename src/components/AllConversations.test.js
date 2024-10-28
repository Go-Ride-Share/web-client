import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import AllConversationsDrawer from './AllConversations';
import * as ApiClient from '../api-client/ApiClient';
import { isLoggedIn } from './Utils';

jest.mock('../api-client/ApiClient', () => ({
	getAllConversations: jest.fn(),
}));

jest.mock('./Utils', () => ({
	isLoggedIn: jest.fn(),
}));

describe('AllConversationsDrawer Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		isLoggedIn.mockReturnValue(true);
	});

	test('renders the chat icon button when logged in', () => {
		render(
			<Router>
				<ChakraProvider>
					<AllConversationsDrawer />
				</ChakraProvider>
			</Router>
		);

		expect(screen.getByLabelText(/Open Conversations/i)).toBeInTheDocument();
	});

	test('does not render when the user is not logged in', () => {
		isLoggedIn.mockReturnValue(false);

		render(
			<Router>
				<ChakraProvider>
					<AllConversationsDrawer />
				</ChakraProvider>
			</Router>
		);

		expect(
			screen.queryByLabelText(/Open Conversations/i)
		).not.toBeInTheDocument();
	});

	test('displays an error message if fetching conversations fails', async () => {
		ApiClient.getAllConversations.mockResolvedValueOnce({
			error: 'Network Error',
		});

		render(
			<Router>
				<ChakraProvider>
					<AllConversationsDrawer />
				</ChakraProvider>
			</Router>
		);

		fireEvent.click(screen.getByLabelText(/Open Conversations/i));

		await waitFor(() => {
			expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
		});
	});

	test('displays conversations when data is successfully fetched', async () => {
		ApiClient.getAllConversations.mockResolvedValueOnce([
			{
				conversationId: '1',
				user: { name: 'Alice', photo: 'profile1.png' },
				messages: [{ contents: 'Hello, Alice!' }],
			},
			{
				conversationId: '2',
				user: { name: 'Bob', photo: 'profile2.png' },
				messages: [{ contents: 'Hi, Bob!' }],
			},
		]);

		render(
			<Router>
				<ChakraProvider>
					<AllConversationsDrawer />
				</ChakraProvider>
			</Router>
		);

		fireEvent.click(screen.getByLabelText(/Open Conversations/i));

		await waitFor(() => {
			expect(screen.getByText('Alice')).toBeInTheDocument();
			expect(screen.getByText('Hello, Alice!')).toBeInTheDocument();
			expect(screen.getByText('Bob')).toBeInTheDocument();
			expect(screen.getByText('Hi, Bob!')).toBeInTheDocument();
		});
	});

	test('clicking a conversation displays the ChatBox component', async () => {
		ApiClient.getAllConversations.mockResolvedValueOnce([
			{
				conversationId: '1',
				user: { name: 'Alice', photo: 'profile1.png' },
				messages: [{ contents: 'Hello, Alice!' }],
			},
		]);

		render(
			<Router>
				<ChakraProvider>
					<AllConversationsDrawer />
				</ChakraProvider>
			</Router>
		);

		fireEvent.click(screen.getByLabelText(/Open Conversations/i));

		await waitFor(() => {
			expect(screen.getByText('Alice')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText('Alice'));

		expect(screen.getByText(/Chat/i)).toBeInTheDocument();
	});
});
