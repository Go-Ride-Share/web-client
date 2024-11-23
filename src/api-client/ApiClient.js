const API_AUTH_URL = process.env.REACT_APP_API_AUTH_URL;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function handleResponse(response) {
	if (!response.ok) {
		const error = await response.text();
		return { error: error || 'Something went wrong' };
	}
	return await response.json();
}

export async function createUser(createUserRequest) {
	const response = await fetch(`${API_AUTH_URL}/CreateUser`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(createUserRequest),
	});
	return handleResponse(response);
}

export async function login(loginRequest) {
	const response = await fetch(`${API_AUTH_URL}/VerifyLoginCredentials`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(loginRequest),
	});
	return handleResponse(response);
}

export async function getUser() {
	const result = await makeAuthenticatedRequest('/GetUser', {
		method: 'GET',
	});
	return result;
}

export async function editUser(editUserRequest) {
	const result = await makeAuthenticatedRequest('/EditUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(editUserRequest),
	});
	return result;
}

export async function makeAuthenticatedRequest(endpoint, options = {}) {
	const logicToken = localStorage.getItem('logic_token');
	const dbToken = localStorage.getItem('db_token');
	const userId = localStorage.getItem('user_id');

	const headers = {
		...options.headers,
		Authorization: `Bearer ${logicToken}`,
		'X-Db-Token': dbToken,
		'X-User-ID': userId,
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	return handleResponse(response);
}

export async function savePost(savePostRequest) {
	const result = await makeAuthenticatedRequest('/SavePost', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(savePostRequest),
	});
	return result;
}

export async function getPosts(userId) {
	if (!userId) {
		return { error: 'User ID is required' };
	}

	const result = await makeAuthenticatedRequest(`/getPosts?userId=${userId}`, {
		method: 'GET',
	});
	return result;
}

