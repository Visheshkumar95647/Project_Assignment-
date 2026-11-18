import URL from "../utils/URL";
const BASE_URL = `${URL}/auth`;

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Something went wrong");
  }

  return data;
};

// Login
export const loginApi = async ({ email, password }) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response);
};

// Register
export const registerApi = async ({ name, email, password, role }) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  return handleResponse(response);
};

// Refresh Token
export const refreshTokenApi = async (refreshToken) => {
  const response = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  return handleResponse(response);
};

// Forgot Password
export const forgotPasswordApi = async (email) => {
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(response);
};

// Reset Password
export const resetPasswordApi = async ({ reset_token, new_password }) => {
  const response = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reset_token,
      new_password,
    }),
  });

  return handleResponse(response);
};

// Get Profile
export const getProfileApi = async (token) => {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};