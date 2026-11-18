import { store } from "../redux/store";
import URL from "../utils/URL";
const BASE_URL = `${URL}/orders`;
const resolveToken = (token) => token || store.getState()?.auth?.token;

const handleResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data;
};

// Search order history
export const searchOrderHistoryApi = async (
  keyword = null,
  status = null,
  token = null
) => {
  const authToken = resolveToken(token);
  const params = new URLSearchParams();

  if (keyword) params.set("keyword", keyword);
  if (status) params.set("status", status);

  const queryString = params.toString();
  const url = queryString
    ? `${BASE_URL}/search?${queryString}`
    : `${BASE_URL}/search`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return handleResponse(response);
};
