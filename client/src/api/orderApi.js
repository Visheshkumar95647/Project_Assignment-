import { store } from "../redux/store";
import URL from "../utils/URL";
const BASE_URL = `${URL}/orders`;
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

// Get Current Orders
export const getOrdersApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Create Order
export const createOrderApi = async (payload, token) => {
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

// Order History
export const getOrderHistoryApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(`${BASE_URL}/history`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Get Order By ID
export const getOrderByIdApi = async (orderId, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Owner Orders
export const getOwnerOrdersApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(`${BASE_URL}/owner`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Backward-compatible helper used by owner incoming orders page
// restaurantId is optional and used only for client-side filtering.
export const getIncomingOrdersApi = async (restaurantId, token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(`${BASE_URL}/owner`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Some backends return 404 when a restaurant has no orders.
  if (response.status === 404) {
    return [];
  }

  const orders = await handleResponse(response);

  if (!restaurantId) {
    return orders;
  }

  return (orders || []).filter(
    (order) => order.restaurant_id === Number(restaurantId)
  );
};

// Backward-compatible alias used by customer orders page
export const getMyOrdersApi = getOrderHistoryApi;

// Change Order Status
export const updateOrderStatusApi = async (orderId, status, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(response);
};