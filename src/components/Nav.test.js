import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';

beforeEach(() => {
	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: jest.fn(),
			setItem: jest.fn(),
			removeItem: jest.fn(),
		},
		writable: true,
	});
});

jest.mock('react-router-dom', () => {
	const actualRouter = jest.requireActual('react-router-dom');
	return {
		...actualRouter,
		useNavigate: jest.fn(),
	};
});

describe('Nav component', () => {
	const mockNavigate = jest.fn();

	beforeEach(() => {
		useNavigate.mockReturnValue(mockNavigate);
	});

	test('renders Sign In button when user is not logged in', () => {
		window.localStorage.getItem.mockReturnValue(null);

		render(
			<Router>
				<ChakraProvider>
					<Nav />
				</ChakraProvider>
			</Router>
		);

		expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
		expect(screen.queryByText(/Sign Out/i)).not.toBeInTheDocument();
	});

	test('renders Sign Out button when user is logged in', () => {
		window.localStorage.getItem.mockImplementation((key) => {
			if (key === 'logic_token') return 'some_logic_token';
			if (key === 'db_token') return 'some_db_token';
			if (key === 'user_id') return 'some_user_id';
			return null;
		});

		render(
			<Router>
				<ChakraProvider>
					<Nav />
				</ChakraProvider>
			</Router>
		);

		expect(
			screen.getByRole('button', { name: /Sign Out/i })
		).toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: /Sign In/i })
		).not.toBeInTheDocument();
	});

	test('renders Post a Ride link when user is logged in', () => {
		window.localStorage.getItem.mockImplementation((key) => {
			if (key === 'logic_token') return 'some_logic_token';
			if (key === 'db_token') return 'some_db_token';
			if (key === 'user_id') return 'some_user_id';
			return null;
		});

		render(
			<Router>
				<ChakraProvider>
					<Nav />
				</ChakraProvider>
			</Router>
		);

		expect(screen.getByText(/Post a Ride/i)).toBeInTheDocument();
	});

	test('handles sign out', () => {
		window.localStorage.getItem.mockImplementation((key) => {
			if (key === 'logic_token') return 'some_logic_token';
			if (key === 'db_token') return 'some_db_token';
			if (key === 'user_id') return 'some_user_id';
			return null;
		});

		render(
			<Router>
				<ChakraProvider>
					<Nav />
				</ChakraProvider>
			</Router>
		);

		fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));

		expect(localStorage.removeItem).toHaveBeenCalledWith('logic_token');
		expect(localStorage.removeItem).toHaveBeenCalledWith('db_token');
		expect(localStorage.removeItem).toHaveBeenCalledWith('user_id');

		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});
