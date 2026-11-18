import { store } from "../redux/store";
import URL from "../utils/URL";
const BASE_URL = `${URL}/`;

const resolveToken = (token) => token || store.getState()?.auth?.token;

const extractErrorMessage = (data) => {
  if (!data) return "Something went wrong";

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const firstError = data.detail[0];

    if (typeof firstError === "string") {
      return firstError;
    }

    if (firstError?.msg) {
      const field = Array.isArray(firstError.loc)
        ? firstError.loc[firstError.loc.length - 1]
        : "field";

      return `${field}: ${firstError.msg}`;
    }
  }

  return data?.message || "Something went wrong";
};

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
};

export const getProfileApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

export const updateProfileApi = async (data, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const changePasswordApi = async (data, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/profile/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};