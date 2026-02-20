export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api";

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  return response;
}
