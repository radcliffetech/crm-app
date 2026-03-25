import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerStudentToCourse, unregisterStudent } from "./registrations";

vi.mock("~/lib/api/fetch", () => ({
  fetchPageData: vi.fn(),
  fetchListData: vi.fn(),
  mutateData: vi.fn(),
}));

import { mutateData } from "~/lib/api/fetch";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerStudentToCourse", () => {
  it("sends registration POST", async () => {
    vi.mocked(mutateData).mockResolvedValueOnce({ id: "r1" });

    const result = await registerStudentToCourse("s1", "c1");
    expect(result).toEqual({ id: "r1" });
    expect(mutateData).toHaveBeenCalledWith("registrations", "/register/", "POST", {
      student_id: "s1",
      course_id: "c1",
    }, undefined);
  });
});

describe("unregisterStudent", () => {
  it("sends unregister POST", async () => {
    vi.mocked(mutateData).mockResolvedValueOnce({});
    const reg = {
      id: "r1",
      student_id: "s1",
      course_id: "c1",
      registered_at: "",
      payment_status: "pending" as const,
      registration_status: "registered" as const,
      is_active: true,
      created_at: "",
      updated_at: "",
    };

    await unregisterStudent(reg);
    expect(mutateData).toHaveBeenCalledWith("registrations", "/unregister/", "POST", {
      student_id: "s1",
      course_id: "c1",
    }, undefined);
  });
});
