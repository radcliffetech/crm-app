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

export const ENDPOINTS = {
  org: API_URL,
  courses: `${API_URL}/courses`,
  instructors: `${API_URL}/instructors`,
  students: `${API_URL}/students`,
  registrations: `${API_URL}/registrations`,
  dashboardSummary: `${API_URL}/dashboard-summary`,
};

/**
 * Fetches all paginated results from a list endpoint.
 * Accepts optional query parameters and accumulates all pages into a single array.
 */
export async function fetchListData<T = any>(
  slug: keyof typeof ENDPOINTS,
  route: string,
  data?: Record<string, any>,
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
      headers: { "Content-Type": "application/json" },
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
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
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
): Promise<T> {
  const endpoint = ENDPOINTS[slug];
  if (!endpoint) {
    throw new Error(`Invalid endpoint slug: ${slug}`);
  }
  const url = `${endpoint}${route}`;
  const res = await fetchData<T>(url, "GET", data);
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
): Promise<O> {
  const endpoint = ENDPOINTS[slug];
  if (!endpoint) {
    throw new Error(`Invalid endpoint slug: ${slug}`);
  }
  const url = `${endpoint}${route}`;
  return await fetchData<O>(url, method, data);
}
