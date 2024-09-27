const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    return { error: error || "Something went wrong" };
  }
  return await response.json();
}

export async function createUser(createUserRequest) {
  const response = await fetch(`${API_BASE_URL}/CreateUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createUserRequest),
  });
  const result = await handleResponse(response);
  if (result.error) {
    return { error: result.error };
  }
  return { token: result.token };
}

export async function login(loginRequest) {
  const response = await fetch(`${API_BASE_URL}/VerifyLoginCredentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  });
  const result = await handleResponse(response);
  if (result.error) {
    return { error: result.error };
  }
  return { token: result.token };
}
