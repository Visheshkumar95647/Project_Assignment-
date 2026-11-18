import { store } from "../redux/store";
import URL from "../utils/URL";
const BASE_URL = `${URL}/restaurants`;
const resolveToken = (token) => token || store.getState()?.auth?.token;

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Get All Restaurants
export const getRestaurantsApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Search Restaurants
export const searchRestaurantsApi = async (
  keyword = null,
  location = null,
  category = null,
  token = null
) => {
  const authToken = resolveToken(token);
  const params = new URLSearchParams();

  if (keyword) params.set("keyword", keyword);
  if (location) params.set("location", location);
  if (category) params.set("category", category);

  const queryString = params.toString();
  const url = queryString ? `${BASE_URL}/search?${queryString}` : `${BASE_URL}/search`;

  const response = await fetch(url, {
    headers: {



      // Add Interceptor layer for this ....*************


      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Get Restaurant by ID
export const getRestaurantByIdApi = async (id, token) => {  const authToken = resolveToken(token);  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Get Owner Restaurants
export const getMyRestaurantsApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/owner/my-restaurants`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};


// Owner 


// Create Restaurant
export const createRestaurantApi = async (payload, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Update Restaurant
export const updateRestaurantApi = async (id, payload, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Delete Restaurant
export const deleteRestaurantApi = async (id, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};