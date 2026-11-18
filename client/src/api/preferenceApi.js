import { store } from "../redux/store";
import URL from "../utils/URL";
const BASE_URL = `${URL}/preferences`;
const resolveToken = (token) => token || store.getState()?.auth?.token;

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Get user preferences
export const getPreferencesApi = async (token) => {
  const authToken = resolveToken(token);

  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Update preferences
export const updatePreferencesApi = async (payload, token) => {
  const authToken = resolveToken(token);

  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Backward compatibility
export const createPreferenceApi = updatePreferencesApi;

// Add favorite category
export const addFavoriteCategoryApi = async (categoryId, token) => {
  const authToken = resolveToken(token);

  const response = await fetch(
    `${BASE_URL}/categories/${categoryId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  return handleResponse(response);
};

// Remove favorite category
export const removeFavoriteCategoryApi = async (categoryId, token) => {
  const authToken = resolveToken(token);

  const response = await fetch(
    `${BASE_URL}/categories/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  return handleResponse(response);
};

// Delete preference
export const deletePreferenceApi = async (id, token) => {
  const authToken = resolveToken(token);

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};