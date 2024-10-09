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
	const result = await handleResponse(response);
	if (result.error) {
		return { error: result.error };
	}
	return { logic_token: result.logic_token, db_token: result.db_token, user_id: result.user_id, photo: result.photo };
}

export async function login(loginRequest) {
	const response = await fetch(`${API_AUTH_URL}/VerifyLoginCredentials`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(loginRequest),
	});
	const result = await handleResponse(response);
	if (result.error) {
		return { error: result.error };
	}
	return { logic_token: result.logic_token, db_token: result.db_token, user_id: result.user_id, photo: result.photo };
}

export async function getUser() {
	try {
		const result = await makeAuthenticatedRequest('/GetUser', {
			method: 'GET',
		});
		if (result.error) {
			return { error: result.error };
		}
		return {
			name: result.name,
			email: result.email,
			bio: result.bio,
			phone: result.phone,
			photo: result.photo,
	};
	} catch (error) {
		return { error: 'Failed to fetch user data' };
	}
}

export async function editUser(editUserRequest) {
	try {
		const result = await makeAuthenticatedRequest('/EditUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editUserRequest),
		});
		if (result.error) {
			return { error: result.error };
		}
		return result;
	} catch (error) {
		return { error: 'Failed to update user data' };
	}
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

	const response = makeAuthenticatedRequest(
		`/SavePost`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(savePostRequest),
		}
	);
	if (response.error) {
		return { error: response.error };
	}
	return { token: response.token };
}

export async function getPosts(userId) {
	try {
		if (!userId) {
			return { error: 'User ID is required' };
		}

		const result = await makeAuthenticatedRequest(`/getPosts?userId=${userId}`, {
			method: 'GET',
		});

		if (result.error) {
			return { error: result.error };
		}

		return result;
	} catch (error) {
		return { error: 'Failed to fetch posts' };
	}
}