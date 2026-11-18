import URL from "../utils/URL";
const BASE_URL = `${URL}/favorites`;
import { store } from "../redux/store";

const resolveToken = (token) => token || store.getState()?.auth?.token;

const normalizeFavorite = (item) => {
  if (!item || typeof item !== "object") {
    return item;
  }

  const restaurant =
    item.restaurant && typeof item.restaurant === "object"
      ? item.restaurant
      : null;

  const restaurantId =
    item.restaurant_id ??
    restaurant?.id ??
    item.id ??
    null;

  return {
    ...item,
    ...(restaurant || {}),
    id: restaurantId,
    restaurant_id: restaurantId,
    name: item.name ?? restaurant?.name ?? "",
    address: item.address ?? restaurant?.address ?? "",
    image_url: item.image_url ?? restaurant?.image_url ?? "",
  };
};

const normalizeFavorites = (data) =>
  Array.isArray(data)
    ? data.map(normalizeFavorite)
    : [];

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Get All Favorites
export const getFavoritesApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await handleResponse(response);
  return normalizeFavorites(data);
};

// Get Favorite Restaurants
export const getFavoriteRestaurantsApi = async (token) => {
  const authToken = resolveToken(token);

  if (!authToken) {
    return [];
  }

  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await handleResponse(response);
  return normalizeFavorites(data);
};

// Add Favorite
export const addFavoriteApi = async (restaurantId, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${restaurantId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};

// Remove Favorite
export const removeFavoriteApi = async (restaurantId, token) => {
  const authToken = resolveToken(token);
  const response = await fetch(`${BASE_URL}/${restaurantId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};