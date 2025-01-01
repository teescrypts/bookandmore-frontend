import { API_BASE_URL } from "@/paths";

interface RequestOptions<D> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: D | FormData;
  token?: string;
  contentType?: string;
  tag?: string;
}

async function apiRequest<T, D = undefined>(
  endpoint: string,
  {
    method = "GET",
    data,
    token,
    contentType = "application/json",
    tag,
  }: RequestOptions<D> = {}
): Promise<T> {
  const headers: HeadersInit = {};

  if (contentType === "application/json") {
    headers["Content-Type"] = contentType;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
    ...(tag && { next: { tags: [tag] } }),
  };

  if (data instanceof FormData) {
    options.body = data;
    delete headers["Content-Type"];
  } else if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    const result: T = await response.json();
    return result;
  } catch (error) {
    console.error("API request error:", error);
    throw new Error("API request error:");
  }
}

export default apiRequest;
