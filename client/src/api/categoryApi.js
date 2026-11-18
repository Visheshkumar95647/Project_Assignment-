import { store } from "../redux/store";
import URL from "../utils/URL";
const BASE_URL = `${URL}/categories`;
const resolveToken = (token) => token || store.getState()?.auth?.token;

const buildHeaders = (token, withJson = false) => {
  const authToken = resolveToken(token);
  const headers = {};

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Get All Categories
export const getCategoriesApi = async (token) => {
  const response = await fetch(BASE_URL, {
    headers: buildHeaders(token),
  });

  return handleResponse(response);
};

// Search Categories
export const searchCategoriesApi = async (keyword, restaurantId, token) => {
  const params = new URLSearchParams();
  params.set("keyword", keyword);

  if (restaurantId) {
    params.set("restaurant_id", String(restaurantId));
  }

  const response = await fetch(`${BASE_URL}/search?${params.toString()}`, {
    headers: buildHeaders(token),
  });

  return handleResponse(response);
};

// Get Categories of a Restaurant
export const getRestaurantCategoriesApi = async (restaurantId, token) => {
  const response = await fetch(`${BASE_URL}/restaurant/${restaurantId}`, {
    headers: buildHeaders(token),
  });

  return handleResponse(response);
};

// Get Category by ID
export const getCategoryByIdApi = async (id, token) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: buildHeaders(token),
  });

  return handleResponse(response);
};

// Create Category
export const createCategoryApi = async (payload, token) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Update Category
export const updateCategoryApi = async (id, payload, token) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Delete Category
export const deleteCategoryApi = async (id, token) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  return handleResponse(response);
};