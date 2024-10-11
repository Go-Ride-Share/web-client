import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Signup from './Signup';
import * as ApiClient from '../api-client/ApiClient';

jest.mock('../api-client/ApiClient', () => ({
	createUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

describe('Signup Component', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'localStorage', {
			value: {
				setItem: jest.fn(),
			},
			writable: true,
		});
		jest.clearAllMocks();
	});

	test('renders the signup form', () => {
		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
		expect(screen.getByTestId('password-input')).toBeInTheDocument();
		expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/bio/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /sign up/i })
		).toBeInTheDocument();
	});

	test('shows error for invalid email format', () => {
		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		fireEvent.change(screen.getByPlaceholderText(/email address/i), {
			target: { value: 'invalid-email' },
		});

		expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
	});

	test('shows error when passwords do not match', () => {
		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		fireEvent.change(screen.getByTestId('password-input'), {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByTestId('confirm-password-input'), {
			target: { value: 'differentPassword' },
		});

		expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
	});

	test('shows error for invalid phone number', () => {
		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
			target: { value: '123' },
		});

		expect(
			screen.getByText(/phone number must be 10 digits/i)
		).toBeInTheDocument();
	});

	test('toggles password visibility', () => {
		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		const passwordInput = screen.getByTestId('password-input');
		expect(passwordInput).toHaveAttribute('type', 'password');

		const toggleButton = screen.getByLabelText(/show password/i);
		fireEvent.click(toggleButton);

		expect(passwordInput).toHaveAttribute('type', 'text');

		fireEvent.click(toggleButton);
		expect(passwordInput).toHaveAttribute('type', 'password');
	});

	test('displays uploaded photo preview', async () => {
		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });

		fireEvent.change(screen.getByPlaceholderText(/upload picture/i), {
			target: { files: [file] },
		});

		await waitFor(() => {
			const img = screen.getByAltText('Uploaded Preview');
			expect(img).toBeInTheDocument();
			expect(img).toHaveAttribute(
				'src',
				expect.stringContaining('data:image/png')
			);
		});
	});

	test('displays an error message on failed signup', async () => {
		// Mock the API client to return an error
		ApiClient.createUser.mockResolvedValueOnce({ error: 'Signup failed' });

		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		// Fill out the form and submit
		fireEvent.change(screen.getByPlaceholderText(/name/i), {
			target: { value: 'Test User' },
		});
		fireEvent.change(screen.getByPlaceholderText(/email address/i), {
			target: { value: 'test@example.com' },
		});
		fireEvent.change(screen.getByTestId('password-input'), {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByTestId('confirm-password-input'), {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByPlaceholderText(/bio/i), {
			target: { value: 'Just a test user.' },
		});
		fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
			target: { value: '1234567890' },
		});
		fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

		await waitFor(() => {
			expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
		});

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	test('signs up successfully and stores tokens in localStorage', async () => {
		// Mock a successful signup
		ApiClient.createUser.mockResolvedValueOnce({
			logic_token: 'logicToken123',
			db_token: 'dbToken456',
			user_id: 'user1',
		});

		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		// Fill out the form and submit
		fireEvent.change(screen.getByPlaceholderText(/name/i), {
			target: { value: 'Test User' },
		});
		fireEvent.change(screen.getByPlaceholderText(/email address/i), {
			target: { value: 'test@example.com' },
		});
		fireEvent.change(screen.getByTestId('password-input'), {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByTestId('confirm-password-input'), {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByPlaceholderText(/bio/i), {
			target: { value: 'Just a test user.' },
		});
		fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
			target: { value: '1234567890' },
		});
		fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'logic_token',
				'logicToken123'
			);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'db_token',
				'dbToken456'
			);
			expect(localStorage.setItem).toHaveBeenCalledWith('user_id', 'user1');
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});

	test('disables the signup button when form is invalid', () => {
		render(
			<Router>
				<ChakraProvider>
					<Signup />
				</ChakraProvider>
			</Router>
		);

		// Initially, button should be disabled because inputs are empty
		expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();

		// Fill valid name and email, button should still be disabled
		fireEvent.change(screen.getByPlaceholderText(/name/i), {
			target: { value: 'Test User' },
		});
		fireEvent.change(screen.getByPlaceholderText(/email address/i), {
			target: { value: 'test@example.com' },
		});
		expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();

		// Fill password and confirm password, button should still be disabled
		fireEvent.change(screen.getByTestId('password-input'), {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByTestId('confirm-password-input'), {
			target: { value: 'password123' },
		});
		expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();

		// Fill bio and phone number, button should be enabled now
		fireEvent.change(screen.getByPlaceholderText(/bio/i), {
			target: { value: 'Just a test user.' },
		});
		fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
			target: { value: '1234567890' },
		});
		expect(screen.getByRole('button', { name: /sign up/i })).toBeEnabled();
	});
});
