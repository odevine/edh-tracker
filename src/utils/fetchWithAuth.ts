import { API_BASE_PATH } from "@/constants";

export const fetchWithAuth = (
  path: string,
  token: string | null,
  options: RequestInit = {},
) => {
  const url = `${API_BASE_PATH}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};
