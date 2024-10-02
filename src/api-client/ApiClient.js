const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function handleResponse(response) {
	if (!response.ok) {
		const error = await response.text();
		return { error: error || 'Something went wrong' };
	}
	return await response.json();
}

export async function createUser(createUserRequest) {
	const response = await fetch(`${API_BASE_URL}/CreateUser`, {
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
	return { logic_token: result.Logic_token, db_token: result.Db_token };
}

export async function login(loginRequest) {
	const response = await fetch(`${API_BASE_URL}/VerifyLoginCredentials`, {
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
	return { logic_token: result.Logic_token, db_token: result.Db_token };
}

export async function makeAuthenticatedRequest(endpoint, options = {}) {
	const logicToken = localStorage.getItem('logic_token');
	const dbToken = localStorage.getItem('db_token');

	const headers = {
		...options.headers,
		Authorization: `Bearer ${logicToken}`,
		'X-Db-Token': dbToken,
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	return handleResponse(response);
}
