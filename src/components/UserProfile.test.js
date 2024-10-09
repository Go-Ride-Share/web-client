import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import UserProfile from './UserProfile';
import * as ApiClient from '../api-client/ApiClient';
import DefaultPhoto from '../assets/images/DefaultUserImage.png';

jest.mock('../api-client/ApiClient', () => ({
	getUser: jest.fn(),
	editUser: jest.fn(),
}));

describe('UserProfile Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('displays user information when fetched successfully', async () => {
		const mockUser = {
			name: 'John Doe',
			email: 'john@example.com',
			bio: 'Hello, I am John!',
			phone: '1234567890',
			photo: null,
		};

		ApiClient.getUser.mockResolvedValueOnce(mockUser);

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn((key) => {
					if (
						key === 'logic_token' ||
						key === 'db_token' ||
						key === 'user_id'
					) {
						return 'mockToken';
					}
					return null;
				}),
			},
			writable: true,
		});

		render(
			<MemoryRouter>
				<ChakraProvider>
					<UserProfile />
				</ChakraProvider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText(/your information/i)).toBeInTheDocument();
			expect(screen.getByPlaceholderText(/name/i)).toHaveValue(mockUser.name);
			expect(screen.getByPlaceholderText(/email address/i)).toHaveValue(
				mockUser.email
			);
			expect(screen.getByPlaceholderText(/bio/i)).toHaveValue(mockUser.bio);
			expect(screen.getByPlaceholderText(/phone number/i)).toHaveValue(
				mockUser.phone
			);
			expect(
				screen.getByRole('img', { name: /uploaded preview/i })
			).toHaveAttribute('src', DefaultPhoto);
		});
	});

	test('displays error message when user data fetch fails', async () => {
		ApiClient.getUser.mockRejectedValueOnce(new Error('Fetch failed'));
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn((key) => {
					if (
						key === 'logic_token' ||
						key === 'db_token' ||
						key === 'user_id'
					) {
						return 'mockToken';
					}
					return null;
				}),
			},
			writable: true,
		});

		render(
			<MemoryRouter>
				<ChakraProvider>
					<UserProfile />
				</ChakraProvider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(
				screen.getByText(/failed to fetch user data/i)
			).toBeInTheDocument();
		});
	});

	test('enables editing fields when the edit button is clicked', async () => {
		const mockUser = {
			name: 'John Doe',
			email: 'john@example.com',
			bio: 'Hello, I am John!',
			phone: '1234567890',
			photo: null,
		};

		ApiClient.getUser.mockResolvedValueOnce(mockUser);

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn((key) => {
					if (
						key === 'logic_token' ||
						key === 'db_token' ||
						key === 'user_id'
					) {
						return 'mockToken';
					}
					return null;
				}),
			},
			writable: true,
		});

		render(
			<MemoryRouter>
				<ChakraProvider>
					<UserProfile />
				</ChakraProvider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByPlaceholderText(/name/i)).toHaveValue(mockUser.name);
		});

		fireEvent.click(screen.getAllByRole('button', { name: /edit name/i })[0]);

		expect(screen.getByPlaceholderText(/name/i)).not.toBeDisabled();
	});

	test('displays error message for invalid phone input', async () => {
		const mockUser = {
			name: 'John Doe',
			email: 'john@example.com',
			bio: 'Hello, I am John!',
			phone: '1234567890',
			photo: null,
		};

		ApiClient.getUser.mockResolvedValueOnce(mockUser);

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn((key) => {
					if (
						key === 'logic_token' ||
						key === 'db_token' ||
						key === 'user_id'
					) {
						return 'mockToken';
					}
					return null;
				}),
			},
			writable: true,
		});

		render(
			<MemoryRouter>
				<ChakraProvider>
					<UserProfile />
				</ChakraProvider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByPlaceholderText(/phone number/i)).toHaveValue(
				mockUser.phone
			);
		});

		fireEvent.click(screen.getAllByRole('button', { name: /edit phone/i })[0]);

		const phoneInput = screen.getByPlaceholderText(/phone number/i);
		fireEvent.change(phoneInput, { target: { value: '12345' } });

		expect(
			await screen.findByText(/phone number must be 10 digits/i)
		).toBeInTheDocument();
	});

	test('submits user data successfully', async () => {
		const mockUser = {
			name: 'John Doe',
			email: 'john@example.com',
			bio: 'Hello, I am John!',
			phone: '1234567890',
			photo: null,
		};

		ApiClient.getUser.mockResolvedValue(mockUser);
		ApiClient.editUser.mockResolvedValueOnce({});

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn((key) => {
					if (
						key === 'logic_token' ||
						key === 'db_token' ||
						key === 'user_id'
					) {
						return 'mockToken';
					}
					return null;
				}),
			},
			writable: true,
		});

		render(
			<MemoryRouter>
				<ChakraProvider>
					<UserProfile />
				</ChakraProvider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByPlaceholderText(/name/i)).toHaveValue(mockUser.name);
		});

		fireEvent.click(screen.getAllByRole('button', { name: /edit name/i })[0]);
		const nameInput = screen.getByPlaceholderText(/name/i);
		fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

		fireEvent.click(
			screen.getByRole('button', { name: /update information/i })
		);

		await waitFor(() => {
			expect(
				screen.getByText(/user information updated successfully/i)
			).toBeInTheDocument();
		});
	});

	test('displays error message when update fails', async () => {
		const mockUser = {
			name: 'John Doe',
			email: 'john@example.com',
			bio: 'Hello, I am John!',
			phone: '1234567890',
			photo: null,
		};

		ApiClient.getUser.mockResolvedValueOnce(mockUser);
		ApiClient.editUser.mockResolvedValueOnce({ error: 'Update failed' });

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn((key) => {
					if (
						key === 'logic_token' ||
						key === 'db_token' ||
						key === 'user_id'
					) {
						return 'mockToken';
					}
					return null;
				}),
			},
			writable: true,
		});

		render(
			<MemoryRouter>
				<ChakraProvider>
					<UserProfile />
				</ChakraProvider>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByPlaceholderText(/name/i)).toHaveValue(mockUser.name);
		});

		fireEvent.click(screen.getAllByRole('button', { name: /edit name/i })[0]);
		const nameInput = screen.getByPlaceholderText(/name/i);
		fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

		fireEvent.click(
			screen.getByRole('button', { name: /update information/i })
		);

		await waitFor(() => {
			expect(screen.getByText(/update failed/i)).toBeInTheDocument();
		});
	});
});
