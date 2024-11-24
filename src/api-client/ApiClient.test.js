import {
	createUser,
	login,
	makeAuthenticatedRequest,
	editUser,
	getUser,
	savePost,
	getPosts,
	createConversation,
	postMessage,
	getAllConversations,
	pollConversation,
} from './ApiClient';
import '@testing-library/jest-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_AUTH_URL = process.env.REACT_APP_API_AUTH_URL;

describe('ApiClient', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createUser', () => {
		test('should return tokens on successful user creation', async () => {
			jest.clearAllMocks();
			const mockResponse = {
				logic_token: 'logicToken123',
				db_token: 'dbToken456',
				user_id: 'user1',
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

			expect(fetch).toHaveBeenCalledWith(`${API_AUTH_URL}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(createUserRequest),
			});
			expect(result).toEqual({
				logic_token: 'logicToken123',
				db_token: 'dbToken456',
				user_id: 'user1',
			});
		});

		test('should return error when user creation fails', async () => {
			jest.clearAllMocks();
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
			jest.clearAllMocks();
			const mockResponse = {
				logic_token: 'logicToken123',
				db_token: 'dbToken456',
				user_id: 'user1',
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
				`${API_AUTH_URL}/users/login`,
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
				user_id: 'user1',
			});
		});

		test('should return error on failed login', async () => {
			jest.clearAllMocks();
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
					'X-User-ID': 'user1',
				},
			});
			expect(result).toEqual(mockResponse);
		});

		test('should return error on failed authenticated request', async () => {
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
			const mockErrorResponse = 'Authentication failed';

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

	describe('editUser', () => {
		test('should successfully edit user', async () => {
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
			const editUserRequest = {
				name: 'New Name',
				email: 'new@example.com',
				phone: '9876543210',
			};

			const mockResponse = { success: true };

			// Mocking the fetch API response
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await editUser(editUserRequest);
			expect(result).toEqual(mockResponse);
		});

		test('should return error when edit user fails', async () => {
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
			const editUserRequest = {
				name: 'New Name',
				email: 'new@example.com',
				phone: '9876543210',
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve('Failed to update user data'),
				})
			);

			const result = await editUser(editUserRequest);

			expect(result).toEqual({ error: 'Failed to update user data' });
		});
	});

	describe('getUser', () => {
		test('should successfully fetch user data', async () => {
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
			const mockResponse = {
				name: 'Test User',
				email: 'test@example.com',
				bio: 'Test bio',
				phone: '1234567890',
				photo: 'url/to/photo.jpg',
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await getUser();
			expect(result).toEqual(mockResponse);
		});

		test('should return error when fetch user fails', async () => {
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
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve('Failed to fetch user data'),
				})
			);

			const result = await getUser();

			expect(result).toEqual({ error: 'Failed to fetch user data' });
		});
	});

	describe('savePost', () => {
		test('should successfully save post', async () => {
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
			const savePostRequest = {
				title: 'Test Post',
				content: 'This is a test post.',
			};

			const mockResponse = { token: 'postToken123' };

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await savePost(savePostRequest);

			expect(result).toEqual({ token: 'postToken123' });
		});

		test('should return error when save post fails', async () => {
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
			const savePostRequest = {
				title: 'Test Post',
				content: 'This is a test post.',
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve('Failed to save post'),
				})
			);

			const result = await savePost(savePostRequest);

			expect(result).toEqual({ error: 'Failed to save post' });
		});
	});

	describe('getPosts', () => {
		test('should successfully fetch posts', async () => {
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
			const mockResponse = [
				{ id: 1, title: 'Post 1', content: 'Content of post 1' },
				{ id: 2, title: 'Post 2', content: 'Content of post 2' },
			];

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await getPosts('user1');
			expect(result).toEqual(mockResponse);
		});

		test('should return error when fetching posts fails', async () => {
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
			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve('Failed to fetch posts'),
				})
			);

			const result = await getPosts('user1');

			expect(result).toEqual({ error: 'Failed to fetch posts' });
		});

		test('should return error when userId is missing', async () => {
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
			const result = await getPosts();

			expect(result).toEqual({ error: 'User ID is required' });
		});
	});

	describe('createConversation', () => {
		test('should successfully create a conversation', async () => {
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
			const mockResponse = { conversationId: 'ccccc-cccccccccc-ccccc' };

			const createConversationRequest = {
				userId: 'user1',
				contents: 'Hello, how are you?',
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await createConversation(createConversationRequest);
			expect(result).toEqual(mockResponse);
		});

		test('should return error when creating conversation fails', async () => {
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
			const mockErrorResponse = 'Failed to create conversation';

			const createConversationRequest = {
				userId: 'user1',
				contents: 'Hello, how are you?',
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve(mockErrorResponse),
				})
			);

			const result = await createConversation(createConversationRequest);

			expect(result).toEqual({ error: mockErrorResponse });
		});
	});

	describe('postMessage', () => {
		test('should successfully post a message', async () => {
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
			const mockResponse = { conversationId: 'ccccc-cccccccccc-ccccc' };
			const postMessageRequest = {
				conversationId: 'ccccc-cccccccccc-ccccc',
				contents: 'This is a message.',
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await postMessage(postMessageRequest);
			expect(result).toEqual(mockResponse);
		});

		test('should return error when posting message fails', async () => {
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
			const mockErrorResponse = 'Failed to post message';

			const postMessageRequest = {
				conversationId: 'ccccc-cccccccccc-ccccc',
				contents: 'This is a message.',
			};

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve(mockErrorResponse),
				})
			);

			const result = await postMessage(postMessageRequest);

			expect(result).toEqual({ error: mockErrorResponse });
		});
	});

	describe('getAllConversations', () => {
		test('should successfully fetch all conversations', async () => {
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
			const mockResponse = [
				{
					conversationId: 'ccccc-cccccccccc-ccccc',
					user: { userId: 'user1', name: 'Bob', photo: 'url/to/profile' },
					messages: [
						{
							timeStamp: '2023-09-20T15:00:00Z',
							senderId: 'user1',
							contents: 'Hello!',
						},
					],
					postId: 'aaaaa-aaaaaaaaaa-aaaaa',
				},
			];

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await getAllConversations();
			expect(result).toEqual(mockResponse);
		});

		test('should return error when fetching conversations fails', async () => {
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
			const mockErrorResponse = 'Failed to fetch conversations';

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve(mockErrorResponse),
				})
			);

			const result = await getAllConversations();

			expect(result).toEqual({ error: mockErrorResponse });
		});
	});

	describe('pollConversation', () => {
		test('should successfully poll conversation', async () => {
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
			const mockResponse = {
				conversationId: 'ccccc-cccccccccc-ccccc',
				user: { userId: 'user1', name: 'Bob', photo: 'url/to/profile' },
				messages: [
					{
						timeStamp: '2023-09-20T15:00:00Z',
						senderId: 'user1',
						contents: 'Hello!',
					},
				],
				postId: 'aaaaa-aaaaaaaaaa-aaaaa',
			};

			const conversationId = 'ccccc-cccccccccc-ccccc';
			const timeStamp = '2023-09-20T14:59:00Z';

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				})
			);

			const result = await pollConversation(conversationId, timeStamp);
			expect(result).toEqual(mockResponse);
		});

		test('should return error when polling conversation fails', async () => {
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
			const mockErrorResponse = 'Failed to poll conversation';
			const conversationId = 'ccccc-cccccccccc-ccccc';
			const timeStamp = '2023-09-20T14:59:00Z';

			global.fetch = jest.fn(() =>
				Promise.resolve({
					ok: false,
					text: () => Promise.resolve(mockErrorResponse),
				})
			);

			const result = await pollConversation(conversationId, timeStamp);

			expect(result).toEqual({ error: mockErrorResponse });
		});
	});
});
