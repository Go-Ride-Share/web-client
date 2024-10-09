import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PostList from './PostList';
import * as ApiClient from '../api-client/ApiClient';

jest.mock('../api-client/ApiClient', () => ({
	getPosts: jest.fn(),
}));

describe('PostList Component', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('displays error message when fetching posts fails', async () => {
		localStorage.setItem('logic_token', 'token123');
		localStorage.setItem('db_token', 'dbToken456');
		localStorage.setItem('user_id', 'user1');

		ApiClient.getPosts.mockResolvedValueOnce({
			error: 'Failed to fetch posts',
		});

		render(
			<Router>
				<ChakraProvider>
					<PostList />
				</ChakraProvider>
			</Router>
		);

		await waitFor(() => {
			expect(screen.getByText(/failed to fetch posts/i)).toBeInTheDocument();
		});
	});

	test('displays no posts message when there are no posts', async () => {
		localStorage.setItem('logic_token', 'token123');
		localStorage.setItem('db_token', 'dbToken456');
		localStorage.setItem('user_id', 'user1');

		ApiClient.getPosts.mockResolvedValueOnce([]);

		render(
			<Router>
				<ChakraProvider>
					<PostList />
				</ChakraProvider>
			</Router>
		);

		await waitFor(() => {
			expect(screen.getByText(/no posts available/i)).toBeInTheDocument();
		});
	});

	test('displays list of posts when available', async () => {
		localStorage.setItem('logic_token', 'token123');
		localStorage.setItem('db_token', 'dbToken456');
		localStorage.setItem('user_id', 'user1');

		const mockPosts = [
			{
				name: 'Post 1',
				originLat: 1,
				originLng: 1,
				destinationLat: 2,
				destinationLng: 2,
				departureDate: '2024-10-10',
				price: 100,
				seatsAvailable: 5,
			},
			{
				name: 'Post 2',
				originLat: 3,
				originLng: 3,
				destinationLat: 4,
				destinationLng: 4,
				departureDate: '2024-10-11',
				price: 200,
				seatsAvailable: 2,
			},
		];
		ApiClient.getPosts.mockResolvedValueOnce(mockPosts);

		render(
			<Router>
				<ChakraProvider>
					<PostList />
				</ChakraProvider>
			</Router>
		);

		await waitFor(() => {
			expect(screen.getByText(/your posts/i)).toBeInTheDocument();
			expect(screen.getByText(/post 1/i)).toBeInTheDocument();
			expect(screen.getByText(/post 2/i)).toBeInTheDocument();
		});
	});

	test('displays message when user is not logged in', async () => {
		localStorage.clear();

		render(
			<Router>
				<ChakraProvider>
					<PostList />
				</ChakraProvider>
			</Router>
		);

		expect(screen.getByText(/you are not logged in/i)).toBeInTheDocument();
	});
});
