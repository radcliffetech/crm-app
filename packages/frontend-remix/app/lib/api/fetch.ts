export async function getResults<T>(res: Response): Promise<T[]> {
    const data = await res.json();
    return Array.isArray(data) ? data : data.results;
}
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
    org: API_URL,
    courses: `${API_URL}/courses`,
    instructors: `${API_URL}/instructors`,
    students: `${API_URL}/students`,
    registrations: `${API_URL}/registrations`,
    dashboardSummary: `${API_URL}/dashboard-summary`,
};


export async function fetchListData<T = any>(
    slug: keyof typeof ENDPOINTS,
    route: string,
    data?: Record<string, any>
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
        throw new Error(`Fetch failed: ${res.status} ${res.statusText} – ${errorText}`);
      }
  
      const page = await res.json();
      results.push(...(Array.isArray(page) ? page : page.results));
      url = page.next || null;
    }
  
    return results;
}

export async function fetchData<T = any>(
    url: string,
    method: string = "GET",
    data?: unknown
): Promise<T> {
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch failed: ${res.status} ${res.statusText} – ${errorText}`);
      }
      
      if (res.status === 204 || method === "DELETE") {
        return {} as T;
      }
      
      return await res.json();
}

export async function fetchPageData<T = any>(
    slug: keyof typeof ENDPOINTS,
    route: string,
    data?: unknown
): Promise<T> {
    const endpoint = ENDPOINTS[slug];
    if (!endpoint) {
        throw new Error(`Invalid endpoint slug: ${slug}`);
    }
    const url = `${endpoint}${route}`;
    const res = await fetchData<T>(url, "GET", data);
    return res;
}

export async function mutateData<I = any, O = any>(
    slug: keyof typeof ENDPOINTS,
    route: string,
    method: string,
    data: I
): Promise<O> {
    const endpoint = ENDPOINTS[slug];
    if (!endpoint) {
        throw new Error(`Invalid endpoint slug: ${slug}`);
    }
    const url = `${endpoint}${route}`;
    return await fetchData<O>(url, method, data);
}
