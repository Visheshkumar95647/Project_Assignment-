import URL from "../utils/URL";
const BASE_URL = `${URL}/cart`;
import { store } from "../redux/store";

const resolveToken = (token) => token || store.getState()?.auth?.token;

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Get Cart
export const getCartApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return {
      items: [],
      restaurant_id: null,
      restaurant_name: "",
    };
  }

  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status === 400) {
    const data = await response.json();
    const detail = String(data?.detail || data?.message || "").toLowerCase();

    if (
      detail.includes("cart is empty") ||
      detail.includes("cart not found")
    ) {
      return {
        items: [],
        restaurant_id: null,
        restaurant_name: "",
      };
    }

    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return handleResponse(response);
};

// Add Item
export const addToCartApi = async (payload, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Update Quantity
export const updateCartItemApi = async (itemId, payload, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Delete Item
export const deleteCartItemApi = async (itemId, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Clear Cart
export const clearCartApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};