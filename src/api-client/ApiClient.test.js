import { createUser, login, makeAuthenticatedRequest } from './ApiClient';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

describe('ApiClient', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createUser', () => {
		test('should return tokens on successful user creation', async () => {
			const mockResponse = {
				logic_token: 'logicToken123',
				db_token: 'dbToken456',
				user_id: 'user1'
			};

			// Mocking the fetch API response
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const createUserRequest = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashedPassword123',
				bio: 'test bio',
				phone: '1234567890',
			};

			const result = await createUser(createUserRequest);

			expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/CreateUser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(createUserRequest),
			});
			expect(result).toEqual({
				logic_token: 'logicToken123',
				db_token: 'dbToken456',
				user_id: 'user1'
			});
		});

		test('should return error when user creation fails', async () => {
			// Mocking the fetch API response for failure
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve('User creation failed'),
				})
			);

			const createUserRequest = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'hashedPassword123',
			};

			const result = await createUser(createUserRequest);

			expect(result).toEqual({ error: 'User creation failed' });
		});
	});

	describe('login', () => {
		test('should return tokens on successful login', async () => {
			const mockResponse = {
				logic_token: 'logicToken123',
				db_token: 'dbToken456',
				user_id: 'user1'
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const loginRequest = {
				email: 'test@example.com',
				password: 'password123',
			};

			const result = await login(loginRequest);

			expect(fetch).toHaveBeenCalledWith(
				`${API_BASE_URL}/VerifyLoginCredentials`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(loginRequest),
				}
			);
			expect(result).toEqual({
				logic_token: 'logicToken123',
				db_token: 'dbToken456',
				user_id: 'user1'
			});
		});

		test('should return error on failed login', async () => {
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve('Invalid login credentials'),
				})
			);

			const loginRequest = {
				email: 'test@example.com',
				password: 'wrongpassword',
			};

			const result = await login(loginRequest);

			expect(result).toEqual({ error: 'Invalid login credentials' });
		});
	});

	describe('makeAuthenticatedRequest', () => {
		test('should make authenticated request successfully', async () => {
			const mockResponse = { data: 'Some data' };

			// Mocking localStorage
			const mockLocalStorage = {
				getItem: jest.fn((key) => {
					if (key === 'logic_token') return 'logicToken123';
					if (key === 'db_token') return 'dbToken456';
					if (key === 'user_id') return 'user1';
					return null;
				}),
			};

			Object.defineProperty(window, 'localStorage', {
				value: mockLocalStorage,
			});

			// Mocking the fetch API response
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await makeAuthenticatedRequest('/some-endpoint', {
				method: 'GET',
			});

			expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/some-endpoint`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer logicToken123',
					'X-Db-Token': 'dbToken456',
					'X-User-ID': 'user1'
				},
			});
			expect(result).toEqual(mockResponse);
		});

		test('should return error on failed authenticated request', async () => {
			const mockErrorResponse = 'Authentication failed';

			// Mocking the localStorage
			const mockLocalStorage = {
				getItem: jest.fn((key) => {
					if (key === 'logic_token') return 'logicToken123';
					if (key === 'db_token') return 'dbToken456';
					if (key === 'user_id') return 'user1';
					return null;
				}),
			};
			Object.defineProperty(window, 'localStorage', {
				value: mockLocalStorage,
			});

			// Mocking the fetch API response
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve(mockErrorResponse),
				})
			);

			const result = await makeAuthenticatedRequest('/some-endpoint', {
				method: 'GET',
			});

			expect(result).toEqual({ error: mockErrorResponse });
		});
	});
});
