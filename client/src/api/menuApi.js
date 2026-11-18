import URL from "../utils/URL";
const BASE_URL = `${URL}/menu`;
import { store } from "../redux/store";

const resolveToken = (token) => token || store.getState()?.auth?.token;

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Get All Menu Items
export const getMenuItemsApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Search Menu
export const searchMenuApi = async (keyword, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(
    `${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  return handleResponse(response);
};

// Restaurant Menu
export const getRestaurantMenuApi = async (restaurantId, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/restaurant/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Category Menu
export const getCategoryMenuApi = async (categoryId, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/category/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Available Menu
export const getAvailableMenuApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/available`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Specials
export const getSpecialsApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/specials`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Deals
export const getDealsApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/deals`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Get Menu Item by ID
export const getMenuItemByIdApi = async (id, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Create Menu Item
export const createMenuItemApi = async (payload, token) => {
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

// Update Menu Item
export const updateMenuItemApi = async (id, payload, token) => {
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

// Delete Menu Item
export const deleteMenuItemApi = async (id, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Add Special
export const addSpecialApi = async (id, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}/special`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Remove Special
export const removeSpecialApi = async (id, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}/special`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Add Deal
export const addDealApi = async (id, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}/deal`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Remove Deal
export const removeDealApi = async (id, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${id}/deal`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};