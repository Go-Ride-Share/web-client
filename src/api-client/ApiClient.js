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
	const response = await fetch(`${API_AUTH_URL}/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(createUserRequest),
	});
	return handleResponse(response);
}

export async function passwordLogin(loginRequest) {
	const response = await fetch(`${API_AUTH_URL}/Users/PasswordLogin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(loginRequest),
	});
	return handleResponse(response);
}

export async function googleLogin(code) {
	const response = await fetch(`${API_AUTH_URL}/Users/GoogleLogin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: code,
	});
	return handleResponse(response);
}

export async function getUser() {
	const userId = localStorage.getItem('user_id');
	const result = await makeAuthenticatedRequest(`/users/${userId}`, {
		method: 'GET',
	});
	return result;
}

export async function editUser(editUserRequest) {
	const result = await makeAuthenticatedRequest('/users', {
		method: 'PATCH',
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
	const result = await makeAuthenticatedRequest('/posts', {
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

	const result = await makeAuthenticatedRequest(`/posts/${userId}`, {
		method: 'GET',
	});
	return result;
}

export async function getAllPosts() {
	const response = await fetch(`${API_AUTH_URL}/posts`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return handleResponse(response);
}

export async function searchPosts(searchPostRequest) {
	const response = await fetch(`${API_AUTH_URL}/posts/search`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(searchPostRequest),
	});

	return handleResponse(response);
}

export async function getPost(postId) {
	const response = await fetch(`${API_AUTH_URL}/posts?postId=${postId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return handleResponse(response);
}

export async function createConversation(createConversationRequest) {
	const result = await makeAuthenticatedRequest('/conversations', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(createConversationRequest),
	});
	return result;
}

export async function postMessage(postMessageRequest) {
	const result = await makeAuthenticatedRequest('/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(postMessageRequest),
	});
	return result;
}

export async function getAllConversations() {
	const result = await makeAuthenticatedRequest('/conversations', {
		method: 'GET',
	});
	return result; 
}

export async function pollConversation(conversationId, timeStamp) {
	const endpoint = timeStamp
		? `/messages/${conversationId}?timestamp=${timeStamp}`
		: `/messages/${conversationId}`;
	const result = await makeAuthenticatedRequest(endpoint, {
		method: 'GET',
	});
	return result;
}
