import { describe, it, expect, vi } from "vitest";
import { getDashboardData } from "./dashboard";

vi.mock("~/lib/api/fetch", () => ({
  fetchPageData: vi.fn(),
  fetchListData: vi.fn(),
}));

import { fetchPageData, fetchListData } from "~/lib/api/fetch";

describe("getDashboardData", () => {
  it("returns combined summary and active courses", async () => {
    vi.mocked(fetchPageData).mockResolvedValueOnce({
      studentCount: 10,
      courseCount: 5,
      instructorCount: 3,
    });
    vi.mocked(fetchListData).mockResolvedValueOnce([
      { id: "1", title: "Active Course" },
    ]);

    const result = await getDashboardData();
    expect(result).toEqual({
      studentCount: 10,
      courseCount: 5,
      instructorCount: 3,
      courses: [{ id: "1", title: "Active Course" }],
    });
    expect(fetchPageData).toHaveBeenCalledWith("org", "/dashboard-summary/", undefined, undefined);
    expect(fetchListData).toHaveBeenCalledWith("courses", "/", {
      active_courses: "true",
    }, undefined);
  });

  it("throws on fetch failure", async () => {
    vi.mocked(fetchPageData).mockRejectedValueOnce(new Error("Network error"));
    vi.mocked(fetchListData).mockResolvedValueOnce([]);

    await expect(getDashboardData()).rejects.toThrow("Network error");
  });
});
