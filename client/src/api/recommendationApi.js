import URL from "../utils/URL";
const BASE_URL = `${URL}/recommendations`;
import { store } from "../redux/store";

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

/**
 * Recommended Restaurants
 * GET /recommendations/restaurants
 */
export const getRecommendedRestaurantsApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(`${BASE_URL}/restaurants`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

/**
 * Recommended Menu Items
 * GET /recommendations/menu
 */
export const getRecommendedMenuApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(`${BASE_URL}/menu`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

/**
 * Popular Restaurants + Menu Items
 * GET /recommendations/popular
 */
export const getPopularRecommendationsApi = async (token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/popular`, {
    headers: authToken
      ? {
          Authorization: `Bearer ${authToken}`,
        }
      : {},
  });

  return handleResponse(response);
};