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

	return handleResponse(response);
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
