import { store } from "../redux/store";
import URL from "../utils/URL";
const BASE_URL = `${URL}/menu`;
const resolveToken = (token) => token || store.getState()?.auth?.token;

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Filter menu items by cuisine, restaurant, and price
export const filterMenuItemsApi = async (
  keyword = null,
  // cuisine = null,
  restaurant_id = null,
  min_price = null,
  max_price = null,
  category_id = null,
  token = null
) => {
  const authToken = resolveToken(token);
  const params = new URLSearchParams();

  if (keyword) params.set("keyword", keyword);
  if (cuisine) params.set("cuisine", cuisine);
  if (restaurant_id) params.set("restaurant_id", restaurant_id);
  if (min_price !== null) params.set("min_price", min_price);
  if (max_price !== null) params.set("max_price", max_price);
  if (category_id) params.set("category_id", category_id);

  const queryString = params.toString();
  const url = queryString ? `${BASE_URL}/filter?${queryString}` : `${BASE_URL}/filter`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};
