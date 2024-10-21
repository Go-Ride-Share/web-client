import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './Login';
import * as ApiClient from '../api-client/ApiClient';

jest.mock('../api-client/ApiClient', () => ({
	login: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'localStorage', {
			value: {
				setItem: jest.fn(),
			},
			writable: true,
		});
		jest.clearAllMocks();
	});

	test('renders the login form', () => {
		render(
			<Router>
				<ChakraProvider>
					<Login />
				</ChakraProvider>
			</Router>
		);

		// Check if the input fields and button are rendered
		expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
		expect(screen.getByText(/login/i)).toBeInTheDocument();
	});

	test('displays an error message on failed login', async () => {
		// Mock the API client to return an error
		ApiClient.login.mockResolvedValueOnce({ error: 'Invalid credentials' });

		render(
			<Router>
				<ChakraProvider>
					<Login />
				</ChakraProvider>
			</Router>
		);

		// Fill out the form and submit
		fireEvent.change(screen.getByPlaceholderText(/email address/i), {
			target: { value: 'test@example.com' },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: 'password123' },
		});
		fireEvent.click(screen.getByText(/login/i));

		await waitFor(() => {
			expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
		});

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	test('logs in successfully and stores tokens in localStorage', async () => {
		// Mock a successful login
		ApiClient.login.mockResolvedValueOnce({
			logic_token: 'logicToken123',
			dbToken: 'dbToken456',
			user_id: 'user1'
		});

		render(
			<Router>
				<ChakraProvider>
					<Login />
				</ChakraProvider>
			</Router>
		);

		// Fill out the form and submit
		fireEvent.change(screen.getByPlaceholderText(/email address/i), {
			target: { value: 'test@example.com' },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: 'password123' },
		});
		fireEvent.click(screen.getByText(/login/i));

		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'logic_token',
				'logicToken123'
			);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'db_token',
				'dbToken456'
			);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'user_id',
				'user1'
			);
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});

	test('disables the login button when email or password is missing', () => {
		render(
			<Router>
				<ChakraProvider>
					<Login />
				</ChakraProvider>
			</Router>
		);

		// Initially, button should be disabled because inputs are empty
		expect(screen.getByText(/login/i)).toBeDisabled();

		// Fill email but not password, button should still be disabled
		fireEvent.change(screen.getByPlaceholderText(/email address/i), {
			target: { value: 'test@example.com' },
		});
		expect(screen.getByText(/login/i)).toBeDisabled();

		// Fill password, button should be enabled now
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: 'password123' },
		});
		expect(screen.getByText(/login/i)).toBeEnabled();
	});
});
