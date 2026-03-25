import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllStudents, getStudentPageData, createStudent, deleteStudent } from "./students";

vi.mock("~/lib/api/fetch", () => ({
  fetchPageData: vi.fn(),
  fetchListData: vi.fn(),
  mutateData: vi.fn(),
}));

import { fetchPageData, fetchListData, mutateData } from "~/lib/api/fetch";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAllStudents", () => {
  it("returns list of students", async () => {
    const students = [{ id: "1", name_first: "John", name_last: "Doe" }];
    vi.mocked(fetchListData).mockResolvedValueOnce(students);

    const result = await getAllStudents();
    expect(result).toEqual(students);
    expect(fetchListData).toHaveBeenCalledWith("students", "/", undefined, undefined);
  });
});

describe("getStudentPageData", () => {
  it("returns student with registrations and courses", async () => {
    const student = { id: "1", name_first: "John" };
    const registrations = [{ id: "r1", student_id: "1", course_id: "c1" }];
    const courses = [{ id: "c1", title: "Course 1" }];

    vi.mocked(fetchPageData).mockResolvedValueOnce(student);
    vi.mocked(fetchListData)
      .mockResolvedValueOnce(registrations)
      .mockResolvedValueOnce(courses);

    const result = await getStudentPageData("1");
    expect(result.student).toEqual(student);
    expect(result.registrations).toEqual(registrations);
    expect(result.courses).toEqual(courses);
  });
});

describe("createStudent", () => {
  it("posts student data and returns result", async () => {
    const input = { name_first: "Jane", name_last: "Doe", email: "jane@test.com", phone: "", company: "", notes: "" };
    const output = { id: "2", ...input };
    vi.mocked(mutateData).mockResolvedValueOnce(output);

    const result = await createStudent(input);
    expect(result).toEqual(output);
    expect(mutateData).toHaveBeenCalledWith("students", "/", "POST", input, undefined);
  });
});

describe("deleteStudent", () => {
  it("sends DELETE request", async () => {
    vi.mocked(mutateData).mockResolvedValueOnce({});
    await deleteStudent("1");
    expect(mutateData).toHaveBeenCalledWith("students", "/1/", "DELETE", {}, undefined);
  });
});
