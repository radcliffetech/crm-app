import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock import.meta.env before importing the module
vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8080/api");

const { fetchListData, fetchPageData, mutateData, ENDPOINTS } = await import("./fetch");

describe("ENDPOINTS", () => {
  it("constructs endpoints from API_URL", () => {
    expect(ENDPOINTS.courses).toBe("http://localhost:8080/api/courses");
    expect(ENDPOINTS.students).toBe("http://localhost:8080/api/students");
    expect(ENDPOINTS.instructors).toBe("http://localhost:8080/api/instructors");
    expect(ENDPOINTS.registrations).toBe("http://localhost:8080/api/registrations");
    expect(ENDPOINTS.dashboardSummary).toBe("http://localhost:8080/api/dashboard-summary");
  });
});

describe("fetchListData", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches a simple array response", async () => {
    const mockData = [{ id: "1", name: "Test" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const result = await fetchListData("courses", "/");
    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/courses/",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("fetches paginated results and follows next links", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            results: [{ id: "1" }],
            next: "http://localhost:8080/api/courses/?page=2",
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            results: [{ id: "2" }],
            next: null,
          }),
          { status: 200 },
        ),
      );

    const result = await fetchListData("courses", "/");
    expect(result).toEqual([{ id: "1" }, { id: "2" }]);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it("appends query params from data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    await fetchListData("students", "/", { active: "true" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/students/?active=true",
      expect.any(Object),
    );
  });

  it("throws on invalid slug", async () => {
    await expect(
      fetchListData("invalid" as any, "/"),
    ).rejects.toThrow("Invalid endpoint slug");
  });

  it("throws on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("Not Found", { status: 404, statusText: "Not Found" }),
    );

    await expect(fetchListData("courses", "/")).rejects.toThrow("Fetch failed: 404");
  });
});

describe("fetchPageData", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches a single resource", async () => {
    const mockData = { id: "1", title: "Test Course" };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const result = await fetchPageData("courses", "/1/");
    expect(result).toEqual(mockData);
  });

  it("throws on invalid slug", async () => {
    await expect(
      fetchPageData("invalid" as any, "/"),
    ).rejects.toThrow("Invalid endpoint slug");
  });
});

describe("mutateData", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends POST request with data", async () => {
    const input = { title: "New Course" };
    const output = { id: "1", title: "New Course" };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(output), { status: 201 }),
    );

    const result = await mutateData("courses", "/", "POST", input);
    expect(result).toEqual(output);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/courses/",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(input),
      }),
    );
  });

  it("handles DELETE returning 204", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(null, { status: 204 }),
    );

    const result = await mutateData("courses", "/1/", "DELETE", {});
    expect(result).toEqual({});
  });

  it("throws on error response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("Bad Request", { status: 400, statusText: "Bad Request" }),
    );

    await expect(
      mutateData("courses", "/", "POST", {}),
    ).rejects.toThrow("Fetch failed: 400");
  });
});
