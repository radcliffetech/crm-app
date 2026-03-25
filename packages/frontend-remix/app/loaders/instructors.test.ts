import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getInstructorPageData,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "./instructors";

vi.mock("~/lib/api/fetch", () => ({
  ENDPOINTS: { instructors: "http://localhost:8080/api/instructors" },
  fetchPageData: vi.fn(),
  fetchListData: vi.fn(),
  mutateData: vi.fn(),
}));

import { fetchPageData, fetchListData, mutateData } from "~/lib/api/fetch";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getInstructorPageData", () => {
  it("returns instructor with their courses", async () => {
    const instructor = { id: "1", name_first: "Luna", name_last: "Stargazer" };
    const courses = [{ id: "c1", title: "Unicorn Grooming" }];

    vi.mocked(fetchPageData).mockResolvedValueOnce(instructor);
    vi.mocked(fetchListData).mockResolvedValueOnce(courses);

    const result = await getInstructorPageData("1");
    expect(result).toEqual({ instructor, courses });
    expect(fetchPageData).toHaveBeenCalledWith("instructors", "/1/", undefined, undefined);
    expect(fetchListData).toHaveBeenCalledWith("courses", "/", { instructor_id: "1" }, undefined);
  });
});

describe("createInstructor", () => {
  it("posts instructor data", async () => {
    const input = { name_first: "New", name_last: "Instructor", email: "new@test.com", bio: "", created_at: "", updated_at: "" };
    const output = { id: "2", ...input };
    vi.mocked(mutateData).mockResolvedValueOnce(output);

    const result = await createInstructor(input);
    expect(result).toEqual(output);
  });
});

describe("updateInstructor", () => {
  it("sends PUT request", async () => {
    vi.mocked(mutateData).mockResolvedValueOnce(undefined);
    await updateInstructor("1", { name_first: "Updated", name_last: "Name", email: "a@b.com", bio: "" });
    expect(mutateData).toHaveBeenCalledWith(
      "instructors",
      "/1/",
      "PUT",
      expect.objectContaining({ name_first: "Updated" }),
      undefined,
    );
  });
});

describe("deleteInstructor", () => {
  it("sends DELETE request", async () => {
    vi.mocked(mutateData).mockResolvedValueOnce({});
    await deleteInstructor("1");
    expect(mutateData).toHaveBeenCalledWith("instructors", "/1/", "DELETE", {}, undefined);
  });
});