export async function getAllPosts() {
	const response = await fetch(`${API_AUTH_URL}/getAllPosts`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return handleResponse(response);
}

export async function searchPosts() {
	const response = await fetch(`${API_AUTH_URL}/posts/search`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	//return handleResponse(response);
	return [
    {
        "postId": "0523e365-2499-46ad-b71f-c12e5128f2ee",
        "posterId": "09c453af-8065-42b7-9836-947eace8d6aa",
        "name": "Ben's Post",
        "description": "EXAMPLE",
        "departureDate": "2024-11-08T06:00:00.000Z",
        "originLat": 49.83,
        "originLng": -97.35,
        "destinationLat": 49.9,
        "destinationLng": -96.99,
        "price": 8000,
        "seatsAvailable": 45
    },
    {
        "postId": "24329e45-7996-4956-8df2-6e31e3275db4",
        "posterId": "09c453af-8065-42b7-9836-947eace8d6aa",
        "name": "Ben's Post",
        "description": "EXAMPLE",
        "departureDate": "2024-11-08T06:00:00.000Z",
        "originLat": 49.83,
        "originLng": -97.35,
        "destinationLat": 49.9,
        "destinationLng": -96.99,
        "price": 8000,
        "seatsAvailable": 45
    },
    {
        "postId": "32857aad-86b4-4f6c-a86f-b235ab154225",
        "posterId": "09c453af-8065-42b7-9836-947eace8d6aa",
        "name": "Ben's Post",
        "description": "EXAMPLE",
        "departureDate": "2024-11-08T06:00:00.000Z",
        "originLat": 49.83,
        "originLng": -97.35,
        "destinationLat": 49.9,
        "destinationLng": -96.99,
        "price": 8000,
        "seatsAvailable": 45
    },
    {
        "postId": "3a9d6aac-6174-4e94-b377-4c6f51f79fb9",
        "posterId": "2447c169-3476-4aee-872f-a64469a8138e",
        "name": "testing directions",
        "description": "e",
        "departureDate": "2024-11-10T06:00:00.000Z",
        "originLat": 49.945477,
        "originLng": -97.14592,
        "destinationLat": 49.894657,
        "destinationLng": -97.148285,
        "price": 50,
        "seatsAvailable": 2
    },
    {
        "postId": "41d03d02-83de-4397-a464-102f21a25b07",
        "posterId": "09c453af-8065-42b7-9836-947eace8d6aa",
        "name": "Ben's Post",
        "description": "EXAMPLE",
        "departureDate": "2024-11-08T06:00:00.000Z",
        "originLat": 49.83,
        "originLng": -97.35,
        "destinationLat": 49.9,
        "destinationLng": -96.99,
        "price": 8000,
        "seatsAvailable": 45
    },
    {
        "postId": "48de4b17-d9ad-49a5-803b-c051ef114776",
        "posterId": "2447c169-3476-4aee-872f-a64469a8138e",
        "name": "t2",
        "description": "2",
        "departureDate": "2024-11-19T06:00:00.000Z",
        "originLat": 49.90483,
        "originLng": -97.11378,
        "destinationLat": 49.865013,
        "destinationLng": -97.09867,
        "price": 2,
        "seatsAvailable": 2
    },
    {
        "postId": "5d1d76b5-92b6-4786-a81f-185f1570cc83",
        "posterId": "2447c169-3476-4aee-872f-a64469a8138e",
        "name": "ClI test 2",
        "description": "Trip to Mars",
        "departureDate": "2050-01-01",
        "originLat": 45.1,
        "originLng": 45.1,
        "destinationLat": 45.1,
        "destinationLng": 45.1,
        "price": 9999.99,
        "seatsAvailable": 1
    },
    {
        "postId": "6cec426e-aef5-4aae-bc52-68581c177b72",
        "posterId": "a126175d-020e-4e51-88c1-b16ce039ed30",
        "name": "Test post 2",
        "description": "Test post 2",
        "departureDate": "2024-11-04T06:00:00.000Z",
        "originLat": 49.92,
        "originLng": -97.21,
        "destinationLat": 49.84,
        "destinationLng": -97.05,
        "price": 3,
        "seatsAvailable": 1
    },
    {
        "postId": "94d69500-4062-4568-84d0-4fd9eceeec5f",
        "posterId": "2447c169-3476-4aee-872f-a64469a8138e",
        "name": "X",
        "description": "x",
        "departureDate": "2048-12-12",
        "originLat": 23.2,
        "originLng": 23.2,
        "destinationLat": 23.2,
        "destinationLng": 23.2,
        "price": 90,
        "seatsAvailable": 1
    },
    {
        "postId": "960958be-5e37-4b9a-b2a3-5b41dbd6fb46",
        "posterId": "2447c169-3476-4aee-872f-a64469a8138e",
        "name": "Trip to Mars!",
        "description": "Space X to Mars with Elon!",
        "departureDate": "2048-12-12",
        "originLat": 56,
        "originLng": -45,
        "destinationLat": -90,
        "destinationLng": -180,
        "price": 9999.99,
        "seatsAvailable": 1
    },
    {
        "postId": "a876aa78-0440-4023-936d-930310e6bb2c",
        "posterId": "ab2bbb2f-c79e-4f84-8a33-53c72acce8e2",
        "name": "Test Post Name",
        "description": "Test Desc",
        "departureDate": "2024-11-21T06:00:00.000Z",
        "originLat": 49.910114,
        "originLng": -97.23656,
        "destinationLat": 49.81661,
        "destinationLng": -97.14916,
        "price": 20,
        "seatsAvailable": 2
    },
    {
        "postId": "b3b9f2d6-03b2-4f5f-8b38-e884d3984069",
        "posterId": "9f69047f-6d1b-4409-9207-5fd6e7420fa3",
        "name": "Testing CLI",
        "description": "12",
        "departureDate": "1212-12-12",
        "originLat": 12,
        "originLng": 12,
        "destinationLat": 12,
        "destinationLng": 12,
        "price": 12,
        "seatsAvailable": 1
    },
    {
        "postId": "b92f2ce4-9a3f-4a7c-99c7-2cb155b36e7e",
        "posterId": "2447c169-3476-4aee-872f-a64469a8138e",
        "name": "23",
        "description": "ff",
        "departureDate": "2024-12-12",
        "originLat": 33.92,
        "originLng": -118.35,
        "destinationLat": 24.85,
        "destinationLng": 113.25,
        "price": 34,
        "seatsAvailable": 1
    },
    {
        "postId": "d5adaf2f-ea4e-4e15-b618-786c1b34a059",
        "posterId": "ab2bbb2f-c79e-4f84-8a33-53c72acce8e2",
        "name": "Test post",
        "description": "Test post",
        "departureDate": "2024-11-04T06:00:00.000Z",
        "originLat": 49.88,
        "originLng": -97.32,
        "destinationLat": 49.88,
        "destinationLng": -96.95,
        "price": 2,
        "seatsAvailable": 2
    },
    {
        "postId": "db123886-7bb9-47e5-bb88-e4b17fabbd5c",
        "posterId": "ab2bbb2f-c79e-4f84-8a33-53c72acce8e2",
        "name": "Wpg to Brandon",
        "description": "Wpg to Brandon",
        "departureDate": "2024-11-05T06:00:00.000Z",
        "originLat": 49.87,
        "originLng": -97.17,
        "destinationLat": 49.81,
        "destinationLng": -97.18,
        "price": 20,
        "seatsAvailable": 2
    },
    {
        "postId": "f2126190-df08-490a-b766-cb4cbb08568a",
        "posterId": "9eec17dc-24cd-4d58-bb7d-9b2120357900",
        "name": "Test Post name",
        "description": "desc",
        "departureDate": "2024-11-21T06:00:00.000Z",
        "originLat": 49.910114,
        "originLng": -97.23656,
        "destinationLat": 49.852818,
        "destinationLng": -97.05425,
        "price": 20,
        "seatsAvailable": 1
    }
]
}

export async function getPost(postId) {
	const response = await fetch(`${API_AUTH_URL}/posts/${postId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return handleResponse(response);
}

export async function createConversation(createConversationRequest) {
	const result = await makeAuthenticatedRequest('/CreateConversation', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(createConversationRequest),
	});
	return result;
}

export async function postMessage(postMessageRequest) {
	const result = await makeAuthenticatedRequest('/PostMessage', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(postMessageRequest),
	});
	return result;
}

export async function getAllConversations() {
	const result = await makeAuthenticatedRequest('/GetAllConversations', {
		method: 'GET',
	});
	return result; 
}

export async function pollConversation(conversationId, timeStamp) {
	const endpoint = timeStamp
		? `/PollConversation?conversationId=${conversationId}&timestamp=${timeStamp}`
		: `/PollConversation?conversationId=${conversationId}`;
	const result = await makeAuthenticatedRequest(endpoint, {
		method: 'GET',
	});
	return result;
}
