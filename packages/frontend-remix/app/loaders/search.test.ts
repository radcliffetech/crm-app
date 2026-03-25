import { describe, it, expect, vi } from "vitest";
import { searchLoader } from "./search";

vi.mock("~/lib/api/fetch", () => ({
  fetchPageData: vi.fn(),
}));

import { fetchPageData } from "~/lib/api/fetch";

describe("searchLoader", () => {
  it("transforms API response into flat results array", async () => {
    vi.mocked(fetchPageData).mockResolvedValueOnce({
      students: [{ id: "s1", name_first: "John", name_last: "Doe" }],
      instructors: [{ id: "i1", name_first: "Luna", name_last: "Stargazer" }],
      courses: [{ id: "c1", title: "Unicorn Grooming" }],
    });

    const results = await searchLoader("test");
    expect(results).toEqual([
      { type: "Student", label: "John Doe", link: "/students/s1" },
      { type: "Instructor", label: "Luna Stargazer", link: "/instructors/i1" },
      { type: "Course", label: "Unicorn Grooming", link: "/courses/c1" },
    ]);
    expect(fetchPageData).toHaveBeenCalledWith("org", "/search?q=test", undefined, undefined);
  });

  it("returns empty array when no results", async () => {
    vi.mocked(fetchPageData).mockResolvedValueOnce({
      students: [],
      instructors: [],
      courses: [],
    });

    const results = await searchLoader("nothing");
    expect(results).toEqual([]);
  });

  it("throws on API error", async () => {
    vi.mocked(fetchPageData).mockRejectedValueOnce(new Error("API down"));
    await expect(searchLoader("test")).rejects.toThrow("API down");
  });
});
