/**
 * API Fetch Utilities
 *
 * This module provides standardized utility functions for interacting with backend API endpoints.
 * It includes support for paginated list fetching, single resource retrieval, and mutation actions.
 *
 * Usage:
 *  - fetchListData: for paginated list endpoints
 *  - fetchPageData: for fetching a single page/resource
 *  - mutateData: for POST, PUT, DELETE actions
 */

const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not set. Add it to your .env file (e.g. VITE_API_BASE_URL=http://localhost:8080/api)",
  );
}

export const ENDPOINTS = {
  org: API_URL,
  courses: `${API_URL}/courses`,
  instructors: `${API_URL}/instructors`,
  students: `${API_URL}/students`,
  registrations: `${API_URL}/registrations`,
  dashboardSummary: `${API_URL}/dashboard-summary`,
};

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetches all paginated results from a list endpoint.
 * Accepts optional query parameters and accumulates all pages into a single array.
 */
export async function fetchListData<T = any>(
  slug: keyof typeof ENDPOINTS,
  route: string,
  data?: Record<string, any>,
  token?: string,
): Promise<T[]> {
  const endpoint = ENDPOINTS[slug];
  if (!endpoint) {
    throw new Error(`Invalid endpoint slug: ${slug}`);
  }

  // Convert `data` to query params if present
  let url = `${endpoint}${route}`;
  if (data && Object.keys(data).length > 0) {
    const queryString = new URLSearchParams(data).toString();
    url += (url.includes("?") ? "&" : "?") + queryString;
  }

  const results: T[] = [];

  while (url) {
    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(token),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Fetch failed: ${res.status} ${res.statusText} – ${errorText}`,
      );
    }

    const page = await res.json();
    results.push(...(Array.isArray(page) ? page : page.results));
    url = page.next || null;
  }

  return results;
}

/**
 * Core data fetcher used by all other functions.
 * Supports method override and optional request body.
 */
async function fetchData<T = any>(
  url: string,
  method: string = "GET",
  data?: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: buildHeaders(token),
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Fetch failed: ${res.status} ${res.statusText} – ${errorText}`,
    );
  }

  if (res.status === 204 || method === "DELETE") {
    return {} as T;
  }

  return await res.json();
}

/**
 * Fetches a single page or object from a named endpoint using a GET request.
 */
export async function fetchPageData<T = any>(
  slug: keyof typeof ENDPOINTS,
  route: string,
  data?: unknown,
  token?: string,
): Promise<T> {
  const endpoint = ENDPOINTS[slug];
  if (!endpoint) {
    throw new Error(`Invalid endpoint slug: ${slug}`);
  }
  const url = `${endpoint}${route}`;
  const res = await fetchData<T>(url, "GET", data, token);
  return res;
}

/**
 * Sends a mutation request (POST, PUT, DELETE) to a named endpoint.
 */
export async function mutateData<I = any, O = any>(
  slug: keyof typeof ENDPOINTS,
  route: string,
  method: string,
  data: I,
  token?: string,
): Promise<O> {
  const endpoint = ENDPOINTS[slug];
  if (!endpoint) {
    throw new Error(`Invalid endpoint slug: ${slug}`);
  }
  const url = `${endpoint}${route}`;
  return await fetchData<O>(url, method, data, token);
}
